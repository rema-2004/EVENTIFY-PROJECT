<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\SavedOpportunityResource;
use App\Models\Event;
use App\Models\SavedOpportunity;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class SavedOpportunityController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/v1/my/saved-opportunities
     * The logged-in student's saved events, most recently saved first.
     */
    public function index(): JsonResponse
    {
        $user = $this->student();

        if (! $user) {
            return $this->notStudent();
        }

         $saved = $user->savedOpportunities()
            ->whereHas('event')
            ->with(['event.organization', 'event.competition'])
            ->latest('id')
            ->paginate(15);

        $saved->through(fn (SavedOpportunity $s) => new SavedOpportunityResource($s));

        return $this->successWithPagination($saved, 'Your saved opportunities retrieved');
    }

    /**
     * POST /api/v1/events/{event}/save
     */
    public function store(Event $event): JsonResponse
    {
        $user = $this->student();

        if (! $user) {
            return $this->notStudent();
        }

        if (! $event->isPublished()) {
            // Same generic message as the public show() — don't reveal
            // whether an unpublished event exists.
            return $this->error('Event not found.', 404);
        }

        // firstOrCreate keeps this safe even if the same request arrives
        // twice at once (the unique(user_id, event_id) index is the backstop).
        $saved = SavedOpportunity::firstOrCreate([
            'user_id' => $user->id,
            'event_id' => $event->id,
        ]);

        if (! $saved->wasRecentlyCreated) {
            return $this->error('You have already saved this event.', 422);
        }

        $saved->load(['event.organization', 'event.competition']);

        return $this->success(new SavedOpportunityResource($saved), 'Event saved', 201);
    }

    /**
     * DELETE /api/v1/events/{event}/save
     * Works for any event status, so a student can always clean up
     * their list even if an event was later cancelled.
     */
    public function destroy(Event $event): JsonResponse
    {
        $user = $this->student();

        if (! $user) {
            return $this->notStudent();
        }

        $saved = SavedOpportunity::where('user_id', $user->id)
            ->where('event_id', $event->id)
            ->first();

        if (! $saved) {
            return $this->error('This event is not in your saved list.', 422);
        }

        $saved->delete();

        return $this->success(null, 'Event removed from saved list');
    }

    /**
     * auth:sanctum accepts any token type, so an organization token can
     * reach this controller — only real student accounts are allowed.
     */
    private function student(): ?User
    {
        $user = Auth::user();

        return $user instanceof User ? $user : null;
    }

    private function notStudent(): JsonResponse
    {
        return $this->error('Only student accounts can save opportunities.', 403);
    }
}