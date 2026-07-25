<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Krs;
use App\Models\PeriodeRegistrasi;
use App\Traits\MahasiswaHelper;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AbsensiController extends Controller
{
    use MahasiswaHelper;

    public function index()
    {
        $user = auth()->user();
        if (! $user || ! $user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $mahasiswa = $user->mahasiswa;
        $periodeTerakhir = PeriodeRegistrasi::getPeriodeTerakhir();

        $krsList = Krs::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->where('status', 'approved')
            ->when($periodeTerakhir, function ($query) use ($periodeTerakhir) {
                $query->where('tahun_ajaran', $periodeTerakhir->tahun_ajaran)
                    ->whereHas('detailKrs.kelas.mataKuliahPeriode', function ($q) use ($periodeTerakhir) {
                        $q->where('tahun_ajaran', $periodeTerakhir->tahun_ajaran)
                            ->where('jenis_semester', $periodeTerakhir->jenis_semester);
                    });
            }, fn ($query) => $query->whereRaw('1 = 0'))
            ->orderBy('semester', 'asc')
            ->with([
                'detailKrs.kelas.mataKuliahPeriode.mataKuliah',
                'detailKrs.kelas.dosen',
                'detailKrs.kelas.pertemuans.absensis' => function ($query) use ($mahasiswa) {
                    $query->where('id_mahasiswa', $mahasiswa->id_mahasiswa);
                },
            ])
            ->get();

        $semesters = [];

        foreach ($krsList as $krs) {
            $mata_kuliah = [];

            foreach ($krs->detailKrs as $detail) {
                $kelas = $detail->kelas;
                if (! $kelas) {
                    continue;
                }

                $mkp = $kelas->mataKuliahPeriode;
                if (! $this->kelasPadaPeriode($kelas, $periodeTerakhir)) {
                    continue;
                }

                $mk = $mkp ? $mkp->mataKuliah : null;
                $dosen = $kelas->dosen;

                $pertemuans = $kelas->pertemuans;
                $total_pertemuan = $pertemuans->count();
                $hadir_count = 0;

                foreach ($pertemuans as $pertemuan) {
                    $absensi = $pertemuan->absensis->first();
                    if ($absensi && strtolower($absensi->status) === 'hadir') {
                        $hadir_count++;
                    }
                }

                $persen = $total_pertemuan > 0 ? round(($hadir_count / $total_pertemuan) * 100) : 0;

                if ($mk) {
                    $mata_kuliah[] = [
                        'nama' => $mk->nama_matkul,
                        'sks' => $mk->sks,
                        'kelas' => $kelas->nama_kelas,
                        'dosen' => $dosen ? $dosen->nama : 'Belum Ditentukan',
                        'persen' => $persen,
                    ];
                }
            }

            $semesters[] = [
                'id' => $krs->semester,
                'totalSks' => $krs->total_sks,
                'mata_kuliah' => $mata_kuliah,
            ];
        }

        return Inertia::render('Mahasiswa/Absensi', [
            'semesters' => $semesters,
        ]);
    }
}
