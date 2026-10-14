<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\SavedOpportunity;
use App\Models\User;
use Illuminate\Database\Seeder;

class SavedOpportunitySeeder extends Seeder
{
    /**
     * Seeds two saved opportunities for the first available user,
     * using the first published events.
     *
     * Safe to run more than once: rows are matched by (user_id, event_id),
     * so running it again doesn't create duplicates. Does nothing if
     * there is no user or no published event yet.
     */
    public function run(): void
    {
        $user = User::first();

        if (! $user) {
            return;
        }

        $events = Event::where('status', Event::STATUS_PUBLISHED)
            ->orderBy('id')
            ->take(2)
            ->get();

        foreach ($events as $event) {
            SavedOpportunity::firstOrCreate([
                'user_id' => $user->id,
                'event_id' => $event->id,
            ]);
        }
    }
}