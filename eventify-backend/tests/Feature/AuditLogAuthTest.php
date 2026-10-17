<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuditLogAuthTest extends TestCase
{
    use RefreshDatabase;

    private function makeStudent(array $overrides = []): User
    {
        return User::factory()->create(array_merge([
            'email' => 'student@example.com',
            'password' => 'Password123',
        ], $overrides));
    }

    private function makeOrganization(array $overrides = []): Organization
    {
        return Organization::create(array_merge([
            'name' => 'Test Organization',
            'slug' => 'test-organization',
            'email' => 'org@example.com',
            'password' => 'Password123',
            'status' => Organization::STATUS_APPROVED,
        ], $overrides));
    }

    // ── Student: register / login / logout / reset ─────────────

    public function test_student_register_is_logged(): void
    {
        $this->postJson('/api/v1/register', [
            'name' => 'New Student',
            'email' => 'new@example.com',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ])->assertStatus(201);

        $user = User::where('email', 'new@example.com')->first();

        $this->assertDatabaseHas('audit_logs', [
            'type' => AuditLog::TYPE_CREATE,
            'action' => 'Registered Account',
            'location' => AuditLog::LOCATION_USERS,
            'status' => AuditLog::STATUS_SUCCESS,
            'actor_type' => $user->getMorphClass(),
            'actor_id' => $user->id,
            'actor_role' => AuditLog::ROLE_PARTICIPANT,
            'target_id' => $user->id,
        ]);
    }

    public function test_student_login_success_is_logged(): void
    {
        $user = $this->makeStudent();

        $this->postJson('/api/v1/login', [
            'login' => 'student@example.com',
            'password' => 'Password123',
        ])->assertStatus(200);

        $this->assertDatabaseHas('audit_logs', [
            'type' => AuditLog::TYPE_LOGIN,
            'status' => AuditLog::STATUS_SUCCESS,
            'actor_id' => $user->id,
            'actor_role' => AuditLog::ROLE_PARTICIPANT,
        ]);
    }

    public function test_student_login_with_wrong_password_is_logged_as_failed_with_the_actor(): void
    {
        $user = $this->makeStudent();

        $this->postJson('/api/v1/login', [
            'login' => 'student@example.com',
            'password' => 'WrongPassword1',
        ])->assertStatus(401);

        $this->assertDatabaseHas('audit_logs', [
            'type' => AuditLog::TYPE_LOGIN,
            'status' => AuditLog::STATUS_FAILED,
            'actor_id' => $user->id,
        ]);
    }

    public function test_student_login_for_an_unknown_account_has_no_actor_and_stores_no_identifier(): void
    {
        $this->postJson('/api/v1/login', [
            'login' => 'nobody@example.com',
            'password' => 'Password123',
        ])->assertStatus(401);

        $log = AuditLog::first();

        $this->assertNotNull($log);
        $this->assertSame(AuditLog::STATUS_FAILED, $log->status);
        $this->assertNull($log->actor_id);
        $this->assertStringNotContainsString(
            'nobody@example.com',
            json_encode($log->getAttributes())
        );
    }

    public function test_student_login_for_a_suspended_account_is_logged_as_failed(): void
    {
        $user = $this->makeStudent(['status' => User::STATUS_SUSPENDED]);

        $this->postJson('/api/v1/login', [
            'login' => 'student@example.com',
            'password' => 'Password123',
        ])->assertStatus(403);

        $log = AuditLog::first();

        $this->assertSame($user->id, $log->actor_id);
        $this->assertSame(AuditLog::STATUS_FAILED, $log->status);
        $this->assertStringContainsString('suspended', $log->details);
    }

    public function test_student_logout_is_logged(): void
    {
        $user = $this->makeStudent();
        Sanctum::actingAs($user);

        $this->postJson('/api/v1/logout')->assertStatus(200);

        $this->assertDatabaseHas('audit_logs', [
            'type' => AuditLog::TYPE_LOGOUT,
            'actor_id' => $user->id,
            'status' => AuditLog::STATUS_SUCCESS,
        ]);
    }

    public function test_student_password_reset_is_logged_as_sensitive(): void
    {
        $user = $this->makeStudent();

        DB::table('password_reset_tokens')->insert([
            'email' => 'student@example.com',
            'token' => Hash::make('plain-reset-token'),
            'created_at' => now(),
        ]);

        $this->postJson('/api/v1/reset-password', [
            'email' => 'student@example.com',
            'token' => 'plain-reset-token',
            'password' => 'NewPassword123',
            'password_confirmation' => 'NewPassword123',
        ])->assertStatus(200);

        $this->assertDatabaseHas('audit_logs', [
            'type' => AuditLog::TYPE_UPDATE,
            'action' => 'Reset Password',
            'location' => AuditLog::LOCATION_SECURITY,
            'is_sensitive' => true,
            'actor_id' => $user->id,
        ]);
    }

    public function test_a_rejected_password_reset_is_not_logged(): void
    {
        $this->makeStudent();

        $this->postJson('/api/v1/reset-password', [
            'email' => 'student@example.com',
            'token' => 'not-a-real-token',
            'password' => 'NewPassword123',
            'password_confirmation' => 'NewPassword123',
        ])->assertStatus(400);

        $this->assertDatabaseCount('audit_logs', 0);
    }

    public function test_login_still_works_when_the_audit_log_cannot_be_written(): void
    {
        $this->makeStudent();
        Schema::drop('audit_logs');

        $this->postJson('/api/v1/login', [
            'login' => 'student@example.com',
            'password' => 'Password123',
        ])->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    // ── Organization: register / login / logout / reset ────────

    public function test_organization_register_is_logged(): void
    {
        $this->postJson('/api/v1/org/register', [
            'name' => 'Fresh Org',
            'email' => 'fresh@example.com',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ])->assertStatus(201);

        $org = Organization::where('email', 'fresh@example.com')->first();

        $this->assertDatabaseHas('audit_logs', [
            'type' => AuditLog::TYPE_CREATE,
            'action' => 'Registered Organization',
            'location' => AuditLog::LOCATION_ORGANIZATIONS,
            'actor_type' => $org->getMorphClass(),
            'actor_id' => $org->id,
            'actor_role' => AuditLog::ROLE_ORGANIZATION,
            'target_id' => $org->id,
        ]);
    }

    public function test_organization_login_success_is_logged(): void
    {
        $org = $this->makeOrganization();

        $this->postJson('/api/v1/org/login', [
            'email' => 'org@example.com',
            'password' => 'Password123',
        ])->assertStatus(200);

        $this->assertDatabaseHas('audit_logs', [
            'type' => AuditLog::TYPE_LOGIN,
            'status' => AuditLog::STATUS_SUCCESS,
            'actor_type' => $org->getMorphClass(),
            'actor_id' => $org->id,
            'actor_role' => AuditLog::ROLE_ORGANIZATION,
        ]);
    }

    public function test_organization_login_with_wrong_password_is_logged_as_failed(): void
    {
        $org = $this->makeOrganization();

        $this->postJson('/api/v1/org/login', [
            'email' => 'org@example.com',
            'password' => 'WrongPassword1',
        ])->assertStatus(401);

        $this->assertDatabaseHas('audit_logs', [
            'type' => AuditLog::TYPE_LOGIN,
            'status' => AuditLog::STATUS_FAILED,
            'actor_id' => $org->id,
        ]);
    }

    public function test_organization_login_when_suspended_is_logged_as_failed(): void
    {
        $org = $this->makeOrganization(['status' => Organization::STATUS_SUSPENDED]);

        $this->postJson('/api/v1/org/login', [
            'email' => 'org@example.com',
            'password' => 'Password123',
        ])->assertStatus(403);

        $log = AuditLog::first();

        $this->assertSame($org->id, $log->actor_id);
        $this->assertSame(AuditLog::STATUS_FAILED, $log->status);
        $this->assertStringContainsString('suspended', $log->details);
    }

    public function test_organization_login_when_rejected_is_logged_as_failed(): void
    {
        $org = $this->makeOrganization(['status' => Organization::STATUS_REJECTED]);

        $this->postJson('/api/v1/org/login', [
            'email' => 'org@example.com',
            'password' => 'Password123',
        ])->assertStatus(403);

        $log = AuditLog::first();

        $this->assertSame($org->id, $log->actor_id);
        $this->assertSame(AuditLog::STATUS_FAILED, $log->status);
        $this->assertStringContainsString('rejected', $log->details);
    }

    public function test_organization_logout_is_logged(): void
    {
        $org = $this->makeOrganization();
        Sanctum::actingAs($org, ['*'], 'organization');

        $this->postJson('/api/v1/org/logout')->assertStatus(200);

        $this->assertDatabaseHas('audit_logs', [
            'type' => AuditLog::TYPE_LOGOUT,
            'actor_type' => $org->getMorphClass(),
            'actor_id' => $org->id,
        ]);
    }

    public function test_organization_password_reset_is_logged_as_sensitive(): void
    {
        $org = $this->makeOrganization();

        DB::table('organization_password_reset_tokens')->insert([
            'email' => 'org@example.com',
            'token' => Hash::make('plain-reset-token'),
            'created_at' => now(),
        ]);

        $this->postJson('/api/v1/org/reset-password', [
            'email' => 'org@example.com',
            'token' => 'plain-reset-token',
            'password' => 'NewPassword123',
            'password_confirmation' => 'NewPassword123',
        ])->assertStatus(200);

        $this->assertDatabaseHas('audit_logs', [
            'type' => AuditLog::TYPE_UPDATE,
            'action' => 'Reset Password',
            'location' => AuditLog::LOCATION_SECURITY,
            'is_sensitive' => true,
            'actor_type' => $org->getMorphClass(),
            'actor_id' => $org->id,
        ]);
    }
}