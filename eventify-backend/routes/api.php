<?php

use App\Http\Controllers\Api\V1\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Eventify API Routes — v1
|--------------------------------------------------------------------------
| All routes are versioned under /api/v1/ from day one.
| This lets us introduce /api/v2/... later without breaking the React app.
*/

Route::prefix('v1')->group(function () {

    // ── Public auth routes ──────────────────────────────────
    // Rate-limited to prevent brute-force login attempts and registration spam.
    // "5 requests per minute per IP" — adjust as needed.
    Route::middleware('throttle:5,1')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
    });

    // ── Protected routes (require Bearer token) ─────────────
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);

        // Next features (organizations, events, ...) will be
        // registered here as we build them, feature by feature.
    });

});