<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ruangan extends Model
{
    use HasFactory;

    protected $table = 'ruangan';
    protected $primaryKey = 'id_ruangan';

    protected $fillable = [
        'kode_ruangan',
        'nama_ruangan',
        'gedung',
        'lantai',
        'kapasitas',
        'keterangan',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function kelas()
    {
        return $this->hasMany(Kelas::class, 'id_ruangan', 'id_ruangan');
    }
}
