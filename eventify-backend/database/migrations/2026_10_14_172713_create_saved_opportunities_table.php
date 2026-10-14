<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * An event a student bookmarked ("save for later") — separate from
     * event_registrations, which means actual participation.
     * Hard delete on un-save: no SoftDeletes, the row simply goes away.
     */
    public function up(): void
    {
        Schema::create('saved_opportunities', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');

            $table->timestamps();

            // A student can save a given event only once.
            $table->unique(['user_id', 'event_id']);
                        // The unique index above also covers lookups by user_id (its first column).
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('saved_opportunities');
    }
};