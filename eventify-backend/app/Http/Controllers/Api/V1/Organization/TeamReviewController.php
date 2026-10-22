<?php

namespace App\Http\Controllers\Api\V1\Organization;

use App\Http\Controllers\Controller;
use App\Http\Requests\Team\RejectTeamRequest;
use App\Http\Resources\TeamResource;
use App\Models\AuditLog;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\Team;
use App\Notifications\PlatformNotification;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

/**
 * The organization reviews TEAMS as a whole (competitions). Individual
 * applicants are handled by ApplicantController.
 */
class TeamReviewController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/v1/org/events/{event}/teams
     * GET /api/v1/org/events/{event}/teams?status=approved
     *
     * Teams that were submitted for this competition. The default filter
     * is "submitted" (waiting for a decision). Drafts are never listed:
     * the leader has not sent them to the organization yet.
     */
    public function index(Request $request, Event $event): JsonResponse
    {
        if ($forbidden = $this->ensureOwnsEvent($event)) {
            return $forbidden;
        }

        $status = $request->query('status');

        if (! in_array($status, [
            Team::SUBMISSION_SUBMITTED,
            Team::SUBMISSION_APPROVED,
            Team::SUBMISSION_REJECTED,
        ], true)) {
            $status = Team::SUBMISSION_SUBMITTED;
        }

        $teams = Team::where('event_id', $event->id)
            ->where('submission_status', $status)
            ->withCount('approvedMembers')
            ->with(['leader', 'skills', 'approvedMembers.user'])
            ->latest('submitted_at')
            ->paginate(15);

        $teams->through(fn (Team $team) => new TeamResource($team));

        return $this->successWithPagination($teams, 'Teams retrieved');
    }

    /**
     * PATCH /api/v1/org/events/{event}/teams/{team}/approve
     *
     * Approves the whole team: every approved member's registration
     * becomes confirmed, and each member gets their own notification.
     */
    public function approve(Event $event, Team $team): JsonResponse
    {
        if ($error = $this->ensureCanReview($event, $team)) {
            return $error;
        }

        $memberUsers = $this->review($team, function (Team $locked) {
            $locked->update([
                'submission_status' => Team::SUBMISSION_APPROVED,
                'reviewed_at' => now(),
                'rejection_reason' => null,
            ]);

            $memberIds = $locked->approvedMembers()->pluck('user_id');

            EventRegistration::where('team_id', $locked->id)
                ->whereIn('user_id', $memberIds)
                ->where('status', EventRegistration::STATUS_PENDING)
                ->update([
                    'status' => EventRegistration::STATUS_CONFIRMED,
                    'rejection_reason' => null,
                    'reviewed_at' => now(),
                ]);
        });

        if ($memberUsers === null) {
            return $this->error('Only submitted teams can be approved.', 422);
        }

        foreach ($memberUsers as $user) {
            PlatformNotification::send(
                $user,
                'team_approved',
                "Your team \"{$team->name}\" was approved for \"{$event->title}\". Your registration is confirmed.",
                ['event_id' => $event->id, 'event_slug' => $event->slug, 'team_id' => $team->id],
            );
        }

        AuditLog::record(
            type: AuditLog::TYPE_APPROVE,
            action: 'Approved Team',
            location: AuditLog::LOCATION_EVENTS,
            actor: Auth::guard('organization')->user(),
            target: $event,
            details: 'Organization approved a team.',
        );

        return $this->success($this->resource($team), 'Team approved successfully');
    }

    /**
     * PATCH /api/v1/org/events/{event}/teams/{team}/reject
     * Body: { "reason": "..." }
     *
     * The team goes back to its leader, who can fix it and submit again.
     * Registrations stay pending in the meantime.
     */
    public function reject(RejectTeamRequest $request, Event $event, Team $team): JsonResponse
    {
        if ($error = $this->ensureCanReview($event, $team)) {
            return $error;
        }

        $reason = $request->validated('reason');

        $memberUsers = $this->review($team, function (Team $locked) use ($reason) {
            $locked->update([
                'submission_status' => Team::SUBMISSION_REJECTED,
                'reviewed_at' => now(),
                'rejection_reason' => $reason,
                // Submitting closed recruiting. A rejected team goes back to
                // its leader to be fixed, which may mean adding a member.
                'is_recruiting' => ! $locked->isFull(),
            ]);
        });

        if ($memberUsers === null) {
            return $this->error('Only submitted teams can be rejected.', 422);
        }

        foreach ($memberUsers as $user) {
            PlatformNotification::send(
                $user,
                'team_rejected',
                "Your team \"{$team->name}\" was not approved for \"{$event->title}\". Reason: {$reason}",
                ['event_id' => $event->id, 'event_slug' => $event->slug, 'team_id' => $team->id, 'reason' => $reason],
            );
        }

        AuditLog::record(
            type: AuditLog::TYPE_REJECT,
            action: 'Rejected Team',
            location: AuditLog::LOCATION_EVENTS,
            actor: Auth::guard('organization')->user(),
            target: $event,
            details: $reason,
        );

        return $this->success($this->resource($team), 'Team rejected');
    }

    /**
     * Applies the change under a row lock, only if the team is STILL
     * submitted (stops a double click from deciding twice). Returns the
     * users of the approved members, or null when it was not submitted.
     *
     * @return \Illuminate\Support\Collection<int, \App\Models\User>|null
     */
    private function review(Team $team, callable $changes)
    {
        return DB::transaction(function () use ($team, $changes) {
            $locked = Team::whereKey($team->id)->lockForUpdate()->first();

            if (! $locked || ! $locked->isSubmitted()) {
                return null;
            }

            $changes($locked);

            return $locked->approvedMembers()->with('user')->get()->pluck('user')->filter();
        });
    }

    private function resource(Team $team): TeamResource
    {
        $team->refresh()->loadCount('approvedMembers');
        $team->load(['leader', 'skills', 'approvedMembers.user']);

        return new TeamResource($team);
    }

    private function ensureCanReview(Event $event, Team $team): ?JsonResponse
    {
        if ($forbidden = $this->ensureOwnsEvent($event)) {
            return $forbidden;
        }

        if ($team->event_id !== $event->id) {
            return $this->error('Team not found for this event.', 404);
        }

        return null;
    }

    private function ensureOwnsEvent(Event $event): ?JsonResponse
    {
        $organization = Auth::guard('organization')->user();

        if ($event->organization_id !== $organization->id) {
            return $this->error('Forbidden. This event does not belong to your organization.', 403);
        }

        return null;
    }
}