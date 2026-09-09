<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource 
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'email'          => $this->email,
            'phone'          => $this->phone,
            'avatar'         => $this->avatar ? asset('storage/' . $this->avatar) : null, // أضفها إذا كان للمستخدم صورة شخصية
            'role'           => $this->role,
            'status'         => $this->status,
            'email_verified' => ! is_null($this->email_verified_at),
            'joined_at'      => $this->created_at?->toIso8601String(),
        ];
    }
}