<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Traits\ApiResponse;

class LoginRequest extends FormRequest
{
    use ApiResponse;

    public function authorize(): bool
    {
        return true;
    }

    /**
     * Participants log in with a single identifier field that can be
     * EITHER an email or a phone number ("Email or Phone Number" on the
     * login page). The preferred field name is "login". "email" is still
     * accepted as a backward-compatible alias for existing clients.
     */
    public function rules(): array
    {
        return [
            'login' => ['required_without:email', 'nullable', 'string', 'max:150'],
            'email' => ['required_without:login', 'nullable', 'string', 'max:150'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * The identifier actually used for lookup, whichever field was sent.
     */
    public function identifier(): string
    {
        return trim((string) ($this->validated('login') ?? $this->validated('email')));
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            $this->validationError($validator->errors(), 'Validation failed. Please check your inputs.')
        );
    }
}