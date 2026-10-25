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
            'submission_status' => $this->submission_status,
            'submitted_at' => $this->submitted_at?->toIso8601String(),
            'reviewed_at' => $this->reviewed_at?->toIso8601String(),
            // Shown so the leader knows what to fix before resubmitting.
            'rejection_reason' => $this->rejection_reason,
            'leader' => $this->whenLoaded('leader', fn () => [
                'id' => $this->leader->id,
                'name' => $this->leader->name,
            ]),
            'skills' => $this->whenLoaded('skills', fn () => $this->skills->pluck('name')),
            // Approved members only. Requires eager-loading 'approvedMembers.user'.
            'members' => $this->whenLoaded('approvedMembers', fn () => $this->approvedMembers->map(fn ($member) => [
                'user_id' => $member->user->id,
                'name' => $member->user->name,
                'role' => $member->role,
            ])),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}