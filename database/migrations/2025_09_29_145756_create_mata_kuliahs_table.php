<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('mata_kuliah', function (Blueprint $table) {
            $table->string('kode_matkul', 10)->primary();
            $table->string('nama_matkul');
            $table->string('kode_prodi', 2)->nullable();
            $table->foreign('kode_prodi')->references('kode_prodi')->on('prodi')->nullOnDelete();
            $table->enum('kategori', ['wajib', 'pilihan', 'umum']);
            $table->integer('sks');
            $table->integer('semester');
            $table->boolean('is_active')->default(1);
            $table->string('deskripsi');
            $table->timestamps();
            $table->index(['kode_prodi', 'semester', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::table('mata_kuliah', function (Blueprint $table) {
            $table->dropForeign(['kode_prodi']);
            $table->dropIndex(['kode_prodi', 'semester', 'is_active']);
            $table->dropColumn(['kode_prodi', 'kategori', 'is_active']);
        });
    }
};
