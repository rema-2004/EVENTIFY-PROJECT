<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserRestrictionRequest;
use App\Http\Resources\UserResource;
use App\Models\AuditLog;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserManagementController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/v1/admin/users
     * GET /api/v1/admin/users?status=suspended&search=sara
     * Lists student accounts only (admin accounts are never listed).
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::query()->where('role', User::ROLE_USER);

        // An unknown status value is ignored (same as other list filters).
        $status = $request->query('status');
        if (in_array($status, [
            User::STATUS_ACTIVE,
            User::STATUS_SUSPENDED,
            User::STATUS_BANNED,
        ], true)) {
            $query->where('status', $status);
        }

        $search = trim((string) $request->query('search', ''));
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()->paginate(15);

        // Wrap each item through the Resource — never leak raw models.
        $users->through(fn (User $user) => new UserResource($user));

        return $this->successWithPagination($users, 'Users retrieved');
    }

    /**
     * PATCH /api/v1/admin/users/{user}/suspend
     * Only an active account can be suspended. A reason is required.
     */
    public function suspend(UserRestrictionRequest $request, User $user): JsonResponse
    {
        if ($blocked = $this->ensureNotAdmin($user)) {
            return $blocked;
        }

        if (! $user->isActive()) {
            return $this->error('Only active accounts can be suspended.', 422);
        }

        $this->restrict($user, User::STATUS_SUSPENDED, 'Suspended User', $request->validated('reason'));

        return $this->success(new UserResource($user), 'User suspended successfully');
    }

    /**
     * PATCH /api/v1/admin/users/{user}/ban
     * An active or suspended account can be banned. A reason is required.
     */
    public function ban(UserRestrictionRequest $request, User $user): JsonResponse
    {
        if ($blocked = $this->ensureNotAdmin($user)) {
            return $blocked;
        }

        if ($user->status === User::STATUS_BANNED) {
            return $this->error('This account is already banned.', 422);
        }

        $this->restrict($user, User::STATUS_BANNED, 'Banned User', $request->validated('reason'));

        return $this->success(new UserResource($user), 'User banned successfully');
    }

    /**
     * PATCH /api/v1/admin/users/{user}/activate
     * Reactivates a suspended or banned account.
     */
    public function activate(User $user): JsonResponse
    {
        if ($blocked = $this->ensureNotAdmin($user)) {
            return $blocked;
        }

        if ($user->isActive()) {
            return $this->error('This account is already active.', 422);
        }

        $user->update(['status' => User::STATUS_ACTIVE]);

        AuditLog::record(
            type: AuditLog::TYPE_UPDATE,
            action: 'Activated User',
            location: AuditLog::LOCATION_USERS,
            actor: Auth::user(),
            target: $user,
            details: 'Account was reactivated by an admin.',
            metadata: ['status' => User::STATUS_ACTIVE],
        );

        return $this->success(new UserResource($user), 'User activated successfully');
    }

    /**
     * Changes the status AND signs the user out everywhere. The status is
     * only checked at login, so without deleting the tokens a suspended
     * student who is already logged in could keep using the API.
     */
    private function restrict(User $user, string $status, string $action, string $reason): void
    {
        DB::transaction(function () use ($user, $status) {
            $user->update(['status' => $status]);
            $user->tokens()->delete();
        });

        AuditLog::record(
            type: AuditLog::TYPE_UPDATE,
            action: $action,
            location: AuditLog::LOCATION_USERS,
            actor: Auth::user(),
            target: $user,
            sensitive: true,
            details: $reason,
            metadata: ['status' => $status],
        );
    }

    /**
     * Admin accounts (including the one making the request) can't be
     * suspended, banned or activated through these routes.
     */
    private function ensureNotAdmin(User $user): ?JsonResponse
    {
        if ($user->isAdmin()) {
            return $this->error('Admin accounts cannot be changed from here.', 403);
        }

        return null;
    }
}