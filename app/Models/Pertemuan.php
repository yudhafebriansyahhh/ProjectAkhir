<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pertemuan extends Model
{
    use HasFactory;

    protected $table = 'pertemuan';
    protected $primaryKey = 'id_pertemuan';

    protected $fillable = [
        'id_kelas',
        'pertemuan_ke',
        'tanggal',
        'topik_pembahasan',
        'materi',
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];

    // ========================================
    // RELATIONSHIPS
    // ========================================

    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'id_kelas', 'id_kelas');
    }

    public function absensis()
    {
        return $this->hasMany(Absensi::class, 'id_pertemuan', 'id_pertemuan');
    }
}
