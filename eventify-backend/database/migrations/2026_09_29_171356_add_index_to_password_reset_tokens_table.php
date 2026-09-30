<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Laravel's default "password_reset_tokens" table (created by
     * `install:api`) has no index on created_at. Adding one here for
     * consistency with organization_password_reset_tokens, and for the
     * same future cleanup-job performance reason.
     */
    public function up(): void
    {
        Schema::table('password_reset_tokens', function (Blueprint $table) {
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::table('password_reset_tokens', function (Blueprint $table) {
            $table->dropIndex(['created_at']);
        });
    }
};