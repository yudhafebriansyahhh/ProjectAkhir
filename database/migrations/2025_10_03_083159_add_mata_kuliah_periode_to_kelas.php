<?php
// database/migrations/2025_10_03_000003_add_mata_kuliah_periode_to_kelas.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kelas', function (Blueprint $table) {
            // Tambah kolom id_mk_periode (nullable dulu untuk migrasi existing data)
            $table->foreignId('id_mk_periode')
                ->nullable()
                ->after('kode_matkul')
                ->constrained('mata_kuliah_periode', 'id_mk_periode')
                ->nullOnDelete();

            // Index untuk query performance
            $table->index('id_mk_periode');
        });
    }

    public function down(): void
    {
        Schema::table('kelas', function (Blueprint $table) {
            $table->dropForeign(['id_mk_periode']);
            $table->dropIndex(['id_mk_periode']);
            $table->dropColumn('id_mk_periode');
        });
    }
};
