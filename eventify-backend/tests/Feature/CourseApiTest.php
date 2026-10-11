<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CourseApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_can_create_a_course(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/my/courses', [
            'title' => 'Laravel Basics',
            'provider' => 'Udemy',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.title', 'Laravel Basics')
            ->assertJsonPath('data.is_completed', false);

        $this->assertDatabaseHas('courses', [
            'user_id' => $user->id,
            'title' => 'Laravel Basics',
        ]);
    }

    public function test_create_course_requires_a_title(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/v1/my/courses', ['provider' => 'Udemy'])
            ->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_student_lists_only_their_own_courses(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        Course::factory()->count(2)->create(['user_id' => $user->id]);
        Course::factory()->create(['user_id' => $other->id]);

        Sanctum::actingAs($user);

        $this->getJson('/api/v1/my/courses')
            ->assertOk()
            ->assertJsonPath('meta.total', 2);
    }

    public function test_partial_update_keeps_the_other_fields(): void
    {
        $user = User::factory()->create();
        $course = Course::factory()->inProgress()->create([
            'user_id' => $user->id,
            'title' => 'Laravel Basics',
            'provider' => 'Udemy',
        ]);

        Sanctum::actingAs($user);

        $this->patchJson("/api/v1/my/courses/{$course->id}", [
            'completed_at' => '2026-10-01',
        ])
            ->assertOk()
            ->assertJsonPath('data.title', 'Laravel Basics')
            ->assertJsonPath('data.provider', 'Udemy')
            ->assertJsonPath('data.is_completed', true);
    }

    public function test_student_can_delete_their_own_course(): void
    {
        $user = User::factory()->create();
        $course = Course::factory()->create(['user_id' => $user->id]);

        Sanctum::actingAs($user);

        $this->deleteJson("/api/v1/my/courses/{$course->id}")
            ->assertOk();

        $this->assertDatabaseMissing('courses', ['id' => $course->id]);
    }

    public function test_student_cannot_update_or_delete_another_students_course(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $course = Course::factory()->create([
            'user_id' => $owner->id,
            'title' => 'Original',
        ]);

        Sanctum::actingAs($intruder);

        $this->patchJson("/api/v1/my/courses/{$course->id}", ['title' => 'Hacked'])
            ->assertStatus(403);

        $this->deleteJson("/api/v1/my/courses/{$course->id}")
            ->assertStatus(403);

        $this->assertDatabaseHas('courses', [
            'id' => $course->id,
            'title' => 'Original',
        ]);
    }

    public function test_guest_cannot_access_courses(): void
    {
        $this->getJson('/api/v1/my/courses')->assertStatus(401);
    }

    public function test_organization_token_is_rejected_even_when_its_id_matches_a_student(): void
    {
        // Student and organization both get id 1 on a fresh database.
        $student = User::factory()->create();
        $course = Course::factory()->create([
            'user_id' => $student->id,
            'title' => 'Student course',
        ]);

        $organization = Organization::create([
            'name' => 'Test Organization',
            'slug' => 'test-organization',
            'email' => 'org@example.com',
            'password' => 'Password123',
            'status' => 'approved',
        ]);

        $this->assertSame($student->id, $organization->id);

        Sanctum::actingAs($organization);

        $this->getJson('/api/v1/my/courses')->assertStatus(403);

        $this->postJson('/api/v1/my/courses', ['title' => 'From org'])
            ->assertStatus(403);

        $this->patchJson("/api/v1/my/courses/{$course->id}", ['title' => 'Hacked'])
            ->assertStatus(403);

        $this->deleteJson("/api/v1/my/courses/{$course->id}")
            ->assertStatus(403);

        $this->assertDatabaseHas('courses', [
            'id' => $course->id,
            'title' => 'Student course',
        ]);
    }
}