<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detail_krs', function (Blueprint $table) {
            $table->id('id_detail_krs');
            $table->foreignId('id_krs')->constrained('krs', 'id_krs')->cascadeOnDelete();
            $table->foreignId('id_kelas')->constrained('kelas', 'id_kelas')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detail_krs');
    }
};
