<?php

namespace App\Traits;

use App\Models\PeriodeRegistrasi;
use App\Models\RegistrasiSemester;
use App\Models\Kelas;

trait MahasiswaHelper
{
    protected function getRegistrasiUlangInfo($mahasiswa): array
    {
        $periode = PeriodeRegistrasi::getPeriodeAktif();
        $riwayat = RegistrasiSemester::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->orderByDesc('semester')
            ->orderByDesc('id_registrasi')
            ->get()
            ->map(fn ($item) => [
                'id_registrasi' => $item->id_registrasi,
                'semester' => $item->semester,
                'tahun_ajaran' => $item->tahun_ajaran,
                'jenis_semester' => ucfirst($item->jenis_semester),
                'status_semester' => $item->status_semester,
                'tanggal_registrasi' => $item->tanggal_registrasi?->format('d M Y'),
                'keterangan' => $item->keterangan,
            ])
            ->values();

        if (! $periode) {
            return [
                'periode' => null,
                'registrasi' => null,
                'next_semester' => $this->getNextRegistrasiSemester($mahasiswa->id_mahasiswa),
                'can_register' => false,
                'message' => 'Belum ada periode registrasi ulang yang sedang dibuka.',
                'riwayat' => $riwayat,
            ];
        }

        $registrasi = RegistrasiSemester::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->where('tahun_ajaran', $periode->tahun_ajaran)
            ->where('jenis_semester', $periode->jenis_semester)
            ->latest('tanggal_registrasi')
            ->latest('id_registrasi')
            ->first();

        if ($registrasi) {
            return [
                'periode' => [
                    'tahun_ajaran' => $periode->tahun_ajaran,
                    'jenis_semester' => ucfirst($periode->jenis_semester),
                    'tanggal_mulai' => $periode->tanggal_mulai?->format('d M Y'),
                    'tanggal_selesai' => $periode->tanggal_selesai?->format('d M Y'),
                ],
                'registrasi' => [
                    'semester' => $registrasi->semester,
                    'status_semester' => $registrasi->status_semester,
                    'tanggal_registrasi' => $registrasi->tanggal_registrasi?->format('d M Y'),
                    'keterangan' => $registrasi->keterangan,
                ],
                'next_semester' => $registrasi->semester,
                'can_register' => false,
                'message' => 'Anda sudah melakukan registrasi ulang untuk periode ini.',
                'riwayat' => $riwayat,
            ];
        }

        return [
            'periode' => [
                'tahun_ajaran' => $periode->tahun_ajaran,
                'jenis_semester' => ucfirst($periode->jenis_semester),
                'tanggal_mulai' => $periode->tanggal_mulai?->format('d M Y'),
                'tanggal_selesai' => $periode->tanggal_selesai?->format('d M Y'),
            ],
            'registrasi' => null,
            'next_semester' => $this->getNextRegistrasiSemester($mahasiswa->id_mahasiswa),
            'can_register' => $mahasiswa->status === 'aktif',
            'message' => $mahasiswa->status === 'aktif'
                ? 'Silakan lakukan registrasi ulang untuk periode aktif.'
                : 'Registrasi ulang hanya tersedia untuk mahasiswa aktif.',
            'riwayat' => $riwayat,
        ];
    }

    protected function getNextRegistrasiSemester(int $idMahasiswa): int
    {
        $lastRegistrasi = RegistrasiSemester::where('id_mahasiswa', $idMahasiswa)
            ->orderByDesc('semester')
            ->first();

        return $lastRegistrasi ? ((int) $lastRegistrasi->semester + 1) : 1;
    }

    protected function kelasPadaPeriode(Kelas $kelas, ?PeriodeRegistrasi $periode): bool
    {
        $mkPeriode = $kelas->mataKuliahPeriode;

        return $periode
            && $mkPeriode
            && $mkPeriode->tahun_ajaran === $periode->tahun_ajaran
            && $mkPeriode->jenis_semester === $periode->jenis_semester;
    }
}
