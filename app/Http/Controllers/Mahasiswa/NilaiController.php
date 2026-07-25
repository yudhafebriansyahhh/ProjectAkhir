<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Krs;
use App\Models\NilaiMahasiswa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NilaiController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        if (! $user || ! $user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $mahasiswa = $user->mahasiswa;

        // Fetch all KRS for this student with details
        $krsList = Krs::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->with(['detailKrs.kelas.mataKuliahPeriode.mataKuliah'])
            ->orderBy('semester', 'asc')
            ->get();

        $semesters = [];
        $totalSksKumulatif = 0;
        $totalBobotKumulatif = 0;

        $bobotMap = [
            'A' => 4.00, 'A-' => 3.75, 'B+' => 3.50,
            'B' => 3.00, 'B-' => 2.75, 'C+' => 2.50,
            'C' => 2.00, 'D' => 1.00, 'E' => 0.00,
        ];

        foreach ($krsList as $krs) {
            if (strtolower($krs->status) !== 'approved') {
                continue; // Optionally only show approved semesters
            }

            $totalSksSemester = 0;
            $totalBobotSemester = 0;
            $mataKuliahArr = [];

            foreach ($krs->detailKrs as $detail) {
                if ($detail->kelas && $detail->kelas->mataKuliahPeriode && $detail->kelas->mataKuliahPeriode->mataKuliah) {
                    $mk = $detail->kelas->mataKuliahPeriode->mataKuliah;

                    $nilai = NilaiMahasiswa::where('id_mahasiswa', $krs->id_mahasiswa)
                        ->where('id_kelas', $detail->id_kelas)
                        ->first();

                    $nilaiHuruf = $nilai ? ($nilai->nilai_huruf ?: '-') : '-';
                    $bobot = $bobotMap[$nilaiHuruf] ?? 0;

                    if ($nilaiHuruf !== '-' && $nilaiHuruf !== null) {
                        if ($mk->sks) {
                            $totalBobotSemester += $bobot * $mk->sks;
                            $totalSksSemester += $mk->sks;

                            $totalBobotKumulatif += $bobot * $mk->sks;
                            $totalSksKumulatif += $mk->sks;
                        }
                    }

                    $mataKuliahArr[] = [
                        'nama' => $mk->nama_matkul,
                        'bobot' => $mk->sks,
                        'tugas' => $nilai ? floatval($nilai->nilai_tugas) : 0,
                        'uts' => $nilai ? floatval($nilai->nilai_uts) : 0,
                        'uas' => $nilai ? floatval($nilai->nilai_uas) : 0,
                        'total' => $nilai ? floatval($nilai->nilai_akhir) : 0,
                        'grade' => $nilaiHuruf,
                    ];
                }
            }

            $ipkSemester = $totalSksSemester > 0 ? number_format($totalBobotSemester / $totalSksSemester, 2) : '0.00';
            $ipkKumulatif = $totalSksKumulatif > 0 ? number_format($totalBobotKumulatif / $totalSksKumulatif, 2) : '0.00';

            if (count($mataKuliahArr) > 0) {
                $semesters[] = [
                    'id' => intval($krs->semester),
                    'ipkSemester' => $ipkSemester,
                    'ipkKumulatif' => $ipkKumulatif,
                    'totalSks' => $totalSksSemester,
                    'mata_kuliah' => $mataKuliahArr,
                ];
            }
        }

        return Inertia::render('Mahasiswa/Nilai', [
            'semesters' => $semesters,
        ]);
    }
}
