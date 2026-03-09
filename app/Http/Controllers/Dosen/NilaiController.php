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
        
        $periodeAktif = \App\Models\PeriodeRegistrasi::getPeriodeAktif();
        $idPeriodeAktif = $periodeAktif ? $periodeAktif->id_periode : null;

        // Ambil kelas yang diampu dosen ini untuk ditampilkan
        $kelasList = Kelas::with(['mataKuliahPeriode.mataKuliah', 'mataKuliahPeriode.periode'])
            ->where('id_dosen', $dosen->id_dosen)
            ->when($idPeriodeAktif, function ($query) use ($idPeriodeAktif) {
                $query->whereHas('mataKuliahPeriode', function ($q) use ($idPeriodeAktif) {
                    $q->where('id_periode', $idPeriodeAktif);
                });
            })
            ->get()
            ->map(function ($kelas) {
                // Return data yang diperlukan untuk UI
                return [
                    'id_kelas' => $kelas->id_kelas,
                    'nama_kelas' => $kelas->nama_kelas,
                    'mata_kuliah' => [
                        'kode_matkul' => $kelas->mataKuliahPeriode->mataKuliah->kode_matkul ?? '-',
                        'nama_matkul' => $kelas->mataKuliahPeriode->mataKuliah->nama_matkul ?? '-',
                        'sks' => $kelas->mataKuliahPeriode->mataKuliah->sks ?? 0,
                    ],
                    'periode' => [
                        'tahun_ajaran' => $kelas->mataKuliahPeriode->periode->tahun_ajaran ?? '-',
                        'jenis_semester' => $kelas->mataKuliahPeriode->periode->jenis_semester ?? '-',
                    ],
                    'hari' => $kelas->hari,
                    'jam_mulai' => $kelas->jam_mulai ? \Carbon\Carbon::parse($kelas->jam_mulai)->format('H:i') : null,
                    'jam_selesai' => $kelas->jam_selesai ? \Carbon\Carbon::parse($kelas->jam_selesai)->format('H:i') : null,
                    'ruang_kelas' => $kelas->ruang_kelas,
                ];
            });

        return Inertia::render('Dosen/Nilai/Index', [
            'kelasList' => $kelasList,
        ]);
    }

    /**
     * Halaman detail nilai kelas (List mahasiswa)
     */
    public function show($idKelas)
    {
        $dosen = auth()->user()->dosen;

        // Validasi dan ambil data kelas
        $kelas = Kelas::with([
            'mataKuliahPeriode.mataKuliah',
            'mataKuliahPeriode.periode',
            'detailKrs.krs.mahasiswa',
            'nilais'
        ])
        ->where('id_kelas', $idKelas)
        ->where('id_dosen', $dosen->id_dosen)
        ->firstOrFail();

        $mahasiswaList = [];

        foreach ($kelas->detailKrs as $detail) {
            $mahasiswa = $detail->krs->mahasiswa;
            
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

        return Inertia::render('Dosen/Nilai/Show', [
            'kelasData' => [
                'id_kelas' => $kelas->id_kelas,
                'nama_kelas' => $kelas->nama_kelas,
                'mata_kuliah' => [
                    'kode_matkul' => $kelas->mataKuliahPeriode->mataKuliah->kode_matkul ?? '-',
                    'nama_matkul' => $kelas->mataKuliahPeriode->mataKuliah->nama_matkul ?? '-',
                    'sks' => $kelas->mataKuliahPeriode->mataKuliah->sks ?? 0,
                ],
                'periode' => [
                    'tahun_ajaran' => $kelas->mataKuliahPeriode->periode->tahun_ajaran ?? '-',
                    'jenis_semester' => $kelas->mataKuliahPeriode->periode->jenis_semester ?? '-',
                ],
            ],
            'mahasiswaList' => $mahasiswaList,
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
                'mata_kuliah' => $kelas->mataKuliahPeriode->mataKuliah->nama_matkul ?? '-',
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
                'mata_kuliah' => $nilai->kelas->mataKuliahPeriode->mataKuliah->nama_matkul ?? '-',
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
                $q->where('mata_kuliah.kode_matkul', $kodeMk);
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