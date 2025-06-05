<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Stationary',
            'Bags',
            'Writing Tools',
            'Desk Supplies',
            'Health and Safety',
            'Technology and Gadgets'
        ];

        foreach ($categories as $name) {
            Category::create(['name' => $name]);
        }
    }
}
