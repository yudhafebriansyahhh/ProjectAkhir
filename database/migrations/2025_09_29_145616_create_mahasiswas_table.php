<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mahasiswa', function (Blueprint $table) {
            $table->id('id_mahasiswa');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('nim', 10)->unique();
            $table->string('nama');
            $table->string('tahun_masuk');
            $table->string('kode_prodi', 2);
            $table->foreign('kode_prodi')->references('kode_prodi')->on('prodi')->cascadeOnDelete();
            $table->foreignId('id_dosen_wali')->nullable()->constrained('dosen', 'id_dosen')->nullOnDelete();
            $table->date('tanggal_lahir');
            $table->enum('jenis_kelamin', ['Laki-laki', 'Perempuan']);
            $table->text('alamat')->nullable();
            $table->string('no_hp', 15)->nullable();
            $table->enum('status', ['aktif', 'lulus', 'keluar', 'DO'])->default('aktif');
            $table->string('foto')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mahasiswa');
    }
};
