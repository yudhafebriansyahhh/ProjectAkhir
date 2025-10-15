<?php

namespace App\Http\Controllers\Baak;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\NilaiMahasiswa;
use App\Models\Prodi;
use App\Models\Dosen;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NilaiController extends Controller
{
    public function index(Request $request)
    {
        $query = Kelas::with([
            'mataKuliahPeriode.mataKuliah',
            'dosen',
            'bobotNilai'
        ])->withCount('detailKrs');

        // Filter by Tahun Ajaran
        if ($request->filled('tahun_ajaran')) {
            $query->whereHas('mataKuliahPeriode', function ($q) use ($request) {
                $q->where('tahun_ajaran', $request->tahun_ajaran);
            });
        }

        // Filter by Prodi
        if ($request->filled('prodi')) {
            $query->whereHas('mataKuliahPeriode', function ($q) use ($request) {
                $q->where('kode_prodi', $request->prodi);
            });
        }

        // Filter by Dosen
        if ($request->filled('dosen')) {
            $query->where('id_dosen', $request->dosen);
        }

        // Filter by Status Nilai (sudah diinput/belum)
        if ($request->filled('status_nilai')) {
            if ($request->status_nilai === 'sudah') {
                $query->whereHas('nilais');
            } elseif ($request->status_nilai === 'belum') {
                $query->whereDoesntHave('nilais');
            }
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('mataKuliahPeriode.mataKuliah', function ($q) use ($search) {
                    $q->where('nama_matkul', 'like', "%{$search}%")
                      ->orWhere('kode_matkul', 'like', "%{$search}%");
                })
                ->orWhere('nama_kelas', 'like', "%{$search}%");
            });
        }

        $kelas = $query->latest()->paginate(15)->withQueryString();

        // Calculate status untuk setiap kelas
        $kelas->getCollection()->transform(function ($item) {
            $totalMahasiswa = $item->detail_krs_count;
            $nilaiCount = NilaiMahasiswa::where('id_kelas', $item->id_kelas)->count();

            $item->total_mahasiswa = $totalMahasiswa;
            $item->nilai_count = $nilaiCount;
            $item->is_locked = $this->isNilaiLocked($item->id_kelas);

            // Status input nilai
            if ($nilaiCount === 0) {
                $item->status_input = 'belum';
            } elseif ($nilaiCount < $totalMahasiswa) {
                $item->status_input = 'sebagian';
            } else {
                $item->status_input = 'lengkap';
            }

            return $item;
        });

        // Get filter options
        $tahunAjaranList = \DB::table('mata_kuliah_periode')
            ->select('tahun_ajaran')
            ->distinct()
            ->orderBy('tahun_ajaran', 'desc')
            ->pluck('tahun_ajaran');

        return Inertia::render('Baak/Nilai/Index', [
            'kelas' => $kelas,
            'prodis' => Prodi::orderBy('nama_prodi')->get(['kode_prodi', 'nama_prodi']),
            'dosens' => Dosen::orderBy('nama')->get(['id_dosen', 'nama']),
            'tahunAjaranList' => $tahunAjaranList,
            'filters' => $request->only(['search', 'tahun_ajaran', 'prodi', 'dosen', 'status_nilai']),
        ]);
    }

    public function show($id)
    {
        $kelas = Kelas::with([
            'mataKuliahPeriode.mataKuliah',
            'dosen',
            'bobotNilai',
            'detailKrs.krs.mahasiswa'
        ])->findOrFail($id);

        // Get nilai mahasiswa
        $nilaiList = $kelas->detailKrs->map(function ($detail) use ($kelas) {
            $mahasiswa = $detail->krs->mahasiswa;

            // Get nilai
            $nilai = NilaiMahasiswa::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
                ->where('id_kelas', $kelas->id_kelas)
                ->first();

            // Get kehadiran (dari tabel absensi - future)
            // Untuk sekarang hardcode atau null dulu
            $persentaseKehadiran = null; // TODO: Calculate dari tabel absensi

            return [
                'nim' => $mahasiswa->nim,
                'nama' => $mahasiswa->nama,
                'nilai_tugas' => $nilai->nilai_tugas ?? null,
                'nilai_uts' => $nilai->nilai_uts ?? null,
                'nilai_uas' => $nilai->nilai_uas ?? null,
                'nilai_akhir' => $nilai->nilai_akhir ?? null,
                'nilai_huruf' => $nilai->nilai_huruf ?? null,
                'persentase_kehadiran' => $persentaseKehadiran,
            ];
        });

        return Inertia::render('Baak/Nilai/Show', [
            'kelas' => $kelas,
            'nilaiList' => $nilaiList,
            'isLocked' => $this->isNilaiLocked($id),
        ]);
    }

    public function toggleLock($id)
    {
        $kelas = Kelas::findOrFail($id);

        // Check if nilai ada
        $nilaiCount = NilaiMahasiswa::where('id_kelas', $id)->count();

        if ($nilaiCount === 0) {
            return back()->with('error', 'Tidak ada nilai yang bisa di-lock. Dosen belum input nilai.');
        }

        $isLocked = $this->isNilaiLocked($id);

        // Toggle lock status
        // Kita pakai metadata atau flag di tabel terpisah
        // Untuk simplicity, kita pakai cache atau buat kolom is_locked di tabel nilai_mahasiswa

        if ($isLocked) {
            // Unlock semua nilai di kelas ini
            NilaiMahasiswa::where('id_kelas', $id)->update(['is_locked' => false]);
            $message = 'Nilai berhasil di-unlock. Dosen dapat mengedit nilai kembali.';
        } else {
            // Lock semua nilai di kelas ini
            NilaiMahasiswa::where('id_kelas', $id)->update(['is_locked' => true]);
            $message = 'Nilai berhasil di-lock. Nilai tidak dapat diubah kecuali di-unlock oleh BAAK.';
        }

        return back()->with('success', $message);
    }

    // Helper method
    private function isNilaiLocked($id_kelas)
    {
        // Check if any nilai in this class is locked
        return NilaiMahasiswa::where('id_kelas', $id_kelas)
            ->where('is_locked', true)
            ->exists();
    }

    public function bulkLock(Request $request)
    {
        $request->validate([
            'tahun_ajaran' => 'required|string',
            'jenis_semester' => 'required|in:ganjil,genap',
            'kode_prodi' => 'nullable|string',
            'action' => 'required|in:lock,unlock',
        ]);

        $query = Kelas::query();

        // Filter by periode
        $query->whereHas('mataKuliahPeriode', function ($q) use ($request) {
            $q->where('tahun_ajaran', $request->tahun_ajaran)
            ->where('jenis_semester', $request->jenis_semester);

            if ($request->filled('kode_prodi')) {
                $q->where('kode_prodi', $request->kode_prodi);
            }
        });

        $kelasIds = $query->pluck('id_kelas');

        if ($kelasIds->isEmpty()) {
            return back()->with('error', 'Tidak ada kelas di periode ini.');
        }

        $isLocked = $request->action === 'lock';

        // Bulk update
        $updated = NilaiMahasiswa::whereIn('id_kelas', $kelasIds)
            ->update(['is_locked' => $isLocked]);

        $action = $isLocked ? 'di-lock' : 'di-unlock';
        $message = "Berhasil {$action} {$updated} nilai di {$kelasIds->count()} kelas untuk periode {$request->tahun_ajaran} - " . ucfirst($request->jenis_semester);

        return back()->with('success', $message);
    }
}
