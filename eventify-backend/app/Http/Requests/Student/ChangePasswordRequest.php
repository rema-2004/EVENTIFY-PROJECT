<?php

namespace App\Http\Requests\Student;

use App\Traits\ApiResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rules\Password;

class ChangePasswordRequest extends FormRequest
{
    use ApiResponse;

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'current_password' => ['required', 'string', 'current_password:sanctum'],
            // Same strength rules as registration.
            'password' => [
                'required',
                'confirmed',
                'different:current_password',
                Password::min(8)->mixedCase()->numbers(),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'current_password.current_password' => 'The current password is incorrect.',
            'password.different' => 'The new password must be different from the current password.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            $this->validationError($validator->errors(), 'Validation failed. Please check your inputs.')
        );
    }
}