<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('riwayat_akademik', function (Blueprint $table) {
            $table->id('id_riwayat');
            $table->foreignId('id_mahasiswa')->constrained('mahasiswa', 'id_mahasiswa')->cascadeOnDelete();
            $table->integer('semester');
            $table->string('tahun_ajaran', 10);
            $table->decimal('ips_semester', 3, 2)->nullable();
            $table->decimal('sks_semester', 5, 2)->default(0);
            $table->decimal('sks_kumulatif', 5, 2)->default(0);
            $table->decimal('ipk', 3, 2)->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('riwayat_akademik');
    }
};
