<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RegistrasiSemester extends Model
{
    protected $table = 'registrasi_semester';
    protected $primaryKey = 'id_registrasi';

    protected $fillable = [
        'id_mahasiswa', 'tahun_ajaran', 'semester',
        'jenis_semester', 'status_semester',
        'tanggal_registrasi', 'keterangan'
    ];

    protected $casts = [
        'tanggal_registrasi' => 'date',
    ];

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'id_mahasiswa', 'id_mahasiswa');
    }
}
