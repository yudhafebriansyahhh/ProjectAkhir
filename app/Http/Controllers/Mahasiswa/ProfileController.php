<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        if (! $user || ! $user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $mahasiswa = $user->mahasiswa()->with('prodi')->first();

        return Inertia::render('Mahasiswa/Profile/Profile', [
            'mahasiswa' => [
                'nama' => $mahasiswa->nama ?? '-',
                'nim' => $mahasiswa->nim ?? '-',
                'alamat' => $mahasiswa->alamat ?? '-',
                'prodi' => $mahasiswa->prodi ? $mahasiswa->prodi->nama_prodi : '-',
                'jurusan' => $mahasiswa->prodi ? $mahasiswa->prodi->nama_prodi : '-',
                'no_hp' => $mahasiswa->no_hp ?? '-',
                'foto' => $mahasiswa->foto_url ?? '/profile.png',
                'agama' => $mahasiswa->agama ?? '-',
                'nama_ayah' => $mahasiswa->nama_ayah ?? '-',
                'nama_ibu' => $mahasiswa->nama_ibu ?? '-',
                'no_telp_ayah' => $mahasiswa->no_telp_ayah ?? '-',
                'no_telp_ibu' => $mahasiswa->no_telp_ibu ?? '-'
            ]
        ]);
    }

    public function edit()
    {
        $user = auth()->user();
        if (! $user || ! $user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $mahasiswa = $user->mahasiswa()->with('prodi')->first();

        return Inertia::render('Mahasiswa/Profile/FormProfile', [
            'mahasiswa' => [
                'nama' => $mahasiswa->nama ?? '',
                'nim' => $mahasiswa->nim ?? '',
                'alamat' => $mahasiswa->alamat ?? '',
                'prodi' => $mahasiswa->prodi ? $mahasiswa->prodi->nama_prodi : '',
                'jurusan' => $mahasiswa->prodi ? $mahasiswa->prodi->nama_prodi : '',
                'no_hp' => $mahasiswa->no_hp ?? '',
                'agama' => $mahasiswa->agama ?? '',
                'nama_ayah' => $mahasiswa->nama_ayah ?? '',
                'nama_ibu' => $mahasiswa->nama_ibu ?? '',
                'no_telp_ayah' => $mahasiswa->no_telp_ayah ?? '',
                'no_telp_ibu' => $mahasiswa->no_telp_ibu ?? '',
                'foto' => $mahasiswa->foto,
                'foto_url' => $mahasiswa->foto_url,
            ]
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();
        if (! $user || ! $user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $validated = $request->validate([
            'alamat' => 'nullable|string|max:255',
            'no_hp' => 'nullable|string|max:20',
            'agama' => 'nullable|string|max:50',
            'nama_ayah' => 'nullable|string|max:255',
            'nama_ibu' => 'nullable|string|max:255',
            'no_telp_ayah' => 'nullable|string|max:15',
            'no_telp_ibu' => 'nullable|string|max:15',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'hapus_foto' => 'nullable|boolean',
        ]);

        $mahasiswa = $user->mahasiswa;
        if ($mahasiswa) {
            $data = $validated;
            unset($data['hapus_foto']);
            
            if ($request->hasFile('foto')) {
                if ($mahasiswa->foto) {
                    Storage::disk('public')->delete($mahasiswa->foto);
                }
                $data['foto'] = $request->file('foto')->store('mahasiswa', 'public');
            } elseif ($request->boolean('hapus_foto')) {
                if ($mahasiswa->foto) {
                    Storage::disk('public')->delete($mahasiswa->foto);
                }
                $data['foto'] = null;
            } else {
                unset($data['foto']);
            }

            $mahasiswa->update($data);
        }

        return redirect()->route('mahasiswa.profile')->with('success', 'Profil berhasil diperbarui!');
    }

    public function gantiPassword()
    {
        return Inertia::render('Mahasiswa/Profile/GantiPassword');
    }
}
