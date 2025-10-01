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
            ->when($search, fn($query) =>
                $query->where('nim', 'like', '%' . $search . '%')
                      ->orWhere('nama', 'like', '%' . $search . '%')
            )
            ->when($kodeProdi, fn($query) =>
                $query->where('kode_prodi', $kodeProdi)
            )
            ->when($status, fn($query) =>
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
        unset($data['tahun_masuk'], $data['email']); // Remove fields not in mahasiswa table

        Mahasiswa::create($data);

        return redirect()->route('baak.mahasiswa.index')
            ->with('success', "Mahasiswa berhasil ditambahkan. NIM: {$data['nim']}, Password: {$data['nim']}");
    }

    public function show(Mahasiswa $mahasiswa)
    {
        $mahasiswa->load(['prodi.fakultas', 'dosenWali', 'user']);

        // Ambil data KRS
        $krsData = Krs::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->with(['detailKrs.kelas.mataKuliah'])
            ->orderBy('semester')
            ->get()
            ->map(function($krs) {
                $mataKuliah = $krs->detailKrs->map(function($detail) use ($krs) {
                    $nilai = NilaiMahasiswa::where('id_mahasiswa', $krs->id_mahasiswa)
                        ->where('id_kelas', $detail->id_kelas)
                        ->first();

                    return [
                        'kode_mk' => $detail->kelas->mataKuliah->kode_matkul,
                        'nama_mk' => $detail->kelas->mataKuliah->nama_matkul,
                        'sks' => $detail->kelas->mataKuliah->sks,
                        'nilai' => $nilai ? $nilai->nilai_huruf : '-',
                        'bobot' => $nilai ? $this->getBobotNilai($nilai->nilai_huruf) : '-',
                    ];
                });

                return [
                    'tahun_ajaran' => $krs->tahun_ajaran,
                    'semester_ke' => $krs->semester,
                    'mata_kuliah' => $mataKuliah,
                    'ips' => $this->hitungIPS($mataKuliah)
                ];
            });

        // Hitung statistik
        $allNilai = NilaiMahasiswa::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->with('kelas.mataKuliah')
            ->get();

        $statistik = [
            'total_sks' => $allNilai->sum(fn($nilai) => $nilai->kelas->mataKuliah->sks),
            'sks_lulus' => $allNilai->filter(fn($nilai) => $nilai->nilai_huruf != 'E')
                ->sum(fn($nilai) => $nilai->kelas->mataKuliah->sks),
            'ipk' => $this->hitungIPK($allNilai),
        ];

        // Tambahkan semester info
        $registrasiSemester = RegistrasiSemester::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->orderBy('semester', 'desc')
            ->get();

        $mahasiswa->semester_ke = $registrasiSemester->count();
        $mahasiswa->semester_aktif = $registrasiSemester->where('status_semester', 'aktif')->count();

        return Inertia::render('Baak/Mahasiswa/DetailMahasiswa', [
            'mahasiswa' => $mahasiswa,
            'krsData' => $krsData,
            'statistik' => $statistik,
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

        // Handle foto upload
        if ($request->hasFile('foto')) {
            // Delete old foto if exists
            if ($mahasiswa->foto) {
                Storage::disk('public')->delete($mahasiswa->foto);
            }
            $data['foto'] = $request->file('foto')->store('mahasiswa', 'public');
        }

        // Update mahasiswa
        $mahasiswa->update($data);

        return redirect()->route('baak.mahasiswa.index')
            ->with('success', 'Data mahasiswa berhasil diupdate');
    }

    public function destroy(Mahasiswa $mahasiswa)
    {
        // Delete foto if exists
        if ($mahasiswa->foto) {
            Storage::disk('public')->delete($mahasiswa->foto);
        }

        // Delete user if exists
        if ($mahasiswa->user) {
            $mahasiswa->user->delete();
        }

        // Delete mahasiswa
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

    // Helper methods
    private function getBobotNilai($nilaiHuruf)
    {
        $bobotMap = [
            'A' => 4.00, 'A-' => 3.75, 'B+' => 3.50,
            'B' => 3.00, 'B-' => 2.75, 'C+' => 2.50,
            'C' => 2.00, 'D' => 1.00, 'E' => 0.00,
        ];
        return $bobotMap[$nilaiHuruf] ?? 0;
    }

    private function hitungIPS($mataKuliahCollection)
    {
        $totalBobot = 0;
        $totalSks = 0;

        foreach ($mataKuliahCollection as $mk) {
            if ($mk['bobot'] !== '-' && $mk['sks']) {
                $totalBobot += $mk['bobot'] * $mk['sks'];
                $totalSks += $mk['sks'];
            }
        }

        return $totalSks > 0 ? number_format($totalBobot / $totalSks, 2) : '0.00';
    }

    private function hitungIPK($nilaiCollection)
    {
        $totalBobot = 0;
        $totalSks = 0;

        foreach ($nilaiCollection as $nilai) {
            $bobot = $this->getBobotNilai($nilai->nilai_huruf);
            $sks = $nilai->kelas->mataKuliah->sks;
            $totalBobot += $bobot * $sks;
            $totalSks += $sks;
        }

        return $totalSks > 0 ? number_format($totalBobot / $totalSks, 2) : '0.00';
    }
}
