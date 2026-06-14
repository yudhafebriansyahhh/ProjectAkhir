<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\PeriodeRegistrasi;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JadwalController extends Controller
{
    public function index()
    {
        $periodeTerakhir = PeriodeRegistrasi::getPeriodeTerakhir();

        // Ambil id dosen dari relasi user -> dosen
        $dosenId = Auth::user()->dosen->id_dosen ?? null;

        if (!$dosenId) {
            return Inertia::render('Dosen/Jadwal', [
                'jadwal' => [],
                'periode' => $this->formatPeriode($periodeTerakhir),
                'error' => 'Akun tidak memiliki data dosen yang terkait.'
            ]);
        }

        $jadwal = Kelas::with([
            'mataKuliahPeriode.mataKuliah',
            'mataKuliahPeriode.prodi',
            'dosen',
            'ruangan',
        ])
        ->where('id_dosen', $dosenId)
        ->forPeriode($periodeTerakhir)
        ->orderByRaw("FIELD(hari, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu')")
        ->orderBy('jam_mulai')
        ->get()
        ->map(function ($k) {
            return [
                'id_kelas' => $k->id_kelas,
                'kode'  => $k->mataKuliahPeriode->mataKuliah->kode_matkul ?? '-',
                'nama'  => $k->mataKuliahPeriode->mataKuliah->nama_matkul ?? '-',
                'kelas' => $k->nama_kelas,
                'hari'  => $k->hari,
                'jam'   => $this->formatJam($k),
                'ruang' => $k->ruangan?->kode_ruangan ?? $k->ruang_kelas ?? '-',
                'sks'   => $k->mataKuliahPeriode->mataKuliah->sks ?? '-',
                'periode' => $k->mataKuliahPeriode
                    ? $k->mataKuliahPeriode->tahun_ajaran . ' - ' . ucfirst($k->mataKuliahPeriode->jenis_semester)
                    : '-',
            ];
        });

        return Inertia::render('Dosen/Jadwal', [
            'jadwal' => $jadwal,
            'periode' => $this->formatPeriode($periodeTerakhir),
        ]);
    }

    private function formatPeriode(?PeriodeRegistrasi $periode): ?array
    {
        if (! $periode) {
            return null;
        }

        return [
            'tahun_ajaran' => $periode->tahun_ajaran,
            'jenis_semester' => ucfirst($periode->jenis_semester),
        ];
    }

    private function formatJam(Kelas $kelas): string
    {
        if (! $kelas->jam_mulai || ! $kelas->jam_selesai) {
            return '-';
        }

        return $kelas->jam_mulai->format('H:i') . ' - ' . $kelas->jam_selesai->format('H:i');
    }
}
