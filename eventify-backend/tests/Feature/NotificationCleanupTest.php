<?php

namespace Tests\Feature;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\TestCase;

class NotificationCleanupTest extends TestCase
{
    use RefreshDatabase;

    public function test_force_deleting_a_user_removes_only_that_users_notifications(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        $mine = $this->notify($user);
        $theirs = $this->notify($other);

        $user->forceDelete();

        $this->assertDatabaseMissing('notifications', ['id' => $mine->id]);
        $this->assertDatabaseHas('notifications', ['id' => $theirs->id]);
    }

    public function test_soft_deleting_a_user_keeps_their_notifications(): void
    {
        $user = User::factory()->create();
        $notification = $this->notify($user);

        $user->delete();

        $this->assertDatabaseHas('notifications', ['id' => $notification->id]);
    }

    public function test_force_deleting_an_organization_removes_only_its_notifications(): void
    {
        $org = $this->makeOrganization('org-one');
        $other = $this->makeOrganization('org-two');

        $mine = $this->notify($org);
        $theirs = $this->notify($other);

        $org->forceDelete();

        $this->assertDatabaseMissing('notifications', ['id' => $mine->id]);
        $this->assertDatabaseHas('notifications', ['id' => $theirs->id]);
    }

    public function test_soft_deleting_an_organization_keeps_its_notifications(): void
    {
        $org = $this->makeOrganization('org-one');
        $notification = $this->notify($org);

        $org->delete();

        $this->assertDatabaseHas('notifications', ['id' => $notification->id]);
    }

    public function test_cleanup_does_not_touch_notifications_of_a_different_account_type_with_the_same_id(): void
    {
        $user = User::factory()->create();
        $org = $this->makeOrganization('org-one');

        $orgNotification = $this->notify($org);

        // Simulate an id collision: an organization notification whose
        // notifiable_id equals the user's id.
        DB::table('notifications')
            ->where('id', $orgNotification->id)
            ->update(['notifiable_id' => $user->id]);

        $user->forceDelete();

        $this->assertDatabaseHas('notifications', ['id' => $orgNotification->id]);
    }

    private function notify(Model $notifiable): DatabaseNotification
    {
        return $notifiable->notifications()->create([
            'id' => (string) Str::uuid(),
            'type' => 'App\\Notifications\\TestNotification',
            'data' => ['message' => 'Hello'],
        ]);
    }

    private function makeOrganization(string $slug): Organization
    {
        return Organization::create([
            'name' => 'Org ' . $slug,
            'slug' => $slug,
            'email' => $slug . '@example.com',
            'password' => 'password123',
        ]);
    }
}