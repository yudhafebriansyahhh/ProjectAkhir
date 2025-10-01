<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('krs', function (Blueprint $table) {
            $table->id('id_krs');
            $table->foreignId('id_mahasiswa')->constrained('mahasiswa', 'id_mahasiswa')->cascadeOnDelete();
            $table->integer('semester');
            $table->string('tahun_ajaran', 10);
            $table->date('tanggal_pengisian');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('krs');
    }
};
