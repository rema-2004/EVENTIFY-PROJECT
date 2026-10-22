<?php

namespace App\Http\Controllers\Api\V1\Organization;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    use ApiResponse;

    private const CATEGORIES = [
        'event' => 'Event',
        'workshop' => 'Workshop',
        'competition' => 'Competition',
        'course' => 'Course',
    ];

    private const MY_EVENTS_LIMIT = 10;
    private const PERFORMANCE_LIMIT = 6;
    private const UPCOMING_LIMIT = 5;

    // Ranges the applicants chart accepts (?range=...). Anything else
    // falls back to the default.
    private const RANGES = ['7d', '30d', '3m', '6m', '1y'];
    private const DEFAULT_RANGE = '30d';

    // Written as escapes so the file stays plain ASCII (no encoding issues).
    private const EM_DASH = "\u{2014}";
    private const EN_DASH = "\u{2013}";

    /**
     * GET /api/v1/org/dashboard
     *
     * Numbers for the organization's own dashboard page. The keys and
     * value shapes match what the frontend dashboard already renders, so
     * the page only has to swap its mock data for this response.
     *
     * Only the logged-in organization's events are counted, never
     * platform-wide numbers.
     *
     * Optional query: ?range=7d|30d|3m|6m|1y for the applicants chart
     * (default 30d).
     */
    public function index(Request $request): JsonResponse
    {
        $organization = Auth::guard('organization')->user();
        $range = $this->range($request);

        // Only events that have a label on the dashboard (live, upcoming,
        // ended, pending, cancelled). Drafts and rejected events are not
        // part of it.
        $rows = Event::where('organization_id', $organization->id)
            ->latest()
            ->get()
            ->map(fn (Event $event) => [
                'event' => $event,
                'status' => $this->dashboardStatus($event),
            ])
            ->filter(fn (array $row) => $row['status'] !== null)
            ->values();

        $eventIds = $rows->pluck('event.id')->all();
        $registrations = $this->registrationCounts($eventIds);

        $rangeBuckets = $this->buckets($range);
        $timeline = $this->timeline($eventIds, $rangeBuckets);

        $applicants = $this->seriesCounts($timeline, $rangeBuckets);
        $trend = $this->seriesCounts($timeline, $this->buckets('30d'));

        return $this->success([
            'kpis' => $this->kpis($rows, $registrations, $timeline),
            'applicantsSeries' => [
                'labels' => $applicants['labels'],
                'total' => $applicants['total'],
                'approved' => $applicants['approved'],
                'pending' => $applicants['pending'],
            ],
            'applicationStatus' => $this->applicationStatus($rows, $registrations),
            'categories' => $this->categories($rows),
            'registrationTrend' => [
                'labels' => $trend['labels'],
                'daily' => $trend['total'],
                'approved' => $trend['approved'],
                'pending' => $trend['pending'],
            ],
            'eventPerformance' => $this->eventPerformance($rows, $registrations),
            'myEvents' => $this->myEvents($rows, $registrations),
            'upcomingEvents' => $this->upcomingEvents($rows, $registrations),
        ], 'Dashboard retrieved');
    }

    // -- Sections ---------------------------------------------------

    /**
     * Applications across the organization's events. Cancelled
     * registrations are not counted.
     *
     * @param  Collection<int, array{event: Event, status: string}>  $rows
     * @param  array<int, array<string, int>>  $registrations
     * @return array{approved: int, pending: int, rejected: int}
     */
    private function applicationStatus(Collection $rows, array $registrations): array
    {
        $status = ['approved' => 0, 'pending' => 0, 'rejected' => 0];

        foreach ($rows as $row) {
            $counts = $this->countsFor($row['event']->id, $registrations);

            $status['approved'] += $counts['approved'];
            $status['pending'] += $counts['pending'];
            $status['rejected'] += $counts['rejected'];
        }

        return $status;
    }

    /**
     * Events per type, always the 4 fixed types (even when 0).
     *
     * @param  Collection<int, array{event: Event, status: string}>  $rows
     * @return array<int, array{name: string, count: int}>
     */
    private function categories(Collection $rows): array
    {
        $result = [];

        foreach (self::CATEGORIES as $type => $name) {
            $result[] = [
                'name' => $name,
                'count' => $rows->filter(fn (array $row) => $row['event']->type === $type)->count(),
            ];
        }

        return $result;
    }

    /**
     * Applicants per published event (live, upcoming or ended), the
     * busiest first.
     *
     * @param  Collection<int, array{event: Event, status: string}>  $rows
     * @param  array<int, array<string, int>>  $registrations
     * @return array<int, array<string, mixed>>
     */
    private function eventPerformance(Collection $rows, array $registrations): array
    {
        return $rows
            ->filter(fn (array $row) => in_array($row['status'], ['live', 'upcoming', 'ended'], true))
            ->map(function (array $row) use ($registrations) {
                $counts = $this->countsFor($row['event']->id, $registrations);

                return [
                    'name' => $row['event']->title,
                    'applicants' => $counts['applicants'],
                    'approved' => $counts['approved'],
                    'pending' => $counts['pending'],
                ];
            })
            ->sortByDesc('applicants')
            ->take(self::PERFORMANCE_LIMIT)
            ->values()
            ->all();
    }

    /**
     * The organization's latest events. "id" is the event slug (that is
     * what the other org routes use). Rating is null until the ratings
     * feature exists.
     *
     * @param  Collection<int, array{event: Event, status: string}>  $rows
     * @param  array<int, array<string, int>>  $registrations
     * @return array<int, array<string, mixed>>
     */
    private function myEvents(Collection $rows, array $registrations): array
    {
        return $rows
            ->take(self::MY_EVENTS_LIMIT)
            ->map(function (array $row) use ($registrations) {
                /** @var Event $event */
                $event = $row['event'];
                $counts = $this->countsFor($event->id, $registrations);

                return [
                    'id' => $event->slug,
                    'name' => $event->title,
                    'category' => self::CATEGORIES[$event->type] ?? ucfirst($event->type),
                    'image' => (new EventResource($event))->resolve()['cover_image'],
                    'status' => $row['status'],
                    'date' => $this->formatDateRange($event->start_date, $event->end_date),
                    'applicants' => $counts['applicants'],
                    'approved' => $counts['approved'],
                    'pending' => $counts['pending'],
                    'rating' => null,
                ];
            })
            ->values()
            ->all();
    }

    /**
     * The next events that have not finished yet (live, upcoming, or
     * still waiting for approval), soonest first.
     *
     * @param  Collection<int, array{event: Event, status: string}>  $rows
     * @param  array<int, array<string, int>>  $registrations
     * @return array<int, array<string, mixed>>
     */
    private function upcomingEvents(Collection $rows, array $registrations): array
    {
        $now = now();

        return $rows
            ->filter(function (array $row) use ($now) {
                /** @var Event $event */
                $event = $row['event'];

                return in_array($row['status'], ['live', 'upcoming', 'pending'], true)
                    && $event->start_date !== null
                    && ($event->end_date === null || $event->end_date->greaterThanOrEqualTo($now));
            })
            ->sortBy(fn (array $row) => $row['event']->start_date)
            ->take(self::UPCOMING_LIMIT)
            ->map(function (array $row) use ($registrations) {
                /** @var Event $event */
                $event = $row['event'];
                $counts = $this->countsFor($event->id, $registrations);

                return [
                    'name' => $event->title,
                    'image' => (new EventResource($event))->resolve()['cover_image'],
                    'date' => $event->start_date->format('M j, Y'),
                    'time' => $event->start_date->format('H:i'),
                    'location' => $event->location ?? self::EM_DASH,
                    'applicants' => $counts['applicants'],
                    'deadline' => $event->registration_deadline?->format('M j, Y') ?? self::EM_DASH,
                    'status' => $row['status'],
                ];
            })
            ->values()
            ->all();
    }

    /**
     * The 4 cards on top of the page. Each trend compares the latest
     * period with the period right before it (30 days for the monthly
     * cards, 7 days for Pending Review). When the earlier period is
     * empty the trend is +100% if there is new activity, otherwise 0%.
     *
     * - Active Events: events that are live right now. The trend counts
     *   events that had at least one live day in each 30-day period.
     * - Total Applicants: pending + approved + rejected. The trend
     *   counts applications made in each 30-day period.
     * - Pending Review: applicants waiting for the organization's
     *   decision. The trend counts pending applications made in each
     *   7-day period.
     * - Average Rating: not available yet (the ratings feature does not
     *   exist), so a dash and a 0 trend.
     *
     * @param  Collection<int, array{event: Event, status: string}>  $rows
     * @param  array<int, array<string, int>>  $registrations
     * @param  Collection<int, array{at: Carbon, status: string}>  $timeline
     * @return array<int, array<string, mixed>>
     */
    private function kpis(Collection $rows, array $registrations, Collection $timeline): array
    {
        $now = now();
        $days30 = $now->copy()->subDays(30);
        $days60 = $now->copy()->subDays(60);
        $days7 = $now->copy()->subDays(7);
        $days14 = $now->copy()->subDays(14);

        $status = $this->applicationStatus($rows, $registrations);
        $live = $rows->filter(fn (array $row) => $row['status'] === 'live')->count();

        return [
            [
                'icon' => 'event_available',
                'label' => 'Active Events',
                'value' => (string) $live,
                'trend' => $this->percentChange(
                    $this->eventsActiveBetween($rows, $days30, $now),
                    $this->eventsActiveBetween($rows, $days60, $days30)
                ),
                'trendLabel' => 'vs. last month',
            ],
            [
                'icon' => 'group',
                'label' => 'Total Applicants',
                'value' => (string) ($status['approved'] + $status['pending'] + $status['rejected']),
                'trend' => $this->percentChange(
                    $this->registrationsBetween($timeline, $days30, $now),
                    $this->registrationsBetween($timeline, $days60, $days30)
                ),
                'trendLabel' => 'vs. last month',
            ],
            [
                'icon' => 'pending_actions',
                'label' => 'Pending Review',
                'value' => (string) $status['pending'],
                'trend' => $this->percentChange(
                    $this->registrationsBetween($timeline, $days7, $now, EventRegistration::STATUS_PENDING),
                    $this->registrationsBetween($timeline, $days14, $days7, EventRegistration::STATUS_PENDING)
                ),
                'trendLabel' => 'vs. last week',
            ],
            [
                'icon' => 'star',
                'label' => 'Average Rating',
                'value' => self::EM_DASH,
                'trend' => 0,
                'trendLabel' => 'vs. last month',
                'suffix' => true,
            ],
        ];
    }

    /**
     * Applications per time bucket: all of them, and how many are
     * approved or pending right now (by the date the student applied).
     * Cancelled applications are not counted.
     *
     * @param  Collection<int, array{at: Carbon, status: string}>  $timeline
     * @param  array<int, array{start: Carbon, end: Carbon, label: string}>  $buckets
     * @return array{labels: array<int, string>, total: array<int, int>, approved: array<int, int>, pending: array<int, int>}
     */
    private function seriesCounts(Collection $timeline, array $buckets): array
    {
        $labels = [];
        $total = [];
        $approved = [];
        $pending = [];

        foreach ($buckets as $bucket) {
            $inBucket = $timeline->filter(
                fn (array $item) => $item['at']->gte($bucket['start']) && $item['at']->lt($bucket['end'])
            );

            $labels[] = $bucket['label'];
            $total[] = $inBucket->count();
            $approved[] = $inBucket->where('status', EventRegistration::STATUS_CONFIRMED)->count();
            $pending[] = $inBucket->where('status', EventRegistration::STATUS_PENDING)->count();
        }

        return [
            'labels' => $labels,
            'total' => $total,
            'approved' => $approved,
            'pending' => $pending,
        ];
    }

    // -- Helpers ----------------------------------------------------

    /**
     * The status words the frontend dashboard knows:
     * live, upcoming, ended, pending, cancelled. Anything else
     * (draft, rejected, or a published event with no dates) is null.
     */
    private function dashboardStatus(Event $event): ?string
    {
        return match ($event->status) {
            Event::STATUS_PUBLISHED => $event->displayStatus(),
            Event::STATUS_PENDING_REVIEW => 'pending',
            Event::STATUS_CANCELLED => 'cancelled',
            Event::STATUS_COMPLETED => 'ended',
            default => null,
        };
    }

    /**
     * The requested chart range, or the default when it is missing or
     * not one of the allowed values.
     */
    private function range(Request $request): string
    {
        $range = $request->query('range');

        return is_string($range) && in_array($range, self::RANGES, true)
            ? $range
            : self::DEFAULT_RANGE;
    }

    /**
     * The time buckets of a chart range, oldest first, the last one
     * ending today: 7d and 30d are daily, 3m is 13 weeks, 6m and 1y are
     * calendar months. "start" is included, "end" is not.
     *
     * @return array<int, array{start: Carbon, end: Carbon, label: string}>
     */
    private function buckets(string $range): array
    {
        return match ($range) {
            '7d' => $this->dailyBuckets(7, 'D'),
            '3m' => $this->weeklyBuckets(13),
            '6m' => $this->monthlyBuckets(6),
            '1y' => $this->monthlyBuckets(12),
            default => $this->dailyBuckets(30, 'M j'),
        };
    }

    /**
     * @return array<int, array{start: Carbon, end: Carbon, label: string}>
     */
    private function dailyBuckets(int $days, string $labelFormat): array
    {
        $buckets = [];

        for ($i = $days - 1; $i >= 0; $i--) {
            $start = now()->startOfDay()->subDays($i);

            $buckets[] = [
                'start' => $start,
                'end' => $start->copy()->addDay(),
                'label' => $start->format($labelFormat),
            ];
        }

        return $buckets;
    }

        /**
     * @return array<int, array{start: Carbon, end: Carbon, label: string}>
     */
    private function weeklyBuckets(int $weeks): array
    {
        $buckets = [];

        for ($i = $weeks - 1; $i >= 0; $i--) {
            // The newest week ends at the end of today.
            $end = now()->startOfDay()->addDay()->subDays($i * 7);

            $buckets[] = [
                'start' => $end->copy()->subDays(7),
                'end' => $end,
                // W1 is the oldest week, W13 the newest.
                'label' => 'W' . ($weeks - $i),
            ];
        }

        return $buckets;
    }

    /**
     * @return array<int, array{start: Carbon, end: Carbon, label: string}>
     */
    private function monthlyBuckets(int $months): array
    {
        $buckets = [];

        for ($i = $months - 1; $i >= 0; $i--) {
            $start = now()->startOfMonth()->subMonthsNoOverflow($i);

            $buckets[] = [
                'start' => $start,
                'end' => $start->copy()->addMonthNoOverflow(),
                'label' => $start->format('M y'),
            ];
        }

        return $buckets;
    }

    /**
     * When each non-cancelled application was made, and its status now.
     * Loaded once, from the start of the chart range (or the last 60
     * days, whichever is earlier) so the cards and both charts can use it.
     *
     * @param  array<int, int>  $eventIds
     * @param  array<int, array{start: Carbon, end: Carbon, label: string}>  $buckets
     * @return Collection<int, array{at: Carbon, status: string}>
     */
    private function timeline(array $eventIds, array $buckets): Collection
    {
        if ($eventIds === []) {
            return collect();
        }

        $from = now()->subDays(60)->startOfDay()->min($buckets[0]['start']);

        return EventRegistration::whereIn('event_id', $eventIds)
            ->where('status', '!=', EventRegistration::STATUS_CANCELLED)
            ->where('registered_at', '>=', $from)
            ->get(['registered_at', 'status'])
            ->map(fn (EventRegistration $registration) => [
                'at' => $registration->registered_at,
                'status' => $registration->status,
            ])
            ->values();
    }

    /**
     * Applications made after $from and up to $to (optionally only
     * those with the given status now).
     *
     * @param  Collection<int, array{at: Carbon, status: string}>  $timeline
     */
    private function registrationsBetween(Collection $timeline, Carbon $from, Carbon $to, ?string $status = null): int
    {
        return $timeline->filter(
            fn (array $item) => $item['at']->gt($from)
                && $item['at']->lte($to)
                && ($status === null || $item['status'] === $status)
        )->count();
    }

    /**
     * Events that had at least one live day after $from and up to $to.
     *
     * @param  Collection<int, array{event: Event, status: string}>  $rows
     */
    private function eventsActiveBetween(Collection $rows, Carbon $from, Carbon $to): int
    {
        return $rows->filter(function (array $row) use ($from, $to) {
            if (! in_array($row['status'], ['live', 'upcoming', 'ended'], true)) {
                return false;
            }

            /** @var Event $event */
            $event = $row['event'];

            if ($event->start_date === null) {
                return false;
            }

            $end = $event->end_date ?? $event->start_date;

            return $event->start_date->lte($to) && $end->gt($from);
        })->count();
    }

    /**
     * Change from $previous to $current as a percentage with 1 decimal.
     * With nothing before: +100 if there is something now, otherwise 0.
     */
    private function percentChange(int $current, int $previous): float
    {
        if ($previous === 0) {
            return $current > 0 ? 100.0 : 0.0;
        }

        return round((($current - $previous) / $previous) * 100, 1);
    }

    /**
     * One query: registration counts per event and status.
     *
     * @param  array<int, int>  $eventIds
     * @return array<int, array<string, int>>
     */
    private function registrationCounts(array $eventIds): array
    {
        if ($eventIds === []) {
            return [];
        }

        $byEvent = [];

        EventRegistration::whereIn('event_id', $eventIds)
            ->selectRaw('event_id, status, COUNT(*) as total')
            ->groupBy('event_id', 'status')
            ->get()
            ->each(function ($row) use (&$byEvent) {
                $byEvent[$row->event_id][$row->status] = (int) $row->total;
            });

        return $byEvent;
    }

    /**
     * "applicants" = pending + approved + rejected (cancelled ones are
     * left out).
     *
     * @param  array<int, array<string, int>>  $registrations
     * @return array{applicants: int, approved: int, pending: int, rejected: int}
     */
    private function countsFor(int $eventId, array $registrations): array
    {
        $counts = $registrations[$eventId] ?? [];

        $approved = $counts[EventRegistration::STATUS_CONFIRMED] ?? 0;
        $pending = $counts[EventRegistration::STATUS_PENDING] ?? 0;
        $rejected = $counts[EventRegistration::STATUS_REJECTED] ?? 0;

        return [
            'applicants' => $approved + $pending + $rejected,
            'approved' => $approved,
            'pending' => $pending,
            'rejected' => $rejected,
        ];
    }

    private function formatDateRange(?Carbon $start, ?Carbon $end): string
    {
        if (! $start) {
            return self::EM_DASH;
        }

        if (! $end || $end->isSameDay($start)) {
            return $start->format('M j, Y');
        }

        $separator = ' ' . self::EN_DASH . ' ';

        if ($start->year === $end->year) {
            return $start->format('M j') . $separator . $end->format('M j, Y');
        }

        return $start->format('M j, Y') . $separator . $end->format('M j, Y');
    }
}