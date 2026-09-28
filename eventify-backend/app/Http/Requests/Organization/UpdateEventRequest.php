<?php

namespace App\Http\Requests\Organization;

use App\Models\Event;
use App\Traits\ApiResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class UpdateEventRequest extends FormRequest
{
    use ApiResponse;

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isSubmit = $this->input('action') === 'submit';

        return [
            'title' => ['sometimes', 'required', 'string', 'max:200'],
            'type' => ['sometimes', 'required', 'string', Rule::in([
                Event::TYPE_COMPETITION,
                Event::TYPE_WORKSHOP,
                Event::TYPE_EVENT,
                Event::TYPE_COURSE,
            ])],
            'description' => ['sometimes', 'required', 'string'],
            'location' => [$isSubmit ? 'required' : 'nullable', 'string', 'max:255'],
            'requirements' => ['nullable', 'string'],

            'start_date' => [$isSubmit ? 'required' : 'nullable', 'date'],
            'end_date' => [$isSubmit ? 'required' : 'nullable', 'date', 'after_or_equal:start_date'],
            'registration_deadline' => [
                'nullable',
                'date',
                // Registration must close by the time the event starts.
                // Only enforced when start_date is present (drafts may omit it).
                Rule::when($this->filled('start_date'), ['before_or_equal:start_date']),
            ],

            'cover_image' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:5120'],

            'team_size' => ['nullable', 'string', 'max:100'],
            'prize' => ['nullable', 'string', 'max:255'],

            'action' => ['sometimes', 'string', Rule::in(['draft', 'submit'])],
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            $this->validationError($validator->errors(), 'Validation failed. Please check your inputs.')
        );
    }
}