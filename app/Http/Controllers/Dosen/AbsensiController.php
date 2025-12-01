<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAbsensiRequest;
use App\Http\Requests\UpdateAbsensiRequest;
use App\Models\Kelas;
use App\Models\MataKuliahPeriode;
use App\Models\Pertemuan;
use App\Models\Absensi;
use App\Models\DetailKrs;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AbsensiController extends Controller
{
    // INDEX - Pilih Tahun Ajaran & List Mata Kuliah
    public function index()
    {
        $dosen = auth()->user()->dosen;

        // Get tahun ajaran yang tersedia
        $tahunAjaranList = MataKuliahPeriode::query()
            ->join('kelas', 'mata_kuliah_periode.id_mk_periode', '=', 'kelas.id_mk_periode')
            ->where('kelas.id_dosen', $dosen->id_dosen)
            ->distinct()
            ->orderBy('mata_kuliah_periode.tahun_ajaran', 'desc')
            ->pluck('mata_kuliah_periode.tahun_ajaran');

        // Default: ambil tahun ajaran terbaru
        $selectedTahunAjaran = request('tahun_ajaran', $tahunAjaranList->first());

        // Get mata kuliah berdasarkan tahun ajaran
        $mataKuliahList = MataKuliahPeriode::query()
            ->join('kelas', 'mata_kuliah_periode.id_mk_periode', '=', 'kelas.id_mk_periode')
            ->join('mata_kuliah', 'mata_kuliah_periode.kode_matkul', '=', 'mata_kuliah.kode_matkul')
            ->where('kelas.id_dosen', $dosen->id_dosen)
            ->where('mata_kuliah_periode.tahun_ajaran', $selectedTahunAjaran)
            ->select(
                'mata_kuliah_periode.id_mk_periode',
                'mata_kuliah.kode_matkul',
                'mata_kuliah.nama_matkul',
                'mata_kuliah.sks',
                'mata_kuliah_periode.tahun_ajaran',
                'mata_kuliah_periode.jenis_semester'
            )
            ->distinct()
            ->get()
            ->map(function ($mk) use ($dosen) {
                // Hitung jumlah kelas
                $jumlahKelas = Kelas::where('id_mk_periode', $mk->id_mk_periode)
                    ->where('id_dosen', $dosen->id_dosen)
                    ->count();

                $mk->jumlah_kelas = $jumlahKelas;
                return $mk;
            });

        return Inertia::render('Dosen/Absensi/Index', [
            'tahunAjaranList' => $tahunAjaranList,
            'selectedTahunAjaran' => $selectedTahunAjaran,
            'mataKuliahList' => $mataKuliahList,
        ]);
    }

    // SHOW MATA KULIAH - List Kelas
    public function showMataKuliah($idMkPeriode)
    {
        $dosen = auth()->user()->dosen;

        // Load mata kuliah periode dengan relasi mata kuliah
        $mataKuliahPeriode = MataKuliahPeriode::with('mataKuliah')
            ->findOrFail($idMkPeriode);

        $kelasList = Kelas::where('id_mk_periode', $idMkPeriode)
            ->where('id_dosen', $dosen->id_dosen)
            ->get()
            ->map(function ($kelas) {
                // Hitung jumlah mahasiswa
                $jumlahMahasiswa = DetailKrs::join('krs', 'detail_krs.id_krs', '=', 'krs.id_krs')
                    ->where('detail_krs.id_kelas', $kelas->id_kelas)
                    ->where('krs.status', 'approved')
                    ->count();

                // Hitung persentase kehadiran kelas
                $totalPertemuan = Pertemuan::where('id_kelas', $kelas->id_kelas)->count();

                $kelas->jumlah_mahasiswa = $jumlahMahasiswa;
                $kelas->total_pertemuan = $totalPertemuan;

                return $kelas;
            });

        return Inertia::render('Dosen/Absensi/ShowMataKuliah', [
            'mataKuliah' => [
                'id_mk_periode' => $mataKuliahPeriode->id_mk_periode,
                'tahun_ajaran' => $mataKuliahPeriode->tahun_ajaran ?? '-',
                'jenis_semester' => $mataKuliahPeriode->jenis_semester ?? '-',
                'mataKuliah' => [
                    'kode_matkul' => $mataKuliahPeriode->mataKuliah->kode_matkul ?? '-',
                    'nama_matkul' => $mataKuliahPeriode->mataKuliah->nama_matkul ?? 'Mata Kuliah',
                    'sks' => $mataKuliahPeriode->mataKuliah->sks ?? 0,
                ],
            ],
            'kelasList' => $kelasList,
        ]);
    }

    // SHOW KELAS - List Mahasiswa + Stats
    public function showKelas($idKelas)
    {
        $dosen = auth()->user()->dosen;

        $kelas = Kelas::with(['mataKuliahPeriode.mataKuliah', 'dosen'])
            ->findOrFail($idKelas);

        // Authorization check
        if ($kelas->id_dosen !== $dosen->id_dosen) {
            abort(403, 'Unauthorized');
        }

        // Get mahasiswa dengan statistik kehadiran
        $mahasiswaList = DetailKrs::query()
            ->join('krs', 'detail_krs.id_krs', '=', 'krs.id_krs')
            ->join('mahasiswa', 'krs.id_mahasiswa', '=', 'mahasiswa.id_mahasiswa')
            ->where('detail_krs.id_kelas', $idKelas)
            ->where('krs.status', 'approved')
            ->select('mahasiswa.*')
            ->orderBy('mahasiswa.nim')
            ->get()
            ->map(function ($mhs) use ($idKelas, $kelas) {
                // Hitung total pertemuan
                $totalPertemuan = Pertemuan::where('id_kelas', $idKelas)->count();

                // Hitung kehadiran mahasiswa (hanya hadir)
                $hadir = Absensi::join('pertemuan', 'absensi.id_pertemuan', '=', 'pertemuan.id_pertemuan')
                    ->where('pertemuan.id_kelas', $idKelas)
                    ->where('absensi.id_mahasiswa', $mhs->id_mahasiswa)
                    ->where('absensi.status', 'hadir')
                    ->count();

                $persentase = $totalPertemuan > 0
                    ? round(($hadir / $totalPertemuan) * 100, 1)
                    : 0;

                $mhs->total_pertemuan = $totalPertemuan;
                $mhs->hadir = $hadir;
                $mhs->persentase = $persentase;

                // Get detail presensi untuk modal
                $mhs->presensi_detail = Pertemuan::where('id_kelas', $idKelas)
                    ->orderBy('pertemuan_ke')
                    ->get()
                    ->map(function ($pertemuan) use ($mhs, $kelas) {
                        $absensi = Absensi::where('id_pertemuan', $pertemuan->id_pertemuan)
                            ->where('id_mahasiswa', $mhs->id_mahasiswa)
                            ->first();

                        return [
                            'pertemuan_ke' => $pertemuan->pertemuan_ke,
                            'tanggal' => $pertemuan->tanggal,
                            'jam_mulai' => $pertemuan->jam_mulai ?? $kelas->jam_mulai,
                            'jam_selesai' => $pertemuan->jam_selesai ?? $kelas->jam_selesai,
                            'status' => $absensi ? $absensi->status : null,
                        ];
                    });

                return $mhs;
            });

        return Inertia::render('Dosen/Absensi/ShowKelas', [
            'kelas' => $kelas,
            'mahasiswaList' => $mahasiswaList,
        ]);
    }

    // GET KELAS BY MATA KULIAH (API for AJAX)
    public function getKelasByMataKuliah($idMkPeriode)
    {
        $dosen = auth()->user()->dosen;

        $kelasList = Kelas::where('id_mk_periode', $idMkPeriode)
            ->where('id_dosen', $dosen->id_dosen)
            ->select('id_kelas', 'nama_kelas', 'hari', 'jam_mulai', 'jam_selesai', 'ruang_kelas')
            ->get();

        return response()->json($kelasList);
    }

    // GET KELAS DATA (Mahasiswa + Pertemuan count)
    public function getKelasData($idKelas)
    {
        // Get mahasiswa yang terdaftar di kelas
        $mahasiswa = DetailKrs::query()
            ->join('krs', 'detail_krs.id_krs', '=', 'krs.id_krs')
            ->join('mahasiswa', 'krs.id_mahasiswa', '=', 'mahasiswa.id_mahasiswa')
            ->where('detail_krs.id_kelas', $idKelas)
            ->where('krs.status', 'approved')
            ->select(
                'mahasiswa.id_mahasiswa',
                'mahasiswa.nim',
                'mahasiswa.nama'
            )
            ->orderBy('mahasiswa.nim')
            ->get();

        // Get jumlah pertemuan yang sudah ada
        $totalPertemuan = Pertemuan::where('id_kelas', $idKelas)->count();

        // Get kelas info
        $kelas = Kelas::with(['mataKuliahPeriode.mataKuliah'])
            ->findOrFail($idKelas);

        return response()->json([
            'mahasiswa' => $mahasiswa,
            'totalPertemuan' => $totalPertemuan,
            'kelas' => $kelas,
        ]);
    }

    // CREATE - Form Input Absensi
    public function create($idKelas)
    {
        $dosen = auth()->user()->dosen;

        $kelas = Kelas::with(['mataKuliahPeriode.mataKuliah', 'dosen'])
            ->findOrFail($idKelas);

        // Authorization check
        if ($kelas->id_dosen !== $dosen->id_dosen) {
            abort(403, 'Unauthorized');
        }

        // Get mahasiswa
        $mahasiswa = DetailKrs::query()
            ->join('krs', 'detail_krs.id_krs', '=', 'krs.id_krs')
            ->join('mahasiswa', 'krs.id_mahasiswa', '=', 'mahasiswa.id_mahasiswa')
            ->where('detail_krs.id_kelas', $idKelas)
            ->where('krs.status', 'approved')
            ->select(
                'mahasiswa.id_mahasiswa',
                'mahasiswa.nim',
                'mahasiswa.nama'
            )
            ->orderBy('mahasiswa.nim')
            ->get();

        // Get total pertemuan
        $totalPertemuan = Pertemuan::where('id_kelas', $idKelas)->count();

        // Serialize data kelas dengan proper structure
        $kelasData = [
            'id_kelas' => $kelas->id_kelas,
            'nama_kelas' => $kelas->nama_kelas,
            'id_mk_periode' => $kelas->id_mk_periode,
            'ruang_kelas' => $kelas->ruang_kelas,
            'hari' => $kelas->hari,
            'jam_mulai' => $kelas->jam_mulai,
            'jam_selesai' => $kelas->jam_selesai,
            'kapasitas' => $kelas->kapasitas,
            'mataKuliahPeriode' => [
                'id_mk_periode' => $kelas->mataKuliahPeriode->id_mk_periode ?? null,
                'mataKuliah' => [
                    'kode_matkul' => $kelas->mataKuliahPeriode->mataKuliah->kode_matkul ?? '-',
                    'nama_matkul' => $kelas->mataKuliahPeriode->mataKuliah->nama_matkul ?? 'Mata Kuliah',
                    'sks' => $kelas->mataKuliahPeriode->mataKuliah->sks ?? 0,
                ],
            ],
        ];

        return Inertia::render('Dosen/Absensi/Create', [
            'kelas' => $kelasData,
            'mahasiswa' => $mahasiswa,
            'totalPertemuan' => $totalPertemuan,
        ]);
    }


    // STORE - Simpan Absensi
    public function store(StoreAbsensiRequest $request)
    {
        DB::transaction(function () use ($request) {
            // Create pertemuan
            $pertemuan = Pertemuan::create([
                'id_kelas' => $request->id_kelas,
                'pertemuan_ke' => $request->pertemuan_ke,
                'tanggal' => $request->tanggal,
                'topik_pembahasan' => $request->topik_pembahasan,
            ]);

            // Create absensi untuk setiap mahasiswa
            foreach ($request->mahasiswa as $mhs) {
                Absensi::create([
                    'id_mahasiswa' => $mhs['id_mahasiswa'],
                    'id_pertemuan' => $pertemuan->id_pertemuan,
                    'status' => $mhs['status'],
                ]);
            }
        });

        return redirect()->route('dosen.absensi.kelas.show', $request->id_kelas)
            ->with('success', 'Absensi berhasil disimpan!');
    }


    // EDIT - Edit Absensi Pertemuan
    public function edit($idPertemuan)
    {
        $dosen = auth()->user()->dosen;

        $pertemuan = Pertemuan::with([
            'kelas.mataKuliahPeriode.mataKuliah',
            'absensis.mahasiswa'
        ])->findOrFail($idPertemuan);

        // Authorization check
        if ($pertemuan->kelas->id_dosen !== $dosen->id_dosen) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Dosen/Absensi/Edit', [
            'pertemuan' => $pertemuan,
        ]);
    }

    // UPDATE - Update Absensi
    public function update(UpdateAbsensiRequest $request, $idPertemuan)
    {
        $dosen = auth()->user()->dosen;

        $pertemuan = Pertemuan::findOrFail($idPertemuan);

        // Authorization check
        if ($pertemuan->kelas->id_dosen !== $dosen->id_dosen) {
            abort(403, 'Unauthorized');
        }

        DB::transaction(function () use ($request, $pertemuan) {
            // Update pertemuan
            $pertemuan->update([
                'tanggal' => $request->tanggal,
                'topik_pembahasan' => $request->topik_pembahasan,
            ]);

            // Update absensi
            foreach ($request->mahasiswa as $mhs) {
                Absensi::where('id_pertemuan', $pertemuan->id_pertemuan)
                    ->where('id_mahasiswa', $mhs['id_mahasiswa'])
                    ->update(['status' => $mhs['status']]);
            }
        });

        return redirect()->route('dosen.absensi.show', $pertemuan->id_pertemuan)
            ->with('success', 'Absensi berhasil diupdate!');
    }

    // DESTROY - Hapus Pertemuan & Absensi
    public function destroy($idPertemuan)
    {
        $dosen = auth()->user()->dosen;

        $pertemuan = Pertemuan::findOrFail($idPertemuan);

        // Authorization check
        if ($pertemuan->kelas->id_dosen !== $dosen->id_dosen) {
            abort(403, 'Unauthorized');
        }

        // Delete akan cascade ke absensi (via model relationship)
        $pertemuan->delete();

        return redirect()->route('dosen.absensi.history')
            ->with('success', 'Pertemuan dan absensi berhasil dihapus!');
    }
}
