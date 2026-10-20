<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrgDashboardTest extends TestCase
{
    use RefreshDatabase;

    private const URL = '/api/v1/org/dashboard';

    // -- Numbers -----------------------------------------------

    public function test_numbers_add_up_across_several_events(): void
    {
        $org = $this->makeOrganization();

        $live = $this->makeLive($org, ['title' => 'Live Workshop']);
        $upcoming = $this->makeUpcoming($org, [
            'title' => 'Upcoming Competition',
            'type' => Event::TYPE_COMPETITION,
        ]);
        $ended = $this->makeEnded($org, [
            'title' => 'Ended Course',
            'type' => Event::TYPE_COURSE,
        ]);

        // Cancelled registrations are never counted.
        $this->addRegistrations($live, [
            EventRegistration::STATUS_CONFIRMED => 2,
            EventRegistration::STATUS_PENDING => 1,
            EventRegistration::STATUS_REJECTED => 1,
            EventRegistration::STATUS_CANCELLED => 1,
        ]);
        $this->addRegistrations($upcoming, [
            EventRegistration::STATUS_CONFIRMED => 1,
            EventRegistration::STATUS_PENDING => 2,
        ]);
        $this->addRegistrations($ended, [
            EventRegistration::STATUS_CONFIRMED => 3,
            EventRegistration::STATUS_PENDING => 2,
        ]);

        Sanctum::actingAs($org, ['*'], 'organization');

        $response = $this->getJson(self::URL)
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertEquals(
            ['approved' => 6, 'pending' => 5, 'rejected' => 1],
            $response->json('data.applicationStatus')
        );

        $this->assertEquals([
            ['name' => 'Event', 'count' => 0],
            ['name' => 'Workshop', 'count' => 1],
            ['name' => 'Competition', 'count' => 1],
            ['name' => 'Course', 'count' => 1],
        ], $response->json('data.categories'));

        // Busiest first.
        $this->assertEquals([
            ['name' => 'Ended Course', 'applicants' => 5, 'approved' => 3, 'pending' => 2],
            ['name' => 'Live Workshop', 'applicants' => 4, 'approved' => 2, 'pending' => 1],
            ['name' => 'Upcoming Competition', 'applicants' => 3, 'approved' => 1, 'pending' => 2],
        ], $response->json('data.eventPerformance'));

        $rows = collect($response->json('data.myEvents'))->keyBy('id');

        $this->assertSame(4, $rows[$live->slug]['applicants']);
        $this->assertSame(2, $rows[$live->slug]['approved']);
        $this->assertSame(1, $rows[$live->slug]['pending']);
    }

    public function test_other_organizations_do_not_affect_the_numbers(): void
    {
        $org = $this->makeOrganization();
        $other = $this->makeOrganization('other@example.com', 'other-organization');

        $mine = $this->makeLive($org, ['title' => 'Mine']);
        $theirs = $this->makeLive($other, ['title' => 'Theirs']);

        $this->addRegistrations($mine, [EventRegistration::STATUS_CONFIRMED => 1]);
        $this->addRegistrations($theirs, [
            EventRegistration::STATUS_CONFIRMED => 3,
            EventRegistration::STATUS_PENDING => 2,
        ]);

        Sanctum::actingAs($org, ['*'], 'organization');

        $response = $this->getJson(self::URL)->assertOk();

        $this->assertEquals(
            ['approved' => 1, 'pending' => 0, 'rejected' => 0],
            $response->json('data.applicationStatus')
        );

        $this->assertCount(1, $response->json('data.myEvents'));
        $this->assertSame('Mine', $response->json('data.myEvents.0.name'));
        $this->assertCount(1, $response->json('data.eventPerformance'));
        $this->assertSame(1, array_sum(array_column($response->json('data.categories'), 'count')));
    }

    // -- What is (and is not) shown ----------------------------

    public function test_drafts_rejected_and_undated_events_are_not_shown(): void
    {
        $org = $this->makeOrganization();

        $this->makeEvent($org, ['status' => Event::STATUS_DRAFT]);
        $this->makeEvent($org, ['status' => Event::STATUS_REJECTED]);
        // Published but with no dates: it has no live/upcoming/ended label.
        $this->makeEvent($org, ['status' => Event::STATUS_PUBLISHED]);

        Sanctum::actingAs($org, ['*'], 'organization');

        $response = $this->getJson(self::URL)->assertOk();

        $this->assertSame([], $response->json('data.myEvents'));
        $this->assertSame([], $response->json('data.eventPerformance'));
        $this->assertSame([], $response->json('data.upcomingEvents'));
        $this->assertSame(0, array_sum(array_column($response->json('data.categories'), 'count')));
    }

    public function test_workflow_statuses_are_mapped_to_the_frontend_words(): void
    {
        $org = $this->makeOrganization();

        $live = $this->makeLive($org, ['type' => Event::TYPE_WORKSHOP]);
        $upcoming = $this->makeUpcoming($org, ['type' => Event::TYPE_WORKSHOP]);
        $ended = $this->makeEnded($org, ['type' => Event::TYPE_EVENT]);
        $pending = $this->makeEvent($org, [
            'type' => Event::TYPE_COMPETITION,
            'status' => Event::STATUS_PENDING_REVIEW,
            'start_date' => now()->addDays(5),
            'end_date' => now()->addDays(6),
        ]);
        $completed = $this->makeEvent($org, [
            'type' => Event::TYPE_COURSE,
            'status' => Event::STATUS_COMPLETED,
            'start_date' => now()->subDays(5),
            'end_date' => now()->subDays(4),
        ]);
        $cancelled = $this->makeEvent($org, [
            'type' => Event::TYPE_EVENT,
            'status' => Event::STATUS_CANCELLED,
        ]);

        Sanctum::actingAs($org, ['*'], 'organization');

        $response = $this->getJson(self::URL)->assertOk();

        $statuses = collect($response->json('data.myEvents'))->pluck('status', 'id')->all();

        $this->assertSame([
            $live->slug => 'live',
            $upcoming->slug => 'upcoming',
            $ended->slug => 'ended',
            $pending->slug => 'pending',
            $completed->slug => 'ended',
            $cancelled->slug => 'cancelled',
        ], $this->sortLike($statuses, [
            $live->slug, $upcoming->slug, $ended->slug,
            $pending->slug, $completed->slug, $cancelled->slug,
        ]));

        // Every visible event is counted under its type (pending and
        // cancelled ones too).
        $this->assertEquals([
            ['name' => 'Event', 'count' => 2],
            ['name' => 'Workshop', 'count' => 2],
            ['name' => 'Competition', 'count' => 1],
            ['name' => 'Course', 'count' => 1],
        ], $response->json('data.categories'));
    }

    public function test_an_organization_without_events_gets_zeros_and_empty_lists(): void
    {
        $org = $this->makeOrganization();

        Sanctum::actingAs($org, ['*'], 'organization');

        $response = $this->getJson(self::URL)->assertOk();

        $this->assertEquals(
            ['approved' => 0, 'pending' => 0, 'rejected' => 0],
            $response->json('data.applicationStatus')
        );

        $this->assertEquals([
            ['name' => 'Event', 'count' => 0],
            ['name' => 'Workshop', 'count' => 0],
            ['name' => 'Competition', 'count' => 0],
            ['name' => 'Course', 'count' => 0],
        ], $response->json('data.categories'));

        $this->assertSame([], $response->json('data.eventPerformance'));
        $this->assertSame([], $response->json('data.myEvents'));
        $this->assertSame([], $response->json('data.upcomingEvents'));
    }

    // -- My events ---------------------------------------------

    public function test_my_events_rows_have_the_frontend_shape_and_a_null_rating(): void
    {
        $org = $this->makeOrganization();

        $withImage = $this->makeUpcoming($org, [
            'title' => 'Shape Check',
            'type' => Event::TYPE_COMPETITION,
            'cover_image' => 'https://example.com/cover.jpg',
            'created_at' => now()->subMinute(),
        ]);
        $withoutImage = $this->makeUpcoming($org, [
            'title' => 'No Image',
            'created_at' => now()->subMinutes(2),
        ]);

        Sanctum::actingAs($org, ['*'], 'organization');

        $rows = $this->getJson(self::URL)->assertOk()->json('data.myEvents');

        $this->assertCount(2, $rows);

        $this->assertSame(
            ['id', 'name', 'category', 'image', 'status', 'date', 'applicants', 'approved', 'pending', 'rating'],
            array_keys($rows[0])
        );

        // "id" is the slug, not the numeric id.
        $this->assertSame($withImage->slug, $rows[0]['id']);
        $this->assertSame('Shape Check', $rows[0]['name']);
        $this->assertSame('Competition', $rows[0]['category']);
        $this->assertSame('https://example.com/cover.jpg', $rows[0]['image']);
        $this->assertSame('upcoming', $rows[0]['status']);
        $this->assertNull($rows[0]['rating']);

        $this->assertSame($withoutImage->slug, $rows[1]['id']);
        $this->assertNull($rows[1]['image']);
        $this->assertNull($rows[1]['rating']);
    }

    public function test_my_events_dates_are_formatted_like_the_frontend(): void
    {
        $org = $this->makeOrganization();
        $dash = "\u{2013}";

        $oneDay = $this->makePendingWithDates($org, '2030-11-10 14:00:00', '2030-11-10 17:00:00');
        $sameYear = $this->makePendingWithDates($org, '2030-10-24 09:00:00', '2030-10-26 18:00:00');
        $crossYear = $this->makePendingWithDates($org, '2030-12-30 09:00:00', '2031-01-02 18:00:00');
        $noDates = $this->makeEvent($org, ['status' => Event::STATUS_PENDING_REVIEW]);

        Sanctum::actingAs($org, ['*'], 'organization');

        $dates = collect($this->getJson(self::URL)->assertOk()->json('data.myEvents'))
            ->pluck('date', 'id');

        $this->assertSame('Nov 10, 2030', $dates[$oneDay->slug]);
        $this->assertSame("Oct 24 {$dash} Oct 26, 2030", $dates[$sameYear->slug]);
        $this->assertSame("Dec 30, 2030 {$dash} Jan 2, 2031", $dates[$crossYear->slug]);
        $this->assertSame("\u{2014}", $dates[$noDates->slug]);
    }

    public function test_my_events_shows_only_the_latest_10(): void
    {
        $org = $this->makeOrganization();

        for ($i = 1; $i <= 12; $i++) {
            $this->makeEnded($org, [
                'title' => "Event {$i}",
                // Event 12 is the newest.
                'created_at' => now()->subMinutes(100 - $i),
            ]);
        }

        Sanctum::actingAs($org, ['*'], 'organization');

        $rows = $this->getJson(self::URL)->assertOk()->json('data.myEvents');

        $this->assertCount(10, $rows);
        $this->assertSame('Event 12', $rows[0]['name']);
        $this->assertSame('Event 3', $rows[9]['name']);
    }

    // -- Event performance -------------------------------------

    public function test_event_performance_shows_only_the_6_busiest(): void
    {
        $org = $this->makeOrganization();

        for ($i = 1; $i <= 8; $i++) {
            $event = $this->makeEnded($org, ['title' => "Busy {$i}"]);
            $this->addRegistrations($event, [EventRegistration::STATUS_CONFIRMED => $i]);
        }

        Sanctum::actingAs($org, ['*'], 'organization');

        $rows = $this->getJson(self::URL)->assertOk()->json('data.eventPerformance');

        $this->assertSame([8, 7, 6, 5, 4, 3], array_column($rows, 'applicants'));
        $this->assertSame('Busy 8', $rows[0]['name']);
    }

    // -- Upcoming events ---------------------------------------

    public function test_upcoming_events_shows_only_the_5_soonest(): void
    {
        $org = $this->makeOrganization();

        // Created in a shuffled order on purpose.
        foreach ([4, 1, 7, 3, 6, 2, 5] as $i) {
            $this->makeUpcoming($org, [
                'title' => "Upcoming {$i}",
                'start_date' => now()->addDays(10 + $i),
                'end_date' => now()->addDays(11 + $i),
            ]);
        }

        Sanctum::actingAs($org, ['*'], 'organization');

        $rows = $this->getJson(self::URL)->assertOk()->json('data.upcomingEvents');

        $this->assertSame(
            ['Upcoming 1', 'Upcoming 2', 'Upcoming 3', 'Upcoming 4', 'Upcoming 5'],
            array_column($rows, 'name')
        );
    }

    public function test_upcoming_events_include_live_upcoming_and_pending_but_not_finished_ones(): void
    {
        $org = $this->makeOrganization();

        $this->makeLive($org, ['title' => 'Live Now']);
        $this->makeUpcoming($org, ['title' => 'Soon']);
        $this->makeEvent($org, [
            'title' => 'Waiting',
            'status' => Event::STATUS_PENDING_REVIEW,
            'start_date' => now()->addDays(8),
            'end_date' => now()->addDays(9),
        ]);

        // None of these belong in the list.
        $this->makeEnded($org, ['title' => 'Over']);
        $this->makeEvent($org, [
            'title' => 'Cancelled',
            'status' => Event::STATUS_CANCELLED,
            'start_date' => now()->addDays(3),
            'end_date' => now()->addDays(4),
        ]);
        $this->makeEvent($org, [
            'title' => 'No Date',
            'status' => Event::STATUS_PENDING_REVIEW,
        ]);

        Sanctum::actingAs($org, ['*'], 'organization');

        $rows = $this->getJson(self::URL)->assertOk()->json('data.upcomingEvents');

        $this->assertSame(['Live Now', 'Soon', 'Waiting'], array_column($rows, 'name'));
        $this->assertSame(['live', 'upcoming', 'pending'], array_column($rows, 'status'));
    }

    public function test_upcoming_events_rows_have_the_frontend_shape(): void
    {
        $org = $this->makeOrganization();

        $full = $this->makeUpcoming($org, [
            'title' => 'Full Details',
            'location' => 'Amman, JO',
            'start_date' => '2030-03-05 09:00:00',
            'end_date' => '2030-03-06 17:00:00',
            'registration_deadline' => '2030-02-25 12:00:00',
        ]);
        $this->makeUpcoming($org, [
            'title' => 'Bare Minimum',
            'start_date' => '2030-04-01 10:30:00',
            'end_date' => '2030-04-01 12:00:00',
        ]);

        $this->addRegistrations($full, [
            EventRegistration::STATUS_CONFIRMED => 1,
            EventRegistration::STATUS_PENDING => 1,
        ]);

        Sanctum::actingAs($org, ['*'], 'organization');

        $rows = $this->getJson(self::URL)->assertOk()->json('data.upcomingEvents');

        $this->assertCount(2, $rows);

        $this->assertSame(
            ['name', 'image', 'date', 'time', 'location', 'applicants', 'deadline', 'status'],
            array_keys($rows[0])
        );

        $this->assertSame('Full Details', $rows[0]['name']);
        $this->assertSame('Mar 5, 2030', $rows[0]['date']);
        $this->assertSame('09:00', $rows[0]['time']);
        $this->assertSame('Amman, JO', $rows[0]['location']);
        $this->assertSame(2, $rows[0]['applicants']);
        $this->assertSame('Feb 25, 2030', $rows[0]['deadline']);
        $this->assertSame('upcoming', $rows[0]['status']);

        // No location and no deadline fall back to a dash.
        $this->assertSame('Bare Minimum', $rows[1]['name']);
        $this->assertSame("\u{2014}", $rows[1]['location']);
        $this->assertSame("\u{2014}", $rows[1]['deadline']);
    }

    // -- Who can call it ---------------------------------------

    public function test_a_student_token_is_refused(): void
    {
        $student = User::factory()->create();

        Sanctum::actingAs($student);

        $response = $this->getJson(self::URL);

        $this->assertContains($response->getStatusCode(), [401, 403]);
        $this->assertNull($response->json('data'));
    }

    public function test_a_request_without_a_token_is_unauthorized(): void
    {
        $this->getJson(self::URL)->assertStatus(401);
    }

    // -- Helpers -----------------------------------------------

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

    /**
     * A published workshop with no dates, unless overridden. A
     * "created_at" override is applied after creating (it is not
     * mass-assignable) so the "latest events" order is predictable.
     *
     * @param  array<string, mixed>  $overrides
     */
    private function makeEvent(Organization $org, array $overrides = []): Event
    {
        $createdAt = $overrides['created_at'] ?? null;
        unset($overrides['created_at']);

        $title = $overrides['title'] ?? 'Event ' . Str::random(6);

        $event = Event::create(array_merge([
            'organization_id' => $org->id,
            'title' => $title,
            'slug' => Str::slug($title) . '-' . Str::lower(Str::random(5)),
            'description' => 'A test event.',
            'type' => Event::TYPE_WORKSHOP,
            'status' => Event::STATUS_PUBLISHED,
        ], $overrides));

        if ($createdAt !== null) {
            $event->forceFill(['created_at' => $createdAt])->save();
        }

        return $event;
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
     * A pending-review event with fixed dates (its label does not depend
     * on today's date, so the formatted date stays predictable).
     */
    private function makePendingWithDates(Organization $org, string $start, string $end): Event
    {
        return $this->makeEvent($org, [
            'status' => Event::STATUS_PENDING_REVIEW,
            'start_date' => $start,
            'end_date' => $end,
        ]);
    }

    /**
     * Creates new students and one registration each, with the given
     * status counts, e.g. [EventRegistration::STATUS_CONFIRMED => 2].
     *
     * @param  array<string, int>  $counts
     */
    private function addRegistrations(Event $event, array $counts): void
    {
        foreach ($counts as $status => $count) {
            foreach (User::factory()->count($count)->create() as $student) {
                EventRegistration::create([
                    'event_id' => $event->id,
                    'user_id' => $student->id,
                    'status' => $status,
                ]);
            }
        }
    }

    /**
     * Returns the array with its keys in the given order, so two arrays
     * can be compared with assertSame without depending on list order.
     *
     * @param  array<string, string>  $items
     * @param  array<int, string>  $order
     * @return array<string, string>
     */
    private function sortLike(array $items, array $order): array
    {
        $sorted = [];

        foreach ($order as $key) {
            $sorted[$key] = $items[$key];
        }

        return $sorted;
    }
}