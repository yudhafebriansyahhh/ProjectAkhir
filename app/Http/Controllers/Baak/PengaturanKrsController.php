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
        $periodeSumber = MataKuliahPeriode::select('tahun_ajaran', 'jenis_semester')
            ->distinct()
            ->orderBy('tahun_ajaran', 'desc')
            ->orderByRaw("FIELD(jenis_semester, 'ganjil', 'genap', 'pendek')")
            ->get();

        return Inertia::render('Baak/PengaturanKrs/Create', [
            'periodes' => PeriodeRegistrasi::orderBy('tahun_ajaran', 'desc')->get(),
            'periodeSumber' => $periodeSumber,
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
            'kode_prodi' => 'nullable|exists:prodi,kode_prodi',
            'to_tahun_ajaran' => 'required|string',
            'to_jenis_semester' => 'required|in:ganjil,genap,pendek',
        ]);

        $separator = str_contains($request->from_periode, '|') ? '|' : '-';
        $fromParts = explode($separator, $request->from_periode, 2);

        if (count($fromParts) !== 2 || ! in_array($fromParts[1], ['ganjil', 'genap', 'pendek'], true)) {
            return redirect()
                ->back()
                ->with('error', 'Format periode sumber tidak valid.');
        }

        [$fromTahun, $fromJenis] = $fromParts;

        if ($fromTahun === $request->to_tahun_ajaran && $fromJenis === $request->to_jenis_semester) {
            return redirect()
                ->back()
                ->with('error', 'Periode tujuan harus berbeda dari periode sumber.');
        }

        DB::beginTransaction();

        try {
            $pengaturanLama = MataKuliahPeriode::where('tahun_ajaran', $fromTahun)
                ->where('jenis_semester', $fromJenis)
                ->when($request->filled('kode_prodi'), fn ($query) => $query->where('kode_prodi', $request->kode_prodi))
                ->get();

            if ($pengaturanLama->isEmpty()) {
                DB::rollBack();

                return redirect()
                    ->back()
                    ->with('error', $request->filled('kode_prodi')
                        ? 'Tidak ada pengaturan yang bisa disalin dari periode sumber untuk prodi yang dipilih.'
                        : 'Tidak ada pengaturan yang bisa disalin dari periode sumber.');
            }

            $createdCount = 0;

            foreach ($pengaturanLama as $item) {
                $copied = MataKuliahPeriode::firstOrCreate([
                    'kode_matkul' => $item->kode_matkul,
                    'kode_prodi' => $item->kode_prodi,
                    'tahun_ajaran' => $request->to_tahun_ajaran,
                    'jenis_semester' => $request->to_jenis_semester,
                    'semester_ditawarkan' => $item->semester_ditawarkan,
                ], [
                    'catatan' => 'Disalin dari periode ' . $fromTahun . ' ' . $fromJenis,
                ]);

                if ($copied->wasRecentlyCreated) {
                    $createdCount++;
                }
            }

            DB::commit();

            if ($createdCount === 0) {
                return redirect()
                    ->back()
                    ->with('success', 'Semua pengaturan dari periode sumber sudah ada di periode tujuan.');
            }

            return redirect()
                ->back()
                ->with('success', "Berhasil menyalin {$createdCount} pengaturan mata kuliah dari periode sebelumnya");

        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->with('error', 'Gagal menyalin pengaturan: ' . $e->getMessage());
        }
    }
}
