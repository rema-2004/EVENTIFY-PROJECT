<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'provider',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'completed_at' => 'date',
        ];
    }

    // ── Relationships ──────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ── Helpers ────────────────────────────────────────────────

    public function isCompleted(): bool
    {
        return $this->completed_at !== null;
    }
}