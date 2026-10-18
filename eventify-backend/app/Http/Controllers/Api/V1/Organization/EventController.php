<?php

namespace App\Http\Controllers\Api\V1\Organization;

use App\Http\Controllers\Controller;
use App\Http\Requests\Organization\StoreEventRequest;
use App\Http\Requests\Organization\UpdateEventRequest;
use App\Http\Resources\EventResource;
use App\Models\AuditLog;
use App\Models\Competition;
use App\Models\Event;
use App\Models\Organization;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $organization = Auth::guard('organization')->user();

        $query = Event::where('organization_id', $organization->id)
            ->with('competition');

        $filter = $request->query('status', 'all');

        match ($filter) {
            'pending' => $query->pendingReview(),
            'live' => $query->live(),
            'upcoming' => $query->upcoming(),
            'ended' => $query->ended(),
            default => null,
        };

        $events = $query->latest()->paginate(15);

        $events->through(fn (Event $event) => new EventResource($event));

        return $this->successWithPagination($events, 'Your events retrieved');
    }

    public function show(Event $event): JsonResponse
    {
        $organization = Auth::guard('organization')->user();

        if ($event->organization_id !== $organization->id) {
            return $this->error('Forbidden. This event does not belong to your organization.', 403);
        }

        $event->load(['organization', 'competition']);

        return $this->success(new EventResource($event));
    }

    public function store(StoreEventRequest $request): JsonResponse
    {
        /** @var Organization $organization */
        $organization = Auth::guard('organization')->user();

        if (! $organization->isApproved()) {
            return $this->error(
                'Your organization must be approved by an admin before you can create events.',
                403
            );
        }

        $validated = $request->validated();

        $event = DB::transaction(function () use ($validated, $organization, $request) {
            $event = Event::create([
                'organization_id' => $organization->id,
                'created_by' => null,
                'title' => $validated['title'],
                'slug' => $this->generateUniqueSlug($validated['title']),
                'description' => $validated['description'],
                'type' => $validated['type'],
                'location' => $validated['location'] ?? null,
                'requirements' => $validated['requirements'] ?? null,
                'start_date' => $validated['start_date'] ?? null,
                'end_date' => $validated['end_date'] ?? null,
                'registration_deadline' => $validated['registration_deadline'] ?? null,
                'status' => $validated['action'] === 'submit'
                    ? Event::STATUS_PENDING_REVIEW
                    : Event::STATUS_DRAFT,
            ]);

            if ($request->hasFile('cover_image')) {
                $event->update([
                    'cover_image' => $request->file('cover_image')->store('event-covers', 'public'),
                ]);
            }

            if ($event->type === Event::TYPE_COMPETITION) {
                $participationType = $validated['participation_type'] ?? null;
                $isSolo = $participationType === Competition::PARTICIPATION_SOLO;

                $event->competition()->create([
                    'team_size' => $validated['team_size'] ?? null,
                    'prize' => $validated['prize'] ?? null,
                    'participation_type' => $participationType,
                    // A solo-only competition never carries a team size.
                    'min_team_size' => $isSolo ? null : ($validated['min_team_size'] ?? null),
                    'max_team_size' => $isSolo ? null : ($validated['max_team_size'] ?? null),
                ]);
            }

            return $event;
        });

        AuditLog::record(
            type: AuditLog::TYPE_CREATE,
            action: 'Created Event',
            location: AuditLog::LOCATION_EVENTS,
            actor: $organization,
            target: $event,
            details: $event->isPendingReview()
                ? 'A new event was created and submitted for review.'
                : 'A new event was saved as a draft.',
        );

        $event->load(['organization', 'competition']);

        return $this->success(
            new EventResource($event),
            $event->isPendingReview() ? 'Event submitted for review' : 'Draft saved',
            201
        );
    }

    public function update(UpdateEventRequest $request, Event $event): JsonResponse
    {
        $organization = Auth::guard('organization')->user();

        if ($event->organization_id !== $organization->id) {
            return $this->error('Forbidden. This event does not belong to your organization.', 403);
        }

        // Drafts can be edited freely. A rejected event can be edited too,
        // so the organization can fix it and resubmit for a new review.
        if (! in_array($event->status, [Event::STATUS_DRAFT, Event::STATUS_REJECTED], true)) {
            return $this->error('Only draft or rejected events can be edited.', 422);
        }

        $wasRejected = $event->status === Event::STATUS_REJECTED;

        $validated = $request->validated();

        DB::transaction(function () use ($validated, $event, $request) {
            if (isset($validated['title']) && $validated['title'] !== $event->title) {
                $validated['slug'] = $this->generateUniqueSlug($validated['title']);
            }

            if (isset($validated['action'])) {
                $validated['status'] = $validated['action'] === 'submit'
                    ? Event::STATUS_PENDING_REVIEW
                    : Event::STATUS_DRAFT;

                // A resubmitted event starts a fresh review — drop the old
                // rejection reason so it can never reach the public API
                // after the event is approved.
                if ($validated['action'] === 'submit') {
                    $validated['admin_notes'] = null;
                }
            }
            unset(
                $validated['action'],
                $validated['team_size'],
                $validated['prize'],
                $validated['participation_type'],
                $validated['min_team_size'],
                $validated['max_team_size'],
            );

            if ($request->hasFile('cover_image')) {
                if ($event->cover_image && Storage::disk('public')->exists($event->cover_image)) {
                    Storage::disk('public')->delete($event->cover_image);
                }
                $validated['cover_image'] = $request->file('cover_image')->store('event-covers', 'public');
            }

            $event->update($validated);

            $type = $request->input('type', $event->type);

            if ($type === Event::TYPE_COMPETITION) {
                $stored = $event->competition;

                // Competition fields are only overwritten when actually sent
                // in this request — otherwise a partial update (e.g. just
                // the title) would silently wipe the existing values.
                $participationType = $request->has('participation_type')
                    ? $request->input('participation_type')
                    : $stored?->participation_type;

                $isSolo = $participationType === Competition::PARTICIPATION_SOLO;

                $event->competition()->updateOrCreate(
                    [],
                    [
                        'team_size' => $request->has('team_size')
                            ? $request->input('team_size')
                            : $stored?->team_size,
                        'prize' => $request->has('prize')
                            ? $request->input('prize')
                            : $stored?->prize,
                        'participation_type' => $participationType,
                        // A solo-only competition never carries a team size.
                        'min_team_size' => $isSolo ? null : ($request->has('min_team_size')
                            ? $request->input('min_team_size')
                            : $stored?->min_team_size),
                        'max_team_size' => $isSolo ? null : ($request->has('max_team_size')
                            ? $request->input('max_team_size')
                            : $stored?->max_team_size),
                    ]
                );
            } else {
                $event->competition()->delete();
            }
        });

        AuditLog::record(
            type: AuditLog::TYPE_UPDATE,
            action: 'Updated Event',
            location: AuditLog::LOCATION_EVENTS,
            actor: $organization,
            target: $event,
            details: match (true) {
                $event->isPendingReview() && $wasRejected => 'The rejected event was edited and resubmitted for review.',
                $event->isPendingReview() => 'The event was edited and submitted for review.',
                default => 'Event details were edited by the organization.',
            },
        );

        $event->load(['organization', 'competition']);

        return $this->success(new EventResource($event), 'Event updated');
    }

    public function destroy(Event $event): JsonResponse
    {
        $organization = Auth::guard('organization')->user();

        if ($event->organization_id !== $organization->id) {
            return $this->error('Forbidden. This event does not belong to your organization.', 403);
        }

        if ($event->status !== Event::STATUS_DRAFT) {
            return $this->error('Only draft events can be deleted.', 422);
        }

        if ($event->cover_image && Storage::disk('public')->exists($event->cover_image)) {
            Storage::disk('public')->delete($event->cover_image);
        }

        $event->delete();

        // Logged after the delete: the title is still on the model and is
        // copied into the row, so it stays readable.
        AuditLog::record(
            type: AuditLog::TYPE_DELETE,
            action: 'Deleted Event',
            location: AuditLog::LOCATION_EVENTS,
            actor: $organization,
            target: $event,
            details: 'A draft event was deleted by the organization.',
        );

        return $this->success(null, 'Draft deleted successfully');
    }

    private function generateUniqueSlug(string $title): string
    {
        $baseSlug = Str::slug($title);
        $slug = $baseSlug;
        $counter = 1;

        while (Event::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}