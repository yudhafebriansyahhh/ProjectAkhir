<?php

namespace App\Http\Controllers\Baak;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMataKuliahRequest;
use App\Http\Requests\UpdateMataKuliahRequest;
use App\Models\MataKuliah;
use App\Models\Prodi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MataKuliahController extends Controller
{
    public function index(Request $request)
    {
        $query = MataKuliah::with('prodi.fakultas');

        // Filter by Prodi
        if ($request->filled('prodi')) {
            if ($request->prodi === 'umum') {
                $query->whereNull('kode_prodi');
            } else {
                $query->where('kode_prodi', $request->prodi);
            }
        }

        // Filter by Semester
        if ($request->filled('semester')) {
            $query->where('semester', $request->semester);
        }

        // Filter by Kategori
        if ($request->filled('kategori')) {
            $query->where('kategori', $request->kategori);
        }

        // Filter by Status
        if ($request->filled('status')) {
            $query->where('is_active', $request->status);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('kode_matkul', 'like', "%{$search}%")
                  ->orWhere('nama_matkul', 'like', "%{$search}%");
            });
        }

        $mataKuliah = $query->withCount('kelas')->latest()->paginate(10)->withQueryString();

        $prodi_list = Prodi::with('fakultas')->orderBy('nama_prodi')->get();

        return Inertia::render('Baak/MataKuliah/Index', [
            'mata_kuliah' => $mataKuliah,
            'prodi_list' => $prodi_list,
            'filters' => $request->only(['search', 'prodi', 'semester', 'kategori', 'status']),
        ]);
    }

    public function create()
    {
        $prodi = Prodi::with('fakultas')->orderBy('nama_prodi')->get();

        return Inertia::render('Baak/MataKuliah/Create', [
            'prodi' => $prodi,
        ]);
    }

    public function store(StoreMataKuliahRequest $request)
    {
        $validated = $request->validated();

        // Jika kategori umum, set kode_prodi jadi null
        if ($validated['kategori'] === 'umum') {
            $validated['kode_prodi'] = null;
        }

        MataKuliah::create($validated);

        return redirect()->route('baak.mata-kuliah.index')->with('success', 'Mata kuliah berhasil ditambahkan');
    }

    public function show($kode_matkul)
    {
        $mataKuliah = MataKuliah::with([
            'prodi.fakultas',
            'kelas.dosen'
        ])->findOrFail($kode_matkul);

        return Inertia::render('Baak/MataKuliah/Show', [
            'mata_kuliah' => $mataKuliah,
        ]);
    }

    public function edit($kode_matkul)
    {
        $mataKuliah = MataKuliah::with('prodi')->findOrFail($kode_matkul);
        $prodi = Prodi::with('fakultas')->orderBy('nama_prodi')->get();

        return Inertia::render('Baak/MataKuliah/Edit', [
            'mata_kuliah' => $mataKuliah,
            'prodi' => $prodi,
        ]);
    }

    public function update(UpdateMataKuliahRequest $request, $kode_matkul)
    {
        $mataKuliah = MataKuliah::findOrFail($kode_matkul);
        $validated = $request->validated();

        // Jika kategori umum, set kode_prodi jadi null
        if ($validated['kategori'] === 'umum') {
            $validated['kode_prodi'] = null;
        }

        $mataKuliah->update($validated);

        return redirect()->route('baak.mata-kuliah.index')->with('success', 'Mata kuliah berhasil diupdate');
    }

    public function destroy($kode_matkul)
    {
        $mataKuliah = MataKuliah::findOrFail($kode_matkul);

        // Cek apakah ada kelas yang menggunakan mata kuliah ini
        $jumlahKelas = $mataKuliah->kelas()->count();

        if ($jumlahKelas > 0) {
            return back()->with('error', 'Tidak dapat menghapus mata kuliah. Ada ' . $jumlahKelas . ' kelas yang menggunakan mata kuliah ini.');
        }

        // Cek apakah ada mahasiswa yang sudah mengambil mata kuliah ini
        $jumlahMahasiswa = $mataKuliah->detailKrs()->count();

        if ($jumlahMahasiswa > 0) {
            return back()->with('error', 'Tidak dapat menghapus mata kuliah. Ada mahasiswa yang sudah mengambil mata kuliah ini.');
        }

        $mataKuliah->delete();

        return redirect()->route('baak.mata-kuliah.index')->with('success', 'Mata kuliah berhasil dihapus');
    }

    // Toggle status aktif/nonaktif
    public function toggleStatus($kode_matkul)
    {
        $mataKuliah = MataKuliah::findOrFail($kode_matkul);
        $mataKuliah->is_active = !$mataKuliah->is_active;
        $mataKuliah->save();

        $status = $mataKuliah->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return back()->with('success', "Mata kuliah berhasil {$status}");
    }
}
