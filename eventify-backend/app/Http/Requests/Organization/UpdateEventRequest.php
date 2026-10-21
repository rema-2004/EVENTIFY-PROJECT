<?php

namespace App\Http\Requests\Organization;

use App\Models\Competition;
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

        // A partial update may send only some fields, so the competition
        // rules are judged on the EFFECTIVE values: what this request
        // sends, falling back on what is already stored.
        $isCompetition = $this->effectiveType() === Event::TYPE_COMPETITION;
        $participationType = $this->effectiveCompetitionValue('participation_type');
        $teamsAllowed = in_array($participationType, [
            Competition::PARTICIPATION_TEAM,
            Competition::PARTICIPATION_BOTH,
        ], true);

        $requireParticipation = $isSubmit && $isCompetition && $participationType === null;
        $requireMin = $isSubmit && $isCompetition && $teamsAllowed
            && $this->effectiveCompetitionValue('min_team_size') === null;
        $requireMax = $isSubmit && $isCompetition && $teamsAllowed
            && $this->effectiveCompetitionValue('max_team_size') === null;

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
            'min_team_size' => [
                $requireMin ? 'required' : 'nullable',
                'integer',
                'min:2',
                'max:50',
                'prohibited_if:participation_type,solo',
            ],
            'max_team_size' => [
                $requireMax ? 'required' : 'nullable',
                'integer',
                'min:2',
                'max:50',
                'prohibited_if:participation_type,solo',
                Rule::when($this->filled('min_team_size'), ['gte:min_team_size']),
            ],

            'action' => ['sometimes', 'string', Rule::in(['draft', 'submit'])],
        ];
    }

    /**
     * Checks that need the stored values too, so they run only after the
     * basic rules passed.
     *
     * @return array<int, callable>
     */
    public function after(): array
    {
        return [
            function (Validator $validator) {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                if ($this->effectiveType() !== Event::TYPE_COMPETITION) {
                    return;
                }

                $participationType = $this->effectiveCompetitionValue('participation_type');

                // A solo-only competition cannot carry a team size, even
                // when the type was set to solo by an earlier request.
                if ($participationType === Competition::PARTICIPATION_SOLO) {
                    foreach (['min_team_size', 'max_team_size'] as $field) {
                        if ($this->filled($field)) {
                            $validator->errors()->add(
                                $field,
                                'A solo-only competition cannot have a team size.'
                            );
                        }
                    }

                    return;
                }

                $min = $this->effectiveCompetitionValue('min_team_size');
                $max = $this->effectiveCompetitionValue('max_team_size');

                if ($min !== null && $max !== null && (int) $max < (int) $min) {
                    $validator->errors()->add(
                        'max_team_size',
                        'The maximum team size must be at least the minimum team size.'
                    );
                }
            },
        ];
    }

    /**
     * The event type after this request: the new one if sent,
     * otherwise the type already stored.
     */
    private function effectiveType(): ?string
    {
        return $this->has('type')
            ? $this->input('type')
            : $this->route('event')?->type;
    }

    /**
     * A competition field after this request: the sent value if the
     * request has the key, otherwise the stored one.
     */
    private function effectiveCompetitionValue(string $field): mixed
    {
        if ($this->has($field)) {
            return $this->input($field);
        }

        return $this->route('event')?->competition?->{$field};
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            $this->validationError($validator->errors(), 'Validation failed. Please check your inputs.')
        );
    }
}