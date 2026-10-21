<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Team\StoreTeamRequest;
use App\Http\Resources\TeamResource;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\Skill;
use App\Models\Team;
use App\Models\TeamMember;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;


class TeamController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/v1/events/{event}/teams
     * GET /api/v1/events/{event}/teams?search=neuro&skill=python
     *
     * "Available Teams" browse page — only teams that are open AND
     * marked as recruiting ("Looking for Members" toggle).
     */
    public function index(Request $request, Event $event): JsonResponse
    {
        if ($error = $this->ensureCompetitionIsAvailable($event)) {
            return $error;
        }

        $query = Team::where('event_id', $event->id)
            ->recruiting()
            ->withCount('approvedMembers')
            ->with(['leader', 'skills']);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($skill = $request->query('skill')) {
            $query->whereHas('skills', fn ($q) => $q->where('slug', Str::slug($skill)));
        }

        $teams = $query->latest()->paginate(15);

        $teams->through(fn (Team $team) => new TeamResource($team));

        return $this->successWithPagination($teams, 'Teams retrieved');
    }

    /**
     * POST /api/v1/events/{event}/teams
     *
     * Creates a team and registers the creator as its leader — all in one
     * transaction: team + leader membership + event registration.
     */
    public function store(StoreTeamRequest $request, Event $event): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($error = $this->ensureCompetitionIsAvailable($event)) {
            return $error;
        }

        if (! $event->isRegistrationOpen()) {
            return $this->error('Registration is closed for this event.', 422);
        }

        $validated = $request->validated();

        // Creating a team registers the leader for the event, so they must
        // not already hold an active registration (solo or in another team).
        $hasActiveRegistration = EventRegistration::where('event_id', $event->id)
            ->where('user_id', $user->id)
            ->whereIn('status', [EventRegistration::STATUS_PENDING, EventRegistration::STATUS_CONFIRMED])
            ->exists();

        if ($hasActiveRegistration) {
            return $this->error(
                'You are already registered for this event. Cancel your registration first to create a team.',
                422
            );
        }

        // The team capacity must respect the limits the organization set.
        $competition = $event->competition;

        if ($competition && ! $competition->allowsTeamSize((int) $validated['max_members'])) {
            return $this->validationError(
                ['max_members' => [$this->teamSizeMessage($competition)]]
            );
        }

        // Explicit check instead of letting the unique(event_id, name)
        // constraint throw a raw QueryException (500) at the user.
        $nameTaken = Team::where('event_id', $event->id)
            ->where('name', $validated['name'])
            ->exists();

        if ($nameTaken) {
            return $this->validationError(
                ['name' => ['A team with this name already exists in this competition.']]
            );
        }

        $team = DB::transaction(function () use ($validated, $event, $user) {
            $team = Team::create([
                'event_id' => $event->id,
                'created_by' => $user->id,
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'max_members' => $validated['max_members'],
                'is_recruiting' => $validated['is_recruiting'] ?? true,
                'status' => Team::STATUS_OPEN,
            ]);

            // The leader is approved from the start — they don't need to
            // approve joining their own team. (requested_at stays null.)
            TeamMember::create([
                'team_id' => $team->id,
                'user_id' => $user->id,
                'role' => TeamMember::ROLE_LEADER,
                'status' => TeamMember::STATUS_APPROVED,
                'responded_at' => now(),
            ]);

            // updateOrCreate: reuses the row if the user previously
            // cancelled; registered_at set explicitly (booted() only
            // covers INSERT, not this UPDATE path).
            EventRegistration::updateOrCreate(
                ['event_id' => $event->id, 'user_id' => $user->id],
                [
                    'team_id' => $team->id,
                    'status' => EventRegistration::STATUS_CONFIRMED,
                    'registered_at' => now(),
                ]
            );

            if (! empty($validated['skills'])) {
                $team->skills()->sync($this->resolveSkillIds($validated['skills']));
            }

            return $team;
        });

        $team->loadCount('approvedMembers');
        $team->load(['leader', 'skills', 'approvedMembers.user']);

        return $this->success(new TeamResource($team), 'Team created successfully', 201);
    }

    /**
     * GET /api/v1/teams/{team}
     */
    public function show(Team $team): JsonResponse
    {
        // Teams of unpublished events stay invisible.
        if (! $team->event || ! $team->event->isPublished()) {
            return $this->error('Team not found.', 404);
        }

        $team->loadCount('approvedMembers');
        $team->load(['leader', 'skills', 'approvedMembers.user']);

        return $this->success(new TeamResource($team));
    }

    /**
     * Teams only exist for published competition events.
     * Returns an error response if the event doesn't qualify, else null.
     */
    private function ensureCompetitionIsAvailable(Event $event): ?JsonResponse
    {
        if (! $event->isPublished()) {
            return $this->error('Event not found.', 404);
        }

        if (! $event->isCompetition()) {
            return $this->error('Teams are only available for competitions.', 422);
        }

        if ($event->competition && ! $event->competition->allowsTeams()) {
            return $this->error('This competition is for individual participants only.', 422);
        }

        return null;
    }

    private function teamSizeMessage(\App\Models\Competition $competition): string
    {
        $min = $competition->min_team_size;
        $max = $competition->max_team_size;

        return match (true) {
            $min !== null && $max !== null => "Team size must be between {$min} and {$max} members.",
            $min !== null => "Team size must be at least {$min} members.",
            default => "Team size must be at most {$max} members.",
        };
    }

    /**
     * Turns free-form skill names into skill IDs, creating any new ones
     * in the catalog on demand. Normalized by slug so "Python", "python"
     * and " PYTHON " all map to the same skill.
     *
     * @param  array<int, string>  $names
     * @return array<int, int>
     */
    private function resolveSkillIds(array $names): array
    {
        return collect($names)
            ->map(fn (string $name) => trim($name))
            ->filter()
            ->unique(fn (string $name) => Str::slug($name))
            ->map(fn (string $name) => Skill::firstOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name]
            )->id)
            ->values()
            ->all();
    }
}