<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Roster + join-request workflow. The leader has role='leader' and
     * status='approved' from the moment the team is created (auto-approved,
     * since they don't need to approve joining their own team).
     */
    public function up(): void
    {
        Schema::create('team_members', function (Blueprint $table) {
            $table->id();

            $table->foreignId('team_id')->constrained('teams')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            $table->enum('role', ['leader', 'member'])->default('member');
            $table->enum('status', ['pending', 'approved', 'rejected', 'left'])->default('pending');

            $table->timestamp('requested_at')->nullable();
            $table->timestamp('responded_at')->nullable();

            $table->timestamps();

            $table->unique(['team_id', 'user_id']);
            // No explicit index('user_id') — constrained() already adds
            // one automatically for the foreign key.
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('team_members');
    }
};