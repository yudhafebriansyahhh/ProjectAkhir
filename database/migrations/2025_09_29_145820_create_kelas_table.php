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
            $table->string('kode_matkul', 10);
            $table->foreign('kode_matkul')->references('kode_matkul')->on('mata_kuliah')->cascadeOnDelete();
            $table->foreignId('id_dosen')->constrained('dosen', 'id_dosen')->cascadeOnDelete();
            $table->string('ruang_kelas', 20);
            $table->enum('hari', ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']);
            $table->time('jam_mulai');
            $table->time('jam_selesai');
            $table->integer('kapasitas')->default(40);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kelas');
    }
};
