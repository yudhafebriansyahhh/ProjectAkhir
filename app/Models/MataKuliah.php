<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MataKuliah extends Model
{
    use HasFactory;

    protected $table = 'mata_kuliah';
    protected $primaryKey = 'kode_matkul';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'kode_matkul',
        'nama_matkul',
        'sks',
        'kode_prodi',
        'kategori',
        'is_active',
        'deskripsi',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function prodi()
    {
        return $this->belongsTo(Prodi::class, 'kode_prodi', 'kode_prodi');
    }

    public function kelas()
    {
        return $this->hasMany(Kelas::class, 'kode_matkul', 'kode_matkul');
    }

    public function periode()
    {
        return $this->hasMany(MataKuliahPeriode::class, 'kode_matkul', 'kode_matkul');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }

    public function scopeForProdi($query, $kode_prodi)
    {
        return $query->where(function($q) use ($kode_prodi) {
            $q->where('kode_prodi', $kode_prodi)
              ->orWhereNull('kode_prodi');
        });
    }

    public function isUmum()
    {
        return is_null($this->kode_prodi);
    }

    public function getKategoriBadge()
    {
        $badges = [
            'wajib' => 'bg-red-100 text-red-700',
            'pilihan' => 'bg-blue-100 text-blue-700',
            'umum' => 'bg-green-100 text-green-700',
        ];

        return $badges[$this->kategori] ?? 'bg-gray-100 text-gray-700';
    }
}
