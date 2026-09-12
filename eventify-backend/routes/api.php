<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\OrgAuthController;
use App\Http\Controllers\Api\V1\Admin\OrganizationManagementController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Eventify API Routes - v1
|--------------------------------------------------------------------------
|
| All routes are versioned under /api/v1/ from day one.
| This lets us introduce /api/v2/... later without breaking the React app.
|
*/

Route::prefix('v1')->group(function () {

    // — Public auth routes ——————————————————————————————————————————
    // Rate-limited to prevent brute-force login attempts and registration spam.
    Route::middleware('throttle:5,1')->group(function () {
        // User Auth
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);

        // Organization Auth
        Route::post('/org/register', [OrgAuthController::class, 'register']);
        Route::post('/org/login', [OrgAuthController::class, 'login']);
    });

    // — Protected User routes (require Bearer token) ————————————————
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    // — Protected Organization routes (require Organization Bearer token) ———
    Route::middleware('auth:organization')->group(function () {
        Route::post('/org/logout', [OrgAuthController::class, 'logout']);
        Route::get('/org/me', [OrgAuthController::class, 'me']);
    });

    // — Protected Admin routes (require Bearer token + role=admin) ————————
    // Uses the SAME auth:sanctum guard as regular users (admin is a role
    // on the users table, not a separate account type), plus the
    // 'is.admin' middleware which blocks anyone who isn't role=admin.
    Route::prefix('admin')->middleware(['auth:sanctum', 'is.admin'])->group(function () {
        Route::get('/organizations', [OrganizationManagementController::class, 'index']);
        Route::get('/organizations/{organization}', [OrganizationManagementController::class, 'show']);
        Route::get('/organizations/{organization}/license', [OrganizationManagementController::class, 'downloadLicense']);
        Route::patch('/organizations/{organization}/approve', [OrganizationManagementController::class, 'approve']);
        Route::patch('/organizations/{organization}/reject', [OrganizationManagementController::class, 'reject']);
    });

});