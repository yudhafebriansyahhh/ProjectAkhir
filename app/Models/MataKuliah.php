<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MataKuliah extends Model
{
    use HasFactory;

    protected $table = 'mata_kuliah';
    protected $primaryKey = 'kode_matkul';
    public $incrementing = false; // karena primary key string

    protected $fillable = [
        'kode_matkul',
        'nama_matkul',
        'kode_prodi',
        'kategori',
        'sks',
        'is_active',
        'deskripsi'
    ];

    public function prodi()
    {
        return $this->belongsTo(Prodi::class, 'kode_prodi', 'kode_prodi');
    }

    public function periode()
    {
        return $this->hasMany(MataKuliahPeriode::class, 'kode_matkul', 'kode_matkul');
    }
}
