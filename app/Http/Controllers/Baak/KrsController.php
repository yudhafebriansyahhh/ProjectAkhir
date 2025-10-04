<?php

namespace App\Http\Controllers\Baak;

use App\Http\Controllers\Controller;
use App\Models\Krs;
use App\Models\Prodi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KrsController extends Controller
{
    public function index(Request $request)
    {
        $query = Krs::with([
            'mahasiswa.prodi.fakultas',
            'mahasiswa.dosenWali',
            'detailKrs'
        ]);

        // Filter by Tahun Ajaran
        if ($request->filled('tahun_ajaran')) {
            $query->where('tahun_ajaran', $request->tahun_ajaran);
        }

        // Filter by Prodi
        if ($request->filled('prodi')) {
            $query->whereHas('mahasiswa', function ($q) use ($request) {
                $q->where('kode_prodi', $request->prodi);
            });
        }

        // Filter by Semester
        if ($request->filled('semester')) {
            $query->where('semester', $request->semester);
        }

        // Filter by Status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search by NIM or Nama
        if ($request->filled('search')) {
            $query->whereHas('mahasiswa', function ($q) use ($request) {
                $q->where('nim', 'like', "%{$request->search}%")
                    ->orWhere('nama', 'like', "%{$request->search}%");
            });
        }

        $krs = $query->latest('tanggal_pengisian')
            ->paginate(15)
            ->withQueryString();

        // Calculate total SKS for each KRS
        $krs->getCollection()->transform(function ($item) {
            $totalSks = $item->detailKrs()
                ->join('kelas', 'detail_krs.id_kelas', '=', 'kelas.id_kelas')
                ->join('mata_kuliah_periode', 'kelas.id_mk_periode', '=', 'mata_kuliah_periode.id_mk_periode')
                ->join('mata_kuliah', 'mata_kuliah_periode.kode_matkul', '=', 'mata_kuliah.kode_matkul')
                ->sum('mata_kuliah.sks');

            $item->total_sks = $totalSks;
            return $item;
        });

        // Get statistics
        $stats = [
            'total' => Krs::count(),
            'pending' => Krs::where('status', 'pending')->count(),
            'approved' => Krs::where('status', 'approved')->count(),
            'rejected' => Krs::where('status', 'rejected')->count(),
        ];

        // Get unique tahun ajaran for filter
        $tahunAjaranList = Krs::select('tahun_ajaran')
            ->distinct()
            ->orderBy('tahun_ajaran', 'desc')
            ->pluck('tahun_ajaran');

        return Inertia::render('Baak/Krs/Index', [
            'krs' => $krs,
            'stats' => $stats,
            'prodis' => Prodi::orderBy('nama_prodi')->get(['kode_prodi', 'nama_prodi']),
            'tahunAjaranList' => $tahunAjaranList,
            'filters' => $request->only(['search', 'tahun_ajaran', 'prodi', 'semester', 'status']),
        ]);
    }

    public function show(Krs $krs)
    {
        $krs->load([
            'mahasiswa.prodi.fakultas',
            'mahasiswa.dosenWali',
            'detailKrs.kelas.mataKuliahPeriode.mataKuliah',
            'detailKrs.kelas.dosen'
        ]);

        // Calculate total SKS
        $totalSks = $krs->detailKrs->sum(function ($detail) {
            return $detail->kelas->mataKuliahPeriode->mataKuliah->sks ?? 0;
        });

        // Get mata kuliah details
        $mataKuliahList = $krs->detailKrs->map(function ($detail) {
            $mk = $detail->kelas->mataKuliahPeriode->mataKuliah;
            $kelas = $detail->kelas;

            return [
                'kode_matkul' => $mk->kode_matkul,
                'nama_matkul' => $mk->nama_matkul,
                'sks' => $mk->sks,
                'nama_kelas' => $kelas->nama_kelas,
                'dosen' => $kelas->dosen->nama ?? '-',
                'hari' => $kelas->hari,
                'jam_mulai' => $kelas->jam_mulai ? \Carbon\Carbon::parse($kelas->jam_mulai)->format('H:i') : '-',
                'jam_selesai' => $kelas->jam_selesai ? \Carbon\Carbon::parse($kelas->jam_selesai)->format('H:i') : '-',
                'ruang' => $kelas->ruang_kelas,
            ];
        });

        // Get all KRS from this student for semester dropdown
        $allKrsList = Krs::where('id_mahasiswa', $krs->id_mahasiswa)
            ->orderBy('semester', 'asc')
            ->get()
            ->map(function ($item) {
                // Calculate total SKS for each KRS
                $totalSks = $item->detailKrs()
                    ->join('kelas', 'detail_krs.id_kelas', '=', 'kelas.id_kelas')
                    ->join('mata_kuliah_periode', 'kelas.id_mk_periode', '=', 'mata_kuliah_periode.id_mk_periode')
                    ->join('mata_kuliah', 'mata_kuliah_periode.kode_matkul', '=', 'mata_kuliah.kode_matkul')
                    ->sum('mata_kuliah.sks');

                return [
                    'id_krs' => $item->id_krs,
                    'semester' => $item->semester,
                    'tahun_ajaran' => $item->tahun_ajaran,
                    'status' => $item->status,
                    'total_sks' => $totalSks,
                ];
            });

        return Inertia::render('Baak/Krs/Show', [
            'krs' => $krs,
            'totalSks' => $totalSks,
            'mataKuliahList' => $mataKuliahList,
            'allKrsList' => $allKrsList, // Data untuk dropdown semester
        ]);
    }
}
