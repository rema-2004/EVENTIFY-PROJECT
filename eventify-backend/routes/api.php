<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\OrgAuthController;
use App\Http\Controllers\Api\V1\EventController;
use App\Http\Controllers\Api\V1\EventRegistrationController;
use App\Http\Controllers\Api\V1\CourseController;
use App\Http\Controllers\Api\V1\ChallengeSubmissionController;
use App\Http\Controllers\Api\V1\SavedOpportunityController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\Admin\OrganizationManagementController;
use App\Http\Controllers\Api\V1\Admin\EventManagementController;
use App\Http\Controllers\Api\V1\Admin\AuditLogController;
use App\Http\Controllers\Api\V1\Admin\UserManagementController;
use App\Http\Controllers\Api\V1\Organization\EventController as OrgEventController;
use App\Http\Controllers\Api\V1\Organization\ApplicantController;
use App\Http\Controllers\Api\V1\Organization\ProfileController as OrgProfileController;
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

        // Student's own profile and password
        Route::patch('/profile', [ProfileController::class, 'update']);
        Route::patch('/password', [ProfileController::class, 'changePassword']);

        // Event registration
        Route::post('/events/{event}/register', [EventRegistrationController::class, 'register']);
        Route::delete('/events/{event}/register', [EventRegistrationController::class, 'cancel']);
        Route::get('/my/registrations', [EventRegistrationController::class, 'myRegistrations']);

        // Student's own courses
        Route::get('/my/courses', [CourseController::class, 'index']);
        Route::post('/my/courses', [CourseController::class, 'store']);
        Route::patch('/my/courses/{course}', [CourseController::class, 'update']);
        Route::delete('/my/courses/{course}', [CourseController::class, 'destroy']);

        // Student's own challenge submissions
        Route::get('/my/challenge-submissions', [ChallengeSubmissionController::class, 'index']);
        Route::post('/my/challenge-submissions', [ChallengeSubmissionController::class, 'store']);
        Route::patch('/my/challenge-submissions/{challengeSubmission}', [ChallengeSubmissionController::class, 'update']);
        Route::delete('/my/challenge-submissions/{challengeSubmission}', [ChallengeSubmissionController::class, 'destroy']);

        // Student's saved opportunities (bookmarked events)
        Route::get('/my/saved-opportunities', [SavedOpportunityController::class, 'index']);
        Route::post('/events/{event}/save', [SavedOpportunityController::class, 'store']);
        Route::delete('/events/{event}/save', [SavedOpportunityController::class, 'destroy']);
    });

    // — Public Events routes (no auth required) ——————————————————————
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{event}', [EventController::class, 'show']);

    // — Protected Organization routes (require Organization Bearer token) ———
    Route::middleware('auth:organization')->group(function () {
        Route::post('/org/logout', [OrgAuthController::class, 'logout']);
        Route::get('/org/me', [OrgAuthController::class, 'me']);

        // Organization's own profile and password
        Route::patch('/org/profile', [OrgProfileController::class, 'update']);
        Route::patch('/org/password', [OrgProfileController::class, 'changePassword']);

        // Organization's own events
        Route::get('/org/events', [OrgEventController::class, 'index']);
        Route::get('/org/events/{event}', [OrgEventController::class, 'show']);
        Route::post('/org/events', [OrgEventController::class, 'store']);
        Route::patch('/org/events/{event}', [OrgEventController::class, 'update']);
        Route::delete('/org/events/{event}', [OrgEventController::class, 'destroy']);

        // Applicants of the organization's events (review registrations)
        Route::get('/org/events/{event}/registrations', [ApplicantController::class, 'index']);
        Route::patch('/org/events/{event}/registrations/{registration}/approve', [ApplicantController::class, 'approve']);
        Route::patch('/org/events/{event}/registrations/{registration}/reject', [ApplicantController::class, 'reject']);
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

        // Users management (students)
        Route::get('/users', [UserManagementController::class, 'index']);
        Route::patch('/users/{user}/suspend', [UserManagementController::class, 'suspend']);
        Route::patch('/users/{user}/ban', [UserManagementController::class, 'ban']);
        Route::patch('/users/{user}/activate', [UserManagementController::class, 'activate']);

        // Audit log (read-only)
        Route::get('/audit-logs', [AuditLogController::class, 'index']);
        Route::get('/audit-logs/summary', [AuditLogController::class, 'summary']);
    });

});