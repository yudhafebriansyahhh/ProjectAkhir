<?php

namespace App\Http\Controllers\Baak;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRegistrasiSemesterRequest;
use App\Http\Requests\UpdateRegistrasiSemesterRequest;
use App\Models\RegistrasiSemester;
use App\Models\Mahasiswa;
use App\Models\PeriodeRegistrasi;
use App\Models\Prodi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegistrasiSemesterController extends Controller
{
    public function index(Request $request)
    {
        $query = RegistrasiSemester::with(['mahasiswa.prodi.fakultas']);

        $this->applyFilters($query, $request);

        $registrasi = $query->latest('tanggal_registrasi')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Baak/RegistrasiSemester/Index', [
            'registrasi' => $registrasi,
            'filters' => $request->only(['periode', 'prodi', 'status', 'search']),
            'periodes' => PeriodeRegistrasi::orderBy('tahun_ajaran', 'desc')->get(),
            'prodis' => Prodi::orderBy('nama_prodi')->get(),
            'statistik' => $this->getStatistik($request->periode),
        ]);
    }

    public function create()
    {
        return Inertia::render('Baak/RegistrasiSemester/Create', [
            'periodes' => PeriodeRegistrasi::where('status', 'aktif')
                ->orderBy('tahun_ajaran', 'desc')
                ->get(),
        ]);
    }

    public function store(StoreRegistrasiSemesterRequest $request)
    {
        $mahasiswa = Mahasiswa::where('nim', $request->nim)->firstOrFail();

        RegistrasiSemester::create([
            ...$request->validated(),
            'id_mahasiswa' => $mahasiswa->id_mahasiswa,
            'semester' => $this->getNextSemester($mahasiswa->id_mahasiswa),
            'tanggal_registrasi' => now(),
        ]);

        return redirect()
            ->route('baak.registrasi-semester.index')
            ->with('success', 'Registrasi mahasiswa berhasil ditambahkan');
    }

    public function edit(RegistrasiSemester $registrasi_semester)
    {
        return Inertia::render('Baak/RegistrasiSemester/Edit', [
            'registrasi' => $registrasi_semester->load('mahasiswa.prodi'),
        ]);
    }

    public function update(UpdateRegistrasiSemesterRequest $request, RegistrasiSemester $registrasi_semester)
    {
        $registrasi_semester->update($request->validated());

        return redirect()
            ->route('baak.registrasi-semester.index')
            ->with('success', 'Data registrasi berhasil diperbarui');
    }

    public function destroy(RegistrasiSemester $registrasi_semester)
    {
        $registrasi_semester->delete();

        return redirect()
            ->route('baak.registrasi-semester.index')
            ->with('success', 'Data registrasi berhasil dihapus');
    }

    public function searchMahasiswa(Request $request)
    {
        $request->validate(['search' => 'required|string|min:3']);

        $mahasiswa = Mahasiswa::with('prodi')
            ->where(function($q) use ($request) {
                $q->where('nim', 'like', "%{$request->search}%")
                  ->orWhere('nama', 'like', "%{$request->search}%");
            })
            ->where('status', 'aktif')
            ->limit(10)
            ->get();

        return response()->json($mahasiswa);
    }

    private function applyFilters($query, Request $request)
    {
        if ($request->filled('periode')) {
            [$tahun, $jenis] = explode('-', $request->periode);
            $query->where('tahun_ajaran', $tahun)
                  ->where('jenis_semester', $jenis);
        }

        if ($request->filled('prodi')) {
            $query->whereHas('mahasiswa', fn($q) => $q->where('kode_prodi', $request->prodi));
        }

        if ($request->filled('status')) {
            $query->where('status_semester', $request->status);
        }

        if ($request->filled('search')) {
            $query->whereHas('mahasiswa', function($q) use ($request) {
                $q->where('nim', 'like', "%{$request->search}%")
                  ->orWhere('nama', 'like', "%{$request->search}%");
            });
        }
    }

    private function getStatistik($periode)
    {
        if (!$periode) return [];

        [$tahun, $jenis] = explode('-', $periode);

        return Prodi::with('mahasiswa')
            ->get()
            ->map(function($prodi) use ($tahun, $jenis) {
                $totalMhs = $prodi->mahasiswa()->where('status', 'aktif')->count();
                $sudahRegistrasi = RegistrasiSemester::whereHas('mahasiswa', fn($q) =>
                        $q->where('kode_prodi', $prodi->kode_prodi)
                    )
                    ->where('tahun_ajaran', $tahun)
                    ->where('jenis_semester', $jenis)
                    ->count();

                return [
                    'prodi' => $prodi->nama_prodi,
                    'total' => $totalMhs,
                    'sudah' => $sudahRegistrasi,
                    'belum' => $totalMhs - $sudahRegistrasi,
                    'persentase' => $totalMhs > 0 ? round(($sudahRegistrasi / $totalMhs) * 100, 1) : 0
                ];
            })
            ->toArray();
    }

    private function getNextSemester($id_mahasiswa)
    {
        $lastRegistrasi = RegistrasiSemester::where('id_mahasiswa', $id_mahasiswa)
            ->latest('semester')
            ->first();

        return $lastRegistrasi ? $lastRegistrasi->semester + 1 : 1;
    }
}
