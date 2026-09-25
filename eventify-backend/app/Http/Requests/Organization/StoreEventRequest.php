<?php

namespace App\Http\Requests\Organization;

use App\Models\Event;
use App\Traits\ApiResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class StoreEventRequest extends FormRequest
{
    use ApiResponse;

    public function authorize(): bool
    {
        // Organization approval check happens in the controller,
        // not here — this Request only validates input shape.
        return true;
    }

    public function rules(): array
    {
        // Draft = flexible, minimal requirements.
        // Submit (sent for admin review) = must be complete enough
        // to actually be shown to the public once approved.
        $isSubmit = $this->input('action') === 'submit';

        return [
            'title' => ['required', 'string', 'max:200'],
            'type' => ['required', 'string', Rule::in([
                Event::TYPE_COMPETITION,
                Event::TYPE_WORKSHOP,
                Event::TYPE_EVENT,
                Event::TYPE_COURSE,
            ])],
            'description' => ['required', 'string'],
            'location' => [$isSubmit ? 'required' : 'nullable', 'string', 'max:255'],
            'requirements' => ['nullable', 'string'],

            // Dates required only when submitting for review.
            'start_date' => [$isSubmit ? 'required' : 'nullable', 'date'],
            'end_date' => [$isSubmit ? 'required' : 'nullable', 'date', 'after_or_equal:start_date'],
            'registration_deadline' => ['nullable', 'date', 'before_or_equal:end_date'],

            'cover_image' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:5120'], // 5MB

            // Competition-only fields — ignored for other types.
            'team_size' => ['nullable', 'string', 'max:100'],
            'prize' => ['nullable', 'string', 'max:255'],

            'action' => ['required', 'string', Rule::in(['draft', 'submit'])],
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            $this->validationError($validator->errors(), 'Validation failed. Please check your inputs.')
        );
    }
}