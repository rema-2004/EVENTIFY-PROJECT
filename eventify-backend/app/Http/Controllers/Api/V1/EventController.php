<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/v1/events
     * GET /api/v1/events?type=workshop&search=AI&status=live
     * Public — only published events are ever visible here.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Event::published()
            ->with(['organization', 'competition'])
            ->filter($request->only(['type', 'search']));

        match ($request->query('status')) {
            'live' => $query->live(),
            'upcoming' => $query->upcoming(),
            'ended' => $query->ended(),
            default => null,
        };

        $events = $query->latest()->paginate(15);

        $events->through(fn (Event $event) => new EventResource($event));

        return $this->successWithPagination($events, 'Events retrieved');
    }

    /**
     * GET /api/v1/events/{event}
     * Resolved by slug (getRouteKeyName). Public — 404s if not published,
     * so drafts/pending events stay invisible to the public.
     */
    public function show(Event $event): JsonResponse
    {
        if (! $event->isPublished()) {
            return $this->error('Event not found.', 404);
        }

        $event->load(['organization', 'competition']);

        return $this->success(new EventResource($event));
    }
}