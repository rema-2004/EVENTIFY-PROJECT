<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RejectEventRequest;
use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

        $event->load(['organization', 'competition']);

        return $this->success(new EventResource($event), 'Event rejected');
    }
}