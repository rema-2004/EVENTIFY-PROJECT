<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\ApiResponse;
use App\Traits\ResolvesStudent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * The student's profile picture, cover picture and CV.
 *
 * Pictures are public (they show on the profile); the CV is private: it
 * is stored outside the public folder and only its owner can download it.
 */
class ProfileFilesController extends Controller
{
    use ApiResponse;
    use ResolvesStudent;

    private const AVATAR_MAX_KB = 2048;
    private const COVER_MAX_KB = 4096;
    private const CV_MAX_KB = 10240;

    /**
     * POST /api/v1/profile/avatar   (multipart, field "image")
     */
    public function uploadAvatar(Request $request): JsonResponse
    {
        return $this->storeImage($request, 'avatar', 'avatars', self::AVATAR_MAX_KB);
    }

    /**
     * POST /api/v1/profile/cover   (multipart, field "image")
     */
    public function uploadCover(Request $request): JsonResponse
    {
        return $this->storeImage($request, 'cover_image', 'covers', self::COVER_MAX_KB);
    }

    /**
     * DELETE /api/v1/profile/avatar
     */
    public function deleteAvatar(): JsonResponse
    {
        return $this->removeImage('avatar');
    }

    /**
     * DELETE /api/v1/profile/cover
     */
    public function deleteCover(): JsonResponse
    {
        return $this->removeImage('cover_image');
    }

    /**
     * POST /api/v1/profile/cv   (multipart, field "cv": PDF or Word, up to 10 MB)
     * Saving a new CV replaces the old one.
     */
    public function uploadCv(Request $request): JsonResponse
    {
        $user = $this->student();

        if (! $user) {
            return $this->notStudent();
        }

        $validator = Validator::make($request->all(), [
            'cv' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:' . self::CV_MAX_KB],
        ], [
            'cv.required' => 'Please choose a CV file.',
            'cv.mimes' => 'The CV must be a PDF or a Word document.',
            'cv.max' => 'The CV must not be larger than 10 MB.',
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $file = $request->file('cv');
        $old = $user->cv_path;

        $user->forceFill([
            'cv_path' => $file->store('cvs', 'local'),
            'cv_original_name' => $file->getClientOriginalName(),
        ])->save();

        $this->deleteFile('local', $old);

        return $this->success(new UserResource($user->loadProfile()), 'CV saved successfully');
    }

    /**
     * GET /api/v1/profile/cv   (the owner downloads their own CV)
     */
    public function downloadCv(): StreamedResponse|JsonResponse
    {
        $user = $this->student();

        if (! $user) {
            return $this->notStudent();
        }

        if (! $user->cv_path || ! Storage::disk('local')->exists($user->cv_path)) {
            return $this->error('You have not uploaded a CV yet.', 404);
        }

        return Storage::disk('local')->download($user->cv_path, $user->cv_original_name ?: 'cv');
    }

    /**
     * DELETE /api/v1/profile/cv
     */
    public function deleteCv(): JsonResponse
    {
        $user = $this->student();

        if (! $user) {
            return $this->notStudent();
        }

        $old = $user->cv_path;

        $user->forceFill(['cv_path' => null, 'cv_original_name' => null])->save();

        $this->deleteFile('local', $old);

        return $this->success(new UserResource($user->loadProfile()), 'CV removed');
    }

    private function storeImage(Request $request, string $column, string $folder, int $maxKb): JsonResponse
    {
        $user = $this->student();

        if (! $user) {
            return $this->notStudent();
        }

        $validator = Validator::make($request->all(), [
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:' . $maxKb],
        ], [
            'image.required' => 'Please choose an image.',
            'image.image' => 'The file must be an image.',
            'image.mimes' => 'The image must be a JPG, PNG or WEBP file.',
            'image.max' => 'The image must not be larger than ' . intdiv($maxKb, 1024) . ' MB.',
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $old = $user->{$column};

        $user->forceFill([$column => $request->file('image')->store($folder, 'public')])->save();

        $this->deleteFile('public', $old);

        return $this->success(new UserResource($user->loadProfile()), 'Picture saved successfully');
    }

    private function removeImage(string $column): JsonResponse
    {
        $user = $this->student();

        if (! $user) {
            return $this->notStudent();
        }

        $old = $user->{$column};

        $user->forceFill([$column => null])->save();

        $this->deleteFile('public', $old);

        return $this->success(new UserResource($user->loadProfile()), 'Picture removed');
    }

    private function deleteFile(string $disk, ?string $path): void
    {
        if ($path && Storage::disk($disk)->exists($path)) {
            Storage::disk($disk)->delete($path);
        }
    }

    private function notStudent(): JsonResponse
    {
        return $this->error('Only student accounts can change this profile.', 403);
    }
}