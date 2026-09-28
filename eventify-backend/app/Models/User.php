<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    // ── Constants ──────────────────────────────────────────────
    // Single source of truth for role/status values. Avoids typo bugs
    // and gives IDE autocomplete anywhere these are used.
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

    // ── Role / status helpers ────────────────────────────────
    // Used in controllers/policies instead of comparing raw strings everywhere.

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

    // ── Login identifier helpers ──────────────────────────────

    /**
     * Normalizes a phone number so different typings of the same number
     * ("+962 7 9012 3456", "+962-7-9012-3456", "(+962) 790123456")
     * are stored and compared identically: keeps digits and a single
     * leading "+", strips spaces/dashes/parentheses.
     *
     * NOTE: this does NOT convert local formats to international
     * ("0790123456" vs "+962790123456" are still different strings).
     * Full country-aware normalization can be added later if needed.
     */
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

    /**
     * Finds a user by a single "login" identifier that may be either
     * an email address or a phone number.
     */
    public static function findByLogin(string $login): ?self
    {
        if (filter_var($login, FILTER_VALIDATE_EMAIL)) {
            return static::where('email', $login)->first();
        }

        return static::where('phone', static::normalizePhone($login))->first();
    }

    // ── Query scopes ──────────────────────────────────────────
    // User::active()->get()  instead of  User::where('status', 'active')->get()

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    public function scopeAdmins(Builder $query): Builder
    {
        return $query->where('role', self::ROLE_ADMIN);
    }
}