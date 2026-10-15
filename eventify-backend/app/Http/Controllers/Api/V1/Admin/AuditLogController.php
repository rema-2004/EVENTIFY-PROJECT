<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AuditLogIndexRequest;
use App\Http\Resources\AuditLogResource;
use App\Models\AuditLog;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class AuditLogController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/v1/admin/audit-logs
     * Newest first, 15 per page. Every filter is optional:
     * type, role, status, location, sensitive (1/0), from, to, search.
     */
    public function index(AuditLogIndexRequest $request): JsonResponse
    {
        $query = AuditLog::query();

        foreach (['type', 'status', 'location'] as $column) {
            if ($request->filled($column)) {
                $query->where($column, $request->input($column));
            }
        }

        // The 'role' filter matches the actor's role label.
        if ($request->filled('role')) {
            $query->where('actor_role', $request->input('role'));
        }

        if ($request->filled('sensitive')) {
            $query->where('is_sensitive', $request->boolean('sensitive'));
        }

        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->input('from'));
        }

        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->input('to'));
        }

        if ($request->filled('search')) {
            $term = '%' . $request->input('search') . '%';

            $query->where(function ($q) use ($term) {
                $q->where('actor_name', 'like', $term)
                    ->orWhere('action', 'like', $term)
                    ->orWhere('target_label', 'like', $term)
                    ->orWhere('ip_address', 'like', $term)
                    ->orWhere('details', 'like', $term);
            });
        }

        $logs = $query
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString();

        $logs->through(fn (AuditLog $log) => new AuditLogResource($log));

        return $this->successWithPagination($logs, 'Audit logs retrieved');
    }

    /**
     * GET /api/v1/admin/audit-logs/summary
     * The four numbers on top of the Audit Log page. Counted over the
     * whole log — not affected by the list filters.
     */
    public function summary(): JsonResponse
    {
        return $this->success([
            'total' => AuditLog::count(),
            'today' => AuditLog::whereDate('created_at', today())->count(),
            'sensitive' => AuditLog::where('is_sensitive', true)->count(),
            'failed' => AuditLog::where('status', AuditLog::STATUS_FAILED)->count(),
        ], 'Audit log summary retrieved');
    }
}