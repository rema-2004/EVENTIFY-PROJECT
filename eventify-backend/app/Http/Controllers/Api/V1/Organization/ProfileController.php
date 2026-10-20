<?php

namespace App\Http\Controllers\Api\V1\Organization;

use App\Http\Controllers\Controller;
use App\Http\Requests\Organization\ChangePasswordRequest;
use App\Http\Requests\Organization\UpdateProfileRequest;
use App\Http\Resources\OrganizationResource;
use App\Models\AuditLog;
use App\Models\Organization;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

class ProfileController extends Controller
{
    use ApiResponse;

    /**
     * PATCH /api/v1/org/profile
     * Partial update — only the fields sent are changed. Viewing the
     * profile is the existing GET /api/v1/org/me.
     *
     * The slug is never touched, even when the name changes, so links
     * that already use it keep working.
     */
    public function update(UpdateProfileRequest $request): JsonResponse
    {
        /** @var Organization $organization */
        $organization = Auth::guard('organization')->user();

        // current_password was only needed for validation.
        $data = collect($request->validated())->except('current_password')->all();

        $organization->fill($data);

        $changedFields = array_keys($organization->getDirty());
        $emailChanged = in_array('email', $changedFields, true);

        if ($changedFields !== []) {
            $organization->save();

            // The login email changing is a sensitive event.
            AuditLog::record(
                type: AuditLog::TYPE_UPDATE,
                action: 'Updated Organization Profile',
                location: AuditLog::LOCATION_SETTINGS,
                actor: $organization,
                target: $organization,
                sensitive: $emailChanged,
                details: $emailChanged
                    ? 'Organization updated its profile and changed its login email.'
                    : 'Organization updated its profile.',
                // Only the names of the changed fields, never their values.
                metadata: ['fields' => $changedFields],
            );
        }

        return $this->success(
            new OrganizationResource($organization),
            'Profile updated successfully'
        );
    }

    /**
     * PATCH /api/v1/org/password
     * Needs the current password. Every OTHER session is signed out; the
     * one making the request stays logged in.
     */
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        /** @var Organization $organization */
        $organization = Auth::guard('organization')->user();

        $organization->update(['password' => $request->validated('password')]);

        $currentToken = $organization->currentAccessToken();
        $otherTokens = $organization->tokens();

        if ($currentToken instanceof PersonalAccessToken) {
            $otherTokens->where('id', '!=', $currentToken->id);
        }

        $otherTokens->delete();

        AuditLog::record(
            type: AuditLog::TYPE_UPDATE,
            action: 'Changed Password',
            location: AuditLog::LOCATION_SECURITY,
            actor: $organization,
            target: $organization,
            sensitive: true,
            details: 'Organization changed its password.',
        );

        return $this->success(null, 'Password changed successfully');
    }
}