<?php

namespace App\Http\Requests\Organization;

use App\Models\Organization;
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

    public function rules(): array
    {
        $organization = $this->user('organization');

        // The email is also the login. Changing it needs the current
        // password, so a stolen session cannot take over the account by
        // switching the email.
        $emailIsChanging = $this->filled('email')
            && $this->input('email') !== $organization?->email;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:150'],
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:150',
                Rule::unique('organizations', 'email')->ignore($organization?->id),
            ],
            'current_password' => [
                $emailIsChanging ? 'required' : 'nullable',
                'string',
                'current_password:organization',
            ],
            'phone' => ['nullable', 'string', 'max:20'],
            'type' => ['nullable', 'string', Rule::in(Organization::types())],
            'description' => ['nullable', 'string', 'max:2000'],
            // http/https only, so the frontend never renders a javascript: link.
            'website' => ['nullable', 'url:http,https', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'This email is already registered.',
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