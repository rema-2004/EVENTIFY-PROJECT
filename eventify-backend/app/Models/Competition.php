<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Competition extends Model
{
    use HasFactory;

    // ── Participation types ───────────────────────────────────
    // Same three values the frontend filter uses.
    public const PARTICIPATION_SOLO = 'solo';   // individuals only
    public const PARTICIPATION_TEAM = 'team';   // teams only
    public const PARTICIPATION_BOTH = 'both';   // either

    protected $table = 'competitions';

    // المفتاح الرئيسي مشترك مع events.id وليس auto-increment
    protected $primaryKey = 'id';
    public $incrementing = false;

    // لا نملك حقول timestamps هنا لأنها موجودة في جدول events الأساسي
    public $timestamps = false;

    protected $fillable = [
        'id',
        'team_size',
        'prize',
        'participation_type',
        'min_team_size',
        'max_team_size',
    ];

    protected function casts(): array
    {
        return [
            'min_team_size' => 'integer',
            'max_team_size' => 'integer',
        ];
    }

    /**
     * الفعالية الأساسية التي تمتد منها هذه المسابقة
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'id');
    }

    // ── Participation rules ───────────────────────────────────
    // A NULL participation_type (competitions created before these
    // fields existed) is treated as "both": no restriction applies.

    /**
     * Can an individual register on their own?
     */
    public function allowsSolo(): bool
    {
        return $this->participation_type !== self::PARTICIPATION_TEAM;
    }

    /**
     * Can teams take part?
     */
    public function allowsTeams(): bool
    {
        return $this->participation_type !== self::PARTICIPATION_SOLO;
    }

    /**
     * Is a team with this many members allowed? Used when a team is
     * created or joined, so it can never exceed (or fall below) the
     * limits the organization set. No limits set means no restriction.
     */
    public function allowsTeamSize(int $size): bool
    {
        if (! $this->allowsTeams()) {
            return false;
        }

        if ($this->min_team_size !== null && $size < $this->min_team_size) {
            return false;
        }

        if ($this->max_team_size !== null && $size > $this->max_team_size) {
            return false;
        }

        return true;
    }
}