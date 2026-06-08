<?php

// app/Helpers/NimGenerator.php

namespace App\Helpers;

use App\Models\Mahasiswa;
use App\Models\Prodi;

class NimGenerator
{
    /**
     * Generate NIM dengan format:
     * YY + kode_prodi + urutan abjad (3 digit)
     *
     * YY = 2 digit terakhir tahun masuk
     * kode_prodi = kode program studi 2 digit
     * urutan = nomor urut alfabet mahasiswa pada prodi dan angkatan
     */
    public static function generate($kodeProdi, $tahunMasuk = null)
    {
        if (! $tahunMasuk) {
            $tahunMasuk = date('Y');
        }

        $prodi = Prodi::where('kode_prodi', $kodeProdi)->firstOrFail();

        $prefix = self::prefix($prodi->kode_prodi, $tahunMasuk);

        $lastMahasiswa = Mahasiswa::where('nim', 'like', $prefix.'%')
            ->orderBy('nim', 'desc')
            ->first();

        $urutanBaru = $lastMahasiswa
            ? ((int) substr($lastMahasiswa->nim, -3)) + 1
            : 1;

        $urutanNim = str_pad($urutanBaru, 3, '0', STR_PAD_LEFT);

        return $prefix.$urutanNim;
    }

    public static function generateFromSequence($kodeProdi, $tahunMasuk, int $sequence): string
    {
        Prodi::where('kode_prodi', $kodeProdi)->firstOrFail();

        return self::prefix($kodeProdi, $tahunMasuk)
            .str_pad($sequence, 3, '0', STR_PAD_LEFT);
    }

    public static function parse($nim)
    {
        if (strlen($nim) !== 7) {
            return null;
        }

        return [
            'tahun_masuk' => '20'.substr($nim, 0, 2),
            'kode_prodi' => substr($nim, 2, 2),
            'urutan' => substr($nim, 4, 3),
        ];
    }

    private static function prefix($kodeProdi, $tahunMasuk): string
    {
        $tahunNim = substr((string) $tahunMasuk, -2);
        $kodeProdiNim = str_pad(substr((string) $kodeProdi, -2), 2, '0', STR_PAD_LEFT);

        return $tahunNim.$kodeProdiNim;
    }
}
