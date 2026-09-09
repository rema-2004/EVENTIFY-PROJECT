<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrganizationResource extends JsonResource
{
    /**
     * The ONLY shape of "organization" the React team should ever see.
     * password, remember_token, deleted_at, admin_notes (internal-only)
     * never leak through here.
     *
     * Note: license_document is intentionally NOT exposed as a public URL here.
     * It's a sensitive document — only the organization owner and admins should
     * access it, via a dedicated protected endpoint (to be added with the
     * admin approval feature), not a public asset() link.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'name'             => $this->name,
            'slug'             => $this->slug,
            'email'            => $this->email,
            'phone'            => $this->phone,
            'logo'             => $this->logo ? asset('storage/' . $this->logo) : null,
            'has_license_document' => ! is_null($this->license_document),
            'status'           => $this->status,
            'verified_at'      => $this->verified_at?->toIso8601String(),
            'joined_at'        => $this->created_at?->toIso8601String(),
        ];
    }
}