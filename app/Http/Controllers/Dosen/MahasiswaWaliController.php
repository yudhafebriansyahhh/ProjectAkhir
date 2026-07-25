<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Mahasiswa;
use App\Models\Krs;
use App\Models\NilaiMahasiswa;
use App\Models\RegistrasiSemester;
use App\Traits\DosenHelper;
use Illuminate\Support\Facades\Auth;

class MahasiswaWaliController extends Controller
{
    use DosenHelper;

    public function index(Request $request)
    {
        $dosen = Auth::user()->dosen;

        if (!$dosen) {
            abort(403, 'Unauthorized action.');
        }

        $query = Mahasiswa::with('prodi')
            ->withCount([
                'krs as krs_pending_count' => fn ($q) => $q->where('status', 'pending'),
                'krs as krs_approved_count' => fn ($q) => $q->where('status', 'approved'),
            ])
            ->where('id_dosen_wali', $dosen->id_dosen);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('nim', 'like', "%{$request->search}%")
                    ->orWhere('nama', 'like', "%{$request->search}%");
            });
        }

        $sortField = $request->input('sort_field', 'nama');
        $sortDirection = $request->input('sort_direction', 'asc');
        $allowedSorts = ['nama', 'nim', 'tahun_masuk'];

        if (!in_array($sortField, $allowedSorts)) {
            $sortField = 'nama';
        }

        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'asc';
        }

        $mahasiswa = $query
            ->orderBy($sortField, $sortDirection)
            ->orderBy('nama')
            ->paginate(12)
            ->withQueryString()
            ->through(function ($item) {
                $latestKrs = $item->krs()
                    ->latest('tanggal_pengisian')
                    ->latest('id_krs')
                    ->first();

                return [
                    'id_mahasiswa' => $item->id_mahasiswa,
                    'nim' => $item->nim,
                    'nama' => $item->nama,
                    'tahun_masuk' => $item->tahun_masuk,
                    'status' => $item->status,
                    'prodi' => $item->prodi ? [
                        'kode_prodi' => $item->prodi->kode_prodi,
                        'nama_prodi' => $item->prodi->nama_prodi,
                        'jenjang' => $item->prodi->jenjang,
                    ] : null,
                    'krs_pending_count' => $item->krs_pending_count,
                    'krs_approved_count' => $item->krs_approved_count,
                    'latest_krs' => $latestKrs ? [
                        'id_krs' => $latestKrs->id_krs,
                        'semester' => $latestKrs->semester,
                        'tahun_ajaran' => $latestKrs->tahun_ajaran,
                        'status' => $latestKrs->status,
                    ] : null,
                ];
            });

        $baseQuery = Mahasiswa::where('id_dosen_wali', $dosen->id_dosen);

        return Inertia::render('Dosen/MahasiswaWali/Index', [
            'mahasiswa' => $mahasiswa,
            'stats' => [
                'total' => (clone $baseQuery)->count(),
                'aktif' => (clone $baseQuery)->where('status', 'aktif')->count(),
                'nonaktif' => (clone $baseQuery)->where('status', '!=', 'aktif')->count(),
                'pending_krs' => Krs::whereHas('mahasiswa', function ($q) use ($dosen) {
                    $q->where('id_dosen_wali', $dosen->id_dosen);
                })->where('status', 'pending')->count(),
            ],
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
            ],
        ]);
    }

    public function show(Mahasiswa $mahasiswa)
    {
        $dosen = Auth::user()->dosen;

        if (!$dosen || $mahasiswa->id_dosen_wali !== $dosen->id_dosen) {
            abort(403, 'Anda tidak memiliki akses untuk mahasiswa ini.');
        }

        $mahasiswa->load(['prodi', 'dosenWali', 'user']);

        $rencanaStudiData = Krs::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->with(['detailKrs.kelas' => function ($q) {
                $q->with(['mataKuliahPeriode.mataKuliah', 'dosen']);
            }])
            ->orderBy('semester')
            ->get()
            ->map(function ($krs) {
                $mataKuliah = $krs->detailKrs->map(function ($detail) {
                    $mataKuliah = $detail->kelas?->mataKuliahPeriode?->mataKuliah;
                    $kelas = $detail->kelas;

                    return [
                        'kode_mk' => $mataKuliah?->kode_matkul ?? '-',
                        'nama_mk' => $mataKuliah?->nama_matkul ?? '-',
                        'nama_kelas' => $kelas?->nama_kelas ?? '-',
                        'sks' => $mataKuliah?->sks ?? 0,
                        'ambil_ke' => 1,
                    ];
                });

                return [
                    'semester' => $krs->semester,
                    'tahun_ajaran' => $krs->tahun_ajaran,
                    'jenis_semester' => $krs->semester % 2 === 0 ? 'Genap' : 'Ganjil',
                    'mata_kuliah' => $mataKuliah,
                    'total_sks' => $mataKuliah->sum('sks'),
                ];
            });

        $hasilStudiData = Krs::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->with(['detailKrs.kelas.mataKuliahPeriode.mataKuliah'])
            ->orderBy('semester')
            ->get()
            ->map(function ($krs) use ($mahasiswa) {
                $mataKuliah = $krs->detailKrs->map(function ($detail) use ($krs) {
                    $mataKuliah = $detail->kelas?->mataKuliahPeriode?->mataKuliah;

                    $nilai = NilaiMahasiswa::where('id_mahasiswa', $krs->id_mahasiswa)
                        ->where('id_kelas', $detail->id_kelas)
                        ->first();

                    return [
                        'kode_mk' => $mataKuliah?->kode_matkul ?? '-',
                        'nama_mk' => $mataKuliah?->nama_matkul ?? '-',
                        'sks' => $mataKuliah?->sks ?? 0,
                        'bobot' => $nilai ? $this->getBobotNilai($nilai->nilai_huruf) : 0,
                        'nilai' => $nilai ? $nilai->nilai_huruf : '-',
                    ];
                });

                return [
                    'no' => $krs->semester,
                    'periode' => $krs->tahun_ajaran,
                    'semester' => $krs->semester % 2 === 0 ? 'Genap' : 'Ganjil',
                    'sks_semester' => $mataKuliah->sum('sks'),
                    'ips' => $this->hitungIPSFromCollection($mataKuliah),
                    'sks_kumulatif' => $this->hitungSKSKumulatif($mahasiswa->id_mahasiswa, $krs->semester),
                    'ipk' => $this->hitungIPKSampaiSemester($mahasiswa->id_mahasiswa, $krs->semester),
                    'distribusi_nilai' => $this->getDistribusiNilai($mataKuliah),
                    'mata_kuliah' => $mataKuliah,
                ];
            });

        $transkripData = [];
        $allNilai = NilaiMahasiswa::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->with(['kelas.mataKuliahPeriode.mataKuliah', 'kelas.mataKuliahPeriode'])
            ->get();

        foreach ($allNilai as $nilai) {
            $mataKuliah = $nilai->kelas?->mataKuliahPeriode?->mataKuliah;
            $mkPeriode = $nilai->kelas?->mataKuliahPeriode;

            if (!$mataKuliah || !$mkPeriode) {
                continue;
            }

            $kategori = strtolower($mataKuliah->kategori ?? '');
            $jenis = $kategori === 'umum' ? 'Umum' : ($kategori === 'wajib' ? 'Wajib' : 'Pilihan');

            $transkripData[] = [
                'kode_mk' => $mataKuliah->kode_matkul,
                'nama_mk' => $mataKuliah->nama_matkul,
                'total_sks' => $mataKuliah->sks,
                'jenis' => $jenis,
                'semester_pengambilan' => ucfirst($mkPeriode->jenis_semester).' '.explode('/', $mkPeriode->tahun_ajaran)[0],
                'bobot' => $this->getBobotNilai($nilai->nilai_huruf),
                'nilai' => $nilai->nilai_huruf,
            ];
        }

        $statistik = [
            'total_sks' => $allNilai->sum(fn ($nilai) => $nilai->kelas?->mataKuliahPeriode?->mataKuliah?->sks ?? 0),
            'sks_lulus' => $allNilai->filter(fn ($nilai) => in_array($nilai->nilai_huruf, ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C']))
                ->sum(fn ($nilai) => $nilai->kelas?->mataKuliahPeriode?->mataKuliah?->sks ?? 0),
            'ipk' => $this->hitungIPK($allNilai),
        ];

        $prestasiAkademik = [
            'jumlah_sks_matakuliah' => [
                'wajib' => $allNilai->filter(function ($nilai) {
                    return strtolower($nilai->kelas?->mataKuliahPeriode?->mataKuliah?->kategori ?? '') === 'wajib'
                        && in_array($nilai->nilai_huruf, ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C']);
                })->sum(fn ($nilai) => $nilai->kelas?->mataKuliahPeriode?->mataKuliah?->sks ?? 0),
                'pilihan' => $allNilai->filter(function ($nilai) {
                    return strtolower($nilai->kelas?->mataKuliahPeriode?->mataKuliah?->kategori ?? '') === 'pilihan'
                        && in_array($nilai->nilai_huruf, ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C']);
                })->sum(fn ($nilai) => $nilai->kelas?->mataKuliahPeriode?->mataKuliah?->sks ?? 0),
                'total' => $statistik['total_sks'],
            ],
            'total_sks_bobot' => $allNilai->sum(function ($nilai) {
                $sks = $nilai->kelas?->mataKuliahPeriode?->mataKuliah?->sks ?? 0;
                return $sks * $this->getBobotNilai($nilai->nilai_huruf);
            }),
            'ipk' => $statistik['ipk'],
            'predikat' => $this->getPredikat($statistik['ipk']),
        ];

        $keteranganNilai = [
            'A' => '4.00', 'A-' => '3.75', 'B+' => '3.50',
            'B' => '3.00', 'B-' => '2.75', 'C+' => '2.50',
            'C' => '2.00', 'D' => '1.00', 'E' => '0.00',
        ];

        $registrasiSemester = RegistrasiSemester::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->orderBy('semester', 'desc')
            ->get();

        $mahasiswa->semester_ke = $registrasiSemester->count();
        $mahasiswa->semester_aktif = $registrasiSemester->where('status_semester', 'aktif')->count();

        return Inertia::render('Dosen/MahasiswaWali/Show', [
            'mahasiswa' => $mahasiswa,
            'rencanaStudiData' => $rencanaStudiData,
            'hasilStudiData' => $hasilStudiData,
            'transkripData' => $transkripData,
            'statistik' => $statistik,
            'prestasiAkademik' => $prestasiAkademik,
            'keteranganNilai' => $keteranganNilai,
            'statistikNilai' => $this->getStatistikNilaiLengkap($allNilai),
        ]);
    }
}
