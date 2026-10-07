<?php

namespace Tests\Feature;

use App\Models\ChallengeSubmission;
use App\Models\Course;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CoursesAndChallengesTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_has_many_courses_and_challenge_submissions(): void
    {
        $user = User::factory()->create();

        Course::factory()->count(2)->create(['user_id' => $user->id]);
        ChallengeSubmission::factory()->create(['user_id' => $user->id]);

        $this->assertCount(2, $user->courses);
        $this->assertCount(1, $user->challengeSubmissions);
        $this->assertTrue($user->courses->first()->user->is($user));
        $this->assertTrue($user->challengeSubmissions->first()->user->is($user));
    }

    public function test_course_is_completed_only_when_it_has_a_completion_date(): void
    {
        $done = Course::factory()->create();
        $inProgress = Course::factory()->inProgress()->create();

        $this->assertTrue($done->isCompleted());
        $this->assertFalse($inProgress->isCompleted());
    }

    public function test_challenge_submission_has_link_only_when_link_is_filled(): void
    {
        $withLink = ChallengeSubmission::factory()->create(['link' => 'https://example.com']);
        $withNull = ChallengeSubmission::factory()->create(['link' => null]);
        $withEmpty = ChallengeSubmission::factory()->create(['link' => '']);

        $this->assertTrue($withLink->hasLink());
        $this->assertFalse($withNull->hasLink());
        $this->assertFalse($withEmpty->hasLink());
    }

    public function test_courses_and_challenges_are_removed_when_the_user_is_force_deleted(): void
    {
        $user = User::factory()->create();

        Course::factory()->create(['user_id' => $user->id]);
        ChallengeSubmission::factory()->create(['user_id' => $user->id]);

        $user->forceDelete();

        $this->assertDatabaseCount('courses', 0);
        $this->assertDatabaseCount('challenge_submissions', 0);
    }
}