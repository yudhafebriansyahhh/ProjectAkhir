<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE krs MODIFY status ENUM('draft','pending','approved','rejected') NOT NULL DEFAULT 'draft'");
    }

    public function down(): void
    {
        DB::table('krs')->where('status', 'draft')->update(['status' => 'pending']);
        DB::statement("ALTER TABLE krs MODIFY status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending'");
    }
};
