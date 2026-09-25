<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Base "events" table — shared core for all event types.
     *
     * Final taxonomy: competition, workshop, event, course.
     * All four types share IDENTICAL fields on this table (per the
     * unified Create Event form). The ONLY exception is "competition",
     * which gets two extra fields (team_size, prize) via a separate
     * "competitions" extension table (shared PK: events.id = competitions.id).
     * Workshop / event / course need NO extension table — they have
     * zero distinguishing fields beyond what's already here.
     */
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();

            $table->foreignId('organization_id')
                ->constrained('organizations')
                ->onDelete('cascade');

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null');

            $table->string('title', 200);
            $table->string('slug', 220)->unique();
            $table->text('description');

            $table->enum('type', ['competition', 'workshop', 'event', 'course']);

            $table->string('cover_image')->nullable();

            // Free-text fields — kept simple per project decision,
            // instead of splitting into structured columns.
            $table->string('location')->nullable();
            $table->text('requirements')->nullable();

            // Nullable to support saving as a draft before dates are finalized.
            // Enforced as required only at the Form Request level when
            // status is being set to 'published' (application-level rule).
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->dateTime('registration_deadline')->nullable();

            $table->enum('status', [
                'draft',
                'pending_review',
                'published',
                'rejected',
                'cancelled',
                'completed',
            ])->default('draft');

            $table->text('admin_notes')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('organization_id');
            $table->index('type');
            $table->index('status');
            $table->index(['status', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};