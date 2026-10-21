<?php

namespace App\Http\Requests\Admin;

use App\Traits\ApiResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UserRestrictionRequest extends FormRequest
{
    use ApiResponse;

    public function authorize(): bool
    {
        // Admin check already happened in the 'is.admin' middleware.
        return true;
    }

    public function rules(): array
    {
        return [
            'reason' => ['required', 'string', 'min:5', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'reason.required' => 'You must provide a reason.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            $this->validationError($validator->errors(), 'Validation failed. Please check your inputs.')
        );
    }
}