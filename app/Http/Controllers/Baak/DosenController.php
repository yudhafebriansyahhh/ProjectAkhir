<?php

namespace App\Http\Controllers\Baak;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDosenRequest;
use App\Http\Requests\UpdateDosenRequest;
use App\Models\Dosen;
use App\Models\Prodi;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\DosenExport;
use App\Exports\DosenTemplateExport;
use App\Imports\DosenImport;
use Inertia\Inertia;

class DosenController extends Controller
{
    public function index()
    {
        $search = request('search');
        $kodeProdi = request('prodi');

        $dosen = Dosen::with(['prodi', 'user'])
            ->withCount(['kelas', 'mahasiswaBimbingan'])
            ->when($search, fn ($query) => $query->where(function ($query) use ($search) {
                $query->where('nip', 'like', '%'.$search.'%')
                    ->orWhere('nama', 'like', '%'.$search.'%');
            })
            )
            ->when($kodeProdi, fn ($query) => $query->where('kode_prodi', $kodeProdi)
            )
            ->orderBy('nama', 'asc')
            ->paginate(10)
            ->withQueryString();

        $prodi_list = Prodi::orderBy('nama_prodi')->get();
        $stats = [
            'total' => Dosen::count(),
            'total_prodi' => Dosen::distinct('kode_prodi')->count('kode_prodi'),
            'total_kelas' => Dosen::withCount('kelas')->get()->sum('kelas_count'),
            'total_bimbingan' => Dosen::withCount('mahasiswaBimbingan')->get()->sum('mahasiswa_bimbingan_count'),
        ];

        return Inertia::render('Baak/Dosen/Index', [
            'dosen' => $dosen,
            'prodi_list' => $prodi_list,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'prodi' => $kodeProdi,
            ],
        ]);
    }

    public function create()
    {
        $prodi = Prodi::orderBy('nama_prodi')->get();

        return Inertia::render('Baak/Dosen/Create', [
            'prodi' => $prodi,
        ]);
    }

    public function store(StoreDosenRequest $request)
    {
        $data = $request->validated();

        // Generate email
        $emailUsername = strtolower(str_replace(' ', '', $data['nama']));
        $data['email'] = $emailUsername.'@itbriau.ac.id';

        // Ensure unique email
        $counter = 1;
        while (User::where('email', $data['email'])->exists()) {
            $data['email'] = $emailUsername.$counter.'@itbriau.ac.id';
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
            'prodi',
            'user',
            'kelas.mataKuliahPeriode.mataKuliah', // ✅ FIX: Load via mataKuliahPeriode
            'mahasiswaBimbingan',
        ]);

        $dosen->loadCount(['kelas', 'mahasiswaBimbingan']);

        return Inertia::render('Baak/Dosen/Show', [
            'dosen' => $dosen,
        ]);
    }

    public function edit(Dosen $dosen)
    {
        $dosen->load('prodi');
        $prodi = Prodi::orderBy('nama_prodi')->get();

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
        } elseif ($request->boolean('hapus_foto')) {
            if ($dosen->foto) {
                Storage::disk('public')->delete($dosen->foto);
            }
            $data['foto'] = null;
        } else {
            unset($data['foto']);
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
        if (! $dosen->user) {
            return back()->withErrors(['error' => 'User tidak ditemukan']);
        }

        $dosen->user->update([
            'password' => Hash::make($dosen->nip),
        ]);

        return back()->with('success', 'Password berhasil direset ke NIP: '.$dosen->nip);
    }

    public function exportExcel()
    {
        return Excel::download(new DosenExport, 'data_dosen.xlsx');
    }

    public function exportTemplate()
    {
        return Excel::download(new DosenTemplateExport, 'template_import_dosen.xlsx');
    }

    public function importExcel(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:2048',
        ]);

        try {
            Excel::import(new DosenImport, $request->file('file'));
            return redirect()->back()->with('success', 'Data dosen berhasil diimport!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat import: ' . $e->getMessage());
        }
    }
}
