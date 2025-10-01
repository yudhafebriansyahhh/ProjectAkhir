<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PeriodeRegistrasi extends Model
{
    protected $table = 'periode_registrasi';
    protected $primaryKey = 'id_periode';

    protected $fillable = [
        'tahun_ajaran',
        'jenis_semester',
        'tanggal_mulai',
        'tanggal_selesai',
        'status'
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
    ];

    // ========================================
    // RELATIONSHIPS
    // ========================================

    public function registrasiSemester()
    {
        return $this->hasMany(RegistrasiSemester::class, 'tahun_ajaran', 'tahun_ajaran')
            ->where('jenis_semester', $this->jenis_semester);
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    public static function getPeriodeAktif()
    {
        return self::where('status', 'aktif')
            ->whereDate('tanggal_mulai', '<=', now())
            ->whereDate('tanggal_selesai', '>=', now())
            ->first();
    }

    public function getDurasiAttribute()
    {
        return $this->tanggal_mulai->diffInDays($this->tanggal_selesai) + 1;
    }

    public function getIsAktifAttribute()
    {
        return $this->status === 'aktif';
    }

    public function getIsSelesaiAttribute()
    {
        return now()->isAfter($this->tanggal_selesai);
    }

    public function getIsBelumMulaiAttribute()
    {
        return now()->isBefore($this->tanggal_mulai);
    }

    public function getStatusLabelAttribute()
    {
        if ($this->is_aktif) {
            return 'Aktif';
        }

        if ($this->is_selesai) {
            return 'Selesai';
        }

        if ($this->is_belum_mulai) {
            return 'Belum Mulai';
        }

        return 'Tutup';
    }
}
