<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Central participation record — covers Workshop/Event/Course
     * (instant "confirmed") and Competition, solo or via a team
     * ("pending" while awaiting the team leader's approval).
     */
    public function up(): void
    {
        Schema::create('event_registrations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Only set for competition entries made via a team.
            $table->foreignId('team_id')->nullable()->constrained('teams')->onDelete('set null');

            $table->enum('status', ['pending', 'confirmed', 'rejected', 'cancelled'])->default('pending');

            $table->timestamp('registered_at')->useCurrent();

            $table->timestamps();

            $table->unique(['event_id', 'user_id']);
            // No explicit index() on event_id/user_id/team_id — constrained()
            // already adds one automatically for each foreign key.
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_registrations');
    }
};