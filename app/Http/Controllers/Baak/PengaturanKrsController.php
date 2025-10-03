<?php

namespace App\Http\Controllers\Baak;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMataKuliahPeriodeRequest;
use App\Http\Requests\UpdateMataKuliahPeriodeRequest;
use App\Models\MataKuliahPeriode;
use App\Models\MataKuliah;
use App\Models\PeriodeRegistrasi;
use App\Models\Prodi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class PengaturanKrsController extends Controller
{
    public function index(Request $request)
    {
        $query = MataKuliahPeriode::with(['mataKuliah.prodi']);

        // Filter by periode
        if ($request->filled('periode')) {
            [$tahun, $jenis] = explode('-', $request->periode);
            $query->where('tahun_ajaran', $tahun)
                  ->where('jenis_semester', $jenis);
        }

        // Filter by prodi
        if ($request->filled('prodi')) {
            $query->whereHas('mataKuliah', fn($q) => $q->where('kode_prodi', $request->prodi));
        }

        // Search
        if ($request->filled('search')) {
            $query->whereHas('mataKuliah', function($q) use ($request) {
                $q->where('kode_matkul', 'like', "%{$request->search}%")
                  ->orWhere('nama_matkul', 'like', "%{$request->search}%");
            });
        }

        $pengaturan = $query->latest('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Baak/PengaturanKrs/Index', [
            'pengaturan' => $pengaturan,
            'filters' => $request->only(['periode', 'prodi', 'search']),
            'periodes' => PeriodeRegistrasi::orderBy('tahun_ajaran', 'desc')->get(),
            'prodis' => Prodi::orderBy('nama_prodi')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Baak/PengaturanKrs/Create', [
            'periodes' => PeriodeRegistrasi::orderBy('tahun_ajaran', 'desc')->get(),
            'mataKuliah' => MataKuliah::with('prodi')
                ->where('is_active', true)
                ->orderBy('nama_matkul')
                ->get(),
            'prodis' => Prodi::orderBy('nama_prodi')->get(),
        ]);
    }

    public function store(StoreMataKuliahPeriodeRequest $request)
    {
        DB::beginTransaction();

        try {
            foreach ($request->mata_kuliah as $mk) {
                MataKuliahPeriode::create([
                    'kode_matkul' => $mk['kode_matkul'],
                    'tahun_ajaran' => $request->tahun_ajaran,
                    'jenis_semester' => $request->jenis_semester,
                    'semester_ditawarkan' => $mk['semester_ditawarkan'],
                    'kuota' => $mk['kuota'],
                    'is_available' => $mk['is_available'] ?? true,
                    'catatan' => $mk['catatan'] ?? null,
                ]);
            }

            DB::commit();

            return redirect()
                ->route('baak.pengaturan-krs.index')
                ->with('success', 'Pengaturan mata kuliah KRS berhasil disimpan');

        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Gagal menyimpan pengaturan: ' . $e->getMessage());
        }
    }

    public function edit(MataKuliahPeriode $pengaturan_kr)
    {
        return Inertia::render('Baak/PengaturanKrs/Edit', [
            'pengaturan' => $pengaturan_kr->load('mataKuliah.prodi'),
        ]);
    }

    public function update(UpdateMataKuliahPeriodeRequest $request, MataKuliahPeriode $pengaturan_kr)
    {
        $pengaturan_kr->update($request->validated());

        return redirect()
            ->route('baak.pengaturan-krs.index')
            ->with('success', 'Pengaturan mata kuliah berhasil diperbarui');
    }

    public function destroy(MataKuliahPeriode $pengaturan_kr)
    {
        $pengaturan_kr->delete();

        return redirect()
            ->route('baak.pengaturan-krs.index')
            ->with('success', 'Pengaturan mata kuliah berhasil dihapus');
    }

    // Copy dari periode sebelumnya
    public function copy(Request $request)
    {
        $request->validate([
            'from_periode' => 'required|string',
            'to_tahun_ajaran' => 'required|string',
            'to_jenis_semester' => 'required|in:ganjil,genap,pendek',
        ]);

        [$fromTahun, $fromJenis] = explode('-', $request->from_periode);

        DB::beginTransaction();

        try {
            $pengaturanLama = MataKuliahPeriode::where('tahun_ajaran', $fromTahun)
                ->where('jenis_semester', $fromJenis)
                ->get();

            foreach ($pengaturanLama as $item) {
                MataKuliahPeriode::create([
                    'kode_matkul' => $item->kode_matkul,
                    'tahun_ajaran' => $request->to_tahun_ajaran,
                    'jenis_semester' => $request->to_jenis_semester,
                    'semester_ditawarkan' => $item->semester_ditawarkan,
                    'kuota' => $item->kuota,
                    'is_available' => $item->is_available,
                    'catatan' => 'Disalin dari periode ' . $fromTahun . ' ' . $fromJenis,
                ]);
            }

            DB::commit();

            return redirect()
                ->route('baak.pengaturan-krs.index')
                ->with('success', "Berhasil menyalin {$pengaturanLama->count()} mata kuliah dari periode sebelumnya");

        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->with('error', 'Gagal menyalin pengaturan: ' . $e->getMessage());
        }
    }
}
