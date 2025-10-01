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
        'semester',
        'kode_prodi',
        'kategori',
        'is_active',
        'deskripsi',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Relasi ke Prodi
    public function prodi()
    {
        return $this->belongsTo(Prodi::class, 'kode_prodi', 'kode_prodi');
    }

    // Relasi ke Kelas
    public function kelas()
    {
        return $this->hasMany(Kelas::class, 'kode_matkul', 'kode_matkul');
    }

    // Relasi ke Detail KRS
    public function detailKrs()
    {
        return $this->hasMany(DetailKrs::class, 'kode_matkul', 'kode_matkul');
    }

    // Scope untuk filter mata kuliah aktif
    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }

    // Scope untuk filter by prodi (include mata kuliah umum)
    public function scopeForProdi($query, $kode_prodi)
    {
        return $query->where(function($q) use ($kode_prodi) {
            $q->where('kode_prodi', $kode_prodi)
              ->orWhereNull('kode_prodi'); // Mata kuliah umum
        });
    }

    // Scope untuk filter by semester
    public function scopeBySemester($query, $semester)
    {
        return $query->where('semester', $semester);
    }

    // Helper untuk cek apakah mata kuliah umum
    public function isUmum()
    {
        return is_null($this->kode_prodi);
    }

    // Helper untuk badge kategori
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
