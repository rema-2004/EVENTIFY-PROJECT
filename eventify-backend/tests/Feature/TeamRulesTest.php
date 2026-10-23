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

class TeamRulesTest extends TestCase
{
    use RefreshDatabase;

    // ── Team registrations belong to the team leader ──────────

    public function test_organization_cannot_approve_or_reject_a_team_members_registration(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeCompetition($org, ['participation_type' => 'team', 'min_team_size' => 2, 'max_team_size' => 4]);
        $team = $this->makeTeam($event, User::factory()->create());

        $member = User::factory()->create();
        TeamMember::create([
            'team_id' => $team->id,
            'user_id' => $member->id,
            'role' => TeamMember::ROLE_MEMBER,
            'status' => TeamMember::STATUS_PENDING,
        ]);
        $registration = EventRegistration::create([
            'event_id' => $event->id,
            'user_id' => $member->id,
            'team_id' => $team->id,
            'status' => EventRegistration::STATUS_PENDING,
        ]);

        Sanctum::actingAs($org, ['*'], 'organization');

        $base = "/api/v1/org/events/{$event->slug}/registrations/{$registration->id}";

        $this->patchJson("{$base}/approve")->assertStatus(422);
        $this->patchJson("{$base}/reject", ['reason' => 'No'])->assertStatus(422);

        $this->assertSame(EventRegistration::STATUS_PENDING, $registration->fresh()->status);
    }

    public function test_organization_can_still_approve_a_solo_registration(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeCompetition($org, ['participation_type' => 'both', 'min_team_size' => 2, 'max_team_size' => 4]);
        $student = User::factory()->create();
        $registration = EventRegistration::create([
            'event_id' => $event->id,
            'user_id' => $student->id,
            'status' => EventRegistration::STATUS_PENDING,
        ]);

        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson("/api/v1/org/events/{$event->slug}/registrations/{$registration->id}/approve")
            ->assertOk();
    }

    // ── Participation rules apply to teams ────────────────────

    public function test_a_team_cannot_be_created_for_a_solo_only_competition(): void
    {
        $event = $this->makeCompetition($this->makeOrganization(), ['participation_type' => 'solo']);

        Sanctum::actingAs(User::factory()->create());

        $this->postJson("/api/v1/events/{$event->slug}/teams", ['name' => 'Alpha', 'max_members' => 3])
            ->assertStatus(422);

        $this->assertDatabaseCount('teams', 0);
    }

    public function test_the_team_capacity_must_respect_the_competition_limits(): void
    {
        $event = $this->makeCompetition(
            $this->makeOrganization(),
            ['participation_type' => 'team', 'min_team_size' => 2, 'max_team_size' => 4]
        );

        Sanctum::actingAs(User::factory()->create());

        $this->postJson("/api/v1/events/{$event->slug}/teams", ['name' => 'Too big', 'max_members' => 5])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['max_members'], 'errors');

        $this->postJson("/api/v1/events/{$event->slug}/teams", ['name' => 'Fits', 'max_members' => 4])
            ->assertStatus(201);
    }

    public function test_a_competition_without_limits_accepts_any_valid_team_capacity(): void
    {
        $event = $this->makeCompetition($this->makeOrganization(), []);

        Sanctum::actingAs(User::factory()->create());

        $this->postJson("/api/v1/events/{$event->slug}/teams", ['name' => 'Open', 'max_members' => 10])
            ->assertStatus(201);
    }

    public function test_joining_a_team_is_refused_when_the_competition_is_solo_only(): void
    {
        $event = $this->makeCompetition($this->makeOrganization(), ['participation_type' => 'both']);
        $team = $this->makeTeam($event, User::factory()->create());

        // The organization later switches the competition to solo only.
        Competition::find($event->id)->update(['participation_type' => 'solo']);

        Sanctum::actingAs(User::factory()->create());

        $this->postJson("/api/v1/teams/{$team->id}/join")->assertStatus(422);
    }

    // ── Rate limit on sensitive routes ────────────────────────

    public function test_login_is_rate_limited(): void
    {
        config(['eventify.auth_throttle_per_minute' => 2]);

        for ($i = 0; $i < 2; $i++) {
            $this->postJson('/api/v1/login', ['email' => 'x@example.com', 'password' => 'wrong'])
                ->assertStatus(401);
        }

        $this->postJson('/api/v1/login', ['email' => 'x@example.com', 'password' => 'wrong'])
            ->assertStatus(429);
    }

    public function test_changing_the_password_is_rate_limited(): void
    {
        config(['eventify.auth_throttle_per_minute' => 2]);

        Sanctum::actingAs(User::factory()->create());

        for ($i = 0; $i < 2; $i++) {
            $this->patchJson('/api/v1/password', [])->assertStatus(422);
        }

        $this->patchJson('/api/v1/password', [])->assertStatus(429);
    }

    // ── helpers ───────────────────────────────────────────────

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
     * @param  array<string, mixed>  $participation
     */
    private function makeCompetition(Organization $org, array $participation): Event
    {
        $title = 'Hack ' . Str::random(6);

        $event = Event::create([
            'organization_id' => $org->id,
            'title' => $title,
            'slug' => Str::slug($title) . '-' . Str::lower(Str::random(5)),
            'description' => 'A test competition.',
            'type' => Event::TYPE_COMPETITION,
            'status' => Event::STATUS_PUBLISHED,
        ]);

        Competition::create(array_merge(['id' => $event->id], $participation));

        return $event;
    }

    private function makeTeam(Event $event, User $leader): Team
    {
        $team = Team::create([
            'event_id' => $event->id,
            'created_by' => $leader->id,
            'name' => 'Team ' . Str::random(4),
            'max_members' => 4,
            'is_recruiting' => true,
            'status' => Team::STATUS_OPEN,
        ]);

        TeamMember::create([
            'team_id' => $team->id,
            'user_id' => $leader->id,
            'role' => TeamMember::ROLE_LEADER,
            'status' => TeamMember::STATUS_APPROVED,
        ]);

        EventRegistration::create([
            'event_id' => $event->id,
            'user_id' => $leader->id,
            'team_id' => $team->id,
            'status' => EventRegistration::STATUS_CONFIRMED,
        ]);

        return $team;
    }
}
