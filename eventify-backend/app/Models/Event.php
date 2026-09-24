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
    // "status" = admin workflow state (draft/pending_review/published/...).
    public const STATUS_DRAFT = 'draft';
    public const STATUS_PENDING_REVIEW = 'pending_review';
    public const STATUS_PUBLISHED = 'published';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_COMPLETED = 'completed';

    // ── Display status constants ──────────────────────────────
    // "display status" = computed LIVE from dates, only meaningful when
    // status = published. NEVER stored in the database — always derived
    // at request time so it's instantly accurate with no scheduled job.
    public const DISPLAY_UPCOMING = 'upcoming';
    public const DISPLAY_LIVE = 'live';
    public const DISPLAY_ENDED = 'ended';

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
        if (! $this->isPublished()) {
            return false;
        }

        // No deadline set = registration considered open indefinitely,
        // not closed. Null here means "no limit", not "expired".
        if (is_null($this->registration_deadline)) {
            return true;
        }

        return $this->registration_deadline->isFuture();
    }

    public function isCompetition(): bool
    {
        return $this->type === self::TYPE_COMPETITION;
    }

    /**
     * The user-facing status, computed live from dates.
     * Only meaningful for published events — returns null for
     * draft / pending_review / rejected / cancelled events, since
     * "Upcoming/Live/Ended" only applies to events the public can see.
     */
    public function displayStatus(): ?string
    {
        if (! $this->isPublished()) {
            return null;
        }

        if (! $this->start_date || ! $this->end_date) {
            return null; // dates not set yet — shouldn't normally happen for published events
        }

        $now = now();

        if ($this->start_date->greaterThan($now)) {
            return self::DISPLAY_UPCOMING;
        }

        if ($this->end_date->lessThan($now)) {
            return self::DISPLAY_ENDED;
        }

        // start_date <= now <= end_date (inclusive both ends)
        return self::DISPLAY_LIVE;
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
        return $query->published()->where('start_date', '>', now());
    }

    public function scopeLive(Builder $query): Builder
    {
        return $query->published()
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now());
    }

    public function scopeEnded(Builder $query): Builder
    {
        return $query->published()->where('end_date', '<', now());
    }

    public function scopeRegistrationOpen(Builder $query): Builder
    {
        return $query->published()
            ->where(function (Builder $q) {
                $q->whereNull('registration_deadline')
                    ->orWhere('registration_deadline', '>', now());
            });
    }

    /**
     * Combined filter scope for the future public Events listing endpoint.
     * Usage: Event::filter(['type' => 'workshop', 'search' => 'AI'])->get();
     */
    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['type'] ?? null, fn (Builder $q, string $type) => $q->ofType($type))
            ->when($filters['search'] ?? null, fn (Builder $q, string $search) =>
                $q->where('title', 'like', "%{$search}%")
            );
    }
}