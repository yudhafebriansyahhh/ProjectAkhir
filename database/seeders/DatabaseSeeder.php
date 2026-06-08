<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $baakUserId = DB::table('users')->insertGetId([
            'role' => 'baak',
            'username' => 'baak001',
            'email' => 'baak@itbriau.ac.id',
            'password' => Hash::make('baak001'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('baak')->insert([
            'user_id' => $baakUserId,
            'nama' => 'Admin BAAK',
            'nip' => 'BAAK001',
            'no_hp' => '081234567890',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
