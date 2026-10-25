<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrgDashboardActivityTest extends TestCase
{
    use RefreshDatabase;

    private const URL = '/api/v1/org/dashboard';

    /**
     * The clock is frozen (Wednesday 21 Oct 2026, 12:00) so "2 hours ago"
     * style texts are predictable.
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->travelTo(Carbon::parse('2026-10-21 12:00:00'));
    }

    // -- Top events --------------------------------------------

    public function test_top_events_rank_by_applicants_with_a_score_out_of_100(): void
    {
        $org = $this->makeOrganization();

        $alpha = $this->makeLive($org, ['title' => 'Alpha']);
        $bravo = $this->makeEnded($org, ['title' => 'Bravo']);
        $charlie = $this->makeUpcoming($org, ['title' => 'Charlie']);
        $delta = $this->makeLive($org, ['title' => 'Delta']);

        $this->addRegistrations($alpha, EventRegistration::STATUS_CONFIRMED, 6);
        $this->addRegistrations($bravo, EventRegistration::STATUS_PENDING, 4);
        $this->addRegistrations($charlie, EventRegistration::STATUS_REJECTED, 3);
        $this->addRegistrations($delta, EventRegistration::STATUS_CONFIRMED, 2);

        $top = $this->dashboard($org)['topEvents'];

        // Only the 3 busiest: Delta (2 applicants) is left out.
        $this->assertSame([
            ['rank' => 1, 'name' => 'Alpha', 'image' => null, 'applicants' => 6, 'rating' => null, 'score' => 100],
            ['rank' => 2, 'name' => 'Bravo', 'image' => null, 'applicants' => 4, 'rating' => null, 'score' => 67],
            ['rank' => 3, 'name' => 'Charlie', 'image' => null, 'applicants' => 3, 'rating' => null, 'score' => 50],
        ], $top);
    }

    public function test_top_events_skip_events_without_applicants_and_unpublished_ones(): void
    {
        $org = $this->makeOrganization();

        $this->makeLive($org, ['title' => 'Quiet']);

        $onlyCancelled = $this->makeLive($org, ['title' => 'Only Cancelled']);
        $this->addRegistrations($onlyCancelled, EventRegistration::STATUS_CANCELLED, 3);

        $waiting = $this->makeEvent($org, [
            'title' => 'Waiting',
            'status' => Event::STATUS_PENDING_REVIEW,
            'start_date' => now()->addDays(5),
            'end_date' => now()->addDays(6),
        ]);
        $this->addRegistrations($waiting, EventRegistration::STATUS_PENDING, 5);

        $real = $this->makeEnded($org, ['title' => 'Real']);
        $this->addRegistrations($real, EventRegistration::STATUS_PENDING, 1);

        $top = $this->dashboard($org)['topEvents'];

        $this->assertSame(['Real'], array_column($top, 'name'));
        $this->assertSame([100], array_column($top, 'score'));
    }

    // -- Recent applicants -------------------------------------

    public function test_recent_applicants_are_the_latest_5_with_the_frontend_shape(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeLive($org, ['title' => 'Hack Night']);

        $statuses = [
            1 => EventRegistration::STATUS_CONFIRMED,
            2 => EventRegistration::STATUS_PENDING,
            3 => EventRegistration::STATUS_REJECTED,
            4 => EventRegistration::STATUS_PENDING,
            5 => EventRegistration::STATUS_PENDING,
            6 => EventRegistration::STATUS_PENDING,
        ];

        foreach ($statuses as $hours => $status) {
            $this->addRegistration($event, $status, now()->subHours($hours), $this->makeStudent("Student {$hours}"));
        }

        // Newest of all, but cancelled: never shown.
        $this->addRegistration(
            $event,
            EventRegistration::STATUS_CANCELLED,
            now()->subMinutes(10),
            $this->makeStudent('Student Cancelled')
        );

        $rows = $this->dashboard($org)['recentApplicants'];

        $this->assertCount(5, $rows);
        $this->assertSame(['name', 'event', 'applied', 'status'], array_keys($rows[0]));

        $this->assertSame(
            ['Student 1', 'Student 2', 'Student 3', 'Student 4', 'Student 5'],
            array_column($rows, 'name')
        );
        $this->assertSame(
            ['1 hour ago', '2 hours ago', '3 hours ago', '4 hours ago', '5 hours ago'],
            array_column($rows, 'applied')
        );
        // A confirmed registration is called "approved" by the frontend.
        $this->assertSame(
            ['approved', 'pending', 'rejected', 'pending', 'pending'],
            array_column($rows, 'status')
        );
        $this->assertSame(array_fill(0, 5, 'Hack Night'), array_column($rows, 'event'));
    }

    public function test_recent_applicants_only_include_this_organizations_events(): void
    {
        $org = $this->makeOrganization();
        $other = $this->makeOrganization('other@example.com', 'other-organization');

        $mine = $this->makeLive($org, ['title' => 'Mine']);
        $theirs = $this->makeLive($other, ['title' => 'Theirs']);

        $this->addRegistration($mine, EventRegistration::STATUS_PENDING, now()->subHours(3), $this->makeStudent('Insider'));
        $this->addRegistration($theirs, EventRegistration::STATUS_PENDING, now()->subMinute(), $this->makeStudent('Outsider'));

        $rows = $this->dashboard($org)['recentApplicants'];

        $this->assertSame(['Insider'], array_column($rows, 'name'));
    }

    // -- Recent activity ---------------------------------------

    public function test_recent_activity_shows_audit_log_rows_of_the_organizations_events(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeLive($org, ['title' => 'Hack Night']);
        // Rejected events are not on the dashboard, but their rejection is
        // still news for the organization.
        $oldIdea = $this->makeEvent($org, ['title' => 'Old Idea', 'status' => Event::STATUS_REJECTED]);
        $sara = $this->makeStudent('Sara');

        $this->log(AuditLog::TYPE_CREATE, 'Registered for Event', $sara, $event, now()->subHours(2));
        $this->log(AuditLog::TYPE_APPROVE, 'Approved Applicant', $org, $event, now()->subHour());
        $this->log(AuditLog::TYPE_REJECT, 'Rejected Applicant', $org, $event, now()->subMinutes(30));
        $this->log(AuditLog::TYPE_APPROVE, 'Approved Event', null, $event, now()->subMinutes(10));
        $this->log(AuditLog::TYPE_REJECT, 'Rejected Event', null, $oldIdea, now()->subHours(3));

        $activity = $this->dashboard($org)['recentActivity'];

        $this->assertSame([
            ['type' => 'publish', 'icon' => 'campaign', 'text' => 'Hack Night was approved and published', 'time' => '10 minutes ago'],
            ['type' => 'rejection', 'icon' => 'cancel', 'text' => 'An application to Hack Night was rejected', 'time' => '30 minutes ago'],
            ['type' => 'approval', 'icon' => 'check_circle', 'text' => 'An application to Hack Night was approved', 'time' => '1 hour ago'],
            ['type' => 'applicant', 'icon' => 'person_add', 'text' => 'Sara applied to Hack Night', 'time' => '2 hours ago'],
            ['type' => 'rejection', 'icon' => 'cancel', 'text' => 'Old Idea was rejected by the admin', 'time' => '3 hours ago'],
        ], $activity);
    }

    public function test_recent_activity_shows_only_the_latest_5(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeLive($org, ['title' => 'Hack Night']);

        for ($i = 1; $i <= 7; $i++) {
            $this->log(
                AuditLog::TYPE_CREATE,
                'Registered for Event',
                $this->makeStudent("Student {$i}"),
                $event,
                now()->subMinutes($i)
            );
        }

        $activity = $this->dashboard($org)['recentActivity'];

        $this->assertSame([
            'Student 1 applied to Hack Night',
            'Student 2 applied to Hack Night',
            'Student 3 applied to Hack Night',
            'Student 4 applied to Hack Night',
            'Student 5 applied to Hack Night',
        ], array_column($activity, 'text'));
    }

    public function test_recent_activity_ignores_other_actions_other_events_and_failed_rows(): void
    {
        $org = $this->makeOrganization();
        $other = $this->makeOrganization('other@example.com', 'other-organization');

        $mine = $this->makeLive($org, ['title' => 'Hack Night']);
        $theirs = $this->makeLive($other, ['title' => 'Their Event']);
        $sara = $this->makeStudent('Sara');

        // The only row that belongs here.
        $this->log(AuditLog::TYPE_CREATE, 'Registered for Event', $sara, $mine, now()->subMinutes(5));

        // Actions that are not part of the list.
        $this->log(AuditLog::TYPE_UPDATE, 'Updated Event', $org, $mine, now()->subMinutes(4));
        $this->log(AuditLog::TYPE_CREATE, 'Created Event', $org, $mine, now()->subMinutes(3));

        // Another organization's event.
        $this->log(AuditLog::TYPE_CREATE, 'Registered for Event', $sara, $theirs, now()->subMinutes(2));

        // A failed attempt.
        $this->log(AuditLog::TYPE_CREATE, 'Registered for Event', $sara, $mine, now()->subMinute(), AuditLog::STATUS_FAILED);

        $activity = $this->dashboard($org)['recentActivity'];

        $this->assertSame(['Sara applied to Hack Night'], array_column($activity, 'text'));
    }

    public function test_real_actions_show_up_in_recent_activity(): void
    {
        // Goes through the real endpoints, so this also proves the action
        // names the dashboard reads are the ones the other controllers write.
        Mail::fake();

        $org = $this->makeOrganization();
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);

        $event = $this->makeLive($org, ['title' => 'Hack Night']);
        $pendingIdea = $this->makeEvent($org, [
            'title' => 'Pending Idea',
            'status' => Event::STATUS_PENDING_REVIEW,
        ]);
        $weakIdea = $this->makeEvent($org, [
            'title' => 'Weak Idea',
            'status' => Event::STATUS_PENDING_REVIEW,
        ]);

        $sara = $this->makeStudent('Sara');
        $omar = $this->makeStudent('Omar');

        // 1 and 2: two students apply.
        Sanctum::actingAs($sara);
        $this->postJson("/api/v1/events/{$event->slug}/register")->assertStatus(201);

        Sanctum::actingAs($omar);
        $this->postJson("/api/v1/events/{$event->slug}/register")->assertStatus(201);

        $saraRegistration = EventRegistration::where('user_id', $sara->id)->firstOrFail();
        $omarRegistration = EventRegistration::where('user_id', $omar->id)->firstOrFail();

        // 3 and 4: the organization approves one and rejects the other.
        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson("/api/v1/org/events/{$event->slug}/registrations/{$saraRegistration->id}/approve")
            ->assertOk();
        $this->patchJson("/api/v1/org/events/{$event->slug}/registrations/{$omarRegistration->id}/reject", [
            'reason' => 'Not a good fit for this event.',
        ])->assertOk();

        // 5 and 6: the admin approves one event and rejects the other.
        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/admin/events/{$pendingIdea->slug}/approve")->assertOk();
        $this->patchJson("/api/v1/admin/events/{$weakIdea->slug}/reject", [
            'admin_notes' => 'Needs more detail.',
        ])->assertOk();

        Sanctum::actingAs($org, ['*'], 'organization');

        $activity = $this->getJson(self::URL)->assertOk()->json('data.recentActivity');

        // 6 things happened at the same frozen second: the latest 5 are
        // shown, newest first.
        $this->assertSame([
            'Weak Idea was rejected by the admin',
            'Pending Idea was approved and published',
            'An application to Hack Night was rejected',
            'An application to Hack Night was approved',
            'Omar applied to Hack Night',
        ], array_column($activity, 'text'));

        foreach ($activity as $item) {
            $this->assertIsString($item['time']);
        }
    }

    // -- Nothing to show ---------------------------------------

    public function test_the_three_sections_are_empty_when_there_is_nothing_yet(): void
    {
        // An organization with no events at all.
        $empty = $this->makeOrganization();

        $data = $this->dashboard($empty);

        $this->assertSame([], $data['topEvents']);
        $this->assertSame([], $data['recentApplicants']);
        $this->assertSame([], $data['recentActivity']);

        // An organization with an event, but no applications and no log rows.
        $org = $this->makeOrganization('second@example.com', 'second-organization');
        $this->makeLive($org);

        $data = $this->dashboard($org);

        $this->assertSame([], $data['topEvents']);
        $this->assertSame([], $data['recentApplicants']);
        $this->assertSame([], $data['recentActivity']);
    }

    // -- Helpers -----------------------------------------------

    /**
     * Calls the dashboard as the organization and returns "data".
     *
     * @return array<string, mixed>
     */
    private function dashboard(Organization $org): array
    {
        Sanctum::actingAs($org, ['*'], 'organization');

        return $this->getJson(self::URL)->assertOk()->json('data');
    }

    private function makeOrganization(
        string $email = 'org@example.com',
        string $slug = 'test-organization'
    ): Organization {
        return Organization::create([
            'name' => 'Test Organization',
            'slug' => $slug,
            'email' => $email,
            'password' => 'Password123',
            'status' => Organization::STATUS_APPROVED,
        ]);
    }

    private function makeStudent(string $name): User
    {
        return User::factory()->create(['name' => $name]);
    }

    /**
     * A published workshop with no dates, unless overridden.
     *
     * @param  array<string, mixed>  $overrides
     */
    private function makeEvent(Organization $org, array $overrides = []): Event
    {
        $title = $overrides['title'] ?? 'Event ' . Str::random(6);

        return Event::create(array_merge([
            'organization_id' => $org->id,
            'title' => $title,
            'slug' => Str::slug($title) . '-' . Str::lower(Str::random(5)),
            'description' => 'A test event.',
            'type' => Event::TYPE_WORKSHOP,
            'status' => Event::STATUS_PUBLISHED,
        ], $overrides));
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    private function makeLive(Organization $org, array $overrides = []): Event
    {
        return $this->makeEvent($org, array_merge([
            'start_date' => now()->subDay(),
            'end_date' => now()->addDay(),
        ], $overrides));
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    private function makeUpcoming(Organization $org, array $overrides = []): Event
    {
        return $this->makeEvent($org, array_merge([
            'start_date' => now()->addDays(5),
            'end_date' => now()->addDays(6),
        ], $overrides));
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    private function makeEnded(Organization $org, array $overrides = []): Event
    {
        return $this->makeEvent($org, array_merge([
            'start_date' => now()->subDays(5),
            'end_date' => now()->subDays(4),
        ], $overrides));
    }

    /**
     * One application, made at the given time (by a new student unless
     * one is given).
     */
    private function addRegistration(Event $event, string $status, Carbon $at, ?User $student = null): void
    {
        EventRegistration::create([
            'event_id' => $event->id,
            'user_id' => ($student ?? User::factory()->create())->id,
            'status' => $status,
            'registered_at' => $at,
        ]);
    }

    /**
     * Several applications with the same status, each by a new student.
     */
    private function addRegistrations(Event $event, string $status, int $count): void
    {
        for ($i = 0; $i < $count; $i++) {
            $this->addRegistration($event, $status, now()->subDay());
        }
    }

    /**
     * Writes an audit log row about an event, then sets its time (the
     * model does not let a row be edited, so it goes through the table).
     */
    private function log(
        string $type,
        string $action,
        ?Model $actor,
        Model $target,
        Carbon $at,
        string $status = AuditLog::STATUS_SUCCESS
    ): void {
        $log = AuditLog::record(
            type: $type,
            action: $action,
            location: AuditLog::LOCATION_EVENTS,
            actor: $actor,
            target: $target,
            status: $status,
        );

        DB::table('audit_logs')->where('id', $log->id)->update(['created_at' => $at]);
    }
}