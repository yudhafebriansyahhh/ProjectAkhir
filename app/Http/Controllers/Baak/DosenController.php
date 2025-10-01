<?php

namespace App\Http\Controllers\Baak;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDosenRequest;
use App\Http\Requests\UpdateDosenRequest;
use App\Models\Dosen;
use App\Models\Prodi;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DosenController extends Controller
{
    public function index()
    {
        $search = request('search');
        $kodeProdi = request('prodi');

        $dosen = Dosen::with(['prodi.fakultas', 'user'])
            ->withCount(['kelas', 'mahasiswaBimbingan'])
            ->when($search, fn($query) =>
                $query->where('nip', 'like', '%' . $search . '%')
                      ->orWhere('nama', 'like', '%' . $search . '%')
            )
            ->when($kodeProdi, fn($query) =>
                $query->where('kode_prodi', $kodeProdi)
            )
            ->orderBy('nama', 'asc')
            ->paginate(10)
            ->withQueryString();

        $prodi_list = Prodi::with('fakultas')->orderBy('nama_prodi')->get();

        return Inertia::render('Baak/Dosen/Index', [
            'dosen' => $dosen,
            'prodi_list' => $prodi_list,
            'filters' => [
                'search' => $search,
                'prodi' => $kodeProdi,
            ],
        ]);
    }

    public function create()
    {
        $prodi = Prodi::with('fakultas')->orderBy('nama_prodi')->get();

        return Inertia::render('Baak/Dosen/Create', [
            'prodi' => $prodi,
        ]);
    }

    public function store(StoreDosenRequest $request)
    {
        $data = $request->validated();

        // Generate email
        $emailUsername = strtolower(str_replace(' ', '', $data['nama']));
        $data['email'] = $emailUsername . '@itbriau.ac.id';

        // Ensure unique email
        $counter = 1;
        while (User::where('email', $data['email'])->exists()) {
            $data['email'] = $emailUsername . $counter . '@itbriau.ac.id';
            $counter++;
        }

        // Handle foto upload
        if ($request->hasFile('foto')) {
            $data['foto'] = $request->file('foto')->store('dosen', 'public');
        }

        // Create user
        $user = User::create([
            'role' => 'dosen',
            'username' => $data['nip'],
            'email' => $data['email'],
            'password' => Hash::make($data['nip']), // Password default = NIP
        ]);

        // Create dosen
        $data['user_id'] = $user->id;
        unset($data['email']); // Remove email from dosen data

        Dosen::create($data);

        return redirect()->route('baak.dosen.index')
            ->with('success', "Dosen berhasil ditambahkan. Username: {$data['nip']}, Password: {$data['nip']}");
    }

    public function show(Dosen $dosen)
    {
        $dosen->load([
            'prodi.fakultas',
            'user',
            'kelas.mataKuliah',
            'mahasiswaBimbingan'
        ]);

        $dosen->loadCount(['kelas', 'mahasiswaBimbingan']);

        return Inertia::render('Baak/Dosen/Show', [
            'dosen' => $dosen,
        ]);
    }

    public function edit(Dosen $dosen)
    {
        $dosen->load('prodi');
        $prodi = Prodi::with('fakultas')->orderBy('nama_prodi')->get();

        return Inertia::render('Baak/Dosen/Edit', [
            'dosen' => $dosen,
            'prodi' => $prodi,
        ]);
    }

    public function update(UpdateDosenRequest $request, Dosen $dosen)
    {
        $data = $request->validated();

        // Handle foto upload
        if ($request->hasFile('foto')) {
            // Delete old foto if exists
            if ($dosen->foto) {
                Storage::disk('public')->delete($dosen->foto);
            }
            $data['foto'] = $request->file('foto')->store('dosen', 'public');
        }

        // Update dosen
        $dosen->update($data);

        // Update username di user jika NIP berubah
        if ($dosen->user->username !== $data['nip']) {
            $dosen->user->update([
                'username' => $data['nip'],
            ]);
        }

        return redirect()->route('baak.dosen.index')
            ->with('success', 'Data dosen berhasil diupdate');
    }

    public function destroy(Dosen $dosen)
    {
        // Cek apakah ada kelas yang diampu
        if ($dosen->kelas()->count() > 0) {
            return back()->with('error', 'Dosen tidak dapat dihapus karena masih mengampu kelas');
        }

        // Cek apakah ada mahasiswa bimbingan
        if ($dosen->mahasiswaBimbingan()->count() > 0) {
            return back()->with('error', 'Dosen tidak dapat dihapus karena masih menjadi dosen wali mahasiswa');
        }

        // Delete foto if exists
        if ($dosen->foto) {
            Storage::disk('public')->delete($dosen->foto);
        }

        // Delete user if exists
        if ($dosen->user) {
            $dosen->user->delete();
        }

        // Delete dosen (akan cascade delete via user relationship)
        $dosen->delete();

        return redirect()->route('baak.dosen.index')
            ->with('success', 'Data dosen berhasil dihapus');
    }

    public function resetPassword(Dosen $dosen)
    {
        if (!$dosen->user) {
            return back()->withErrors(['error' => 'User tidak ditemukan']);
        }

        $dosen->user->update([
            'password' => Hash::make($dosen->nip)
        ]);

        return back()->with('success', 'Password berhasil direset ke NIP: ' . $dosen->nip);
    }
}
