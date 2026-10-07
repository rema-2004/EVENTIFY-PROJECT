<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Course>
 */
class CourseFactory extends Factory
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
            'title' => fake()->words(3, true),
            'provider' => fake()->randomElement(['Coursera', 'Udemy', 'edX', null]),
            'completed_at' => fake()->date(),
        ];
    }

    /**
     * A course the user has started but not finished.
     */
    public function inProgress(): static
    {
        return $this->state(fn () => ['completed_at' => null]);
    }
}