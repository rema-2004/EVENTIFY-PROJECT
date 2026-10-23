<?php

namespace Tests\Feature;

use App\Mail\EmailChangeConfirmMail;
use App\Mail\EmailChangeNoticeMail;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class EmailChangeTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_new_email_stays_pending_and_both_addresses_are_mailed(): void
    {
        Mail::fake();
        $user = $this->student();
        Sanctum::actingAs($user);

        $this->patchJson('/api/v1/profile', [
            'email' => 'new@example.com',
            'current_password' => 'Password123',
        ])
            ->assertOk()
            ->assertJsonPath('data.email', 'old@example.com')
            ->assertJsonPath('data.pending_email', 'new@example.com');

        $fresh = $user->fresh();
        $this->assertSame('old@example.com', $fresh->email);
        $this->assertSame('new@example.com', $fresh->pending_email);
        $this->assertNotNull($fresh->email_change_expires_at);

        Mail::assertSent(EmailChangeConfirmMail::class, fn ($mail) => $mail->hasTo('new@example.com'));
        Mail::assertSent(EmailChangeNoticeMail::class, fn ($mail) => $mail->hasTo('old@example.com'));
    }

    public function test_the_stored_token_is_hashed_not_the_one_in_the_link(): void
    {
        Mail::fake();
        $user = $this->student();
        Sanctum::actingAs($user);

        $this->patchJson('/api/v1/profile', [
            'email' => 'new@example.com',
            'current_password' => 'Password123',
        ])->assertOk();

        $token = $this->tokenFromMail();

        $this->assertNotSame($token, $user->fresh()->getRawOriginal('email_change_token'));
        $this->assertSame(hash('sha256', $token), $user->fresh()->getRawOriginal('email_change_token'));
    }

    public function test_confirming_the_link_changes_the_email(): void
    {
        Mail::fake();
        $user = $this->student();
        Sanctum::actingAs($user);

        $this->patchJson('/api/v1/profile', [
            'email' => 'new@example.com',
            'current_password' => 'Password123',
        ])->assertOk();

        $token = $this->tokenFromMail();

        // The link is opened without being signed in.
        $this->app['auth']->forgetGuards();

        $this->postJson('/api/v1/email/confirm', ['token' => $token])
            ->assertOk()
            ->assertJsonPath('data.email', 'new@example.com')
            ->assertJsonPath('data.pending_email', null)
            ->assertJsonPath('data.email_verified', true);

        $fresh = $user->fresh();
        $this->assertSame('new@example.com', $fresh->email);
        $this->assertNull($fresh->pending_email);
        $this->assertNull($fresh->getRawOriginal('email_change_token'));

        $log = AuditLog::where('action', 'Changed Email')->first();
        $this->assertNotNull($log);
        $this->assertTrue((bool) $log->is_sensitive);
    }

    public function test_a_link_can_be_used_only_once(): void
    {
        Mail::fake();
        Sanctum::actingAs($this->student());

        $this->patchJson('/api/v1/profile', [
            'email' => 'new@example.com',
            'current_password' => 'Password123',
        ])->assertOk();

        $token = $this->tokenFromMail();

        $this->postJson('/api/v1/email/confirm', ['token' => $token])->assertOk();
        $this->postJson('/api/v1/email/confirm', ['token' => $token])->assertStatus(422);
    }

    public function test_a_wrong_or_missing_token_is_refused(): void
    {
        $this->postJson('/api/v1/email/confirm', ['token' => 'not-a-real-token'])
            ->assertStatus(422)
            ->assertJsonPath('success', false);

        $this->postJson('/api/v1/email/confirm', [])->assertStatus(422);
    }

    public function test_an_expired_link_is_refused_and_the_email_stays(): void
    {
        Mail::fake();
        $user = $this->student();
        Sanctum::actingAs($user);

        $this->patchJson('/api/v1/profile', [
            'email' => 'new@example.com',
            'current_password' => 'Password123',
        ])->assertOk();

        $token = $this->tokenFromMail();
        $this->travel(61)->minutes();

        $this->postJson('/api/v1/email/confirm', ['token' => $token])->assertStatus(422);

        $this->assertSame('old@example.com', $user->fresh()->email);
    }

    public function test_asking_again_replaces_the_previous_link(): void
    {
        Mail::fake();
        Sanctum::actingAs($this->student());

        $this->patchJson('/api/v1/profile', [
            'email' => 'first@example.com',
            'current_password' => 'Password123',
        ])->assertOk();
        $firstToken = $this->tokenFromMail();

        $this->patchJson('/api/v1/profile', [
            'email' => 'second@example.com',
            'current_password' => 'Password123',
        ])->assertOk();

        $this->postJson('/api/v1/email/confirm', ['token' => $firstToken])->assertStatus(422);
    }

    public function test_the_email_is_refused_if_someone_took_it_while_pending(): void
    {
        Mail::fake();
        $user = $this->student();
        Sanctum::actingAs($user);

        $this->patchJson('/api/v1/profile', [
            'email' => 'new@example.com',
            'current_password' => 'Password123',
        ])->assertOk();
        $token = $this->tokenFromMail();

        User::factory()->create(['email' => 'new@example.com']);

        $this->postJson('/api/v1/email/confirm', ['token' => $token])->assertStatus(422);

        $fresh = $user->fresh();
        $this->assertSame('old@example.com', $fresh->email);
        $this->assertNull($fresh->pending_email);
    }

    public function test_changing_other_fields_sends_no_email(): void
    {
        Mail::fake();
        $user = $this->student();
        Sanctum::actingAs($user);

        $this->patchJson('/api/v1/profile', ['name' => 'New Name'])
            ->assertOk()
            ->assertJsonPath('data.pending_email', null);

        Mail::assertNothingSent();
        $this->assertSame('New Name', $user->fresh()->name);
    }

    public function test_a_mail_failure_does_not_break_the_request(): void
    {
        // Point the mailer at a transport that always fails.
        config(['mail.default' => 'failing', 'mail.mailers.failing' => ['transport' => 'smtp', 'host' => '127.0.0.1', 'port' => 1, 'timeout' => 1]]);
        $user = $this->student();
        Sanctum::actingAs($user);

        $this->patchJson('/api/v1/profile', [
            'email' => 'new@example.com',
            'current_password' => 'Password123',
        ])->assertOk();

        $this->assertSame('new@example.com', $user->fresh()->pending_email);
    }

    private function student(): User
    {
        return User::factory()->create([
            'email' => 'old@example.com',
            'password' => 'Password123',
        ]);
    }

    /**
     * The raw token from the confirmation link of the last mail sent.
     */
    private function tokenFromMail(): string
    {
        $sent = Mail::sent(EmailChangeConfirmMail::class);
        $this->assertNotEmpty($sent);

        $link = $sent->last()->confirmLink;
        parse_str((string) parse_url($link, PHP_URL_QUERY), $query);

        return $query['token'];
    }
}