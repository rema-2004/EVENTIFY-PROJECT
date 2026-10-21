<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * A past challenge/project the student has submitted — another
     * factor in Rafeeq's matching score (alongside skills and courses).
     */
    public function up(): void
    {
        Schema::create('challenge_submissions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            $table->string('title', 150);
            $table->string('link', 255)->nullable();
            $table->text('description')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('challenge_submissions');
    }
};