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

    // Same six values the frontend settings page offers.
    public const TYPE_UNIVERSITY = 'University';
    public const TYPE_COMPANY = 'Company';
    public const TYPE_NGO = 'NGO';
    public const TYPE_GOVERNMENT = 'Government';
    public const TYPE_STARTUP = 'Startup';
    public const TYPE_OTHER = 'Other';

    protected $fillable = [
        'name',
        'slug',
        'email',
        'password',
        'phone',
        'logo',
        'type',
        'description',
        'website',
        'city',
        'country',
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

    /**
     * Every allowed organization type, for validation.
     *
     * @return array<int, string>
     */
    public static function types(): array
    {
        return [
            self::TYPE_UNIVERSITY,
            self::TYPE_COMPANY,
            self::TYPE_NGO,
            self::TYPE_GOVERNMENT,
            self::TYPE_STARTUP,
            self::TYPE_OTHER,
        ];
    }

    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }
}