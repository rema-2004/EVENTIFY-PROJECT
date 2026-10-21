<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class NotificationSeeder extends Seeder
{
    /**
     * Seeds sample notifications: two for the first student (one unread,
     * one read) and one for the first organization.
     *
     * Safe to run more than once: a sample is skipped if the account
     * already has a notification of the same type. Does nothing for an
     * account type that has no rows yet.
     */
    public function run(): void
    {
        $user = User::first();

        if ($user) {
            $this->createOnce($user, 'registration_confirmed', [
                'message' => 'Your registration was confirmed.',
            ], null);

            $this->createOnce($user, 'event_reminder', [
                'message' => 'An event you saved starts soon.',
            ], now());
        }

        $organization = Organization::first();

        if ($organization) {
            $this->createOnce($organization, 'event_approved', [
                'message' => 'Your event was approved and is now published.',
            ], null);
        }
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function createOnce(User|Organization $notifiable, string $type, array $data, ?Carbon $readAt): void
    {
        if ($notifiable->notifications()->where('type', $type)->exists()) {
            return;
        }

        $notifiable->notifications()->create([
            // The notifications table uses a UUID primary key.
            'id' => (string) Str::uuid(),
            'type' => $type,
            'data' => $data,
            'read_at' => $readAt,
        ]);
    }
}