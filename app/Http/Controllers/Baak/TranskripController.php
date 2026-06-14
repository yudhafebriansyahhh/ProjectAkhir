<?php

namespace App\Http\Controllers\Baak;

use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use App\Models\NilaiMahasiswa;
use App\Models\Prodi;
use App\Models\PengajuanLayanan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TranskripController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $kodeProdi = $request->input('kode_prodi');
        $statusPengajuan = $request->input('status_pengajuan');

        $query = PengajuanLayanan::with(['mahasiswa.prodi', 'mahasiswa.dosenWali'])
            ->where('jenis_layanan', 'transkrip');

        $query->when($search, function ($q) use ($search) {
            $q->whereHas('mahasiswa', function ($q2) use ($search) {
                $q2->where('nim', 'like', "%{$search}%")
                   ->orWhere('nama', 'like', "%{$search}%");
            });
        });

        $query->when($kodeProdi, function ($q) use ($kodeProdi) {
            $q->whereHas('mahasiswa', function ($q2) use ($kodeProdi) {
                $q2->where('kode_prodi', $kodeProdi);
            });
        });

        $query->when($statusPengajuan, function ($q) use ($statusPengajuan) {
            $q->where('status', $statusPengajuan);
        });

        $pengajuans = $query
            ->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(fn ($item) => [
                'id_pengajuan' => $item->id,
                'status_pengajuan' => $item->status,
                'tanggal_pengajuan' => $item->created_at->format('Y-m-d H:i'),
                'keterangan' => $item->keterangan,
                'mahasiswa' => $item->mahasiswa ? [
                    'id_mahasiswa' => $item->mahasiswa->id_mahasiswa,
                    'nim' => $item->mahasiswa->nim,
                    'nama' => $item->mahasiswa->nama,
                    'prodi' => $item->mahasiswa->prodi ? [
                        'nama_prodi' => $item->mahasiswa->prodi->nama_prodi,
                        'jenjang' => $item->mahasiswa->prodi->jenjang,
                    ] : null,
                ] : null,
            ]);

        return Inertia::render('Baak/Transkrip/Index', [
            'pengajuans' => $pengajuans,
            'prodis' => Prodi::orderBy('nama_prodi')->get(['kode_prodi', 'nama_prodi']),
            'stats' => [
                'total' => PengajuanLayanan::where('jenis_layanan', 'transkrip')->count(),
                'pending' => PengajuanLayanan::where('jenis_layanan', 'transkrip')->where('status', 'pending')->count(),
                'selesai' => PengajuanLayanan::where('jenis_layanan', 'transkrip')->where('status', 'selesai')->count(),
            ],
            'filters' => $request->only(['search', 'kode_prodi', 'status_pengajuan']),
        ]);
    }

    public function show(Mahasiswa $mahasiswa)
    {
        $mahasiswa->load(['prodi', 'dosenWali']);

        $nilaiRows = NilaiMahasiswa::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->whereNotNull('nilai_huruf')
            ->where('nilai_huruf', '!=', '-')
            ->with(['kelas.mataKuliahPeriode.mataKuliah'])
            ->get();

        $krsByKelas = DB::table('detail_krs')
            ->join('krs', 'detail_krs.id_krs', '=', 'krs.id_krs')
            ->where('krs.id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->select('detail_krs.id_kelas', 'krs.semester', 'krs.tahun_ajaran')
            ->get()
            ->keyBy('id_kelas');

        $rows = $nilaiRows
            ->map(function ($nilai) use ($krsByKelas) {
                $kelas = $nilai->kelas;
                $mkPeriode = $kelas?->mataKuliahPeriode;
                $mataKuliah = $mkPeriode?->mataKuliah;
                $krsInfo = $krsByKelas->get($nilai->id_kelas);
                $sks = (int) ($mataKuliah?->sks ?? 0);
                $bobot = $this->getBobotNilai($nilai->nilai_huruf);

                return [
                    'semester' => (int) ($krsInfo->semester ?? $mkPeriode?->semester_ditawarkan ?? 0),
                    'tahun_ajaran' => $krsInfo->tahun_ajaran ?? $mkPeriode?->tahun_ajaran ?? '-',
                    'kode_mk' => $mataKuliah?->kode_matkul ?? '-',
                    'nama_mk' => $mataKuliah?->nama_matkul ?? '-',
                    'sks' => $sks,
                    'nilai_angka' => $nilai->nilai_akhir !== null ? round((float) $nilai->nilai_akhir, 2) : null,
                    'nilai_huruf' => $nilai->nilai_huruf,
                    'bobot' => $bobot,
                    'bxs' => $sks * $bobot,
                ];
            })
            ->sortBy([
                ['semester', 'asc'],
                ['tahun_ajaran', 'asc'],
                ['kode_mk', 'asc'],
            ])
            ->values();

        $totalSks = $rows->sum('sks');
        $totalBxs = $rows->sum('bxs');
        $ipk = $totalSks > 0 ? round($totalBxs / $totalSks, 2) : 0;

        return Inertia::render('Baak/Transkrip/Show', [
            'mahasiswa' => [
                'id_mahasiswa' => $mahasiswa->id_mahasiswa,
                'nim' => $mahasiswa->nim,
                'nama' => $mahasiswa->nama,
                'tanggal_lahir' => $mahasiswa->tanggal_lahir?->format('d F Y'),
                'tahun_masuk' => $mahasiswa->tahun_masuk,
                'status' => $mahasiswa->status,
                'prodi' => $mahasiswa->prodi ? [
                    'kode_prodi' => $mahasiswa->prodi->kode_prodi,
                    'nama_prodi' => $mahasiswa->prodi->nama_prodi,
                    'jenjang' => $mahasiswa->prodi->jenjang,
                ] : null,
            ],
            'rows' => $rows,
            'summary' => [
                'jumlah_mata_kuliah' => $rows->count(),
                'total_sks' => $totalSks,
                'total_bxs' => round($totalBxs, 2),
                'ipk' => number_format($ipk, 2, ',', ''),
                'predikat' => $this->getPredikat($ipk),
                'tanggal_cetak' => Carbon::now()->translatedFormat('d F Y'),
            ],
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $pengajuan = PengajuanLayanan::findOrFail($id);
        
        $request->validate([
            'status' => 'required|in:pending,diproses,selesai,ditolak',
            'keterangan_admin' => 'nullable|string',
        ]);

        $pengajuan->update([
            'status' => $request->status,
            'keterangan_admin' => $request->keterangan_admin,
        ]);

        return redirect()->back()->with('success', 'Status pengajuan berhasil diperbarui.');
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

    private function getPredikat(float $ipk): string
    {
        if ($ipk >= 3.51) {
            return 'Dengan Pujian';
        }

        if ($ipk >= 3.01) {
            return 'Sangat Memuaskan';
        }

        if ($ipk >= 2.76) {
            return 'Memuaskan';
        }

        return '-';
    }
}
