<?php

namespace App\Http\Controllers\Baak;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProdiRequest;
use App\Http\Requests\UpdateProdiRequest;
use App\Models\Prodi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProdiController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $baseQuery = Prodi::query()
            ->when($search, function ($query, $search) {
                $query->where('kode_prodi', 'like', "%{$search}%")
                    ->orWhere('nama_prodi', 'like', "%{$search}%");
            });

        $statRows = (clone $baseQuery)
            ->withCount('mahasiswa')
            ->get();

        $prodi = (clone $baseQuery)
            ->withCount('mahasiswa')
            ->orderBy('kode_prodi', 'asc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Baak/Prodi/Index', [
            'prodi' => $prodi,
            'stats' => [
                'total' => $statRows->count(),
                'total_mahasiswa' => $statRows->sum('mahasiswa_count'),
                's1' => $statRows->where('jenjang', 'S1')->count(),
                'diploma' => $statRows->whereIn('jenjang', ['D3', 'D4'])->count(),
            ],
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Baak/Prodi/Create');
    }

    public function store(StoreProdiRequest $request)
    {
        Prodi::create($request->validated());

        return redirect()
            ->route('baak.prodi.index')
            ->with('success', 'Program Studi berhasil ditambahkan');
    }

    public function edit(string $kode_prodi)
    {
        $prodi = Prodi::where('kode_prodi', $kode_prodi)->firstOrFail();

        return Inertia::render('Baak/Prodi/Edit', [
            'prodi' => $prodi,
        ]);
    }

    public function update(UpdateProdiRequest $request, string $kode_prodi)
    {
        $prodi = Prodi::where('kode_prodi', $kode_prodi)->firstOrFail();
        $prodi->update($request->validated());

        return redirect()
            ->route('baak.prodi.index')
            ->with('success', 'Program Studi berhasil diupdate');
    }

    public function show($kode_prodi)
    {
        $prodi = Prodi::with([
            'dosen',
            'mahasiswa' => function ($query) {
                $query->where('status', 'aktif');
            },
        ])->findOrFail($kode_prodi);

        // Statistik
        $stats = [
            'total_dosen' => $prodi->dosen()->count(),
            'total_mahasiswa' => $prodi->mahasiswa()->where('status', 'aktif')->count(),
            'total_mata_kuliah' => \DB::table('mata_kuliah')
                ->where('kode_prodi', $kode_prodi)
                ->where('is_active', 1)
                ->count(),
            'mahasiswa_per_status' => $prodi->mahasiswa()
                ->select('status', \DB::raw('count(*) as total'))
                ->groupBy('status')
                ->pluck('total', 'status')
                ->toArray(),
        ];

        return Inertia::render('Baak/Prodi/Show', [
            'prodi' => $prodi,
            'stats' => $stats,
        ]);
    }

    public function destroy(string $kode_prodi)
    {
        $prodi = Prodi::where('kode_prodi', $kode_prodi)->firstOrFail();

        // Cek apakah ada mahasiswa yang terkait
        if ($prodi->mahasiswa()->count() > 0) {
            return back()->with('error', 'Program Studi tidak dapat dihapus karena masih memiliki mahasiswa');
        }

        $prodi->delete();

        return redirect()
            ->route('baak.prodi.index')
            ->with('success', 'Program Studi berhasil dihapus');
    }
}
