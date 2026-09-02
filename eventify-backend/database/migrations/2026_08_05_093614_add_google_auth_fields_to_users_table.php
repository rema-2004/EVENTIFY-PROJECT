<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('password')->nullable()->change();

            $table->string('google_id')->nullable()->unique()->after('password');

            $table->enum('provider', ['local', 'google'])
                ->default('local')
                ->after('google_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['google_id', 'provider']);
            $table->string('password')->nullable(false)->change();
        });
    }
};