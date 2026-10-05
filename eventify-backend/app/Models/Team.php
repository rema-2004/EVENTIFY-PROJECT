<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Team extends Model
{
    use HasFactory, SoftDeletes;

    public const STATUS_OPEN = 'open';
    public const STATUS_CLOSED = 'closed';
    public const STATUS_DISQUALIFIED = 'disqualified';

    // Note: role constants (leader/member) live ONLY in TeamMember,
    // since "role" is a column on team_members, not on this table.
    // Always reference TeamMember::ROLE_LEADER, never duplicate it here.

    protected $fillable = [
        'event_id',
        'created_by',
        'name',
        'description',
        'max_members',
        'is_recruiting',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'is_recruiting' => 'boolean',
        ];
    }

    // ── Relationships ─────────────────────────────────────────
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function leader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * ALL roster entries — pending, approved, rejected, left.
     * For active members only, use approvedMembers().
     */
    public function members(): HasMany
    {
        return $this->hasMany(TeamMember::class);
    }

    public function approvedMembers(): HasMany
    {
        return $this->members()->where('status', TeamMember::STATUS_APPROVED);
    }

    public function pendingRequests(): HasMany
    {
        return $this->members()->where('status', TeamMember::STATUS_PENDING);
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'team_skills')
            ->withTimestamps();
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }

    // ── Helpers ────────────────────────────────────────────────
    public function approvedMembersCount(): int
    {
        return $this->approvedMembers()->count();
    }

    public function isFull(): bool
    {
        return $this->approvedMembersCount() >= $this->max_members;
    }

    public function isOpen(): bool
    {
        return $this->status === self::STATUS_OPEN;
    }

    public function isClosed(): bool
    {
        return $this->status === self::STATUS_CLOSED;
    }

    public function canAcceptNewMember(): bool
    {
        return $this->isOpen() && $this->is_recruiting && ! $this->isFull();
    }

    /**
     * Whether the given user is this team's leader (creator).
     * Used to authorize leader-only actions (approve/reject/kick).
     */
    public function isLedBy(User|int $user): bool
    {
        $userId = $user instanceof User ? $user->id : $user;

        return $this->created_by === $userId;
    }

    /**
     * Whether the given user already has a pending or approved
     * membership row — used to block duplicate join requests.
     */
    public function hasMember(User|int $user): bool
    {
        $userId = $user instanceof User ? $user->id : $user;

        return $this->members()
            ->where('user_id', $userId)
            ->whereIn('status', [TeamMember::STATUS_PENDING, TeamMember::STATUS_APPROVED])
            ->exists();
    }

    // ── Scopes ────────────────────────────────────────────────
    public function scopeRecruiting(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_OPEN)->where('is_recruiting', true);
    }

    public function scopeOpen(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_OPEN);
    }
}