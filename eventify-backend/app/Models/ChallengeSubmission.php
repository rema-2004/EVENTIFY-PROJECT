<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChallengeSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'link',
        'description',
    ];

    // ── Relationships ──────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ── Helpers ────────────────────────────────────────────────

    public function hasLink(): bool
    {
        return filled($this->link);
    }
}