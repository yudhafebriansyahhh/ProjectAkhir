<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ruangan', function (Blueprint $table) {
            $table->id('id_ruangan');
            $table->string('kode_ruangan', 20)->unique();
            $table->string('nama_ruangan', 100);
            $table->string('gedung', 100)->nullable();
            $table->unsignedTinyInteger('lantai')->nullable();
            $table->unsignedInteger('kapasitas')->nullable();
            $table->text('keterangan')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::table('kelas', function (Blueprint $table) {
            $table->foreignId('id_ruangan')
                ->nullable()
                ->after('id_dosen')
                ->constrained('ruangan', 'id_ruangan')
                ->nullOnDelete();
            $table->index(['id_ruangan', 'hari', 'jam_mulai', 'jam_selesai']);
        });

        $existingRooms = DB::table('kelas')
            ->select('ruang_kelas')
            ->whereNotNull('ruang_kelas')
            ->where('ruang_kelas', '!=', '')
            ->distinct()
            ->pluck('ruang_kelas')
            ->map(fn ($roomName) => [
                'original' => $roomName,
                'code' => strtoupper(trim($roomName)),
                'name' => trim($roomName),
            ])
            ->filter(fn ($room) => $room['code'] !== '')
            ->unique('code')
            ->values();

        foreach ($existingRooms as $room) {
            $roomId = DB::table('ruangan')->insertGetId([
                'kode_ruangan' => $room['code'],
                'nama_ruangan' => $room['name'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('kelas')
                ->whereRaw('UPPER(TRIM(ruang_kelas)) = ?', [$room['code']])
                ->update(['id_ruangan' => $roomId]);
        }
    }

    public function down(): void
    {
        Schema::table('kelas', function (Blueprint $table) {
            $table->dropForeign(['id_ruangan']);
            $table->dropIndex(['id_ruangan', 'hari', 'jam_mulai', 'jam_selesai']);
            $table->dropColumn('id_ruangan');
        });

        Schema::dropIfExists('ruangan');
    }
};
