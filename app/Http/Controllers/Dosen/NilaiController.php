<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\NilaiMahasiswa;
use App\Models\BobotNilai;
use App\Models\Prodi;
use App\Models\MataKuliah;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NilaiController extends Controller
{
    /**
     * Halaman utama nilai dengan filter
     */
    public function index(Request $request)
    {
        $dosen = auth()->user()->dosen;

        // Data untuk dropdown filter
        $prodiList = Prodi::select('kode_prodi', 'nama_prodi')->get();
        
        // Mata kuliah yang diampu dosen ini
        $mataKuliahList = MataKuliah::whereHas('mataKuliahPeriodes.kelas', function ($q) use ($dosen) {
            $q->where('id_dosen', $dosen->id_dosen);
        })->select('kode_mk', 'nama_mk')->get();

        $mahasiswaList = [];

        // Jika semua filter terisi, ambil data mahasiswa
        if ($request->filled(['prodi', 'mataKuliah', 'semester', 'kelas'])) {
            $kelas = Kelas::with([
                'mataKuliahPeriode.mataKuliah',
                'detailKrs.krs.mahasiswa.prodi',
                'nilais'
            ])
            ->whereHas('mataKuliahPeriode.mataKuliah', function ($q) use ($request) {
                $q->where('kode_mk', $request->mataKuliah);
            })
            ->where('nama_kelas', $request->kelas)
            ->where('id_dosen', $dosen->id_dosen)
            ->first();

            if ($kelas) {
                foreach ($kelas->detailKrs as $detail) {
                    $mahasiswa = $detail->krs->mahasiswa;
                    
                    // Filter berdasarkan prodi dan semester
                    if ($mahasiswa->kode_prodi !== $request->prodi) {
                        continue;
                    }

                    // Cari nilai mahasiswa
                    $nilai = $kelas->nilais->where('id_mahasiswa', $mahasiswa->id_mahasiswa)->first();

                    $mahasiswaList[] = [
                        'id_mahasiswa' => $mahasiswa->id_mahasiswa,
                        'id_kelas' => $kelas->id_kelas,
                        'id_nilai' => $nilai->id_nilai ?? null,
                        'nama' => $mahasiswa->nama,
                        'nim' => $mahasiswa->nim,
                        'nilai_akhir' => $nilai->nilai_akhir ?? null,
                        'nilai_huruf' => $nilai->nilai_huruf ?? null,
                        'is_locked' => $nilai->is_locked ?? false,
                        'has_nilai' => $nilai !== null,
                    ];
                }
            }
        }

        return Inertia::render('Dosen/Nilai/Nilai', [
            'prodiList' => $prodiList,
            'mataKuliahList' => $mataKuliahList,
            'mahasiswaList' => $mahasiswaList,
            'filters' => $request->only(['prodi', 'mataKuliah', 'semester', 'kelas']),
        ]);
    }

    /**
     * Halaman input nilai
     */
    public function create(Request $request)
    {
        $idMahasiswa = $request->id_mahasiswa;
        $idKelas = $request->id_kelas;

        $kelas = Kelas::with([
            'mataKuliahPeriode.mataKuliah',
            'bobotNilai'
        ])->findOrFail($idKelas);

        $mahasiswa = \App\Models\Mahasiswa::findOrFail($idMahasiswa);

        // Cek apakah sudah ada nilai
        $existingNilai = NilaiMahasiswa::where('id_mahasiswa', $idMahasiswa)
            ->where('id_kelas', $idKelas)
            ->first();

        if ($existingNilai) {
            return redirect()->route('dosen.edit_nilai', [
                'id_nilai' => $existingNilai->id_nilai
            ])->with('warning', 'Mahasiswa sudah memiliki nilai. Silakan edit nilai yang ada.');
        }

        // Ambil atau buat bobot nilai default
        $bobotNilai = $kelas->bobotNilai;
        if (!$bobotNilai) {
            $bobotNilai = BobotNilai::create([
                'id_kelas' => $idKelas,
                'bobot_tugas' => 30,
                'bobot_uts' => 35,
                'bobot_uas' => 35,
            ]);
        }

        return Inertia::render('Dosen/Nilai/InputNilai', [
            'mahasiswa' => [
                'id_mahasiswa' => $mahasiswa->id_mahasiswa,
                'nama' => $mahasiswa->nama,
                'nim' => $mahasiswa->nim,
            ],
            'kelas' => [
                'id_kelas' => $kelas->id_kelas,
                'nama_kelas' => $kelas->nama_kelas,
                'mata_kuliah' => $kelas->mataKuliah->nama_mk,
            ],
            'bobot' => [
                'tugas' => $bobotNilai->bobot_tugas,
                'uts' => $bobotNilai->bobot_uts,
                'uas' => $bobotNilai->bobot_uas,
            ],
        ]);
    }

    /**
     * Simpan nilai baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_mahasiswa' => 'required|exists:mahasiswa,id_mahasiswa',
            'id_kelas' => 'required|exists:kelas,id_kelas',
            'nilai_tugas' => 'required|numeric|min:0|max:100',
            'nilai_uts' => 'required|numeric|min:0|max:100',
            'nilai_uas' => 'required|numeric|min:0|max:100',
        ]);

        // Cek duplikasi
        $exists = NilaiMahasiswa::where('id_mahasiswa', $validated['id_mahasiswa'])
            ->where('id_kelas', $validated['id_kelas'])
            ->exists();

        if ($exists) {
            return back()->with('error', 'Nilai untuk mahasiswa ini sudah ada.');
        }

        // Buat nilai baru
        $nilai = NilaiMahasiswa::create([
            'id_mahasiswa' => $validated['id_mahasiswa'],
            'id_kelas' => $validated['id_kelas'],
            'nilai_tugas' => $validated['nilai_tugas'],
            'nilai_uts' => $validated['nilai_uts'],
            'nilai_uas' => $validated['nilai_uas'],
        ]);

        // Hitung nilai akhir
        $nilai->hitungNilaiAkhir();

        return redirect()->route('dosen.nilai')->with('success', 'Nilai berhasil disimpan.');
    }

    /**
     * Halaman edit nilai
     */
    public function edit($idNilai)
    {
        $nilai = NilaiMahasiswa::with([
            'mahasiswa',
            'kelas.mataKuliahPeriode.mataKuliah',
            'kelas.bobotNilai'
        ])->findOrFail($idNilai);

        // Cek apakah nilai sudah dikunci
        if ($nilai->is_locked) {
            return back()->with('error', 'Nilai sudah dikunci dan tidak dapat diubah.');
        }

        $bobotNilai = $nilai->kelas->bobotNilai;
        if (!$bobotNilai) {
            $bobotNilai = BobotNilai::create([
                'id_kelas' => $nilai->id_kelas,
                'bobot_tugas' => 30,
                'bobot_uts' => 35,
                'bobot_uas' => 35,
            ]);
        }

        return Inertia::render('Dosen/Nilai/EditNilai', [
            'nilai' => [
                'id_nilai' => $nilai->id_nilai,
                'nilai_tugas' => $nilai->nilai_tugas,
                'nilai_uts' => $nilai->nilai_uts,
                'nilai_uas' => $nilai->nilai_uas,
                'nilai_akhir' => $nilai->nilai_akhir,
                'nilai_huruf' => $nilai->nilai_huruf,
            ],
            'mahasiswa' => [
                'id_mahasiswa' => $nilai->mahasiswa->id_mahasiswa,
                'nama' => $nilai->mahasiswa->nama,
                'nim' => $nilai->mahasiswa->nim,
            ],
            'kelas' => [
                'id_kelas' => $nilai->kelas->id_kelas,
                'nama_kelas' => $nilai->kelas->nama_kelas,
                'mata_kuliah' => $nilai->kelas->mataKuliah->nama_mk,
            ],
            'bobot' => [
                'tugas' => $bobotNilai->bobot_tugas,
                'uts' => $bobotNilai->bobot_uts,
                'uas' => $bobotNilai->bobot_uas,
            ],
        ]);
    }

    /**
     * Update nilai
     */
    public function update(Request $request, $idNilai)
    {
        $nilai = NilaiMahasiswa::findOrFail($idNilai);

        // Cek apakah nilai sudah dikunci
        if ($nilai->is_locked) {
            return back()->with('error', 'Nilai sudah dikunci dan tidak dapat diubah.');
        }

        $validated = $request->validate([
            'nilai_tugas' => 'required|numeric|min:0|max:100',
            'nilai_uts' => 'required|numeric|min:0|max:100',
            'nilai_uas' => 'required|numeric|min:0|max:100',
        ]);

        $nilai->update($validated);
        $nilai->hitungNilaiAkhir();

        return redirect()->route('dosen.nilai')->with('success', 'Nilai berhasil diupdate.');
    }

    /**
     * API: Get kelas berdasarkan mata kuliah
     */
    public function getKelasByMataKuliah(Request $request)
    {
        $dosen = auth()->user()->dosen;
        $kodeMk = $request->kode_mk;

        $kelasList = Kelas::with('mataKuliahPeriode.mataKuliah')
            ->whereHas('mataKuliahPeriode.mataKuliah', function ($q) use ($kodeMk) {
                $q->where('kode_mk', $kodeMk);
            })
            ->where('id_dosen', $dosen->id_dosen)
            ->get()
            ->map(function ($kelas) {
                return [
                    'value' => $kelas->nama_kelas,
                    'label' => $kelas->nama_kelas,
                ];
            });

        return response()->json($kelasList);
    }
}