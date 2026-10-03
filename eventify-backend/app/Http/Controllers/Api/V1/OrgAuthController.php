<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Organization\LoginOrganizationRequest;
use App\Http\Requests\Organization\RegisterOrganizationRequest;
use App\Http\Resources\OrganizationResource;
use App\Models\Organization;
use App\Traits\ApiResponse;
use App\Traits\HandlesPasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;

class OrgAuthController extends Controller
{
    use ApiResponse, HandlesPasswordReset;

    /**
     * POST /api/v1/org/register
     */
    public function register(RegisterOrganizationRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $organization = Organization::create([
            'name' => $validated['name'],
            'slug' => $this->generateUniqueSlug($validated['name']),
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => $validated['password'],
            // status defaults to 'pending' at the DB level.
            // Organization CANNOT publish events until an admin approves it.
        ]);

        $token = $organization->createToken('eventify-org-token')->plainTextToken;

        return $this->success([
            'organization' => new OrganizationResource($organization),
            'token' => $token,
        ], 'Organization registered successfully. Awaiting admin approval.', 201);
    }

    /**
     * POST /api/v1/org/login
     */
    public function login(LoginOrganizationRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $organization = Organization::where('email', $validated['email'])->first();

        if (! $organization || ! Hash::check($validated['password'], $organization->password)) {
            return $this->error('Invalid credentials', 401);
        }

        if ($organization->status === Organization::STATUS_SUSPENDED) {
            return $this->error('Your organization account has been suspended. Please contact support.', 403);
        }

        if ($organization->status === Organization::STATUS_REJECTED) {
            return $this->error('Your organization application was rejected. Please contact support.', 403);
        }

        // Note: 'pending' organizations ARE allowed to log in — they just
        // can't publish events yet. This lets them complete their profile
        // (logo, license, description) while waiting for admin approval.

        $token = $organization->createToken('eventify-org-token')->plainTextToken;

        return $this->success([
            'organization' => new OrganizationResource($organization),
            'token' => $token,
        ], 'Logged in successfully');
    }

    /**
     * POST /api/v1/org/logout
     * Requires auth:organization guard.
     */
    public function logout(): JsonResponse
    {
        /** @var \App\Models\Organization $organization */
        $organization = Auth::guard('organization')->user();

        $token = $organization->currentAccessToken();

        // TransientToken (session-based) has no delete() — only real API tokens do.
        if ($token instanceof PersonalAccessToken) {
            $token->delete();
        }

        return $this->success(null, 'Logged out successfully');
    }

    /**
     * GET /api/v1/org/me
     * Requires auth:organization guard.
     */
    public function me(): JsonResponse
    {
        return $this->success(
            new OrganizationResource(Auth::guard('organization')->user())
        );
    }

    /**
     * POST /api/v1/org/forgot-password
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $email = $request->validated('email');
        $organization = Organization::where('email', $email)->first();

        if ($organization) {
            $this->createAndDeliverResetToken(
                'organization_password_reset_tokens',
                $email,
                config('app.frontend_org_reset_url')
            );
        }

        return $this->success(
            null,
            'If an organization account with that email exists, a password reset link has been sent.'
        );
    }

    /**
     * POST /api/v1/org/reset-password
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $valid = $this->isResetTokenValid(
            'organization_password_reset_tokens',
            $validated['email'],
            $validated['token']
        );

        if (! $valid) {
            return $this->error('This password reset link is invalid or has expired.', 400);
        }

        $organization = Organization::where('email', $validated['email'])->first();

        if (! $organization) {
            return $this->error('This password reset link is invalid or has expired.', 400);
        }

        $organization->update(['password' => $validated['password']]);

        $this->deleteResetToken('organization_password_reset_tokens', $validated['email']);

        $organization->tokens()->delete();

        return $this->success(null, 'Password has been reset successfully. Please log in again.');
    }

    /**
     * Generates a unique URL-friendly slug from the organization name.
     * Appends a numeric suffix (-1, -2, ...) if the base slug is taken.
     */
    private function generateUniqueSlug(string $name): string
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $counter = 1;

        while (Organization::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}