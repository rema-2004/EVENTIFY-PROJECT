<?php

namespace App\Http\Controllers\Api\V1\Organization;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
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
     */
    public function index(): JsonResponse
    {
        $organization = Auth::guard('organization')->user();

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

        $registrations = $this->registrationCounts($rows->pluck('event.id')->all());

        return $this->success([
            'applicationStatus' => $this->applicationStatus($rows, $registrations),
            'categories' => $this->categories($rows),
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