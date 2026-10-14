<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\SavedOpportunity
 */
class SavedOpportunityResource extends JsonResource
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
            'saved_at' => $this->created_at?->toIso8601String(),
            // Only present when the controller explicitly eager-loads 'event'.
            'event' => $this->whenLoaded('event', fn () => new EventResource($this->event)),
        ];
    }
}