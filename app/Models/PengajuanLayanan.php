<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PengajuanLayanan extends Model
{
    use HasFactory;

    protected $table = 'pengajuan_layanans';

    protected $fillable = [
        'id_mahasiswa',
        'id_krs',
        'jenis_layanan',
        'status',
        'keterangan',
        'keterangan_admin',
        'rating',
        'komentar_rating',
    ];

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'id_mahasiswa', 'id_mahasiswa');
    }

    public function krs()
    {
        return $this->belongsTo(Krs::class, 'id_krs', 'id_krs');
    }
}
