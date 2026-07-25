<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Krs;
use App\Models\NilaiMahasiswa;
use App\Traits\MahasiswaHelper;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    use MahasiswaHelper;

    public function index()
    {
        $user = auth()->user();
        if (! $user || ! $user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $mahasiswa = $user->mahasiswa;
        $registrasiUlang = $this->getRegistrasiUlangInfo($mahasiswa);

        // 1. Data IP & SKS dari Krs dan NilaiMahasiswa
        $krsList = Krs::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->with(['detailKrs.kelas.mataKuliahPeriode.mataKuliah'])
            ->orderBy('semester', 'asc')
            ->get();

        $ipData = [];
        $sksData = [];
        $totalSksKumulatif = 0;
        $totalBobotKumulatif = 0;

        $currentIpk = '0.00';

        foreach ($krsList as $krs) {
            $totalBobotSemester = 0;
            $totalSksSemester = 0;

            foreach ($krs->detailKrs as $detail) {
                if ($detail->kelas && $detail->kelas->mataKuliahPeriode && $detail->kelas->mataKuliahPeriode->mataKuliah) {
                    $mk = $detail->kelas->mataKuliahPeriode->mataKuliah;

                    $nilai = NilaiMahasiswa::where('id_mahasiswa', $krs->id_mahasiswa)
                        ->where('id_kelas', $detail->id_kelas)
                        ->first();

                    $nilaiHuruf = $nilai ? ($nilai->nilai_huruf ?: '-') : '-';
                    
                    if ($nilaiHuruf === '-' || $nilaiHuruf === null) {
                        continue;
                    }

                    $bobotMap = [
                        'A' => 4.00, 'A-' => 3.75, 'B+' => 3.50,
                        'B' => 3.00, 'B-' => 2.75, 'C+' => 2.50,
                        'C' => 2.00, 'D' => 1.00, 'E' => 0.00,
                    ];
                    $bobot = $bobotMap[$nilaiHuruf] ?? 0;

                    if ($mk->sks) {
                        $totalBobotSemester += $bobot * $mk->sks;
                        $totalSksSemester += $mk->sks;

                        $totalBobotKumulatif += $bobot * $mk->sks;
                        $totalSksKumulatif += $mk->sks;
                    }
                }
            }

            $ips = $totalSksSemester > 0 ? number_format($totalBobotSemester / $totalSksSemester, 2) : '0.00';
            $ipData[] = floatval($ips);
            $sksData[] = $totalSksSemester;
        }

        if ($totalSksKumulatif > 0) {
            $currentIpk = number_format($totalBobotKumulatif / $totalSksKumulatif, 2);
        }

        // 3. Data Absensi Semester Berjalan (terakhir approved)
        $latestKrs = Krs::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->where('status', 'approved')
            ->orderBy('semester', 'desc')
            ->with([
                'detailKrs.kelas.mataKuliahPeriode.mataKuliah',
                'detailKrs.kelas.pertemuans.absensis' => function ($query) use ($mahasiswa) {
                    $query->where('id_mahasiswa', $mahasiswa->id_mahasiswa);
                },
            ])
            ->first();

        $attendanceData = [];
        if ($latestKrs) {
            foreach ($latestKrs->detailKrs as $detail) {
                $kelas = $detail->kelas;
                if (! $kelas) {
                    continue;
                }

                $mkp = $kelas->mataKuliahPeriode;
                $mk = $mkp ? $mkp->mataKuliah : null;

                $pertemuans = $kelas->pertemuans;
                $total_pertemuan = $pertemuans->count();
                $hadir_count = 0;

                foreach ($pertemuans as $pertemuan) {
                    $absensi = $pertemuan->absensis->first();
                    if ($absensi && strtolower($absensi->status) === 'hadir') {
                        $hadir_count++;
                    }
                }

                $persentase = $total_pertemuan > 0 ? round(($hadir_count / $total_pertemuan) * 100) : 0;

                if ($mk) {
                    $attendanceData[] = [
                        'mataKuliah' => $mk->nama_matkul,
                        'sks' => $mk->sks,
                        'kelas' => $kelas->nama_kelas,
                        'persentase' => $persentase,
                    ];
                }
            }
        }

        $isProfileLengkap = $mahasiswa->alamat && $mahasiswa->no_hp && $mahasiswa->agama && $mahasiswa->nama_ayah && $mahasiswa->nama_ibu && $mahasiswa->no_telp_ayah && $mahasiswa->no_telp_ibu && $mahasiswa->foto;

        return Inertia::render('Mahasiswa/Dashboard', [
            'ipData' => $ipData,
            'sksData' => $sksData,
            'currentIpk' => $currentIpk,
            'attendanceData' => $attendanceData,
            'registrasiUlang' => $registrasiUlang,
            'isProfileLengkap' => (bool) $isProfileLengkap,
        ]);
    }
}
