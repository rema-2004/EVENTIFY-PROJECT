<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use LogicException;
use Tests\TestCase;

class AuditLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_record_writes_a_row_with_actor_and_target_snapshots(): void
    {
        $admin = User::factory()->create(['name' => 'Admin Sara', 'role' => User::ROLE_ADMIN]);
        $org = $this->makeOrganization('org-one');

        $log = AuditLog::record(
            type: AuditLog::TYPE_APPROVE,
            action: 'Approved Organization',
            location: AuditLog::LOCATION_ORGANIZATIONS,
            actor: $admin,
            target: $org,
            details: 'Application reviewed.',
        );

        $this->assertNotNull($log);
        $this->assertDatabaseHas('audit_logs', [
            'actor_type' => $admin->getMorphClass(),
            'actor_id' => $admin->id,
            'actor_name' => 'Admin Sara',
            'actor_role' => AuditLog::ROLE_ADMIN,
            'type' => 'approve',
            'action' => 'Approved Organization',
            'location' => 'Organizations',
            'status' => 'success',
            'target_type' => $org->getMorphClass(),
            'target_id' => $org->id,
            'target_label' => 'Org org-one',
            'details' => 'Application reviewed.',
        ]);
    }

    public function test_actor_role_is_derived_from_the_account_type(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $student = User::factory()->create(['role' => User::ROLE_USER]);
        $org = $this->makeOrganization('org-one');

        $asAdmin = AuditLog::record(type: AuditLog::TYPE_LOGIN, action: 'Login', actor: $admin);
        $asStudent = AuditLog::record(type: AuditLog::TYPE_LOGIN, action: 'Login', actor: $student);
        $asOrg = AuditLog::record(type: AuditLog::TYPE_LOGIN, action: 'Login', actor: $org);

        $this->assertSame(AuditLog::ROLE_ADMIN, $asAdmin->actor_role);
        $this->assertSame(AuditLog::ROLE_PARTICIPANT, $asStudent->actor_role);
        $this->assertSame(AuditLog::ROLE_ORGANIZATION, $asOrg->actor_role);
    }

    public function test_record_without_an_actor_leaves_the_actor_columns_empty(): void
    {
        $log = AuditLog::record(
            type: AuditLog::TYPE_LOGIN,
            action: 'Login',
            status: AuditLog::STATUS_FAILED,
        );

        $this->assertNotNull($log);
        $this->assertNull($log->actor_type);
        $this->assertNull($log->actor_id);
        $this->assertNull($log->actor_name);
        $this->assertNull($log->actor_role);
        $this->assertSame(AuditLog::STATUS_FAILED, $log->status);
    }

    public function test_secrets_are_removed_from_metadata(): void
    {
        $log = AuditLog::record(
            type: AuditLog::TYPE_REJECT,
            action: 'Rejected Organization',
            metadata: [
                'reason' => 'Incomplete documents',
                'password' => 'secret123',
                'token' => 'abc',
            ],
        );

        $this->assertSame(['reason' => 'Incomplete documents'], $log->fresh()->metadata);
    }

    public function test_empty_metadata_is_stored_as_null(): void
    {
        $log = AuditLog::record(type: AuditLog::TYPE_LOGOUT, action: 'Logout');

        $this->assertNull($log->fresh()->metadata);
    }

    public function test_ip_address_and_user_agent_are_captured_and_the_agent_is_limited(): void
    {
        request()->server->set('REMOTE_ADDR', '203.0.113.5');
        request()->headers->set('User-Agent', str_repeat('a', 600));

        $log = AuditLog::record(type: AuditLog::TYPE_LOGIN, action: 'Login')->fresh();

        $this->assertSame('203.0.113.5', $log->ip_address);
        $this->assertSame(500, strlen($log->user_agent));
    }

    public function test_rows_cannot_be_updated(): void
    {
        $log = AuditLog::record(type: AuditLog::TYPE_LOGIN, action: 'Login');

        $this->expectException(LogicException::class);

        $log->update(['details' => 'tampered']);
    }

    public function test_rows_cannot_be_deleted(): void
    {
        $log = AuditLog::record(type: AuditLog::TYPE_LOGIN, action: 'Login');

        $this->expectException(LogicException::class);

        $log->delete();
    }

    public function test_the_row_survives_when_the_actor_is_permanently_deleted(): void
    {
        $user = User::factory()->create(['name' => 'Leaving User']);

        $log = AuditLog::record(type: AuditLog::TYPE_LOGIN, action: 'Login', actor: $user);

        $user->forceDelete();

        $this->assertDatabaseHas('audit_logs', [
            'id' => $log->id,
            'actor_name' => 'Leaving User',
        ]);
    }

    public function test_a_failed_write_does_not_throw(): void
    {
        Schema::drop('audit_logs');

        $log = AuditLog::record(type: AuditLog::TYPE_LOGIN, action: 'Login');

        $this->assertNull($log);
    }

    private function makeOrganization(string $slug): Organization
    {
        return Organization::create([
            'name' => 'Org ' . $slug,
            'slug' => $slug,
            'email' => $slug . '@example.com',
            'password' => 'password123',
        ]);
    }
}