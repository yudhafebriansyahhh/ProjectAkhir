<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mata_kuliah_periode', function (Blueprint $table) {
            $table->id('id_mk_periode');
            $table->string('kode_matkul', 10);
            $table->string('kode_prodi', 10);
            $table->string('tahun_ajaran', 10);
            $table->enum('jenis_semester', ['ganjil', 'genap', 'pendek']);
            $table->integer('semester_ditawarkan');
            $table->text('catatan')->nullable();
            $table->timestamps();

            $table->foreign('kode_matkul')->references('kode_matkul')
                ->on('mata_kuliah')
                ->onDelete('cascade');
            $table->foreign('kode_prodi')->references('kode_prodi')
                ->on('prodi')
                ->onDelete('cascade');

            $table->index(['tahun_ajaran', 'jenis_semester']);
            $table->index('semester_ditawarkan');

            $table->unique(['kode_matkul', 'kode_prodi', 'tahun_ajaran', 'jenis_semester', 'semester_ditawarkan'], 'mk_periode_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mata_kuliah_periode');
    }
};
