<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // A new email waits here until the user confirms it from the
            // link sent to that address. The token is stored hashed.
            $table->string('pending_email', 150)->nullable()->after('email');
            $table->string('email_change_token', 64)->nullable()->after('pending_email')->index();
            $table->timestamp('email_change_expires_at')->nullable()->after('email_change_token');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['email_change_token']);
            $table->dropColumn(['pending_email', 'email_change_token', 'email_change_expires_at']);
        });
    }
};