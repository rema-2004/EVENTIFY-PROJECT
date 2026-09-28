<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    use ApiResponse;

    public function authorize(): bool
    {
        // Anyone can attempt to register — actual restriction (if any)
        // happens in the controller/service layer, not here.
        return true;
    }

    /**
     * Normalize the phone BEFORE validation, so the "unique" check and the
     * stored value both use the same canonical format. Otherwise the same
     * number typed two ways ("+962 7 9012 3456" vs "+962790123456") would
     * bypass uniqueness and later break phone login lookups.
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
        return [
            'name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'string', 'email', 'max:150', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'regex:/^\+?[0-9]{8,15}$/', 'unique:users,phone'],
            'password' => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'This email is already registered.',
            'phone.unique' => 'This phone number is already registered.',
            'phone.regex' => 'Please enter a valid phone number (8-15 digits, optionally starting with +).',
        ];
    }

    /**
     * توحيد شكل استجابة الخطأ مع ApiResponse
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            $this->validationError($validator->errors(), 'Validation failed. Please check your inputs.')
        );
    }
}