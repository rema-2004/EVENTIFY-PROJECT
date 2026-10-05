<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Teams exist only for competition-type events. "event_id" points
     * directly to the events table (not a separate competition_id) —
     * since competitions.id = events.id anyway (shared PK), this keeps
     * team queries simple without an extra join.
     */
    public function up(): void
    {
        Schema::create('teams', function (Blueprint $table) {
            $table->id();

            $table->foreignId('event_id')
                ->constrained('events')
                ->onDelete('cascade');

            $table->foreignId('created_by')
                ->constrained('users')
                ->onDelete('cascade'); // the team leader

            $table->string('name', 150);
            $table->text('description')->nullable();

            $table->unsignedTinyInteger('max_members');

            // Visible in the "Available Teams" browse page or not —
            // independent of whether the team is actually full.
            $table->boolean('is_recruiting')->default(true);

            $table->enum('status', ['open', 'closed', 'disqualified'])->default('open');

            $table->timestamps();
            $table->softDeletes();

            $table->unique(['event_id', 'name']);
            // No explicit index('event_id') — constrained() already adds
            // one automatically for the foreign key (MySQL/InnoDB requirement).
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teams');
    }
};