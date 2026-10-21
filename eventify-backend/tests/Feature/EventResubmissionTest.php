<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Event;
use App\Models\Organization;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class EventResubmissionTest extends TestCase
{
    use RefreshDatabase;

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
            'status' => Event::STATUS_DRAFT,
        ], $overrides));
    }

    private function makeRejectedEvent(Organization $organization): Event
    {
        return $this->makeEvent($organization, [
            'status' => Event::STATUS_REJECTED,
            'admin_notes' => 'The description is too vague.',
        ]);
    }

    public function test_a_rejected_event_can_be_edited_and_stays_rejected_until_resubmitted(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeRejectedEvent($org);
        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson("/api/v1/org/events/{$event->slug}", [
            'description' => 'A much clearer description.',
        ])->assertStatus(200);

        $event->refresh();

        $this->assertSame(Event::STATUS_REJECTED, $event->status);
        $this->assertSame('A much clearer description.', $event->description);
        $this->assertSame('The description is too vague.', $event->admin_notes);
    }

    public function test_resubmitting_a_rejected_event_moves_it_to_review_and_clears_the_reason(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeRejectedEvent($org);
        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson("/api/v1/org/events/{$event->slug}", [
            'action' => 'submit',
            'location' => 'Amman',
            'start_date' => '2027-01-10',
            'end_date' => '2027-01-11',
        ])->assertStatus(200)
            ->assertJsonPath('data.status', Event::STATUS_PENDING_REVIEW)
            ->assertJsonPath('data.admin_notes', null);

        $event->refresh();

        $this->assertSame(Event::STATUS_PENDING_REVIEW, $event->status);
        $this->assertNull($event->admin_notes);
    }

    public function test_resubmitting_a_rejected_event_is_logged_as_a_resubmission(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeRejectedEvent($org);
        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson("/api/v1/org/events/{$event->slug}", [
            'action' => 'submit',
            'location' => 'Amman',
            'start_date' => '2027-01-10',
            'end_date' => '2027-01-11',
        ])->assertStatus(200);

        $log = AuditLog::where('action', 'Updated Event')->first();

        $this->assertNotNull($log);
        $this->assertSame($event->id, $log->target_id);
        $this->assertStringContainsString('resubmitted for review', $log->details);
    }

    public function test_saving_a_rejected_event_as_a_draft_moves_it_back_to_draft(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeRejectedEvent($org);
        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson("/api/v1/org/events/{$event->slug}", [
            'action' => 'draft',
        ])->assertStatus(200);

        $this->assertSame(Event::STATUS_DRAFT, $event->fresh()->status);
    }

    public function test_the_old_rejection_reason_never_reaches_the_public_api_after_resubmission(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeRejectedEvent($org);
        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson("/api/v1/org/events/{$event->slug}", [
            'action' => 'submit',
            'location' => 'Amman',
            'start_date' => '2027-01-10',
            'end_date' => '2027-01-11',
        ])->assertStatus(200);

        // Stand-in for the admin approving the resubmitted event.
        $event->refresh();
        $event->update(['status' => Event::STATUS_PUBLISHED]);

        $this->getJson("/api/v1/events/{$event->slug}")
            ->assertStatus(200)
            ->assertJsonPath('data.admin_notes', null);
    }

    public function test_a_pending_event_cannot_be_edited(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeEvent($org, ['status' => Event::STATUS_PENDING_REVIEW]);
        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson("/api/v1/org/events/{$event->slug}", [
            'description' => 'Trying to edit.',
        ])->assertStatus(422)
            ->assertJsonPath('message', 'Only draft or rejected events can be edited.');
    }

    public function test_a_published_event_cannot_be_edited(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeEvent($org, ['status' => Event::STATUS_PUBLISHED]);
        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson("/api/v1/org/events/{$event->slug}", [
            'description' => 'Trying to edit.',
        ])->assertStatus(422);

        $this->assertSame('A test event.', $event->fresh()->description);
    }

    public function test_another_organization_cannot_edit_a_rejected_event(): void
    {
        $owner = $this->makeOrganization();
        $other = $this->makeOrganization([
            'slug' => 'other-organization',
            'email' => 'other@example.com',
        ]);
        $event = $this->makeRejectedEvent($owner);
        Sanctum::actingAs($other, ['*'], 'organization');

        $this->patchJson("/api/v1/org/events/{$event->slug}", [
            'description' => 'Hijacked.',
        ])->assertStatus(403);

        $this->assertSame('A test event.', $event->fresh()->description);
    }
}