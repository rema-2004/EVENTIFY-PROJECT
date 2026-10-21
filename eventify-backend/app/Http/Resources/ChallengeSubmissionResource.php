<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\ChallengeSubmission
 */
class ChallengeSubmissionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'link' => $this->link,
            'description' => $this->description,
            'has_link' => $this->hasLink(),
            'created_at' => $this->created_at?->toIso8601String(),
            // Only present when the controller explicitly eager-loads 'user'.
            'user' => $this->whenLoaded('user', fn () => new UserResource($this->user)),
        ];
    }
}