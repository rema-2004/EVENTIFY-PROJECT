<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Organization;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuditLogApiTest extends TestCase
{
    use RefreshDatabase;

    private const LIST_URL = '/api/v1/admin/audit-logs';
    private const SUMMARY_URL = '/api/v1/admin/audit-logs/summary';

    public function test_admin_lists_logs_newest_first_with_the_expected_shape(): void
    {
        $this->actingAsAdmin();

        $this->makeLog(['action' => 'Oldest'], Carbon::parse('2026-10-01 10:00:00'));
        $this->makeLog(['action' => 'Newest'], Carbon::parse('2026-10-03 10:00:00'));
        $this->makeLog(['action' => 'Middle'], Carbon::parse('2026-10-02 10:00:00'));

        $this->getJson(self::LIST_URL)
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.0.action', 'Newest')
            ->assertJsonPath('data.1.action', 'Middle')
            ->assertJsonPath('data.2.action', 'Oldest')
            ->assertJsonPath('meta.total', 3)
            ->assertJsonStructure([
                'data' => ['*' => [
                    'id', 'timestamp',
                    'actor' => ['type', 'id', 'name', 'role'],
                    'action', 'type', 'location', 'status', 'is_sensitive',
                    'target' => ['type', 'id', 'label'],
                    'ip_address', 'user_agent', 'details', 'metadata',
                ]],
                'meta' => ['current_page', 'last_page', 'per_page', 'total'],
            ]);
    }

    public function test_list_is_paginated_at_15_per_page(): void
    {
        $this->actingAsAdmin();

        for ($i = 1; $i <= 20; $i++) {
            $this->makeLog(['action' => "Action {$i}"]);
        }

        $this->getJson(self::LIST_URL)
            ->assertOk()
            ->assertJsonCount(15, 'data')
            ->assertJsonPath('meta.per_page', 15)
            ->assertJsonPath('meta.last_page', 2)
            ->assertJsonPath('meta.total', 20);

        $this->getJson(self::LIST_URL . '?page=2')
            ->assertOk()
            ->assertJsonCount(5, 'data');
    }

    public function test_actor_and_target_are_shown_with_short_type_names(): void
    {
        $admin = $this->actingAsAdmin();
        $org = $this->makeOrganization('org-one');

        AuditLog::record(
            type: AuditLog::TYPE_APPROVE,
            action: 'Approved Organization',
            location: AuditLog::LOCATION_ORGANIZATIONS,
            actor: $admin,
            target: $org,
        );

        $this->getJson(self::LIST_URL)
            ->assertOk()
            ->assertJsonPath('data.0.actor.type', 'user')
            ->assertJsonPath('data.0.actor.id', $admin->id)
            ->assertJsonPath('data.0.actor.role', AuditLog::ROLE_ADMIN)
            ->assertJsonPath('data.0.target.type', 'organization')
            ->assertJsonPath('data.0.target.id', $org->id)
            ->assertJsonPath('data.0.target.label', 'Org org-one');
    }

    public function test_a_log_without_an_actor_has_an_all_null_actor(): void
    {
        $this->actingAsAdmin();

        $this->makeLog([
            'action' => 'Failed login',
            'status' => AuditLog::STATUS_FAILED,
        ]);

        $this->getJson(self::LIST_URL)
            ->assertOk()
            ->assertJsonPath('data.0.actor.type', null)
            ->assertJsonPath('data.0.actor.id', null)
            ->assertJsonPath('data.0.actor.name', null)
            ->assertJsonPath('data.0.actor.role', null);
    }

    public function test_filters_by_type_role_status_and_location(): void
    {
        $this->actingAsAdmin();

        $this->makeLog([
            'action' => 'Match',
            'type' => AuditLog::TYPE_APPROVE,
            'actor_role' => AuditLog::ROLE_ADMIN,
            'status' => AuditLog::STATUS_SUCCESS,
            'location' => AuditLog::LOCATION_ORGANIZATIONS,
        ]);
        $this->makeLog([
            'action' => 'Other',
            'type' => AuditLog::TYPE_LOGIN,
            'actor_role' => AuditLog::ROLE_PARTICIPANT,
            'status' => AuditLog::STATUS_FAILED,
            'location' => AuditLog::LOCATION_SECURITY,
        ]);

        $this->getJson(self::LIST_URL . '?type=approve')
            ->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.action', 'Match');

        $this->getJson(self::LIST_URL . '?role=' . urlencode(AuditLog::ROLE_PARTICIPANT))
            ->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.action', 'Other');

        $this->getJson(self::LIST_URL . '?status=failed')
            ->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.action', 'Other');

        $this->getJson(self::LIST_URL . '?location=' . urlencode(AuditLog::LOCATION_ORGANIZATIONS))
            ->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.action', 'Match');
    }

    public function test_filters_by_sensitive_flag(): void
    {
        $this->actingAsAdmin();

        $this->makeLog(['action' => 'Sensitive one', 'is_sensitive' => true]);
        $this->makeLog(['action' => 'Normal one', 'is_sensitive' => false]);

        $this->getJson(self::LIST_URL . '?sensitive=1')
            ->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.action', 'Sensitive one');

        $this->getJson(self::LIST_URL . '?sensitive=0')
            ->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.action', 'Normal one');
    }

    public function test_filters_by_date_range(): void
    {
        $this->actingAsAdmin();

        $this->makeLog(['action' => 'Early'], Carbon::parse('2026-10-01 12:00:00'));
        $this->makeLog(['action' => 'Inside'], Carbon::parse('2026-10-10 12:00:00'));
        $this->makeLog(['action' => 'Late'], Carbon::parse('2026-10-20 12:00:00'));

        $this->getJson(self::LIST_URL . '?from=2026-10-05&to=2026-10-15')
            ->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.action', 'Inside');

        // The 'to' day itself is included.
        $this->getJson(self::LIST_URL . '?from=2026-10-10&to=2026-10-10')
            ->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.action', 'Inside');
    }

    public function test_search_matches_actor_action_target_ip_and_details(): void
    {
        $this->actingAsAdmin();

        $this->makeLog(['action' => 'A1', 'actor_name' => 'Sara Khatib']);
        $this->makeLog(['action' => 'A2', 'action' => 'Suspended Account']);
        $this->makeLog(['action' => 'A3', 'target_label' => 'Cloud Workshop']);
        $this->makeLog(['action' => 'A4', 'ip_address' => '203.0.113.7']);
        $this->makeLog(['action' => 'A5', 'details' => 'Reason: duplicate license']);
        $this->makeLog(['action' => 'Unrelated']);

        $this->getJson(self::LIST_URL . '?search=Khatib')->assertOk()->assertJsonCount(1, 'data');
        $this->getJson(self::LIST_URL . '?search=Suspended')->assertOk()->assertJsonCount(1, 'data');
        $this->getJson(self::LIST_URL . '?search=Cloud')->assertOk()->assertJsonCount(1, 'data');
        $this->getJson(self::LIST_URL . '?search=203.0.113')->assertOk()->assertJsonCount(1, 'data');
        $this->getJson(self::LIST_URL . '?search=duplicate')->assertOk()->assertJsonCount(1, 'data');
    }

    public function test_invalid_filter_values_return_422(): void
    {
        $this->actingAsAdmin();

        $this->getJson(self::LIST_URL . '?status=bogus')
            ->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Validation failed. Please check your inputs.');

        $this->getJson(self::LIST_URL . '?type=bogus')->assertStatus(422);
        $this->getJson(self::LIST_URL . '?role=bogus')->assertStatus(422);
        $this->getJson(self::LIST_URL . '?location=bogus')->assertStatus(422);
        $this->getJson(self::LIST_URL . '?sensitive=maybe')->assertStatus(422);
        $this->getJson(self::LIST_URL . '?from=not-a-date')->assertStatus(422);
        $this->getJson(self::LIST_URL . '?from=2026-10-10&to=2026-10-01')->assertStatus(422);
    }

    public function test_summary_counts_the_whole_log(): void
    {
        $this->actingAsAdmin();

        $this->makeLog(['action' => 'Today normal'], now());
        $this->makeLog(['action' => 'Today sensitive', 'is_sensitive' => true], now());
        $this->makeLog(['action' => 'Today failed', 'status' => AuditLog::STATUS_FAILED], now());
        $this->makeLog([
            'action' => 'Old sensitive and failed',
            'is_sensitive' => true,
            'status' => AuditLog::STATUS_FAILED,
        ], now()->subDays(3));

        $this->getJson(self::SUMMARY_URL)
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.total', 4)
            ->assertJsonPath('data.today', 3)
            ->assertJsonPath('data.sensitive', 2)
            ->assertJsonPath('data.failed', 2);
    }

    public function test_summary_is_not_affected_by_list_filters(): void
    {
        $this->actingAsAdmin();

        $this->makeLog(['type' => AuditLog::TYPE_LOGIN]);
        $this->makeLog(['type' => AuditLog::TYPE_APPROVE]);

        $this->getJson(self::SUMMARY_URL . '?type=login')
            ->assertOk()
            ->assertJsonPath('data.total', 2);
    }

    public function test_student_cannot_read_the_audit_log(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_USER]));

        $this->getJson(self::LIST_URL)->assertStatus(403);
        $this->getJson(self::SUMMARY_URL)->assertStatus(403);
    }

    public function test_organization_token_cannot_read_the_audit_log(): void
    {
        Sanctum::actingAs($this->makeOrganization('org-one'));

        $this->getJson(self::LIST_URL)->assertStatus(403);
        $this->getJson(self::SUMMARY_URL)->assertStatus(403);
    }

    public function test_guest_cannot_read_the_audit_log(): void
    {
        $this->getJson(self::LIST_URL)->assertStatus(401);
        $this->getJson(self::SUMMARY_URL)->assertStatus(401);
    }

    public function test_reading_the_audit_log_does_not_write_to_it(): void
    {
        $this->actingAsAdmin();
        $this->makeLog();

        $this->getJson(self::LIST_URL)->assertOk();
        $this->getJson(self::SUMMARY_URL)->assertOk();

        $this->assertSame(1, AuditLog::count());
    }

    // ── Helpers ────────────────────────────────────────────────

    private function actingAsAdmin(): User
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        Sanctum::actingAs($admin);

        return $admin;
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

    /**
     * Inserts one audit row directly (so tests can control created_at —
     * rows cannot be updated afterwards).
     *
     * @param  array<string, mixed>  $attributes
     */
    private function makeLog(array $attributes = [], ?Carbon $createdAt = null): AuditLog
    {
        $log = new AuditLog(array_merge([
            'type' => AuditLog::TYPE_LOGIN,
            'action' => 'Login',
            'status' => AuditLog::STATUS_SUCCESS,
        ], $attributes));

        if ($createdAt) {
            $log->created_at = $createdAt;
        }

        $log->save();

        return $log;
    }
}