<?php

namespace App\Http\Requests\Team;

use App\Traits\ApiResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreTeamRequest extends FormRequest
{
    use ApiResponse;

    public function authorize(): bool
    {
        // Event/registration checks happen in the controller.
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:1000'],
            'max_members' => ['required', 'integer', 'min:2', 'max:20'],
            'is_recruiting' => ['sometimes', 'boolean'],

            // Free-form skill tags ("Add more..." in the UI) — new ones
            // are created on demand in the skills catalog.
            'skills' => ['nullable', 'array', 'max:10'],
            'skills.*' => ['string', 'max:100'],
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            $this->validationError($validator->errors(), 'Validation failed. Please check your inputs.')
        );
    }
}