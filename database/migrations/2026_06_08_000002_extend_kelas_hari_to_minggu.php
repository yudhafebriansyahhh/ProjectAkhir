<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE kelas MODIFY hari ENUM('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu') NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE kelas MODIFY hari ENUM('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu') NOT NULL");
    }
};
