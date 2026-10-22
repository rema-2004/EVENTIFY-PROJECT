<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Team\RespondToJoinRequest;
use App\Http\Resources\TeamJoinRequestResource;
use App\Models\EventRegistration;
use App\Models\Team;
use App\Models\TeamMember;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TeamMembershipController extends Controller
{
    use ApiResponse;

    /**
     * POST /api/v1/teams/{team}/join
     *
     * Creates a pending membership AND a pending event registration
     * (so the request shows up in "My Requests" and the user can't
     * file requests with several teams of the same event at once).
     */
    public function join(Team $team): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $event = $team->event;

        if (! $event || ! $event->isPublished() || ! $event->isCompetition()) {
            return $this->error('Team not found.', 404);
        }

        if ($event->competition && ! $event->competition->allowsTeams()) {
            return $this->error('This competition is for individual participants only.', 422);
        }

        if (! $event->isRegistrationOpen()) {
            return $this->error('Registration is closed for this event.', 422);
        }

        if ($team->hasMember($user)) {
            return $this->error('You already have a pending request or membership in this team.', 422);
        }

        $hasActiveRegistration = EventRegistration::where('event_id', $event->id)
            ->where('user_id', $user->id)
            ->whereIn('status', [EventRegistration::STATUS_PENDING, EventRegistration::STATUS_CONFIRMED])
            ->exists();

        if ($hasActiveRegistration) {
            return $this->error(
                'You are already registered for this event. Cancel your registration first to join a team.',
                422
            );
        }

        DB::transaction(function () use ($team, $event, $user) {
            // Lock the team row so two simultaneous requests see consistent state.
            $locked = Team::whereKey($team->id)->lockForUpdate()->first();

            if (! $locked->canAcceptNewMember()) {
                abort(response()->json([
                    'success' => false,
                    'message' => 'This team is not accepting new members.',
                ], 422));
            }

            // updateOrCreate: allows re-requesting after a rejection / leaving.
            // requested_at set explicitly (booted() only covers INSERT).
            TeamMember::updateOrCreate(
                ['team_id' => $team->id, 'user_id' => $user->id],
                [
                    'role' => TeamMember::ROLE_MEMBER,
                    'status' => TeamMember::STATUS_PENDING,
                    'requested_at' => now(),
                    'responded_at' => null,
                ]
            );

            EventRegistration::updateOrCreate(
                ['event_id' => $event->id, 'user_id' => $user->id],
                [
                    'team_id' => $team->id,
                    'status' => EventRegistration::STATUS_PENDING,
                    'registered_at' => now(),
                ]
            );
        });

        return $this->success([
            'team' => ['id' => $team->id, 'name' => $team->name],
            'event' => ['id' => $event->id, 'title' => $event->title, 'slug' => $event->slug],
            'status' => TeamMember::STATUS_PENDING,
        ], 'Join request sent. Waiting for the team leader to respond.', 201);
    }

    /**
     * DELETE /api/v1/teams/{team}/join
     * The requester withdraws their own pending request.
     */
    public function cancelJoin(Team $team): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $membership = TeamMember::where('team_id', $team->id)
            ->where('user_id', $user->id)
            ->where('status', TeamMember::STATUS_PENDING)
            ->first();

        if (! $membership) {
            return $this->error('No pending request found.', 404);
        }

        DB::transaction(function () use ($membership, $team, $user) {
            $membership->update([
                'status' => TeamMember::STATUS_LEFT,
                'responded_at' => now(),
            ]);

            $this->cancelPendingRegistration($team, $user->id);
        });

        return $this->success(null, 'Join request cancelled.');
    }

    /**
     * GET /api/v1/teams/{team}/requests   (leader only)
     */
    public function requests(Team $team): JsonResponse
    {
        if (! $team->isLedBy(Auth::id())) {
            return $this->error('Only the team leader can view join requests.', 403);
        }

        $requests = $team->pendingRequests()
            ->with('user')
            ->oldest('requested_at')
            ->get();

        return $this->success(TeamJoinRequestResource::collection($requests), 'Join requests retrieved');
    }

    /**
     * PATCH /api/v1/teams/{team}/requests/{member}   (leader only)
     * Body: { "action": "approve" | "reject" }
     */
    public function respond(RespondToJoinRequest $request, Team $team, TeamMember $member): JsonResponse
    {
        if (! $team->isLedBy(Auth::id())) {
            return $this->error('Only the team leader can respond to join requests.', 403);
        }

        // Prevent responding to a request that belongs to another team.
        if ($member->team_id !== $team->id) {
            return $this->error('Join request not found.', 404);
        }

        $approve = $request->validated()['action'] === 'approve';

        DB::transaction(function () use ($team, $member, $approve) {
            $lockedTeam = Team::whereKey($team->id)->lockForUpdate()->first();
            $lockedMember = TeamMember::whereKey($member->id)->lockForUpdate()->first();

            if (! $lockedMember->isPending()) {
                abort(response()->json([
                    'success' => false,
                    'message' => "This request was already handled. Current status: {$lockedMember->status}",
                ], 422));
            }

            if ($approve) {
                if ($lockedTeam->isFull()) {
                    abort(response()->json([
                        'success' => false,
                        'message' => 'The team is already full.',
                    ], 422));
                }

                $lockedMember->update([
                    'status' => TeamMember::STATUS_APPROVED,
                    'responded_at' => now(),
                ]);

                // The member's event registration stays pending: it is
                // confirmed only when the organization approves the team.

                // Team just filled up → stop showing it in "Available Teams".
                if ($lockedTeam->isFull()) {
                    $lockedTeam->update(['is_recruiting' => false]);
                }
            } else {
                $lockedMember->update([
                    'status' => TeamMember::STATUS_REJECTED,
                    'responded_at' => now(),
                ]);

                $this->cancelPendingRegistration($lockedTeam, $lockedMember->user_id);
            }
        });

        $member->refresh()->load('user');

        return $this->success(
            new TeamJoinRequestResource($member),
            $approve ? 'Request approved.' : 'Request rejected.'
        );
    }

    /**
     * Cancels the user's pending registration only if it belongs to this team,
     * so we never touch an unrelated registration.
     */
    private function cancelPendingRegistration(Team $team, int $userId): void
    {
        EventRegistration::where('event_id', $team->event_id)
            ->where('user_id', $userId)
            ->where('team_id', $team->id)
            ->where('status', EventRegistration::STATUS_PENDING)
            ->update(['status' => EventRegistration::STATUS_CANCELLED]);
    }
}