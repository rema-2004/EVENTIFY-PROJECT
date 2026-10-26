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
            'headline' => ['nullable', 'string', 'max:150'],
            'location' => ['nullable', 'string', 'max:150'],
            'about' => ['nullable', 'string', 'max:600'],
            'open_to_opportunities' => ['sometimes', 'boolean'],
            // Lists are sent whole: what arrives replaces what was saved.
            'skills' => ['sometimes', 'array', 'max:30'],
            'skills.*' => ['required', 'string', 'max:100', 'distinct:ignore_case'],
            'interests' => ['sometimes', 'array', 'max:20'],
            'interests.*' => ['required', 'string', 'max:60', 'distinct:ignore_case'],
            'experience' => ['sometimes', 'array', 'max:10'],
            'experience.*.title' => ['required', 'string', 'max:150'],
            'experience.*.organization' => ['nullable', 'string', 'max:150'],
            'experience.*.period' => ['nullable', 'string', 'max:100'],
            'experience.*.description' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'This email is already registered.',
            'phone.unique' => 'This phone number is already registered.',
            'phone.regex' => 'Please enter a valid phone number (8-15 digits, optionally starting with +).',
            'about.max' => 'The about text must not be longer than 600 characters.',
            'skills.max' => 'You can add up to 30 skills.',
            'skills.*.distinct' => 'Each skill can be added only once.',
            'interests.max' => 'You can add up to 20 interests.',
            'interests.*.distinct' => 'Each interest can be added only once.',
            'experience.max' => 'You can add up to 10 experiences.',
            'experience.*.title.required' => 'Each experience needs a title.',
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