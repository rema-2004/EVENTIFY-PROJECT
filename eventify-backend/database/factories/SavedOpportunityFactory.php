<?php

namespace Database\Factories;

use App\Models\SavedOpportunity;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SavedOpportunity>
 */
class SavedOpportunityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * There is no EventFactory in the project, so 'event_id' is not
     * defined here — always pass an existing event id when creating:
     * SavedOpportunity::factory()->create(['event_id' => $event->id]).
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
        ];
    }
}