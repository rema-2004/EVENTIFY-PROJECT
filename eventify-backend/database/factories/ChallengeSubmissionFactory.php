<?php

namespace Database\Factories;

use App\Models\ChallengeSubmission;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ChallengeSubmission>
 */
class ChallengeSubmissionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(3),
            'link' => fake()->optional()->url(),
            'description' => fake()->sentence(),
        ];
    }
}