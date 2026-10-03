<?php

namespace App\Http\Requests\Admin;

use App\Traits\ApiResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class RejectEventRequest extends FormRequest
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
            'admin_notes' => ['required', 'string', 'min:5', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'admin_notes.required' => 'You must provide a reason for rejection.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            $this->validationError($validator->errors(), 'Validation failed. Please check your inputs.')
        );
    }
}