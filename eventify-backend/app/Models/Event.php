<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use HasFactory, SoftDeletes;

    // ── Type constants ────────────────────────────────────────
    // Final taxonomy: competition, workshop, event, course.
    // All 4 share identical fields on this table — ONLY "competition"
    // has extra fields (team_size, prize), stored in the "competitions"
    // extension table. workshop/event/course need no extension table.
    public const TYPE_COMPETITION = 'competition';
    public const TYPE_WORKSHOP = 'workshop';
    public const TYPE_EVENT = 'event';
    public const TYPE_COURSE = 'course';

    // ── Status constants ──────────────────────────────────────
    public const STATUS_DRAFT = 'draft';
    public const STATUS_PENDING_REVIEW = 'pending_review';
    public const STATUS_PUBLISHED = 'published';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_COMPLETED = 'completed';

    protected $fillable = [
        'organization_id',
        'created_by',
        'title',
        'slug',
        'description',
        'type',
        'cover_image',
        'location',
        'requirements',
        'start_date',
        'end_date',
        'registration_deadline',
        'status',
        'admin_notes',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'registration_deadline' => 'datetime',
        ];
    }

    // ── Route model binding via slug ─────────────────────────
    // Makes /events/{event} resolve by slug instead of id —
    // e.g. /events/global-ai-innovation-challenge instead of /events/17.
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    // ── Relationships ─────────────────────────────────────────
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Extra fields available only when type = 'competition'.
     * Null for workshop / event / course.
     */
    public function competition(): HasOne
    {
        return $this->hasOne(Competition::class, 'id');
    }

    public function isCompetition(): bool
{
    return $this->type === 'competition';
}

    // ── Status helpers ────────────────────────────────────────
    public function isPublished(): bool
    {
        return $this->status === self::STATUS_PUBLISHED;
    }

    public function isPendingReview(): bool
    {
        return $this->status === self::STATUS_PENDING_REVIEW;
    }

    public function isRegistrationOpen(): bool
    {
        return $this->isPublished()
            && $this->registration_deadline
            && $this->registration_deadline->isFuture();
    }

    // ── Query scopes ──────────────────────────────────────────
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_PUBLISHED);
    }

    public function scopePendingReview(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_PENDING_REVIEW);
    }

    public function scopeOfType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    public function scopeUpcoming(Builder $query): Builder
    {
        return $query->where('start_date', '>', now());
    }

    public function scopeRegistrationOpen(Builder $query): Builder
    {
        return $query->published()
            ->where('registration_deadline', '>', now());
    }
}