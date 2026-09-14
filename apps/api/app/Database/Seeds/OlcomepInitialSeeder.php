<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class OlcomepInitialSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(Edition2026Seeder::class);
        $this->call(LegacyCarouselSeeder::class);
        $this->call(PublicContentSeeder::class);
    }
}
