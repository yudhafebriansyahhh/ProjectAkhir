<?php

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
        'tahun_ajaran',
        'jenis_semester',
        'semester_ditawarkan',
        'kuota',
        'is_available',
        'catatan',
    ];

    protected $casts = [
        'is_available' => 'boolean',
    ];

    public function mataKuliah()
    {
        return $this->belongsTo(MataKuliah::class, 'kode_matkul', 'kode_matkul');
    }

    public function kelas()
{
    return $this->hasMany(Kelas::class, 'id_mk_periode', 'id_mk_periode');
}

    public function isActive()
    {
        return $this->is_available;
    }

    public function getSemesterLabel()
    {
        return "Semester {$this->semester_ditawarkan}";
    }

    public function getPeriodeLabel()
    {
        return "{$this->tahun_ajaran} - " . ucfirst($this->jenis_semester);
    }
}
