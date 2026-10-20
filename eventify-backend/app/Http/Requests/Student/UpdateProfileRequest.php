<?php

namespace App\Http\Requests\Student;

use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    use ApiResponse;

    public function authorize(): bool
    {
        return true;
    }

    /**
     * Same phone normalization as registration, so the "unique" check
     * and the stored value use one canonical format.
     */
    protected function prepareForValidation(): void
    {
        if ($this->filled('phone')) {
            $this->merge([
                'phone' => User::normalizePhone($this->input('phone')) ?? $this->input('phone'),
            ]);
        }
    }

    public function rules(): array
    {
        $user = $this->user();

        // The email is also a login. Changing it needs the current
        // password, so a stolen session cannot take over the account by
        // switching the email.
        $emailIsChanging = $this->filled('email')
            && $this->input('email') !== $user?->email;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:150'],
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:150',
                Rule::unique('users', 'email')->ignore($user?->id),
            ],
            'current_password' => [
                $emailIsChanging ? 'required' : 'nullable',
                'string',
                'current_password:sanctum',
            ],
            'phone' => [
                'nullable',
                'string',
                'regex:/^\+?[0-9]{8,15}$/',
                Rule::unique('users', 'phone')->ignore($user?->id),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'This email is already registered.',
            'phone.unique' => 'This phone number is already registered.',
            'phone.regex' => 'Please enter a valid phone number (8-15 digits, optionally starting with +).',
            'current_password.required' => 'Your current password is required to change the email.',
            'current_password.current_password' => 'The current password is incorrect.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            $this->validationError($validator->errors(), 'Validation failed. Please check your inputs.')
        );
    }
}