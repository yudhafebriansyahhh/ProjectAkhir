<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prodi extends Model
{
    use HasFactory;

    protected $table = 'prodi';

    protected $primaryKey = 'kode_prodi';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'kode_prodi',
        'nama_prodi',
        'jenjang',
    ];

    // Relasi ke Mahasiswa
    public function mahasiswa()
    {
        return $this->hasMany(Mahasiswa::class, 'kode_prodi', 'kode_prodi');
    }

    // Relasi ke Dosen (jika ada)
    public function dosen()
    {
        return $this->hasMany(Dosen::class, 'kode_prodi', 'kode_prodi');
    }
}
