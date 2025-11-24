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
        'id_periode',
        'semester'
    ];

    // RELASI KE MATA KULIAH (WAJIB ADA!)
    public function mataKuliah()
    {
        return $this->belongsTo(MataKuliah::class, 'kode_matkul', 'kode_matkul');
    }

    // RELASI KE KELAS
    public function kelas()
    {
        return $this->hasMany(Kelas::class, 'id_mk_periode', 'id_mk_periode');
    }

    // RELASI KE PERIODE
    public function periode()
    {
        return $this->belongsTo(Periode::class, 'id_periode', 'id_periode');
    }
}
