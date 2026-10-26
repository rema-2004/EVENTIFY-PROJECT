<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('headline', 150)->nullable()->after('phone');
            $table->string('location', 150)->nullable()->after('headline');
            $table->text('about')->nullable()->after('location');
            // The "Looking for opportunities" switch on the profile page.
            $table->boolean('open_to_opportunities')->default(true)->after('about');
            // Short lists the page edits as a whole: [ "AI", "Web" ] and
            // [ { title, organization, period, description } ].
            $table->json('interests')->nullable()->after('open_to_opportunities');
            $table->json('experience')->nullable()->after('interests');
            // Image paths on the public disk.
            $table->string('avatar')->nullable()->after('experience');
            $table->string('cover_image')->nullable()->after('avatar');
            // The CV is private: it lives on the local disk and is only
            // sent back to its owner.
            $table->string('cv_path')->nullable()->after('cover_image');
            $table->string('cv_original_name')->nullable()->after('cv_path');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'headline', 'location', 'about', 'open_to_opportunities',
                'interests', 'experience', 'avatar', 'cover_image',
                'cv_path', 'cv_original_name',
            ]);
        });
    }
};