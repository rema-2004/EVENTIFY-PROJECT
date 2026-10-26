<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource 
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'email'          => $this->email,
            'pending_email'  => $this->pending_email,
            'phone'          => $this->phone,
            'avatar'         => $this->avatar ? asset('storage/' . $this->avatar) : null,
            'cover_image'    => $this->cover_image ? asset('storage/' . $this->cover_image) : null,
            'headline'       => $this->headline,
            'location'       => $this->location,
            'about'          => $this->about,
            'open_to_opportunities' => (bool) ($this->open_to_opportunities ?? true),
            'interests'      => $this->interests ?? [],
            'experience'     => $this->experience ?? [],
            // The CV file itself is private; only whether it exists and its name.
            'has_cv'         => filled($this->cv_path),
            'cv_name'        => $this->cv_original_name,
            // These come only where the controller loaded the skills
            // (the profile, /me, applicant lists): lists of users stay light.
            'skills'         => $this->whenLoaded('skills', fn () => $this->skills->pluck('name')->values()),
            'profile_complete'   => $this->whenLoaded('skills', fn () => $this->isProfileComplete()),
            'profile_completion' => $this->whenLoaded('skills', fn () => $this->profileCompletion()),
            'stats'          => $this->when(
                array_key_exists('competitions_joined_count', $this->resource->getAttributes()),
                fn () => [
                    'competitions_joined' => (int) $this->competitions_joined_count,
                    'saved' => (int) $this->saved_count,
                    'teams_led' => (int) $this->teams_led_count,
                ]
            ),
            'role'           => $this->role,
            'status'         => $this->status,
            'email_verified' => ! is_null($this->email_verified_at),
            'joined_at'      => $this->created_at?->toIso8601String(),
        ];
    }
}