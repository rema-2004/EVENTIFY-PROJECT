<?php

namespace App\Http\Controllers\Api\V1\Organization;

use App\Http\Controllers\Controller;
use App\Http\Requests\Organization\StoreEventRequest;
use App\Http\Requests\Organization\UpdateEventRequest;
use App\Http\Resources\EventResource;
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
                // 'action' is required in StoreEventRequest, so it's
                // always present here after validation passes.
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
                $event->competition()->create([
                    'team_size' => $validated['team_size'] ?? null,
                    'prize' => $validated['prize'] ?? null,
                ]);
            }

            return $event;
        });

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

        if ($event->status !== Event::STATUS_DRAFT) {
            return $this->error('Only draft events can be edited.', 422);
        }

        $validated = $request->validated();

        DB::transaction(function () use ($validated, $event, $request) {
            // Regenerate the slug ONLY if the title actually changed —
            // otherwise the URL would silently go stale after an edit.
            if (isset($validated['title']) && $validated['title'] !== $event->title) {
                $validated['slug'] = $this->generateUniqueSlug($validated['title']);
            }

            if (isset($validated['action'])) {
                $validated['status'] = $validated['action'] === 'submit'
                    ? Event::STATUS_PENDING_REVIEW
                    : Event::STATUS_DRAFT;
            }
            unset($validated['action'], $validated['team_size'], $validated['prize']);

            if ($request->hasFile('cover_image')) {
                if ($event->cover_image && Storage::disk('public')->exists($event->cover_image)) {
                    Storage::disk('public')->delete($event->cover_image);
                }
                $validated['cover_image'] = $request->file('cover_image')->store('event-covers', 'public');
            }

            $event->update($validated);

            $type = $request->input('type', $event->type);

            if ($type === Event::TYPE_COMPETITION) {
                // Empty search array — the HasOne relation already scopes
                // to this event's id automatically (Eloquent fills the
                // foreign key on create too), so no need to repeat it.
                $event->competition()->updateOrCreate(
                    [],
                    [
                        'team_size' => $request->input('team_size'),
                        'prize' => $request->input('prize'),
                    ]
                );
            } else {
                $event->competition()->delete();
            }
        });

        $event->load(['organization', 'competition']);

        return $this->success(new EventResource($event), 'Event updated');
    }

    /**
     * DELETE /api/v1/org/events/{event}
     * Only draft events can be deleted — an event that was ever submitted
     * for review (pending/published/rejected) is kept for record-keeping.
     *
     * Note: this is a SOFT delete (Event uses SoftDeletes), so the
     * related "competitions" row is NOT removed by the DB cascade —
     * it stays linked to the now-soft-deleted event, simply unreachable
     * through normal queries. That's acceptable for drafts.
     */
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