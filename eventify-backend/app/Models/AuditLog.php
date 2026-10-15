<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use LogicException;
use Throwable;

/**
 * One row = one thing that happened on the platform (who, what, on what).
 * Append-only: rows are never updated or deleted through the model.
 */
class AuditLog extends Model
{
    // The table has created_at only — there is no updated_at column.
    public const UPDATED_AT = null;

    // ── Types (what kind of action) ────────────────────────────
    public const TYPE_LOGIN = 'login';
    public const TYPE_LOGOUT = 'logout';
    public const TYPE_CREATE = 'create';
    public const TYPE_UPDATE = 'update';
    public const TYPE_DELETE = 'delete';
    public const TYPE_APPROVE = 'approve';
    public const TYPE_REJECT = 'reject';
    public const TYPE_VERIFICATION = 'verification';
    public const TYPE_PERMISSION_CHANGE = 'permission_change';
    public const TYPE_EXPORT = 'export';

    // ── Statuses ───────────────────────────────────────────────
    public const STATUS_SUCCESS = 'success';
    public const STATUS_FAILED = 'failed';
    public const STATUS_WARNING = 'warning';

    // ── Actor roles (as the admin Audit Log page labels them) ──
    public const ROLE_ADMIN = 'Platform Admin';
    public const ROLE_ORGANIZATION = 'Organization';
    public const ROLE_PARTICIPANT = 'Participant';

    // ── Locations (the section of the platform) ────────────────
    public const LOCATION_DASHBOARD = 'Dashboard';
    public const LOCATION_USERS = 'Users Management';
    public const LOCATION_ORGANIZATIONS = 'Organizations';
    public const LOCATION_EVENTS = 'Events';
    public const LOCATION_REPORTS = 'Reports';
    public const LOCATION_SETTINGS = 'Settings';
    public const LOCATION_SECURITY = 'Security';

    // Metadata keys that are always dropped (top level only).
    private const SECRET_KEYS = [
        'password',
        'password_confirmation',
        'current_password',
        'token',
        'plain_text_token',
    ];

    protected $fillable = [
        'actor_type',
        'actor_id',
        'actor_name',
        'actor_role',
        'type',
        'action',
        'location',
        'status',
        'is_sensitive',
        'target_type',
        'target_id',
        'target_label',
        'ip_address',
        'user_agent',
        'details',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'is_sensitive' => 'boolean',
            'metadata' => 'array',
            'created_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        // Audit rows are evidence: refuse to change or remove them from code.
        // (Direct database access or query-builder deletes are not covered.)
        static::updating(function () {
            throw new LogicException('Audit log rows cannot be updated.');
        });

        static::deleting(function () {
            throw new LogicException('Audit log rows cannot be deleted.');
        });
    }

    /**
     * Write one audit row. Never throws: a failure to write the log must
     * not break the request being logged (login, approval, ...), so it is
     * reported to laravel.log and null is returned instead.
     *
     * $actor and $target are the models involved; names are copied into
     * the row so it stays readable after they are deleted. Never put
     * passwords or tokens in $details or $metadata.
     *
     * @param  array<string, mixed>  $metadata
     */
    public static function record(
        string $type,
        string $action,
        ?string $location = null,
        ?Model $actor = null,
        ?Model $target = null,
        string $status = self::STATUS_SUCCESS,
        bool $sensitive = false,
        ?string $details = null,
        array $metadata = [],
    ): ?self {
        try {
            $userAgent = request()->userAgent();

            return static::create([
                'actor_type' => $actor?->getMorphClass(),
                'actor_id' => $actor?->getKey(),
                'actor_name' => $actor ? static::labelFor($actor) : null,
                'actor_role' => $actor ? static::roleFor($actor) : null,
                'type' => $type,
                'action' => $action,
                'location' => $location,
                'status' => $status,
                'is_sensitive' => $sensitive,
                'target_type' => $target?->getMorphClass(),
                'target_id' => $target?->getKey(),
                'target_label' => $target ? static::labelFor($target) : null,
                'ip_address' => request()->ip(),
                'user_agent' => $userAgent ? Str::limit($userAgent, 500, '') : null,
                'details' => $details,
                'metadata' => $metadata === [] ? null : Arr::except($metadata, self::SECRET_KEYS),
            ]);
        } catch (Throwable $e) {
            Log::error('Audit log write failed: ' . $e->getMessage());

            return null;
        }
    }

    /**
     * Human-readable name of a model: its title (events) or name
     * (users, organizations).
     */
    private static function labelFor(Model $model): ?string
    {
        $label = $model->getAttribute('title') ?? $model->getAttribute('name');

        return $label !== null ? Str::limit((string) $label, 255, '') : null;
    }

    /**
     * The role label the admin Audit Log page shows for an actor.
     */
    private static function roleFor(Model $actor): ?string
    {
        return match (true) {
            $actor instanceof Organization => self::ROLE_ORGANIZATION,
            $actor instanceof User => $actor->isAdmin() ? self::ROLE_ADMIN : self::ROLE_PARTICIPANT,
            default => null,
        };
    }
}