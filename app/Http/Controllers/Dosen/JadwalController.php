<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JadwalController extends Controller
{
    public function index()
    {
        // Ambil id dosen dari relasi user -> dosen
        $dosenId = Auth::user()->dosen->id_dosen ?? null;

        if (!$dosenId) {
            return Inertia::render('Dosen/Jadwal', [
                'jadwal' => [],
                'error' => 'Akun tidak memiliki data dosen yang terkait.'
            ]);
        }

        $jadwal = Kelas::with([
            'mataKuliahPeriode.mataKuliah',
            'dosen'
        ])
        ->where('id_dosen', $dosenId)
        ->get()
        ->map(function ($k) {
            return [
                'kode'  => $k->mataKuliahPeriode->mataKuliah->kode_matkul ?? '-',
                'nama'  => $k->mataKuliahPeriode->mataKuliah->nama_matkul ?? '-',
                'kelas' => $k->nama_kelas,
                'hari'  => $k->hari,
                'jam'   => $k->jam_mulai . ' - ' . $k->jam_selesai,
                'ruang' => $k->ruang_kelas,
                'sks'   => $k->mataKuliahPeriode->mataKuliah->sks ?? '-',
            ];
        });

        return Inertia::render('Dosen/Jadwal', [
            'jadwal' => $jadwal
        ]);
    }
}
