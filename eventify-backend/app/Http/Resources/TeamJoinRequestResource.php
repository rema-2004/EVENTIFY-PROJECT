<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * A TeamMember row seen as a "join request" (leader dashboard).
 * Only id + name of the requester for now; richer profile data
 * (skills, CV, GitHub...) arrives with the profile feature.
 */
class TeamJoinRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'requested_at' => $this->requested_at?->toIso8601String(),
            'responded_at' => $this->responded_at?->toIso8601String(),
            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ]),
        ];
    }
}