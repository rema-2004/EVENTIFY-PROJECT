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
     * available user — used to verify the new tables and their
     * User relationships work end to end.
     *
     * Safe to run more than once: rows are matched by (user_id, title),
     * so running it again doesn't create duplicates. If no user exists
     * yet (e.g. right after migrate:fresh), a sample user is created.
     */
    public function run(): void
    {
        $user = User::first() ?? User::factory()->create();

        Course::firstOrCreate(
            ['user_id' => $user->id, 'title' => 'Introduction to React'],
            ['provider' => 'Coursera', 'completed_at' => '2026-06-15']
        );

        Course::firstOrCreate(
            ['user_id' => $user->id, 'title' => 'Advanced Laravel'],
            ['provider' => null, 'completed_at' => null]
        );

        ChallengeSubmission::firstOrCreate(
            ['user_id' => $user->id, 'title' => 'Eventify Hackathon Project'],
            [
                'link' => 'https://github.com/example/eventify-submission',
                'description' => 'A sample project submission for testing.',
            ]
        );
    }
}