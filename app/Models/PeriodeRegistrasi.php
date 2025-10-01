<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PeriodeRegistrasi extends Model
{
    protected $table = 'periode_registrasi';
    protected $primaryKey = 'id_periode';

    protected $fillable = [
        'tahun_ajaran', 'jenis_semester',
        'tanggal_mulai', 'tanggal_selesai', 'status'
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
    ];

    public static function getPeriodeAktif()
    {
        return self::where('status', 'aktif')
            ->whereDate('tanggal_mulai', '<=', now())
            ->whereDate('tanggal_selesai', '>=', now())
            ->first();
    }
}
