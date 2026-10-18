<?php

namespace Tests\Feature;

use App\Mail\EventRejectedMail;
use App\Models\AuditLog;
use App\Models\Event;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use RuntimeException;
use Tests\TestCase;

class EventRejectionEmailTest extends TestCase
{
    use RefreshDatabase;

    private function makeAdmin(): User
    {
        return User::factory()->create(['role' => User::ROLE_ADMIN]);
    }

    private function makeOrganization(): Organization
    {
        return Organization::create([
            'name' => 'Test Organization',
            'slug' => 'test-organization',
            'email' => 'org@example.com',
            'password' => 'Password123',
            'status' => Organization::STATUS_APPROVED,
        ]);
    }

    private function makePendingEvent(Organization $organization, array $overrides = []): Event
    {
        $title = $overrides['title'] ?? 'Spring Hackathon';

        return Event::create(array_merge([
            'organization_id' => $organization->id,
            'title' => $title,
            'slug' => Str::slug($title) . '-' . Str::lower(Str::random(5)),
            'description' => 'A test event.',
            'type' => Event::TYPE_WORKSHOP,
            'status' => Event::STATUS_PENDING_REVIEW,
        ], $overrides));
    }

    public function test_rejecting_an_event_emails_the_organization_the_reason(): void
    {
        Mail::fake();

        $org = $this->makeOrganization();
        $event = $this->makePendingEvent($org);
        Sanctum::actingAs($this->makeAdmin());

        $this->patchJson("/api/v1/admin/events/{$event->slug}/reject", [
            'admin_notes' => 'The description is too vague.',
        ])->assertStatus(200);

        Mail::assertSent(EventRejectedMail::class, function (EventRejectedMail $mail) use ($org) {
            return $mail->hasTo('org@example.com')
                && $mail->organizationName === $org->name
                && $mail->eventTitle === 'Spring Hackathon'
                && $mail->reason === 'The description is too vague.';
        });
        Mail::assertSentCount(1);
    }

    public function test_approving_an_event_sends_no_email(): void
    {
        Mail::fake();

        $event = $this->makePendingEvent($this->makeOrganization());
        Sanctum::actingAs($this->makeAdmin());

        $this->patchJson("/api/v1/admin/events/{$event->slug}/approve")->assertStatus(200);

        Mail::assertNothingSent();
    }

    public function test_a_rejection_that_is_refused_sends_no_email(): void
    {
        Mail::fake();

        $event = $this->makePendingEvent($this->makeOrganization(), [
            'status' => Event::STATUS_DRAFT,
        ]);
        Sanctum::actingAs($this->makeAdmin());

        $this->patchJson("/api/v1/admin/events/{$event->slug}/reject", [
            'admin_notes' => 'The description is too vague.',
        ])->assertStatus(422);

        Mail::assertNothingSent();
    }

    public function test_a_mail_failure_does_not_undo_the_rejection(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makePendingEvent($org);
        $admin = $this->makeAdmin();
        Sanctum::actingAs($admin);

        Mail::shouldReceive('to')
            ->once()
            ->andThrow(new RuntimeException('SMTP server is down'));

        $this->patchJson("/api/v1/admin/events/{$event->slug}/reject", [
            'admin_notes' => 'The description is too vague.',
        ])->assertStatus(200)
            ->assertJsonPath('success', true);

        $event->refresh();

        $this->assertSame(Event::STATUS_REJECTED, $event->status);
        $this->assertSame('The description is too vague.', $event->admin_notes);
        $this->assertDatabaseHas('audit_logs', [
            'action' => 'Rejected Event',
            'actor_id' => $admin->id,
            'target_id' => $event->id,
        ]);
    }

    public function test_rejecting_an_event_of_a_deleted_organization_still_works_without_an_email(): void
    {
        Mail::fake();

        $org = $this->makeOrganization();
        $event = $this->makePendingEvent($org);
        $org->delete();
        Sanctum::actingAs($this->makeAdmin());

        $this->patchJson("/api/v1/admin/events/{$event->slug}/reject", [
            'admin_notes' => 'The description is too vague.',
        ])->assertStatus(200);

        $this->assertSame(Event::STATUS_REJECTED, $event->fresh()->status);
        Mail::assertNothingSent();
    }

    public function test_the_email_escapes_html_in_the_reason_and_keeps_line_breaks(): void
    {
        $html = (new EventRejectedMail(
            'Test Organization',
            'Spring Hackathon',
            "<script>alert(1)</script>\nSecond line"
        ))->render();

        $this->assertStringNotContainsString('<script>', $html);
        $this->assertStringContainsString('&lt;script&gt;', $html);
        $this->assertStringContainsString('<br', $html);
        $this->assertStringContainsString('Second line', $html);
    }

    public function test_the_email_shows_the_event_title_and_organization_name(): void
    {
        $html = (new EventRejectedMail(
            'Test Organization',
            'Spring Hackathon',
            'The description is too vague.'
        ))->render();

        $this->assertStringContainsString('Test Organization', $html);
        $this->assertStringContainsString('Spring Hackathon', $html);
        $this->assertStringContainsString('The description is too vague.', $html);
    }
}