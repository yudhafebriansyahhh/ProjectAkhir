<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kelas', function (Blueprint $table) {
            $table->id('id_kelas');
            $table->string('nama_kelas', 10);
            $table->unsignedBigInteger('id_mk_periode'); // ✅ PENTING: unsignedBigInteger karena FK ke id (bigint)
            $table->foreignId('id_dosen')->constrained('dosen', 'id_dosen')->cascadeOnDelete();
            $table->string('ruang_kelas', 20);
            $table->enum('hari', ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']);
            $table->time('jam_mulai');
            $table->time('jam_selesai');
            $table->integer('kapasitas')->default(40);
            $table->timestamps();

            // Foreign key ke mata_kuliah_periode
            $table->foreign('id_mk_periode')
                ->references('id_mk_periode')      
                ->on('mata_kuliah_periode')
                ->cascadeOnDelete();

            // Indexes
            $table->index(['hari', 'jam_mulai', 'jam_selesai']); // untuk cek bentrok jadwal
            $table->index('id_dosen'); // untuk query kelas per dosen
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kelas');
    }
};
