<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DosenController extends Controller
{
    public function dashboard()
    {
        return Inertia::render("Dosen/Index");
    }
    public function nilai()
    {
        return Inertia::render("Dosen/Nilai");
    }

    public function input_nilai()
    {
        return Inertia::render("Dosen/InputNilai");
    }

    public function edit_nilai()
    {
        return Inertia::render("Dosen/EditNilai");
    }
    public function rps()
    {
        return Inertia::render("Dosen/Rps");
    }
    public function tambah_rps()
    {
        return Inertia::render("Dosen/TambahRps");
    }
    public function edit_rps()
    {
        return Inertia::render("Dosen/EditRps");
    }
    public function absensi()
    {
        return Inertia::render("Dosen/Absensi");
    }
    public function jadwal()
    {
        return Inertia::render("Dosen/Jadwal");
    }
}
