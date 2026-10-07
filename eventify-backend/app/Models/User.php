<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    public const ROLE_ADMIN = 'admin';
    public const ROLE_USER = 'user';

    public const STATUS_ACTIVE = 'active';
    public const STATUS_SUSPENDED = 'suspended';
    public const STATUS_BANNED = 'banned';

    public const PROVIDER_LOCAL = 'local';
    public const PROVIDER_GOOGLE = 'google';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'status',
        'google_id',
        'provider',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    public function isGoogleUser(): bool
    {
        return $this->provider === self::PROVIDER_GOOGLE;
    }

    public static function normalizePhone(?string $phone): ?string
    {
        if ($phone === null || trim($phone) === '') {
            return null;
        }

        $hasPlus = str_starts_with(trim($phone), '+');
        $digits = preg_replace('/\D+/', '', $phone);

        if ($digits === '') {
            return null;
        }

        return ($hasPlus ? '+' : '') . $digits;
    }

    public static function findByLogin(string $login): ?self
    {
        if (filter_var($login, FILTER_VALIDATE_EMAIL)) {
            return static::where('email', $login)->first();
        }

        return static::where('phone', static::normalizePhone($login))->first();
    }

        // ── Relationships ──────────────────────────────────────────

    public function registrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function teamMemberships(): HasMany
    {
        return $this->hasMany(TeamMember::class);
    }

    public function ledTeams(): HasMany
    {
        return $this->hasMany(Team::class, 'created_by');
    }

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }

    public function challengeSubmissions(): HasMany
    {
        return $this->hasMany(ChallengeSubmission::class);
    }

    // ── Query scopes ──────────────────────────────────────────

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    public function scopeAdmins(Builder $query): Builder
    {
        return $query->where('role', self::ROLE_ADMIN);
    }
}