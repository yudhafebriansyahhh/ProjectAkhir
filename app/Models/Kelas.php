<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    use HasFactory;

    protected $table = 'kelas';
    protected $primaryKey = 'id_kelas';

    protected $fillable = [
        'nama_kelas',
        'kode_matkul',
        'id_mk_periode',
        'id_dosen',
        'ruang_kelas',
        'hari',
        'jam_mulai',
        'jam_selesai',
        'kapasitas',
    ];

    protected $casts = [
        'jam_mulai' => 'datetime:H:i',
        'jam_selesai' => 'datetime:H:i',
    ];

    // ========================================
    // RELATIONSHIPS
    // ========================================

    public function mataKuliah()
    {
        return $this->belongsTo(MataKuliah::class, 'kode_matkul', 'kode_matkul');
    }

    public function mataKuliahPeriode()
    {
        return $this->belongsTo(MataKuliahPeriode::class, 'id_mk_periode', 'id_mk_periode');
    }

    public function dosen()
    {
        return $this->belongsTo(Dosen::class, 'id_dosen', 'id_dosen');
    }

    public function detailKrs()
    {
        return $this->hasMany(DetailKrs::class, 'id_kelas', 'id_kelas');
    }

    public function pertemuans()
    {
        return $this->hasMany(Pertemuan::class, 'id_kelas', 'id_kelas');
    }

    public function nilais()
    {
        return $this->hasMany(NilaiMahasiswa::class, 'id_kelas', 'id_kelas');
    }

    public function bobotNilai()
    {
        return $this->hasOne(BobotNilai::class, 'id_kelas', 'id_kelas');
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    public function getJumlahMahasiswaAttribute()
    {
        return $this->detailKrs()->count();
    }

    public function isFull()
    {
        return $this->jumlah_mahasiswa >= $this->kapasitas;
    }
}
