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
        $query = MataKuliahPeriode::with(['mataKuliah', 'prodi', 'kelas']);

        // Filter tahun ajaran
        if ($request->filled('tahun_ajaran')) {
            $query->where('tahun_ajaran', $request->tahun_ajaran);
        }

        // Filter jenis semester
        if ($request->filled('jenis_semester')) {
            $query->where('jenis_semester', $request->jenis_semester);
        }

        // Filter prodi
        if ($request->filled('kode_prodi')) {
            $query->where('kode_prodi', $request->kode_prodi);
        }

        // Filter semester
        if ($request->filled('semester')) {
            $query->where('semester_ditawarkan', $request->semester);
        }

        $pengaturan = $query->orderBy('semester_ditawarkan')
            ->orderBy('kode_matkul')
            ->get();

        // Get unique tahun ajaran for filter
        $periodes = MataKuliahPeriode::select('tahun_ajaran')
            ->distinct()
            ->orderBy('tahun_ajaran', 'desc')
            ->get();

        return Inertia::render('Baak/PengaturanKrs/Index', [
            'pengaturan' => $pengaturan,
            'filters' => $request->only(['tahun_ajaran', 'jenis_semester', 'kode_prodi', 'semester']),
            'prodis' => Prodi::orderBy('nama_prodi')->get(),
            'periodes' => $periodes,
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
                    'kode_prodi' => $request->kode_prodi,
                    'tahun_ajaran' => $request->tahun_ajaran,
                    'jenis_semester' => $request->jenis_semester,
                    'semester_ditawarkan' => $request->semester_ditawarkan,
                    'catatan' => $mk['catatan'] ?? null,
                ]);
            }

            DB::commit();

            $jumlahMk = count($request->mata_kuliah);

            return redirect()
                ->route('baak.pengaturan-krs.index')
                ->with('success', "Berhasil menyimpan {$jumlahMk} mata kuliah untuk semester {$request->semester_ditawarkan}");

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
            'pengaturan' => $pengaturan_kr->load(['mataKuliah', 'prodi']),
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
        // Cek apakah ada kelas
        if ($pengaturan_kr->kelas()->count() > 0) {
            return redirect()
                ->back()
                ->with('error', 'Tidak dapat menghapus. Mata kuliah ini sudah memiliki kelas.');
        }

        $pengaturan_kr->delete();

        return redirect()
            ->route('baak.pengaturan-krs.index')
            ->with('success', 'Pengaturan mata kuliah berhasil dihapus');
    }

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
