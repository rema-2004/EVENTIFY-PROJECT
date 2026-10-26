<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\DatabaseNotification;
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
        'headline',
        'location',
        'about',
        'open_to_opportunities',
        'interests',
        'experience',
        'password',
        'role',
        'status',
        'google_id',
        'provider',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'email_change_token',
        'cv_path',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'email_change_expires_at' => 'datetime',
            'open_to_opportunities' => 'boolean',
            'interests' => 'array',
            'experience' => 'array',
            'password' => 'hashed',
        ];
    }

    protected static function booted(): void
    {
        // The notifications table uses a polymorphic relation (no foreign
        // key), so the database cannot cascade-delete its rows. Clean them
        // up on permanent deletion only; a soft-deleted account keeps them.
        static::forceDeleted(function (self $user) {
            DatabaseNotification::where('notifiable_type', $user->getMorphClass())
                ->where('notifiable_id', $user->getKey())
                ->delete();
        });
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

    public function savedOpportunities(): HasMany
    {
        return $this->hasMany(SavedOpportunity::class);
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'user_skills')->withTimestamps();
    }

    // ── Profile ────────────────────────────────────────────────

    /**
     * What the profile page needs in one go: the skills and the three
     * numbers on its cards (competitions joined, saved, teams led).
     */
    public function loadProfile(): static
    {
        return $this->load('skills')->loadCount([
            'registrations as competitions_joined_count' => fn ($query) => $query
                ->where('status', EventRegistration::STATUS_CONFIRMED)
                ->whereHas('event', fn ($event) => $event->where('type', Event::TYPE_COMPETITION)),
            'savedOpportunities as saved_count',
            'ledTeams as teams_led_count',
        ]);
    }

    /**
     * The profile is "complete" (matching can start) once it has a
     * headline and at least one skill, like the setup wizard asks.
     */
    public function isProfileComplete(): bool
    {
        return filled($this->headline) && $this->hasSkills();
    }

    /**
     * 0-100: how many of the 8 parts of a profile are filled.
     */
    public function profileCompletion(): int
    {
        $parts = [
            filled($this->avatar),
            filled($this->headline),
            filled($this->location),
            filled($this->about),
            $this->hasSkills(),
            ! empty($this->experience),
            ! empty($this->interests),
            filled($this->cv_path),
        ];

        return (int) round(count(array_filter($parts)) / count($parts) * 100);
    }

    private function hasSkills(): bool
    {
        return $this->relationLoaded('skills')
            ? $this->skills->isNotEmpty()
            : $this->skills()->exists();
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