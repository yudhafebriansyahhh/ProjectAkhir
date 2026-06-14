<?php

namespace App\Http\Controllers\Baak;

use App\Http\Controllers\Controller;
use App\Models\Krs;
use App\Models\NilaiMahasiswa;
use App\Models\Prodi;
use App\Models\PengajuanLayanan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CetakKhsController extends Controller
{
    public function index(Request $request)
    {
        $query = PengajuanLayanan::with(['krs.detailKrs', 'mahasiswa.prodi'])
            ->where('jenis_layanan', 'cetak_khs');

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

        return Inertia::render('Baak/CetakKhs/Index', [
            'pengajuans' => $pengajuans,
            'prodis' => Prodi::orderBy('nama_prodi')->get(['kode_prodi', 'nama_prodi']),
            'tahunAjaranList' => Krs::select('tahun_ajaran')->distinct()->orderByDesc('tahun_ajaran')->pluck('tahun_ajaran'),
            'stats' => [
                'total' => PengajuanLayanan::where('jenis_layanan', 'cetak_khs')->count(),
                'pending' => PengajuanLayanan::where('jenis_layanan', 'cetak_khs')->where('status', 'pending')->count(),
                'selesai' => PengajuanLayanan::where('jenis_layanan', 'cetak_khs')->where('status', 'selesai')->count(),
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
        ]);

        $nilaiByKelas = NilaiMahasiswa::where('id_mahasiswa', $krs->id_mahasiswa)
            ->whereIn('id_kelas', $krs->detailKrs->pluck('id_kelas'))
            ->get()
            ->keyBy('id_kelas');

        $rows = $krs->detailKrs->map(function ($detail) use ($nilaiByKelas) {
            $kelas = $detail->kelas;
            $mk = $kelas?->mataKuliahPeriode?->mataKuliah;
            $nilai = $nilaiByKelas->get($detail->id_kelas);
            $sks = (int) ($mk?->sks ?? 0);
            $bobot = $this->getBobotNilai($nilai?->nilai_huruf);

            return [
                'kode_mk' => $mk?->kode_matkul ?? '-',
                'nama_mk' => $mk?->nama_matkul ?? '-',
                'sks' => $sks,
                'nilai_angka' => $nilai?->nilai_akhir !== null ? round((float) $nilai->nilai_akhir, 2) : null,
                'nilai_huruf' => $nilai?->nilai_huruf ?? '-',
                'bobot' => $bobot,
                'bxs' => $sks * $bobot,
            ];
        })->values();

        $totalSks = $rows->sum('sks');
        $totalBxs = $rows->sum('bxs');
        $ips = $totalSks > 0 ? $totalBxs / $totalSks : 0;

        return Inertia::render('Baak/CetakKhs/Show', [
            'krs' => [
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
                'total_sks' => $totalSks,
                'total_bxs' => round($totalBxs, 2),
                'ips' => number_format($ips, 2, ',', ''),
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

    private function getBobotNilai(?string $nilaiHuruf): float
    {
        return [
            'A' => 4.00,
            'A-' => 3.75,
            'B+' => 3.50,
            'B' => 3.00,
            'B-' => 2.75,
            'C+' => 2.50,
            'C' => 2.00,
            'D' => 1.00,
            'E' => 0.00,
        ][$nilaiHuruf] ?? 0.00;
    }
}
