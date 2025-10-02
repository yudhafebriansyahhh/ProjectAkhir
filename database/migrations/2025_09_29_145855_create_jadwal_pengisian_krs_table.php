<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jadwal_pengisian_krs', function (Blueprint $table) {
            $table->id('id_jadwal');
            $table->string('kode_prodi', 2);
            $table->foreign('kode_prodi')->references('kode_prodi')->on('prodi')->cascadeOnDelete();
            $table->json('semester_list');
            $table->string('tahun_ajaran', 10);
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jadwal_pengisian_krs');
    }
};
