<?php

namespace App\Traits;

use App\Models\Krs;
use App\Models\NilaiMahasiswa;
use Illuminate\Support\Facades\Auth;

trait DosenHelper
{
    protected function authorizeKrsWali(Krs $krs): void
    {
        $dosen = Auth::user()->dosen;

        if (!$dosen) {
            abort(403, 'Unauthorized action.');
        }

        $krs->loadMissing('mahasiswa');

        if (!$krs->mahasiswa || $krs->mahasiswa->id_dosen_wali !== $dosen->id_dosen) {
            abort(403, 'Anda tidak memiliki akses untuk KRS ini.');
        }
    }

    protected function getBobotNilai($nilaiHuruf): float
    {
        $bobotMap = [
            'A' => 4.00, 'A-' => 3.75, 'B+' => 3.50,
            'B' => 3.00, 'B-' => 2.75, 'C+' => 2.50,
            'C' => 2.00, 'D' => 1.00, 'E' => 0.00,
        ];

        return $bobotMap[$nilaiHuruf] ?? 0;
    }

    protected function hitungIPSFromCollection($mataKuliahCollection): string
    {
        $totalBobot = 0;
        $totalSks = 0;

        foreach ($mataKuliahCollection as $mataKuliah) {
            if (($mataKuliah['nilai'] ?? null) === '-' || ($mataKuliah['nilai'] ?? null) === null) {
                continue;
            }

            if ($mataKuliah['sks']) {
                $totalBobot += $mataKuliah['bobot'] * $mataKuliah['sks'];
                $totalSks += $mataKuliah['sks'];
            }
        }

        return $totalSks > 0 ? number_format($totalBobot / $totalSks, 2) : '0.00';
    }

    protected function hitungIPKSampaiSemester($idMahasiswa, $sampaiSemester): string
    {
        $krsIds = Krs::where('id_mahasiswa', $idMahasiswa)
            ->where('semester', '<=', $sampaiSemester)
            ->pluck('id_krs');

        $kelasIds = \DB::table('detail_krs')
            ->whereIn('id_krs', $krsIds)
            ->pluck('id_kelas');

        $nilai = NilaiMahasiswa::where('id_mahasiswa', $idMahasiswa)
            ->whereIn('id_kelas', $kelasIds)
            ->with('kelas.mataKuliahPeriode.mataKuliah')
            ->get();

        return $this->hitungIPK($nilai);
    }

    protected function hitungSKSKumulatif($idMahasiswa, $sampaiSemester): int
    {
        $krs = Krs::where('id_mahasiswa', $idMahasiswa)
            ->where('semester', '<=', $sampaiSemester)
            ->with('detailKrs.kelas.mataKuliahPeriode.mataKuliah')
            ->get();

        $totalSks = 0;
        foreach ($krs as $item) {
            foreach ($item->detailKrs as $detail) {
                $nilai = NilaiMahasiswa::where('id_kelas', $detail->id_kelas)
                    ->where('id_mahasiswa', $idMahasiswa)
                    ->first();

                if (!$nilai || $nilai->nilai_huruf === '-' || $nilai->nilai_huruf === null) {
                    continue;
                }

                $totalSks += $detail->kelas?->mataKuliahPeriode?->mataKuliah?->sks ?? 0;
            }
        }

        return $totalSks;
    }

    protected function getDistribusiNilai($mataKuliahCollection): array
    {
        $distribusi = ['A' => 0, 'B' => 0, 'C' => 0, 'D' => 0, 'E' => 0];

        foreach ($mataKuliahCollection as $mataKuliah) {
            $nilai = $mataKuliah['nilai'];
            if (in_array($nilai, ['A', 'A-'])) {
                $distribusi['A']++;
            } elseif (in_array($nilai, ['B+', 'B', 'B-'])) {
                $distribusi['B']++;
            } elseif (in_array($nilai, ['C+', 'C'])) {
                $distribusi['C']++;
            } elseif ($nilai === 'D') {
                $distribusi['D']++;
            } elseif ($nilai === 'E') {
                $distribusi['E']++;
            }
        }

        return $distribusi;
    }

    protected function hitungIPK($nilaiCollection): string
    {
        $totalBobot = 0;
        $totalSks = 0;

        foreach ($nilaiCollection as $nilai) {
            if ($nilai->nilai_huruf === '-' || $nilai->nilai_huruf === null) {
                continue;
            }

            $sks = $nilai->kelas?->mataKuliahPeriode?->mataKuliah?->sks ?? 0;
            $totalBobot += $this->getBobotNilai($nilai->nilai_huruf) * $sks;
            $totalSks += $sks;
        }

        return $totalSks > 0 ? number_format($totalBobot / $totalSks, 2) : '0.00';
    }

    protected function getPredikat($ipk): string
    {
        $ipkNum = floatval($ipk);
        if ($ipkNum >= 3.75) return 'Summa Cum Laude';
        if ($ipkNum >= 3.50) return 'Magna Cum Laude';
        if ($ipkNum >= 3.25) return 'Cum Laude';
        if ($ipkNum >= 3.00) return 'Sangat Memuaskan';
        if ($ipkNum >= 2.75) return 'Memuaskan';

        return 'Cukup';
    }

    protected function getStatistikNilaiLengkap($nilaiCollection): array
    {
        $stats = [];
        $gradeList = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'E'];
        $totalSks = $nilaiCollection->sum(fn ($nilai) => $nilai->kelas?->mataKuliahPeriode?->mataKuliah?->sks ?? 0);

        foreach ($gradeList as $grade) {
            $sks = $nilaiCollection->filter(fn ($nilai) => $nilai->nilai_huruf === $grade)
                ->sum(fn ($nilai) => $nilai->kelas?->mataKuliahPeriode?->mataKuliah?->sks ?? 0);

            $stats[] = [
                'nilai' => $grade,
                'sks' => $sks,
                'persentase' => $totalSks > 0 ? number_format(($sks / $totalSks) * 100, 4) : '0.0000',
            ];
        }

        return $stats;
    }
}
