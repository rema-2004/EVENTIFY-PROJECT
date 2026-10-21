<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Course
 */
class CourseResource extends JsonResource
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
            'provider' => $this->provider,
            'completed_at' => $this->completed_at?->toDateString(),
            'is_completed' => $this->isCompleted(),
            'created_at' => $this->created_at?->toIso8601String(),
            // Only present when the controller explicitly eager-loads 'user'.
            'user' => $this->whenLoaded('user', fn () => new UserResource($this->user)),
        ];
    }
}