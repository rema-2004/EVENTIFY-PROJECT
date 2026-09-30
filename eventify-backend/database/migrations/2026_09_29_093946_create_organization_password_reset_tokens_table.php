<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Mirrors Laravel's default "password_reset_tokens" table, but for
     * organizations — since Organization is a separate authenticatable
     * entity (not a row in "users"), it needs its own reset tokens table.
     */
    public function up(): void
    {
        Schema::create('organization_password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();

            // Speeds up the future scheduled cleanup job that deletes
            // expired tokens (e.g. WHERE created_at < now() - 1 hour).
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('organization_password_reset_tokens');
    }
};