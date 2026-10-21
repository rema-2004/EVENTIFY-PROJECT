<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminUserManagementTest extends TestCase
{
    use RefreshDatabase;

    private const REASON = 'Posted content that breaks the rules.';

    // ── Listing ───────────────────────────────────────────────

    public function test_admin_lists_students_only(): void
    {
        $admin = $this->makeAdmin();
        $this->makeStudent();
        $this->makeStudent();

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/v1/admin/users')->assertOk();

        // The admin account itself is not in the list.
        $this->assertCount(2, $response->json('data'));
    }

    public function test_users_can_be_filtered_by_status(): void
    {
        $admin = $this->makeAdmin();
        $this->makeStudent();
        $this->makeStudent(['status' => User::STATUS_SUSPENDED]);
        $this->makeStudent(['status' => User::STATUS_BANNED]);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/v1/admin/users?status=suspended')->assertOk();

        $this->assertCount(1, $response->json('data'));
        $this->assertSame('suspended', $response->json('data.0.status'));
    }

    public function test_users_can_be_searched_by_name_or_email(): void
    {
        $admin = $this->makeAdmin();
        $this->makeStudent(['name' => 'Sara Khalil', 'email' => 'sara@example.com']);
        $this->makeStudent(['name' => 'Omar Nasser', 'email' => 'omar.n@example.com']);

        Sanctum::actingAs($admin);

        $byName = $this->getJson('/api/v1/admin/users?search=sara')->assertOk();
        $this->assertCount(1, $byName->json('data'));
        $this->assertSame('sara@example.com', $byName->json('data.0.email'));

        $byEmail = $this->getJson('/api/v1/admin/users?search=omar.n')->assertOk();
        $this->assertCount(1, $byEmail->json('data'));
        $this->assertSame('omar.n@example.com', $byEmail->json('data.0.email'));
    }

    // ── Suspending ────────────────────────────────────────────

    public function test_admin_can_suspend_an_active_student(): void
    {
        $admin = $this->makeAdmin();
        $student = $this->makeStudent();

        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/admin/users/{$student->id}/suspend", ['reason' => self::REASON])
            ->assertOk()
            ->assertJsonPath('data.status', 'suspended');

        $this->assertSame(User::STATUS_SUSPENDED, $student->fresh()->status);

        $this->assertDatabaseHas('audit_logs', [
            'type' => AuditLog::TYPE_UPDATE,
            'action' => 'Suspended User',
            'location' => AuditLog::LOCATION_USERS,
            'is_sensitive' => true,
            'details' => self::REASON,
        ]);
    }

    public function test_suspending_signs_the_student_out_everywhere(): void
    {
        $admin = $this->makeAdmin();
        $student = $this->makeStudent();
        $token = $student->createToken('student-device');

        $this->assertDatabaseHas('personal_access_tokens', ['id' => $token->accessToken->id]);

        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/admin/users/{$student->id}/suspend", ['reason' => self::REASON])
            ->assertOk();

        $this->assertDatabaseMissing('personal_access_tokens', ['id' => $token->accessToken->id]);
    }

    public function test_suspending_one_student_does_not_touch_another_students_tokens(): void
    {
        $admin = $this->makeAdmin();
        $target = $this->makeStudent();
        $other = $this->makeStudent();
        $otherToken = $other->createToken('other-device');

        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/admin/users/{$target->id}/suspend", ['reason' => self::REASON])
            ->assertOk();

        $this->assertDatabaseHas('personal_access_tokens', ['id' => $otherToken->accessToken->id]);
        $this->assertSame(User::STATUS_ACTIVE, $other->fresh()->status);
    }

    public function test_suspending_requires_a_reason(): void
    {
        $admin = $this->makeAdmin();
        $student = $this->makeStudent();

        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/admin/users/{$student->id}/suspend", [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['reason'], 'errors');

        $this->assertSame(User::STATUS_ACTIVE, $student->fresh()->status);
    }

    public function test_an_already_suspended_student_cannot_be_suspended_again(): void
    {
        $admin = $this->makeAdmin();
        $student = $this->makeStudent(['status' => User::STATUS_SUSPENDED]);

        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/admin/users/{$student->id}/suspend", ['reason' => self::REASON])
            ->assertStatus(422);
    }

    // ── Banning ───────────────────────────────────────────────

    public function test_admin_can_ban_an_active_student_and_the_tokens_are_removed(): void
    {
        $admin = $this->makeAdmin();
        $student = $this->makeStudent();
        $token = $student->createToken('student-device');

        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/admin/users/{$student->id}/ban", ['reason' => self::REASON])
            ->assertOk()
            ->assertJsonPath('data.status', 'banned');

        $this->assertSame(User::STATUS_BANNED, $student->fresh()->status);
        $this->assertDatabaseMissing('personal_access_tokens', ['id' => $token->accessToken->id]);

        $this->assertDatabaseHas('audit_logs', [
            'type' => AuditLog::TYPE_UPDATE,
            'action' => 'Banned User',
            'location' => AuditLog::LOCATION_USERS,
            'is_sensitive' => true,
            'details' => self::REASON,
        ]);
    }

    public function test_admin_can_ban_a_suspended_student(): void
    {
        $admin = $this->makeAdmin();
        $student = $this->makeStudent(['status' => User::STATUS_SUSPENDED]);

        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/admin/users/{$student->id}/ban", ['reason' => self::REASON])
            ->assertOk()
            ->assertJsonPath('data.status', 'banned');
    }

    public function test_an_already_banned_student_cannot_be_banned_again(): void
    {
        $admin = $this->makeAdmin();
        $student = $this->makeStudent(['status' => User::STATUS_BANNED]);

        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/admin/users/{$student->id}/ban", ['reason' => self::REASON])
            ->assertStatus(422);
    }

    // ── Activating ────────────────────────────────────────────

    public function test_admin_can_activate_a_suspended_student(): void
    {
        $admin = $this->makeAdmin();
        $student = $this->makeStudent(['status' => User::STATUS_SUSPENDED]);

        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/admin/users/{$student->id}/activate")
            ->assertOk()
            ->assertJsonPath('data.status', 'active');

        $this->assertSame(User::STATUS_ACTIVE, $student->fresh()->status);

        $this->assertDatabaseHas('audit_logs', [
            'type' => AuditLog::TYPE_UPDATE,
            'action' => 'Activated User',
            'location' => AuditLog::LOCATION_USERS,
            'is_sensitive' => false,
        ]);
    }

    public function test_admin_can_activate_a_banned_student(): void
    {
        $admin = $this->makeAdmin();
        $student = $this->makeStudent(['status' => User::STATUS_BANNED]);

        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/admin/users/{$student->id}/activate")
            ->assertOk()
            ->assertJsonPath('data.status', 'active');
    }

    public function test_an_already_active_student_cannot_be_activated(): void
    {
        $admin = $this->makeAdmin();
        $student = $this->makeStudent();

        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/admin/users/{$student->id}/activate")
            ->assertStatus(422);
    }

    // ── Protection ────────────────────────────────────────────

    public function test_admin_accounts_cannot_be_changed_from_these_routes(): void
    {
        $admin = $this->makeAdmin();
        $otherAdmin = $this->makeAdmin();

        Sanctum::actingAs($admin);

        // Another admin...
        $this->patchJson("/api/v1/admin/users/{$otherAdmin->id}/suspend", ['reason' => self::REASON])
            ->assertStatus(403);

        // ...and the admin's own account.
        $this->patchJson("/api/v1/admin/users/{$admin->id}/ban", ['reason' => self::REASON])
            ->assertStatus(403);

        $this->assertSame(User::STATUS_ACTIVE, $otherAdmin->fresh()->status);
        $this->assertSame(User::STATUS_ACTIVE, $admin->fresh()->status);
    }

    public function test_an_unknown_user_returns_404(): void
    {
        $admin = $this->makeAdmin();

        Sanctum::actingAs($admin);

        $this->patchJson('/api/v1/admin/users/999999/suspend', ['reason' => self::REASON])
            ->assertStatus(404);
    }

    // ── Who can call these routes ─────────────────────────────

    public function test_a_student_cannot_use_the_admin_user_routes(): void
    {
        $student = $this->makeStudent();
        $victim = $this->makeStudent();

        Sanctum::actingAs($student);

        $response = $this->patchJson("/api/v1/admin/users/{$victim->id}/suspend", ['reason' => self::REASON]);

        $this->assertContains($response->getStatusCode(), [401, 403]);
        $this->assertSame(User::STATUS_ACTIVE, $victim->fresh()->status);
    }

    public function test_a_request_without_a_token_is_unauthorized(): void
    {
        $this->getJson('/api/v1/admin/users')->assertStatus(401);
    }

    // ── Helpers ───────────────────────────────────────────────

    private function makeAdmin(): User
    {
        return User::factory()->create(['role' => User::ROLE_ADMIN]);
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    private function makeStudent(array $overrides = []): User
    {
        return User::factory()->create($overrides);
    }
}