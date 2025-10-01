<?php
// app/Helpers/NimGenerator.php

namespace App\Helpers;

use App\Models\Mahasiswa;
use App\Models\Prodi;

class NimGenerator
{
    public static function generate($kodeProdi, $tahunMasuk = null)
    {
        $prodi = Prodi::with('fakultas')->findOrFail($kodeProdi);

        if (!$tahunMasuk) {
            $tahunMasuk = date('Y');
        }

        $tahunNim = substr($tahunMasuk, -2);
        $kodeProdiNim = $prodi->kode_prodi;
        $kodeFakultas = $prodi->kode_fakultas;

        $prefix = $tahunNim . $kodeProdiNim . $kodeFakultas;

        $lastMahasiswa = Mahasiswa::where('nim', 'like', $prefix . '%')
            ->orderBy('nim', 'desc')
            ->first();

        $urutanBaru = $lastMahasiswa
            ? ((int) substr($lastMahasiswa->nim, -3)) + 1
            : 1;

        $urutanNim = str_pad($urutanBaru, 3, '0', STR_PAD_LEFT);

        return $prefix . $urutanNim;
    }

    public static function parse($nim)
    {
        if (strlen($nim) !== 10) {
            return null;
        }

        return [
            'tahun_masuk' => '20' . substr($nim, 0, 2),
            'kode_prodi' => substr($nim, 2, 2),
            'kode_fakultas' => substr($nim, 4, 3),
            'urutan' => substr($nim, 7, 3),
        ];
    }
}
