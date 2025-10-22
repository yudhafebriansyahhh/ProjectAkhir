<?php
// app/Models/Mahasiswa.php

namespace App\Models;

use App\Helpers\NimGenerator;
use Illuminate\Database\Eloquent\Model;

class Mahasiswa extends Model
{
    protected $table = 'mahasiswa';
    protected $primaryKey = 'id_mahasiswa';

    protected $fillable = [
        'user_id', 'nim', 'nama', 'tahun_masuk', 'kode_prodi', 'id_dosen_wali',
        'tanggal_lahir', 'jenis_kelamin', 'alamat', 'no_hp',
        'status', 'foto'
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function prodi()
    {
        return $this->belongsTo(Prodi::class, 'kode_prodi', 'kode_prodi');
    }

    public function dosenWali()
    {
        return $this->belongsTo(Dosen::class, 'id_dosen_wali', 'id_dosen');
    }

    public function registrasiSemester()
    {
        return $this->hasMany(RegistrasiSemester::class, 'id_mahasiswa', 'id_mahasiswa');
    }

    public function krs()
    {
        return $this->hasMany(Krs::class, 'id_mahasiswa', 'id_mahasiswa');
    }

    // Get semester ke berapa (termasuk cuti)
    public function getSemesterKeAttribute()
    {
        return $this->registrasiSemester()->count();
    }

    // Get semester aktif (tidak termasuk cuti)
    public function getSemesterAktifAttribute()
    {
        return $this->registrasiSemester()
            ->where('status_semester', 'aktif')
            ->count();
    }

    // Hitung jumlah cuti berturut-turut
    public function jumlahCutiBerturut()
    {
        $registrasi = $this->registrasiSemester()
            ->orderBy('tahun_ajaran', 'desc')
            ->orderBy('jenis_semester', 'desc')
            ->get();

        $cutiCount = 0;
        foreach ($registrasi as $reg) {
            if ($reg->status_semester === 'cuti') {
                $cutiCount++;
            } else {
                break;
            }
        }

        return $cutiCount;
    }

    // Generate NIM
    public static function generateNim($kodeProdi, $tahunMasuk = null)
    {
        return NimGenerator::generate($kodeProdi, $tahunMasuk);
    }

    // Get foto URL
    public function getFotoUrlAttribute()
    {
        return $this->foto ? asset('storage/' . $this->foto) : null;
    }
}
