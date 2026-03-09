<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rps', function (Blueprint $table) {
            $table->dropColumn([
                'deskripsi',
                'capaian_pembelajaran',
                'materi'
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('rps', function (Blueprint $table) {
            $table->text('deskripsi')->nullable();
            $table->text('capaian_pembelajaran')->nullable();
            $table->text('materi')->nullable();
        });
    }
};
