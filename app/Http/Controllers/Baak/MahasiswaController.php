<?php

namespace App\Http\Controllers\Baak;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMahasiswaRequest;
use App\Http\Requests\UpdateMahasiswaRequest;
use App\Models\Mahasiswa;
use App\Models\Prodi;
use App\Models\Dosen;
use App\Models\User;
use App\Models\Krs;
use App\Models\NilaiMahasiswa;
use App\Models\RegistrasiSemester;
use App\Helpers\NimGenerator;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class MahasiswaController extends Controller
{
    public function index()
    {
        $search = request('search');
        $kodeProdi = request('kode_prodi');
        $status = request('status');

        $mahasiswas = Mahasiswa::with(['prodi.fakultas', 'dosenWali'])
            ->when(
                $search,
                fn($query) =>
                $query->where('nim', 'like', '%' . $search . '%')
                    ->orWhere('nama', 'like', '%' . $search . '%')
            )
            ->when(
                $kodeProdi,
                fn($query) =>
                $query->where('kode_prodi', $kodeProdi)
            )
            ->when(
                $status,
                fn($query) =>
                $query->where('status', $status)
            )
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $prodis = Prodi::with('fakultas')->get();

        return Inertia::render('Baak/Mahasiswa/Index', [
            'mahasiswas' => $mahasiswas,
            'prodis' => $prodis,
            'filters' => [
                'search' => $search,
                'kode_prodi' => $kodeProdi,
                'status' => $status,
            ],
        ]);
    }

    public function create()
    {
        $prodis = Prodi::with('fakultas')->get();
        $dosens = Dosen::select('id_dosen', 'nama', 'nip')->get();

        return Inertia::render('Baak/Mahasiswa/TambahMahasiswa', [
            'prodis' => $prodis,
            'dosens' => $dosens,
        ]);
    }

    public function store(StoreMahasiswaRequest $request)
    {
        $data = $request->validated();

        // Generate NIM
        $data['nim'] = NimGenerator::generate($data['kode_prodi'], $data['tahun_masuk']);

        // Generate email
        $emailUsername = strtolower(str_replace(' ', '', $data['nama']));
        $data['email'] = $emailUsername . '@student.itbriau.ac.id';

        // Handle foto upload
        if ($request->hasFile('foto')) {
            $data['foto'] = $request->file('foto')->store('mahasiswa', 'public');
        }

        // Create user
        $user = User::create([
            'role' => 'mahasiswa',
            'username' => $data['nim'],
            'email' => $data['email'],
            'password' => Hash::make($data['nim']),
        ]);

        // Create mahasiswa
        $data['user_id'] = $user->id;
        unset($data['tahun_masuk'], $data['email']);

        Mahasiswa::create($data);

        return redirect()->route('baak.mahasiswa.index')
            ->with('success', "Mahasiswa berhasil ditambahkan. NIM: {$data['nim']}, Password: {$data['nim']}");
    }

    public function show(Mahasiswa $mahasiswa)
    {
        $mahasiswa->load(['prodi.fakultas', 'dosenWali', 'user']);

        // ========================================
        // DATA UNTUK TAB RENCANA STUDI (KRS)
        // ========================================
        $rencanaStudiData = Krs::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->with(['detailKrs.kelas' => function($q) {
                $q->with([
                    'mataKuliahPeriode.mataKuliah',
                    'dosen'
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
                'semester_pengambilan' => ucfirst($mkPeriode->jenis_semester) . ' ' . explode('/', $mkPeriode->tahun_ajaran)[0],
                'bobot' => $this->getBobotNilai($nilai->nilai_huruf),
                'nilai' => $nilai->nilai_huruf,
            ];
        }

        // ========================================
        // STATISTIK UMUM
        // ========================================
        $statistik = [
            'total_sks' => $allNilai->sum(fn($nilai) => $nilai->kelas->mataKuliahPeriode->mataKuliah->sks),
            'sks_lulus' => $allNilai->filter(fn($nilai) => $nilai->nilai_huruf != 'E')
                ->sum(fn($nilai) => $nilai->kelas->mataKuliahPeriode->mataKuliah->sks),
            'ipk' => $this->hitungIPK($allNilai),
        ];

        // Prestasi akademik untuk transkrip
        $prestasiAkademik = [
            'jumlah_sks_matakuliah' => [
                'wajib' => $allNilai->filter(function($nilai) {
                    return $nilai->kelas->mataKuliahPeriode->mataKuliah->kategori === 'wajib';
                })->sum(fn($nilai) => $nilai->kelas->mataKuliahPeriode->mataKuliah->sks),
                'pilihan' => $allNilai->filter(function($nilai) {
                    return $nilai->kelas->mataKuliahPeriode->mataKuliah->kategori === 'pilihan';
                })->sum(fn($nilai) => $nilai->kelas->mataKuliahPeriode->mataKuliah->sks),
                'total' => $statistik['total_sks'],
            ],
            'total_sks_bobot' => $allNilai->sum(function($nilai) {
                return $nilai->kelas->mataKuliahPeriode->mataKuliah->sks * $this->getBobotNilai($nilai->nilai_huruf);
            }),
            'ipk' => $statistik['ipk'],
            'predikat' => $this->getPredikat($statistik['ipk']),
        ];

        // Keterangan nilai untuk transkrip
        $keteranganNilai = [
            'A' => '4.00', 'A-' => '3.75', 'B+' => '3.50',
            'B' => '3.00', 'B-' => '2.75', 'C+' => '2.50',
            'C' => '2.00', 'D' => '1.00', 'E' => '0.00', 'T' => '0.00'
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
        $mahasiswa->load(['prodi.fakultas']);
        $prodis = Prodi::with('fakultas')->get();
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
        if (!$mahasiswa->user) {
            return back()->withErrors(['error' => 'User tidak ditemukan']);
        }

        $mahasiswa->user->update([
            'password' => Hash::make($mahasiswa->nim)
        ]);

        return back()->with('success', 'Password berhasil direset ke NIM');
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
            if ($mk['bobot'] > 0 && $mk['sks']) {
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
            if (in_array($nilai, ['A', 'A-'])) $distribusi['A']++;
            elseif (in_array($nilai, ['B+', 'B', 'B-'])) $distribusi['B']++;
            elseif (in_array($nilai, ['C+', 'C'])) $distribusi['C']++;
            elseif ($nilai === 'D') $distribusi['D']++;
            elseif ($nilai === 'E') $distribusi['E']++;
        }

        return $distribusi;
    }

    private function hitungIPK($nilaiCollection)
    {
        $totalBobot = 0;
        $totalSks = 0;

        foreach ($nilaiCollection as $nilai) {
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
        if ($ipkNum >= 3.75) return 'Summa Cum Laude';
        if ($ipkNum >= 3.50) return 'Magna Cum Laude';
        if ($ipkNum >= 3.25) return 'Cum Laude';
        if ($ipkNum >= 3.00) return 'Sangat Memuaskan';
        if ($ipkNum >= 2.75) return 'Memuaskan';
        return 'Cukup';
    }

    private function getStatistikNilaiLengkap($nilaiCollection)
    {
        $stats = [];
        $gradeList = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'E'];

        $totalSks = $nilaiCollection->sum(fn($n) => $n->kelas->mataKuliahPeriode->mataKuliah->sks);

        foreach ($gradeList as $grade) {
            $sks = $nilaiCollection->filter(fn($n) => $n->nilai_huruf === $grade)
                ->sum(fn($n) => $n->kelas->mataKuliahPeriode->mataKuliah->sks);

            $stats[] = [
                'nilai' => $grade,
                'sks' => $sks,
                'persentase' => $totalSks > 0 ? number_format(($sks / $totalSks) * 100, 4) : '0.0000'
            ];
        }

        return $stats;
    }
}
