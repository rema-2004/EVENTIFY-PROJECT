<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrgDashboardChartsTest extends TestCase
{
    use RefreshDatabase;

    private const URL = '/api/v1/org/dashboard';

    /**
     * The clock is frozen (Wednesday 21 Oct 2026, 12:00) so day, week
     * and month buckets and the "last 30 days" windows are predictable.
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->travelTo(Carbon::parse('2026-10-21 12:00:00'));
    }

    // -- The 4 cards -------------------------------------------

    public function test_kpis_have_the_four_frontend_cards_in_order(): void
    {
        $org = $this->makeOrganization();

        $kpis = $this->dashboard($org)['kpis'];

        $this->assertCount(4, $kpis);
        $this->assertSame(
            ['Active Events', 'Total Applicants', 'Pending Review', 'Average Rating'],
            array_column($kpis, 'label')
        );
        $this->assertSame(
            ['event_available', 'group', 'pending_actions', 'star'],
            array_column($kpis, 'icon')
        );
        $this->assertSame(
            ['vs. last month', 'vs. last month', 'vs. last week', 'vs. last month'],
            array_column($kpis, 'trendLabel')
        );

        foreach (array_slice($kpis, 0, 3) as $card) {
            $this->assertSame(['icon', 'label', 'value', 'trend', 'trendLabel'], array_keys($card));
            // The frontend mock sends the value as text ("3").
            $this->assertIsString($card['value']);
        }

        // Ratings do not exist yet: a dash, a 0 trend, and the "suffix"
        // flag the frontend uses for this card.
        $rating = $kpis[3];
        $this->assertSame("\u{2014}", $rating['value']);
        $this->assertEquals(0, $rating['trend']);
        $this->assertTrue($rating['suffix']);
    }

    public function test_active_events_counts_only_live_events(): void
    {
        $org = $this->makeOrganization();

        $this->makeLive($org);
        $this->makeLive($org);
        $this->makeUpcoming($org);
        $this->makeEnded($org);
        $this->makeEvent($org, [
            'status' => Event::STATUS_PENDING_REVIEW,
            'start_date' => now()->subDay(),
            'end_date' => now()->addDay(),
        ]);

        $card = $this->kpi($this->dashboard($org), 'Active Events');

        $this->assertSame('2', $card['value']);
    }

    public function test_applicants_and_pending_cards_show_the_current_totals(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeLive($org);

        $this->addRegistrations($event, EventRegistration::STATUS_CONFIRMED, 2, $this->daysAgo(1));
        $this->addRegistrations($event, EventRegistration::STATUS_PENDING, 3, $this->daysAgo(1));
        $this->addRegistrations($event, EventRegistration::STATUS_REJECTED, 1, $this->daysAgo(1));
        // Cancelled applications are not counted anywhere.
        $this->addRegistrations($event, EventRegistration::STATUS_CANCELLED, 1, $this->daysAgo(1));

        $data = $this->dashboard($org);

        $this->assertSame('6', $this->kpi($data, 'Total Applicants')['value']);
        $this->assertSame('3', $this->kpi($data, 'Pending Review')['value']);
    }

    // -- Trends ------------------------------------------------

    public function test_total_applicants_trend_compares_with_the_previous_30_days(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeLive($org);

        // Last 30 days: 6 applications (the cancelled one is ignored).
        $this->addRegistrations($event, EventRegistration::STATUS_PENDING, 2, $this->daysAgo(5));
        $this->addRegistrations($event, EventRegistration::STATUS_CONFIRMED, 3, $this->daysAgo(5));
        $this->addRegistrations($event, EventRegistration::STATUS_REJECTED, 1, $this->daysAgo(5));
        $this->addRegistrations($event, EventRegistration::STATUS_CANCELLED, 2, $this->daysAgo(5));

        // The 30 days before that: 4 applications.
        $this->addRegistrations($event, EventRegistration::STATUS_CONFIRMED, 4, $this->daysAgo(40));

        // Older than both periods: counted in the total, not in the trend.
        $this->addRegistrations($event, EventRegistration::STATUS_CONFIRMED, 1, $this->daysAgo(70));

        $card = $this->kpi($this->dashboard($org), 'Total Applicants');

        $this->assertSame('11', $card['value']);
        $this->assertEquals(50.0, $card['trend']);
    }

    public function test_a_trend_can_be_negative(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeLive($org);

        $this->addRegistrations($event, EventRegistration::STATUS_CONFIRMED, 2, $this->daysAgo(5));
        $this->addRegistrations($event, EventRegistration::STATUS_CONFIRMED, 4, $this->daysAgo(40));

        $card = $this->kpi($this->dashboard($org), 'Total Applicants');

        $this->assertEquals(-50.0, $card['trend']);
    }

    public function test_pending_review_trend_compares_with_the_previous_7_days(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeLive($org);

        // Last 7 days: 3 pending applications. The confirmed ones do
        // not count for this card.
        $this->addRegistrations($event, EventRegistration::STATUS_PENDING, 3, $this->daysAgo(2));
        $this->addRegistrations($event, EventRegistration::STATUS_CONFIRMED, 5, $this->daysAgo(2));

        // The 7 days before that: 2 pending applications.
        $this->addRegistrations($event, EventRegistration::STATUS_PENDING, 2, $this->daysAgo(10));

        $card = $this->kpi($this->dashboard($org), 'Pending Review');

        $this->assertSame('5', $card['value']);
        $this->assertEquals(50.0, $card['trend']);
    }

    public function test_active_events_trend_compares_events_that_were_live_in_each_period(): void
    {
        $org = $this->makeOrganization();

        // Live in the last 30 days (2 live now + 1 that already ended).
        $this->makeLive($org, ['start_date' => now()->subDays(5), 'end_date' => now()->addDays(5)]);
        $this->makeLive($org, ['start_date' => now()->subDays(3), 'end_date' => now()->addDays(3)]);
        $this->makeEnded($org, ['start_date' => now()->subDays(20), 'end_date' => now()->subDays(10)]);

        // Live in the 30 days before that.
        $this->makeEnded($org, ['start_date' => now()->subDays(50), 'end_date' => now()->subDays(40)]);
        $this->makeEnded($org, ['start_date' => now()->subDays(70), 'end_date' => now()->subDays(35)]);

        $card = $this->kpi($this->dashboard($org), 'Active Events');

        $this->assertSame('2', $card['value']);
        $this->assertEquals(50.0, $card['trend']);
    }

    public function test_a_trend_is_100_when_there_was_nothing_before(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeLive($org);

        $this->addRegistrations($event, EventRegistration::STATUS_PENDING, 3, $this->daysAgo(3));

        $data = $this->dashboard($org);

        $this->assertEquals(100.0, $this->kpi($data, 'Active Events')['trend']);
        $this->assertEquals(100.0, $this->kpi($data, 'Total Applicants')['trend']);
        $this->assertEquals(100.0, $this->kpi($data, 'Pending Review')['trend']);
    }

    public function test_every_number_is_zero_for_an_organization_with_no_activity(): void
    {
        $org = $this->makeOrganization();

        $data = $this->dashboard($org);

        foreach (['Active Events', 'Total Applicants', 'Pending Review'] as $label) {
            $card = $this->kpi($data, $label);

            $this->assertSame('0', $card['value']);
            $this->assertEquals(0.0, $card['trend']);
        }
    }

    // -- Applicants chart --------------------------------------

    public function test_applicants_series_defaults_to_30_daily_points(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeLive($org);

        $this->addRegistration($event, EventRegistration::STATUS_CONFIRMED, Carbon::parse('2026-10-21 08:00:00'));
        $this->addRegistration($event, EventRegistration::STATUS_PENDING, Carbon::parse('2026-10-21 09:00:00'));
        $this->addRegistration($event, EventRegistration::STATUS_REJECTED, Carbon::parse('2026-10-20 10:00:00'));
        $this->addRegistration($event, EventRegistration::STATUS_PENDING, Carbon::parse('2026-10-11 10:00:00'));
        // Not counted: cancelled, and older than 30 days.
        $this->addRegistration($event, EventRegistration::STATUS_CANCELLED, Carbon::parse('2026-10-21 10:00:00'));
        $this->addRegistration($event, EventRegistration::STATUS_CONFIRMED, Carbon::parse('2026-09-11 10:00:00'));

        $series = $this->dashboard($org)['applicantsSeries'];

        $this->assertSame(['labels', 'total', 'approved', 'pending'], array_keys($series));
        $this->assertCount(30, $series['labels']);
        $this->assertSame('Sep 22', $series['labels'][0]);
        $this->assertSame('Oct 21', $series['labels'][29]);

        $total = array_fill(0, 30, 0);
        $total[29] = 2; // Oct 21: one confirmed + one pending
        $total[28] = 1; // Oct 20: rejected
        $total[19] = 1; // Oct 11: pending

        $approved = array_fill(0, 30, 0);
        $approved[29] = 1;

        $pending = array_fill(0, 30, 0);
        $pending[29] = 1;
        $pending[19] = 1;

        $this->assertSame($total, $series['total']);
        $this->assertSame($approved, $series['approved']);
        $this->assertSame($pending, $series['pending']);
    }

    public function test_applicants_series_for_7_days_uses_weekday_labels(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeLive($org);

        $this->addRegistration($event, EventRegistration::STATUS_CONFIRMED, Carbon::parse('2026-10-21 08:00:00'));
        $this->addRegistration($event, EventRegistration::STATUS_PENDING, Carbon::parse('2026-10-15 08:00:00'));
        // One day too old for the 7 days.
        $this->addRegistration($event, EventRegistration::STATUS_PENDING, Carbon::parse('2026-10-14 08:00:00'));

        $series = $this->dashboard($org, '?range=7d')['applicantsSeries'];

        $this->assertSame(['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'], $series['labels']);
        $this->assertSame([1, 0, 0, 0, 0, 0, 1], $series['total']);
    }

    public function test_applicants_series_for_3_months_uses_13_weeks(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeLive($org);

        $this->addRegistration($event, EventRegistration::STATUS_CONFIRMED, Carbon::parse('2026-10-21 08:00:00'));
        $this->addRegistration($event, EventRegistration::STATUS_CONFIRMED, Carbon::parse('2026-10-13 08:00:00'));
        $this->addRegistration($event, EventRegistration::STATUS_PENDING, Carbon::parse('2026-07-25 08:00:00'));
        // Before the first week.
        $this->addRegistration($event, EventRegistration::STATUS_PENDING, Carbon::parse('2026-07-20 08:00:00'));

        $series = $this->dashboard($org, '?range=3m')['applicantsSeries'];

        $this->assertSame(
            ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12', 'W13'],
            $series['labels']
        );

        $total = array_fill(0, 13, 0);
        $total[0] = 1;  // W1: Jul 23 - Jul 29
        $total[11] = 1; // W12: Oct 8 - Oct 14
        $total[12] = 1; // W13: Oct 15 - Oct 21

        $this->assertSame($total, $series['total']);
    }

    public function test_applicants_series_for_6_months_uses_calendar_months(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeLive($org);

        $this->addRegistration($event, EventRegistration::STATUS_CONFIRMED, Carbon::parse('2026-10-05 10:00:00'));
        $this->addRegistration($event, EventRegistration::STATUS_PENDING, Carbon::parse('2026-05-15 10:00:00'));
        // The month before the first one.
        $this->addRegistration($event, EventRegistration::STATUS_PENDING, Carbon::parse('2026-04-30 10:00:00'));

        $series = $this->dashboard($org, '?range=6m')['applicantsSeries'];

        $this->assertSame(['May 26', 'Jun 26', 'Jul 26', 'Aug 26', 'Sep 26', 'Oct 26'], $series['labels']);
        $this->assertSame([1, 0, 0, 0, 0, 1], $series['total']);
        $this->assertSame([0, 0, 0, 0, 0, 1], $series['approved']);
        $this->assertSame([1, 0, 0, 0, 0, 0], $series['pending']);
    }

    public function test_applicants_series_for_1_year_uses_12_months(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeLive($org);

        $this->addRegistration($event, EventRegistration::STATUS_CONFIRMED, Carbon::parse('2026-10-21 08:00:00'));
        $this->addRegistration($event, EventRegistration::STATUS_CONFIRMED, Carbon::parse('2025-11-10 10:00:00'));
        // The month before the first one.
        $this->addRegistration($event, EventRegistration::STATUS_CONFIRMED, Carbon::parse('2025-10-31 10:00:00'));

        $series = $this->dashboard($org, '?range=1y')['applicantsSeries'];

        $this->assertCount(12, $series['labels']);
        $this->assertSame('Nov 25', $series['labels'][0]);
        $this->assertSame('Oct 26', $series['labels'][11]);

        $total = array_fill(0, 12, 0);
        $total[0] = 1;
        $total[11] = 1;

        $this->assertSame($total, $series['total']);
    }

    public function test_an_unknown_range_falls_back_to_30_days(): void
    {
        $org = $this->makeOrganization();

        $this->assertCount(30, $this->dashboard($org, '?range=abc')['applicantsSeries']['labels']);
        $this->assertCount(30, $this->dashboard($org, '?range=99d')['applicantsSeries']['labels']);
    }

    // -- Registration trend ------------------------------------

    public function test_registration_trend_is_always_the_last_30_days(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeLive($org);

        $this->addRegistration($event, EventRegistration::STATUS_CONFIRMED, Carbon::parse('2026-10-21 08:00:00'));
        $this->addRegistration($event, EventRegistration::STATUS_PENDING, Carbon::parse('2026-10-21 09:00:00'));

        // The applicants chart range does not change this one.
        $trend = $this->dashboard($org, '?range=1y')['registrationTrend'];

        $this->assertSame(['labels', 'daily', 'approved', 'pending'], array_keys($trend));
        $this->assertCount(30, $trend['labels']);
        $this->assertSame('Oct 21', $trend['labels'][29]);
        $this->assertSame(2, $trend['daily'][29]);
        $this->assertSame(1, $trend['approved'][29]);
        $this->assertSame(1, $trend['pending'][29]);
        $this->assertSame(0, array_sum(array_slice($trend['daily'], 0, 29)));
    }

    // -- Separation --------------------------------------------

    public function test_other_organizations_applications_are_not_counted(): void
    {
        $org = $this->makeOrganization();
        $other = $this->makeOrganization('other@example.com', 'other-organization');

        $theirs = $this->makeLive($other);
        $this->addRegistrations($theirs, EventRegistration::STATUS_PENDING, 4, $this->daysAgo(1));

        $data = $this->dashboard($org);

        $this->assertSame('0', $this->kpi($data, 'Total Applicants')['value']);
        $this->assertSame('0', $this->kpi($data, 'Pending Review')['value']);
        $this->assertSame(0, array_sum($data['applicantsSeries']['total']));
        $this->assertSame(0, array_sum($data['registrationTrend']['daily']));
    }

    // -- Helpers -----------------------------------------------

    /**
     * Calls the dashboard as the organization and returns "data".
     *
     * @return array<string, mixed>
     */
    private function dashboard(Organization $org, string $query = ''): array
    {
        Sanctum::actingAs($org, ['*'], 'organization');

        return $this->getJson(self::URL . $query)->assertOk()->json('data');
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function kpi(array $data, string $label): array
    {
        return collect($data['kpis'])->firstWhere('label', $label);
    }

    private function daysAgo(int $days): Carbon
    {
        return now()->subDays($days);
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
     * One application by a new student, made at the given time.
     */
    private function addRegistration(Event $event, string $status, Carbon $at): void
    {
        EventRegistration::create([
            'event_id' => $event->id,
            'user_id' => User::factory()->create()->id,
            'status' => $status,
            'registered_at' => $at,
        ]);
    }

    /**
     * Several applications with the same status, all made at the same time.
     */
    private function addRegistrations(Event $event, string $status, int $count, Carbon $at): void
    {
        for ($i = 0; $i < $count; $i++) {
            $this->addRegistration($event, $status, $at);
        }
    }
}