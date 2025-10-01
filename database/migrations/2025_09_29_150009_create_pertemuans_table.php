<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pertemuan', function (Blueprint $table) {
            $table->id('id_pertemuan');
            $table->foreignId('id_kelas')->constrained('kelas', 'id_kelas')->cascadeOnDelete();
            $table->integer('pertemuan_ke');
            $table->date('tanggal');
            $table->string('topik_pembahasan')->nullable();
            $table->text('materi')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pertemuan');
    }
};
