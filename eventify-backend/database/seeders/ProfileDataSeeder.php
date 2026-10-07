<?php

namespace Database\Seeders;

use App\Models\ChallengeSubmission;
use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProfileDataSeeder extends Seeder
{
    /**
     * Seeds sample courses and challenge submissions for the first
     * available student user — used to verify the new tables and
     * their User relationships work end to end.
     */
    public function run(): void
    {
        $user = User::first();

        if (! $user) {
            $this->command->warn('No user found — skipping ProfileDataSeeder.');
            return;
        }

        Course::create([
            'user_id' => $user->id,
            'title' => 'Introduction to React',
            'provider' => 'Coursera',
            'completed_at' => '2026-06-15',
        ]);

        Course::create([
            'user_id' => $user->id,
            'title' => 'Advanced Laravel',
            'provider' => null,
            'completed_at' => null,
        ]);

        ChallengeSubmission::create([
            'user_id' => $user->id,
            'title' => 'Eventify Hackathon Project',
            'link' => 'https://github.com/example/eventify-submission',
            'description' => 'A sample project submission for testing.',
        ]);
    }
}