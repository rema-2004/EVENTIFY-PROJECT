<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Competition;
use App\Models\Organization;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::first() ?? Organization::create([
            'name' => 'Test Organization',
            'slug' => 'test-organization',
            'email' => 'org@example.com',
            'password' => bcrypt('Password123'),
            'status' => Organization::STATUS_APPROVED,
        ]);

        $hackathon = Event::create([
            'organization_id' => $organization->id,
            'title' => 'Global AI Innovation Challenge',
            'slug' => Str::slug('Global AI Innovation Challenge'),
            'description' => 'A hackathon for building AI-powered solutions.',
            'type' => Event::TYPE_COMPETITION,
            'location' => 'Amman, JO',
            'start_date' => '2026-10-01',
            'end_date' => '2026-10-03',
            'registration_deadline' => '2026-09-28',
            'requirements' => 'Teams of 2-4 members, basic programming knowledge.',
            'status' => Event::STATUS_PUBLISHED,
        ]);

        Competition::create([
            'id' => $hackathon->id,
            'prize' => '$10,000 Prize Pool',
            'team_size' => '2-4 members',
        ]);

        Event::create([
            'organization_id' => $organization->id,
            'title' => 'Intro to Cloud Computing',
            'slug' => Str::slug('Intro to Cloud Computing'),
            'description' => 'A hands-on workshop covering cloud fundamentals.',
            'type' => Event::TYPE_WORKSHOP,
            'location' => 'Online',
            'start_date' => '2026-10-10',
            'end_date' => '2026-10-10',
            'registration_deadline' => '2026-10-08',
            'status' => Event::STATUS_PUBLISHED,
        ]);

        Event::create([
            'organization_id' => $organization->id,
            'title' => 'Tech Career Fair',
            'slug' => Str::slug('Tech Career Fair'),
            'description' => 'Meet recruiters from top tech companies.',
            'type' => Event::TYPE_EVENT,
            'location' => 'Amman, JO',
            'start_date' => '2026-10-15',
            'end_date' => '2026-10-15',
            'registration_deadline' => '2026-10-13',
            'status' => Event::STATUS_PUBLISHED,
        ]);

        Event::create([
            'organization_id' => $organization->id,
            'title' => 'Product Strategy Course',
            'slug' => Str::slug('Product Strategy Course'),
            'description' => 'Learn the fundamentals of product strategy.',
            'type' => Event::TYPE_COURSE,
            'location' => 'Online',
            'start_date' => '2026-10-20',
            'end_date' => '2026-11-20',
            'registration_deadline' => '2026-10-18',
            'status' => Event::STATUS_PUBLISHED,
        ]);

        Event::create([
            'organization_id' => $organization->id,
            'title' => 'Upcoming Design Sprint',
            'slug' => Str::slug('Upcoming Design Sprint'),
            'description' => 'A draft event not yet submitted for review.',
            'type' => Event::TYPE_WORKSHOP,
            'status' => Event::STATUS_DRAFT,
        ]);
    }
}
