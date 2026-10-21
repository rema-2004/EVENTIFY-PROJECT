<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\Organization;
use App\Models\SavedOpportunity;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SavedOpportunityApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * There is no EventFactory in the project, so events are created
     * directly. All events in a test share one organization.
     */
    private function makeEvent(array $overrides = []): Event
    {
        $organization = Organization::first() ?? Organization::create([
            'name' => 'Test Organization',
            'slug' => 'test-organization',
            'email' => 'org@example.com',
            'password' => 'Password123',
            'status' => Organization::STATUS_APPROVED,
        ]);

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

    public function test_student_can_save_a_published_event(): void
    {
        $user = User::factory()->create();
        $event = $this->makeEvent();
        Sanctum::actingAs($user);

        $this->postJson("/api/v1/events/{$event->slug}/save")
            ->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.event.slug', $event->slug);

        $this->assertDatabaseHas('saved_opportunities', [
            'user_id' => $user->id,
            'event_id' => $event->id,
        ]);
    }

    public function test_saving_the_same_event_twice_is_rejected(): void
    {
        $user = User::factory()->create();
        $event = $this->makeEvent();
        Sanctum::actingAs($user);

        $this->postJson("/api/v1/events/{$event->slug}/save")->assertStatus(201);

        $this->postJson("/api/v1/events/{$event->slug}/save")
            ->assertStatus(422)
            ->assertJsonPath('success', false);

        $this->assertDatabaseCount('saved_opportunities', 1);
    }

    public function test_an_unpublished_event_cannot_be_saved(): void
    {
        $user = User::factory()->create();
        $draft = $this->makeEvent(['status' => Event::STATUS_DRAFT]);
        Sanctum::actingAs($user);

        $this->postJson("/api/v1/events/{$draft->slug}/save")
            ->assertStatus(404);

        $this->assertDatabaseCount('saved_opportunities', 0);
    }

    public function test_saving_an_unknown_event_returns_404(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/v1/events/no-such-event/save')
            ->assertStatus(404);
    }

    public function test_student_can_remove_a_saved_event(): void
    {
        $user = User::factory()->create();
        $event = $this->makeEvent();
        SavedOpportunity::factory()->create([
            'user_id' => $user->id,
            'event_id' => $event->id,
        ]);
        Sanctum::actingAs($user);

        $this->deleteJson("/api/v1/events/{$event->slug}/save")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('saved_opportunities', [
            'user_id' => $user->id,
            'event_id' => $event->id,
        ]);
    }

    public function test_removing_an_event_that_is_not_saved_is_rejected(): void
    {
        $user = User::factory()->create();
        $event = $this->makeEvent();
        Sanctum::actingAs($user);

        $this->deleteJson("/api/v1/events/{$event->slug}/save")
            ->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_a_saved_event_can_still_be_removed_after_it_is_cancelled(): void
    {
        $user = User::factory()->create();
        $event = $this->makeEvent();
        SavedOpportunity::factory()->create([
            'user_id' => $user->id,
            'event_id' => $event->id,
        ]);
        $event->update(['status' => Event::STATUS_CANCELLED]);
        Sanctum::actingAs($user);

        $this->deleteJson("/api/v1/events/{$event->slug}/save")
            ->assertOk();

        $this->assertDatabaseCount('saved_opportunities', 0);
    }

    public function test_student_lists_only_their_own_saved_events_newest_first(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        $first = $this->makeEvent();
        $second = $this->makeEvent();
        $third = $this->makeEvent();

        SavedOpportunity::factory()->create(['user_id' => $user->id, 'event_id' => $first->id]);
        SavedOpportunity::factory()->create(['user_id' => $user->id, 'event_id' => $second->id]);
        SavedOpportunity::factory()->create(['user_id' => $other->id, 'event_id' => $third->id]);

        Sanctum::actingAs($user);

        $this->getJson('/api/v1/my/saved-opportunities')
            ->assertOk()
            ->assertJsonPath('meta.total', 2)
            ->assertJsonPath('data.0.event.slug', $second->slug);
    }

    public function test_list_skips_events_that_were_deleted_after_saving(): void
    {
        $user = User::factory()->create();
        $event = $this->makeEvent();
        SavedOpportunity::factory()->create([
            'user_id' => $user->id,
            'event_id' => $event->id,
        ]);
        $event->delete();
        Sanctum::actingAs($user);

        $this->getJson('/api/v1/my/saved-opportunities')
            ->assertOk()
            ->assertJsonPath('meta.total', 0);
    }

    public function test_guest_cannot_access_saved_opportunities(): void
    {
        $this->getJson('/api/v1/my/saved-opportunities')->assertStatus(401);
    }

    public function test_organization_token_is_rejected_even_when_its_id_matches_a_student(): void
    {
        // Student and organization both get id 1 on a fresh database.
        $student = User::factory()->create();
        $event = $this->makeEvent();
        $organization = Organization::first();

        $this->assertSame($student->id, $organization->id);

        SavedOpportunity::factory()->create([
            'user_id' => $student->id,
            'event_id' => $event->id,
        ]);

        Sanctum::actingAs($organization);

        $this->getJson('/api/v1/my/saved-opportunities')->assertStatus(403);
        $this->postJson("/api/v1/events/{$event->slug}/save")->assertStatus(403);
        $this->deleteJson("/api/v1/events/{$event->slug}/save")->assertStatus(403);

        $this->assertDatabaseCount('saved_opportunities', 1);
    }
}