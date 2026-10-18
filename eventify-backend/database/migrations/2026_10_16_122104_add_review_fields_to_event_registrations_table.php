<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Fields filled when an organization reviews a registration
     * (approve or reject). They stay empty/zero while the registration
     * is still pending for the first time.
     */
    public function up(): void
    {
        Schema::table('event_registrations', function (Blueprint $table) {
            // Only set when the organization rejects the registration.
            $table->text('rejection_reason')->nullable()->after('status');

            // How many times this student was rejected for this event.
            // After the second rejection the student cannot apply again.
            $table->unsignedTinyInteger('rejection_count')->default(0)->after('rejection_reason');

            // When the organization approved or rejected it.
            $table->timestamp('reviewed_at')->nullable()->after('rejection_count');
        });
    }

    public function down(): void
    {
        Schema::table('event_registrations', function (Blueprint $table) {
            $table->dropColumn(['rejection_reason', 'rejection_count', 'reviewed_at']);
        });
    }
};