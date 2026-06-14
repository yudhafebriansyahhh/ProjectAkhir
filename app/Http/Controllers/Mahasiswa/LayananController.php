<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PengajuanLayanan;
use App\Models\Krs;
use Inertia\Inertia;

class LayananController extends Controller
{
    public function index(Request $request)
    {
        $mahasiswa = auth()->user()->mahasiswa;
        
        $pengajuans = PengajuanLayanan::with('krs')
            ->where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->latest()
            ->paginate(10);
            
        // Get KRS approved to populate the dropdown for KHS/KRS requests
        $krsList = Krs::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->where('status', 'approved')
            ->orderBy('tahun_ajaran', 'desc')
            ->orderBy('semester', 'desc')
            ->get(['id_krs', 'semester', 'tahun_ajaran']);

        // Cari pengajuan yang sudah selesai tapi belum dirating
        $unratedPengajuan = PengajuanLayanan::with('krs')
            ->where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->where('status', 'selesai')
            ->whereNull('rating')
            ->first();

        return Inertia::render('Mahasiswa/Layanan/Index', [
            'pengajuans' => $pengajuans,
            'krsList' => $krsList,
            'unratedPengajuan' => $unratedPengajuan,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'jenis_layanan' => 'required|in:cetak_krs,cetak_khs,transkrip',
            'id_krs' => 'required_if:jenis_layanan,cetak_krs,cetak_khs',
            'keterangan' => 'nullable|string|max:255',
        ]);

        $mahasiswa = auth()->user()->mahasiswa;

        // Cek apakah ada pengajuan pending yang sama
        $existing = PengajuanLayanan::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->where('jenis_layanan', $request->jenis_layanan)
            ->where('status', 'pending')
            ->when($request->id_krs, function($q) use ($request) {
                return $q->where('id_krs', $request->id_krs);
            })
            ->first();

        if ($existing) {
            return redirect()->back()->with('error', 'Anda masih memiliki pengajuan layanan ini yang berstatus pending.');
        }

        // Cek apakah ada pengajuan selesai yang belum dirating
        $unrated = PengajuanLayanan::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->where('status', 'selesai')
            ->whereNull('rating')
            ->first();

        if ($unrated) {
            return redirect()->back()->with('error', 'Anda harus memberikan rating pada layanan yang telah selesai sebelum dapat mengajukan permohonan baru.');
        }

        PengajuanLayanan::create([
            'id_mahasiswa' => $mahasiswa->id_mahasiswa,
            'jenis_layanan' => $request->jenis_layanan,
            'id_krs' => $request->jenis_layanan === 'transkrip' ? null : $request->id_krs,
            'keterangan' => $request->keterangan,
            'status' => 'pending',
        ]);

        return redirect()->back()->with('success', 'Pengajuan layanan berhasil dikirim.');
    }

    public function rate(Request $request, $id)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'komentar_rating' => 'nullable|string',
        ]);

        $mahasiswa = auth()->user()->mahasiswa;
        
        $pengajuan = PengajuanLayanan::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->where('id', $id)
            ->where('status', 'selesai')
            ->firstOrFail();

        $pengajuan->update([
            'rating' => $request->rating,
            'komentar_rating' => $request->komentar_rating,
        ]);

        return redirect()->back()->with('success', 'Terima kasih atas penilaian Anda.');
    }
}
