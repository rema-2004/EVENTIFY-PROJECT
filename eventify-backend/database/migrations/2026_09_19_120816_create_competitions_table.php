<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Extension table for events where type = 'competition'.
     * Shares its primary key with events.id (Class Table Inheritance) —
     * NOT a regular foreign key column, the id itself IS the FK.
     *
     * Only 2 fields here because that's the only difference between
     * a Competition and the other 3 types on the current Create Event
     * form: Team Size and Prize/Scholarship. Both kept as free text,
     * matching the project's "simple free-text fields" pattern used
     * everywhere else (location, requirements, etc).
     */
    public function up(): void
    {
        Schema::create('competitions', function (Blueprint $table) {
            $table->foreignId('id')
                ->constrained('events')
                ->onDelete('cascade');
            $table->primary('id');

            $table->string('team_size')->nullable();   // e.g. "2-4 members"
            $table->string('prize')->nullable();         // e.g. "$10,000 Prize Pool"

            // No timestamps here — created_at/updated_at already exist
            // on the parent "events" row (same logical record, id-shared).
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('competitions');
    }
};