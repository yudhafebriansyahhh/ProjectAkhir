<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('registrasi_semester', function (Blueprint $table) {
            $table->id('id_registrasi');
            $table->foreignId('id_mahasiswa')->constrained('mahasiswa', 'id_mahasiswa')->cascadeOnDelete();
            $table->string('tahun_ajaran', 10);
            $table->integer('semester');
            $table->enum('jenis_semester', ['ganjil', 'genap']);
            $table->enum('status_semester', ['aktif', 'cuti'])->default('aktif');
            $table->date('tanggal_registrasi');
            $table->text('keterangan')->nullable();
            $table->timestamps();

            // Ganti baris ini:
            // $table->index(['id_mahasiswa', 'tahun_ajaran', 'jenis_semester']);

            // Dengan ini (tambahkan nama index custom yang pendek):
            $table->index(['id_mahasiswa', 'tahun_ajaran', 'jenis_semester'], 'reg_sem_composite_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registrasi_semester');
    }
};
