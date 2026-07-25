<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Krs;
use App\Models\PeriodeRegistrasi;
use App\Traits\MahasiswaHelper;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PenjadwalanController extends Controller
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
            ->with(['detailKrs.kelas.mataKuliahPeriode.mataKuliah', 'detailKrs.kelas.dosen', 'detailKrs.kelas.ruangan'])
            ->orderBy('semester', 'asc')
            ->get();

        $semesters = [];

        foreach ($krsList as $krs) {
            $jadwalArr = [];

            foreach ($krs->detailKrs as $detail) {
                if ($detail->kelas && $detail->kelas->mataKuliahPeriode && $detail->kelas->mataKuliahPeriode->mataKuliah) {
                    $kelas = $detail->kelas;
                    if (! $this->kelasPadaPeriode($kelas, $periodeTerakhir)) {
                        continue;
                    }

                    $mk = $kelas->mataKuliahPeriode->mataKuliah;

                    // Parse the time or use fallback
                    $jamMulai = $kelas->jam_mulai ? \Carbon\Carbon::parse($kelas->jam_mulai)->format('H:i') : '-';
                    $jamSelesai = $kelas->jam_selesai ? \Carbon\Carbon::parse($kelas->jam_selesai)->format('H:i') : '-';
                    $jadwalJam = ($jamMulai !== '-' && $jamSelesai !== '-') ? "{$jamMulai}-{$jamSelesai}" : '-';

                    $jadwalArr[] = [
                        'kode' => $mk->kode_matkul,
                        'nama' => $mk->nama_matkul,
                        'dosen' => $kelas->dosen ? $kelas->dosen->nama : 'Belum Ditentukan',
                        'hari' => $kelas->hari ?? '-',
                        'jam' => $jadwalJam,
                        'ruang' => $kelas->ruangan?->kode_ruangan ?? $kelas->ruang_kelas ?? '-',
                        'sks' => $mk->sks,
                        'kelas' => $kelas->nama_kelas,
                        'rps' => false,
                    ];
                }
            }

            // Create a label for the semester
            $jenisSemester = ($krs->semester % 2 == 0) ? 'Genap' : 'Ganjil';
            $semesterLabel = "Semester {$krs->semester} ({$jenisSemester} {$krs->tahun_ajaran})";

            if (count($jadwalArr) > 0) {
                $semesters[] = [
                    'id' => intval($krs->semester),
                    'label' => $semesterLabel,
                    'mata_kuliah' => $jadwalArr,
                ];
            }
        }

        return Inertia::render('Mahasiswa/Penjadwalan', [
            'semesters' => $semesters,
        ]);
    }
}
