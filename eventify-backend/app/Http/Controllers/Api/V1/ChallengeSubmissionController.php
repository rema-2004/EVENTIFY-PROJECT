<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\StoreChallengeSubmissionRequest;
use App\Http\Requests\Student\UpdateChallengeSubmissionRequest;
use App\Http\Resources\ChallengeSubmissionResource;
use App\Models\ChallengeSubmission;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ChallengeSubmissionController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/v1/my/challenge-submissions
     * The logged-in student's own submissions, newest first.
     */
    public function index(): JsonResponse
    {
        $user = $this->student();

        if (! $user) {
            return $this->notStudent();
        }

        $submissions = $user->challengeSubmissions()->latest('id')->paginate(15);

        $submissions->through(fn (ChallengeSubmission $s) => new ChallengeSubmissionResource($s));

        return $this->successWithPagination($submissions, 'Your challenge submissions retrieved');
    }

    /**
     * POST /api/v1/my/challenge-submissions
     */
    public function store(StoreChallengeSubmissionRequest $request): JsonResponse
    {
        $user = $this->student();

        if (! $user) {
            return $this->notStudent();
        }

        $submission = $user->challengeSubmissions()->create($request->validated());

        return $this->success(new ChallengeSubmissionResource($submission), 'Challenge submission added', 201);
    }

    /**
     * PATCH /api/v1/my/challenge-submissions/{challengeSubmission}
     * Partial update — only the fields sent are changed.
     */
    public function update(
        UpdateChallengeSubmissionRequest $request,
        ChallengeSubmission $challengeSubmission
    ): JsonResponse {
        $user = $this->student();

        if (! $user) {
            return $this->notStudent();
        }

        if ($challengeSubmission->user_id !== $user->id) {
            return $this->error('Forbidden. This challenge submission does not belong to you.', 403);
        }

        $challengeSubmission->update($request->validated());

        return $this->success(new ChallengeSubmissionResource($challengeSubmission), 'Challenge submission updated');
    }

    /**
     * DELETE /api/v1/my/challenge-submissions/{challengeSubmission}
     */
    public function destroy(ChallengeSubmission $challengeSubmission): JsonResponse
    {
        $user = $this->student();

        if (! $user) {
            return $this->notStudent();
        }

        if ($challengeSubmission->user_id !== $user->id) {
            return $this->error('Forbidden. This challenge submission does not belong to you.', 403);
        }

        $challengeSubmission->delete();

        return $this->success(null, 'Challenge submission deleted successfully');
    }

    /**
     * auth:sanctum accepts any token type, so an organization token can
     * reach this controller — only real student accounts are allowed.
     */
    private function student(): ?User
    {
        $user = Auth::user();

        return $user instanceof User ? $user : null;
    }

    private function notStudent(): JsonResponse
    {
        return $this->error('Only student accounts can manage challenge submissions.', 403);
    }
}