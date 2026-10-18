<?php

namespace Tests\Feature;

use App\Models\Competition;
use App\Models\Event;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CompetitionParticipationTest extends TestCase
{
    use RefreshDatabase;

    // ── Creating a competition (organization) ─────────────────

    public function test_a_draft_competition_is_accepted_without_participation_fields(): void
    {
        $this->actingAsOrganization();

        $this->postJson('/api/v1/org/events', [
            'title' => 'Draft Hack',
            'type' => 'competition',
            'description' => 'A draft competition.',
            'action' => 'draft',
        ])->assertStatus(201);

        $competition = Competition::first();

        $this->assertNotNull($competition);
        $this->assertNull($competition->participation_type);
        $this->assertNull($competition->min_team_size);
        $this->assertNull($competition->max_team_size);
    }

    public function test_submitting_a_competition_requires_the_participation_type(): void
    {
        $this->actingAsOrganization();

        $this->postJson('/api/v1/org/events', $this->submitPayload())
            ->assertStatus(422)
            ->assertJsonValidationErrors(['participation_type'], 'errors');
    }

    public function test_submitting_a_team_competition_requires_both_team_sizes(): void
    {
        $this->actingAsOrganization();

        $this->postJson('/api/v1/org/events', $this->submitPayload([
            'participation_type' => 'team',
        ]))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['min_team_size', 'max_team_size'], 'errors');
    }

    public function test_a_valid_team_competition_is_stored_and_sent_for_review(): void
    {
        $this->actingAsOrganization();

        $this->postJson('/api/v1/org/events', $this->submitPayload([
            'participation_type' => 'team',
            'min_team_size' => 2,
            'max_team_size' => 4,
        ]))->assertStatus(201);

        $event = Event::where('title', 'Hack Night')->first();
        $competition = Competition::find($event->id);

        $this->assertSame(Event::STATUS_PENDING_REVIEW, $event->status);
        $this->assertSame('team', $competition->participation_type);
        $this->assertSame(2, $competition->min_team_size);
        $this->assertSame(4, $competition->max_team_size);
    }

    public function test_a_solo_competition_is_accepted_without_team_sizes(): void
    {
        $this->actingAsOrganization();

        $this->postJson('/api/v1/org/events', $this->submitPayload([
            'participation_type' => 'solo',
        ]))->assertStatus(201);

        $competition = Competition::first();

        $this->assertSame('solo', $competition->participation_type);
        $this->assertNull($competition->min_team_size);
        $this->assertNull($competition->max_team_size);
    }

    public function test_a_solo_competition_rejects_team_sizes(): void
    {
        $this->actingAsOrganization();

        $this->postJson('/api/v1/org/events', $this->submitPayload([
            'participation_type' => 'solo',
            'min_team_size' => 2,
        ]))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['min_team_size'], 'errors');
    }

    public function test_the_maximum_team_size_cannot_be_below_the_minimum(): void
    {
        $this->actingAsOrganization();

        $this->postJson('/api/v1/org/events', $this->submitPayload([
            'participation_type' => 'team',
            'min_team_size' => 4,
            'max_team_size' => 2,
        ]))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['max_team_size'], 'errors');
    }

    public function test_team_size_limits_must_be_sensible_numbers(): void
    {
        $this->actingAsOrganization();

        $this->postJson('/api/v1/org/events', $this->submitPayload([
            'participation_type' => 'both',
            'min_team_size' => 1,
            'max_team_size' => 4,
        ]))->assertStatus(422)->assertJsonValidationErrors(['min_team_size'], 'errors');

        $this->postJson('/api/v1/org/events', $this->submitPayload([
            'participation_type' => 'both',
            'min_team_size' => 2,
            'max_team_size' => 51,
        ]))->assertStatus(422)->assertJsonValidationErrors(['max_team_size'], 'errors');
    }

    public function test_an_unknown_participation_type_is_rejected(): void
    {
        $this->actingAsOrganization();

        $this->postJson('/api/v1/org/events', $this->submitPayload([
            'participation_type' => 'duo',
        ]))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['participation_type'], 'errors');
    }

    // ── Editing a competition (organization) ──────────────────

    public function test_a_partial_update_keeps_the_participation_rules(): void
    {
        $org = $this->actingAsOrganization();
        $event = $this->makeCompetitionEvent($org, [
            'participation_type' => 'team',
            'min_team_size' => 2,
            'max_team_size' => 4,
        ], ['status' => Event::STATUS_DRAFT]);

        $this->patchJson("/api/v1/org/events/{$event->slug}", [
            'description' => 'A new description.',
        ])->assertOk();

        $competition = Competition::find($event->id);

        $this->assertSame('team', $competition->participation_type);
        $this->assertSame(2, $competition->min_team_size);
        $this->assertSame(4, $competition->max_team_size);
    }

    public function test_changing_a_competition_to_solo_clears_the_team_sizes(): void
    {
        $org = $this->actingAsOrganization();
        $event = $this->makeCompetitionEvent($org, [
            'participation_type' => 'team',
            'min_team_size' => 2,
            'max_team_size' => 4,
        ], ['status' => Event::STATUS_DRAFT]);

        $this->patchJson("/api/v1/org/events/{$event->slug}", [
            'participation_type' => 'solo',
        ])->assertOk();

        $competition = Competition::find($event->id);

        $this->assertSame('solo', $competition->participation_type);
        $this->assertNull($competition->min_team_size);
        $this->assertNull($competition->max_team_size);
    }

    public function test_a_solo_competition_cannot_be_given_team_sizes_by_an_update(): void
    {
        $org = $this->actingAsOrganization();
        $event = $this->makeCompetitionEvent($org, [
            'participation_type' => 'solo',
        ], ['status' => Event::STATUS_DRAFT]);

        $this->patchJson("/api/v1/org/events/{$event->slug}", [
            'min_team_size' => 2,
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['min_team_size'], 'errors');
    }

    public function test_an_update_can_raise_the_maximum_without_resending_the_minimum(): void
    {
        $org = $this->actingAsOrganization();
        $event = $this->makeCompetitionEvent($org, [
            'participation_type' => 'team',
            'min_team_size' => 2,
            'max_team_size' => 4,
        ], ['status' => Event::STATUS_DRAFT]);

        $this->patchJson("/api/v1/org/events/{$event->slug}", [
            'max_team_size' => 6,
        ])->assertOk();

        $competition = Competition::find($event->id);

        $this->assertSame(2, $competition->min_team_size);
        $this->assertSame(6, $competition->max_team_size);
    }

    public function test_an_update_cannot_set_the_maximum_below_the_stored_minimum(): void
    {
        $org = $this->actingAsOrganization();
        $event = $this->makeCompetitionEvent($org, [
            'participation_type' => 'team',
            'min_team_size' => 3,
            'max_team_size' => 5,
        ], ['status' => Event::STATUS_DRAFT]);

        $this->patchJson("/api/v1/org/events/{$event->slug}", [
            'max_team_size' => 2,
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['max_team_size'], 'errors');

        $this->assertSame(5, Competition::find($event->id)->max_team_size);
    }

    public function test_submitting_an_existing_draft_competition_requires_the_participation_type(): void
    {
        $org = $this->actingAsOrganization();
        $event = $this->makeCompetitionEvent($org, [], ['status' => Event::STATUS_DRAFT]);

        $this->patchJson("/api/v1/org/events/{$event->slug}", [
            'action' => 'submit',
            'location' => 'Amman',
            'start_date' => '2027-03-10',
            'end_date' => '2027-03-11',
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['participation_type'], 'errors');
    }

    // ── Model rules ───────────────────────────────────────────

    public function test_solo_competition_rules(): void
    {
        $competition = new Competition(['participation_type' => 'solo']);

        $this->assertTrue($competition->allowsSolo());
        $this->assertFalse($competition->allowsTeams());
        $this->assertFalse($competition->allowsTeamSize(3));
    }

    public function test_team_competition_rules_respect_the_size_limits(): void
    {
        $competition = new Competition([
            'participation_type' => 'team',
            'min_team_size' => 2,
            'max_team_size' => 4,
        ]);

        $this->assertFalse($competition->allowsSolo());
        $this->assertTrue($competition->allowsTeams());
        $this->assertFalse($competition->allowsTeamSize(1));
        $this->assertTrue($competition->allowsTeamSize(2));
        $this->assertTrue($competition->allowsTeamSize(3));
        $this->assertTrue($competition->allowsTeamSize(4));
        $this->assertFalse($competition->allowsTeamSize(5));
    }

    public function test_both_competition_without_limits_allows_any_team_size(): void
    {
        $competition = new Competition(['participation_type' => 'both']);

        $this->assertTrue($competition->allowsSolo());
        $this->assertTrue($competition->allowsTeams());
        $this->assertTrue($competition->allowsTeamSize(1));
        $this->assertTrue($competition->allowsTeamSize(99));
    }

    public function test_a_limit_set_on_one_side_only_is_still_enforced(): void
    {
        $competition = new Competition([
            'participation_type' => 'both',
            'min_team_size' => 2,
        ]);

        $this->assertFalse($competition->allowsTeamSize(1));
        $this->assertTrue($competition->allowsTeamSize(100));
    }

    public function test_an_older_competition_without_a_type_has_no_restriction(): void
    {
        $competition = new Competition();

        $this->assertTrue($competition->allowsSolo());
        $this->assertTrue($competition->allowsTeams());
        $this->assertTrue($competition->allowsTeamSize(7));
    }

    // ── Public API fields ─────────────────────────────────────

    public function test_the_public_event_shows_the_participation_fields(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeCompetitionEvent($org, [
            'participation_type' => 'team',
            'min_team_size' => 2,
            'max_team_size' => 4,
        ]);

        $this->getJson("/api/v1/events/{$event->slug}")
            ->assertOk()
            ->assertJsonPath('data.participation_type', 'team')
            ->assertJsonPath('data.min_team_size', 2)
            ->assertJsonPath('data.max_team_size', 4)
            ->assertJsonPath('data.allows_solo', false);
    }

    public function test_an_older_competition_is_shown_as_both(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeCompetitionEvent($org, []);

        $this->getJson("/api/v1/events/{$event->slug}")
            ->assertOk()
            ->assertJsonPath('data.participation_type', 'both')
            ->assertJsonPath('data.allows_solo', true)
            ->assertJsonPath('data.min_team_size', null)
            ->assertJsonPath('data.max_team_size', null);
    }

    public function test_a_non_competition_event_has_empty_participation_fields(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeEvent($org, ['type' => Event::TYPE_WORKSHOP]);

        $this->getJson("/api/v1/events/{$event->slug}")
            ->assertOk()
            ->assertJsonPath('data.participation_type', null)
            ->assertJsonPath('data.allows_solo', null);
    }

    // ── Registration ──────────────────────────────────────────

    public function test_a_student_cannot_register_alone_for_a_team_competition(): void
    {
        $org = $this->makeOrganization();
        $event = $this->makeCompetitionEvent($org, [
            'participation_type' => 'team',
            'min_team_size' => 2,
            'max_team_size' => 4,
        ]);

        Sanctum::actingAs(User::factory()->create());

        $this->postJson("/api/v1/events/{$event->slug}/register")
            ->assertStatus(422)
            ->assertJsonPath('message', 'This competition requires a team.');

        $this->assertDatabaseCount('event_registrations', 0);
    }

    public function test_a_student_can_register_alone_for_solo_both_and_older_competitions(): void
    {
        $org = $this->makeOrganization();

        $events = [
            $this->makeCompetitionEvent($org, ['participation_type' => 'solo'], ['title' => 'Solo Cup']),
            $this->makeCompetitionEvent($org, ['participation_type' => 'both'], ['title' => 'Open Cup']),
            $this->makeCompetitionEvent($org, [], ['title' => 'Old Cup']),
        ];

        Sanctum::actingAs(User::factory()->create());

        foreach ($events as $event) {
            $this->postJson("/api/v1/events/{$event->slug}/register")
                ->assertStatus(201);
        }
    }

    // ── Public filter ─────────────────────────────────────────

    public function test_the_participation_type_filter(): void
    {
        $org = $this->makeOrganization();

        $solo = $this->makeCompetitionEvent($org, ['participation_type' => 'solo'], ['title' => 'Solo Cup']);
        $team = $this->makeCompetitionEvent($org, ['participation_type' => 'team', 'min_team_size' => 2, 'max_team_size' => 4], ['title' => 'Team Cup']);
        $both = $this->makeCompetitionEvent($org, ['participation_type' => 'both'], ['title' => 'Open Cup']);
        $old = $this->makeCompetitionEvent($org, [], ['title' => 'Old Cup']);
        $workshop = $this->makeEvent($org, ['title' => 'A Workshop']);

        $this->assertEqualsCanonicalizing(
            [$solo->slug],
            $this->slugsFrom($this->getJson('/api/v1/events?participation_type=solo'))
        );

        $this->assertEqualsCanonicalizing(
            [$team->slug],
            $this->slugsFrom($this->getJson('/api/v1/events?participation_type=team'))
        );

        // "both" also includes older competitions with no value stored.
        $this->assertEqualsCanonicalizing(
            [$both->slug, $old->slug],
            $this->slugsFrom($this->getJson('/api/v1/events?participation_type=both'))
        );

        // An unknown value is ignored, like the status filter.
        $this->assertEqualsCanonicalizing(
            [$solo->slug, $team->slug, $both->slug, $old->slug, $workshop->slug],
            $this->slugsFrom($this->getJson('/api/v1/events?participation_type=duo'))
        );
    }

    // ── Helpers ───────────────────────────────────────────────

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

    private function actingAsOrganization(): Organization
    {
        $org = $this->makeOrganization();
        Sanctum::actingAs($org, ['*'], 'organization');

        return $org;
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
     * @param  array<string, mixed>  $participation  Competition columns
     * @param  array<string, mixed>  $eventOverrides
     */
    private function makeCompetitionEvent(
        Organization $org,
        array $participation = [],
        array $eventOverrides = []
    ): Event {
        $event = $this->makeEvent($org, array_merge([
            'type' => Event::TYPE_COMPETITION,
        ], $eventOverrides));

        Competition::create(array_merge(['id' => $event->id], $participation));

        return $event;
    }

    /**
     * A complete payload for sending a competition for review.
     *
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function submitPayload(array $overrides = []): array
    {
        return array_merge([
            'title' => 'Hack Night',
            'type' => 'competition',
            'description' => 'A test competition.',
            'location' => 'Amman',
            'start_date' => '2027-03-10',
            'end_date' => '2027-03-11',
            'action' => 'submit',
        ], $overrides);
    }

    /**
     * @return array<int, string>
     */
    private function slugsFrom(\Illuminate\Testing\TestResponse $response): array
    {
        $response->assertOk();

        return collect($response->json('data'))->pluck('slug')->all();
    }
}