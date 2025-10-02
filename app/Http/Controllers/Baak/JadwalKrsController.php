<?php

namespace App\Http\Controllers\Baak;

use App\Http\Controllers\Controller;
use App\Http\Requests\Baak\StoreJadwalKrsRequest;
use App\Http\Requests\Baak\UpdateJadwalKrsRequest;
use App\Models\JadwalPengisianKrs;
use App\Models\Prodi;
use App\Models\PeriodeRegistrasi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JadwalKrsController extends Controller
{
    public function index(Request $request)
    {
        $query = JadwalPengisianKrs::with(['prodi.fakultas']);

        if ($request->filled('prodi')) {
            $query->where('kode_prodi', $request->prodi);
        }

        if ($request->filled('tahun_ajaran')) {
            $query->where('tahun_ajaran', $request->tahun_ajaran);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('prodi', function($q) use ($search) {
                $q->where('nama_prodi', 'like', "%{$search}%");
            });
        }

        $jadwalKrs = $query->latest()->paginate(10)->withQueryString();

        $jadwalKrs->getCollection()->transform(function ($jadwal) {
            $jadwal->status_label = $this->getStatusLabel($jadwal);
            $jadwal->status_badge = $this->getStatusBadge($jadwal);
            $jadwal->durasi = $jadwal->tanggal_mulai->diffInDays($jadwal->tanggal_selesai) + 1;
            return $jadwal;
        });

        return Inertia::render('Baak/JadwalKrs/Index', [
            'jadwalKrs' => $jadwalKrs,
            'prodiList' => Prodi::select('kode_prodi', 'nama_prodi')->get(),
            'filters' => $request->only(['prodi', 'tahun_ajaran', 'search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Baak/JadwalKrs/Create', [
            'prodiList' => Prodi::with('fakultas')->get(),
            'periodeList' => PeriodeRegistrasi::where('status', 'aktif')->get(),
        ]);
    }

    public function store(StoreJadwalKrsRequest $request)
    {
        JadwalPengisianKrs::create($request->validated());

        return redirect()->route('baak.jadwal-krs.index')
            ->with('success', 'Jadwal KRS berhasil ditambahkan');
    }

    public function edit(JadwalPengisianKrs $jadwalKrs)
    {
        $jadwalKrs->load('prodi.fakultas');

        return Inertia::render('Baak/JadwalKrs/Edit', [
            'jadwalKrs' => $jadwalKrs,
            'prodiList' => Prodi::with('fakultas')->get(),
        ]);
    }

    public function update(UpdateJadwalKrsRequest $request, JadwalPengisianKrs $jadwalKrs)
    {
        $jadwalKrs->update($request->validated());

        return redirect()->route('baak.jadwal-krs.index')
            ->with('success', 'Jadwal KRS berhasil diperbarui');
    }

    public function destroy(JadwalPengisianKrs $jadwalKrs)
    {
        $hasMahasiswa = \DB::table('krs')
            ->join('mahasiswa', 'krs.id_mahasiswa', '=', 'mahasiswa.id_mahasiswa')
            ->where('mahasiswa.kode_prodi', $jadwalKrs->kode_prodi)
            ->where('krs.semester', $jadwalKrs->semester)
            ->where('krs.tahun_ajaran', $jadwalKrs->tahun_ajaran)
            ->exists();

        if ($hasMahasiswa) {
            return back()->withErrors([
                'delete' => 'Tidak dapat menghapus jadwal KRS karena sudah ada mahasiswa yang mengisi KRS'
            ]);
        }

        $jadwalKrs->delete();

        return redirect()->route('baak.jadwal-krs.index')
            ->with('success', 'Jadwal KRS berhasil dihapus');
    }

    private function getStatusLabel($jadwal)
    {
        $now = now();
        $mulai = $jadwal->tanggal_mulai;
        $selesai = $jadwal->tanggal_selesai;

        if ($now->lt($mulai)) {
            return 'Belum Mulai';
        } elseif ($now->between($mulai, $selesai)) {
            return 'Sedang Berjalan';
        } else {
            return 'Sudah Selesai';
        }
    }

    private function getStatusBadge($jadwal)
    {
        $status = $this->getStatusLabel($jadwal);

        return match($status) {
            'Belum Mulai' => 'bg-gray-100 text-gray-700',
            'Sedang Berjalan' => 'bg-blue-100 text-blue-700',
            'Sudah Selesai' => 'bg-green-100 text-green-700',
            default => 'bg-gray-100 text-gray-700',
        };
    }
}
