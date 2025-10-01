<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BobotNilai extends Model
{
    use HasFactory;

    protected $table = 'bobot_nilai';
    protected $primaryKey = 'id_bobot';

    protected $fillable = [
        'id_kelas',
        'bobot_tugas',
        'bobot_uts',
        'bobot_uas',
    ];

    // ========================================
    // RELATIONSHIPS
    // ========================================

    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'id_kelas', 'id_kelas');
    }
}
