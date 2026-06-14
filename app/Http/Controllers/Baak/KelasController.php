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
use App\Models\Prodi;
use App\Models\Ruangan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KelasController extends Controller
{
    public function index(Request $request)
    {
        $periodeTerakhir = PeriodeRegistrasi::getPeriodeTerakhir();

        $query = Kelas::with(['mataKuliahPeriode.mataKuliah.prodi', 'dosen.prodi', 'ruangan'])
            ->forPeriode($periodeTerakhir);

        $this->applyFilters($query, $request);

        $kelas = $query->withCount('detailKrs')->latest()->paginate(10)->withQueryString();

        return Inertia::render('Baak/Kelas/Index', [
            'kelas' => $kelas,
            ...$this->getFilterOptions(),
            'filters' => $request->only(['search', 'mata_kuliah', 'dosen', 'hari']),
            'periode_terakhir' => $periodeTerakhir,
            'isArchive' => false,
        ]);
    }

    public function arsip(Request $request)
    {
        $periodeTerakhir = PeriodeRegistrasi::getPeriodeTerakhir();

        $query = Kelas::with(['mataKuliahPeriode.mataKuliah.prodi', 'dosen.prodi', 'ruangan'])
            ->archivedFromPeriode($periodeTerakhir);

        $this->applyFilters($query, $request);

        $kelas = $query->withCount('detailKrs')->latest()->paginate(10)->withQueryString();

        return Inertia::render('Baak/Kelas/Index', [
            'kelas' => $kelas,
            ...$this->getFilterOptions(),
            'filters' => $request->only(['search', 'mata_kuliah', 'dosen', 'hari']),
            'periode_terakhir' => $periodeTerakhir,
            'isArchive' => true,
        ]);
    }

    public function create()
    {
        $periodes = PeriodeRegistrasi::orderBy('tahun_ajaran', 'desc')
            ->orderBy('jenis_semester', 'desc')
            ->get();

        if ($periodes->isEmpty()) {
            return redirect()
                ->route('baak.kelas.index')
                ->with('error', 'Belum ada periode registrasi. Silakan buat periode terlebih dahulu.');
        }

        return Inertia::render('Baak/Kelas/Create', [
            'periodes' => $periodes,
            'prodis' => Prodi::orderBy('nama_prodi')->get(),
            'dosen' => Dosen::with('prodi')->orderBy('nama')->get(),
            'ruangan' => Ruangan::where('is_active', true)->orderBy('kode_ruangan')->get(),
        ]);
    }

    public function getMataKuliahByPeriode(Request $request)
    {
        $request->validate([
            'tahun_ajaran' => 'required|string',
            'jenis_semester' => 'required|in:ganjil,genap,pendek',
            'kode_prodi' => 'required|exists:prodi,kode_prodi',
            'semester' => 'required|integer|min:1|max:8',
        ]);

        $mataKuliahPeriode = MataKuliahPeriode::with(['mataKuliah.prodi'])
            ->where('tahun_ajaran', $request->tahun_ajaran)
            ->where('jenis_semester', $request->jenis_semester)
            ->where('kode_prodi', $request->kode_prodi)
            ->where('semester_ditawarkan', $request->semester)
            ->get();

        return response()->json($mataKuliahPeriode);
    }

    public function store(StoreKelasRequest $request)
    {
        // Validasi id_mk_periode ada
        $mkPeriode = MataKuliahPeriode::with('mataKuliah')->findOrFail($request->id_mk_periode);

        // Check bentrok jadwal dosen
        $bentrokDosen = $this->checkBentrokDosen(
            $request->id_dosen,
            $request->hari,
            $request->jam_mulai,
            $request->jam_selesai,
            $mkPeriode->tahun_ajaran,
            $mkPeriode->jenis_semester
        );

        if ($bentrokDosen) {
            return back()->withErrors([
                'jadwal' => 'Dosen sudah mengajar di waktu yang sama: ' .
                    ($bentrokDosen->mataKuliahPeriode->mataKuliah->nama_matkul ?? '-') .
                    ' - Kelas ' . $bentrokDosen->nama_kelas
            ])->withInput();
        }

        // Check bentrok ruangan
        $ruangan = Ruangan::findOrFail($request->id_ruangan);

        $bentrokRuangan = $this->checkBentrokRuangan(
            $request->id_ruangan,
            $request->hari,
            $request->jam_mulai,
            $request->jam_selesai,
            $mkPeriode->tahun_ajaran,
            $mkPeriode->jenis_semester
        );

        if ($bentrokRuangan) {
            return back()->withErrors([
                'jadwal' => 'Ruangan sudah digunakan di waktu yang sama: ' .
                    ($bentrokRuangan->mataKuliahPeriode->mataKuliah->nama_matkul ?? '-') .
                    ' - Kelas ' . $bentrokRuangan->nama_kelas
            ])->withInput();
        }

        // Hanya simpan id_mk_periode (kode_matkul tidak perlu)
        Kelas::create([
            'nama_kelas' => $request->nama_kelas,
            'id_mk_periode' => $request->id_mk_periode,
            'id_dosen' => $request->id_dosen,
            'id_ruangan' => $ruangan->id_ruangan,
            'ruang_kelas' => $ruangan->kode_ruangan,
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
        $periodeTerakhir = PeriodeRegistrasi::getPeriodeTerakhir();

        $kelas = Kelas::with([
            'mataKuliahPeriode.mataKuliah.prodi',
            'mataKuliahPeriode.prodi',
            'dosen.prodi',
            'ruangan',
            'detailKrs.krs.mahasiswa.prodi',
            'bobotNilai'
        ])->findOrFail($id);

        $isArchived = ! $periodeTerakhir
            || ! $kelas->mataKuliahPeriode
            || $kelas->mataKuliahPeriode->tahun_ajaran !== $periodeTerakhir->tahun_ajaran
            || $kelas->mataKuliahPeriode->jenis_semester !== $periodeTerakhir->jenis_semester;

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
            'isArchived' => $isArchived,
        ]);
    }

    public function edit($id)
    {
        $kelas = Kelas::with([
            'mataKuliahPeriode.mataKuliah.prodi',  
            'mataKuliahPeriode.prodi',
            'dosen',
            'ruangan'
        ])->findOrFail($id);

        $dosen = Dosen::with('prodi')->orderBy('nama')->get();

        return Inertia::render('Baak/Kelas/Edit', [
            'kelas' => $kelas,
            'dosen' => $dosen,
            'ruangan' => Ruangan::where('is_active', true)
                ->orWhere('id_ruangan', $kelas->id_ruangan)
                ->orderBy('kode_ruangan')
                ->get(),
        ]);
    }

    public function update(UpdateKelasRequest $request, $id)
    {
        $kelas = Kelas::with('mataKuliahPeriode')->findOrFail($id);
        $mkPeriode = $kelas->mataKuliahPeriode;

        // Check bentrok jadwal dosen (exclude kelas ini)
        $bentrokDosen = $this->checkBentrokDosen(
            $request->id_dosen,
            $request->hari,
            $request->jam_mulai,
            $request->jam_selesai,
            $mkPeriode?->tahun_ajaran,
            $mkPeriode?->jenis_semester,
            $id
        );

        if ($bentrokDosen) {
            return back()->withErrors([
                'id_dosen' => 'Dosen sudah mengajar di waktu yang sama: ' .
                    ($bentrokDosen->mataKuliahPeriode->mataKuliah->nama_matkul ?? '-') .
                    ' - Kelas ' . $bentrokDosen->nama_kelas
            ])->withInput();
        }

        // Check bentrok ruangan (exclude kelas ini)
        $ruangan = Ruangan::findOrFail($request->id_ruangan);

        $bentrokRuangan = $this->checkBentrokRuangan(
            $request->id_ruangan,
            $request->hari,
            $request->jam_mulai,
            $request->jam_selesai,
            $mkPeriode?->tahun_ajaran,
            $mkPeriode?->jenis_semester,
            $id
        );

        if ($bentrokRuangan) {
            return back()->withErrors([
                'id_ruangan' => 'Ruangan sudah digunakan di waktu yang sama: ' .
                    ($bentrokRuangan->mataKuliahPeriode->mataKuliah->nama_matkul ?? '-') .
                    ' - Kelas ' . $bentrokRuangan->nama_kelas
            ])->withInput();
        }

        $kelas->update([
            ...$request->validated(),
            'ruang_kelas' => $ruangan->kode_ruangan,
        ]);

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
    private function checkBentrokDosen($id_dosen, $hari, $jam_mulai, $jam_selesai, $tahunAjaran, $jenisSemester, $exclude_id = null)
    {
        $query = Kelas::with('mataKuliahPeriode.mataKuliah')
            ->forPeriodeValue($tahunAjaran, $jenisSemester)
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

    private function checkBentrokRuangan($id_ruangan, $hari, $jam_mulai, $jam_selesai, $tahunAjaran, $jenisSemester, $exclude_id = null)
    {
        $query = Kelas::with('mataKuliahPeriode.mataKuliah')
            ->forPeriodeValue($tahunAjaran, $jenisSemester)
            ->where('id_ruangan', $id_ruangan)
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

    private function applyFilters($query, Request $request): void
    {
        if ($request->filled('mata_kuliah')) {
            $query->whereHas('mataKuliahPeriode', function ($q) use ($request) {
                $q->where('kode_matkul', $request->mata_kuliah);
            });
        }

        if ($request->filled('dosen')) {
            $query->where('id_dosen', $request->dosen);
        }

        if ($request->filled('hari')) {
            $query->where('hari', $request->hari);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_kelas', 'like', "%{$search}%")
                    ->orWhere('ruang_kelas', 'like', "%{$search}%")
                    ->orWhereHas('ruangan', function ($q) use ($search) {
                        $q->where('kode_ruangan', 'like', "%{$search}%")
                            ->orWhere('nama_ruangan', 'like', "%{$search}%");
                    })
                    ->orWhereHas('mataKuliahPeriode.mataKuliah', function ($q) use ($search) {
                        $q->where('nama_matkul', 'like', "%{$search}%")
                            ->orWhere('kode_matkul', 'like', "%{$search}%");
                    })
                    ->orWhereHas('dosen', function ($q) use ($search) {
                        $q->where('nama', 'like', "%{$search}%");
                    });
            });
        }
    }

    private function getFilterOptions(): array
    {
        return [
            'mata_kuliah_list' => MataKuliah::orderBy('nama_matkul')->get(['kode_matkul', 'nama_matkul']),
            'dosen_list' => Dosen::orderBy('nama')->get(['id_dosen', 'nama']),
        ];
    }
}
