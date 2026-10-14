<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Organization extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_SUSPENDED = 'suspended';

    protected $fillable = [
        'name',
        'slug',
        'email',
        'password',
        'phone',
        'logo',
        'license_document',
        'status',
        'admin_notes',
        'verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'verified_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        // The notifications table uses a polymorphic relation (no foreign
        // key), so the database cannot cascade-delete its rows. Clean them
        // up on permanent deletion only; a soft-deleted account keeps them.
        static::forceDeleted(function (self $organization) {
            DatabaseNotification::where('notifiable_type', $organization->getMorphClass())
                ->where('notifiable_id', $organization->getKey())
                ->delete();
        });
    }

    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }
}