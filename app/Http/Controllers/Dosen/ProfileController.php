<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        $dosen = Auth::user()->dosen;

        if (!$dosen) {
            abort(403, 'Unauthorized action.');
        }

        $dosen->load('prodi');

        return Inertia::render('Dosen/Profile/Profile', [
            'dosen' => [
                'nama' => $dosen->nama ?? '-',
                'nip' => $dosen->nip ?? '-',
                'jenis_kelamin' => $dosen->jenis_kelamin ?? '-',
                'prodi' => $dosen->prodi ? $dosen->prodi->nama_prodi : '-',
                'alamat' => $dosen->alamat ?? '-',
                'no_hp' => $dosen->no_hp ?? '-',
                'foto' => $dosen->foto_url ?? '/profile.png',
            ]
        ]);
    }

    public function edit()
    {
        $dosen = Auth::user()->dosen;

        if (!$dosen) {
            abort(403, 'Unauthorized action.');
        }

        $dosen->load('prodi');

        return Inertia::render('Dosen/Profile/FormProfile', [
            'dosen' => [
                'nama' => $dosen->nama ?? '',
                'nip' => $dosen->nip ?? '',
                'jenis_kelamin' => $dosen->jenis_kelamin ?? '',
                'prodi' => $dosen->prodi ? $dosen->prodi->nama_prodi : '',
                'alamat' => $dosen->alamat ?? '',
                'no_hp' => $dosen->no_hp ?? '',
                'foto' => $dosen->foto,
                'foto_url' => $dosen->foto_url,
            ]
        ]);
    }

    public function update(Request $request)
    {
        $dosen = Auth::user()->dosen;

        if (!$dosen) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'alamat' => 'nullable|string|max:255',
            'no_hp' => 'nullable|string|max:20',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'hapus_foto' => 'nullable|boolean',
        ]);

        $data = $validated;
        unset($data['hapus_foto']);

        if ($request->hasFile('foto')) {
            if ($dosen->foto) {
                Storage::disk('public')->delete($dosen->foto);
            }
            $data['foto'] = $request->file('foto')->store('dosen', 'public');
        } elseif ($request->boolean('hapus_foto')) {
            if ($dosen->foto) {
                Storage::disk('public')->delete($dosen->foto);
            }
            $data['foto'] = null;
        } else {
            unset($data['foto']);
        }

        $dosen->update($data);

        return redirect()->route('dosen.profile')->with('success', 'Profil berhasil diperbarui!');
    }

    public function gantiPassword()
    {
        return Inertia::render('Dosen/Profile/GantiPassword');
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|current_password',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'current_password.required' => 'Password lama wajib diisi.',
            'current_password.current_password' => 'Password lama tidak sesuai.',
            'password.required' => 'Password baru wajib diisi.',
            'password.min' => 'Password baru minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
        ]);

        Auth::user()->update([
            'password' => bcrypt($request->password),
        ]);

        return redirect()->route('dosen.profile')->with('success', 'Password berhasil diperbarui!');
    }
}
