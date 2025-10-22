<?php
// app/Http/Controllers/Baak/DashboardController.php

namespace App\Http\Controllers\Baak;

use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use App\Models\Dosen;
use App\Models\MataKuliah;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\NilaiMahasiswa;
use App\Models\PeriodeRegistrasi;
use App\Models\DetailKrs;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // ==========================================
        // STATISTIK CARDS
        // ==========================================

        $totalMahasiswa = Mahasiswa::count();
        $mahasiswaAktif = Mahasiswa::where('status', 'aktif')->count();
        $mahasiswaCuti = Mahasiswa::where('status', 'cuti')->count();
        $mahasiswaLulus = Mahasiswa::where('status', 'lulus')->count();
        $mahasiswaDO = Mahasiswa::whereIn('status', ['do', 'keluar'])->count();

        $totalDosen = Dosen::count();
        $dosenAktif = $totalDosen;

        $totalMataKuliah = MataKuliah::where('is_active', 1)->count();

        $periodeAktif = PeriodeRegistrasi::where('status', 'aktif')->first();

        // Total Kelas - SEMUA KELAS (tidak filter periode) 🔥
        $totalKelas = Kelas::count();

        // ==========================================
        // CHART DATA
        // ==========================================

        // Chart 1: Mahasiswa per Prodi (Pie Chart)
        $mahasiswaPerProdi = Mahasiswa::select('kode_prodi', DB::raw('count(*) as total'))
            ->where('status', 'aktif')
            ->with('prodi:kode_prodi,nama_prodi')
            ->groupBy('kode_prodi')
            ->get()
            ->map(function($item) {
                return [
                    'name' => $item->prodi->nama_prodi ?? 'Unknown',
                    'value' => $item->total,
                ];
            });

        // Chart 2: Mahasiswa per Tahun Masuk (Area Chart) - FIXED! 🔥
        $mahasiswaPerAngkatan = Mahasiswa::select(
                'tahun_masuk',
                DB::raw('count(*) as total')
            )
            ->where('status', 'aktif')
            ->whereNotNull('tahun_masuk')
            ->groupBy('tahun_masuk')
            ->orderBy('tahun_masuk', 'asc')
            ->limit(6)
            ->get()
            ->map(function($item) {
                return [
                    'angkatan' => $item->tahun_masuk,
                    'total' => $item->total,
                ];
            });

        // Chart 3: Rata-rata IPK per Prodi (Bar Chart) - FIXED! Pakai kolom 'semester' 🔥
        $rataIpkPerProdi = DB::table('mahasiswa as m')
            ->join('prodi as p', 'm.kode_prodi', '=', 'p.kode_prodi')
            ->leftJoin('riwayat_akademik as ra', function($join) {
                $join->on('m.id_mahasiswa', '=', 'ra.id_mahasiswa')
                     ->whereRaw('ra.id_riwayat = (
                         SELECT id_riwayat
                         FROM riwayat_akademik
                         WHERE id_mahasiswa = m.id_mahasiswa
                         ORDER BY semester DESC, created_at DESC
                         LIMIT 1
                     )');
            })
            ->where('m.status', 'aktif')
            ->select(
                'p.nama_prodi',
                DB::raw('COALESCE(AVG(ra.ipk), 0) as rata_ipk'),
                DB::raw('COUNT(DISTINCT m.id_mahasiswa) as total_mahasiswa')
            )
            ->groupBy('p.kode_prodi', 'p.nama_prodi')
            ->orderBy('rata_ipk', 'desc')
            ->get()
            ->map(function($item) {
                return [
                    'prodi' => $item->nama_prodi,
                    'ipk' => round($item->rata_ipk, 2),
                    'mahasiswa' => $item->total_mahasiswa,
                ];
            });

        // Chart 4: Distribusi Status Mahasiswa
        $distribusiStatus = Mahasiswa::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get()
            ->map(function($item) {
                $statusLabel = [
                    'aktif' => 'Aktif',
                    'lulus' => 'Lulus',
                    'keluar' => 'Keluar',
                    'do' => 'DO',
                    'cuti' => 'Cuti',
                ];
                return [
                    'status' => $statusLabel[$item->status] ?? ucfirst($item->status),
                    'total' => $item->total,
                ];
            });

        // ==========================================
        // ALERTS
        // ==========================================

        $krsPending = 0;
        if ($periodeAktif) {
            $krsPending = Krs::where('tahun_ajaran', $periodeAktif->tahun_ajaran)
                ->where('status', 'pending')
                ->count();
        }

        $mahasiswaBelumKRS = 0;
        if ($periodeAktif) {
            $totalMahasiswaAktifSemua = Mahasiswa::where('status', 'aktif')->count();
            $sudahKRS = Krs::where('tahun_ajaran', $periodeAktif->tahun_ajaran)
                ->distinct('id_mahasiswa')
                ->count('id_mahasiswa');
            $mahasiswaBelumKRS = $totalMahasiswaAktifSemua - $sudahKRS;
        }

        $nilaiBelumDiinput = 0;
        if ($periodeAktif) {
            $kelasList = Kelas::whereHas('mataKuliahPeriode', function($q) use ($periodeAktif) {
                $q->where('tahun_ajaran', $periodeAktif->tahun_ajaran)
                  ->where('jenis_semester', $periodeAktif->jenis_semester);
            })->get();

            foreach ($kelasList as $kelas) {
                $totalMhs = DetailKrs::whereHas('krs', function($q) use ($periodeAktif) {
                    $q->where('tahun_ajaran', $periodeAktif->tahun_ajaran)
                      ->where('status', 'approved');
                })
                ->where('id_kelas', $kelas->id_kelas)
                ->count();

                $nilaiCount = NilaiMahasiswa::where('id_kelas', $kelas->id_kelas)->count();
                $nilaiBelumDiinput += ($totalMhs - $nilaiCount);
            }
        }

        $mahasiswaDOCount = Mahasiswa::where('status', 'do')->count();

        // ==========================================
        // RECENT ACTIVITIES
        // ==========================================

        $recentKRS = Krs::with(['mahasiswa:id_mahasiswa,nim,nama'])
            ->where('status', 'approved')
            ->orderBy('updated_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function($krs) {
                return [
                    'type' => 'krs_approved',
                    'icon' => 'fa-check-circle',
                    'color' => 'green',
                    'message' => "KRS {$krs->mahasiswa->nama} ({$krs->mahasiswa->nim}) disetujui",
                    'time' => $krs->updated_at->diffForHumans(),
                    'timestamp' => $krs->updated_at->timestamp,
                ];
            });

        $recentNilai = NilaiMahasiswa::with([
                'mahasiswa:id_mahasiswa,nim,nama',
                'kelas.mataKuliahPeriode.mataKuliah:kode_matkul,nama_matkul'
            ])
            ->whereNotNull('nilai_akhir')
            ->orderBy('updated_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function($nilai) {
                $mataKuliah = $nilai->kelas->mataKuliahPeriode->mataKuliah->nama_matkul ?? 'Mata Kuliah';
                return [
                    'type' => 'nilai_input',
                    'icon' => 'fa-file-alt',
                    'color' => 'blue',
                    'message' => "Nilai {$mataKuliah} untuk {$nilai->mahasiswa->nama} diinput",
                    'time' => $nilai->updated_at->diffForHumans(),
                    'timestamp' => $nilai->updated_at->timestamp,
                ];
            });

        $recentActivities = $recentKRS->concat($recentNilai)
            ->sortByDesc('timestamp')
            ->take(10)
            ->values();

        // ==========================================
        // PERIODE INFO
        // ==========================================

        $periodeInfo = null;
        if ($periodeAktif) {
            $periodeInfo = [
                'tahun_ajaran' => $periodeAktif->tahun_ajaran,
                'jenis_semester' => ucfirst($periodeAktif->jenis_semester),
                'tanggal_mulai' => $periodeAktif->tanggal_mulai->format('Y-m-d'),
                'tanggal_selesai' => $periodeAktif->tanggal_selesai->format('Y-m-d'),
                'status' => $periodeAktif->status,
            ];
        }

        return Inertia::render('Baak/Dashboard', [
            'stats' => [
                'mahasiswa' => [
                    'total' => $totalMahasiswa,
                    'aktif' => $mahasiswaAktif,
                    'cuti' => $mahasiswaCuti,
                    'lulus' => $mahasiswaLulus,
                    'do' => $mahasiswaDO,
                    'keluar' => Mahasiswa::where('status', 'keluar')->count(),
                ],
                'dosen' => [
                    'total' => $totalDosen,
                    'aktif' => $dosenAktif,
                ],
                'mata_kuliah' => $totalMataKuliah,
                'kelas' => $totalKelas,
            ],
            'charts' => [
                'mahasiswa_per_prodi' => $mahasiswaPerProdi,
                'mahasiswa_per_angkatan' => $mahasiswaPerAngkatan,
                'rata_ipk_per_prodi' => $rataIpkPerProdi,
                'distribusi_status' => $distribusiStatus,
            ],
            'alerts' => [
                'krs_pending' => $krsPending,
                'belum_krs' => $mahasiswaBelumKRS,
                'nilai_kosong' => $nilaiBelumDiinput,
                'mahasiswa_do' => $mahasiswaDOCount,
            ],
            'recent_activities' => $recentActivities,
            'periode_aktif' => $periodeInfo,
        ]);
    }
}
