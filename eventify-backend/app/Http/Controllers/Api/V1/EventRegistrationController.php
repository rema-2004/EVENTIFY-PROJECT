<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventRegistrationResource;
use App\Models\AuditLog;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\User;
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
     * Handles the SIMPLE registration path: an individual student applies
     * to an event. The registration starts as "pending" and waits for the
     * organization to approve or reject it.
     * Team-based competition entry (create/join a team) is handled by
     * separate endpoints in TeamController — those create their own
     * event_registrations row with team_id set, not this one.
     */
    public function register(Event $event): JsonResponse
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

        if (! $event->isRegistrationOpen()) {
            return $this->error('Registration is closed for this event.', 422);
        }

        // A team-only competition can't be joined as an individual.
        // (Older competitions have no participation_type, which counts
        // as "both", so allowsSolo() is true for them.)
        if ($event->isCompetition()) {
            $event->loadMissing('competition');

            if ($event->competition && ! $event->competition->allowsSolo()) {
                return $this->error('This competition requires a team.', 422);
            }
        }

        $existing = EventRegistration::where('event_id', $event->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existing && $existing->isActive()) {
            return $this->error('You are already registered for this event.', 422);
        }

        // A student rejected the maximum number of times can't apply again.
        // This MUST run before updateOrCreate below, otherwise the rejected
        // row would be silently reset back to "pending".
        if ($existing && $existing->isPermanentlyRejected()) {
            return $this->error('Your registration was rejected and you can no longer apply to this event.', 422);
        }

        // updateOrCreate — reuses the row if the user previously cancelled
        // or was rejected (once), instead of hitting the
        // unique(event_id, user_id) constraint. The review fields are
        // cleared for the new attempt; rejection_count is NOT touched,
        // so earlier rejections still count.
        // registered_at is set explicitly: the model's booted() only
        // fires on INSERT, not on this UPDATE path.
        $registration = EventRegistration::updateOrCreate(
            ['event_id' => $event->id, 'user_id' => $user->id],
            [
                'team_id' => null,
                'status' => EventRegistration::STATUS_PENDING,
                'registered_at' => now(),
                'rejection_reason' => null,
                'reviewed_at' => null,
            ]
        );

        AuditLog::record(
            type: AuditLog::TYPE_CREATE,
            action: 'Registered for Event',
            location: AuditLog::LOCATION_EVENTS,
            actor: $user,
            target: $event,
            details: 'Participant registered for an event.',
        );

        $registration->load(['event', 'team']);

        return $this->success(
            new EventRegistrationResource($registration),
            'Registration submitted. Waiting for the organization to review it.',
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
        $user = $this->student();

        if (! $user) {
            return $this->notStudent();
        }

        $registration = EventRegistration::where('event_id', $event->id)
            ->where('user_id', $user->id)
            ->first();

        if (! $registration || ! $registration->isActive()) {
            return $this->error('You have no active registration for this event.', 422);
        }

        $registration->update(['status' => EventRegistration::STATUS_CANCELLED]);

        AuditLog::record(
            type: AuditLog::TYPE_UPDATE,
            action: 'Cancelled Registration',
            location: AuditLog::LOCATION_EVENTS,
            actor: $user,
            target: $event,
            details: 'Participant cancelled their registration for an event.',
        );

        return $this->success(null, 'Registration cancelled successfully');
    }

    /**
     * GET /api/v1/my/registrations
     * GET /api/v1/my/registrations?status=confirmed
     * The current user's own registrations — "My Opportunities" page.
     */
    public function myRegistrations(Request $request): JsonResponse
    {
        $user = $this->student();

        if (! $user) {
            return $this->notStudent();
        }

        $query = EventRegistration::where('user_id', $user->id)
            ->with(['event', 'team']);

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $registrations = $query->latest()->paginate(15);

        $registrations->through(fn (EventRegistration $r) => new EventRegistrationResource($r));

        return $this->successWithPagination($registrations, 'Your registrations retrieved');
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
        return $this->error('Only student accounts can register for events.', 403);
    }
}