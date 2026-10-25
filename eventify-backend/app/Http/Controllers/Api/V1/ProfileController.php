<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\ChangePasswordRequest;
use App\Http\Requests\Student\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Mail\EmailChangeConfirmMail;
use App\Mail\EmailChangeNoticeMail;
use App\Models\AuditLog;
use App\Models\User;
use App\Traits\ApiResponse;
use App\Traits\ResolvesStudent;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;

class ProfileController extends Controller
{
    use ApiResponse;
    use ResolvesStudent;

    private const EMAIL_CONFIRM_MINUTES = 60;

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

        // A different email is never saved straight away: it waits for
        // the owner of the new address to confirm it.
        $newEmail = $data['email'] ?? null;
        unset($data['email']);
        $emailRequested = $newEmail !== null && $newEmail !== $user->email;

        $user->fill($data);

        $changedFields = array_keys($user->getDirty());

        if ($changedFields !== []) {
            $user->save();

            AuditLog::record(
                type: AuditLog::TYPE_UPDATE,
                action: 'Updated Profile',
                location: AuditLog::LOCATION_SETTINGS,
                actor: $user,
                target: $user,
                details: 'Participant updated their profile.',
                // Only the names of the changed fields, never their values.
                metadata: ['fields' => $changedFields],
            );
        }

        if ($emailRequested) {
            $this->requestEmailChange($user, $newEmail);
        }

        $message = $emailRequested
            ? 'Profile updated. Open the link we sent to your new email to confirm it.'
            : 'Profile updated successfully';

        return $this->success(new UserResource($user), $message);
    }

    /**
     * POST /api/v1/email/confirm  (public: the link is opened from the
     * mailbox, maybe on another device)
     * Body: { token }. Moves the pending email into the login email.
     */
    public function confirmEmail(Request $request): JsonResponse
    {
        $token = (string) $request->input('token');

        $user = $token === ''
            ? null
            : User::where('email_change_token', hash('sha256', $token))
                ->whereNotNull('pending_email')
                ->first();

        if (! $user || $user->email_change_expires_at?->isPast()) {
            return $this->error('This confirmation link is invalid or has expired.', 422);
        }

        $newEmail = $user->pending_email;

        // Someone may have registered this address while it was pending.
        $taken = User::withTrashed()
            ->where('email', $newEmail)
            ->where('id', '!=', $user->id)
            ->exists();

        if ($taken) {
            $this->clearPendingEmail($user);

            return $this->error('This email is already registered to another account.', 422);
        }

        try {
            $user->forceFill([
                'email' => $newEmail,
                'email_verified_at' => now(),
                'pending_email' => null,
                'email_change_token' => null,
                'email_change_expires_at' => null,
            ])->save();
        } catch (UniqueConstraintViolationException) {
            // Two people confirmed the same address at the same moment:
            // the unique index on users.email let only one through.
            $this->clearPendingEmail($user->fresh());

            return $this->error('This email is already registered to another account.', 422);
        }

        AuditLog::record(
            type: AuditLog::TYPE_UPDATE,
            action: 'Changed Email',
            location: AuditLog::LOCATION_SECURITY,
            actor: $user,
            target: $user,
            sensitive: true,
            details: 'Participant confirmed a new login email.',
        );

        return $this->success(new UserResource($user), 'Your email has been changed.');
    }

    /**
     * Stores the new address as pending, mails a confirmation link to it
     * and a heads-up to the current address.
     */
    private function requestEmailChange(User $user, string $newEmail): void
    {
        $token = Str::random(64);

        $user->forceFill([
            'pending_email' => $newEmail,
            // Only the hash is stored, like the password reset tokens.
            'email_change_token' => hash('sha256', $token),
            'email_change_expires_at' => now()->addMinutes(self::EMAIL_CONFIRM_MINUTES),
        ])->save();

        AuditLog::record(
            type: AuditLog::TYPE_UPDATE,
            action: 'Requested Email Change',
            location: AuditLog::LOCATION_SETTINGS,
            actor: $user,
            target: $user,
            sensitive: true,
            details: 'Participant asked to change their login email. Waiting for confirmation.',
        );

        $link = config('app.frontend_confirm_email_url') . '?' . http_build_query(['token' => $token]);

        // A mail server problem must not turn the request into a 500: the
        // user can simply ask again.
        try {
            Mail::to($newEmail)->send(new EmailChangeConfirmMail($link));
            Mail::to($user->email)->send(new EmailChangeNoticeMail($newEmail));
        } catch (\Throwable $e) {
            Log::warning('Email change mail failed', ['user_id' => $user->id, 'error' => $e->getMessage()]);
        }
    }

    private function clearPendingEmail(User $user): void
    {
        $user->forceFill([
            'pending_email' => null,
            'email_change_token' => null,
            'email_change_expires_at' => null,
        ])->save();
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