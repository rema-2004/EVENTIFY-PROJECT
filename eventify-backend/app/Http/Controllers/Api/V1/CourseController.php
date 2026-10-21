<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\StoreCourseRequest;
use App\Http\Requests\Student\UpdateCourseRequest;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/v1/my/courses
     * The logged-in student's own courses, newest first.
     */
    public function index(): JsonResponse
    {
        $user = $this->student();

        if (! $user) {
            return $this->notStudent();
        }

        $courses = $user->courses()->latest('id')->paginate(15);

        $courses->through(fn (Course $course) => new CourseResource($course));

        return $this->successWithPagination($courses, 'Your courses retrieved');
    }

    /**
     * POST /api/v1/my/courses
     */
    public function store(StoreCourseRequest $request): JsonResponse
    {
        $user = $this->student();

        if (! $user) {
            return $this->notStudent();
        }

        $course = $user->courses()->create($request->validated());

        return $this->success(new CourseResource($course), 'Course added', 201);
    }

    /**
     * PATCH /api/v1/my/courses/{course}
     * Partial update — only the fields sent are changed.
     */
    public function update(UpdateCourseRequest $request, Course $course): JsonResponse
    {
        $user = $this->student();

        if (! $user) {
            return $this->notStudent();
        }

        if ($course->user_id !== $user->id) {
            return $this->error('Forbidden. This course does not belong to you.', 403);
        }

        $course->update($request->validated());

        return $this->success(new CourseResource($course), 'Course updated');
    }

    /**
     * DELETE /api/v1/my/courses/{course}
     */
    public function destroy(Course $course): JsonResponse
    {
        $user = $this->student();

        if (! $user) {
            return $this->notStudent();
        }

        if ($course->user_id !== $user->id) {
            return $this->error('Forbidden. This course does not belong to you.', 403);
        }

        $course->delete();

        return $this->success(null, 'Course deleted successfully');
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
        return $this->error('Only student accounts can manage courses.', 403);
    }
}