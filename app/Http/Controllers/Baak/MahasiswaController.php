<?php

namespace App\Http\Controllers\Baak;

use App\Helpers\NimGenerator;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMahasiswaRequest;
use App\Http\Requests\UpdateMahasiswaRequest;
use App\Models\Dosen;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\NilaiMahasiswa;
use App\Models\Prodi;
use App\Models\RegistrasiSemester;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\MahasiswaDataExport;
use App\Exports\MahasiswaTemplateExport;
use App\Imports\MahasiswaImport;
use Inertia\Inertia;

class MahasiswaController extends Controller
{
    public function index()
    {
        $search = request('search');
        $kodeProdi = request('kode_prodi');
        $status = request('status');
        $sortField = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');

        $allowedSorts = ['nama', 'nim', 'tahun_masuk', 'created_at'];
        if (!in_array($sortField, $allowedSorts)) {
            $sortField = 'created_at';
        }
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'desc';
        }

        $mahasiswas = Mahasiswa::with(['prodi', 'dosenWali'])
            ->when(
                $search,
                fn ($query) => $query->where(function ($query) use ($search) {
                    $query->where('nim', 'like', '%'.$search.'%')
                        ->orWhere('nama', 'like', '%'.$search.'%');
                })
            )
            ->when(
                $kodeProdi,
                fn ($query) => $query->where('kode_prodi', $kodeProdi)
            )
            ->when(
                $status,
                fn ($query) => $query->where('status', $status)
            )
            ->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->withQueryString();

        $prodis = Prodi::orderBy('nama_prodi')->get();
        $mahasiswaTanpaNimCount = Mahasiswa::whereNull('nim')->count();
        $stats = [
            'total' => Mahasiswa::count(),
            'aktif' => Mahasiswa::where('status', 'aktif')->count(),
            'nonaktif' => Mahasiswa::where('status', '!=', 'aktif')->count(),
            'lulus' => Mahasiswa::where('status', 'lulus')->count(),
            'tanpa_nim' => $mahasiswaTanpaNimCount,
        ];

        return Inertia::render('Baak/Mahasiswa/Index', [
            'mahasiswas' => $mahasiswas,
            'prodis' => $prodis,
            'mahasiswaTanpaNimCount' => $mahasiswaTanpaNimCount,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'kode_prodi' => $kodeProdi,
                'status' => $status,
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
            ],
        ]);
    }

    public function create()
    {
        $prodis = Prodi::orderBy('nama_prodi')->get();
        $dosens = Dosen::select('id_dosen', 'nama', 'nip')->get();

        return Inertia::render('Baak/Mahasiswa/TambahMahasiswa', [
            'prodis' => $prodis,
            'dosens' => $dosens,
        ]);
    }

    /**
     * Generate NIM untuk semua mahasiswa yang belum memiliki NIM.
     * Dikelompokkan berdasarkan kode_prodi dan tahun_masuk,
     * diurutkan berdasarkan nama (alfabet) dalam setiap kelompok.
     */
    public function generateNim()
    {
        $mahasiswaTanpaNim = Mahasiswa::whereNull('nim')
            ->orderBy('kode_prodi')
            ->orderBy('tahun_masuk')
            ->orderBy('nama')
            ->get();

        if ($mahasiswaTanpaNim->isEmpty()) {
            return back()->with('info', 'Semua mahasiswa sudah memiliki NIM.');
        }

        $count = 0;

        // Kelompokkan berdasarkan kode_prodi + tahun_masuk
        $grouped = $mahasiswaTanpaNim->groupBy(function ($mhs) {
            return $mhs->kode_prodi.'_'.$mhs->tahun_masuk;
        });

        foreach ($grouped as $group) {
            $firstMhs = $group->first();
            $kodeProdi = $firstMhs->kode_prodi;
            $tahunMasuk = $firstMhs->tahun_masuk;

            DB::transaction(function () use ($kodeProdi, $tahunMasuk, &$count) {
                $mahasiswaSeangkatan = Mahasiswa::where('kode_prodi', $kodeProdi)
                    ->where('tahun_masuk', $tahunMasuk)
                    ->orderBy('nama')
                    ->orderBy('id_mahasiswa')
                    ->get();

                $mahasiswaSeangkatan->each->update(['nim' => null]);

                foreach ($mahasiswaSeangkatan as $index => $mhs) {
                    $nim = NimGenerator::generateFromSequence($kodeProdi, $tahunMasuk, $index + 1);

                    $mhs->update(['nim' => $nim]);

                    if ($mhs->user) {
                        $mhs->user->update([
                            'username' => $nim,
                            'password' => Hash::make($nim),
                        ]);
                    }

                    $count++;
                }
            });
        }

        return back()->with('success', "Berhasil generate dan mengurutkan NIM untuk {$count} mahasiswa.");
    }

    public function store(StoreMahasiswaRequest $request)
    {
        $data = $request->validated();

        // Generate email dari nama
        $emailUsername = strtolower(str_replace(' ', '', $data['nama']));
        $data['email'] = $emailUsername.'@student.itbriau.ac.id';

        // Handle foto upload
        if ($request->hasFile('foto')) {
            $data['foto'] = $request->file('foto')->store('mahasiswa', 'public');
        }

        // Create user dengan temporary username (akan diupdate saat generate NIM)
        $tempUsername = 'temp_'.time().'_'.rand(1000, 9999);
        $user = User::create([
            'role' => 'mahasiswa',
            'username' => $tempUsername,
            'email' => $data['email'],
            'password' => Hash::make($tempUsername),
        ]);

        // Create mahasiswa tanpa NIM
        $data['user_id'] = $user->id;
        $data['nim'] = null;
        unset($data['email']);

        Mahasiswa::create($data);

        return redirect()->route('baak.mahasiswa.index')
            ->with('success', 'Mahasiswa berhasil ditambahkan. Silakan generate NIM melalui tombol "Generate NIM".');
    }

    public function show(Mahasiswa $mahasiswa)
    {
        $mahasiswa->load(['prodi', 'dosenWali', 'user']);

        // ========================================
        // DATA UNTUK TAB RENCANA STUDI (KRS)
        // ========================================
        $rencanaStudiData = Krs::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->with(['detailKrs.kelas' => function ($q) {
                $q->with([
                    'mataKuliahPeriode.mataKuliah',
                    'dosen',
                ]);
            }])
            ->orderBy('semester', 'asc')
            ->get()
            ->map(function ($krs) {
                $mataKuliah = $krs->detailKrs->map(function ($detail) {
                    $mk = $detail->kelas->mataKuliahPeriode->mataKuliah;
                    $kelas = $detail->kelas;

                    return [
                        'kode_mk' => $mk->kode_matkul,
                        'nama_mk' => $mk->nama_matkul,
                        'nama_kelas' => $kelas->nama_kelas,
                        'sks' => $mk->sks,
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

        // ========================================
        // DATA UNTUK TAB HASIL STUDI (KHS)
        // ========================================
        $hasilStudiData = Krs::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->with(['detailKrs.kelas.mataKuliahPeriode.mataKuliah'])
            ->orderBy('semester', 'asc')
            ->get()
            ->map(function ($krs) use ($mahasiswa) {
                $mataKuliah = $krs->detailKrs->map(function ($detail) use ($krs) {
                    $mk = $detail->kelas->mataKuliahPeriode->mataKuliah;

                    $nilai = NilaiMahasiswa::where('id_mahasiswa', $krs->id_mahasiswa)
                        ->where('id_kelas', $detail->id_kelas)
                        ->first();

                    return [
                        'kode_mk' => $mk->kode_matkul,
                        'nama_mk' => $mk->nama_matkul,
                        'sks' => $mk->sks,
                        'bobot' => $nilai ? $this->getBobotNilai($nilai->nilai_huruf) : 0,
                        'nilai' => $nilai ? $nilai->nilai_huruf : '-',
                    ];
                });

                $ips = $this->hitungIPSFromCollection($mataKuliah);
                $ipk = $this->hitungIPKSampaiSemester($mahasiswa->id_mahasiswa, $krs->semester);

                return [
                    'no' => $krs->semester,
                    'periode' => $krs->tahun_ajaran,
                    'semester' => $krs->semester % 2 === 0 ? 'Genap' : 'Ganjil',
                    'sks_semester' => $mataKuliah->sum('sks'),
                    'ips' => $ips,
                    'sks_kumulatif' => $this->hitungSKSKumulatif($mahasiswa->id_mahasiswa, $krs->semester),
                    'ipk' => $ipk,
                    'distribusi_nilai' => $this->getDistribusiNilai($mataKuliah),
                    'mata_kuliah' => $mataKuliah,
                ];
            });

        // ========================================
        // DATA UNTUK TAB TRANSKRIP NILAI
        // ========================================
        $transkripData = [];
        $allNilai = NilaiMahasiswa::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->with(['kelas.mataKuliahPeriode.mataKuliah', 'kelas.mataKuliahPeriode'])
            ->get();

        foreach ($allNilai as $nilai) {
            $mk = $nilai->kelas->mataKuliahPeriode->mataKuliah;
            $mkPeriode = $nilai->kelas->mataKuliahPeriode;

            // Tentukan jenis berdasarkan kategori
            if ($mk->kategori === 'umum') {
                $jenis = 'Umum';
            } elseif ($mk->kategori === 'wajib') {
                $jenis = 'Wajib';
            } else { // pilihan
                $jenis = 'Pilihan';
            }

            $transkripData[] = [
                'kode_mk' => $mk->kode_matkul,
                'nama_mk' => $mk->nama_matkul,
                'total_sks' => $mk->sks,
                'jenis' => $jenis,
                'semester_pengambilan' => ucfirst($mkPeriode->jenis_semester).' '.explode('/', $mkPeriode->tahun_ajaran)[0],
                'bobot' => $this->getBobotNilai($nilai->nilai_huruf),
                'nilai' => $nilai->nilai_huruf,
            ];
        }

        // ========================================
        // STATISTIK UMUM
        // ========================================
        $statistik = [
            'total_sks' => $allNilai->sum(fn ($nilai) => $nilai->kelas->mataKuliahPeriode->mataKuliah->sks),
            'sks_lulus' => $allNilai->filter(fn ($nilai) => in_array($nilai->nilai_huruf, ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C']))
                ->sum(fn ($nilai) => $nilai->kelas->mataKuliahPeriode->mataKuliah->sks),
            'ipk' => $this->hitungIPK($allNilai),
        ];

        // Prestasi akademik untuk transkrip
        $prestasiAkademik = [
            'jumlah_sks_matakuliah' => [
                'wajib' => $allNilai->filter(function ($nilai) {
                    return strtolower($nilai->kelas->mataKuliahPeriode->mataKuliah->kategori) === 'wajib' &&
                           in_array($nilai->nilai_huruf, ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C']);
                })->sum(fn ($nilai) => $nilai->kelas->mataKuliahPeriode->mataKuliah->sks),
                'pilihan' => $allNilai->filter(function ($nilai) {
                    return strtolower($nilai->kelas->mataKuliahPeriode->mataKuliah->kategori) === 'pilihan' &&
                           in_array($nilai->nilai_huruf, ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C']);
                })->sum(fn ($nilai) => $nilai->kelas->mataKuliahPeriode->mataKuliah->sks),
                'total' => $statistik['total_sks'],
            ],
            'total_sks_bobot' => $allNilai->sum(function ($nilai) {
                return $nilai->kelas->mataKuliahPeriode->mataKuliah->sks * $this->getBobotNilai($nilai->nilai_huruf);
            }),
            'ipk' => $statistik['ipk'],
            'predikat' => $this->getPredikat($statistik['ipk']),
        ];

        // Keterangan nilai untuk transkrip
        $keteranganNilai = [
            'A' => '4.00', 'A-' => '3.75', 'B+' => '3.50',
            'B' => '3.00', 'B-' => '2.75', 'C+' => '2.50',
            'C' => '2.00', 'D' => '1.00', 'E' => '0.00',
        ];

        // Statistik nilai untuk transkrip
        $statistikNilai = $this->getStatistikNilaiLengkap($allNilai);

        // Tambahkan semester info
        $registrasiSemester = RegistrasiSemester::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->orderBy('semester', 'desc')
            ->get();

        $mahasiswa->semester_ke = $registrasiSemester->count();
        $mahasiswa->semester_aktif = $registrasiSemester->where('status_semester', 'aktif')->count();

        return Inertia::render('Baak/Mahasiswa/DetailMahasiswa', [
            'mahasiswa' => $mahasiswa,
            'rencanaStudiData' => $rencanaStudiData,
            'hasilStudiData' => $hasilStudiData,
            'transkripData' => $transkripData,
            'statistik' => $statistik,
            'prestasiAkademik' => $prestasiAkademik,
            'keteranganNilai' => $keteranganNilai,
            'statistikNilai' => $statistikNilai,
        ]);
    }

    public function edit(Mahasiswa $mahasiswa)
    {
        $mahasiswa->load(['prodi']);
        $prodis = Prodi::orderBy('nama_prodi')->get();
        $dosens = Dosen::select('id_dosen', 'nama', 'nip')->get();

        return Inertia::render('Baak/Mahasiswa/EditMahasiswa', [
            'mahasiswa' => $mahasiswa,
            'prodis' => $prodis,
            'dosens' => $dosens,
        ]);
    }

    public function update(UpdateMahasiswaRequest $request, Mahasiswa $mahasiswa)
    {
        $data = $request->validated();

        if ($request->hasFile('foto')) {
            if ($mahasiswa->foto) {
                Storage::disk('public')->delete($mahasiswa->foto);
            }
            $data['foto'] = $request->file('foto')->store('mahasiswa', 'public');
        }

        $mahasiswa->update($data);

        return redirect()->route('baak.mahasiswa.index')
            ->with('success', 'Data mahasiswa berhasil diupdate');
    }

    public function destroy(Mahasiswa $mahasiswa)
    {
        if ($mahasiswa->foto) {
            Storage::disk('public')->delete($mahasiswa->foto);
        }

        if ($mahasiswa->user) {
            $mahasiswa->user->delete();
        }

        $mahasiswa->delete();

        return redirect()->route('baak.mahasiswa.index')
            ->with('success', 'Data mahasiswa berhasil dihapus');
    }

    public function resetPassword(Mahasiswa $mahasiswa)
    {
        if (! $mahasiswa->user) {
            return back()->withErrors(['error' => 'User tidak ditemukan']);
        }

        $mahasiswa->user->update([
            'password' => Hash::make($mahasiswa->nim),
        ]);

        return back()->with('success', 'Password berhasil direset ke NIM: '.$mahasiswa->nim);
    }

    public function exportExcel()
    {
        return Excel::download(new MahasiswaDataExport, 'data_mahasiswa.xlsx');
    }

    public function exportTemplate()
    {
        return Excel::download(new MahasiswaTemplateExport, 'template_import_mahasiswa.xlsx');
    }

    public function importExcel(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:2048',
        ]);

        try {
            Excel::import(new MahasiswaImport, $request->file('file'));
            return redirect()->back()->with('success', 'Data mahasiswa berhasil diimport!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat import: ' . $e->getMessage());
        }
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    private function getBobotNilai($nilaiHuruf)
    {
        $bobotMap = [
            'A' => 4.00, 'A-' => 3.75, 'B+' => 3.50,
            'B' => 3.00, 'B-' => 2.75, 'C+' => 2.50,
            'C' => 2.00, 'D' => 1.00, 'E' => 0.00,
        ];

        return $bobotMap[$nilaiHuruf] ?? 0;
    }

    private function hitungIPSFromCollection($mataKuliahCollection)
    {
        $totalBobot = 0;
        $totalSks = 0;

        foreach ($mataKuliahCollection as $mk) {
            if (isset($mk['nilai']) && ($mk['nilai'] === '-' || $mk['nilai'] === null)) {
                continue;
            }
            if ($mk['sks']) {
                $totalBobot += $mk['bobot'] * $mk['sks'];
                $totalSks += $mk['sks'];
            }
        }

        return $totalSks > 0 ? number_format($totalBobot / $totalSks, 2) : '0.00';
    }

    private function hitungIPKSampaiSemester($idMahasiswa, $sampaiSemester)
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

    private function hitungSKSKumulatif($idMahasiswa, $sampaiSemester)
    {
        $krs = Krs::where('id_mahasiswa', $idMahasiswa)
            ->where('semester', '<=', $sampaiSemester)
            ->with('detailKrs.kelas.mataKuliahPeriode.mataKuliah')
            ->get();

        $totalSks = 0;
        foreach ($krs as $k) {
            foreach ($k->detailKrs as $detail) {
                // Jangan hitung SKS jika nilainya '-' (belum diinput)
                $nilai = \App\Models\NilaiMahasiswa::where('id_kelas', $detail->id_kelas)
                    ->where('id_mahasiswa', $idMahasiswa)->first();
                if (!$nilai || $nilai->nilai_huruf === '-' || $nilai->nilai_huruf === null) {
                    continue;
                }
                $totalSks += $detail->kelas->mataKuliahPeriode->mataKuliah->sks;
            }
        }

        return $totalSks;
    }

    private function getDistribusiNilai($mataKuliahCollection)
    {
        $distribusi = ['A' => 0, 'B' => 0, 'C' => 0, 'D' => 0, 'E' => 0];

        foreach ($mataKuliahCollection as $mk) {
            $nilai = $mk['nilai'];
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

    private function hitungIPK($nilaiCollection)
    {
        $totalBobot = 0;
        $totalSks = 0;

        foreach ($nilaiCollection as $nilai) {
            if ($nilai->nilai_huruf === '-' || $nilai->nilai_huruf === null) {
                continue;
            }
            $bobot = $this->getBobotNilai($nilai->nilai_huruf);
            $sks = $nilai->kelas->mataKuliahPeriode->mataKuliah->sks;
            $totalBobot += $bobot * $sks;
            $totalSks += $sks;
        }

        return $totalSks > 0 ? number_format($totalBobot / $totalSks, 2) : '0.00';
    }

    private function getPredikat($ipk)
    {
        $ipkNum = floatval($ipk);
        if ($ipkNum >= 3.75) {
            return 'Summa Cum Laude';
        }
        if ($ipkNum >= 3.50) {
            return 'Magna Cum Laude';
        }
        if ($ipkNum >= 3.25) {
            return 'Cum Laude';
        }
        if ($ipkNum >= 3.00) {
            return 'Sangat Memuaskan';
        }
        if ($ipkNum >= 2.75) {
            return 'Memuaskan';
        }

        return 'Cukup';
    }

    private function getStatistikNilaiLengkap($nilaiCollection)
    {
        $stats = [];
        $gradeList = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'E'];

        $totalSks = $nilaiCollection->sum(fn ($n) => $n->kelas->mataKuliahPeriode->mataKuliah->sks);

        foreach ($gradeList as $grade) {
            $sks = $nilaiCollection->filter(fn ($n) => $n->nilai_huruf === $grade)
                ->sum(fn ($n) => $n->kelas->mataKuliahPeriode->mataKuliah->sks);

            $stats[] = [
                'nilai' => $grade,
                'sks' => $sks,
                'persentase' => $totalSks > 0 ? number_format(($sks / $totalSks) * 100, 4) : '0.0000',
            ];
        }

        return $stats;
    }
}
