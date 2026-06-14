<?php

use Illuminate\Support\Facades\Route;

// BAAK
use App\Http\Controllers\Baak\DashboardController;
use App\Http\Controllers\Baak\CetakKhsController;
use App\Http\Controllers\Baak\CetakKrsController;
use App\Http\Controllers\Baak\JadwalKrsController;
use App\Http\Controllers\Baak\KelasController;
use App\Http\Controllers\Baak\KrsController;
use App\Http\Controllers\Baak\LaporanController;
use App\Http\Controllers\Baak\PengaturanKrsController;
use App\Http\Controllers\Baak\PeriodeRegistrasiController;
use App\Http\Controllers\Baak\RegistrasiSemesterController;
use App\Http\Controllers\Baak\MataKuliahController;
use App\Http\Controllers\Baak\ProdiController;
use App\Http\Controllers\Baak\MahasiswaController as BaakMahasiswaController;
use App\Http\Controllers\Baak\DosenController as BaakDosenController;
use App\Http\Controllers\Baak\NilaiController;
use App\Http\Controllers\Baak\RuanganController;
use App\Http\Controllers\Baak\TranskripController;

// DOSEN
use App\Http\Controllers\Dosen\DosenController;
use App\Http\Controllers\Dosen\JadwalController;
use App\Http\Controllers\Dosen\RpsController;
use App\Http\Controllers\Dosen\AbsensiController;

// MAHASISWA
use App\Http\Controllers\MahasiswaController;
use App\Http\Controllers\Mahasiswa\LayananController as MahasiswaLayananController;


// ======================================================================
// ROOT ROUTE
// ======================================================================
Route::get('/', function () {
    if (!auth()->check()) {
        return redirect()->route('login');
    }

    return match (auth()->user()->role) {
        'mahasiswa' => redirect()->route('mahasiswa.dashboard'),
        'dosen' => redirect()->route('dosen.dashboard'),
        'baak' => redirect()->route('baak.dashboard'),
        default => redirect()->route('login'),
    };
})->name('home');


// ======================================================================
// AUTH ROUTES
// ======================================================================
require __DIR__ . '/auth.php';


// ======================================================================
// BAAK ROUTES
// ======================================================================
Route::middleware(['auth', 'role:baak'])
    ->prefix('baak')
    ->name('baak.')
    ->group(function () {

        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Mahasiswa
        Route::get('mahasiswa/export', [BaakMahasiswaController::class, 'exportExcel'])->name('mahasiswa.export');
        Route::get('mahasiswa/export-template', [BaakMahasiswaController::class, 'exportTemplate'])->name('mahasiswa.export-template');
        Route::post('mahasiswa/import', [BaakMahasiswaController::class, 'importExcel'])->name('mahasiswa.import');
        Route::post('mahasiswa/generate-nim', [BaakMahasiswaController::class, 'generateNim'])
            ->name('mahasiswa.generate-nim');
        Route::resource('mahasiswa', BaakMahasiswaController::class);
        Route::post('mahasiswa/{mahasiswa}/reset-password', [BaakMahasiswaController::class, 'resetPassword'])
            ->name('mahasiswa.reset-password');

        // Dosen
        Route::get('dosen/export', [BaakDosenController::class, 'exportExcel'])->name('dosen.export');
        Route::get('dosen/export-template', [BaakDosenController::class, 'exportTemplate'])->name('dosen.export-template');
        Route::post('dosen/import', [BaakDosenController::class, 'importExcel'])->name('dosen.import');
        Route::resource('dosen', BaakDosenController::class);

        // Kelas
        Route::get('kelas/arsip', [KelasController::class, 'arsip'])->name('kelas.arsip');
        Route::resource('kelas', KelasController::class);
        Route::post('kelas/get-mata-kuliah-by-periode', [KelasController::class, 'getMataKuliahByPeriode'])
            ->name('kelas.get-mata-kuliah-by-periode');

        // Ruangan
        Route::resource('ruangan', RuanganController::class);

        // Prodi
        Route::resource('prodi', ProdiController::class)
            ->parameters(['prodi' => 'kode_prodi']);

        // KRS
        Route::prefix('krs')->name('krs.')->group(function () {
            Route::get('/', [KrsController::class, 'index'])->name('index');
            Route::get('/{krs}', [KrsController::class, 'show'])->name('show');
        });

        Route::prefix('transkrip')->name('transkrip.')->group(function () {
            Route::get('/', [TranskripController::class, 'index'])->name('index');
            Route::get('/{mahasiswa}', [TranskripController::class, 'show'])->name('show');
        });

        Route::prefix('cetak-khs')->name('cetak-khs.')->group(function () {
            Route::get('/', [CetakKhsController::class, 'index'])->name('index');
            Route::get('/{krs}', [CetakKhsController::class, 'show'])->name('show');
        });

        Route::prefix('cetak-krs')->name('cetak-krs.')->group(function () {
            Route::get('/', [CetakKrsController::class, 'index'])->name('index');
            Route::get('/{krs}', [CetakKrsController::class, 'show'])->name('show');
        });

        Route::patch('/layanan/{id}/status', [TranskripController::class, 'updateStatus'])->name('layanan.update-status');

        // Mata Kuliah
        Route::get('mata-kuliah/export', [MataKuliahController::class, 'exportExcel'])->name('mata-kuliah.export');
        Route::get('mata-kuliah/export-template', [MataKuliahController::class, 'exportTemplate'])->name('mata-kuliah.export-template');
        Route::post('mata-kuliah/import', [MataKuliahController::class, 'importExcel'])->name('mata-kuliah.import');
        Route::post('mata-kuliah/{kode_matkul}/toggle-status', [MataKuliahController::class, 'toggleStatus'])
            ->name('mata-kuliah.toggle-status');
        Route::resource('mata-kuliah', MataKuliahController::class)
            ->parameters(['mata-kuliah' => 'kode_matkul']);

        // Periode Registrasi
        Route::resource('periode-registrasi', PeriodeRegistrasiController::class)
            ->parameters(['periode-registrasi' => 'periodeRegistrasi']);
        Route::post('periode-registrasi/{periodeRegistrasi}/toggle-status', [PeriodeRegistrasiController::class, 'toggleStatus'])
            ->name('periode-registrasi.toggle-status');

        // Jadwal Pengisian KRS
        Route::resource('jadwal-krs', JadwalKrsController::class)
            ->parameters(['jadwal-krs' => 'jadwalKrs']);

        // Registrasi Semester
        Route::resource('registrasi-semester', RegistrasiSemesterController::class);
        Route::get('api/search-mahasiswa', [RegistrasiSemesterController::class, 'searchMahasiswa'])
            ->name('api.search-mahasiswa');

        // Pengaturan KRS
        Route::resource('pengaturan-krs', PengaturanKrsController::class)
            ->parameters(['pengaturan-krs' => 'pengaturan_kr']);
        Route::post('pengaturan-krs/copy', [PengaturanKrsController::class, 'copy'])
            ->name('pengaturan-krs.copy');

        // Manajemen Nilai
        Route::prefix('nilai')->name('nilai.')->group(function () {
            Route::get('/', [NilaiController::class, 'index'])->name('index');
            Route::get('/{kelas}', [NilaiController::class, 'show'])->name('show');
            Route::post('/{kelas}/toggle-lock', [NilaiController::class, 'toggleLock'])->name('toggle-lock');
            Route::post('/bulk-lock', [NilaiController::class, 'bulkLock'])->name('bulk-lock');
        });

        // Laporan Akademik
        Route::prefix('laporan')->name('laporan.')->group(function () {
            Route::get('/', [LaporanController::class, 'index'])->name('index');

            Route::get('/mahasiswa', [LaporanController::class, 'laporanMahasiswa'])->name('mahasiswa');
            Route::get('/kelulusan', [LaporanController::class, 'laporanKelulusan'])->name('kelulusan');
            Route::get('/do', [LaporanController::class, 'laporanDO'])->name('do');
            Route::get('/ipk', [LaporanController::class, 'laporanIpk'])->name('ipk');

            // Export excel
            Route::get('export/mahasiswa-excel', [LaporanController::class, 'exportMahasiswaExcel'])->name('export.mahasiswa.excel');
            Route::get('export/kelulusan-excel', [LaporanController::class, 'exportKelulusanExcel'])->name('export.kelulusan.excel');
            Route::get('export/ipk-excel', [LaporanController::class, 'exportIpkExcel'])->name('export.ipk.excel');

            // Export PDF
            Route::get('export/mahasiswa-pdf', [LaporanController::class, 'exportMahasiswaPdf'])->name('export.mahasiswa.pdf');
            Route::get('export/kelulusan-pdf', [LaporanController::class, 'exportKelulusanPdf'])->name('export.kelulusan.pdf');
            Route::get('export/ipk-pdf', [LaporanController::class, 'exportIpkPdf'])->name('export.ipk.pdf');
        });
    });


// ======================================================================
// MAHASISWA ROUTES
// ======================================================================
Route::middleware(['auth', 'role:mahasiswa'])
    ->prefix('mahasiswa')
    ->name('mahasiswa.')
    ->group(function () {

        Route::get('/dashboard', [MahasiswaController::class, 'dashboard'])->name('dashboard');
        Route::get('/registrasi', [MahasiswaController::class, 'registrasi'])->name('registrasi');
        Route::post('/registrasi-ulang', [MahasiswaController::class, 'store_registrasi_ulang'])->name('registrasi-ulang.store');
        Route::get('/nilai', [MahasiswaController::class, 'nilai'])->name('nilai');
        Route::get('/penjadwalan', [MahasiswaController::class, 'penjadwalan'])->name('penjadwalan');
        Route::get('/krs', [MahasiswaController::class, 'krs'])->name('krs');
        Route::get('/krs/isi', [MahasiswaController::class, 'tambah_krs'])->name('krs.create');
        Route::get('/tambah-krs', [MahasiswaController::class, 'tambah_krs'])->name('krs.create.legacy');
        Route::post('/krs/ajukan', [MahasiswaController::class, 'submit_krs'])->name('krs.submit');
        Route::post('/krs/kelas/{kelas}', [MahasiswaController::class, 'store_krs_item'])->name('krs.store-item');
        Route::delete('/krs/detail/{detailKrs}', [MahasiswaController::class, 'destroy_krs_item'])->name('krs.destroy-item');
        Route::get('/absensi', [MahasiswaController::class, 'absensi'])->name('absensi');

        // Layanan
        Route::prefix('layanan')->name('layanan.')->group(function () {
            Route::get('/', [App\Http\Controllers\Mahasiswa\LayananController::class, 'index'])->name('index');
            Route::post('/', [App\Http\Controllers\Mahasiswa\LayananController::class, 'store'])->name('store');
            Route::patch('/{id}/rate', [App\Http\Controllers\Mahasiswa\LayananController::class, 'rate'])->name('rate');
        });

        // Profile
        Route::get('/profile', [MahasiswaController::class, 'profile'])->name('profile');
        Route::get('/perbarui-data', [MahasiswaController::class, 'perbarui_data'])->name('profile.perbarui-data');
        Route::patch('/perbarui-data', [MahasiswaController::class, 'update_profile'])->name('profile.update-data');
        Route::get('/ganti-password', [MahasiswaController::class, 'ganti_password'])->name('profile.ganti-password');
    });


// ======================================================================
// DOSEN ROUTES
// ======================================================================
Route::middleware(['auth', 'role:dosen'])
    ->prefix('dosen')
    ->name('dosen.')
    ->group(function () {

        Route::get('/dashboard', [DosenController::class, 'dashboard'])->name('dashboard');
        Route::get('/mahasiswa-wali', [DosenController::class, 'mahasiswaWali'])->name('mahasiswa-wali.index');
        Route::get('/mahasiswa-wali/{mahasiswa}', [DosenController::class, 'showMahasiswaWali'])->name('mahasiswa-wali.show');
        Route::get('/acc-krs', [DosenController::class, 'accKrs'])->name('acc-krs.index');
        Route::get('/acc-krs/{krs}', [DosenController::class, 'showAccKrs'])->name('acc-krs.show');
        Route::patch('/acc-krs/{krs}', [DosenController::class, 'updateAccKrs'])->name('acc-krs.update');

        // Nilai
    Route::get('/nilai', [App\Http\Controllers\Dosen\NilaiController::class, 'index'])
        ->name('nilai');

    Route::get('/nilai/{kelas}', [App\Http\Controllers\Dosen\NilaiController::class, 'show'])
        ->name('nilai.show');
    
    Route::get('/nilai/input', [App\Http\Controllers\Dosen\NilaiController::class, 'create'])
        ->name('input_nilai');
    
    Route::post('/nilai/store', [App\Http\Controllers\Dosen\NilaiController::class, 'store'])
        ->name('nilai.store');
    
    Route::get('/nilai/edit/{id_nilai}', [App\Http\Controllers\Dosen\NilaiController::class, 'edit'])
        ->name('edit_nilai');
    
    Route::put('/nilai/update/{id_nilai}', [App\Http\Controllers\Dosen\NilaiController::class, 'update'])
        ->name('nilai.update');

    // API untuk mendapatkan kelas berdasarkan mata kuliah
    Route::get('/api/kelas-by-matakuliah', [App\Http\Controllers\Dosen\NilaiController::class, 'getKelasByMataKuliah'])
        ->name('api.kelas_by_matakuliah');

        // Jadwal
        Route::get('/jadwal', [JadwalController::class, 'index'])->name('jadwal');

        // Absensi
        Route::prefix('absensi')->name('absensi.')->group(function () {
            Route::get('/', [AbsensiController::class, 'index'])->name('index'); // List Tahun Ajaran & Mata Kuliah
            Route::get('/mata-kuliah/{idMkPeriode}', [AbsensiController::class, 'showMataKuliah'])->name('mata-kuliah.show'); // List Kelas
            Route::get('/kelas/{idKelas}', [AbsensiController::class, 'showKelas'])->name('kelas.show'); // List Mahasiswa + Stats
            Route::get('/create/{idKelas}', [AbsensiController::class, 'create'])->name('create'); // Form Input Absensi
            Route::post('/', [AbsensiController::class, 'store'])->name('store');
            Route::get('/mahasiswa/{idKelas}/{idMahasiswa}', [AbsensiController::class, 'detailMahasiswa'])->name('mahasiswa.detail'); // Detail per mahasiswa

            // History & Edit
            Route::get('/history', [AbsensiController::class, 'history'])->name('history');
            Route::get('/{idPertemuan}', [AbsensiController::class, 'show'])->name('show');
            Route::get('/{idPertemuan}/edit', [AbsensiController::class, 'edit'])->name('edit');
            Route::put('/{idPertemuan}', [AbsensiController::class, 'update'])->name('update');
            Route::delete('/{idPertemuan}', [AbsensiController::class, 'destroy'])->name('destroy');
        });

        // RPS
        Route::prefix('rps')->name('rps.')->group(function () {
            Route::get('/', [RpsController::class, 'index'])->name('index');
            Route::get('/create', [RpsController::class, 'create'])->name('create');
            Route::post('/', [RpsController::class, 'store'])->name('store');
            Route::get('/{id}/edit', [RpsController::class, 'edit'])->name('edit');
            Route::put('/{id}', [RpsController::class, 'update'])->name('update');
            Route::delete('/{id}', [RpsController::class, 'destroy'])->name('destroy');
        });

        // API
        Route::get('/api/kelas-by-matkul/{idMkPeriode}', [AbsensiController::class, 'getKelasByMataKuliah']);
        Route::get('/api/kelas-data/{idKelas}', [AbsensiController::class, 'getKelasData']);

        // Debug query
        Route::get('/debug-mk', function() {
            $dosen = auth()->user()->dosen;
            $periode = \App\Models\PeriodeRegistrasi::getPeriodeTerakhir();

            $mataKuliahList = \App\Models\MataKuliah::when($periode, function ($query) use ($dosen, $periode) {
                    $query->whereHas('periode', function ($q) use ($dosen, $periode) {
                        $q->where('tahun_ajaran', $periode->tahun_ajaran)
                            ->where('jenis_semester', $periode->jenis_semester)
                            ->whereHas('kelas', function ($q) use ($dosen) {
                                $q->where('id_dosen', $dosen->id_dosen);
                            });
                    });
                }, function ($query) {
                    $query->whereRaw('1 = 0');
                })
                ->distinct()
                ->select('mata_kuliah.kode_matkul', 'mata_kuliah.nama_matkul')
                ->get();
            return response()->json($mataKuliahList);
        });
    });
