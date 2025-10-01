<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Krs extends Model
{
    use HasFactory;

    protected $table = 'krs';
    protected $primaryKey = 'id_krs';

    protected $fillable = [
        'id_mahasiswa',
        'semester',
        'tahun_ajaran',
        'tanggal_pengisian',
        'status',
    ];

    protected $casts = [
        'tanggal_pengisian' => 'date',
    ];

    // ========================================
    // RELATIONSHIPS
    // ========================================

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'id_mahasiswa', 'id_mahasiswa');
    }

    public function detailKrs()
    {
        return $this->hasMany(DetailKrs::class, 'id_krs', 'id_krs');
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    public function getTotalSksAttribute()
    {
        return $this->detailKrs()
            ->join('kelas', 'detail_krs.id_kelas', '=', 'kelas.id_kelas')
            ->join('mata_kuliah', 'kelas.kode_matkul', '=', 'mata_kuliah.kode_matkul')
            ->sum('mata_kuliah.sks');
    }

    public function isApproved()
    {
        return $this->status === 'approved';
    }

    public function isDraft()
    {
        return $this->status === 'draft';
    }
}
