<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'type' => $this->type,
            'cover_image' => $this->resolveCoverImageUrl(),
            'location' => $this->location,
            'requirements' => $this->requirements,
            'start_date' => $this->start_date?->toIso8601String(),
            'end_date' => $this->end_date?->toIso8601String(),
            'registration_deadline' => $this->registration_deadline?->toIso8601String(),
            'status' => $this->status,
            'admin_notes' => $this->admin_notes,
            'display_status' => $this->displayStatus(),
            'is_registration_open' => $this->isRegistrationOpen(),

            // Only present for type = 'competition'; null otherwise.
            'team_size' => $this->whenLoaded('competition', fn () => $this->competition?->team_size),
            'prize' => $this->whenLoaded('competition', fn () => $this->competition?->prize),

            'organization' => $this->whenLoaded('organization', fn () => new OrganizationResource($this->organization)),

            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }

    private function resolveCoverImageUrl(): ?string
    {
        if (! $this->cover_image) {
            return null;
        }

        if (str_starts_with($this->cover_image, 'http')) {
            return $this->cover_image;
        }

        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk('public');

        return $disk->url($this->cover_image);
    }
}