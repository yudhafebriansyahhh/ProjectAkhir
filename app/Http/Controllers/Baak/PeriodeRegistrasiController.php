<?php

namespace App\Http\Controllers\Baak;

use App\Http\Controllers\Controller;
use App\Http\Requests\Baak\StorePeriodeRegistrasiRequest;
use App\Http\Requests\Baak\UpdatePeriodeRegistrasiRequest;
use App\Models\PeriodeRegistrasi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PeriodeRegistrasiController extends Controller
{
    public function index(Request $request)
    {
        $query = PeriodeRegistrasi::query();

        // Filter by tahun ajaran
        if ($request->tahun_ajaran) {
            $query->where('tahun_ajaran', $request->tahun_ajaran);
        }

        // Search
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('tahun_ajaran', 'like', "%{$request->search}%");
            });
        }

        $periodes = $query->orderBy('tahun_ajaran', 'desc')
            ->orderBy('jenis_semester', 'desc')
            ->paginate(10)
            ->withQueryString();

        // Get unique tahun ajaran untuk filter
        $tahunAjaranList = PeriodeRegistrasi::select('tahun_ajaran')
            ->distinct()
            ->orderBy('tahun_ajaran', 'desc')
            ->pluck('tahun_ajaran');

        return Inertia::render('Baak/PeriodeRegistrasi/Index', [
            'periodes' => $periodes,
            'tahunAjaranList' => $tahunAjaranList,
            'filters' => $request->only(['search', 'tahun_ajaran']),
        ]);
    }

    public function create()
    {
        // Generate default tahun ajaran (tahun sekarang)
        $currentYear = date('Y');
        $defaultTahunAjaran = $currentYear . '/' . ($currentYear + 1);

        return Inertia::render('Baak/PeriodeRegistrasi/Create', [
            'defaultTahunAjaran' => $defaultTahunAjaran,
        ]);
    }

    public function store(StorePeriodeRegistrasiRequest $request)
    {
        PeriodeRegistrasi::create([
            'tahun_ajaran' => $request->tahun_ajaran,
            'jenis_semester' => $request->jenis_semester,
            'tanggal_mulai' => $request->tanggal_mulai,
            'tanggal_selesai' => $request->tanggal_selesai,
            'status' => 'tutup', // Default status
        ]);

        return redirect()
            ->route('baak.periode-registrasi.index')
            ->with('success', 'Periode registrasi berhasil ditambahkan');
    }

    public function edit(PeriodeRegistrasi $periodeRegistrasi)
    {
        return Inertia::render('Baak/PeriodeRegistrasi/Edit', [
            'periode' => $periodeRegistrasi,
        ]);
    }

    public function update(UpdatePeriodeRegistrasiRequest $request, PeriodeRegistrasi $periodeRegistrasi)
    {
        $periodeRegistrasi->update([
            'tanggal_mulai' => $request->tanggal_mulai,
            'tanggal_selesai' => $request->tanggal_selesai,
        ]);

        return redirect()
            ->route('baak.periode-registrasi.index')
            ->with('success', 'Periode registrasi berhasil diperbarui');
    }

    public function destroy(PeriodeRegistrasi $periodeRegistrasi)
    {
        // Cek apakah periode sedang aktif
        if ($periodeRegistrasi->status === 'aktif') {
            return back()->with('error', 'Tidak dapat menghapus periode yang sedang aktif');
        }

        // Cek apakah ada registrasi semester
        if ($periodeRegistrasi->registrasiSemester()->exists()) {
            return back()->with('error', 'Tidak dapat menghapus periode yang sudah memiliki data registrasi');
        }

        $periodeRegistrasi->delete();

        return redirect()
            ->route('baak.periode-registrasi.index')
            ->with('success', 'Periode registrasi berhasil dihapus');
    }

    public function toggleStatus(PeriodeRegistrasi $periodeRegistrasi)
    {
        // Jika akan mengaktifkan periode ini
        if ($periodeRegistrasi->status === 'tutup') {
            // Tutup semua periode yang sedang aktif
            PeriodeRegistrasi::where('status', 'aktif')->update(['status' => 'tutup']);

            // Aktifkan periode ini
            $periodeRegistrasi->update(['status' => 'aktif']);

            $message = 'Periode registrasi berhasil diaktifkan';
        } else {
            // Tutup periode ini
            $periodeRegistrasi->update(['status' => 'tutup']);

            $message = 'Periode registrasi berhasil ditutup';
        }

        return back()->with('success', $message);
    }
}
