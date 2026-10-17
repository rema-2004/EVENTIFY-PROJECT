<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Event;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuditLogActionsTest extends TestCase
{
    use RefreshDatabase;

    private function makeAdmin(): User
    {
        return User::factory()->create([
            'name' => 'Admin Sara',
            'role' => User::ROLE_ADMIN,
        ]);
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

    private function makeEvent(Organization $organization, array $overrides = []): Event
    {
        $title = $overrides['title'] ?? 'Event ' . Str::random(6);

        return Event::create(array_merge([
            'organization_id' => $organization->id,
            'title' => $title,
            'slug' => Str::slug($title) . '-' . Str::lower(Str::random(5)),
            'description' => 'A test event.',
            'type' => Event::TYPE_WORKSHOP,
            'status' => Event::STATUS_PUBLISHED,
        ], $overrides));
    }

    // ── Admin: organizations ───────────────────────────────────

    public function test_approving_an_organization_is_logged(): void
    {
        $admin = $this->makeAdmin();
        $org = $this->makeOrganization(['status' => Organization::STATUS_PENDING]);
        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/admin/organizations/{$org->id}/approve")->assertStatus(200);

        $this->assertDatabaseHas('audit_logs', [
            'type' => AuditLog::TYPE_APPROVE,
            'action' => 'Approved Organization',
            'location' => AuditLog::LOCATION_ORGANIZATIONS,
            'status' => AuditLog::STATUS_SUCCESS,
            'actor_id' => $admin->id,
            'actor_name' => 'Admin Sara',
            'actor_role' => AuditLog::ROLE_ADMIN,
            'target_type' => $org->getMorphClass(),
            'target_id' => $org->id,
            'target_label' => 'Test Organization',
        ]);
    }

    public function test_approving_an_already_approved_organization_is_not_logged(): void
    {
        $admin = $this->makeAdmin();
        $org = $this->makeOrganization();
        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/admin/organizations/{$org->id}/approve")->assertStatus(422);

        $this->assertDatabaseCount('audit_logs', 0);
    }

    public function test_rejecting_an_organization_is_logged_with_the_reason(): void
    {
        $admin = $this->makeAdmin();
        $org = $this->makeOrganization(['status' => Organization::STATUS_PENDING]);
        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/admin/organizations/{$org->id}/reject", [
            'admin_notes' => 'The license document is unreadable.',
        ])->assertStatus(200);

        $this->assertDatabaseHas('audit_logs', [
            'type' => AuditLog::TYPE_REJECT,
            'action' => 'Rejected Organization',
            'actor_id' => $admin->id,
            'target_id' => $org->id,
            'details' => 'The license document is unreadable.',
        ]);
    }

    public function test_downloading_a_license_is_logged_as_a_sensitive_export(): void
    {
        Storage::fake('local');
        Storage::disk('local')->put('licenses/license.pdf', 'pdf-content');

        $admin = $this->makeAdmin();
        $org = $this->makeOrganization(['license_document' => 'licenses/license.pdf']);
        Sanctum::actingAs($admin);

        $this->get("/api/v1/admin/organizations/{$org->id}/license")->assertStatus(200);

        $this->assertDatabaseHas('audit_logs', [
            'type' => AuditLog::TYPE_EXPORT,
            'action' => 'Downloaded Organization License',
            'is_sensitive' => true,
            'actor_id' => $admin->id,
            'target_id' => $org->id,
        ]);
    }

    public function test_a_license_request_with_no_document_is_not_logged(): void
    {
        $admin = $this->makeAdmin();
        $org = $this->makeOrganization();
        Sanctum::actingAs($admin);

        $this->getJson("/api/v1/admin/organizations/{$org->id}/license")->assertStatus(404);

        $this->assertDatabaseCount('audit_logs', 0);
    }

    public function test_a_non_admin_cannot_approve_and_nothing_is_logged(): void
    {
        $student = User::factory()->create();
        $org = $this->makeOrganization(['status' => Organization::STATUS_PENDING]);
        Sanctum::actingAs($student);

        $this->patchJson("/api/v1/admin/organizations/{$org->id}/approve")->assertStatus(403);

        $this->assertDatabaseCount('audit_logs', 0);
    }

    // ── Admin: events ──────────────────────────────────────────

    public function test_approving_an_event_is_logged(): void
    {
        $admin = $this->makeAdmin();
        $org = $this->makeOrganization();
        $event = $this->makeEvent($org, [
            'title' => 'Spring Hackathon',
            'status' => Event::STATUS_PENDING_REVIEW,
        ]);
        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/admin/events/{$event->slug}/approve")->assertStatus(200);

        $this->assertDatabaseHas('audit_logs', [
            'type' => AuditLog::TYPE_APPROVE,
            'action' => 'Approved Event',
            'location' => AuditLog::LOCATION_EVENTS,
            'actor_id' => $admin->id,
            'actor_role' => AuditLog::ROLE_ADMIN,
            'target_type' => $event->getMorphClass(),
            'target_id' => $event->id,
            'target_label' => 'Spring Hackathon',
        ]);
    }

    public function test_rejecting_an_event_is_logged_with_the_reason(): void
    {
        $admin = $this->makeAdmin();
        $org = $this->makeOrganization();
        $event = $this->makeEvent($org, ['status' => Event::STATUS_PENDING_REVIEW]);
        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/admin/events/{$event->slug}/reject", [
            'admin_notes' => 'The description is too vague.',
        ])->assertStatus(200);

        $this->assertDatabaseHas('audit_logs', [
            'type' => AuditLog::TYPE_REJECT,
            'action' => 'Rejected Event',
            'actor_id' => $admin->id,
            'target_id' => $event->id,
            'details' => 'The description is too vague.',
        ]);
    }

    public function test_approving_an_event_that_is_not_pending_is_not_logged(): void
    {
        $admin = $this->makeAdmin();
        $org = $this->makeOrganization();
        $event = $this->makeEvent($org, ['status' => Event::STATUS_DRAFT]);
        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/admin/events/{$event->slug}/approve")->assertStatus(422);

        $this->assertDatabaseCount('audit_logs', 0);
    }

    // ── Organization: events ───────────────────────────────────

    public function test_saving_a_draft_event_is_logged(): void
    {
        $org = $this->makeOrganization();
        Sanctum::actingAs($org, ['*'], 'organization');

        $this->postJson('/api/v1/org/events', [
            'title' => 'Draft Workshop',
            'type' => Event::TYPE_WORKSHOP,
            'description' => 'About the workshop.',
            'action' => 'draft',
        ])->assertStatus(201);

        $log = AuditLog::where('action', 'Created Event')->first();

        $this->assertNotNull($log);
        $this->assertSame(AuditLog::TYPE_CREATE, $log->type);
        $this->assertSame(AuditLog::LOCATION_EVENTS, $log->location);
        $this->assertSame($org->id, $log->actor_id);
        $this->assertSame(AuditLog::ROLE_ORGANIZATION, $log->actor_role);
        $this->assertSame('Draft Workshop', $log->target_label);
        $this->assertStringContainsString('draft', $log->details);
    }

    public function test_submitting_an_event_for_review_is_logged(): void
    {
        $org = $this->makeOrganization();
        Sanctum::actingAs($org, ['*'], 'organization');

        $this->postJson('/api/v1/org/events', [
            'title' => 'Submitted Workshop',
            'type' => Event::TYPE_WORKSHOP,
            'description' => 'About the workshop.',
            'location' => 'Amman',
            'start_date' => '2027-01-10',
            'end_date' => '2027-01-11',
            'action' => 'submit',
        ])->assertStatus(201);

        $log = AuditLog::where('action', 'Created Event')->first();

        $this->assertNotNull($log);
        $this->assertStringContainsString('submitted for review', $log->details);
    }

    public function test_an_unapproved_organization_cannot_create_events_and_nothing_is_logged(): void
    {
        $org = $this->makeOrganization(['status' => Organization::STATUS_PENDING]);
        Sanctum::actingAs($org, ['*'], 'organization');

        $this->postJson('/api/v1/org/events', [
            'title' => 'Not Allowed',
            'type' => Event::TYPE_WORKSHOP,
            'description' => 'About it.',
            'action' => 'draft',
        ])->assertStatus(403);

        $this->assertDatabaseCount('audit_logs', 0);
    }

    public function test_updating_a_draft_event_is_logged(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeEvent($org, ['status' => Event::STATUS_DRAFT]);
        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson("/api/v1/org/events/{$event->slug}", [
            'title' => 'Renamed Workshop',
        ])->assertStatus(200);

        $log = AuditLog::where('action', 'Updated Event')->first();

        $this->assertNotNull($log);
        $this->assertSame(AuditLog::TYPE_UPDATE, $log->type);
        $this->assertSame($org->id, $log->actor_id);
        $this->assertSame($event->id, $log->target_id);
        $this->assertSame('Renamed Workshop', $log->target_label);
        $this->assertStringContainsString('edited by the organization', $log->details);
    }

    public function test_submitting_a_draft_through_an_update_is_logged_as_submitted(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeEvent($org, ['status' => Event::STATUS_DRAFT]);
        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson("/api/v1/org/events/{$event->slug}", [
            'action' => 'submit',
            'location' => 'Amman',
            'start_date' => '2027-01-10',
            'end_date' => '2027-01-11',
        ])->assertStatus(200);

        $log = AuditLog::where('action', 'Updated Event')->first();

        $this->assertNotNull($log);
        $this->assertStringContainsString('submitted for review', $log->details);
    }

    public function test_updating_another_organizations_event_is_forbidden_and_not_logged(): void
    {
        $owner = $this->makeOrganization();
        $other = $this->makeOrganization([
            'slug' => 'other-organization',
            'email' => 'other@example.com',
        ]);
        $event = $this->makeEvent($owner, ['status' => Event::STATUS_DRAFT]);
        Sanctum::actingAs($other, ['*'], 'organization');

        $this->patchJson("/api/v1/org/events/{$event->slug}", [
            'title' => 'Hijacked',
        ])->assertStatus(403);

        $this->assertDatabaseCount('audit_logs', 0);
    }

    public function test_deleting_a_draft_event_is_logged_with_its_title(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeEvent($org, [
            'title' => 'Doomed Draft',
            'status' => Event::STATUS_DRAFT,
        ]);
        Sanctum::actingAs($org, ['*'], 'organization');

        $this->deleteJson("/api/v1/org/events/{$event->slug}")->assertStatus(200);

        $this->assertDatabaseHas('audit_logs', [
            'type' => AuditLog::TYPE_DELETE,
            'action' => 'Deleted Event',
            'actor_id' => $org->id,
            'target_id' => $event->id,
            'target_label' => 'Doomed Draft',
        ]);
    }

    // ── Student: event registration ────────────────────────────

    public function test_registering_for_an_event_is_logged(): void
    {
        $student = User::factory()->create();
        $event = $this->makeEvent($this->makeOrganization(), ['title' => 'Open Workshop']);
        Sanctum::actingAs($student);

        $this->postJson("/api/v1/events/{$event->slug}/register")->assertStatus(201);

        $this->assertDatabaseHas('audit_logs', [
            'type' => AuditLog::TYPE_CREATE,
            'action' => 'Registered for Event',
            'location' => AuditLog::LOCATION_EVENTS,
            'actor_id' => $student->id,
            'actor_role' => AuditLog::ROLE_PARTICIPANT,
            'target_id' => $event->id,
            'target_label' => 'Open Workshop',
        ]);
    }

    public function test_cancelling_a_registration_is_logged(): void
    {
        $student = User::factory()->create();
        $event = $this->makeEvent($this->makeOrganization());
        Sanctum::actingAs($student);

        $this->postJson("/api/v1/events/{$event->slug}/register")->assertStatus(201);
        $this->deleteJson("/api/v1/events/{$event->slug}/register")->assertStatus(200);

        $this->assertDatabaseHas('audit_logs', [
            'type' => AuditLog::TYPE_UPDATE,
            'action' => 'Cancelled Registration',
            'actor_id' => $student->id,
            'target_id' => $event->id,
        ]);
    }

    public function test_a_duplicate_registration_is_rejected_and_logged_only_once(): void
    {
        $student = User::factory()->create();
        $event = $this->makeEvent($this->makeOrganization());
        Sanctum::actingAs($student);

        $this->postJson("/api/v1/events/{$event->slug}/register")->assertStatus(201);
        $this->postJson("/api/v1/events/{$event->slug}/register")->assertStatus(422);

        $this->assertSame(1, AuditLog::where('action', 'Registered for Event')->count());
    }

    public function test_an_organization_token_cannot_register_for_events_and_nothing_is_logged(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeEvent($org);
        Sanctum::actingAs($org);

        $this->postJson("/api/v1/events/{$event->slug}/register")->assertStatus(403);

        $this->assertDatabaseCount('audit_logs', 0);
    }
}