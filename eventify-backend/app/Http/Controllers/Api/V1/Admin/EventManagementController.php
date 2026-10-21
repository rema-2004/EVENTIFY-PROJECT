<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RejectEventRequest;
use App\Http\Resources\EventResource;
use App\Mail\EventRejectedMail;
use App\Models\AuditLog;
use App\Models\Event;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Throwable;

class EventManagementController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/v1/admin/events
     * GET /api/v1/admin/events?status=pending_review
     *
     * Lists events for admin review, optionally filtered by status.
     * Defaults to 'pending_review' since that's the admin's main task —
     * same pattern as OrganizationManagementController::index().
     */
    public function index(Request $request): JsonResponse
    {
        $query = Event::query()->with(['organization', 'competition']);

        $status = $request->query('status', Event::STATUS_PENDING_REVIEW);

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $events = $query->latest()->paginate(15);

        $events->through(fn (Event $event) => new EventResource($event));

        return $this->successWithPagination($events, 'Events retrieved');
    }

    /**
     * GET /api/v1/admin/events/{event}
     */
    public function show(Event $event): JsonResponse
    {
        $event->load(['organization', 'competition']);

        return $this->success(new EventResource($event));
    }

    /**
     * PATCH /api/v1/admin/events/{event}/approve
     */
    public function approve(Event $event): JsonResponse
    {
        if ($event->status !== Event::STATUS_PENDING_REVIEW) {
            return $this->error(
                "Only events pending review can be approved. Current status: {$event->status}.",
                422
            );
        }

        $event->update([
            'status' => Event::STATUS_PUBLISHED,
            'admin_notes' => null, // clear any previous rejection note
        ]);

        AuditLog::record(
            type: AuditLog::TYPE_APPROVE,
            action: 'Approved Event',
            location: AuditLog::LOCATION_EVENTS,
            actor: Auth::user(),
            target: $event,
            details: 'Event was reviewed, approved and published.',
        );

        $event->load(['organization', 'competition']);

        return $this->success(new EventResource($event), 'Event approved and published successfully');
    }

    /**
     * PATCH /api/v1/admin/events/{event}/reject
     */
    public function reject(RejectEventRequest $request, Event $event): JsonResponse
    {
        if ($event->status !== Event::STATUS_PENDING_REVIEW) {
            return $this->error(
                "Only events pending review can be rejected. Current status: {$event->status}.",
                422
            );
        }

        $event->update([
            'status' => Event::STATUS_REJECTED,
            'admin_notes' => $request->validated('admin_notes'),
        ]);

        AuditLog::record(
            type: AuditLog::TYPE_REJECT,
            action: 'Rejected Event',
            location: AuditLog::LOCATION_EVENTS,
            actor: Auth::user(),
            target: $event,
            details: $request->validated('admin_notes'),
        );

        $this->sendRejectionEmail($event, $request->validated('admin_notes'));

        $event->load(['organization', 'competition']);

        return $this->success(new EventResource($event), 'Event rejected');
    }

    /**
     * Tells the organization why its event was rejected.
     *
     * The rejection has already been saved at this point, so a mail
     * failure (bad SMTP settings, mail server down) must never undo it
     * or turn the admin's request into an error — it is reported to the
     * log instead.
     */
    private function sendRejectionEmail(Event $event, string $reason): void
    {
        $organization = $event->organization;

        if (! $organization) {
            return;
        }

        try {
            Mail::to($organization->email)->send(
                new EventRejectedMail($organization->name, $event->title, $reason)
            );
        } catch (Throwable $e) {
            report($e);
        }
    }
}