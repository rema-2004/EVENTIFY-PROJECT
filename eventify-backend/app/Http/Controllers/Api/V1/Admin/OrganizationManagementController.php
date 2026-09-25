<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RejectOrganizationRequest;
use App\Http\Resources\OrganizationResource;
use App\Models\Organization;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class OrganizationManagementController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/v1/admin/organizations
     * GET /api/v1/admin/organizations?status=pending
     */
    public function index(Request $request): JsonResponse
    {
        $query = Organization::query();

        $status = $request->query('status', Organization::STATUS_PENDING);

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $organizations = $query->latest()->paginate(15);

        // Wrap each item through the Resource — never leak raw models
        // (password, admin_notes, deleted_at, etc.) even in a paginated list.
        $organizations->through(fn (Organization $org) => new OrganizationResource($org));

        return $this->successWithPagination($organizations, 'Organizations retrieved');
    }

    /**
     * GET /api/v1/admin/organizations/{organization}
     * Full detail view — needed before the admin decides to approve/reject.
     */
    public function show(Organization $organization): JsonResponse
    {
        return $this->success(new OrganizationResource($organization));
    }

    /**
     * PATCH /api/v1/admin/organizations/{organization}/approve
     */
    public function approve(Organization $organization): JsonResponse
    {
        if ($organization->status === Organization::STATUS_APPROVED) {
            return $this->error('This organization is already approved.', 422);
        }

        $organization->update([
            'status' => Organization::STATUS_APPROVED,
            'verified_at' => now(),
            'admin_notes' => null,
        ]);

        return $this->success(
            new OrganizationResource($organization),
            'Organization approved successfully'
        );
    }

    /**
     * PATCH /api/v1/admin/organizations/{organization}/reject
     */
    public function reject(RejectOrganizationRequest $request, Organization $organization): JsonResponse
    {
        if ($organization->status === Organization::STATUS_REJECTED) {
            return $this->error('This organization is already rejected.', 422);
        }

        $organization->update([
            'status' => Organization::STATUS_REJECTED,
            'admin_notes' => $request->validated('admin_notes'),
            'verified_at' => null,
        ]);

        return $this->success(
            new OrganizationResource($organization),
            'Organization rejected'
        );
    }

    /**
     * GET /api/v1/admin/organizations/{organization}/license
     *
     * Streams the license document file directly to the admin.
     * This is the ONLY way to access this file — it's never exposed
     * as a public asset() URL (see OrganizationResource).
     */
    public function downloadLicense(Organization $organization): StreamedResponse|JsonResponse
    {
        if (! $organization->license_document) {
            return $this->error('This organization has no license document uploaded.', 404);
        }

        if (! Storage::disk('local')->exists($organization->license_document)) {
            return $this->error('License document file not found on server.', 404);
        }

        return Storage::disk('local')->download(
            $organization->license_document,
            'license-' . $organization->slug . '.pdf'
        );
    }
}