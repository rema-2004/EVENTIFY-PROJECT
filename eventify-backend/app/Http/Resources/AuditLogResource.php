<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

/**
 * @mixin \App\Models\AuditLog
 */
class AuditLogResource extends JsonResource
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
            'timestamp' => $this->created_at?->toIso8601String(),
            // actor is all-null for a failed login on an unknown account.
            'actor' => [
                'type' => $this->shortType($this->actor_type),
                'id' => $this->actor_id,
                'name' => $this->actor_name,
                'role' => $this->actor_role,
            ],
            'action' => $this->action,
            'type' => $this->type,
            'location' => $this->location,
            'status' => $this->status,
            'is_sensitive' => $this->is_sensitive,
            'target' => [
                'type' => $this->shortType($this->target_type),
                'id' => $this->target_id,
                'label' => $this->target_label,
            ],
            'ip_address' => $this->ip_address,
            'user_agent' => $this->user_agent,
            'details' => $this->details,
            'metadata' => $this->metadata,
        ];
    }

    /**
     * 'App\Models\Organization' -> 'organization', so the frontend never
     * sees PHP class names.
     */
    private function shortType(?string $class): ?string
    {
        return $class ? Str::lower(class_basename($class)) : null;
    }
}