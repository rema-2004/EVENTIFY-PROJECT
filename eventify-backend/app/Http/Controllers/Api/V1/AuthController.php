<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    use ApiResponse;

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
            // role/status are NEVER accepted from client input.
        ]);

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
            return $this->error('Invalid credentials', 401);
        }

        if (! $user->isActive()) {
            return $this->error(
                'Your account is ' . $user->status . '. Please contact support.',
                403
            );
        }

        $token = $user->createToken('eventify-token')->plainTextToken;

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

    /** @var \Laravel\Sanctum\PersonalAccessToken $token */
    $token = $user->currentAccessToken();
    $token->delete();

    return $this->success(data: null, message: 'Logged out successfully');
}

    /**
     * GET /api/v1/me
     */
    public function me(): JsonResponse
    {
        return $this->success(new UserResource(Auth::user()));
    }
}