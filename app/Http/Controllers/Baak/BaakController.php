<?php

namespace App\Http\Controllers\Baak;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Mahasiswa;
use App\Models\Dosen;
use App\Models\Prodi;
use App\Models\MataKuliah;

class BaakController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'mahasiswa' => Mahasiswa::count(),
            'dosen' => Dosen::count(),
            'prodi' => Prodi::count(),
            'matakuliah' => MataKuliah::count(),
            'ruangan' => 10, // hardcoded karena belum ada tabel ruangan
        ];

        return Inertia::render('Baak/Dashboard', [
            'stats' => $stats,
        ]);
    }
}
