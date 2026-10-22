<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

/**
 * One in-app notification type for the whole platform. The "kind" tells
 * the front end what happened (registration_approved, team_rejected...),
 * "message" is ready to show, and "extra" carries ids for links.
 *
 * Stored in the notifications table (database channel only).
 */
class PlatformNotification extends Notification
{
    /**
     * @param  array<string, mixed>  $extra
     */
    public function __construct(
        public string $kind,
        public string $message,
        public array $extra = [],
    ) {
    }

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return array_merge(['kind' => $this->kind, 'message' => $this->message], $this->extra);
    }

    /**
     * Sends a notification without ever breaking the action that caused
     * it: a failed notification is logged, not thrown at the user.
     *
     * @param  array<string, mixed>  $extra
     */
    public static function send(?object $notifiable, string $kind, string $message, array $extra = []): void
    {
        if (! $notifiable) {
            return;
        }

        try {
            $notifiable->notify(new self($kind, $message, $extra));
        } catch (\Throwable $e) {
            Log::warning('Notification failed', ['kind' => $kind, 'error' => $e->getMessage()]);
        }
    }
}