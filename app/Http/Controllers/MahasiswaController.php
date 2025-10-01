<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MahasiswaController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('Mahasiswa/Index');
    }

    public function nilai()
    {
        return Inertia::render('Mahasiswa/Nilai');
    }

    public function penjadwalan()
    {
        return Inertia::render('Mahasiswa/Penjadwalan');
    }

    public function krs()
    {
        return Inertia::render('Mahasiswa/Krs');
    }

    public function absensi()
    {
        return Inertia::render('Mahasiswa/Absensi');
    }


    public function profile()
    {
        return Inertia::render('Mahasiswa/Profile');
    }

    public function tambah_krs()
    {
        return Inertia::render('Mahasiswa/FormKrs');
    }
    public function perbarui_data()
    {
        return Inertia::render('Mahasiswa/FormProfile');
    }
    public function ganti_password()
    {
        return Inertia::render('Mahasiswa/GantiPassword');
    }
}
