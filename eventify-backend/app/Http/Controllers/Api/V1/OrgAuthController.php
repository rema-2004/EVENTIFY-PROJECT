<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Organization\LoginOrganizationRequest;
use App\Http\Requests\Organization\RegisterOrganizationRequest;
use App\Http\Resources\OrganizationResource;
use App\Models\Organization;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Http\JsonResponse;

class OrgAuthController extends Controller
{
    use ApiResponse;

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
            'password' => Hash::make($validated['password']),
            // status defaults to 'pending' at the DB level.
            // Organization CANNOT publish events until an admin approves it.
        ]);

        // Tokens are issued on the "organization" Sanctum guard automatically,
        // because Organization uses HasApiTokens just like User does.
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
        $organization->currentAccessToken()->delete();

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
     * Generates a unique URL-friendly slug from the organization name.
     * Appends a random suffix if the base slug is already taken.
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