<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProfileAndPasswordTest extends TestCase
{
    use RefreshDatabase;

    // ── Student: profile ──────────────────────────────────────

    public function test_student_can_update_name_and_phone_and_the_phone_is_normalized(): void
    {
        $user = $this->makeStudent();
        Sanctum::actingAs($user);

        $this->patchJson('/api/v1/profile', [
            'name' => 'Sara Khatib',
            'phone' => '+962 7 9012 3456',
        ])
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Sara Khatib')
            ->assertJsonPath('data.phone', '+962790123456');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Sara Khatib',
            'phone' => '+962790123456',
        ]);
    }

    public function test_student_partial_update_keeps_the_other_fields(): void
    {
        $user = $this->makeStudent(['name' => 'Old Name', 'phone' => '+962790000001']);
        Sanctum::actingAs($user);

        $this->patchJson('/api/v1/profile', ['name' => 'New Name'])->assertOk();

        $user->refresh();

        $this->assertSame('New Name', $user->name);
        $this->assertSame('+962790000001', $user->phone);
    }

    public function test_student_phone_must_be_unique_but_their_own_phone_is_fine(): void
    {
        $this->makeStudent(['phone' => '+962790000002']);
        $user = $this->makeStudent(['phone' => '+962790000003']);
        Sanctum::actingAs($user);

        $this->patchJson('/api/v1/profile', ['phone' => '+962 79 000 0002'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['phone'], 'errors');

        $this->patchJson('/api/v1/profile', ['phone' => '+962790000003'])
            ->assertOk();
    }

    public function test_student_phone_must_look_like_a_phone_number(): void
    {
        Sanctum::actingAs($this->makeStudent());

        $this->patchJson('/api/v1/profile', ['phone' => 'abc'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['phone'], 'errors');
    }

    public function test_student_name_cannot_be_empty(): void
    {
        Sanctum::actingAs($this->makeStudent());

        $this->patchJson('/api/v1/profile', ['name' => ''])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name'], 'errors');
    }

    public function test_changing_the_student_email_needs_the_current_password(): void
    {
        $user = $this->makeStudent(['email' => 'old@example.com']);
        Sanctum::actingAs($user);

        $this->patchJson('/api/v1/profile', ['email' => 'new@example.com'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['current_password'], 'errors');

        $this->patchJson('/api/v1/profile', [
            'email' => 'new@example.com',
            'current_password' => 'WrongPassword1',
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['current_password'], 'errors');

        $this->assertSame('old@example.com', $user->fresh()->email);

        $this->patchJson('/api/v1/profile', [
            'email' => 'new@example.com',
            'current_password' => 'Password123',
        ])
            ->assertOk()
            ->assertJsonPath('data.email', 'old@example.com')
            ->assertJsonPath('data.pending_email', 'new@example.com');

        // The login email only changes after the new address is confirmed.
        $this->assertSame('old@example.com', $user->fresh()->email);
        $this->assertSame('new@example.com', $user->fresh()->pending_email);
    }

    public function test_sending_the_same_email_does_not_need_a_password(): void
    {
        $user = $this->makeStudent(['email' => 'same@example.com']);
        Sanctum::actingAs($user);

        $this->patchJson('/api/v1/profile', ['email' => 'same@example.com'])->assertOk();
    }

    public function test_student_email_must_not_belong_to_someone_else(): void
    {
        $this->makeStudent(['email' => 'taken@example.com']);
        Sanctum::actingAs($this->makeStudent());

        $this->patchJson('/api/v1/profile', [
            'email' => 'taken@example.com',
            'current_password' => 'Password123',
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['email'], 'errors');
    }

    public function test_student_profile_update_is_logged_with_field_names_only(): void
    {
        $user = $this->makeStudent();
        Sanctum::actingAs($user);

        $this->patchJson('/api/v1/profile', ['name' => 'Secret New Name'])->assertOk();

        $log = AuditLog::where('action', 'Updated Profile')->first();

        $this->assertNotNull($log);
        $this->assertSame($user->id, $log->actor_id);
        $this->assertFalse((bool) $log->is_sensitive);
        $this->assertSame(['name'], $log->metadata['fields']);
        $this->assertStringNotContainsString('Secret New Name', json_encode($log->metadata));
    }

    public function test_student_email_change_is_logged_as_sensitive(): void
    {
        Sanctum::actingAs($this->makeStudent());

        $this->patchJson('/api/v1/profile', [
            'email' => 'changed@example.com',
            'current_password' => 'Password123',
        ])->assertOk();

        $this->assertTrue((bool) AuditLog::where('action', 'Requested Email Change')->first()->is_sensitive);
    }

    public function test_an_update_that_changes_nothing_writes_no_log(): void
    {
        $user = $this->makeStudent(['name' => 'Same Name']);
        Sanctum::actingAs($user);

        $this->patchJson('/api/v1/profile', ['name' => 'Same Name'])->assertOk();

        $this->assertSame(0, AuditLog::where('action', 'Updated Profile')->count());
    }

    // ── Student: password ─────────────────────────────────────

    public function test_student_can_change_the_password(): void
    {
        $user = $this->makeStudent();
        Sanctum::actingAs($user);

        $this->patchJson('/api/v1/password', [
            'current_password' => 'Password123',
            'password' => 'NewPassword456',
            'password_confirmation' => 'NewPassword456',
        ])
            ->assertOk()
            ->assertJsonPath('message', 'Password changed successfully');

        $this->assertTrue(Hash::check('NewPassword456', $user->fresh()->password));
    }

    public function test_student_password_change_is_refused_for_bad_input(): void
    {
        $user = $this->makeStudent();
        Sanctum::actingAs($user);

        // Wrong current password.
        $this->patchJson('/api/v1/password', [
            'current_password' => 'WrongPassword1',
            'password' => 'NewPassword456',
            'password_confirmation' => 'NewPassword456',
        ])->assertStatus(422)->assertJsonValidationErrors(['current_password'], 'errors');

        // Too weak (no uppercase letter, no number).
        $this->patchJson('/api/v1/password', [
            'current_password' => 'Password123',
            'password' => 'weakpassword',
            'password_confirmation' => 'weakpassword',
        ])->assertStatus(422)->assertJsonValidationErrors(['password'], 'errors');

        // Confirmation does not match.
        $this->patchJson('/api/v1/password', [
            'current_password' => 'Password123',
            'password' => 'NewPassword456',
            'password_confirmation' => 'Different789',
        ])->assertStatus(422)->assertJsonValidationErrors(['password'], 'errors');

        // Same as the current one.
        $this->patchJson('/api/v1/password', [
            'current_password' => 'Password123',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ])->assertStatus(422)->assertJsonValidationErrors(['password'], 'errors');

        $this->assertTrue(Hash::check('Password123', $user->fresh()->password));
    }

    public function test_changing_the_student_password_signs_out_the_other_sessions_only(): void
    {
        $user = $this->makeStudent();
        $current = $user->createToken('current');
        $other = $user->createToken('other');

        $this->withToken($current->plainTextToken)
            ->patchJson('/api/v1/password', [
                'current_password' => 'Password123',
                'password' => 'NewPassword456',
                'password_confirmation' => 'NewPassword456',
            ])->assertOk();

        $this->assertDatabaseHas('personal_access_tokens', ['id' => $current->accessToken->id]);
        $this->assertDatabaseMissing('personal_access_tokens', ['id' => $other->accessToken->id]);
    }

    public function test_student_password_change_is_logged_as_sensitive(): void
    {
        $user = $this->makeStudent();
        Sanctum::actingAs($user);

        $this->patchJson('/api/v1/password', [
            'current_password' => 'Password123',
            'password' => 'NewPassword456',
            'password_confirmation' => 'NewPassword456',
        ])->assertOk();

        $log = AuditLog::where('action', 'Changed Password')->first();

        $this->assertNotNull($log);
        $this->assertSame($user->id, $log->actor_id);
        $this->assertTrue((bool) $log->is_sensitive);
    }

    // ── Student: who can call it ──────────────────────────────

    public function test_an_organization_token_cannot_use_the_student_profile_routes(): void
    {
        Sanctum::actingAs($this->makeOrganization());

        $this->patchJson('/api/v1/profile', ['name' => 'Hacked'])->assertStatus(403);

        $this->patchJson('/api/v1/password', [
            'current_password' => 'Password123',
            'password' => 'NewPassword456',
            'password_confirmation' => 'NewPassword456',
        ])->assertStatus(403);
    }

    public function test_a_guest_cannot_use_the_student_profile_routes(): void
    {
        $this->patchJson('/api/v1/profile', ['name' => 'X'])->assertStatus(401);
        $this->patchJson('/api/v1/password', [])->assertStatus(401);
    }

    // ── Organization: profile ─────────────────────────────────

    public function test_organization_can_update_its_profile_and_the_slug_stays(): void
    {
        $org = $this->makeOrganization();
        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson('/api/v1/org/profile', [
            'name' => 'Renamed Organization',
            'type' => 'University',
            'description' => 'We run student programs.',
            'website' => 'https://example.edu',
            'city' => 'Amman',
            'country' => 'Jordan',
            'phone' => '+962 6 555 0000',
        ])
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Renamed Organization')
            ->assertJsonPath('data.type', 'University')
            ->assertJsonPath('data.description', 'We run student programs.')
            ->assertJsonPath('data.website', 'https://example.edu')
            ->assertJsonPath('data.city', 'Amman')
            ->assertJsonPath('data.country', 'Jordan')
            ->assertJsonPath('data.slug', 'test-organization');

        $org->refresh();

        $this->assertSame('Renamed Organization', $org->name);
        $this->assertSame('test-organization', $org->slug);
    }

    public function test_the_new_profile_fields_show_up_in_the_organization_me_response(): void
    {
        $org = $this->makeOrganization();
        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson('/api/v1/org/profile', ['city' => 'Irbid'])->assertOk();

        $this->getJson('/api/v1/org/me')
            ->assertOk()
            ->assertJsonPath('data.city', 'Irbid');
    }

    public function test_organization_partial_update_keeps_the_other_fields(): void
    {
        $org = $this->makeOrganization([
            'type' => 'Company',
            'city' => 'Amman',
        ]);
        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson('/api/v1/org/profile', ['country' => 'Jordan'])->assertOk();

        $org->refresh();

        $this->assertSame('Company', $org->type);
        $this->assertSame('Amman', $org->city);
        $this->assertSame('Jordan', $org->country);
    }

    public function test_organization_profile_rejects_bad_values(): void
    {
        Sanctum::actingAs($this->makeOrganization(), ['*'], 'organization');

        $this->patchJson('/api/v1/org/profile', ['type' => 'Hospital'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['type'], 'errors');

        $this->patchJson('/api/v1/org/profile', ['website' => 'javascript:alert(1)'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['website'], 'errors');

        $this->patchJson('/api/v1/org/profile', ['name' => ''])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name'], 'errors');
    }

    public function test_changing_the_organization_email_needs_the_current_password(): void
    {
        $org = $this->makeOrganization();
        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson('/api/v1/org/profile', ['email' => 'new-org@example.com'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['current_password'], 'errors');

        $this->patchJson('/api/v1/org/profile', [
            'email' => 'new-org@example.com',
            'current_password' => 'WrongPassword1',
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['current_password'], 'errors');

        $this->assertSame('org@example.com', $org->fresh()->email);

        $this->patchJson('/api/v1/org/profile', [
            'email' => 'new-org@example.com',
            'current_password' => 'Password123',
        ])
            ->assertOk()
            ->assertJsonPath('data.email', 'new-org@example.com');

        $this->assertSame('new-org@example.com', $org->fresh()->email);
    }

    public function test_organization_email_must_not_belong_to_another_organization(): void
    {
        $this->makeOrganization([
            'slug' => 'other-org',
            'email' => 'taken-org@example.com',
        ]);
        Sanctum::actingAs($this->makeOrganization(), ['*'], 'organization');

        $this->patchJson('/api/v1/org/profile', [
            'email' => 'taken-org@example.com',
            'current_password' => 'Password123',
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['email'], 'errors');
    }

    public function test_organization_profile_update_is_logged_with_field_names_only(): void
    {
        $org = $this->makeOrganization();
        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson('/api/v1/org/profile', ['city' => 'Secret City'])->assertOk();

        $log = AuditLog::where('action', 'Updated Organization Profile')->first();

        $this->assertNotNull($log);
        $this->assertSame($org->id, $log->actor_id);
        $this->assertSame(AuditLog::ROLE_ORGANIZATION, $log->actor_role);
        $this->assertFalse((bool) $log->is_sensitive);
        $this->assertSame(['city'], $log->metadata['fields']);
        $this->assertStringNotContainsString('Secret City', json_encode($log->metadata));
    }

    public function test_organization_email_change_is_logged_as_sensitive(): void
    {
        Sanctum::actingAs($this->makeOrganization(), ['*'], 'organization');

        $this->patchJson('/api/v1/org/profile', [
            'email' => 'changed-org@example.com',
            'current_password' => 'Password123',
        ])->assertOk();

        $this->assertTrue(
            (bool) AuditLog::where('action', 'Updated Organization Profile')->first()->is_sensitive
        );
    }

    // ── Organization: password ────────────────────────────────

    public function test_organization_can_change_the_password(): void
    {
        $org = $this->makeOrganization();
        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson('/api/v1/org/password', [
            'current_password' => 'Password123',
            'password' => 'NewPassword456',
            'password_confirmation' => 'NewPassword456',
        ])
            ->assertOk()
            ->assertJsonPath('message', 'Password changed successfully');

        $this->assertTrue(Hash::check('NewPassword456', $org->fresh()->password));
    }

    public function test_organization_password_change_is_refused_for_bad_input(): void
    {
        $org = $this->makeOrganization();
        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson('/api/v1/org/password', [
            'current_password' => 'WrongPassword1',
            'password' => 'NewPassword456',
            'password_confirmation' => 'NewPassword456',
        ])->assertStatus(422)->assertJsonValidationErrors(['current_password'], 'errors');

        $this->patchJson('/api/v1/org/password', [
            'current_password' => 'Password123',
            'password' => 'weakpassword',
            'password_confirmation' => 'weakpassword',
        ])->assertStatus(422)->assertJsonValidationErrors(['password'], 'errors');

        $this->patchJson('/api/v1/org/password', [
            'current_password' => 'Password123',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ])->assertStatus(422)->assertJsonValidationErrors(['password'], 'errors');

        $this->assertTrue(Hash::check('Password123', $org->fresh()->password));
    }

    public function test_changing_the_organization_password_signs_out_the_other_sessions_only(): void
    {
        $org = $this->makeOrganization();
        $current = $org->createToken('current');
        $other = $org->createToken('other');

        $this->withToken($current->plainTextToken)
            ->patchJson('/api/v1/org/password', [
                'current_password' => 'Password123',
                'password' => 'NewPassword456',
                'password_confirmation' => 'NewPassword456',
            ])->assertOk();

        $this->assertDatabaseHas('personal_access_tokens', ['id' => $current->accessToken->id]);
        $this->assertDatabaseMissing('personal_access_tokens', ['id' => $other->accessToken->id]);
    }

    public function test_organization_password_change_is_logged_as_sensitive(): void
    {
        $org = $this->makeOrganization();
        Sanctum::actingAs($org, ['*'], 'organization');

        $this->patchJson('/api/v1/org/password', [
            'current_password' => 'Password123',
            'password' => 'NewPassword456',
            'password_confirmation' => 'NewPassword456',
        ])->assertOk();

        $log = AuditLog::where('action', 'Changed Password')->first();

        $this->assertNotNull($log);
        $this->assertSame($org->id, $log->actor_id);
        $this->assertTrue((bool) $log->is_sensitive);
    }

    // ── Organization: who can call it ─────────────────────────

    public function test_a_student_token_cannot_use_the_organization_profile_routes(): void
    {
        $student = $this->makeStudent();
        $token = $student->createToken('student')->plainTextToken;

        $this->withToken($token)
            ->patchJson('/api/v1/org/profile', ['name' => 'Hacked'])
            ->assertStatus(401);

        $this->withToken($token)
            ->patchJson('/api/v1/org/password', [])
            ->assertStatus(401);
    }

    public function test_a_guest_cannot_use_the_organization_profile_routes(): void
    {
        $this->patchJson('/api/v1/org/profile', ['name' => 'X'])->assertStatus(401);
        $this->patchJson('/api/v1/org/password', [])->assertStatus(401);
    }

    // ── Helpers ───────────────────────────────────────────────

    /**
     * @param  array<string, mixed>  $overrides
     */
    private function makeStudent(array $overrides = []): User
    {
        return User::factory()->create(array_merge(['password' => 'Password123'], $overrides));
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    private function makeOrganization(array $overrides = []): Organization
    {
        return Organization::create(array_merge([
            'name' => 'Test Organization',
            'slug' => 'test-organization',
            'email' => 'org@example.com',
            'password' => 'Password123',
            'status' => Organization::STATUS_APPROVED,
        ], $overrides));
    }
}