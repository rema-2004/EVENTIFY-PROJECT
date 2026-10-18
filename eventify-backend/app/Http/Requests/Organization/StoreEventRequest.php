<?php

namespace App\Http\Requests\Organization;

use App\Models\Competition;
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

        // Participation rules only apply to competitions, and the team
        // size limits only when teams can take part.
        $isCompetition = $this->input('type') === Event::TYPE_COMPETITION;
        $teamsAllowed = in_array($this->input('participation_type'), [
            Competition::PARTICIPATION_TEAM,
            Competition::PARTICIPATION_BOTH,
        ], true);

        $requireParticipation = $isSubmit && $isCompetition;
        $requireTeamSize = $isSubmit && $isCompetition && $teamsAllowed;

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
           'registration_deadline' => [
             'nullable',
              'date',
            Rule::when($this->filled('start_date'), ['before_or_equal:start_date']),
                            ],

            'cover_image' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:5120'], // 5MB

            // Competition-only fields — ignored for other types.
            // team_size is the old free-text field, kept for compatibility;
            // the structured fields below are what the rules are enforced on.
            'team_size' => ['nullable', 'string', 'max:100'],
            'prize' => ['nullable', 'string', 'max:255'],

            'participation_type' => [
                $requireParticipation ? 'required' : 'nullable',
                'string',
                Rule::in([
                    Competition::PARTICIPATION_SOLO,
                    Competition::PARTICIPATION_TEAM,
                    Competition::PARTICIPATION_BOTH,
                ]),
            ],
            // A team needs at least 2 members; 50 is a sanity cap.
            // A solo-only competition has no team size at all.
            'min_team_size' => [
                $requireTeamSize ? 'required' : 'nullable',
                'integer',
                'min:2',
                'max:50',
                'prohibited_if:participation_type,solo',
            ],
            'max_team_size' => [
                $requireTeamSize ? 'required' : 'nullable',
                'integer',
                'min:2',
                'max:50',
                'prohibited_if:participation_type,solo',
                Rule::when($this->filled('min_team_size'), ['gte:min_team_size']),
            ],

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