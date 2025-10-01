<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JadwalPengisianKrs extends Model
{
    use HasFactory;

    protected $table = 'jadwal_pengisian_krs';
    protected $primaryKey = 'id_jadwal';

    protected $fillable = [
        'kode_prodi',
        'semester',
        'tahun_ajaran',
        'tanggal_mulai',
        'tanggal_selesai',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
    ];

    // Relationships
    public function prodi()
    {
        return $this->belongsTo(Prodi::class, 'kode_prodi', 'kode_prodi');
    }
}
