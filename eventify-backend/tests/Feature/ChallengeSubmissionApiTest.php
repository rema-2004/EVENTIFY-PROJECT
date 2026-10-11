<?php

namespace Tests\Feature;

use App\Models\ChallengeSubmission;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ChallengeSubmissionApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_can_create_a_submission(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/my/challenge-submissions', [
            'title' => 'Todo App',
            'link' => 'https://github.com/test/todo-app',
            'description' => 'A simple todo app',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.title', 'Todo App')
            ->assertJsonPath('data.has_link', true);

        $this->assertDatabaseHas('challenge_submissions', [
            'user_id' => $user->id,
            'title' => 'Todo App',
        ]);
    }

    public function test_create_submission_requires_a_title(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/v1/my/challenge-submissions', ['description' => 'No title'])
            ->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_link_must_be_a_http_or_https_url(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/v1/my/challenge-submissions', [
            'title' => 'Bad link',
            'link' => 'javascript:alert(1)',
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['link'], 'errors');
    }

    public function test_student_lists_only_their_own_submissions(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        ChallengeSubmission::factory()->count(2)->create(['user_id' => $user->id]);
        ChallengeSubmission::factory()->create(['user_id' => $other->id]);

        Sanctum::actingAs($user);

        $this->getJson('/api/v1/my/challenge-submissions')
            ->assertOk()
            ->assertJsonPath('meta.total', 2);
    }

    public function test_partial_update_keeps_the_other_fields(): void
    {
        $user = User::factory()->create();
        $submission = ChallengeSubmission::factory()->create([
            'user_id' => $user->id,
            'title' => 'Todo App',
            'link' => 'https://github.com/test/todo-app',
            'description' => 'Old description',
        ]);

        Sanctum::actingAs($user);

        $this->patchJson("/api/v1/my/challenge-submissions/{$submission->id}", [
            'description' => 'New description',
        ])
            ->assertOk()
            ->assertJsonPath('data.title', 'Todo App')
            ->assertJsonPath('data.link', 'https://github.com/test/todo-app')
            ->assertJsonPath('data.description', 'New description');
    }

    public function test_student_can_delete_their_own_submission(): void
    {
        $user = User::factory()->create();
        $submission = ChallengeSubmission::factory()->create(['user_id' => $user->id]);

        Sanctum::actingAs($user);

        $this->deleteJson("/api/v1/my/challenge-submissions/{$submission->id}")
            ->assertOk();

        $this->assertDatabaseMissing('challenge_submissions', ['id' => $submission->id]);
    }

    public function test_student_cannot_update_or_delete_another_students_submission(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $submission = ChallengeSubmission::factory()->create([
            'user_id' => $owner->id,
            'title' => 'Original',
        ]);

        Sanctum::actingAs($intruder);

        $this->patchJson("/api/v1/my/challenge-submissions/{$submission->id}", ['title' => 'Hacked'])
            ->assertStatus(403);

        $this->deleteJson("/api/v1/my/challenge-submissions/{$submission->id}")
            ->assertStatus(403);

        $this->assertDatabaseHas('challenge_submissions', [
            'id' => $submission->id,
            'title' => 'Original',
        ]);
    }

    public function test_guest_cannot_access_submissions(): void
    {
        $this->getJson('/api/v1/my/challenge-submissions')->assertStatus(401);
    }

    public function test_organization_token_is_rejected_even_when_its_id_matches_a_student(): void
    {
        // Student and organization both get id 1 on a fresh database.
        $student = User::factory()->create();
        $submission = ChallengeSubmission::factory()->create([
            'user_id' => $student->id,
            'title' => 'Student project',
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

        $this->getJson('/api/v1/my/challenge-submissions')->assertStatus(403);

        $this->postJson('/api/v1/my/challenge-submissions', ['title' => 'From org'])
            ->assertStatus(403);

        $this->patchJson("/api/v1/my/challenge-submissions/{$submission->id}", ['title' => 'Hacked'])
            ->assertStatus(403);

        $this->deleteJson("/api/v1/my/challenge-submissions/{$submission->id}")
            ->assertStatus(403);

        $this->assertDatabaseHas('challenge_submissions', [
            'id' => $submission->id,
            'title' => 'Student project',
        ]);
    }
}