<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Absensi extends Model
{
    use HasFactory;

    protected $table = 'absensi';
    protected $primaryKey = 'id_absensi';

    protected $fillable = [
        'id_mahasiswa',
        'id_pertemuan',
        'status',
    ];

    // ========================================
    // RELATIONSHIPS
    // ========================================

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'id_mahasiswa', 'id_mahasiswa');
    }

    public function pertemuan()
    {
        return $this->belongsTo(Pertemuan::class, 'id_pertemuan', 'id_pertemuan');
    }
}
