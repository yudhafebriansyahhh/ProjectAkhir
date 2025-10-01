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
    ];

    // ========================================
    // RELATIONSHIPS
    // ========================================

    public function kelas()
    {
        return $this->hasMany(Kelas::class, 'kode_matkul', 'kode_matkul');
    }

    public function rps()
    {
        return $this->hasOne(Rps::class, 'kode_matkul', 'kode_matkul');
    }
}
