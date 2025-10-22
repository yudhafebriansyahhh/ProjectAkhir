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
        $periodeList = \DB::table('mata_kuliah_periode')
            ->select('tahun_ajaran', 'jenis_semester')
            ->distinct()
            ->orderBy('tahun_ajaran', 'desc')
            ->orderByRaw("FIELD(jenis_semester, 'ganjil', 'genap')")
            ->get()
            ->map(function ($item) {
                $jenisSemesterLabel = ucfirst($item->jenis_semester);
                return [
                    'value' => "{$item->tahun_ajaran}_{$item->jenis_semester}",
                    'label' => "{$item->tahun_ajaran} - {$jenisSemesterLabel}",
                    'tahun_ajaran' => $item->tahun_ajaran,
                    'jenis_semester' => $item->jenis_semester,
                ];
            });

        if (!$request->filled('tahun_ajaran') || !$request->filled('jenis_semester')) {
            return Inertia::render('Baak/Nilai/Index', [
                'kelas' => [
                    'data' => [],
                    'links' => [],
                    'current_page' => 1,
                    'last_page' => 1,
                    'from' => 0,
                    'to' => 0,
                    'total' => 0,
                ],
                'prodis' => Prodi::orderBy('nama_prodi')->get(['kode_prodi', 'nama_prodi']),
                'dosens' => Dosen::orderBy('nama')->get(['id_dosen', 'nama']),
                'periodeList' => $periodeList,
                'filters' => $request->only(['search', 'tahun_ajaran', 'jenis_semester', 'prodi', 'dosen', 'status_nilai']),
                'periodStats' => null,
            ]);
        }

        $query = Kelas::with([
            'mataKuliahPeriode.mataKuliah',
            'dosen',
            'bobotNilai'
        ])->withCount('detailKrs');

        // Filter by Tahun Ajaran & Jenis Semester (REQUIRED)
        $query->whereHas('mataKuliahPeriode', function ($q) use ($request) {
            $q->where('tahun_ajaran', $request->tahun_ajaran)
              ->where('jenis_semester', $request->jenis_semester);
        });

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

        // Filter by Status Nilai
        if ($request->filled('status_nilai')) {
            if ($request->status_nilai === 'lengkap') {
                
                $query->whereHas('detailKrs', function($q) {
                })->get()->filter(function($kelas) {
                    $totalMahasiswa = $kelas->detail_krs_count;
                    $nilaiCount = NilaiMahasiswa::where('id_kelas', $kelas->id_kelas)->count();
                    return $totalMahasiswa > 0 && $nilaiCount === $totalMahasiswa;
                });

                // Cara lebih efisien: pakai whereRaw
                $query->whereRaw('(
                    SELECT COUNT(*)
                    FROM nilai_mahasiswa
                    WHERE nilai_mahasiswa.id_kelas = kelas.id_kelas
                ) = (
                    SELECT COUNT(*)
                    FROM detail_krs
                    WHERE detail_krs.id_kelas = kelas.id_kelas
                )')
                ->whereRaw('(
                    SELECT COUNT(*)
                    FROM detail_krs
                    WHERE detail_krs.id_kelas = kelas.id_kelas
                ) > 0');

            } elseif ($request->status_nilai === 'sebagian') {
                // Status SEBAGIAN: ada nilai tapi tidak semua
                $query->whereRaw('(
                    SELECT COUNT(*)
                    FROM nilai_mahasiswa
                    WHERE nilai_mahasiswa.id_kelas = kelas.id_kelas
                ) > 0')
                ->whereRaw('(
                    SELECT COUNT(*)
                    FROM nilai_mahasiswa
                    WHERE nilai_mahasiswa.id_kelas = kelas.id_kelas
                ) < (
                    SELECT COUNT(*)
                    FROM detail_krs
                    WHERE detail_krs.id_kelas = kelas.id_kelas
                )');

            } elseif ($request->status_nilai === 'belum') {
                // Status BELUM: belum ada nilai sama sekali
                $query->whereRaw('(
                    SELECT COUNT(*)
                    FROM nilai_mahasiswa
                    WHERE nilai_mahasiswa.id_kelas = kelas.id_kelas
                ) = 0');
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

        $periodStats = $this->getPeriodStats(
            $request->tahun_ajaran,
            $request->jenis_semester,
            $request->prodi,
            $request->dosen
        );

        return Inertia::render('Baak/Nilai/Index', [
            'kelas' => $kelas,
            'prodis' => Prodi::orderBy('nama_prodi')->get(['kode_prodi', 'nama_prodi']),
            'dosens' => Dosen::orderBy('nama')->get(['id_dosen', 'nama']),
            'periodeList' => $periodeList,
            'filters' => $request->only(['search', 'tahun_ajaran', 'jenis_semester', 'prodi', 'dosen', 'status_nilai']),
            'periodStats' => $periodStats,
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

            $persentaseKehadiran = null;

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

        $nilaiCount = NilaiMahasiswa::where('id_kelas', $id)->count();

        if ($nilaiCount === 0) {
            return back()->with('error', 'Tidak ada nilai yang bisa di-lock. Dosen belum input nilai.');
        }

        $isLocked = $this->isNilaiLocked($id);

        if ($isLocked) {
            NilaiMahasiswa::where('id_kelas', $id)->update(['is_locked' => false]);
            $message = 'Nilai berhasil di-unlock. Dosen dapat mengedit nilai kembali.';
        } else {
            NilaiMahasiswa::where('id_kelas', $id)->update(['is_locked' => true]);
            $message = 'Nilai berhasil di-lock. Nilai tidak dapat diubah kecuali di-unlock oleh BAAK.';
        }

        return back()->with('success', $message);
    }

    public function bulkLock(Request $request)
    {
        $request->validate([
            'tahun_ajaran' => 'required|string',
            'jenis_semester' => 'required|in:ganjil,genap',
            'kode_prodi' => 'nullable|string',
            'action' => 'required|in:lock,unlock',
            'auto_fill_empty' => 'nullable|boolean',
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

        $kelasList = $query->with('detailKrs.krs.mahasiswa')->get();

        if ($kelasList->isEmpty()) {
            return back()->with('error', 'Tidak ada kelas di periode ini.');
        }

        $isLocked = $request->action === 'lock';
        $autoFill = $request->auto_fill_empty ?? true;

        $totalUpdated = 0;
        $totalCreated = 0;

        foreach ($kelasList as $kelas) {
            if ($isLocked && $autoFill) {
                foreach ($kelas->detailKrs as $detail) {
                    $mahasiswa = $detail->krs->mahasiswa;

                    $nilai = NilaiMahasiswa::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
                        ->where('id_kelas', $kelas->id_kelas)
                        ->first();

                    if (!$nilai) {
                        NilaiMahasiswa::create([
                            'id_mahasiswa' => $mahasiswa->id_mahasiswa,
                            'id_kelas' => $kelas->id_kelas,
                            'nilai_tugas' => 0,
                            'nilai_uts' => 0,
                            'nilai_uas' => 0,
                            'nilai_akhir' => 0,
                            'nilai_huruf' => 'E',
                            'is_locked' => true,
                        ]);
                        $totalCreated++;
                    }
                }
            }

            $updated = NilaiMahasiswa::where('id_kelas', $kelas->id_kelas)
                ->update(['is_locked' => $isLocked]);

            $totalUpdated += $updated;
        }

        $action = $isLocked ? 'di-lock' : 'di-unlock';
        $jenisSemesterLabel = ucfirst($request->jenis_semester);
        $message = "Berhasil {$action} {$totalUpdated} nilai di {$kelasList->count()} kelas untuk periode {$request->tahun_ajaran} - {$jenisSemesterLabel}.";

        if ($totalCreated > 0) {
            $message .= " {$totalCreated} nilai kosong diisi otomatis dengan nilai 0.";
        }

        return back()->with('success', $message);
    }

    private function getPeriodStats($tahunAjaran, $jenisSemester, $kodeProdi = null, $idDosen = null)
    {
        $query = Kelas::query();

        $query->whereHas('mataKuliahPeriode', function ($q) use ($tahunAjaran, $jenisSemester, $kodeProdi) {
            $q->where('tahun_ajaran', $tahunAjaran)
              ->where('jenis_semester', $jenisSemester);

            if ($kodeProdi) {
                $q->where('kode_prodi', $kodeProdi);
            }
        });

        if ($idDosen) {
            $query->where('id_dosen', $idDosen);
        }

        $kelasList = $query->withCount('detailKrs')->get();

        $totalKelas = $kelasList->count();
        $totalMahasiswa = $kelasList->sum('detail_krs_count');

        $totalNilai = 0;
        $totalNilaiLocked = 0;
        $kelasWithNilai = 0;
        $kelasLocked = 0;

        foreach ($kelasList as $kelas) {
            $nilaiCount = NilaiMahasiswa::where('id_kelas', $kelas->id_kelas)->count();
            $nilaiLockedCount = NilaiMahasiswa::where('id_kelas', $kelas->id_kelas)
                ->where('is_locked', true)
                ->count();

            $totalNilai += $nilaiCount;
            $totalNilaiLocked += $nilaiLockedCount;

            if ($nilaiCount > 0) {
                $kelasWithNilai++;
            }

            if ($nilaiLockedCount > 0) {
                $kelasLocked++;
            }
        }

        $persenNilai = $totalMahasiswa > 0 ? ($totalNilai / $totalMahasiswa) * 100 : 0;
        $persenLocked = $totalMahasiswa > 0 ? ($totalNilaiLocked / $totalMahasiswa) * 100 : 0;

        return [
            'total_kelas' => $totalKelas,
            'total_mahasiswa' => $totalMahasiswa,
            'total_nilai' => $totalNilai,
            'total_nilai_locked' => $totalNilaiLocked,
            'kelas_with_nilai' => $kelasWithNilai,
            'kelas_locked' => $kelasLocked,
            'persen_nilai' => round($persenNilai, 1),
            'persen_locked' => round($persenLocked, 1),
            'nilai_kosong' => $totalMahasiswa - $totalNilai,
        ];
    }

    private function isNilaiLocked($id_kelas)
    {
        return NilaiMahasiswa::where('id_kelas', $id_kelas)
            ->where('is_locked', true)
            ->exists();
    }
}
