<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventRegistrationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'registered_at' => $this->registered_at?->toIso8601String(),
            'event' => $this->whenLoaded('event', fn () => new EventResource($this->event)),
            'team' => $this->whenLoaded('team', fn () => $this->team ? new TeamResource($this->team) : null),
            // Only present when the controller explicitly eager-loads
            // 'user' — relevant for admin/leader views, not for the
            // current user's own "/my/registrations" listing.
            'user' => $this->whenLoaded('user', fn () => new UserResource($this->user)),
        ];
    }
}