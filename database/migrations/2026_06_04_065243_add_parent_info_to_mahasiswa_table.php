<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mahasiswa', function (Blueprint $table) {
            $table->string('nama_ayah')->nullable()->after('no_hp');
            $table->string('nama_ibu')->nullable()->after('nama_ayah');
            $table->string('no_telp_ayah', 15)->nullable()->after('nama_ibu');
            $table->string('no_telp_ibu', 15)->nullable()->after('no_telp_ayah');
        });
    }

    public function down(): void
    {
        Schema::table('mahasiswa', function (Blueprint $table) {
            $table->dropColumn(['nama_ayah', 'nama_ibu', 'no_telp_ayah', 'no_telp_ibu']);
        });
    }
};
