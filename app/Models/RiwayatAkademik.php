<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiwayatAkademik extends Model
{
    use HasFactory;

    protected $table = 'riwayat_akademik';
    protected $primaryKey = 'id_riwayat';

    protected $fillable = [
        'id_mahasiswa',
        'semester',
        'tahun_ajaran',
        'ips_semester',
        'sks_semester',
        'sks_kumulatif',
        'ipk',
        'keterangan',
    ];

    protected $casts = [
        'ips_semester' => 'decimal:2',
        'sks_semester' => 'decimal:2',
        'sks_kumulatif' => 'decimal:2',
        'ipk' => 'decimal:2',
    ];

    // Relationships
    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'id_mahasiswa', 'id_mahasiswa');
    }
}
