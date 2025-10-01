<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NilaiMahasiswa extends Model
{
    use HasFactory;

    protected $table = 'nilai_mahasiswa';
    protected $primaryKey = 'id_nilai';

    protected $fillable = [
        'id_mahasiswa',
        'id_kelas',
        'nilai_tugas',
        'nilai_uts',
        'nilai_uas',
        'nilai_akhir',
        'nilai_huruf',
    ];

    protected $casts = [
        'nilai_tugas' => 'decimal:2',
        'nilai_uts' => 'decimal:2',
        'nilai_uas' => 'decimal:2',
        'nilai_akhir' => 'decimal:2',
    ];

    // ========================================
    // RELATIONSHIPS
    // ========================================

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'id_mahasiswa', 'id_mahasiswa');
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'id_kelas', 'id_kelas');
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    public function hitungNilaiAkhir()
    {
        $bobot = $this->kelas->bobotNilai;

        if (!$bobot) {
            return null;
        }

        $nilaiAkhir = (
            ($this->nilai_tugas * $bobot->bobot_tugas / 100) +
            ($this->nilai_uts * $bobot->bobot_uts / 100) +
            ($this->nilai_uas * $bobot->bobot_uas / 100)
        );

        $this->nilai_akhir = $nilaiAkhir;
        $this->nilai_huruf = $this->konversiNilaiHuruf($nilaiAkhir);
        $this->save();

        return $nilaiAkhir;
    }

    private function konversiNilaiHuruf($nilai)
    {
        if ($nilai >= 85) return 'A';
        if ($nilai >= 80) return 'A-';
        if ($nilai >= 75) return 'B+';
        if ($nilai >= 70) return 'B';
        if ($nilai >= 65) return 'B-';
        if ($nilai >= 60) return 'C+';
        if ($nilai >= 55) return 'C';
        if ($nilai >= 50) return 'D';
        return 'E';
    }
}
