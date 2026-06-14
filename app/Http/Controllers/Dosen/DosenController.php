<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\NilaiMahasiswa;
use App\Models\Pertemuan;
use App\Models\Dosen;
use App\Models\PeriodeRegistrasi;
use App\Models\RegistrasiSemester;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class DosenController extends Controller
{
    public function dashboard()
    {
        $dosen = Auth::user()->dosen;

        if (!$dosen) {
            abort(403, 'Unauthorized action.');
        }

        $periodeAktif = PeriodeRegistrasi::getPeriodeTerakhir();

        // 1. Get all classes taught by this lecturer in the active period
        $kelasList = Kelas::with(['mataKuliahPeriode.mataKuliah'])
            ->where('id_dosen', $dosen->id_dosen)
            ->forPeriode($periodeAktif)
            ->get();

        $idKelasArray = $kelasList->pluck('id_kelas')->toArray();

        // 2. Calculate Total Mahasiswa
        // Summing the count of detailKrs for each class
        $totalMahasiswa = Kelas::withCount('detailKrs')
            ->where('id_dosen', $dosen->id_dosen)
            ->forPeriode($periodeAktif)
            ->get()
            ->sum('detail_krs_count');

        // 3. Calculate Pertemuan Minggu Ini
        // Using Carbon to get the start and end of the current week
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();
        
        $pertemuanMingguIni = Pertemuan::whereIn('id_kelas', $idKelasArray)
            ->whereBetween('tanggal', [$startOfWeek, $endOfWeek])
            ->count();

        // 4. Jadwal Hari Ini
        // Get the current day name in Indonesian
        $hariIni = Carbon::now()->locale('id')->isoFormat('dddd');
        
        $jadwalHariIni = $kelasList->filter(function ($kelas) use ($hariIni) {
            return strtolower($kelas->hari) === strtolower($hariIni);
        })->map(function ($kelas) {
            return [
                'id_kelas' => $kelas->id_kelas,
                'mata_kuliah' => $kelas->mataKuliahPeriode->mataKuliah->nama_matkul ?? 'Unknown',
                'waktu' => Carbon::parse($kelas->jam_mulai)->format('H:i') . ' - ' . Carbon::parse($kelas->jam_selesai)->format('H:i'),
                'ruangan' => $kelas->ruang_kelas,
                'nama_kelas' => $kelas->nama_kelas,
            ];
        })->values();

        // 5. Daftar Kelas (Formatted for the table)
        $daftarKelas = $kelasList->map(function ($kelas) {
            return [
                'id_kelas' => $kelas->id_kelas,
                'mata_kuliah' => $kelas->mataKuliahPeriode->mataKuliah->nama_matkul ?? 'Unknown',
                'sks' => $kelas->mataKuliahPeriode->mataKuliah->sks ?? 0,
                'nama_kelas' => $kelas->nama_kelas,
                'hari' => $kelas->hari,
                'waktu' => Carbon::parse($kelas->jam_mulai)->format('H:i') . ' - ' . Carbon::parse($kelas->jam_selesai)->format('H:i'),
                'ruangan' => $kelas->ruang_kelas,
            ];
        });

        // 6. Grafik Nilai (Rata-rata per kelas)
        // We need to load nilais to calculate the average
        $kelasWithNilai = Kelas::with(['nilais', 'mataKuliahPeriode.mataKuliah'])
            ->where('id_dosen', $dosen->id_dosen)
            ->forPeriode($periodeAktif)
            ->get();
            
        $grafikNilaiLabels = [];
        $grafikNilaiData = [];

        foreach ($kelasWithNilai as $kelas) {
            $namaMatkul = $kelas->mataKuliahPeriode->mataKuliah->nama_matkul ?? 'Unknown';
            $label = $namaMatkul . ' (' . $kelas->nama_kelas . ')';
            
            $average = $kelas->nilais->avg('nilai_akhir') ?? 0;
            
            $grafikNilaiLabels[] = $label;
            $grafikNilaiData[] = round($average, 2);
        }

        return Inertia::render("Dosen/Index", [
            'dosen' => $dosen,
            'stats' => [
                'total_kelas' => $kelasList->count(),
                'total_mahasiswa' => $totalMahasiswa,
                'pertemuan_minggu_ini' => $pertemuanMingguIni,
            ],
            'daftar_kelas' => $daftarKelas,
            'jadwal_hari_ini' => $jadwalHariIni,
            'grafik_nilai' => [
                'labels' => $grafikNilaiLabels,
                'data' => $grafikNilaiData,
            ]
        ]);
    }

    public function mahasiswaWali(Request $request)
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

    public function showMahasiswaWali(Mahasiswa $mahasiswa)
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

    public function accKrs(Request $request)
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

    public function showAccKrs(Krs $krs)
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

    public function updateAccKrs(Request $request, Krs $krs)
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

    private function authorizeKrsWali(Krs $krs): void
    {
        $dosen = Auth::user()->dosen;

        if (!$dosen) {
            abort(403, 'Unauthorized action.');
        }

        $krs->loadMissing('mahasiswa');

        if (!$krs->mahasiswa || $krs->mahasiswa->id_dosen_wali !== $dosen->id_dosen) {
            abort(403, 'Anda tidak memiliki akses untuk KRS ini.');
        }
    }

    private function getBobotNilai($nilaiHuruf): float
    {
        $bobotMap = [
            'A' => 4.00, 'A-' => 3.75, 'B+' => 3.50,
            'B' => 3.00, 'B-' => 2.75, 'C+' => 2.50,
            'C' => 2.00, 'D' => 1.00, 'E' => 0.00,
        ];

        return $bobotMap[$nilaiHuruf] ?? 0;
    }

    private function hitungIPSFromCollection($mataKuliahCollection): string
    {
        $totalBobot = 0;
        $totalSks = 0;

        foreach ($mataKuliahCollection as $mataKuliah) {
            if (($mataKuliah['nilai'] ?? null) === '-' || ($mataKuliah['nilai'] ?? null) === null) {
                continue;
            }

            if ($mataKuliah['sks']) {
                $totalBobot += $mataKuliah['bobot'] * $mataKuliah['sks'];
                $totalSks += $mataKuliah['sks'];
            }
        }

        return $totalSks > 0 ? number_format($totalBobot / $totalSks, 2) : '0.00';
    }

    private function hitungIPKSampaiSemester($idMahasiswa, $sampaiSemester): string
    {
        $krsIds = Krs::where('id_mahasiswa', $idMahasiswa)
            ->where('semester', '<=', $sampaiSemester)
            ->pluck('id_krs');

        $kelasIds = \DB::table('detail_krs')
            ->whereIn('id_krs', $krsIds)
            ->pluck('id_kelas');

        $nilai = NilaiMahasiswa::where('id_mahasiswa', $idMahasiswa)
            ->whereIn('id_kelas', $kelasIds)
            ->with('kelas.mataKuliahPeriode.mataKuliah')
            ->get();

        return $this->hitungIPK($nilai);
    }

    private function hitungSKSKumulatif($idMahasiswa, $sampaiSemester): int
    {
        $krs = Krs::where('id_mahasiswa', $idMahasiswa)
            ->where('semester', '<=', $sampaiSemester)
            ->with('detailKrs.kelas.mataKuliahPeriode.mataKuliah')
            ->get();

        $totalSks = 0;
        foreach ($krs as $item) {
            foreach ($item->detailKrs as $detail) {
                $nilai = NilaiMahasiswa::where('id_kelas', $detail->id_kelas)
                    ->where('id_mahasiswa', $idMahasiswa)
                    ->first();

                if (!$nilai || $nilai->nilai_huruf === '-' || $nilai->nilai_huruf === null) {
                    continue;
                }

                $totalSks += $detail->kelas?->mataKuliahPeriode?->mataKuliah?->sks ?? 0;
            }
        }

        return $totalSks;
    }

    private function getDistribusiNilai($mataKuliahCollection): array
    {
        $distribusi = ['A' => 0, 'B' => 0, 'C' => 0, 'D' => 0, 'E' => 0];

        foreach ($mataKuliahCollection as $mataKuliah) {
            $nilai = $mataKuliah['nilai'];
            if (in_array($nilai, ['A', 'A-'])) {
                $distribusi['A']++;
            } elseif (in_array($nilai, ['B+', 'B', 'B-'])) {
                $distribusi['B']++;
            } elseif (in_array($nilai, ['C+', 'C'])) {
                $distribusi['C']++;
            } elseif ($nilai === 'D') {
                $distribusi['D']++;
            } elseif ($nilai === 'E') {
                $distribusi['E']++;
            }
        }

        return $distribusi;
    }

    private function hitungIPK($nilaiCollection): string
    {
        $totalBobot = 0;
        $totalSks = 0;

        foreach ($nilaiCollection as $nilai) {
            if ($nilai->nilai_huruf === '-' || $nilai->nilai_huruf === null) {
                continue;
            }

            $sks = $nilai->kelas?->mataKuliahPeriode?->mataKuliah?->sks ?? 0;
            $totalBobot += $this->getBobotNilai($nilai->nilai_huruf) * $sks;
            $totalSks += $sks;
        }

        return $totalSks > 0 ? number_format($totalBobot / $totalSks, 2) : '0.00';
    }

    private function getPredikat($ipk): string
    {
        $ipkNum = floatval($ipk);
        if ($ipkNum >= 3.75) return 'Summa Cum Laude';
        if ($ipkNum >= 3.50) return 'Magna Cum Laude';
        if ($ipkNum >= 3.25) return 'Cum Laude';
        if ($ipkNum >= 3.00) return 'Sangat Memuaskan';
        if ($ipkNum >= 2.75) return 'Memuaskan';

        return 'Cukup';
    }

    private function getStatistikNilaiLengkap($nilaiCollection): array
    {
        $stats = [];
        $gradeList = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'E'];
        $totalSks = $nilaiCollection->sum(fn ($nilai) => $nilai->kelas?->mataKuliahPeriode?->mataKuliah?->sks ?? 0);

        foreach ($gradeList as $grade) {
            $sks = $nilaiCollection->filter(fn ($nilai) => $nilai->nilai_huruf === $grade)
                ->sum(fn ($nilai) => $nilai->kelas?->mataKuliahPeriode?->mataKuliah?->sks ?? 0);

            $stats[] = [
                'nilai' => $grade,
                'sks' => $sks,
                'persentase' => $totalSks > 0 ? number_format(($sks / $totalSks) * 100, 4) : '0.0000',
            ];
        }

        return $stats;
    }

    public function nilai()
    {
        return Inertia::render("Dosen/Nilai/Index");
    }

    public function input_nilai()
    {
        return Inertia::render("Dosen/InputNilai");
    }

    public function edit_nilai()
    {
        return Inertia::render("Dosen/EditNilai");
    }
    public function rps()
    {
        return Inertia::render("Dosen/Rps");
    }
    public function tambah_rps()
    {
        return Inertia::render("Dosen/TambahRps");
    }
    public function edit_rps()
    {
        return Inertia::render("Dosen/EditRps");
    }
    public function absensi()
    {
        return Inertia::render("Dosen/Absensi");
    }
    public function jadwal()
    {
        return Inertia::render("Dosen/Jadwal");
    }
}
