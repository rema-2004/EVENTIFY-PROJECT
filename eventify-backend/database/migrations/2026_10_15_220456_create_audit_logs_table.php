<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Append-only record of who did what on the platform.
     *
     * Deliberately NO foreign keys and NO cleanup when an account is
     * deleted: actor_name / target_label are snapshots, so a row stays
     * meaningful after the account or event it refers to is gone.
     */
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();

            // Who. Null when there is no known actor (e.g. a failed login
            // for an account that does not exist).
            $table->string('actor_type')->nullable();
            $table->unsignedBigInteger('actor_id')->nullable();
            $table->string('actor_name')->nullable();
            $table->string('actor_role', 30)->nullable();

            // What happened.
            $table->string('type', 30);      // login, create, approve, ...
            $table->string('action', 100);   // "Approved Organization", ...
            $table->string('location', 50)->nullable(); // Events, Organizations, ...
            $table->string('status', 20)->default('success');
            $table->boolean('is_sensitive')->default(false);

            // What it happened to.
            $table->string('target_type')->nullable();
            $table->unsignedBigInteger('target_id')->nullable();
            $table->string('target_label')->nullable();

            // Context. Never store passwords or tokens here.
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->text('details')->nullable();
            $table->json('metadata')->nullable();

            // Append-only: there is no updated_at on purpose.
            $table->timestamp('created_at')->useCurrent();

            $table->index(['actor_type', 'actor_id']);
            $table->index(['target_type', 'target_id']);
            $table->index('type');
            $table->index('location');
            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};