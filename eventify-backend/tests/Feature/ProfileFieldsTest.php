<?php

namespace Tests\Feature;

use App\Models\Skill;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProfileFieldsTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_student_can_fill_the_extended_profile(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->patchJson('/api/v1/profile', [
            'headline' => 'Computer Science Student',
            'location' => 'Amman, Jordan',
            'about' => 'I love building things.',
            'open_to_opportunities' => false,
            'skills' => ['Laravel', 'React'],
            'interests' => ['AI', 'Web'],
            'experience' => [['title' => 'Intern', 'organization' => 'Acme', 'period' => '2025', 'description' => 'Worked on APIs']],
        ])
            ->assertOk()
            ->assertJsonPath('data.headline', 'Computer Science Student')
            ->assertJsonPath('data.open_to_opportunities', false)
            ->assertJsonPath('data.skills', ['Laravel', 'React'])
            ->assertJsonPath('data.interests', ['AI', 'Web'])
            ->assertJsonPath('data.experience.0.title', 'Intern')
            ->assertJsonPath('data.profile_complete', true);
    }

    public function test_skills_are_reused_case_insensitively_and_replaced_on_update(): void
    {
        Skill::findOrCreateByName('Laravel');
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->patchJson('/api/v1/profile', ['skills' => ['laravel', 'C++', 'C#']])->assertOk();

        $this->assertSame(1, Skill::whereRaw('LOWER(name) = ?', ['laravel'])->count());
        $this->assertCount(3, $user->fresh()->skills);

        $this->patchJson('/api/v1/profile', ['skills' => ['C#']])
            ->assertOk()
            ->assertJsonPath('data.skills', ['C#']);
        $this->assertCount(1, $user->fresh()->skills);
    }

    public function test_updating_other_fields_keeps_the_skills(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);
        $this->patchJson('/api/v1/profile', ['skills' => ['PHP']])->assertOk();

        $this->patchJson('/api/v1/profile', ['headline' => 'Dev'])->assertOk();

        $this->assertCount(1, $user->fresh()->skills);
    }

    public function test_profile_fields_are_validated(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->patchJson('/api/v1/profile', [
            'about' => str_repeat('a', 601),
            'skills' => ['PHP', 'php'],
            'experience' => [['organization' => 'No title']],
        ])->assertStatus(422);
    }

    public function test_me_returns_the_profile_stats_and_completion(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->getJson('/api/v1/me')
            ->assertOk()
            ->assertJsonPath('data.stats.competitions_joined', 0)
            ->assertJsonPath('data.stats.saved', 0)
            ->assertJsonPath('data.stats.teams_led', 0)
            ->assertJsonPath('data.profile_complete', false)
            ->assertJsonPath('data.profile_completion', 0);
    }

    public function test_avatar_and_cover_can_be_uploaded_replaced_and_removed(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/v1/profile/avatar', ['image' => $this->pngFile('a.png')])->assertOk();
        $first = $user->fresh()->avatar;
        $this->assertNotNull($first);
        Storage::disk('public')->assertExists($first);

        $this->postJson('/api/v1/profile/avatar', ['image' => $this->pngFile('b.png')])->assertOk();
        Storage::disk('public')->assertMissing($first);

        $this->postJson('/api/v1/profile/cover', ['image' => $this->pngFile('c.png')])->assertOk();
        $this->assertNotNull($user->fresh()->cover_image);

        $this->deleteJson('/api/v1/profile/avatar')->assertOk();
        $this->deleteJson('/api/v1/profile/cover')->assertOk();
        $this->assertNull($user->fresh()->avatar);
        $this->assertNull($user->fresh()->cover_image);
    }

    public function test_bad_images_are_refused(): void
    {
        Storage::fake('public');
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/v1/profile/avatar', ['image' => UploadedFile::fake()->create('x.pdf', 10, 'application/pdf')])->assertStatus(422);
        $this->postJson('/api/v1/profile/avatar', ['image' => $this->pngFile('big.png', 3 * 1024 * 1024)])->assertStatus(422);
        $this->postJson('/api/v1/profile/avatar', [])->assertStatus(422);
    }

    public function test_cv_is_private_downloadable_by_its_owner_and_replaceable(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->getJson('/api/v1/profile/cv')->assertStatus(404);

        $this->postJson('/api/v1/profile/cv', ['cv' => UploadedFile::fake()->create('my-cv.pdf', 100, 'application/pdf')])
            ->assertOk()
            ->assertJsonPath('data.has_cv', true)
            ->assertJsonPath('data.cv_name', 'my-cv.pdf')
            ->assertJsonMissingPath('data.cv_path');

        $old = $user->fresh()->cv_path;
        Storage::disk('local')->assertExists($old);
        $this->get('/api/v1/profile/cv')->assertOk();

        $this->postJson('/api/v1/profile/cv', ['cv' => UploadedFile::fake()->create('new.docx', 100)])->assertOk();
        Storage::disk('local')->assertMissing($old);

        $this->deleteJson('/api/v1/profile/cv')->assertOk()->assertJsonPath('data.has_cv', false);
    }

    public function test_bad_cv_files_are_refused(): void
    {
        Storage::fake('local');
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/v1/profile/cv', ['cv' => UploadedFile::fake()->create('x.exe', 10)])->assertStatus(422);
        $this->postJson('/api/v1/profile/cv', ['cv' => UploadedFile::fake()->create('big.pdf', 11000, 'application/pdf')])->assertStatus(422);
    }

    public function test_uploads_need_a_signed_in_user(): void
    {
        $this->postJson('/api/v1/profile/avatar', [])->assertStatus(401);
        $this->getJson('/api/v1/profile/cv')->assertStatus(401);
    }

    /**
     * A real (tiny) PNG, built without the GD extension, so the tests run
     * on any machine. $padding adds extra bytes to make it larger.
     */
    private function pngFile(string $name, int $padding = 0): UploadedFile
    {
        $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==');

        return UploadedFile::fake()->createWithContent($name, $png . str_repeat("\0", $padding));
    }
}