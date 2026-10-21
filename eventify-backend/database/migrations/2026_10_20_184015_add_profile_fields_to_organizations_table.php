<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Public profile fields an organization fills in from its settings
     * page. All nullable: organizations created before these fields
     * existed simply have them empty until they edit their profile.
     */
    public function up(): void
    {
        Schema::table('organizations', function (Blueprint $table) {
            // University, Company, NGO, Government, Startup or Other —
            // the allowed values are enforced by the form request.
            $table->string('type', 20)->nullable();
            $table->text('description')->nullable();
            $table->string('website', 255)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('country', 100)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('organizations', function (Blueprint $table) {
            $table->dropColumn(['type', 'description', 'website', 'city', 'country']);
        });
    }
};