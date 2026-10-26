<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class Skill extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug'];

    /**
     * Auto-generates the slug from "name" whenever a Skill is created
     * without one explicitly set — protects against any creation path
     * (controller, seeder, tinker) forgetting to set it manually.
     */
    protected static function booted(): void
    {
        static::creating(function (Skill $skill) {
            if (empty($skill->slug)) {
                $skill->slug = Str::slug($skill->name);
            }
        });
    }

    /**
     * The skill with this name (any letter case), created when it is new.
     * The slug is made unique here because two different names can slug
     * to the same text ("C++" and "C#" both give "c").
     */
    public static function findOrCreateByName(string $name): self
    {
        $name = trim((string) preg_replace('/\s+/u', ' ', $name));

        $existing = static::whereRaw('LOWER(name) = ?', [mb_strtolower($name)])->first();

        if ($existing) {
            return $existing;
        }

        $base = Str::slug($name) ?: 'skill';
        $slug = $base;
        $n = 2;

        while (static::where('slug', $slug)->exists()) {
            $slug = $base . '-' . $n++;
        }

        try {
            // Its own (nested) transaction, so a clash rolls back cleanly
            // even when the caller is already inside a transaction.
            return DB::transaction(fn () => static::create(['name' => $name, 'slug' => $slug]));
        } catch (UniqueConstraintViolationException) {
            // Someone saved the same skill a moment ago: use theirs.
            return static::whereRaw('LOWER(name) = ?', [mb_strtolower($name)])->first()
                ?? static::where('slug', $slug)->firstOrFail();
        }
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_skills')->withTimestamps();
    }

    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'team_skills')
            ->withTimestamps();
    }
}