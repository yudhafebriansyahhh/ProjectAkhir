<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\PeriodeRegistrasi;
use App\Models\RegistrasiSemester;
use App\Traits\MahasiswaHelper;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegistrasiController extends Controller
{
    use MahasiswaHelper;

    public function index()
    {
        $user = auth()->user();
        if (! $user || ! $user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $mahasiswa = $user->mahasiswa()->with('prodi')->first();

        return Inertia::render('Mahasiswa/Registrasi', [
            'mahasiswa' => [
                'nama' => $mahasiswa->nama ?? '',
                'nim' => $mahasiswa->nim ?? '',
                'alamat' => $mahasiswa->alamat ?? '',
                'prodi' => $mahasiswa->prodi?->nama_prodi ?? '',
                'jurusan' => $mahasiswa->prodi?->nama_prodi ?? '',
                'no_hp' => $mahasiswa->no_hp ?? '',
                'agama' => $mahasiswa->agama ?? '',
                'nama_ayah' => $mahasiswa->nama_ayah ?? '',
                'nama_ibu' => $mahasiswa->nama_ibu ?? '',
                'no_telp_ayah' => $mahasiswa->no_telp_ayah ?? '',
                'no_telp_ibu' => $mahasiswa->no_telp_ibu ?? '',
            ],
            'registrasiUlang' => $this->getRegistrasiUlangInfo($mahasiswa),
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        if (! $user || ! $user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $mahasiswa = $user->mahasiswa;

        if (! $mahasiswa || $mahasiswa->status !== 'aktif') {
            return back()->with('error', 'Registrasi ulang hanya tersedia untuk mahasiswa aktif.');
        }

        $validated = $request->validate([
            'status_semester' => 'required|in:aktif,cuti',
            'keterangan' => 'nullable|required_if:status_semester,cuti|string|max:500',
            'alamat' => 'nullable|string|max:255',
            'no_hp' => 'nullable|string|max:20',
            'agama' => 'nullable|string|max:50',
            'nama_ayah' => 'nullable|string|max:255',
            'nama_ibu' => 'nullable|string|max:255',
            'no_telp_ayah' => 'nullable|string|max:15',
            'no_telp_ibu' => 'nullable|string|max:15',
        ], [
            'status_semester.required' => 'Pilih status semester terlebih dahulu.',
            'status_semester.in' => 'Status semester tidak valid.',
            'keterangan.required_if' => 'Keterangan wajib diisi jika memilih cuti.',
            'keterangan.max' => 'Keterangan maksimal 500 karakter.',
        ]);

        $periode = PeriodeRegistrasi::getPeriodeAktif();

        if (! $periode) {
            return back()->with('error', 'Belum ada periode registrasi aktif.');
        }

        $alreadyRegistered = RegistrasiSemester::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->where('tahun_ajaran', $periode->tahun_ajaran)
            ->where('jenis_semester', $periode->jenis_semester)
            ->exists();

        if ($alreadyRegistered) {
            return back()->with('error', 'Anda sudah melakukan registrasi ulang untuk periode ini.');
        }

        $profileFields = [
            'alamat',
            'no_hp',
            'agama',
            'nama_ayah',
            'nama_ibu',
            'no_telp_ayah',
            'no_telp_ibu',
        ];
        $profileData = [];
        foreach ($profileFields as $field) {
            $profileData[$field] = array_key_exists($field, $validated)
                ? $validated[$field]
                : $mahasiswa->{$field};
        }

        $mahasiswa->update($profileData);

        RegistrasiSemester::create([
            'id_mahasiswa' => $mahasiswa->id_mahasiswa,
            'tahun_ajaran' => $periode->tahun_ajaran,
            'jenis_semester' => $periode->jenis_semester,
            'semester' => $this->getNextRegistrasiSemester($mahasiswa->id_mahasiswa),
            'status_semester' => $validated['status_semester'],
            'tanggal_registrasi' => now(),
            'keterangan' => ($validated['keterangan'] ?? null) ?: 'Registrasi ulang mandiri mahasiswa.',
        ]);

        return back()->with('success', 'Registrasi ulang semester berhasil disimpan.');
    }
}
