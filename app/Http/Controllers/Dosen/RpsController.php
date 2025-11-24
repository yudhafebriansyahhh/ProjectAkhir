<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Models\Rps;
use App\Models\Kelas;
use App\Models\MataKuliah;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class RpsController extends Controller
{
    
    private function getMatkulDosen()
    {
        $idDosen = optional(Auth::user())->id_dosen;

     
        try {
            if ($idDosen) {
                $kelas = Kelas::with('mataKuliahPeriode.mataKuliah')
                    ->where('id_dosen', $idDosen)
                    ->get();

                $result = $kelas->filter(function ($item) {
                    return $item->mataKuliahPeriode && $item->mataKuliahPeriode->mataKuliah;
                })
                ->map(function ($item) {
                    return [
                        'kode_matkul' => $item->mataKuliahPeriode->mataKuliah->kode_matkul,
                        'nama_matkul' => $item->mataKuliahPeriode->mataKuliah->nama_matkul,
                    ];
                })
                ->unique('kode_matkul')
                ->values();

                if ($result->isNotEmpty()) {
                    return $result;
                }
            }
        } catch (\Throwable $e) {
         
        }
        return MataKuliah::select('kode_matkul', 'nama_matkul')->get();
    }

   
    public function index()
    {
        $rps = Rps::with('mataKuliah')->get();

        return inertia('Dosen/Rps', [
            'rps' => $rps
        ]);
    }

 
    public function create()
    {
        $mataKuliah = $this->getMatkulDosen();

        // kirim dua nama prop supaya safe dengan komponen yang berbeda
        return inertia('Dosen/TambahRps', [
            'matkul' => $mataKuliah,
            'mataKuliah' => $mataKuliah,
        ]);
    }

   
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_matkul'    => 'required|exists:mata_kuliah,kode_matkul',
            'judul'          => 'required|string',
            'file_rps'       => 'required|file|mimes:jpg,jpeg,pdf|max:10240',
        ]);

        if ($request->hasFile('file_rps')) {
            $validated['file_path'] = $request->file('file_rps')->store('rps', 'public');
        }

        unset($validated['file_rps']);

        Rps::create($validated);

        return redirect()
            ->route('dosen.rps.index')
            ->with('success', 'RPS berhasil ditambahkan');
    }

  
    public function edit($id)
    {
        $rps = Rps::findOrFail($id);

        $mataKuliah = $this->getMatkulDosen();

        
        return inertia('Dosen/EditRps', [
            'rps' => $rps,
            'matkul' => $mataKuliah,
            'mataKuliah' => $mataKuliah,
        ]);
    }

    
 public function update(Request $request, $id)
{
    $rps = Rps::findOrFail($id);

    $validated = $request->validate([
        'kode_matkul'    => 'required|exists:mata_kuliah,kode_matkul',
        'judul'          => 'required|string',
        'file_rps'       => 'nullable|file|mimes:jpg,jpeg,pdf|max:10240',
    ]);

    // Jika user upload file baru
    if ($request->hasFile('file_rps')) {

        if ($rps->file_path && Storage::disk('public')->exists($rps->file_path)) {
            Storage::disk('public')->delete($rps->file_path);
        }

        $validated['file_path'] = $request->file('file_rps')->store('rps', 'public');
    }

    unset($validated['file_rps']);

    $rps->update($validated);

    return redirect()
        ->route('dosen.rps.index')
        ->with('success', 'RPS berhasil diperbarui');
}

   
    public function destroy($id)
    {
        $rps = Rps::findOrFail($id);

        if ($rps->file_path && Storage::disk('public')->exists($rps->file_path)) {
            Storage::disk('public')->delete($rps->file_path);
        }

        $rps->delete();

        return redirect()
            ->route('dosen.rps.index')
            ->with('success', 'RPS berhasil dihapus');
    }
}
