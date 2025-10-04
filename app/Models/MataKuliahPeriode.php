<?php
// app/Models/MataKuliahPeriode.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MataKuliahPeriode extends Model
{
    use HasFactory;

    protected $table = 'mata_kuliah_periode';
    protected $primaryKey = 'id_mk_periode';

    protected $fillable = [
        'kode_matkul',
        'kode_prodi',
        'tahun_ajaran',
        'jenis_semester',
        'semester_ditawarkan',
        'catatan',
    ];

    // Relations
    public function mataKuliah()
    {
        return $this->belongsTo(MataKuliah::class, 'kode_matkul', 'kode_matkul');
    }

    public function prodi()
    {
        return $this->belongsTo(Prodi::class, 'kode_prodi', 'kode_prodi');
    }

    public function kelas()
    {
        return $this->hasMany(Kelas::class, 'id_mk_periode', 'id_mk_periode');
    }

    // Helper Methods
    public function getSemesterLabel()
    {
        return "Semester {$this->semester_ditawarkan}";
    }

    public function getPeriodeLabel()
    {
        return "{$this->tahun_ajaran} - " . ucfirst($this->jenis_semester);
    }

    public function getProdiLabelAttribute()
    {
        return $this->prodi ? $this->prodi->nama_prodi : 'Semua Prodi';
    }

    // Auto-calculate total kuota dari kelas
    public function getTotalKuotaAttribute()
    {
        return $this->kelas()->sum('kapasitas');
    }

    // Get jumlah mahasiswa yang sudah ambil
    public function getJumlahMahasiswaAttribute()
    {
        return \App\Models\DetailKrs::whereHas('kelas', function($q) {
            $q->where('id_mk_periode', $this->id_mk_periode);
        })->count();
    }

    // Get sisa slot
    public function getSisaSlotAttribute()
    {
        return $this->total_kuota - $this->jumlah_mahasiswa;
    }

    // Check apakah masih ada slot
    public function hasAvailableSlot()
    {
        return $this->sisa_slot > 0;
    }
}
