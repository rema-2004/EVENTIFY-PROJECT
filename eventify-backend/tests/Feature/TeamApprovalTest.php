<?php

namespace Tests\Feature;

use App\Models\Competition;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\Organization;
use App\Models\Team;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TeamApprovalTest extends TestCase
{
    use RefreshDatabase;

    // ── Registrations stay pending until the organization decides ─

    public function test_creating_a_team_registers_the_leader_as_pending(): void
    {
        [$org, $event] = $this->competition();
        $leader = User::factory()->create();

        Sanctum::actingAs($leader);

        $this->postJson("/api/v1/events/{$event->slug}/teams", ['name' => 'Alpha', 'max_members' => 4])
            ->assertStatus(201)
            ->assertJsonPath('data.submission_status', 'draft');

        $this->assertSame(
            EventRegistration::STATUS_PENDING,
            EventRegistration::where('user_id', $leader->id)->value('status')
        );
    }

    public function test_the_leader_approving_a_member_does_not_confirm_their_registration(): void
    {
        [, $event] = $this->competition();
        [$leader, $member, $team] = $this->teamWithMember($event);

        $this->assertSame(
            EventRegistration::STATUS_PENDING,
            EventRegistration::where('user_id', $member->id)->value('status')
        );
        $this->assertSame(
            TeamMember::STATUS_APPROVED,
            TeamMember::where('user_id', $member->id)->value('status')
        );
    }

    // ── Submitting the team ───────────────────────────────────

    public function test_a_team_below_the_minimum_size_cannot_be_submitted(): void
    {
        [, $event] = $this->competition(['min_team_size' => 2, 'max_team_size' => 4]);
        $leader = User::factory()->create();
        $team = $this->createTeam($leader, $event);

        Sanctum::actingAs($leader);

        $this->postJson("/api/v1/teams/{$team['id']}/submit")->assertStatus(422);
    }

    public function test_a_team_with_pending_join_requests_cannot_be_submitted(): void
    {
        [, $event] = $this->competition();
        [$leader, , $team] = $this->teamWithMember($event);

        Sanctum::actingAs(User::factory()->create());
        $this->postJson("/api/v1/teams/{$team->id}/join")->assertStatus(201);

        Sanctum::actingAs($leader);
        $this->postJson("/api/v1/teams/{$team->id}/submit")
            ->assertStatus(422)
            ->assertJsonPath('message', 'Respond to all pending join requests before submitting the team.');
    }

    public function test_only_the_leader_can_submit_the_team(): void
    {
        [, $event] = $this->competition();
        [, $member, $team] = $this->teamWithMember($event);

        Sanctum::actingAs($member);

        $this->postJson("/api/v1/teams/{$team->id}/submit")->assertStatus(403);
    }

    public function test_submitting_locks_the_team_and_notifies_the_organization(): void
    {
        [$org, $event] = $this->competition();
        [$leader, , $team] = $this->teamWithMember($event);

        Sanctum::actingAs($leader);

        $this->postJson("/api/v1/teams/{$team->id}/submit")
            ->assertOk()
            ->assertJsonPath('data.submission_status', 'submitted');

        // Second submit is refused.
        $this->postJson("/api/v1/teams/{$team->id}/submit")->assertStatus(422);

        // The organization was told.
        $this->assertSame('team_submitted', $org->notifications()->first()->data['kind']);

        // New members cannot join a submitted team.
        Sanctum::actingAs(User::factory()->create());
        $this->postJson("/api/v1/teams/{$team->id}/join")->assertStatus(422);
    }

    public function test_a_member_cannot_leave_while_the_team_is_under_review(): void
    {
        [, $event] = $this->competition();
        [$leader, $member, $team] = $this->teamWithMember($event);
        $this->submit($leader, $team);

        Sanctum::actingAs($member);

        $this->deleteJson("/api/v1/events/{$event->slug}/register")->assertStatus(422);
    }

    // ── Organization reviews the whole team ───────────────────

    public function test_the_organization_sees_only_submitted_teams(): void
    {
        [$org, $event] = $this->competition();
        [$leader, , $submitted] = $this->teamWithMember($event);
        $this->submit($leader, $submitted);

        // A second team that stays a draft.
        $this->createTeam(User::factory()->create(), $event, 'Draft team');

        Sanctum::actingAs($org, ['*'], 'organization');

        $response = $this->getJson("/api/v1/org/events/{$event->slug}/teams")->assertOk();

        $this->assertCount(1, $response->json('data'));
        $this->assertSame($submitted->id, $response->json('data.0.id'));
        $this->assertCount(2, $response->json('data.0.members'));
    }

    public function test_approving_a_team_confirms_every_member_and_notifies_each_one(): void
    {
        [$org, $event] = $this->competition();
        [$leader, $member, $team] = $this->teamWithMember($event);
        $this->submit($leader, $team);

        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson("/api/v1/org/events/{$event->slug}/teams/{$team->id}/approve")
            ->assertOk()
            ->assertJsonPath('data.submission_status', 'approved');

        foreach ([$leader, $member] as $user) {
            $this->assertSame(
                EventRegistration::STATUS_CONFIRMED,
                EventRegistration::where('user_id', $user->id)->value('status')
            );
            $this->assertSame('team_approved', $user->notifications()->first()->data['kind']);
            $this->assertCount(1, $user->notifications);
        }

        // Deciding twice is refused.
        $this->patchJson("/api/v1/org/events/{$event->slug}/teams/{$team->id}/approve")->assertStatus(422);
    }

    public function test_rejecting_a_team_needs_a_reason_and_lets_the_leader_resubmit(): void
    {
        [$org, $event] = $this->competition();
        [$leader, $member, $team] = $this->teamWithMember($event);
        $this->submit($leader, $team);

        Sanctum::actingAs($org, ['*'], 'organization');
        $url = "/api/v1/org/events/{$event->slug}/teams/{$team->id}/reject";

        $this->patchJson($url, [])->assertStatus(422);

        $this->patchJson($url, ['reason' => 'Please add a data scientist.'])
            ->assertOk()
            ->assertJsonPath('data.submission_status', 'rejected')
            ->assertJsonPath('data.rejection_reason', 'Please add a data scientist.');

        // Registrations stay pending, members are told why.
        $this->assertSame(
            EventRegistration::STATUS_PENDING,
            EventRegistration::where('user_id', $member->id)->value('status')
        );
        $notification = $member->notifications()->first();
        $this->assertSame('team_rejected', $notification->data['kind']);
        $this->assertStringContainsString('Please add a data scientist.', $notification->data['message']);

        // The leader fixes the team and submits again.
        Sanctum::actingAs($leader);
        $this->postJson("/api/v1/teams/{$team->id}/submit")
            ->assertOk()
            ->assertJsonPath('data.submission_status', 'submitted')
            ->assertJsonPath('data.rejection_reason', null);
    }

    public function test_a_rejected_team_can_recruit_again_and_be_resubmitted(): void
    {
        [$org, $event] = $this->competition();
        [$leader, , $team] = $this->teamWithMember($event);
        $this->submit($leader, $team);

        // While under review the team is not in the "available teams" list.
        Sanctum::actingAs(User::factory()->create());
        $this->assertSame([], $this->getJson("/api/v1/events/{$event->slug}/teams")->json('data'));

        Sanctum::actingAs($org, ['*'], 'organization');
        $this->patchJson(
            "/api/v1/org/events/{$event->slug}/teams/{$team->id}/reject",
            ['reason' => 'Please add one more member.']
        )->assertOk();

        // After the rejection it is listed again and accepts a new member.
        $newcomer = User::factory()->create();
        Sanctum::actingAs($newcomer);

        $list = $this->getJson("/api/v1/events/{$event->slug}/teams")->assertOk();
        $this->assertSame([$team->id], collect($list->json('data'))->pluck('id')->all());

        $this->postJson("/api/v1/teams/{$team->id}/join")->assertStatus(201);

        $request = TeamMember::where('user_id', $newcomer->id)->first();

        Sanctum::actingAs($leader);
        $this->patchJson("/api/v1/teams/{$team->id}/requests/{$request->id}", ['action' => 'approve'])->assertOk();
        $this->postJson("/api/v1/teams/{$team->id}/submit")
            ->assertOk()
            ->assertJsonPath('data.approved_members_count', 3);
    }

    public function test_a_full_rejected_team_stays_closed_to_new_members(): void
    {
        [$org, $event] = $this->competition();
        [$leader, , $team] = $this->teamWithMember($event);

        // The team has exactly as many members as it allows.
        $team->update(['max_members' => 2]);
        $this->submit($leader, $team);

        Sanctum::actingAs($org, ['*'], 'organization');
        $this->patchJson(
            "/api/v1/org/events/{$event->slug}/teams/{$team->id}/reject",
            ['reason' => 'Please rename the team.']
        )->assertOk();

        $this->assertFalse($team->fresh()->is_recruiting);
    }

    public function test_a_draft_team_cannot_be_approved(): void
    {
        [$org, $event] = $this->competition();
        $team = Team::find($this->createTeam(User::factory()->create(), $event)['id']);

        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson("/api/v1/org/events/{$event->slug}/teams/{$team->id}/approve")->assertStatus(422);
    }

    public function test_another_organization_cannot_review_the_team(): void
    {
        [, $event] = $this->competition();
        [$leader, , $team] = $this->teamWithMember($event);
        $this->submit($leader, $team);

        Sanctum::actingAs($this->makeOrganization(), ['*'], 'organization');

        $this->getJson("/api/v1/org/events/{$event->slug}/teams")->assertStatus(403);
        $this->patchJson("/api/v1/org/events/{$event->slug}/teams/{$team->id}/approve")->assertStatus(403);
    }

    public function test_a_team_of_another_event_is_not_found_under_this_event(): void
    {
        [$org, $event] = $this->competition();
        [, $other] = $this->competition([], $org);
        [$leader, , $team] = $this->teamWithMember($other);
        $this->submit($leader, $team);

        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson("/api/v1/org/events/{$event->slug}/teams/{$team->id}/approve")->assertStatus(404);
    }

    public function test_a_student_cannot_use_the_team_review_routes(): void
    {
        [, $event] = $this->competition();

        Sanctum::actingAs(User::factory()->create());

        $this->getJson("/api/v1/org/events/{$event->slug}/teams")->assertStatus(401);
    }

    // ── Individual approval notifies the student ──────────────

    public function test_approving_and_rejecting_an_applicant_notifies_the_student(): void
    {
        $org = $this->makeOrganization();
        $workshop = $this->makeEvent($org, ['type' => Event::TYPE_WORKSHOP]);
        $approved = User::factory()->create();
        $rejected = User::factory()->create();

        $regA = EventRegistration::create(['event_id' => $workshop->id, 'user_id' => $approved->id, 'status' => 'pending']);
        $regB = EventRegistration::create(['event_id' => $workshop->id, 'user_id' => $rejected->id, 'status' => 'pending']);

        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson("/api/v1/org/events/{$workshop->slug}/registrations/{$regA->id}/approve")->assertOk();
        $this->patchJson("/api/v1/org/events/{$workshop->slug}/registrations/{$regB->id}/reject", ['reason' => 'The workshop is full.'])->assertOk();

        $this->assertSame('registration_approved', $approved->notifications()->first()->data['kind']);
        $this->assertSame('registration_rejected', $rejected->notifications()->first()->data['kind']);
    }

    // ── Leadership transfer ───────────────────────────────────

    public function test_the_leader_can_hand_the_leadership_to_an_approved_member(): void
    {
        [, $event] = $this->competition();
        [$leader, $member, $team] = $this->teamWithMember($event);

        Sanctum::actingAs($leader);

        $this->patchJson("/api/v1/teams/{$team->id}/leader", ['user_id' => $member->id])
            ->assertOk()
            ->assertJsonPath('data.leader.id', $member->id);

        $this->assertSame($member->id, $team->fresh()->created_by);
        $this->assertSame('leader', TeamMember::where('user_id', $member->id)->value('role'));
        $this->assertSame('member', TeamMember::where('user_id', $leader->id)->value('role'));
        $this->assertSame('team_leader_changed', $member->notifications()->first()->data['kind']);

        // The old leader is now an ordinary member: no longer leader-only routes,
        // and free to leave.
        $this->postJson("/api/v1/teams/{$team->id}/submit")->assertStatus(403);
        $this->deleteJson("/api/v1/events/{$event->slug}/register")->assertOk();
    }

    public function test_the_leadership_cannot_go_to_someone_outside_the_team(): void
    {
        [, $event] = $this->competition();
        [$leader, , $team] = $this->teamWithMember($event);
        $outsider = User::factory()->create();

        Sanctum::actingAs($leader);

        $this->patchJson("/api/v1/teams/{$team->id}/leader", ['user_id' => $outsider->id])->assertStatus(422);
        $this->patchJson("/api/v1/teams/{$team->id}/leader", ['user_id' => $leader->id])->assertStatus(422);
        $this->patchJson("/api/v1/teams/{$team->id}/leader", [])->assertStatus(422);
    }

    public function test_only_the_leader_can_transfer_the_leadership(): void
    {
        [, $event] = $this->competition();
        [$leader, $member, $team] = $this->teamWithMember($event);

        Sanctum::actingAs($member);

        $this->patchJson("/api/v1/teams/{$team->id}/leader", ['user_id' => $leader->id])->assertStatus(403);
    }

    // ── helpers ───────────────────────────────────────────────

    /**
     * Returns [organization, event].
     *
     * @param  array<string, mixed>  $participation
     * @return array<int, mixed>
     */
    private function competition(array $participation = [], ?Organization $org = null): array
    {
        $org ??= $this->makeOrganization();
        $title = 'Hack ' . Str::random(6);

        $event = Event::create([
            'organization_id' => $org->id,
            'title' => $title,
            'slug' => Str::slug($title) . '-' . Str::lower(Str::random(5)),
            'description' => 'A test competition.',
            'type' => Event::TYPE_COMPETITION,
            'status' => Event::STATUS_PUBLISHED,
        ]);

        Competition::create(array_merge(
            ['id' => $event->id, 'participation_type' => 'both', 'min_team_size' => 2, 'max_team_size' => 4],
            $participation
        ));

        return [$org, $event];
    }

    private function makeEvent(Organization $org, array $overrides = []): Event
    {
        $title = 'Event ' . Str::random(6);

        return Event::create(array_merge([
            'organization_id' => $org->id,
            'title' => $title,
            'slug' => Str::slug($title) . '-' . Str::lower(Str::random(5)),
            'description' => 'A test event.',
            'type' => Event::TYPE_WORKSHOP,
            'status' => Event::STATUS_PUBLISHED,
        ], $overrides));
    }

    private function makeOrganization(): Organization
    {
        return Organization::create([
            'name' => 'Org ' . Str::random(5),
            'slug' => 'org-' . Str::lower(Str::random(6)),
            'email' => Str::lower(Str::random(8)) . '@example.com',
            'password' => 'Password123',
            'status' => Organization::STATUS_APPROVED,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function createTeam(User $leader, Event $event, string $name = 'Alpha'): array
    {
        Sanctum::actingAs($leader);

        return $this->postJson("/api/v1/events/{$event->slug}/teams", ['name' => $name, 'max_members' => 4])
            ->assertStatus(201)
            ->json('data');
    }

    /**
     * A team of two: the leader plus one member the leader approved.
     *
     * Returns [leader, member, team].
     *
     * @return array<int, mixed>
     */
    private function teamWithMember(Event $event): array
    {
        $leader = User::factory()->create();
        $member = User::factory()->create();
        $team = Team::find($this->createTeam($leader, $event)['id']);

        Sanctum::actingAs($member);
        $this->postJson("/api/v1/teams/{$team->id}/join")->assertStatus(201);

        $request = TeamMember::where('user_id', $member->id)->first();

        Sanctum::actingAs($leader);
        $this->patchJson("/api/v1/teams/{$team->id}/requests/{$request->id}", ['action' => 'approve'])->assertOk();

        return [$leader, $member, $team];
    }

    private function submit(User $leader, Team $team): void
    {
        Sanctum::actingAs($leader);
        $this->postJson("/api/v1/teams/{$team->id}/submit")->assertOk();
    }
}