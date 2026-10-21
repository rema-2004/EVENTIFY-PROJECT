<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Resources\UserResource;
use App\Models\AuditLog;
use App\Models\User;
use App\Traits\ApiResponse;
use App\Traits\HandlesPasswordReset;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    use ApiResponse, HandlesPasswordReset;

    /**
     * POST /api/v1/register
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        // استخدام validated لجلب البيانات الآمنة فقط
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            // role/status are NEVER accepted from client input — they are set
            // here explicitly so the response carries them right after create().
            'role' => User::ROLE_USER,
            'status' => User::STATUS_ACTIVE,
        ]);

        // Reload from the database so the DB defaults (role, status)
        // appear in the response instead of null.
        $user->refresh();

        AuditLog::record(
            type: AuditLog::TYPE_CREATE,
            action: 'Registered Account',
            location: AuditLog::LOCATION_USERS,
            actor: $user,
            target: $user,
            details: 'A new student account was registered.',
        );

        $token = $user->createToken('eventify-token')->plainTextToken;

        return $this->success([
            'user' => new UserResource($user),
            'token' => $token,
        ], 'Registered successfully', 201);
    }

    /**
     * POST /api/v1/login
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // The identifier can be an email OR a phone number.
        $user = User::findByLogin($request->identifier());

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            // $user is null when no account matches. The identifier the
            // person typed is deliberately NOT stored.
            AuditLog::record(
                type: AuditLog::TYPE_LOGIN,
                action: 'Login',
                location: AuditLog::LOCATION_DASHBOARD,
                actor: $user,
                status: AuditLog::STATUS_FAILED,
                details: 'Login attempt failed due to invalid credentials.',
            );

            return $this->error('Invalid credentials', 401);
        }

        if (! $user->isActive()) {
            AuditLog::record(
                type: AuditLog::TYPE_LOGIN,
                action: 'Login',
                location: AuditLog::LOCATION_DASHBOARD,
                actor: $user,
                status: AuditLog::STATUS_FAILED,
                details: 'Login was blocked because the account is ' . $user->status . '.',
            );

            return $this->error(
                'Your account is ' . $user->status . '. Please contact support.',
                403
            );
        }

        $token = $user->createToken('eventify-token')->plainTextToken;

        AuditLog::record(
            type: AuditLog::TYPE_LOGIN,
            action: 'Login',
            location: AuditLog::LOCATION_DASHBOARD,
            actor: $user,
            details: 'User successfully logged into the platform.',
        );

        return $this->success([
            'user' => new UserResource($user),
            'token' => $token,
        ], 'Logged in successfully');
    }

    /**
     * POST /api/v1/logout
     */
    public function logout(): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $token = $user->currentAccessToken();

        // TransientToken (session-based) has no delete() — only real API tokens do.
        if ($token instanceof PersonalAccessToken) {
            $token->delete();
        }

        AuditLog::record(
            type: AuditLog::TYPE_LOGOUT,
            action: 'Logout',
            location: AuditLog::LOCATION_DASHBOARD,
            actor: $user,
            details: 'User session was ended.',
        );

        return $this->success(null, 'Logged out successfully');
    }

    /**
     * POST /api/v1/forgot-password
     *
     * Always returns a generic success message, whether or not the
     * email exists — prevents attackers from using this endpoint to
     * discover which emails are registered (account enumeration).
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $email = $request->validated('email');
        $user = User::where('email', $email)->first();

        if ($user) {
            $this->createAndDeliverResetToken(
                'password_reset_tokens',
                $email,
                config('app.frontend_reset_url')
            );
        }

        return $this->success(
            null,
            'If an account with that email exists, a password reset link has been sent.'
        );
    }

    /**
     * POST /api/v1/reset-password
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $valid = $this->isResetTokenValid(
            'password_reset_tokens',
            $validated['email'],
            $validated['token']
        );

        if (! $valid) {
            return $this->error('This password reset link is invalid or has expired.', 400);
        }

        $user = User::where('email', $validated['email'])->first();
        $user->update(['password' => Hash::make($validated['password'])]);

        // One-time use — remove the token so it can't be replayed.
        $this->deleteResetToken('password_reset_tokens', $validated['email']);

        // Revoke all existing sessions for security, since the password changed.
        $user->tokens()->delete();

        AuditLog::record(
            type: AuditLog::TYPE_UPDATE,
            action: 'Reset Password',
            location: AuditLog::LOCATION_SECURITY,
            actor: $user,
            sensitive: true,
            details: 'Password was reset using a reset link.',
        );

        return $this->success(null, 'Password has been reset successfully. Please log in again.');
    }

    /**
     * GET /api/v1/me
     */
    public function me(): JsonResponse
    {
        return $this->success(new UserResource(Auth::user()));
    }
}