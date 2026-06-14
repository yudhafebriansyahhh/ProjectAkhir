<?php

namespace App\Http\Controllers\Baak;

use App\Http\Controllers\Controller;
use App\Models\Krs;
use App\Models\Prodi;
use App\Models\PengajuanLayanan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CetakKrsController extends Controller
{
    public function index(Request $request)
    {
        $query = PengajuanLayanan::with(['krs.detailKrs', 'mahasiswa.prodi'])
            ->where('jenis_layanan', 'cetak_krs');

        $this->applyFilters($query, $request);

        $pengajuans = $query
            ->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(fn ($item) => [
                'id_pengajuan' => $item->id,
                'status_pengajuan' => $item->status,
                'tanggal_pengajuan' => $item->created_at->format('Y-m-d H:i'),
                'keterangan' => $item->keterangan,
                'id_krs' => $item->krs?->id_krs,
                'semester' => $item->krs?->semester,
                'tahun_ajaran' => $item->krs?->tahun_ajaran,
                'status' => $item->krs?->status,
                'total_sks' => $item->krs?->total_sks,
                'jumlah_mata_kuliah' => $item->krs ? $item->krs->detailKrs->count() : 0,
                'mahasiswa' => $item->mahasiswa ? [
                    'nim' => $item->mahasiswa->nim,
                    'nama' => $item->mahasiswa->nama,
                    'prodi' => $item->mahasiswa->prodi ? [
                        'nama_prodi' => $item->mahasiswa->prodi->nama_prodi,
                        'jenjang' => $item->mahasiswa->prodi->jenjang,
                    ] : null,
                ] : null,
            ]);

        return Inertia::render('Baak/CetakKrs/Index', [
            'pengajuans' => $pengajuans,
            'prodis' => Prodi::orderBy('nama_prodi')->get(['kode_prodi', 'nama_prodi']),
            'tahunAjaranList' => Krs::select('tahun_ajaran')->distinct()->orderByDesc('tahun_ajaran')->pluck('tahun_ajaran'),
            'stats' => [
                'total' => PengajuanLayanan::where('jenis_layanan', 'cetak_krs')->count(),
                'pending' => PengajuanLayanan::where('jenis_layanan', 'cetak_krs')->where('status', 'pending')->count(),
                'selesai' => PengajuanLayanan::where('jenis_layanan', 'cetak_krs')->where('status', 'selesai')->count(),
            ],
            'filters' => $request->only(['search', 'tahun_ajaran', 'prodi', 'semester', 'status_pengajuan']),
        ]);
    }

    public function show(Krs $krs)
    {
        $krs->load([
            'mahasiswa.prodi',
            'mahasiswa.dosenWali',
            'detailKrs.kelas.mataKuliahPeriode.mataKuliah',
            'detailKrs.kelas.dosen',
            'detailKrs.kelas.ruangan',
        ]);

        $rows = $krs->detailKrs->map(function ($detail) {
            $kelas = $detail->kelas;
            $mk = $kelas?->mataKuliahPeriode?->mataKuliah;

            return [
                'kode_mk' => $mk?->kode_matkul ?? '-',
                'nama_mk' => $mk?->nama_matkul ?? '-',
                'kelas' => $kelas?->nama_kelas ?? '-',
                'sks' => (int) ($mk?->sks ?? 0),
                'dosen' => $kelas?->dosen?->nama ?? '-',
                'hari' => $kelas?->hari ?? '-',
                'jam' => ($kelas?->jam_mulai && $kelas?->jam_selesai)
                    ? Carbon::parse($kelas->jam_mulai)->format('H:i') . ' - ' . Carbon::parse($kelas->jam_selesai)->format('H:i')
                    : '-',
                'ruang' => $kelas?->ruangan?->kode_ruangan ?? $kelas?->ruang_kelas ?? '-',
            ];
        })->values();

        return Inertia::render('Baak/CetakKrs/Show', [
            'krs' => [
                'id_krs' => $krs->id_krs,
                'semester' => $krs->semester,
                'tahun_ajaran' => $krs->tahun_ajaran,
                'status' => $krs->status,
                'tanggal_pengisian' => $krs->tanggal_pengisian?->format('d F Y'),
                'mahasiswa' => [
                    'nim' => $krs->mahasiswa?->nim,
                    'nama' => $krs->mahasiswa?->nama,
                    'dosen_wali' => $krs->mahasiswa?->dosenWali?->nama,
                    'prodi' => $krs->mahasiswa?->prodi ? [
                        'nama_prodi' => $krs->mahasiswa->prodi->nama_prodi,
                        'jenjang' => $krs->mahasiswa->prodi->jenjang,
                    ] : null,
                ],
            ],
            'rows' => $rows,
            'summary' => [
                'total_sks' => $rows->sum('sks'),
                'jumlah_mata_kuliah' => $rows->count(),
                'tanggal_cetak' => Carbon::now()->translatedFormat('d F Y'),
            ],
        ]);
    }

    private function applyFilters($query, Request $request): void
    {
        $query
            ->when($request->filled('status_pengajuan'), fn ($query) => $query->where('status', $request->status_pengajuan))
            ->when($request->filled('tahun_ajaran'), function ($query) use ($request) {
                $query->whereHas('krs', fn($q) => $q->where('tahun_ajaran', $request->tahun_ajaran));
            })
            ->when($request->filled('semester'), function ($query) use ($request) {
                $query->whereHas('krs', fn($q) => $q->where('semester', $request->semester));
            })
            ->when($request->filled('prodi'), function ($query) use ($request) {
                $query->whereHas('mahasiswa', fn ($query) => $query->where('kode_prodi', $request->prodi));
            })
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->whereHas('mahasiswa', function ($query) use ($request) {
                    $query->where('nim', 'like', "%{$request->search}%")
                        ->orWhere('nama', 'like', "%{$request->search}%");
                });
            });
    }
}
