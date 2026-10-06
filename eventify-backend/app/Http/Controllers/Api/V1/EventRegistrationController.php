<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventRegistrationResource;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventRegistrationController extends Controller
{
    use ApiResponse;

    /**
     * POST /api/v1/events/{event}/register
     *
     * Handles the SIMPLE registration path: instant confirmation for
     * Workshop/Event/Course, and solo participation for Competition.
     * Team-based competition entry (create/join a team) is handled by
     * separate endpoints in TeamController — those create their own
     * event_registrations row with team_id set, not this one.
     */
    public function register(Event $event): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (! $event->isPublished()) {
            // Same generic message as the public show() — don't reveal
            // whether an unpublished event exists.
            return $this->error('Event not found.', 404);
        }

        if (! $event->isRegistrationOpen()) {
            return $this->error('Registration is closed for this event.', 422);
        }

        $existing = EventRegistration::where('event_id', $event->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existing && $existing->isActive()) {
            return $this->error('You are already registered for this event.', 422);
        }

        // updateOrCreate — reuses the row if the user previously cancelled,
        // instead of hitting the unique(event_id, user_id) constraint.
        // registered_at is set explicitly: the model's booted() only
        // fires on INSERT, not on this UPDATE path.
        $registration = EventRegistration::updateOrCreate(
            ['event_id' => $event->id, 'user_id' => $user->id],
            [
                'team_id' => null,
                'status' => EventRegistration::STATUS_CONFIRMED,
                'registered_at' => now(),
            ]
        );

        $registration->load(['event', 'team']);

        return $this->success(
            new EventRegistrationResource($registration),
            'Registered successfully',
            201
        );
    }

    /**
     * DELETE /api/v1/events/{event}/register
     * Cancels an active registration. The row is kept (status=cancelled),
     * not deleted — allows re-registering later via the same updateOrCreate.
     */
    public function cancel(Event $event): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $registration = EventRegistration::where('event_id', $event->id)
            ->where('user_id', $user->id)
            ->first();

        if (! $registration || ! $registration->isActive()) {
            return $this->error('You have no active registration for this event.', 422);
        }

        $registration->update(['status' => EventRegistration::STATUS_CANCELLED]);

        return $this->success(null, 'Registration cancelled successfully');
    }

    /**
     * GET /api/v1/my/registrations
     * GET /api/v1/my/registrations?status=confirmed
     * The current user's own registrations — "My Opportunities" page.
     */
    public function myRegistrations(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $query = EventRegistration::where('user_id', $user->id)
            ->with(['event', 'team']);

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $registrations = $query->latest()->paginate(15);

        $registrations->through(fn (EventRegistration $r) => new EventRegistrationResource($r));

        return $this->successWithPagination($registrations, 'Your registrations retrieved');
    }
}