<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * A team is built by its leader, then SUBMITTED to the organization,
     * which approves or rejects the team as a whole.
     *
     *   draft -> submitted -> approved
     *                      -> rejected -> (leader fixes it) -> submitted
     */
    public function up(): void
    {
        Schema::table('teams', function (Blueprint $table) {
            $table->string('submission_status', 20)->default('draft')->after('status');
            $table->timestamp('submitted_at')->nullable()->after('submission_status');
            $table->timestamp('reviewed_at')->nullable()->after('submitted_at');
            $table->text('rejection_reason')->nullable()->after('reviewed_at');

            $table->index(['event_id', 'submission_status']);
        });
    }

    public function down(): void
    {
        Schema::table('teams', function (Blueprint $table) {
            $table->dropIndex(['event_id', 'submission_status']);
            $table->dropColumn(['submission_status', 'submitted_at', 'reviewed_at', 'rejection_reason']);
        });
    }
};