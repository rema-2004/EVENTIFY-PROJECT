<?php

namespace App\Http\Controllers\Api\V1\Organization;

use App\Http\Controllers\Controller;
use App\Http\Requests\Organization\RejectApplicantRequest;
use App\Http\Resources\EventRegistrationResource;
use App\Models\AuditLog;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ApplicantController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/v1/org/events/{event}/registrations
     * GET /api/v1/org/events/{event}/registrations?status=pending
     * Lists the students who applied to one of the organization's events.
     */
    public function index(Request $request, Event $event): JsonResponse
    {
        if ($forbidden = $this->ensureOwnsEvent($event)) {
            return $forbidden;
        }

        $query = EventRegistration::where('event_id', $event->id)
            ->with('user');

        // An unknown status value is ignored (same as other list filters).
        $status = $request->query('status');
        if (in_array($status, [
            EventRegistration::STATUS_PENDING,
            EventRegistration::STATUS_CONFIRMED,
            EventRegistration::STATUS_REJECTED,
            EventRegistration::STATUS_CANCELLED,
        ], true)) {
            $query->where('status', $status);
        }

        $registrations = $query->latest()->paginate(15);

        $registrations->through(fn (EventRegistration $r) => new EventRegistrationResource($r));

        return $this->successWithPagination($registrations, 'Applicants retrieved');
    }

    /**
     * PATCH /api/v1/org/events/{event}/registrations/{registration}/approve
     * Only a pending registration can be approved.
     */
    public function approve(Event $event, EventRegistration $registration): JsonResponse
    {
        if ($error = $this->ensureCanReview($event, $registration)) {
            return $error;
        }

        $reviewed = $this->review($registration, fn () => [
            'status' => EventRegistration::STATUS_CONFIRMED,
            'rejection_reason' => null,
            'reviewed_at' => now(),
        ]);

        if (! $reviewed) {
            return $this->error('Only pending registrations can be approved.', 422);
        }

        AuditLog::record(
            type: AuditLog::TYPE_APPROVE,
            action: 'Approved Applicant',
            location: AuditLog::LOCATION_EVENTS,
            actor: Auth::guard('organization')->user(),
            target: $event,
            details: 'Organization approved a student registration.',
        );

        $reviewed->load('user');

        return $this->success(new EventRegistrationResource($reviewed), 'Applicant approved successfully');
    }

    /**
     * PATCH /api/v1/org/events/{event}/registrations/{registration}/reject
     * Only a pending registration can be rejected, and a reason is required.
     * Each rejection adds 1 to rejection_count (the student is blocked
     * from applying again once it reaches EventRegistration::MAX_REJECTIONS).
     */
    public function reject(RejectApplicantRequest $request, Event $event, EventRegistration $registration): JsonResponse
    {
        if ($error = $this->ensureCanReview($event, $registration)) {
            return $error;
        }

        $reason = $request->validated('reason');

        $reviewed = $this->review($registration, fn (EventRegistration $fresh) => [
            'status' => EventRegistration::STATUS_REJECTED,
            'rejection_reason' => $reason,
            'rejection_count' => $fresh->rejection_count + 1,
            'reviewed_at' => now(),
        ]);

        if (! $reviewed) {
            return $this->error('Only pending registrations can be rejected.', 422);
        }

        AuditLog::record(
            type: AuditLog::TYPE_REJECT,
            action: 'Rejected Applicant',
            location: AuditLog::LOCATION_EVENTS,
            actor: Auth::guard('organization')->user(),
            target: $event,
            details: $reason,
        );

        $reviewed->load('user');

        return $this->success(new EventRegistrationResource($reviewed), 'Applicant rejected successfully');
    }

    /**
     * Re-reads the registration under a row lock and applies the changes
     * only if it is STILL pending. This stops a double click (or two
     * requests at once) from, for example, rejecting an already approved
     * registration. Returns null when it is no longer pending.
     */
    private function review(EventRegistration $registration, callable $changes): ?EventRegistration
    {
        return DB::transaction(function () use ($registration, $changes) {
            $fresh = EventRegistration::whereKey($registration->id)->lockForUpdate()->first();

            if (! $fresh || ! $fresh->isPending()) {
                return null;
            }

            $fresh->update($changes($fresh));

            return $fresh;
        });
    }

    /**
     * The event must belong to the logged-in organization, and the
     * registration must belong to that event.
     */
    private function ensureCanReview(Event $event, EventRegistration $registration): ?JsonResponse
    {
        if ($forbidden = $this->ensureOwnsEvent($event)) {
            return $forbidden;
        }

        if ($registration->event_id !== $event->id) {
            return $this->error('Registration not found for this event.', 404);
        }

        // A team registration belongs to the team: its leader approves or
        // rejects the member, and that decision confirms the registration.
        // The organization must not change it behind the leader's back.
        if ($registration->team_id !== null) {
            return $this->error('Team registrations are managed by the team leader.', 422);
        }

        return null;
    }

    private function ensureOwnsEvent(Event $event): ?JsonResponse
    {
        $organization = Auth::guard('organization')->user();

        if ($event->organization_id !== $organization->id) {
            return $this->error('Forbidden. This event does not belong to your organization.', 403);
        }

        return null;
    }
}