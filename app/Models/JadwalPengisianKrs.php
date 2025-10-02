<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JadwalPengisianKrs extends Model
{
    use HasFactory;

    protected $table = 'jadwal_pengisian_krs';
    protected $primaryKey = 'id_jadwal';

    protected $fillable = [
        'kode_prodi',
        'semester_list',
        'tahun_ajaran',
        'tanggal_mulai',
        'tanggal_selesai',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'semester_list' => 'array', // Cast ke array
    ];

    // Relationships
    public function prodi()
    {
        return $this->belongsTo(Prodi::class, 'kode_prodi', 'kode_prodi');
    }

    // Helper method untuk format semester
    public function getSemesterDisplayAttribute()
    {
        if (empty($this->semester_list)) {
            return '-';
        }

        $semesters = $this->semester_list;
        sort($semesters);

        if (count($semesters) === 1) {
            return 'Semester ' . $semesters[0];
        }

        return 'Semester ' . implode(', ', $semesters);
    }
}
