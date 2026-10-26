<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

/**
 * The logged-in account's own notifications. The same controller serves
 * students (/notifications) and organizations (/org/notifications): each
 * route group is protected by its own guard, and only that guard's
 * account is ever read here.
 */
class NotificationController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/v1/notifications
     * GET /api/v1/notifications?unread=1
     * GET /api/v1/notifications?kind=team_approved,team_rejected
     * "kind" takes one kind or several separated by commas, so a tab of
     * the page (applications, teams, ...) is a single request.
     */
    public function index(Request $request): JsonResponse
    {
        $account = $this->account($request);

        $query = $account->notifications()->latest();

        if ($request->boolean('unread')) {
            $query->whereNull('read_at');
        }

        $kinds = array_values(array_filter(array_map('trim', explode(',', (string) $request->query('kind', '')))));

        if ($kinds !== []) {
            $query->whereIn('data->kind', $kinds);
        }

        $notifications = $query->paginate(15);

        $notifications->through(fn (DatabaseNotification $n) => $this->format($n));

        return response()->json([
            'success' => true,
            'message' => 'Notifications retrieved',
            'data' => $notifications->items(),
            'meta' => [
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
                'unread_count' => $account->unreadNotifications()->count(),
            ],
        ]);
    }

    /**
     * PATCH /api/v1/notifications/{id}/read
     */
    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $notification = $this->account($request)->notifications()->whereKey($id)->first();

        if (! $notification) {
            return $this->error('Notification not found.', 404);
        }

        $notification->markAsRead();

        return $this->success($this->format($notification->refresh()), 'Notification marked as read');
    }

    /**
     * PATCH /api/v1/notifications/read-all
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $this->account($request)->unreadNotifications()->update(['read_at' => now()]);

        return $this->success(null, 'All notifications marked as read');
    }

    /**
     * @return array<string, mixed>
     */
    private function format(DatabaseNotification $notification): array
    {
        $data = $notification->data;

        return [
            'id' => $notification->id,
            'kind' => $data['kind'] ?? null,
            'message' => $data['message'] ?? '',
            'data' => collect($data)->except(['kind', 'message'])->all(),
            'is_read' => $notification->read_at !== null,
            'read_at' => $notification->read_at?->toIso8601String(),
            'created_at' => $notification->created_at?->toIso8601String(),
        ];
    }

    /**
     * The route's auth middleware (auth:sanctum or auth:organization)
     * already made its guard the default one, so this is the account
     * that is logged in on THIS route group.
     */
    private function account(Request $request): \Illuminate\Database\Eloquent\Model
    {
        return $request->user();
    }
}