<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Structured participation rules for competitions.
     *
     * Replaces the free-text team_size ("2-4 members") as the source of
     * truth — free text cannot be validated or enforced. The old column
     * is left in place and untouched so existing rows keep working.
     *
     * participation_type: 'solo' (individuals only), 'team' (teams only)
     * or 'both' — the same three values the frontend filter uses.
     * Existing competitions keep NULL until their organization edits them.
     *
     * No index: the competitions table is small and only filtered by
     * participation_type on the public list.
     */
    public function up(): void
    {
        Schema::table('competitions', function (Blueprint $table) {
            $table->string('participation_type', 10)->nullable();
            $table->unsignedSmallInteger('min_team_size')->nullable();
            $table->unsignedSmallInteger('max_team_size')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('competitions', function (Blueprint $table) {
            $table->dropColumn(['participation_type', 'min_team_size', 'max_team_size']);
        });
    }
};