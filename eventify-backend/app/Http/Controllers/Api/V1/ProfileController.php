<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\ChangePasswordRequest;
use App\Http\Requests\Student\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Models\AuditLog;
use App\Traits\ApiResponse;
use App\Traits\ResolvesStudent;
use Illuminate\Http\JsonResponse;
use Laravel\Sanctum\PersonalAccessToken;

class ProfileController extends Controller
{
    use ApiResponse;
    use ResolvesStudent;

    /**
     * PATCH /api/v1/profile
     * Partial update — only the fields sent are changed. Viewing the
     * profile is the existing GET /api/v1/me.
     */
    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = $this->student();

        if (! $user) {
            return $this->notStudent();
        }

        // current_password was only needed for validation.
        $data = collect($request->validated())->except('current_password')->all();

        $user->fill($data);

        $changedFields = array_keys($user->getDirty());
        $emailChanged = in_array('email', $changedFields, true);

        if ($changedFields !== []) {
            $user->save();

            // The login email changing is a sensitive event.
            AuditLog::record(
                type: AuditLog::TYPE_UPDATE,
                action: 'Updated Profile',
                location: AuditLog::LOCATION_SETTINGS,
                actor: $user,
                target: $user,
                sensitive: $emailChanged,
                details: $emailChanged
                    ? 'Participant updated their profile and changed their login email.'
                    : 'Participant updated their profile.',
                // Only the names of the changed fields, never their values.
                metadata: ['fields' => $changedFields],
            );
        }

        return $this->success(new UserResource($user), 'Profile updated successfully');
    }

    /**
     * PATCH /api/v1/password
     * Needs the current password. Every OTHER session is signed out; the
     * one making the request stays logged in.
     */
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $user = $this->student();

        if (! $user) {
            return $this->notStudent();
        }

        $user->update(['password' => $request->validated('password')]);

        $currentToken = $user->currentAccessToken();
        $otherTokens = $user->tokens();

        if ($currentToken instanceof PersonalAccessToken) {
            $otherTokens->where('id', '!=', $currentToken->id);
        }

        $otherTokens->delete();

        AuditLog::record(
            type: AuditLog::TYPE_UPDATE,
            action: 'Changed Password',
            location: AuditLog::LOCATION_SECURITY,
            actor: $user,
            target: $user,
            sensitive: true,
            details: 'Participant changed their password.',
        );

        return $this->success(null, 'Password changed successfully');
    }

    private function notStudent(): JsonResponse
    {
        return $this->error('Only student accounts can update this profile.', 403);
    }
}