<?php
// app/Http/Controllers/Baak/KelasController.php

namespace App\Http\Controllers\Baak;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreKelasRequest;
use App\Http\Requests\UpdateKelasRequest;
use App\Models\Kelas;
use App\Models\MataKuliah;
use App\Models\Dosen;
use App\Models\MataKuliahPeriode;
use App\Models\PeriodeRegistrasi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KelasController extends Controller
{
    public function index(Request $request)
    {
        $query = Kelas::with(['mataKuliah', 'dosen.prodi', 'mataKuliahPeriode']);

        // Filter by Mata Kuliah
        if ($request->filled('mata_kuliah')) {
            $query->where('kode_matkul', $request->mata_kuliah);
        }

        // Filter by Dosen
        if ($request->filled('dosen')) {
            $query->where('id_dosen', $request->dosen);
        }

        // Filter by Hari
        if ($request->filled('hari')) {
            $query->where('hari', $request->hari);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_kelas', 'like', "%{$search}%")
                    ->orWhere('ruang_kelas', 'like', "%{$search}%")
                    ->orWhereHas('mataKuliah', function ($q) use ($search) {
                        $q->where('nama_matkul', 'like', "%{$search}%")
                            ->orWhere('kode_matkul', 'like', "%{$search}%");
                    })
                    ->orWhereHas('dosen', function ($q) use ($search) {
                        $q->where('nama', 'like', "%{$search}%");
                    });
            });
        }

        $kelas = $query->withCount('detailKrs')->latest()->paginate(10)->withQueryString();

        $mata_kuliah_list = MataKuliah::orderBy('nama_matkul')->get(['kode_matkul', 'nama_matkul']);
        $dosen_list = Dosen::orderBy('nama')->get(['id_dosen', 'nama']);

        return Inertia::render('Baak/Kelas/Index', [
            'kelas' => $kelas,
            'mata_kuliah_list' => $mata_kuliah_list,
            'dosen_list' => $dosen_list,
            'filters' => $request->only(['search', 'mata_kuliah', 'dosen', 'hari']),
        ]);
    }

    public function create()
    {
        // AMBIL SEMUA PERIODE (tidak harus aktif)
        $periodes = PeriodeRegistrasi::orderBy('tahun_ajaran', 'desc')
            ->orderBy('jenis_semester', 'desc')
            ->get();

        if ($periodes->isEmpty()) {
            return redirect()
                ->route('baak.kelas.index')
                ->with('error', 'Belum ada periode registrasi. Silakan buat periode terlebih dahulu.');
        }

        // Default: periode terbaru
        $periodeTerbaru = $periodes->first();

        return Inertia::render('Baak/Kelas/Create', [
            'periodes' => $periodes,
            'periodeTerbaru' => $periodeTerbaru,
            'dosen' => Dosen::with('prodi')->orderBy('nama')->get(),
        ]);
    }

    // ENDPOINT BARU: Load mata kuliah berdasarkan periode yang dipilih
    public function getMataKuliahByPeriode(Request $request)
    {
        $request->validate([
            'tahun_ajaran' => 'required|string',
            'jenis_semester' => 'required|in:ganjil,genap,pendek',
        ]);

        $mataKuliahPeriode = MataKuliahPeriode::with('mataKuliah.prodi')
            ->where('tahun_ajaran', $request->tahun_ajaran)
            ->where('jenis_semester', $request->jenis_semester)
            ->where('is_available', true)
            ->get()
            ->groupBy('semester_ditawarkan');

        return response()->json($mataKuliahPeriode);
    }

    public function store(StoreKelasRequest $request)
    {
        // Validasi id_mk_periode ada
        $mkPeriode = MataKuliahPeriode::findOrFail($request->id_mk_periode);

        // Check bentrok jadwal dosen
        $bentrokDosen = $this->checkBentrokDosen(
            $request->id_dosen,
            $request->hari,
            $request->jam_mulai,
            $request->jam_selesai
        );

        if ($bentrokDosen) {
            return back()->withErrors([
                'id_dosen' => 'Dosen sudah mengajar di waktu yang sama: ' . $bentrokDosen->mataKuliah->nama_matkul . ' - Kelas ' . $bentrokDosen->nama_kelas
            ])->withInput();
        }

        // Check bentrok ruangan
        $bentrokRuangan = $this->checkBentrokRuangan(
            $request->ruang_kelas,
            $request->hari,
            $request->jam_mulai,
            $request->jam_selesai
        );

        if ($bentrokRuangan) {
            return back()->withErrors([
                'ruang_kelas' => 'Ruangan sudah digunakan di waktu yang sama: ' . $bentrokRuangan->mataKuliah->nama_matkul . ' - Kelas ' . $bentrokRuangan->nama_kelas
            ])->withInput();
        }

        Kelas::create([
            'nama_kelas' => $request->nama_kelas,
            'kode_matkul' => $mkPeriode->kode_matkul,
            'id_mk_periode' => $request->id_mk_periode,
            'id_dosen' => $request->id_dosen,
            'ruang_kelas' => $request->ruang_kelas,
            'hari' => $request->hari,
            'jam_mulai' => $request->jam_mulai,
            'jam_selesai' => $request->jam_selesai,
            'kapasitas' => $request->kapasitas,
        ]);

        return redirect()
            ->route('baak.kelas.index')
            ->with('success', 'Kelas berhasil ditambahkan');
    }

    public function show($id)
    {
        $kelas = Kelas::with([
            'mataKuliah',
            'mataKuliahPeriode',
            'dosen.prodi',
            'detailKrs.krs.mahasiswa.prodi',
            'bobotNilai'
        ])->findOrFail($id);

        // Get mahasiswa yang mengambil kelas ini
        $mahasiswa = $kelas->detailKrs()
            ->with(['krs.mahasiswa.prodi'])
            ->whereHas('krs', function ($q) {
                $q->where('status', 'approved');
            })
            ->get()
            ->map(function ($detail) {
                return $detail->krs->mahasiswa;
            });

        return Inertia::render('Baak/Kelas/Show', [
            'kelas' => $kelas,
            'mahasiswa' => $mahasiswa,
        ]);
    }

    public function edit($id)
    {
        $kelas = Kelas::with(['mataKuliah', 'mataKuliahPeriode', 'dosen'])->findOrFail($id);

        // Load mata kuliah periode untuk periode yang sama dengan kelas ini
        $mataKuliahPeriode = MataKuliahPeriode::with('mataKuliah.prodi')
            ->where('tahun_ajaran', $kelas->mataKuliahPeriode->tahun_ajaran)
            ->where('jenis_semester', $kelas->mataKuliahPeriode->jenis_semester)
            ->where('is_available', true)
            ->get()
            ->groupBy('semester_ditawarkan');

        $dosen = Dosen::with('prodi')->orderBy('nama')->get();

        return Inertia::render('Baak/Kelas/Edit', [
            'kelas' => $kelas,
            'mataKuliahPeriode' => $mataKuliahPeriode,
            'dosen' => $dosen,
        ]);
    }

    public function update(UpdateKelasRequest $request, $id)
    {
        $kelas = Kelas::findOrFail($id);

        // Check bentrok jadwal dosen (exclude kelas ini)
        $bentrokDosen = $this->checkBentrokDosen(
            $request->id_dosen,
            $request->hari,
            $request->jam_mulai,
            $request->jam_selesai,
            $id
        );

        if ($bentrokDosen) {
            return back()->withErrors([
                'id_dosen' => 'Dosen sudah mengajar di waktu yang sama: ' . $bentrokDosen->mataKuliah->nama_matkul . ' - Kelas ' . $bentrokDosen->nama_kelas
            ])->withInput();
        }

        // Check bentrok ruangan (exclude kelas ini)
        $bentrokRuangan = $this->checkBentrokRuangan(
            $request->ruang_kelas,
            $request->hari,
            $request->jam_mulai,
            $request->jam_selesai,
            $id
        );

        if ($bentrokRuangan) {
            return back()->withErrors([
                'ruang_kelas' => 'Ruangan sudah digunakan di waktu yang sama: ' . $bentrokRuangan->mataKuliah->nama_matkul . ' - Kelas ' . $bentrokRuangan->nama_kelas
            ])->withInput();
        }

        $kelas->update($request->validated());

        return redirect()->route('baak.kelas.index')->with('success', 'Kelas berhasil diupdate');
    }

    public function destroy($id)
    {
        $kelas = Kelas::findOrFail($id);

        // Cek apakah ada mahasiswa yang sudah mengambil kelas ini
        $jumlahMahasiswa = $kelas->detailKrs()->count();

        if ($jumlahMahasiswa > 0) {
            return back()->with('error', 'Tidak dapat menghapus kelas. Ada ' . $jumlahMahasiswa . ' mahasiswa yang sudah mengambil kelas ini.');
        }

        $kelas->delete();

        return redirect()->route('baak.kelas.index')->with('success', 'Kelas berhasil dihapus');
    }

    // Helper Methods
    private function checkBentrokDosen($id_dosen, $hari, $jam_mulai, $jam_selesai, $exclude_id = null)
    {
        $query = Kelas::with('mataKuliah')
            ->where('id_dosen', $id_dosen)
            ->where('hari', $hari)
            ->where(function ($q) use ($jam_mulai, $jam_selesai) {
                $q->where('jam_mulai', '<', $jam_selesai)
                    ->where('jam_selesai', '>', $jam_mulai);
            });

        if ($exclude_id) {
            $query->where('id_kelas', '!=', $exclude_id);
        }

        return $query->first();
    }

    private function checkBentrokRuangan($ruang_kelas, $hari, $jam_mulai, $jam_selesai, $exclude_id = null)
    {
        $query = Kelas::with('mataKuliah')
            ->where('ruang_kelas', $ruang_kelas)
            ->where('hari', $hari)
            ->where(function ($q) use ($jam_mulai, $jam_selesai) {
                $q->where('jam_mulai', '<', $jam_selesai)
                    ->where('jam_selesai', '>', $jam_mulai);
            });

        if ($exclude_id) {
            $query->where('id_kelas', '!=', $exclude_id);
        }

        return $query->first();
    }
}
