<?php

namespace Tests\Feature;

use App\Models\Organization;
use App\Models\User;
use App\Notifications\PlatformNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class NotificationsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_student_lists_only_their_own_notifications_with_the_unread_count(): void
    {
        $me = User::factory()->create();
        $other = User::factory()->create();

        PlatformNotification::send($me, 'registration_approved', 'First');
        PlatformNotification::send($me, 'team_approved', 'Second');
        PlatformNotification::send($other, 'team_approved', 'Not mine');

        Sanctum::actingAs($me);

        $response = $this->getJson('/api/v1/notifications')->assertOk();

        $this->assertCount(2, $response->json('data'));
        $this->assertSame(2, $response->json('meta.unread_count'));
        $this->assertSame(['kind', 'message', 'data', 'is_read'], array_slice(array_keys($response->json('data.0')), 1, 4));
    }

    public function test_the_unread_filter_and_marking_as_read(): void
    {
        $me = User::factory()->create();
        PlatformNotification::send($me, 'registration_approved', 'First');
        PlatformNotification::send($me, 'team_approved', 'Second');

        Sanctum::actingAs($me);

        $id = $me->notifications()->first()->id;

        $this->patchJson("/api/v1/notifications/{$id}/read")
            ->assertOk()
            ->assertJsonPath('data.is_read', true);

        $unread = $this->getJson('/api/v1/notifications?unread=1')->assertOk();
        $this->assertCount(1, $unread->json('data'));
        $this->assertSame(1, $unread->json('meta.unread_count'));
    }

    public function test_notifications_can_be_filtered_by_kind(): void
    {
        $me = User::factory()->create();
        PlatformNotification::send($me, 'registration_approved', 'Application accepted');
        PlatformNotification::send($me, 'registration_rejected', 'Application rejected');
        PlatformNotification::send($me, 'team_approved', 'Team accepted');

        Sanctum::actingAs($me);

        $one = $this->getJson('/api/v1/notifications?kind=team_approved')->assertOk();
        $this->assertCount(1, $one->json('data'));
        $this->assertSame('team_approved', $one->json('data.0.kind'));

        $several = $this->getJson('/api/v1/notifications?kind=registration_approved,registration_rejected')->assertOk();
        $this->assertCount(2, $several->json('data'));

        // The unread count stays the account's total, not the tab's.
        $this->assertSame(3, $several->json('meta.unread_count'));

        $this->getJson('/api/v1/notifications?kind=nothing_like_this')
            ->assertOk()
            ->assertJsonCount(0, 'data');

        $this->assertCount(3, $this->getJson('/api/v1/notifications?kind=')->json('data'));
    }

    public function test_kind_and_unread_filters_work_together(): void
    {
        $me = User::factory()->create();
        PlatformNotification::send($me, 'team_approved', 'First');
        PlatformNotification::send($me, 'team_approved', 'Second');
        PlatformNotification::send($me, 'registration_approved', 'Other kind');

        Sanctum::actingAs($me);

        $me->notifications()->where('data->kind', 'team_approved')->first()->markAsRead();

        $response = $this->getJson('/api/v1/notifications?kind=team_approved&unread=1')->assertOk();

        $this->assertCount(1, $response->json('data'));
    }

    public function test_marking_all_as_read(): void
    {
        $me = User::factory()->create();
        PlatformNotification::send($me, 'registration_approved', 'First');
        PlatformNotification::send($me, 'team_approved', 'Second');

        Sanctum::actingAs($me);

        $this->patchJson('/api/v1/notifications/read-all')->assertOk();

        $this->assertSame(0, $this->getJson('/api/v1/notifications')->json('meta.unread_count'));
    }

    public function test_someone_elses_notification_is_not_found(): void
    {
        $other = User::factory()->create();
        PlatformNotification::send($other, 'team_approved', 'Not mine');
        $id = $other->notifications()->first()->id;

        Sanctum::actingAs(User::factory()->create());

        $this->patchJson("/api/v1/notifications/{$id}/read")->assertStatus(404);
        $this->assertNull($other->notifications()->first()->read_at);
    }

    public function test_an_organization_has_its_own_notifications(): void
    {
        $org = Organization::create([
            'name' => 'Org ' . Str::random(5),
            'slug' => 'org-' . Str::lower(Str::random(6)),
            'email' => Str::lower(Str::random(8)) . '@example.com',
            'password' => 'Password123',
            'status' => Organization::STATUS_APPROVED,
        ]);
        $student = User::factory()->create();

        PlatformNotification::send($org, 'team_submitted', 'A team was submitted');
        PlatformNotification::send($student, 'team_approved', 'For the student');

        Sanctum::actingAs($org, ['*'], 'organization');

        $response = $this->getJson('/api/v1/org/notifications')->assertOk();

        $this->assertCount(1, $response->json('data'));
        $this->assertSame('team_submitted', $response->json('data.0.kind'));

        $this->patchJson('/api/v1/org/notifications/read-all')->assertOk();
        $this->assertSame(0, $this->getJson('/api/v1/org/notifications')->json('meta.unread_count'));
    }

    public function test_guests_and_the_wrong_account_type_are_refused(): void
    {
        $this->getJson('/api/v1/notifications')->assertStatus(401);
        $this->getJson('/api/v1/org/notifications')->assertStatus(401);

        Sanctum::actingAs(User::factory()->create());

        $this->getJson('/api/v1/org/notifications')->assertStatus(401);
    }
}