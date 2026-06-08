<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE mahasiswa MODIFY tanggal_lahir DATE NULL");
        DB::statement("ALTER TABLE mahasiswa MODIFY jenis_kelamin ENUM('Laki-laki', 'Perempuan') NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE mahasiswa MODIFY tanggal_lahir DATE NOT NULL");
        DB::statement("ALTER TABLE mahasiswa MODIFY jenis_kelamin ENUM('Laki-laki', 'Perempuan') NOT NULL");
    }
};
