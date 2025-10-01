<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nilai_mahasiswa', function (Blueprint $table) {
            $table->id('id_nilai');
            $table->foreignId('id_mahasiswa')->constrained('mahasiswa', 'id_mahasiswa')->cascadeOnDelete();
            $table->foreignId('id_kelas')->constrained('kelas', 'id_kelas')->cascadeOnDelete();
            $table->decimal('nilai_tugas', 5, 2)->nullable();
            $table->decimal('nilai_uts', 5, 2)->nullable();
            $table->decimal('nilai_uas', 5, 2)->nullable();
            $table->decimal('nilai_akhir', 5, 2)->nullable();
            $table->char('nilai_huruf', 2)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nilai_mahasiswa');
    }
};
