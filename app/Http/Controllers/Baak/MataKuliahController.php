<?php

namespace App\Http\Controllers\Baak;

use App\Http\Controllers\Controller;
use App\Models\MataKuliah;
use App\Http\Requests\StoreMataKuliahRequest;
use App\Http\Requests\UpdateMataKuliahRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MataKuliahController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $semester_filter = $request->input('semester');

        $mataKuliah = MataKuliah::query()
            ->withCount('kelas')
            ->when($search, function ($query, $search) {
                $query->where('kode_matkul', 'like', "%{$search}%")
                      ->orWhere('nama_matkul', 'like', "%{$search}%");
            })
            ->when($semester_filter, function ($query, $semester_filter) {
                $query->where('semester', $semester_filter);
            })
            ->orderBy('semester', 'asc')
            ->orderBy('kode_matkul', 'asc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Baak/MataKuliah/Index', [
            'mataKuliah' => $mataKuliah,
            'filters' => $request->only(['search', 'semester']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Baak/MataKuliah/Create');
    }

    public function store(StoreMataKuliahRequest $request)
    {
        MataKuliah::create($request->validated());

        return redirect()
            ->route('baak.mata-kuliah.index')
            ->with('success', 'Mata kuliah berhasil ditambahkan');
    }

    public function edit(string $kode_matkul)
    {
        $mataKuliah = MataKuliah::where('kode_matkul', $kode_matkul)->firstOrFail();

        return Inertia::render('Baak/MataKuliah/Edit', [
            'mataKuliah' => $mataKuliah,
        ]);
    }

    public function update(UpdateMataKuliahRequest $request, string $kode_matkul)
    {
        $mataKuliah = MataKuliah::where('kode_matkul', $kode_matkul)->firstOrFail();
        $mataKuliah->update($request->validated());

        return redirect()
            ->route('baak.mata-kuliah.index')
            ->with('success', 'Mata kuliah berhasil diupdate');
    }

    public function destroy(string $kode_matkul)
    {
        $mataKuliah = MataKuliah::where('kode_matkul', $kode_matkul)->firstOrFail();

        // Cek apakah ada kelas yang terkait
        if ($mataKuliah->kelas()->count() > 0) {
            return back()->with('error', 'Mata kuliah tidak dapat dihapus karena masih digunakan di kelas');
        }

        $mataKuliah->delete();

        return redirect()
            ->route('baak.mata-kuliah.index')
            ->with('success', 'Mata kuliah berhasil dihapus');
    }
}
