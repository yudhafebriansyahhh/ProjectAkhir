<?php

namespace App\Http\Controllers\Baak;

use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use App\Models\Prodi;
use App\Models\NilaiMahasiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\MahasiswaExport;
use App\Exports\KelulusanExport;
use App\Exports\IpkExport;
use Barryvdh\DomPDF\Facade\Pdf;

class LaporanController extends Controller
{
    public function index(Request $request)
    {
        $tab = $request->query('tab', 'mahasiswa');
        
        $prodi = Prodi::select('kode_prodi', 'nama_prodi')->get();
        $tahunAngkatan = Mahasiswa::selectRaw('DISTINCT tahun_masuk')
            ->whereNotNull('tahun_masuk')
            ->orderBy('tahun_masuk', 'desc')
            ->pluck('tahun_masuk');

        return Inertia::render('Baak/Laporan/Index', [
            'tab' => $tab,
            'prodi' => $prodi,
            'tahunAngkatan' => $tahunAngkatan,
        ]);
    }

    // ==========================================
    // LAPORAN MAHASISWA
    // ==========================================
    
    public function laporanMahasiswa(Request $request)
    {
        $query = Mahasiswa::with('prodi:kode_prodi,nama_prodi');

        if ($request->filled('kode_prodi')) {
            $query->where('kode_prodi', $request->kode_prodi);
        }

        if ($request->filled('tahun_masuk')) {
            $query->where('tahun_masuk', $request->tahun_masuk);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $mahasiswa = $query->orderBy('nim', 'asc')->paginate(50);

        // Hitung semester_ke dari registrasi_semester
        $mahasiswa->getCollection()->transform(function ($mhs) {
            $semesterCount = DB::table('registrasi_semester')
                ->where('id_mahasiswa', $mhs->id_mahasiswa)
                ->count();
            
            $mhs->semester_ke = $semesterCount > 0 ? $semesterCount : null;
            return $mhs;
        });

        // Statistik
        $baseQuery = Mahasiswa::query();
        
        if ($request->filled('kode_prodi')) {
            $baseQuery->where('kode_prodi', $request->kode_prodi);
        }

        if ($request->filled('tahun_masuk')) {
            $baseQuery->where('tahun_masuk', $request->tahun_masuk);
        }

        if ($request->filled('status')) {
            $baseQuery->where('status', $request->status);
        }

        $statistik = [
            'total' => (clone $baseQuery)->count(),
            'aktif' => (clone $baseQuery)->where('status', 'aktif')->count(),
            'lulus' => (clone $baseQuery)->where('status', 'lulus')->count(),
            'cuti' => (clone $baseQuery)->where('status', 'cuti')->count(),
            'do' => (clone $baseQuery)->whereIn('status', ['do', 'keluar'])->count(),
        ];

        return response()->json([
            'mahasiswa' => $mahasiswa,
            'statistik' => $statistik,
        ]);
    }

    // ==========================================
    // LAPORAN KELULUSAN
    // ==========================================
    
    public function laporanKelulusan(Request $request)
    {
        $query = Mahasiswa::with(['prodi:kode_prodi,nama_prodi'])
            ->where('status', 'lulus');

        if ($request->filled('kode_prodi')) {
            $query->where('kode_prodi', $request->kode_prodi);
        }

        if ($request->filled('tahun_lulus')) {
            $query->whereYear('updated_at', $request->tahun_lulus);
        }

        $lulusan = $query->orderBy('updated_at', 'desc')->paginate(50);

        // Tambahkan data semester dan IPK untuk setiap lulusan
        $lulusan->getCollection()->transform(function ($mhs) {
            $semesterCount = DB::table('registrasi_semester')
                ->where('id_mahasiswa', $mhs->id_mahasiswa)
                ->count();
            
            $mhs->semester_ke = $semesterCount > 0 ? $semesterCount : null;
            $mhs->ipk = $this->hitungIPK($mhs->id_mahasiswa);
            return $mhs;
        });

        // Statistik per Prodi dengan IPK dari NilaiMahasiswa
        $statistikProdi = Prodi::all()
            ->map(function($prodi) use ($request) {
                $queryLulusan = Mahasiswa::where('kode_prodi', $prodi->kode_prodi)
                    ->where('status', 'lulus');

                if ($request->filled('tahun_lulus')) {
                    $queryLulusan->whereYear('updated_at', $request->tahun_lulus);
                }

                $lulusan = $queryLulusan->get();
                $totalLulusan = $lulusan->count();

                if ($totalLulusan === 0) {
                    return null;
                }
                
                // Hitung rata-rata IPK dari NilaiMahasiswa
                $totalIpk = 0;
                $countIpk = 0;
                $totalSemester = 0;
                
                foreach ($lulusan as $mhs) {
                    $ipk = $this->hitungIPK($mhs->id_mahasiswa);
                    if ($ipk > 0) {
                        $totalIpk += $ipk;
                        $countIpk++;
                    }

                    // Hitung lama studi dari jumlah semester
                    $semesterCount = DB::table('registrasi_semester')
                        ->where('id_mahasiswa', $mhs->id_mahasiswa)
                        ->count();
                    
                    if ($semesterCount > 0) {
                        $totalSemester += $semesterCount;
                    }
                }
                
                $rataIpk = $countIpk > 0 ? $totalIpk / $countIpk : 0;
                $rataLamaStudi = $totalLulusan > 0 ? ($totalSemester / $totalLulusan) / 2 : 0; // Dibagi 2 karena 1 tahun = 2 semester

                return [
                    'prodi' => $prodi->nama_prodi,
                    'total' => $totalLulusan,
                    'ipk' => round($rataIpk, 2),
                    'lama_studi' => round($rataLamaStudi, 1) . ' tahun',
                ];
            })
            ->filter(fn($item) => $item !== null);

        return response()->json([
            'lulusan' => $lulusan,
            'statistikProdi' => $statistikProdi->values(),
        ]);
    }

    // ==========================================
    // LAPORAN DO/KELUAR
    // ==========================================
    
    public function laporanDO(Request $request)
    {
        $query = Mahasiswa::with('prodi:kode_prodi,nama_prodi')
            ->whereIn('status', ['do', 'keluar']);

        if ($request->filled('kode_prodi')) {
            $query->where('kode_prodi', $request->kode_prodi);
        }

        if ($request->filled('tahun')) {
            $query->whereYear('updated_at', $request->tahun);
        }

        $mahasiswaDO = $query->orderBy('updated_at', 'desc')->paginate(50);

        // Hitung semester_ke
        $mahasiswaDO->getCollection()->transform(function ($mhs) {
            $semesterCount = DB::table('registrasi_semester')
                ->where('id_mahasiswa', $mhs->id_mahasiswa)
                ->count();
            
            $mhs->semester_ke = $semesterCount > 0 ? $semesterCount : null;
            return $mhs;
        });

        // Distribusi per Semester
        $baseQuerySemester = Mahasiswa::whereIn('status', ['do', 'keluar']);
        
        if ($request->filled('kode_prodi')) {
            $baseQuerySemester->where('kode_prodi', $request->kode_prodi);
        }

        if ($request->filled('tahun')) {
            $baseQuerySemester->whereYear('updated_at', $request->tahun);
        }

        $mahasiswaDOForStats = $baseQuerySemester->get();
        
        $distribusiSemester = collect();
        foreach ($mahasiswaDOForStats as $mhs) {
            $semesterCount = DB::table('registrasi_semester')
                ->where('id_mahasiswa', $mhs->id_mahasiswa)
                ->count();
            
            if ($semesterCount > 0) {
                $distribusiSemester->push($semesterCount);
            }
        }

        $distribusiSemester = $distribusiSemester
            ->groupBy(fn($item) => $item)
            ->map(fn($group, $semester) => [
                'semester' => 'Semester ' . $semester,
                'total' => $group->count(),
            ])
            ->sortBy(fn($item) => (int) str_replace('Semester ', '', $item['semester']))
            ->values();

        // Distribusi per Status
        $baseQueryStatus = Mahasiswa::whereIn('status', ['do', 'keluar']);
        
        if ($request->filled('kode_prodi')) {
            $baseQueryStatus->where('kode_prodi', $request->kode_prodi);
        }

        if ($request->filled('tahun')) {
            $baseQueryStatus->whereYear('updated_at', $request->tahun);
        }

        $distribusiStatus = $baseQueryStatus
            ->select('status', DB::raw('COUNT(*) as total'))
            ->groupBy('status')
            ->get()
            ->map(fn($item) => [
                'status' => $item->status === 'do' ? 'DO' : 'Keluar',
                'total' => $item->total,
            ]);

        return response()->json([
            'mahasiswaDO' => $mahasiswaDO,
            'distribusiSemester' => $distribusiSemester,
            'distribusiStatus' => $distribusiStatus,
        ]);
    }

    // ==========================================
    // LAPORAN IPK
    // ==========================================
    
    public function laporanIpk(Request $request)
    {
        // Distribusi IPK per Prodi
        $distribusiIpk = Prodi::select('prodi.kode_prodi', 'prodi.nama_prodi')
            ->leftJoin('mahasiswa as m', 'm.kode_prodi', '=', 'prodi.kode_prodi')
            ->where('m.status', 'aktif')
            ->when($request->filled('kode_prodi'), function($q) use ($request) {
                $q->where('prodi.kode_prodi', $request->kode_prodi);
            })
            ->groupBy('prodi.kode_prodi', 'prodi.nama_prodi')
            ->get()
            ->map(function($prodi) {
                $mahasiswa = Mahasiswa::where('kode_prodi', $prodi->kode_prodi)
                    ->where('status', 'aktif')
                    ->get();

                $distribusi = [
                    'cumlaude' => 0,
                    'sangat_memuaskan' => 0,
                    'memuaskan' => 0,
                    'cukup' => 0,
                    'kurang' => 0,
                ];

                foreach ($mahasiswa as $mhs) {
                    $ipk = $this->hitungIPK($mhs->id_mahasiswa);
                    
                    if ($ipk >= 3.51) {
                        $distribusi['cumlaude']++;
                    } elseif ($ipk >= 3.01) {
                        $distribusi['sangat_memuaskan']++;
                    } elseif ($ipk >= 2.76) {
                        $distribusi['memuaskan']++;
                    } elseif ($ipk >= 2.00) {
                        $distribusi['cukup']++;
                    } else {
                        $distribusi['kurang']++;
                    }
                }

                return array_merge(['nama_prodi' => $prodi->nama_prodi], $distribusi);
            })
            ->filter(fn($item) => 
                $item['cumlaude'] + $item['sangat_memuaskan'] + 
                $item['memuaskan'] + $item['cukup'] + $item['kurang'] > 0
            );

        // Top 10 Mahasiswa IPK Tertinggi
        $mahasiswaAktif = Mahasiswa::with('prodi:kode_prodi,nama_prodi')
            ->where('status', 'aktif')
            ->when($request->filled('kode_prodi'), function($q) use ($request) {
                $q->where('kode_prodi', $request->kode_prodi);
            })
            ->get();

        $topMahasiswa = $mahasiswaAktif
            ->map(function($mhs) {
                $ipk = $this->hitungIPK($mhs->id_mahasiswa);
                $semesterCount = DB::table('registrasi_semester')
                    ->where('id_mahasiswa', $mhs->id_mahasiswa)
                    ->count();

                return [
                    'nim' => $mhs->nim,
                    'nama' => $mhs->nama,
                    'prodi' => $mhs->prodi->nama_prodi ?? '-',
                    'semester' => $semesterCount > 0 ? $semesterCount : null,
                    'ipk' => $ipk,
                ];
            })
            ->filter(fn($item) => $item['ipk'] > 0)
            ->sortByDesc('ipk')
            ->take(10)
            ->values()
            ->map(function($item, $index) {
                return array_merge(['rank' => $index + 1], $item);
            });

        return response()->json([
            'distribusiIpk' => $distribusiIpk->values(),
            'topMahasiswa' => $topMahasiswa,
        ]);
    }

    // ==========================================
    // HELPER METHOD
    // ==========================================

    private function hitungIPK($idMahasiswa)
    {
        $nilai = NilaiMahasiswa::where('id_mahasiswa', $idMahasiswa)
            ->with('kelas.mataKuliahPeriode.mataKuliah')
            ->get();

        if ($nilai->isEmpty()) {
            return 0;
        }

        $totalBobot = 0;
        $totalSks = 0;

        foreach ($nilai as $n) {
            $bobot = $this->getBobotNilai($n->nilai_huruf);
            $sks = $n->kelas->mataKuliahPeriode->mataKuliah->sks;
            $totalBobot += $bobot * $sks;
            $totalSks += $sks;
        }

        return $totalSks > 0 ? round($totalBobot / $totalSks, 2) : 0;
    }

    private function getBobotNilai($nilaiHuruf)
    {
        $bobotMap = [
            'A' => 4.00, 'A-' => 3.75, 'B+' => 3.50,
            'B' => 3.00, 'B-' => 2.75, 'C+' => 2.50,
            'C' => 2.00, 'D' => 1.00, 'E' => 0.00,
        ];
        return $bobotMap[$nilaiHuruf] ?? 0;
    }

    // ==========================================
    // EXPORT EXCEL
    // ==========================================
    
    public function exportMahasiswaExcel(Request $request)
    {
        return Excel::download(
            new MahasiswaExport($request->all()), 
            'laporan-mahasiswa-' . date('Y-m-d') . '.xlsx'
        );
    }

    public function exportKelulusanExcel(Request $request)
    {
        return Excel::download(
            new KelulusanExport($request->all()), 
            'laporan-kelulusan-' . date('Y-m-d') . '.xlsx'
        );
    }

    public function exportIpkExcel(Request $request)
    {
        return Excel::download(
            new IpkExport($request->all()), 
            'laporan-ipk-' . date('Y-m-d') . '.xlsx'
        );
    }

    // ==========================================
    // EXPORT PDF
    // ==========================================
    
    public function exportMahasiswaPdf(Request $request)
    {
        $query = Mahasiswa::with('prodi:kode_prodi,nama_prodi');

        if ($request->filled('kode_prodi')) {
            $query->where('kode_prodi', $request->kode_prodi);
        }

        if ($request->filled('tahun_masuk')) {
            $query->where('tahun_masuk', $request->tahun_masuk);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $mahasiswa = $query->orderBy('nim', 'asc')->get();

        $pdf = Pdf::loadView('pdf.laporan-mahasiswa', [
            'mahasiswa' => $mahasiswa,
            'tanggal' => date('d F Y'),
        ]);

        return $pdf->download('laporan-mahasiswa-' . date('Y-m-d') . '.pdf');
    }

    public function exportKelulusanPdf(Request $request)
    {
        $query = Mahasiswa::with('prodi:kode_prodi,nama_prodi')
            ->where('status', 'lulus');

        if ($request->filled('kode_prodi')) {
            $query->where('kode_prodi', $request->kode_prodi);
        }

        if ($request->filled('tahun_lulus')) {
            $query->whereYear('updated_at', $request->tahun_lulus);
        }

        $lulusan = $query->orderBy('updated_at', 'desc')->get();

        // Tambahkan IPK untuk setiap lulusan
        $lulusan->transform(function ($mhs) {
            $mhs->ipk = $this->hitungIPK($mhs->id_mahasiswa);
            $semesterCount = DB::table('registrasi_semester')
                ->where('id_mahasiswa', $mhs->id_mahasiswa)
                ->count();
            $mhs->lama_studi = $semesterCount > 0 ? round($semesterCount / 2, 1) . ' tahun' : '-';
            return $mhs;
        });

        $pdf = Pdf::loadView('pdf.laporan-kelulusan', [
            'lulusan' => $lulusan,
            'tanggal' => date('d F Y'),
        ]);

        return $pdf->download('laporan-kelulusan-' . date('Y-m-d') . '.pdf');
    }

    public function exportIpkPdf(Request $request)
    {
        $mahasiswaAktif = Mahasiswa::with('prodi:kode_prodi,nama_prodi')
            ->where('status', 'aktif')
            ->get();

        $topMahasiswa = $mahasiswaAktif
            ->map(function($mhs) {
                $ipk = $this->hitungIPK($mhs->id_mahasiswa);
                $semesterCount = DB::table('registrasi_semester')
                    ->where('id_mahasiswa', $mhs->id_mahasiswa)
                    ->count();

                return [
                    'nim' => $mhs->nim,
                    'nama' => $mhs->nama,
                    'nama_prodi' => $mhs->prodi->nama_prodi ?? '-',
                    'semester_ke' => $semesterCount > 0 ? $semesterCount : null,
                    'ipk' => $ipk,
                ];
            })
            ->filter(fn($item) => $item['ipk'] > 0)
            ->sortByDesc('ipk')
            ->take(10);

        $pdf = Pdf::loadView('pdf.laporan-ipk', [
            'mahasiswa' => $topMahasiswa,
            'tanggal' => date('d F Y'),
        ]);

        return $pdf->download('laporan-ipk-' . date('Y-m-d') . '.pdf');
    }
}