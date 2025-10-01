<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rps', function (Blueprint $table) {
            $table->id('id_rps');
            $table->string('kode_matkul', 20);
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->text('capaian_pembelajaran')->nullable();
            $table->text('materi')->nullable();
            $table->string('file_path')->nullable();
            $table->timestamps();

            $table->foreign('kode_matkul')->references('kode_matkul')->on('mata_kuliah')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rps');
    }
};
