<?php

namespace App\Http\Controllers\Baak;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreKelasRequest;
use App\Http\Requests\UpdateKelasRequest;
use App\Models\Kelas;
use App\Models\MataKuliah;
use App\Models\Dosen;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KelasController extends Controller
{
    public function index(Request $request)
    {
        $query = Kelas::with(['mataKuliah', 'dosen.prodi']);

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
            $query->where(function($q) use ($search) {
                $q->where('nama_kelas', 'like', "%{$search}%")
                  ->orWhere('ruang_kelas', 'like', "%{$search}%")
                  ->orWhereHas('mataKuliah', function($q) use ($search) {
                      $q->where('nama_matkul', 'like', "%{$search}%")
                        ->orWhere('kode_matkul', 'like', "%{$search}%");
                  })
                  ->orWhereHas('dosen', function($q) use ($search) {
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
        $mata_kuliah = MataKuliah::orderBy('semester')->orderBy('nama_matkul')->get();
        $dosen = Dosen::with('prodi')->orderBy('nama')->get();

        return Inertia::render('Baak/Kelas/Create', [
            'mata_kuliah' => $mata_kuliah,
            'dosen' => $dosen,
        ]);
    }

    public function store(StoreKelasRequest $request)
    {
        $validated = $request->validated();

        // Check bentrok jadwal dosen
        $bentrokDosen = $this->checkBentrokDosen(
            $validated['id_dosen'],
            $validated['hari'],
            $validated['jam_mulai'],
            $validated['jam_selesai']
        );

        if ($bentrokDosen) {
            return back()->withErrors([
                'id_dosen' => 'Dosen sudah mengajar di waktu yang sama: ' . $bentrokDosen->mataKuliah->nama_matkul . ' - Kelas ' . $bentrokDosen->nama_kelas
            ])->withInput();
        }

        // Check bentrok ruangan
        $bentrokRuangan = $this->checkBentrokRuangan(
            $validated['ruang_kelas'],
            $validated['hari'],
            $validated['jam_mulai'],
            $validated['jam_selesai']
        );

        if ($bentrokRuangan) {
            return back()->withErrors([
                'ruang_kelas' => 'Ruangan sudah digunakan di waktu yang sama: ' . $bentrokRuangan->mataKuliah->nama_matkul . ' - Kelas ' . $bentrokRuangan->nama_kelas
            ])->withInput();
        }

        Kelas::create($validated);

        return redirect()->route('baak.kelas.index')->with('success', 'Kelas berhasil ditambahkan');
    }

    public function show($id)
    {
        $kelas = Kelas::with([
            'mataKuliah',
            'dosen.prodi',
            'detailKrs.krs.mahasiswa.prodi',
            'bobotNilai'
        ])->findOrFail($id);

        // Get mahasiswa yang mengambil kelas ini
        $mahasiswa = $kelas->detailKrs()
            ->with(['krs.mahasiswa.prodi'])
            ->whereHas('krs', function($q) {
                $q->where('status', 'approved');
            })
            ->get()
            ->map(function($detail) {
                return $detail->krs->mahasiswa;
            });

        return Inertia::render('Baak/Kelas/Show', [
            'kelas' => $kelas,
            'mahasiswa' => $mahasiswa,
        ]);
    }

    public function edit($id)
    {
        $kelas = Kelas::with(['mataKuliah', 'dosen'])->findOrFail($id);
        $mata_kuliah = MataKuliah::orderBy('semester')->orderBy('nama_matkul')->get();
        $dosen = Dosen::with('prodi')->orderBy('nama')->get();

        return Inertia::render('Baak/Kelas/Edit', [
            'kelas' => $kelas,
            'mata_kuliah' => $mata_kuliah,
            'dosen' => $dosen,
        ]);
    }

    public function update(UpdateKelasRequest $request, $id)
    {
        $kelas = Kelas::findOrFail($id);
        $validated = $request->validated();

        // Check bentrok jadwal dosen (exclude kelas ini)
        $bentrokDosen = $this->checkBentrokDosen(
            $validated['id_dosen'],
            $validated['hari'],
            $validated['jam_mulai'],
            $validated['jam_selesai'],
            $id
        );

        if ($bentrokDosen) {
            return back()->withErrors([
                'id_dosen' => 'Dosen sudah mengajar di waktu yang sama: ' . $bentrokDosen->mataKuliah->nama_matkul . ' - Kelas ' . $bentrokDosen->nama_kelas
            ])->withInput();
        }

        // Check bentrok ruangan (exclude kelas ini)
        $bentrokRuangan = $this->checkBentrokRuangan(
            $validated['ruang_kelas'],
            $validated['hari'],
            $validated['jam_mulai'],
            $validated['jam_selesai'],
            $id
        );

        if ($bentrokRuangan) {
            return back()->withErrors([
                'ruang_kelas' => 'Ruangan sudah digunakan di waktu yang sama: ' . $bentrokRuangan->mataKuliah->nama_matkul . ' - Kelas ' . $bentrokRuangan->nama_kelas
            ])->withInput();
        }

        $kelas->update($validated);

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
            ->where(function($q) use ($jam_mulai, $jam_selesai) {
                // Cek overlap waktu
                $q->where(function($q) use ($jam_mulai, $jam_selesai) {
                    $q->where('jam_mulai', '<', $jam_selesai)
                      ->where('jam_selesai', '>', $jam_mulai);
                });
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
            ->where(function($q) use ($jam_mulai, $jam_selesai) {
                // Cek overlap waktu
                $q->where(function($q) use ($jam_mulai, $jam_selesai) {
                    $q->where('jam_mulai', '<', $jam_selesai)
                      ->where('jam_selesai', '>', $jam_mulai);
                });
            });

        if ($exclude_id) {
            $query->where('id_kelas', '!=', $exclude_id);
        }

        return $query->first();
    }
}
