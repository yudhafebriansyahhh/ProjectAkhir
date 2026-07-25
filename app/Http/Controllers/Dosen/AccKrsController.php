<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Krs;
use App\Models\PeriodeRegistrasi;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Traits\DosenHelper;

class AccKrsController extends Controller
{
    use DosenHelper;

    public function index(Request $request)
    {
        $dosen = Auth::user()->dosen;

        if (!$dosen) {
            abort(403, 'Unauthorized action.');
        }

        $periodeTerakhir = PeriodeRegistrasi::getPeriodeTerakhir();

        $query = Krs::with(['mahasiswa.prodi', 'detailKrs'])
            ->whereHas('mahasiswa', function ($q) use ($dosen) {
                $q->where('id_dosen_wali', $dosen->id_dosen);
            });

        if ($periodeTerakhir) {
            $query->where('tahun_ajaran', $periodeTerakhir->tahun_ajaran)
                ->whereHas('detailKrs.kelas.mataKuliahPeriode', function ($q) use ($periodeTerakhir) {
                    $q->where('tahun_ajaran', $periodeTerakhir->tahun_ajaran)
                        ->where('jenis_semester', $periodeTerakhir->jenis_semester);
                });
        } else {
            $query->whereRaw('1 = 0');
        }

        if ($request->filled('search')) {
            $query->whereHas('mahasiswa', function ($q) use ($request) {
                $q->where('nim', 'like', "%{$request->search}%")
                    ->orWhere('nama', 'like', "%{$request->search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('semester')) {
            $query->where('semester', $request->semester);
        }

        if ($request->filled('tahun_ajaran')) {
            $query->where('tahun_ajaran', $request->tahun_ajaran);
        }

        $krs = $query
            ->latest('tanggal_pengisian')
            ->latest('id_krs')
            ->paginate(10)
            ->withQueryString()
            ->through(function ($item) {
                return [
                    'id_krs' => $item->id_krs,
                    'semester' => $item->semester,
                    'tahun_ajaran' => $item->tahun_ajaran,
                    'tanggal_pengisian' => $item->tanggal_pengisian,
                    'status' => $item->status,
                    'total_sks' => $item->total_sks,
                    'jumlah_mata_kuliah' => $item->detailKrs->count(),
                    'mahasiswa' => $item->mahasiswa ? [
                        'id_mahasiswa' => $item->mahasiswa->id_mahasiswa,
                        'nim' => $item->mahasiswa->nim,
                        'nama' => $item->mahasiswa->nama,
                        'status' => $item->mahasiswa->status,
                        'prodi' => $item->mahasiswa->prodi ? [
                            'kode_prodi' => $item->mahasiswa->prodi->kode_prodi,
                            'nama_prodi' => $item->mahasiswa->prodi->nama_prodi,
                            'jenjang' => $item->mahasiswa->prodi->jenjang,
                        ] : null,
                    ] : null,
                ];
            });

        $scopedKrs = Krs::whereHas('mahasiswa', function ($q) use ($dosen) {
            $q->where('id_dosen_wali', $dosen->id_dosen);
        });

        if ($periodeTerakhir) {
            $scopedKrs->where('tahun_ajaran', $periodeTerakhir->tahun_ajaran)
                ->whereHas('detailKrs.kelas.mataKuliahPeriode', function ($q) use ($periodeTerakhir) {
                    $q->where('tahun_ajaran', $periodeTerakhir->tahun_ajaran)
                        ->where('jenis_semester', $periodeTerakhir->jenis_semester);
                });
        } else {
            $scopedKrs->whereRaw('1 = 0');
        }

        $tahunAjaranList = (clone $scopedKrs)
            ->select('tahun_ajaran')
            ->distinct()
            ->orderBy('tahun_ajaran', 'desc')
            ->pluck('tahun_ajaran');

        return Inertia::render('Dosen/AccKrs/Index', [
            'krs' => $krs,
            'stats' => [
                'total' => (clone $scopedKrs)->count(),
                'draft' => (clone $scopedKrs)->where('status', 'draft')->count(),
                'pending' => (clone $scopedKrs)->where('status', 'pending')->count(),
                'approved' => (clone $scopedKrs)->where('status', 'approved')->count(),
                'rejected' => (clone $scopedKrs)->where('status', 'rejected')->count(),
            ],
            'tahunAjaranList' => $tahunAjaranList,
            'filters' => $request->only(['search', 'status', 'semester', 'tahun_ajaran']),
        ]);
    }

    public function show(Krs $krs)
    {
        $this->authorizeKrsWali($krs);

        $krs->load([
            'mahasiswa.prodi',
            'mahasiswa.dosenWali',
            'detailKrs.kelas.mataKuliahPeriode.mataKuliah',
            'detailKrs.kelas.dosen',
            'detailKrs.kelas.ruangan',
        ]);

        $mataKuliahList = $krs->detailKrs->map(function ($detail) {
            $kelas = $detail->kelas;
            $mataKuliah = $kelas?->mataKuliahPeriode?->mataKuliah;

            return [
                'id_detail_krs' => $detail->id_detail_krs,
                'kode_matkul' => $mataKuliah?->kode_matkul ?? '-',
                'nama_matkul' => $mataKuliah?->nama_matkul ?? '-',
                'sks' => $mataKuliah?->sks ?? 0,
                'nama_kelas' => $kelas?->nama_kelas ?? '-',
                'dosen' => $kelas?->dosen?->nama ?? '-',
                'hari' => $kelas?->hari ?? '-',
                'jam_mulai' => $kelas?->jam_mulai ? Carbon::parse($kelas->jam_mulai)->format('H:i') : '-',
                'jam_selesai' => $kelas?->jam_selesai ? Carbon::parse($kelas->jam_selesai)->format('H:i') : '-',
                'ruang' => $kelas?->ruangan?->nama_ruangan ?? $kelas?->ruang_kelas ?? '-',
            ];
        })->values();

        $allKrsList = Krs::where('id_mahasiswa', $krs->id_mahasiswa)
            ->orderBy('semester')
            ->get()
            ->map(fn ($item) => [
                'id_krs' => $item->id_krs,
                'semester' => $item->semester,
                'tahun_ajaran' => $item->tahun_ajaran,
                'status' => $item->status,
                'total_sks' => $item->total_sks,
            ]);

        return Inertia::render('Dosen/AccKrs/Show', [
            'krs' => $krs,
            'totalSks' => $mataKuliahList->sum('sks'),
            'mataKuliahList' => $mataKuliahList,
            'allKrsList' => $allKrsList,
        ]);
    }

    public function update(Request $request, Krs $krs)
    {
        $this->authorizeKrsWali($krs);

        $validated = $request->validate([
            'status' => 'required|in:draft,approved,rejected',
        ]);

        $previousStatus = $krs->status;

        $krs->update([
            'status' => $validated['status'],
        ]);

        $message = match ($validated['status']) {
            'approved' => 'KRS mahasiswa berhasil disetujui.',
            'draft' => 'Kunci KRS berhasil dibuka. Mahasiswa dapat mengedit KRS kembali.',
            'rejected' => $previousStatus === 'approved'
                ? 'KRS mahasiswa berhasil dibatalkan.'
                : 'KRS mahasiswa berhasil ditolak.',
        };

        return back()->with('success', $message);
    }
}
