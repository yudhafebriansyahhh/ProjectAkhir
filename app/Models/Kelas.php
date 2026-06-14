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
        'id_mk_periode',
        'id_dosen',
        'id_ruangan',
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

    // ======================
    // RELATIONSHIPS
    // ======================

    public function mataKuliahPeriode()
    {
        return $this->belongsTo(MataKuliahPeriode::class, 'id_mk_periode', 'id_mk_periode');
    }

    public function dosen()
    {
        return $this->belongsTo(Dosen::class, 'id_dosen', 'id_dosen');
    }

    public function ruangan()
    {
        return $this->belongsTo(Ruangan::class, 'id_ruangan', 'id_ruangan');
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

    public function scopeForPeriode($query, ?PeriodeRegistrasi $periode)
    {
        if (! $periode) {
            return $query->whereRaw('1 = 0');
        }

        return $query->forPeriodeValue($periode->tahun_ajaran, $periode->jenis_semester);
    }

    public function scopeForPeriodeValue($query, ?string $tahunAjaran, ?string $jenisSemester)
    {
        if (! $tahunAjaran || ! $jenisSemester) {
            return $query->whereRaw('1 = 0');
        }

        return $query->whereHas('mataKuliahPeriode', function ($query) use ($tahunAjaran, $jenisSemester) {
            $query->where('tahun_ajaran', $tahunAjaran)
                ->where('jenis_semester', $jenisSemester);
        });
    }

    public function scopeArchivedFromPeriode($query, ?PeriodeRegistrasi $periode)
    {
        if (! $periode) {
            return $query;
        }

        return $query->whereDoesntHave('mataKuliahPeriode', function ($query) use ($periode) {
            $query->where('tahun_ajaran', $periode->tahun_ajaran)
                ->where('jenis_semester', $periode->jenis_semester);
        });
    }

    // Helper: Dapatkan data mata kuliah langsung
    public function getMataKuliahAttribute()
    {
        return $this->mataKuliahPeriode?->mataKuliah;
    }

    // Helper: Jumlah mahasiswa
    public function getJumlahMahasiswaAttribute()
    {
        return $this->detailKrs()->count();
    }

    // Helper: kelas penuh?
    public function isFull()
    {
        return $this->jumlah_mahasiswa >= $this->kapasitas;
    }

    // Helper: sisa slot
    public function getSisaSlotAttribute()
    {
        return $this->kapasitas - $this->jumlah_mahasiswa;
    }
}
