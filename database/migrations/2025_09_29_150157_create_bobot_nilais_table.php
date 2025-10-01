<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bobot_nilai', function (Blueprint $table) {
            $table->id('id_bobot');
            $table->foreignId('id_kelas')->constrained('kelas', 'id_kelas')->cascadeOnDelete();
            $table->integer('bobot_tugas')->default(30);
            $table->integer('bobot_uts')->default(30);
            $table->integer('bobot_uas')->default(40);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bobot_nilai');
    }
};
