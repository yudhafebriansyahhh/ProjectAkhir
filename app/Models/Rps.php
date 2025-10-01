<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rps extends Model
{
    use HasFactory;

    protected $table = 'rps';
    protected $primaryKey = 'id_rps';

    protected $fillable = [
        'kode_matkul',
        'judul',
        'deskripsi',
        'capaian_pembelajaran',
        'materi',
        'file_path',
    ];

    // ========================================
    // RELATIONSHIPS
    // ========================================

    public function mataKuliah()
    {
        return $this->belongsTo(MataKuliah::class, 'kode_matkul', 'kode_matkul');
    }
}
