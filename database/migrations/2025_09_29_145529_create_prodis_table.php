<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('prodi', function (Blueprint $table) {
            $table->string('kode_prodi', 10)->primary();
            $table->string('kode_fakultas', 10);
            $table->string('nama_prodi', 100);
            $table->enum('jenjang', ['D3', 'D4', 'S1', 'S2', 'S3'])->default('S1');
            $table->timestamps();

            $table->foreign('kode_fakultas')
                ->references('kode_fakultas')
                ->on('fakultas')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prodi');
    }
};
