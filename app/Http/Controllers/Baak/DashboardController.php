<?php

// app/Http/Controllers/Baak/DashboardController.php

namespace App\Http\Controllers\Baak;

use App\Http\Controllers\Controller;
use App\Models\DetailKrs;
use App\Models\Dosen;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\MataKuliah;
use App\Models\NilaiMahasiswa;
use App\Models\PeriodeRegistrasi;
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
        $mahasiswaDO = Mahasiswa::where('status', 'DO')->count();
        $mahasiswaKeluar = Mahasiswa::where('status', 'keluar')->count();

        $totalDosen = Dosen::count();
        $dosenAktif = $totalDosen;

        $totalMataKuliah = MataKuliah::where('is_active', 1)->count();

        $periodeAktif = PeriodeRegistrasi::getPeriodeTerakhir();

        // Total kelas pada periode terakhir. Kelas periode lama tetap tersimpan sebagai history.
        $totalKelas = Kelas::forPeriode($periodeAktif)->count();

        // ==========================================
        // CHART DATA
        // ==========================================

        // Chart 1: Mahasiswa per Prodi (Pie Chart)
        $mahasiswaPerProdi = Mahasiswa::select('kode_prodi', DB::raw('count(*) as total'))
            ->where('status', 'aktif')
            ->with('prodi:kode_prodi,nama_prodi')
            ->groupBy('kode_prodi')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->prodi->nama_prodi ?? 'Unknown',
                    'value' => $item->total,
                ];
            });

        // Chart 2: Mahasiswa per Tahun Masuk (Area Chart)
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
            ->map(function ($item) {
                return [
                    'angkatan' => $item->tahun_masuk,
                    'total' => $item->total,
                ];
            });

        // Chart 3: Rata-rata IPK per Prodi (Bar Chart)
        $rataIpkPerProdi = DB::table(DB::raw('(
            SELECT 
                m.kode_prodi,
                m.id_mahasiswa,
                SUM(
                    CASE nm.nilai_huruf
                        WHEN \'A\' THEN 4.00 WHEN \'A-\' THEN 3.75 WHEN \'B+\' THEN 3.50 WHEN \'B\' THEN 3.00 WHEN \'B-\' THEN 2.75
                        WHEN \'C+\' THEN 2.50 WHEN \'C\' THEN 2.00 WHEN \'D\' THEN 1.00 WHEN \'E\' THEN 0.00 ELSE 0.00
                    END * mk.sks
                ) / NULLIF(SUM(CASE WHEN nm.nilai_huruf NOT IN (\'-\', \'\') AND nm.nilai_huruf IS NOT NULL THEN mk.sks ELSE 0 END), 0) as ipk
            FROM mahasiswa m
            LEFT JOIN nilai_mahasiswa nm ON m.id_mahasiswa = nm.id_mahasiswa
            LEFT JOIN kelas k ON nm.id_kelas = k.id_kelas
            LEFT JOIN mata_kuliah_periode mkp ON k.id_mk_periode = mkp.id_mk_periode
            LEFT JOIN mata_kuliah mk ON mkp.kode_matkul = mk.kode_matkul
            WHERE m.status = \'aktif\'
            GROUP BY m.kode_prodi, m.id_mahasiswa
        ) as student_ipk'))
            ->join('prodi as p', 'student_ipk.kode_prodi', '=', 'p.kode_prodi')
            ->select(
                'p.nama_prodi as prodi',
                DB::raw('ROUND(COALESCE(AVG(student_ipk.ipk), 0), 2) as ipk'),
                DB::raw('COUNT(student_ipk.id_mahasiswa) as mahasiswa')
            )
            ->groupBy('p.kode_prodi', 'p.nama_prodi')
            ->orderBy('ipk', 'desc')
            ->get();

        // Chart 4: Distribusi Status Mahasiswa
        $distribusiStatus = Mahasiswa::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                $statusLabel = [
                    'aktif' => 'Aktif',
                    'lulus' => 'Lulus',
                    'keluar' => 'Keluar',
                    'do' => 'DO',
                    'cuti' => 'Cuti',
                ];

                $statusKey = strtolower($item->status);

                return [
                    'status' => $statusLabel[$statusKey] ?? ucfirst($item->status),
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
            $mahasiswaBelumKRS = max(0, $totalMahasiswaAktifSemua - $sudahKRS);
        }

        $nilaiBelumDiinput = 0;
        if ($periodeAktif) {
            $kelasList = Kelas::whereHas('mataKuliahPeriode', function ($q) use ($periodeAktif) {
                $q->where('tahun_ajaran', $periodeAktif->tahun_ajaran)
                    ->where('jenis_semester', $periodeAktif->jenis_semester);
            })->get();

            foreach ($kelasList as $kelas) {
                $totalMhs = DetailKrs::whereHas('krs', function ($q) use ($periodeAktif) {
                    $q->where('tahun_ajaran', $periodeAktif->tahun_ajaran)
                        ->where('status', 'approved');
                })
                    ->where('id_kelas', $kelas->id_kelas)
                    ->count();

                $nilaiCount = NilaiMahasiswa::where('id_kelas', $kelas->id_kelas)->count();
                $nilaiBelumDiinput += max(0, $totalMhs - $nilaiCount);
            }
        }

        $mahasiswaDOCount = Mahasiswa::where('status', 'DO')->count();

        // ==========================================
        // RECENT ACTIVITIES
        // ==========================================

        $recentKRS = Krs::with(['mahasiswa:id_mahasiswa,nim,nama'])
            ->where('status', 'approved')
            ->orderBy('updated_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($krs) {
                $namaMahasiswa = $krs->mahasiswa?->nama ?? 'Mahasiswa';
                $nimMahasiswa = $krs->mahasiswa?->nim ?? '-';

                return [
                    'type' => 'krs_approved',
                    'icon' => 'fa-check-circle',
                    'color' => 'green',
                    'message' => "KRS {$namaMahasiswa} ({$nimMahasiswa}) disetujui",
                    'time' => $krs->updated_at->diffForHumans(),
                    'timestamp' => $krs->updated_at->timestamp,
                ];
            });

        $recentNilai = NilaiMahasiswa::with([
            'mahasiswa:id_mahasiswa,nim,nama',
            'kelas.mataKuliahPeriode.mataKuliah:kode_matkul,nama_matkul',
        ])
            ->whereNotNull('nilai_akhir')
            ->orderBy('updated_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($nilai) {
                $mataKuliah = $nilai->kelas?->mataKuliahPeriode?->mataKuliah?->nama_matkul ?? 'Mata Kuliah';
                $namaMahasiswa = $nilai->mahasiswa?->nama ?? 'Mahasiswa';

                return [
                    'type' => 'nilai_input',
                    'icon' => 'fa-file-alt',
                    'color' => 'blue',
                    'message' => "Nilai {$mataKuliah} untuk {$namaMahasiswa} diinput",
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
                    'keluar' => $mahasiswaKeluar,
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
