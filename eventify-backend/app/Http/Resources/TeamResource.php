<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'max_members' => $this->max_members,
            'approved_members_count' => $this->whenCounted('approvedMembers'),
            'is_recruiting' => $this->is_recruiting,
            'status' => $this->status,
            'leader' => $this->whenLoaded('leader', fn () => [
                'id' => $this->leader->id,
                'name' => $this->leader->name,
            ]),
            'skills' => $this->whenLoaded('skills', fn () => $this->skills->pluck('name')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}