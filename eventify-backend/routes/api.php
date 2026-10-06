<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\OrgAuthController;
use App\Http\Controllers\Api\V1\EventController;
use App\Http\Controllers\Api\V1\EventRegistrationController;
use App\Http\Controllers\Api\V1\Admin\OrganizationManagementController;
use App\Http\Controllers\Api\V1\Admin\EventManagementController;
use App\Http\Controllers\Api\V1\Organization\EventController as OrgEventController;
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
    Route::middleware('throttle:5,1')->group(function () {
        // User Auth
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('/reset-password', [AuthController::class, 'resetPassword']);

        // Organization Auth
        Route::post('/org/register', [OrgAuthController::class, 'register']);
        Route::post('/org/login', [OrgAuthController::class, 'login']);
        Route::post('/org/forgot-password', [OrgAuthController::class, 'forgotPassword']);
        Route::post('/org/reset-password', [OrgAuthController::class, 'resetPassword']);
    });

    // — Protected User routes (require Bearer token) ————————————————
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);

        // Event registration
        Route::post('/events/{event}/register', [EventRegistrationController::class, 'register']);
        Route::delete('/events/{event}/register', [EventRegistrationController::class, 'cancel']);
        Route::get('/my/registrations', [EventRegistrationController::class, 'myRegistrations']);
    });

    // — Public Events routes (no auth required) ——————————————————————
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{event}', [EventController::class, 'show']);

    // — Protected Organization routes (require Organization Bearer token) ———
    Route::middleware('auth:organization')->group(function () {
        Route::post('/org/logout', [OrgAuthController::class, 'logout']);
        Route::get('/org/me', [OrgAuthController::class, 'me']);

        // Organization's own events
        Route::get('/org/events', [OrgEventController::class, 'index']);
        Route::get('/org/events/{event}', [OrgEventController::class, 'show']);
        Route::post('/org/events', [OrgEventController::class, 'store']);
        Route::patch('/org/events/{event}', [OrgEventController::class, 'update']);
        Route::delete('/org/events/{event}', [OrgEventController::class, 'destroy']);
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

        // Events review
        Route::get('/events', [EventManagementController::class, 'index']);
        Route::get('/events/{event}', [EventManagementController::class, 'show']);
        Route::patch('/events/{event}/approve', [EventManagementController::class, 'approve']);
        Route::patch('/events/{event}/reject', [EventManagementController::class, 'reject']);
    });

});