<?php

use App\Http\Controllers\Baak\BaakController;
use App\Http\Controllers\Baak\FakultasController;
use App\Http\Controllers\Baak\JadwalKrsController;
use App\Http\Controllers\Baak\KelasController;
use App\Http\Controllers\Baak\KrsController;
use App\Http\Controllers\Baak\PengaturanKrsController;
use App\Http\Controllers\Baak\PeriodeRegistrasiController;
use App\Http\Controllers\Baak\RegistrasiSemesterController;
use App\Http\Controllers\DosenController;
use App\Http\Controllers\MahasiswaController;
use App\Http\Controllers\Baak\MataKuliahController;
use App\Http\Controllers\Baak\ProdiController;
use Illuminate\Support\Facades\Route;

// Root route
Route::get('/', function () {
    if (auth()->check()) {
        return match (auth()->user()->role) {
            'mahasiswa' => redirect()->route('mahasiswa.dashboard'),
            'dosen' => redirect()->route('dosen.dashboard'),
            'baak' => redirect()->route('baak.dashboard'),
            default => redirect()->route('login'),
        };
    }
    return redirect()->route('login');
})->name('home');

// Auth routes
require __DIR__ . '/auth.php';

// BAAK routes
Route::middleware(['auth', 'role:baak'])->prefix('baak')->name('baak.')->group(function () {
    Route::get('/dashboard', [BaakController::class, 'dashboard'])->name('dashboard');

    // Mahasiswa Routes
    Route::resource('mahasiswa', \App\Http\Controllers\Baak\MahasiswaController::class);
    Route::post('/mahasiswa/{mahasiswa}/reset-password', [\App\Http\Controllers\Baak\MahasiswaController::class, 'resetPassword'])->name('mahasiswa.reset-password');
    // Dosen Routes
    Route::resource('dosen', \App\Http\Controllers\Baak\DosenController::class);

    Route::resource('kelas', KelasController::class);
     Route::post('/kelas/get-mata-kuliah-by-periode', [KelasController::class, 'getMataKuliahByPeriode'])
        ->name('kelas.get-mata-kuliah-by-periode');
    // Fakultas Routes
    Route::resource('fakultas', FakultasController::class)->parameters([
        'fakultas' => 'kode_fakultas'
    ]);
    // Prodi Routes
    Route::resource('prodi', ProdiController::class)->parameters([
        'prodi' => 'kode_prodi'
    ]);
    Route::prefix('krs')->name('krs.')->group(function () {
        Route::get('/', [KrsController::class, 'index'])->name('index');
        Route::get('/{krs}', [KrsController::class, 'show'])->name('show');
    });
    // Mata Kuliah Routes
    Route::resource('mata-kuliah', MataKuliahController::class)->parameters([
        'mata-kuliah' => 'kode_matkul'
    ]);

    // Periode Registrasi Routes
    Route::resource('periode-registrasi', PeriodeRegistrasiController::class)
        ->parameters(['periode-registrasi' => 'periodeRegistrasi']);

    Route::post(
        '/periode-registrasi/{periodeRegistrasi}/toggle-status',
        [PeriodeRegistrasiController::class, 'toggleStatus']
    )
        ->name('periode-registrasi.toggle-status');

    // Jadwal Pengisian KRS Routes
    Route::resource('jadwal-krs', JadwalKrsController::class)->parameters([
        'jadwal-krs' => 'jadwalKrs'
    ]);

    // Registrasi Semester Routes
    Route::resource('registrasi-semester', RegistrasiSemesterController::class);
    Route::get('/api/search-mahasiswa', [RegistrasiSemesterController::class, 'searchMahasiswa'])
        ->name('api.search-mahasiswa');

    // Pengaturan KRS Routes
    Route::resource('pengaturan-krs', PengaturanKrsController::class)->parameters([
        'pengaturan-krs' => 'pengaturan_kr'
    ]);
    Route::post('/pengaturan-krs/copy', [PengaturanKrsController::class, 'copy'])
        ->name('pengaturan-krs.copy');

    // Manajemen Nilai Routes
    Route::prefix('nilai')->name('nilai.')->group(function () {
    Route::get('/', [\App\Http\Controllers\Baak\NilaiController::class, 'index'])->name('index');
    Route::get('/{kelas}', [\App\Http\Controllers\Baak\NilaiController::class, 'show'])->name('show');
    Route::post('/{kelas}/toggle-lock', [\App\Http\Controllers\Baak\NilaiController::class, 'toggleLock'])->name('toggle-lock');
    Route::post('/bulk-lock', [\App\Http\Controllers\Baak\NilaiController::class, 'bulkLock'])->name('bulk-lock');
});
});


// Mahasiswa routes
Route::middleware(['auth', 'role:mahasiswa'])->prefix('mahasiswa')->name('mahasiswa.')->group(function () {
    Route::get('/dashboard', [MahasiswaController::class, 'dashboard'])->name('dashboard');
    Route::get('/nilai', [MahasiswaController::class, 'nilai'])->name('nilai');
    Route::get('/penjadwalan', [MahasiswaController::class, 'penjadwalan'])->name('penjadwalan');
    Route::get('/krs', [MahasiswaController::class, 'krs'])->name('krs');
    Route::get('/absensi', [MahasiswaController::class, 'absensi'])->name('absensi');
    Route::get('/profile', [MahasiswaController::class, 'profile'])->name('profile');
    Route::get('/perbarui-data', [MahasiswaController::class, 'perbarui_data'])->name('profile.perbarui-data');
    Route::get('/ganti-password', [MahasiswaController::class, 'ganti_password'])->name('profile.ganti-password');
});

// Dosen routes
Route::middleware(['auth', 'role:dosen'])->prefix('dosen')->name('dosen.')->group(function () {
    Route::get('/dashboard', action: [DosenController::class, 'dashboard'])->name('dashboard');
    Route::get('/nilai', [DosenController::class, 'nilai'])->name('nilai');
    Route::get('/nilai/input-nilai', [DosenController::class, 'input_nilai'])->name('input_nilai');
    Route::get('/nilai/edit-nilai', [DosenController::class, 'edit_nilai'])->name('edit_nilai');
    Route::get('/rps', [DosenController::class, 'rps'])->name('rps');
    Route::get('/rps/tambah-rps', [DosenController::class, 'tambah_rps'])->name('tambah_rps');
    Route::get('/rps/edit-rps', [DosenController::class, 'edit_rps'])->name('edit_rps');
    Route::get('/absensi', [DosenController::class, 'absensi'])->name('absensi');
    Route::get('/jadwal', [DosenController::class, 'jadwal'])->name('jadwal');
});



