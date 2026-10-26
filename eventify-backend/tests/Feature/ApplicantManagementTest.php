<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ApplicantManagementTest extends TestCase
{
    use RefreshDatabase;

    // ── Student registration now starts as pending ────────────

    public function test_registering_creates_a_pending_registration(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeEvent($org);
        $student = User::factory()->create();

        Sanctum::actingAs($student);

        $this->postJson("/api/v1/events/{$event->slug}/register")
            ->assertStatus(201)
            ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('event_registrations', [
            'event_id' => $event->id,
            'user_id' => $student->id,
            'status' => EventRegistration::STATUS_PENDING,
        ]);
    }

    // ── Listing applicants ────────────────────────────────────

    public function test_organization_lists_the_applicants_of_its_event(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeEvent($org);

        $this->makeRegistration($event, User::factory()->create());
        $this->makeRegistration($event, User::factory()->create());

        Sanctum::actingAs($org, ['*'], 'organization');

        $response = $this->getJson("/api/v1/org/events/{$event->slug}/registrations")
            ->assertOk();

        $this->assertCount(2, $response->json('data'));
    }

    public function test_applicants_can_be_filtered_by_status(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeEvent($org);

        $this->makeRegistration($event, User::factory()->create());
        $this->makeRegistration($event, User::factory()->create(), EventRegistration::STATUS_CONFIRMED);

        Sanctum::actingAs($org, ['*'], 'organization');

        $response = $this->getJson("/api/v1/org/events/{$event->slug}/registrations?status=confirmed")
            ->assertOk();

        $this->assertCount(1, $response->json('data'));
        $this->assertSame('confirmed', $response->json('data.0.status'));
    }

    public function test_the_applicants_list_carries_the_count_of_each_status(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeEvent($org);
        $otherEvent = $this->makeEvent($org, ['slug' => 'another-event', 'title' => 'Another event']);

        $this->makeRegistration($event, User::factory()->create());
        $this->makeRegistration($event, User::factory()->create());
        $this->makeRegistration($event, User::factory()->create(), EventRegistration::STATUS_CONFIRMED);
        $this->makeRegistration($event, User::factory()->create(), EventRegistration::STATUS_REJECTED);
        $this->makeRegistration($event, User::factory()->create(), EventRegistration::STATUS_CANCELLED);
        // Another event's applicants never count here.
        $this->makeRegistration($otherEvent, User::factory()->create(), EventRegistration::STATUS_CONFIRMED);

        Sanctum::actingAs($org, ['*'], 'organization');

        $expected = ['all' => 5, 'pending' => 2, 'confirmed' => 1, 'rejected' => 1, 'cancelled' => 1];

        $this->getJson("/api/v1/org/events/{$event->slug}/registrations")
            ->assertOk()
            ->assertJsonPath('meta.counts', $expected)
            ->assertJsonPath('meta.total', 5);

        // Filtering one status shows only its rows, but the tabs keep their numbers.
        $filtered = $this->getJson("/api/v1/org/events/{$event->slug}/registrations?status=pending")->assertOk();
        $this->assertCount(2, $filtered->json('data'));
        $this->assertSame($expected, $filtered->json('meta.counts'));
    }

    public function test_an_event_without_applicants_has_zero_counts(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeEvent($org);

        Sanctum::actingAs($org, ['*'], 'organization');

        $this->getJson("/api/v1/org/events/{$event->slug}/registrations")
            ->assertOk()
            ->assertJsonPath('meta.counts', ['all' => 0, 'pending' => 0, 'confirmed' => 0, 'rejected' => 0, 'cancelled' => 0]);
    }

    public function test_an_organization_cannot_list_applicants_of_another_organizations_event(): void
    {
        $owner = $this->makeOrganization();
        $event = $this->makeEvent($owner);
        $other = $this->makeOrganization('other@example.com', 'other-organization');

        Sanctum::actingAs($other, ['*'], 'organization');

        $this->getJson("/api/v1/org/events/{$event->slug}/registrations")
            ->assertStatus(403);
    }

    // ── Approving ─────────────────────────────────────────────

    public function test_organization_can_approve_a_pending_registration(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeEvent($org);
        $registration = $this->makeRegistration($event, User::factory()->create());

        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson($this->url($event, $registration, 'approve'))
            ->assertOk()
            ->assertJsonPath('data.status', 'confirmed');

        $registration->refresh();

        $this->assertSame(EventRegistration::STATUS_CONFIRMED, $registration->status);
        $this->assertNotNull($registration->reviewed_at);

        $this->assertDatabaseHas('audit_logs', [
            'type' => AuditLog::TYPE_APPROVE,
            'action' => 'Approved Applicant',
            'location' => AuditLog::LOCATION_EVENTS,
            'status' => AuditLog::STATUS_SUCCESS,
        ]);
    }

    public function test_approving_an_already_approved_registration_is_refused(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeEvent($org);
        $registration = $this->makeRegistration($event, User::factory()->create(), EventRegistration::STATUS_CONFIRMED);

        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson($this->url($event, $registration, 'approve'))
            ->assertStatus(422);
    }

    public function test_approving_a_rejected_registration_is_refused(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeEvent($org);
        $registration = $this->makeRegistration($event, User::factory()->create(), EventRegistration::STATUS_REJECTED, [
            'rejection_count' => 1,
        ]);

        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson($this->url($event, $registration, 'approve'))
            ->assertStatus(422);

        $this->assertSame(EventRegistration::STATUS_REJECTED, $registration->fresh()->status);
    }

    // ── Rejecting ─────────────────────────────────────────────

    public function test_organization_can_reject_a_pending_registration_with_a_reason(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeEvent($org);
        $registration = $this->makeRegistration($event, User::factory()->create());

        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson($this->url($event, $registration, 'reject'), [
            'reason' => 'Your profile does not match the requirements.',
        ])
            ->assertOk()
            ->assertJsonPath('data.status', 'rejected')
            ->assertJsonPath('data.rejection_reason', 'Your profile does not match the requirements.');

        $registration->refresh();

        $this->assertSame(EventRegistration::STATUS_REJECTED, $registration->status);
        $this->assertSame(1, $registration->rejection_count);
        $this->assertNotNull($registration->reviewed_at);

        $this->assertDatabaseHas('audit_logs', [
            'type' => AuditLog::TYPE_REJECT,
            'action' => 'Rejected Applicant',
            'location' => AuditLog::LOCATION_EVENTS,
            'status' => AuditLog::STATUS_SUCCESS,
        ]);
    }

    public function test_rejecting_requires_a_reason(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeEvent($org);
        $registration = $this->makeRegistration($event, User::factory()->create());

        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson($this->url($event, $registration, 'reject'), [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['reason'], 'errors');

        $this->assertSame(EventRegistration::STATUS_PENDING, $registration->fresh()->status);
    }

    public function test_rejecting_an_approved_registration_is_refused(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeEvent($org);
        $registration = $this->makeRegistration($event, User::factory()->create(), EventRegistration::STATUS_CONFIRMED);

        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson($this->url($event, $registration, 'reject'), [
            'reason' => 'Changed our mind about this one.',
        ])->assertStatus(422);

        $this->assertSame(EventRegistration::STATUS_CONFIRMED, $registration->fresh()->status);
    }

    public function test_a_second_rejection_makes_the_student_unable_to_reapply(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeEvent($org);
        $registration = $this->makeRegistration($event, User::factory()->create(), EventRegistration::STATUS_PENDING, [
            'rejection_count' => 1,
        ]);

        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson($this->url($event, $registration, 'reject'), [
            'reason' => 'Still does not meet the requirements.',
        ])
            ->assertOk()
            ->assertJsonPath('data.can_reapply', false);

        $this->assertSame(2, $registration->fresh()->rejection_count);
    }

    // ── Ownership ─────────────────────────────────────────────

    public function test_another_organization_cannot_review_the_registration(): void
    {
        $owner = $this->makeOrganization();
        $event = $this->makeEvent($owner);
        $registration = $this->makeRegistration($event, User::factory()->create());
        $other = $this->makeOrganization('other@example.com', 'other-organization');

        Sanctum::actingAs($other, ['*'], 'organization');

        $this->patchJson($this->url($event, $registration, 'approve'))
            ->assertStatus(403);

        $this->assertSame(EventRegistration::STATUS_PENDING, $registration->fresh()->status);
    }

    public function test_a_registration_of_another_event_is_not_found_under_this_event(): void
    {
        $org = $this->makeOrganization();
        $eventA = $this->makeEvent($org);
        $eventB = $this->makeEvent($org);
        $registrationOfB = $this->makeRegistration($eventB, User::factory()->create());

        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson($this->url($eventA, $registrationOfB, 'approve'))
            ->assertStatus(404);

        $this->assertSame(EventRegistration::STATUS_PENDING, $registrationOfB->fresh()->status);
    }

    // ── What the student sees and can do ──────────────────────

    public function test_student_sees_the_rejection_reason_and_that_they_can_reapply(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeEvent($org);
        $student = User::factory()->create();

        $this->makeRegistration($event, $student, EventRegistration::STATUS_REJECTED, [
            'rejection_reason' => 'Not enough experience.',
            'rejection_count' => 1,
            'reviewed_at' => now(),
        ]);

        Sanctum::actingAs($student);

        $response = $this->getJson('/api/v1/my/registrations')->assertOk();

        $this->assertSame('rejected', $response->json('data.0.status'));
        $this->assertSame('Not enough experience.', $response->json('data.0.rejection_reason'));
        $this->assertTrue($response->json('data.0.can_reapply'));
    }

    public function test_student_can_apply_again_after_the_first_rejection(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeEvent($org);
        $student = User::factory()->create();

        $registration = $this->makeRegistration($event, $student, EventRegistration::STATUS_REJECTED, [
            'rejection_reason' => 'Not enough experience.',
            'rejection_count' => 1,
            'reviewed_at' => now(),
        ]);

        Sanctum::actingAs($student);

        $this->postJson("/api/v1/events/{$event->slug}/register")
            ->assertStatus(201)
            ->assertJsonPath('data.status', 'pending');

        $registration->refresh();

        $this->assertSame(EventRegistration::STATUS_PENDING, $registration->status);
        $this->assertNull($registration->rejection_reason);
        $this->assertNull($registration->reviewed_at);
        $this->assertSame(1, $registration->rejection_count);
    }

    public function test_student_rejected_twice_cannot_apply_again(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeEvent($org);
        $student = User::factory()->create();

        $registration = $this->makeRegistration($event, $student, EventRegistration::STATUS_REJECTED, [
            'rejection_reason' => 'Still not a fit.',
            'rejection_count' => 2,
            'reviewed_at' => now(),
        ]);

        Sanctum::actingAs($student);

        $this->postJson("/api/v1/events/{$event->slug}/register")
            ->assertStatus(422);

        $registration->refresh();

        $this->assertSame(EventRegistration::STATUS_REJECTED, $registration->status);
        $this->assertSame(2, $registration->rejection_count);
    }

    public function test_student_can_register_again_after_cancelling(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeEvent($org);
        $student = User::factory()->create();

        $registration = $this->makeRegistration($event, $student, EventRegistration::STATUS_CANCELLED);

        Sanctum::actingAs($student);

        $this->postJson("/api/v1/events/{$event->slug}/register")
            ->assertStatus(201)
            ->assertJsonPath('data.status', 'pending');

        $this->assertSame(EventRegistration::STATUS_PENDING, $registration->fresh()->status);
    }

    // ── Who can call the organization endpoints ───────────────

    public function test_a_student_token_cannot_review_registrations(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeEvent($org);
        $student = User::factory()->create();
        $registration = $this->makeRegistration($event, $student);

        Sanctum::actingAs($student);

        $response = $this->patchJson($this->url($event, $registration, 'approve'));

        $this->assertContains($response->getStatusCode(), [401, 403]);
        $this->assertSame(EventRegistration::STATUS_PENDING, $registration->fresh()->status);
    }

    public function test_a_request_without_a_token_is_unauthorized(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeEvent($org);

        $this->getJson("/api/v1/org/events/{$event->slug}/registrations")
            ->assertStatus(401);
    }

    // ── Helpers ───────────────────────────────────────────────

    private function makeOrganization(
        string $email = 'org@example.com',
        string $slug = 'test-organization'
    ): Organization {
        return Organization::create([
            'name' => 'Test Organization',
            'slug' => $slug,
            'email' => $email,
            'password' => 'Password123',
            'status' => Organization::STATUS_APPROVED,
        ]);
    }

    /**
     * A published event (open for registration, since no deadline is set).
     *
     * @param  array<string, mixed>  $overrides
     */
    private function makeEvent(Organization $org, array $overrides = []): Event
    {
        $title = $overrides['title'] ?? 'Event ' . Str::random(6);

        return Event::create(array_merge([
            'organization_id' => $org->id,
            'title' => $title,
            'slug' => Str::slug($title) . '-' . Str::lower(Str::random(5)),
            'description' => 'A test event.',
            'type' => Event::TYPE_WORKSHOP,
            'status' => Event::STATUS_PUBLISHED,
        ], $overrides));
    }

    /**
     * @param  array<string, mixed>  $extra
     */
    private function makeRegistration(
        Event $event,
        User $student,
        string $status = EventRegistration::STATUS_PENDING,
        array $extra = []
    ): EventRegistration {
        return EventRegistration::create(array_merge([
            'event_id' => $event->id,
            'user_id' => $student->id,
            'status' => $status,
        ], $extra));
    }

    private function url(Event $event, EventRegistration $registration, string $action): string
    {
        return "/api/v1/org/events/{$event->slug}/registrations/{$registration->id}/{$action}";
    }
}