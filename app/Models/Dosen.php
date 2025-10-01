<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dosen extends Model
{
    use HasFactory;

    protected $table = 'dosen';
    protected $primaryKey = 'id_dosen';

    protected $fillable = [
        'user_id',
        'nama',
        'nip',
        'jenis_kelamin',
        'kode_prodi',
        'alamat',
        'no_hp',
        'foto',
    ];

    // Relasi ke User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke Prodi
    public function prodi()
    {
        return $this->belongsTo(Prodi::class, 'kode_prodi', 'kode_prodi');
    }

    // Relasi ke Kelas
    public function kelas()
    {
        return $this->hasMany(Kelas::class, 'id_dosen', 'id_dosen');
    }

    // Relasi ke Mahasiswa (sebagai dosen wali)
    public function mahasiswaBimbingan()
    {
        return $this->hasMany(Mahasiswa::class, 'id_dosen_wali', 'id_dosen');
    }

    // Helper method
    public function getTotalKelasAttribute()
    {
        return $this->kelas()->count();
    }

    public function getTotalMahasiswaBimbinganAttribute()
    {
        return $this->mahasiswaBimbingan()->count();
    }
}
