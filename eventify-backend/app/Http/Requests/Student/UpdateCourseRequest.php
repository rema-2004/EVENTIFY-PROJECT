<?php

namespace App\Http\Requests\Student;

use App\Traits\ApiResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateCourseRequest extends FormRequest
{
    use ApiResponse;

    public function authorize(): bool
    {
        // Login is enforced by the auth:sanctum middleware on the route.
        // Ownership is checked in the controller.
        return true;
    }

    public function rules(): array
    {
        return [
            // 'sometimes' — a partial update may omit the field entirely.
            'title' => ['sometimes', 'required', 'string', 'max:150'],
            'provider' => ['nullable', 'string', 'max:100'],
            // Sending null explicitly marks the course as "in progress" again.
            'completed_at' => ['nullable', 'date', 'before_or_equal:today'],
        ];
    }

    public function messages(): array
    {
        return [
            'completed_at.before_or_equal' => 'The completion date cannot be in the future.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            $this->validationError($validator->errors(), 'Validation failed. Please check your inputs.')
        );
    }
}