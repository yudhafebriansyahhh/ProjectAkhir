<?php

namespace App\Http\Controllers\Baak;

use App\Http\Controllers\Controller;
use App\Models\Fakultas;
use App\Http\Requests\StoreFakultasRequest;
use App\Http\Requests\UpdateFakultasRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FakultasController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $fakultas = Fakultas::query()
            ->withCount('prodi')
            ->when($search, function ($query, $search) {
                $query->where('kode_fakultas', 'like', "%{$search}%")
                      ->orWhere('nama_fakultas', 'like', "%{$search}%");
            })
            ->orderBy('kode_fakultas', 'asc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Baak/Fakultas/Index', [
            'fakultas' => $fakultas,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Baak/Fakultas/Create');
    }

    public function store(StoreFakultasRequest $request)
    {
        Fakultas::create($request->validated());

        return redirect()
            ->route('baak.fakultas.index')
            ->with('success', 'Fakultas berhasil ditambahkan');
    }

    public function edit(string $kode_fakultas)
    {
        $fakultas = Fakultas::where('kode_fakultas', $kode_fakultas)->firstOrFail();

        return Inertia::render('Baak/Fakultas/Edit', [
            'fakultas' => $fakultas,
        ]);
    }

    public function update(UpdateFakultasRequest $request, string $kode_fakultas)
    {
        $fakultas = Fakultas::where('kode_fakultas', $kode_fakultas)->firstOrFail();
        $fakultas->update($request->validated());

        return redirect()
            ->route('baak.fakultas.index')
            ->with('success', 'Fakultas berhasil diupdate');
    }

    public function destroy(string $kode_fakultas)
    {
        $fakultas = Fakultas::where('kode_fakultas', $kode_fakultas)->firstOrFail();

        // Cek apakah ada prodi yang terkait
        if ($fakultas->prodi()->count() > 0) {
            return back()->with('error', 'Fakultas tidak dapat dihapus karena masih memiliki program studi');
        }

        $fakultas->delete();

        return redirect()
            ->route('baak.fakultas.index')
            ->with('success', 'Fakultas berhasil dihapus');
    }
}
