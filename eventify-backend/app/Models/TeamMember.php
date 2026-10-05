<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class TeamMember extends Model
{
    use HasFactory;

    // ── Role constants ────────────────────────────────────────
    public const ROLE_LEADER = 'leader';
    public const ROLE_MEMBER = 'member';

    // ── Status constants ──────────────────────────────────────
    public const STATUS_PENDING  = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_LEFT     = 'left';

    protected $fillable = [
        'team_id',
        'user_id',
        'role',
        'status',
        'requested_at',
        'responded_at',
    ];

    protected function casts(): array
    {
        return [
            'requested_at' => 'datetime',
            'responded_at' => 'datetime',
        ];
    }

    /**
     * Auto-fills "requested_at" for non-leader rows (actual join requests)
     * so any creation path — controller, seeder, tinker — gets an accurate
     * timestamp without having to remember to set it.
     *
     * Leaders are created with role=leader at the moment the team is
     * created, so "requested_at" is meaningless for them and stays null.
     */
    protected static function booted(): void
    {
        static::creating(function (TeamMember $member) {
            if (empty($member->requested_at) && $member->role !== self::ROLE_LEADER) {
               $member->requested_at = Carbon::now();
            }
        });
    }

    // ── Relationships ─────────────────────────────────────────
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ── Role helpers ──────────────────────────────────────────
    public function isLeader(): bool
    {
        return $this->role === self::ROLE_LEADER;
    }

    public function isMember(): bool
    {
        return $this->role === self::ROLE_MEMBER;
    }

    // ── Status helpers ────────────────────────────────────────
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    public function isRejected(): bool
    {
        return $this->status === self::STATUS_REJECTED;
    }

    public function isLeft(): bool
    {
        return $this->status === self::STATUS_LEFT;
    }
}