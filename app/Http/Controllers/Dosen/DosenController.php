<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Kelas;
use App\Models\Pertemuan;
use App\Models\Dosen;
use App\Models\PeriodeRegistrasi;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class DosenController extends Controller
{
    public function dashboard()
    {
        $dosen = Auth::user()->dosen;

        if (!$dosen) {
            abort(403, 'Unauthorized action.');
        }

        // Get the active period
        $periodeAktif = PeriodeRegistrasi::getPeriodeAktif();
        $idPeriodeAktif = $periodeAktif ? $periodeAktif->id_periode : null;

        // 1. Get all classes taught by this lecturer in the active period
        $kelasList = Kelas::with(['mataKuliahPeriode.mataKuliah', 'mataKuliahPeriode.periode'])
            ->where('id_dosen', $dosen->id_dosen)
            ->when($idPeriodeAktif, function ($query) use ($idPeriodeAktif) {
                $query->whereHas('mataKuliahPeriode', function ($q) use ($idPeriodeAktif) {
                    $q->where('id_periode', $idPeriodeAktif);
                });
            })
            ->get();

        $idKelasArray = $kelasList->pluck('id_kelas')->toArray();

        // 2. Calculate Total Mahasiswa
        // Summing the count of detailKrs for each class
        $totalMahasiswa = Kelas::withCount('detailKrs')
            ->where('id_dosen', $dosen->id_dosen)
            ->when($idPeriodeAktif, function ($query) use ($idPeriodeAktif) {
                $query->whereHas('mataKuliahPeriode', function ($q) use ($idPeriodeAktif) {
                    $q->where('id_periode', $idPeriodeAktif);
                });
            })
            ->get()
            ->sum('detail_krs_count');

        // 3. Calculate Pertemuan Minggu Ini
        // Using Carbon to get the start and end of the current week
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();
        
        $pertemuanMingguIni = Pertemuan::whereIn('id_kelas', $idKelasArray)
            ->whereBetween('tanggal', [$startOfWeek, $endOfWeek])
            ->count();

        // 4. Jadwal Hari Ini
        // Get the current day name in Indonesian
        $hariIni = Carbon::now()->locale('id')->isoFormat('dddd');
        
        $jadwalHariIni = $kelasList->filter(function ($kelas) use ($hariIni) {
            return strtolower($kelas->hari) === strtolower($hariIni);
        })->map(function ($kelas) {
            return [
                'id_kelas' => $kelas->id_kelas,
                'mata_kuliah' => $kelas->mataKuliahPeriode->mataKuliah->nama_matkul ?? 'Unknown',
                'waktu' => Carbon::parse($kelas->jam_mulai)->format('H:i') . ' - ' . Carbon::parse($kelas->jam_selesai)->format('H:i'),
                'ruangan' => $kelas->ruang_kelas,
                'nama_kelas' => $kelas->nama_kelas,
            ];
        })->values();

        // 5. Daftar Kelas (Formatted for the table)
        $daftarKelas = $kelasList->map(function ($kelas) {
            return [
                'id_kelas' => $kelas->id_kelas,
                'mata_kuliah' => $kelas->mataKuliahPeriode->mataKuliah->nama_matkul ?? 'Unknown',
                'sks' => $kelas->mataKuliahPeriode->mataKuliah->sks ?? 0,
                'nama_kelas' => $kelas->nama_kelas,
                'hari' => $kelas->hari,
                'waktu' => Carbon::parse($kelas->jam_mulai)->format('H:i') . ' - ' . Carbon::parse($kelas->jam_selesai)->format('H:i'),
                'ruangan' => $kelas->ruang_kelas,
            ];
        });

        // 6. Grafik Nilai (Rata-rata per kelas)
        // We need to load nilais to calculate the average
        $kelasWithNilai = Kelas::with(['nilais', 'mataKuliahPeriode.mataKuliah'])
            ->where('id_dosen', $dosen->id_dosen)
            ->when($idPeriodeAktif, function ($query) use ($idPeriodeAktif) {
                $query->whereHas('mataKuliahPeriode', function ($q) use ($idPeriodeAktif) {
                    $q->where('id_periode', $idPeriodeAktif);
                });
            })
            ->get();
            
        $grafikNilaiLabels = [];
        $grafikNilaiData = [];

        foreach ($kelasWithNilai as $kelas) {
            $namaMatkul = $kelas->mataKuliahPeriode->mataKuliah->nama_matkul ?? 'Unknown';
            $label = $namaMatkul . ' (' . $kelas->nama_kelas . ')';
            
            $average = $kelas->nilais->avg('nilai_akhir') ?? 0;
            
            $grafikNilaiLabels[] = $label;
            $grafikNilaiData[] = round($average, 2);
        }

        return Inertia::render("Dosen/Index", [
            'dosen' => $dosen,
            'stats' => [
                'total_kelas' => $kelasList->count(),
                'total_mahasiswa' => $totalMahasiswa,
                'pertemuan_minggu_ini' => $pertemuanMingguIni,
            ],
            'daftar_kelas' => $daftarKelas,
            'jadwal_hari_ini' => $jadwalHariIni,
            'grafik_nilai' => [
                'labels' => $grafikNilaiLabels,
                'data' => $grafikNilaiData,
            ]
        ]);
    }
    public function nilai()
    {
        return Inertia::render("Dosen/Nilai/Index");
    }

    public function input_nilai()
    {
        return Inertia::render("Dosen/InputNilai");
    }

    public function edit_nilai()
    {
        return Inertia::render("Dosen/EditNilai");
    }
    public function rps()
    {
        return Inertia::render("Dosen/Rps");
    }
    public function tambah_rps()
    {
        return Inertia::render("Dosen/TambahRps");
    }
    public function edit_rps()
    {
        return Inertia::render("Dosen/EditRps");
    }
    public function absensi()
    {
        return Inertia::render("Dosen/Absensi");
    }
    public function jadwal()
    {
        return Inertia::render("Dosen/Jadwal");
    }
}
