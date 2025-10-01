<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Truncate semua tabel
        $tables = [
            'riwayat_akademik',
            'nilai_mahasiswa',
            'bobot_nilai',
            'absensi',
            'pertemuan',
            'detail_krs',
            'krs',
            'jadwal_pengisian_krs',
            'kelas',
            'mata_kuliah',
            'registrasi_semester',
            'periode_registrasi',
            'mahasiswa',
            'dosen',
            'baak',
            'prodi',
            'fakultas',
            'users'
        ];

        foreach ($tables as $table) {
            DB::table($table)->truncate();
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // ========================================
        // 1. FAKULTAS
        // ========================================
        DB::table('fakultas')->insert([
            ['kode_fakultas' => 'FTI', 'nama_fakultas' => 'Fakultas Teknologi Informasi', 'created_at' => now(), 'updated_at' => now()],
            ['kode_fakultas' => 'FEB', 'nama_fakultas' => 'Fakultas Ekonomi dan Bisnis', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // ========================================
        // 2. PRODI
        // ========================================
        DB::table('prodi')->insert([
            ['kode_prodi' => 'IF', 'kode_fakultas' => 'FTI', 'nama_prodi' => 'Teknik Informatika', 'jenjang' => 'S1', 'created_at' => now(), 'updated_at' => now()],
            ['kode_prodi' => 'SI', 'kode_fakultas' => 'FTI', 'nama_prodi' => 'Sistem Informasi', 'jenjang' => 'S1', 'created_at' => now(), 'updated_at' => now()],
            ['kode_prodi' => 'MN', 'kode_fakultas' => 'FEB', 'nama_prodi' => 'Manajemen', 'jenjang' => 'S1', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // ========================================
        // 3. USERS & BAAK
        // ========================================
        $baakUserId = DB::table('users')->insertGetId([
            'role' => 'baak',
            'username' => 'baak001',
            'email' => 'baak@itbriau.ac.id',
            'password' => Hash::make('baak001'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('baak')->insert([
            'user_id' => $baakUserId,
            'nama' => 'Admin BAAK',
            'nip' => 'BAAK001',
            'no_hp' => '081234567890',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // ========================================
        // 4. DOSEN
        // ========================================
        $dosenData = [
            ['nama' => 'Dr. Ahmad Fauzi, M.Kom', 'nip' => '198501012010011001', 'kode_prodi' => 'IF', 'jk' => 'Laki-laki'],
            ['nama' => 'Siti Nurhaliza, S.Kom., M.T', 'nip' => '198702152011012001', 'kode_prodi' => 'IF', 'jk' => 'Perempuan'],
            ['nama' => 'Budi Santoso, M.Kom', 'nip' => '198803202012011002', 'kode_prodi' => 'SI', 'jk' => 'Laki-laki'],
            ['nama' => 'Rina Wati, S.Kom., M.Sc', 'nip' => '198904102013012001', 'kode_prodi' => 'SI', 'jk' => 'Perempuan'],
            ['nama' => 'Dr. Hendra Wijaya, S.E., M.M', 'nip' => '198605152014011001', 'kode_prodi' => 'MN', 'jk' => 'Laki-laki'],
        ];

        $dosenIds = [];
        foreach ($dosenData as $dosen) {
            // Generate email dari 8 digit terakhir NIP untuk menghindari duplikasi
            $emailPrefix = 'dosen' . substr($dosen['nip'], -8);

            $userId = DB::table('users')->insertGetId([
                'role' => 'dosen',
                'username' => $dosen['nip'],
                'email' => $emailPrefix . '@itbriau.ac.id',
                'password' => Hash::make($dosen['nip']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $dosenIds[] = DB::table('dosen')->insertGetId([
                'user_id' => $userId,
                'nama' => $dosen['nama'],
                'nip' => $dosen['nip'],
                'kode_prodi' => $dosen['kode_prodi'],
                'jenis_kelamin' => $dosen['jk'],
                'alamat' => 'Jl. Riau No. ' . rand(1, 100) . ', Pekanbaru',
                'no_hp' => '0812' . rand(10000000, 99999999),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // ========================================
        // 5. MAHASISWA (Semester 5-7)
        // ========================================
        $mahasiswaData = [
            // Semester 7 (Angkatan 2021)
            ['nama' => 'Andi Pratama', 'kode_prodi' => 'IF', 'tahun' => 2021, 'jk' => 'Laki-laki', 'tgl_lahir' => '2003-01-15'],
            ['nama' => 'Dewi Lestari', 'kode_prodi' => 'IF', 'tahun' => 2021, 'jk' => 'Perempuan', 'tgl_lahir' => '2003-03-20'],

            // Semester 6 (Angkatan 2022)
            ['nama' => 'Riko Saputra', 'kode_prodi' => 'SI', 'tahun' => 2022, 'jk' => 'Laki-laki', 'tgl_lahir' => '2004-05-10'],
            ['nama' => 'Lina Marlina', 'kode_prodi' => 'SI', 'tahun' => 2022, 'jk' => 'Perempuan', 'tgl_lahir' => '2004-07-25'],
            ['nama' => 'Fahmi Abdullah', 'kode_prodi' => 'IF', 'tahun' => 2022, 'jk' => 'Laki-laki', 'tgl_lahir' => '2004-02-14'],

            // Semester 5 (Angkatan 2023)
            ['nama' => 'Sari Melati', 'kode_prodi' => 'IF', 'tahun' => 2023, 'jk' => 'Perempuan', 'tgl_lahir' => '2005-04-18'],
            ['nama' => 'Budi Hartono', 'kode_prodi' => 'SI', 'tahun' => 2023, 'jk' => 'Laki-laki', 'tgl_lahir' => '2005-08-22'],
            ['nama' => 'Fitri Handayani', 'kode_prodi' => 'MN', 'tahun' => 2023, 'jk' => 'Perempuan', 'tgl_lahir' => '2005-06-30'],
        ];

        $mahasiswaIds = [];
        foreach ($mahasiswaData as $index => $mhs) {
            $nim = $this->generateNim($mhs['kode_prodi'], $mhs['tahun'], $index + 1);

            $userId = DB::table('users')->insertGetId([
                'role' => 'mahasiswa',
                'username' => $nim,
                'email' => strtolower(str_replace(' ', '', $mhs['nama'])) . '@student.itbriau.ac.id',
                'password' => Hash::make($nim),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $mahasiswaIds[] = [
                'id' => DB::table('mahasiswa')->insertGetId([
                    'user_id' => $userId,
                    'nim' => $nim,
                    'nama' => $mhs['nama'],
                    'kode_prodi' => $mhs['kode_prodi'],
                    'id_dosen_wali' => $dosenIds[array_rand($dosenIds)],
                    'tanggal_lahir' => $mhs['tgl_lahir'],
                    'jenis_kelamin' => $mhs['jk'],
                    'alamat' => 'Jl. Sudirman No. ' . rand(1, 100) . ', Pekanbaru',
                    'no_hp' => '0813' . rand(10000000, 99999999),
                    'status' => 'aktif',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]),
                'nim' => $nim,
                'tahun' => $mhs['tahun'],
                'kode_prodi' => $mhs['kode_prodi']
            ];
        }

        // ========================================
        // 6. MATA KULIAH
        // ========================================
        $mataKuliahData = [
            // Mata Kuliah Umum
            ['kode' => 'MKU101', 'nama' => 'Pendidikan Pancasila', 'sks' => 2, 'sem' => 1, 'prodi' => null, 'kat' => 'umum'],
            ['kode' => 'MKU102', 'nama' => 'Bahasa Indonesia', 'sks' => 2, 'sem' => 1, 'prodi' => null, 'kat' => 'umum'],
            ['kode' => 'MKU201', 'nama' => 'Bahasa Inggris', 'sks' => 2, 'sem' => 2, 'prodi' => null, 'kat' => 'umum'],

            // Teknik Informatika
            ['kode' => 'IF101', 'nama' => 'Algoritma dan Pemrograman', 'sks' => 3, 'sem' => 1, 'prodi' => 'IF', 'kat' => 'wajib'],
            ['kode' => 'IF102', 'nama' => 'Matematika Diskrit', 'sks' => 3, 'sem' => 1, 'prodi' => 'IF', 'kat' => 'wajib'],
            ['kode' => 'IF201', 'nama' => 'Struktur Data', 'sks' => 3, 'sem' => 2, 'prodi' => 'IF', 'kat' => 'wajib'],
            ['kode' => 'IF202', 'nama' => 'Basis Data', 'sks' => 3, 'sem' => 2, 'prodi' => 'IF', 'kat' => 'wajib'],
            ['kode' => 'IF301', 'nama' => 'Pemrograman Web', 'sks' => 3, 'sem' => 3, 'prodi' => 'IF', 'kat' => 'wajib'],
            ['kode' => 'IF302', 'nama' => 'Sistem Operasi', 'sks' => 3, 'sem' => 3, 'prodi' => 'IF', 'kat' => 'wajib'],
            ['kode' => 'IF401', 'nama' => 'Jaringan Komputer', 'sks' => 3, 'sem' => 4, 'prodi' => 'IF', 'kat' => 'wajib'],
            ['kode' => 'IF402', 'nama' => 'Rekayasa Perangkat Lunak', 'sks' => 3, 'sem' => 4, 'prodi' => 'IF', 'kat' => 'wajib'],
            ['kode' => 'IF501', 'nama' => 'Kecerdasan Buatan', 'sks' => 3, 'sem' => 5, 'prodi' => 'IF', 'kat' => 'wajib'],
            ['kode' => 'IF502', 'nama' => 'Machine Learning', 'sks' => 3, 'sem' => 5, 'prodi' => 'IF', 'kat' => 'pilihan'],
            ['kode' => 'IF503', 'nama' => 'Cloud Computing', 'sks' => 3, 'sem' => 5, 'prodi' => 'IF', 'kat' => 'pilihan'],
            ['kode' => 'IF601', 'nama' => 'Keamanan Informasi', 'sks' => 3, 'sem' => 6, 'prodi' => 'IF', 'kat' => 'wajib'],
            ['kode' => 'IF602', 'nama' => 'Data Mining', 'sks' => 3, 'sem' => 6, 'prodi' => 'IF', 'kat' => 'pilihan'],
            ['kode' => 'IF701', 'nama' => 'Metodologi Penelitian', 'sks' => 2, 'sem' => 7, 'prodi' => 'IF', 'kat' => 'wajib'],
            ['kode' => 'IF702', 'nama' => 'Manajemen Proyek TI', 'sks' => 3, 'sem' => 7, 'prodi' => 'IF', 'kat' => 'wajib'],

            // Sistem Informasi
            ['kode' => 'SI101', 'nama' => 'Pengantar Sistem Informasi', 'sks' => 3, 'sem' => 1, 'prodi' => 'SI', 'kat' => 'wajib'],
            ['kode' => 'SI201', 'nama' => 'Analisis dan Perancangan SI', 'sks' => 3, 'sem' => 2, 'prodi' => 'SI', 'kat' => 'wajib'],
            ['kode' => 'SI301', 'nama' => 'Sistem Informasi Manajemen', 'sks' => 3, 'sem' => 3, 'prodi' => 'SI', 'kat' => 'wajib'],
            ['kode' => 'SI401', 'nama' => 'E-Business', 'sks' => 3, 'sem' => 4, 'prodi' => 'SI', 'kat' => 'wajib'],
            ['kode' => 'SI501', 'nama' => 'Audit Sistem Informasi', 'sks' => 3, 'sem' => 5, 'prodi' => 'SI', 'kat' => 'wajib'],
            ['kode' => 'SI502', 'nama' => 'Business Intelligence', 'sks' => 3, 'sem' => 5, 'prodi' => 'SI', 'kat' => 'pilihan'],
            ['kode' => 'SI601', 'nama' => 'Tata Kelola TI', 'sks' => 3, 'sem' => 6, 'prodi' => 'SI', 'kat' => 'wajib'],
            ['kode' => 'SI701', 'nama' => 'Manajemen Strategi SI', 'sks' => 3, 'sem' => 7, 'prodi' => 'SI', 'kat' => 'wajib'],

            // Manajemen
            ['kode' => 'MN101', 'nama' => 'Pengantar Manajemen', 'sks' => 3, 'sem' => 1, 'prodi' => 'MN', 'kat' => 'wajib'],
            ['kode' => 'MN501', 'nama' => 'Manajemen Strategis', 'sks' => 3, 'sem' => 5, 'prodi' => 'MN', 'kat' => 'wajib'],
        ];

        foreach ($mataKuliahData as $mk) {
            DB::table('mata_kuliah')->insert([
                'kode_matkul' => $mk['kode'],
                'nama_matkul' => $mk['nama'],
                'sks' => $mk['sks'],
                'semester' => $mk['sem'],
                'kode_prodi' => $mk['prodi'],
                'kategori' => $mk['kat'],
                'is_active' => 1,
                'deskripsi' => 'Deskripsi mata kuliah ' . $mk['nama'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // ========================================
        // 7. PERIODE REGISTRASI
        // ========================================
        $periodeData = [
            ['ta' => '2021/2022', 'jenis' => 'ganjil', 'mulai' => '2021-08-01', 'selesai' => '2021-08-31', 'status' => 'tutup'],
            ['ta' => '2021/2022', 'jenis' => 'genap', 'mulai' => '2022-02-01', 'selesai' => '2022-02-28', 'status' => 'tutup'],
            ['ta' => '2022/2023', 'jenis' => 'ganjil', 'mulai' => '2022-08-01', 'selesai' => '2022-08-31', 'status' => 'tutup'],
            ['ta' => '2022/2023', 'jenis' => 'genap', 'mulai' => '2023-02-01', 'selesai' => '2023-02-28', 'status' => 'tutup'],
            ['ta' => '2023/2024', 'jenis' => 'ganjil', 'mulai' => '2023-08-01', 'selesai' => '2023-08-31', 'status' => 'tutup'],
            ['ta' => '2023/2024', 'jenis' => 'genap', 'mulai' => '2024-02-01', 'selesai' => '2024-02-28', 'status' => 'tutup'],
            ['ta' => '2024/2025', 'jenis' => 'ganjil', 'mulai' => '2024-08-01', 'selesai' => '2024-08-31', 'status' => 'aktif'],
        ];

        foreach ($periodeData as $periode) {
            DB::table('periode_registrasi')->insert([
                'tahun_ajaran' => $periode['ta'],
                'jenis_semester' => $periode['jenis'],
                'tanggal_mulai' => $periode['mulai'],
                'tanggal_selesai' => $periode['selesai'],
                'status' => $periode['status'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // ========================================
        // 8. REGISTRASI SEMESTER & KRS
        // ========================================
        foreach ($mahasiswaIds as $mhs) {
            $currentSemester = $this->getCurrentSemester($mhs['tahun']);

            // Registrasi semester 1 sampai semester saat ini
            for ($sem = 1; $sem <= $currentSemester; $sem++) {
                $tahunAjaran = $this->getTahunAjaran($mhs['tahun'], $sem);
                $jenisSemester = $sem % 2 == 1 ? 'ganjil' : 'genap';
                $tanggalReg = $this->getTanggalRegistrasi($mhs['tahun'], $sem);

                // Insert Registrasi Semester
                DB::table('registrasi_semester')->insert([
                    'id_mahasiswa' => $mhs['id'],
                    'tahun_ajaran' => $tahunAjaran,
                    'semester' => $sem,
                    'jenis_semester' => $jenisSemester,
                    'status_semester' => 'aktif',
                    'tanggal_registrasi' => $tanggalReg,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Insert KRS untuk semester tersebut
                $this->createKRSForSemester($mhs, $sem, $tahunAjaran, $jenisSemester, $dosenIds);
            }
        }

        // Tambahkan kode ini di dalam method run() DatabaseSeeder, setelah insert periode_registrasi

        // ========================================
// 9. JADWAL PENGISIAN KRS
// ========================================
        $jadwalKrsData = [
            // Semester Ganjil 2021/2022
            ['kode_prodi' => 'IF', 'semester' => 1, 'ta' => '2021/2022', 'mulai' => '2021-08-10', 'selesai' => '2021-08-25'],
            ['kode_prodi' => 'SI', 'semester' => 1, 'ta' => '2021/2022', 'mulai' => '2021-08-10', 'selesai' => '2021-08-25'],
            ['kode_prodi' => 'MN', 'semester' => 1, 'ta' => '2021/2022', 'mulai' => '2021-08-10', 'selesai' => '2021-08-25'],

            // Semester Genap 2021/2022
            ['kode_prodi' => 'IF', 'semester' => 2, 'ta' => '2021/2022', 'mulai' => '2022-02-10', 'selesai' => '2022-02-25'],
            ['kode_prodi' => 'SI', 'semester' => 2, 'ta' => '2021/2022', 'mulai' => '2022-02-10', 'selesai' => '2022-02-25'],
            ['kode_prodi' => 'MN', 'semester' => 2, 'ta' => '2021/2022', 'mulai' => '2022-02-10', 'selesai' => '2022-02-25'],

            // Semester Ganjil 2022/2023
            ['kode_prodi' => 'IF', 'semester' => 3, 'ta' => '2022/2023', 'mulai' => '2022-08-10', 'selesai' => '2022-08-25'],
            ['kode_prodi' => 'SI', 'semester' => 3, 'ta' => '2022/2023', 'mulai' => '2022-08-10', 'selesai' => '2022-08-25'],
            ['kode_prodi' => 'MN', 'semester' => 3, 'ta' => '2022/2023', 'mulai' => '2022-08-10', 'selesai' => '2022-08-25'],

            // Semester Genap 2022/2023
            ['kode_prodi' => 'IF', 'semester' => 4, 'ta' => '2022/2023', 'mulai' => '2023-02-10', 'selesai' => '2023-02-25'],
            ['kode_prodi' => 'SI', 'semester' => 4, 'ta' => '2022/2023', 'mulai' => '2023-02-10', 'selesai' => '2023-02-25'],
            ['kode_prodi' => 'MN', 'semester' => 4, 'ta' => '2022/2023', 'mulai' => '2023-02-10', 'selesai' => '2023-02-25'],

            // Semester Ganjil 2023/2024
            ['kode_prodi' => 'IF', 'semester' => 5, 'ta' => '2023/2024', 'mulai' => '2023-08-10', 'selesai' => '2023-08-25'],
            ['kode_prodi' => 'SI', 'semester' => 5, 'ta' => '2023/2024', 'mulai' => '2023-08-10', 'selesai' => '2023-08-25'],
            ['kode_prodi' => 'MN', 'semester' => 5, 'ta' => '2023/2024', 'mulai' => '2023-08-10', 'selesai' => '2023-08-25'],

            // Semester Genap 2023/2024
            ['kode_prodi' => 'IF', 'semester' => 6, 'ta' => '2023/2024', 'mulai' => '2024-02-10', 'selesai' => '2024-02-25'],
            ['kode_prodi' => 'SI', 'semester' => 6, 'ta' => '2023/2024', 'mulai' => '2024-02-10', 'selesai' => '2024-02-25'],
            ['kode_prodi' => 'MN', 'semester' => 6, 'ta' => '2023/2024', 'mulai' => '2024-02-10', 'selesai' => '2024-02-25'],

            // Semester Ganjil 2024/2025 (Aktif)
            ['kode_prodi' => 'IF', 'semester' => 7, 'ta' => '2024/2025', 'mulai' => '2024-08-10', 'selesai' => '2024-08-25'],
            ['kode_prodi' => 'SI', 'semester' => 7, 'ta' => '2024/2025', 'mulai' => '2024-08-10', 'selesai' => '2024-08-25'],
            ['kode_prodi' => 'MN', 'semester' => 7, 'ta' => '2024/2025', 'mulai' => '2024-08-10', 'selesai' => '2024-08-25'],
        ];

        foreach ($jadwalKrsData as $jadwal) {
            DB::table('jadwal_pengisian_krs')->insert([
                'kode_prodi' => $jadwal['kode_prodi'],
                'semester' => $jadwal['semester'],
                'tahun_ajaran' => $jadwal['ta'],
                'tanggal_mulai' => $jadwal['mulai'],
                'tanggal_selesai' => $jadwal['selesai'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        echo "\n✅ Seeder berhasil dijalankan!\n";
        echo "📊 Summary:\n";
        echo "   - BAAK: 1 user\n";
        echo "   - Dosen: " . count($dosenData) . " users\n";
        echo "   - Mahasiswa: " . count($mahasiswaData) . " users\n";
        echo "   - Mata Kuliah: " . count($mataKuliahData) . " items\n";
        echo "   - Periode Registrasi: " . count($periodeData) . " items\n\n";
        echo "🔑 Login Credentials:\n";
        echo "   BAAK: baak001 / baak001\n";
        echo "   Dosen: NIP / NIP\n";
        echo "   Mahasiswa: NIM / NIM\n\n";
    }

    private function generateNim($kodeProdi, $tahun, $urutan)
    {
        $tahunMasuk = substr($tahun, 2, 2); // 21, 22, 23
        $kodeFakultas = $kodeProdi == 'MN' ? 'FEB' : 'FTI';
        $kodeFakultasShort = $kodeFakultas == 'FTI' ? '01' : '02';
        $urut = str_pad($urutan, 3, '0', STR_PAD_LEFT);

        return $tahunMasuk . $kodeProdi . $kodeFakultasShort . $urut;
    }

    private function getCurrentSemester($tahunMasuk)
    {
        $yearDiff = 2024 - $tahunMasuk;
        $currentMonth = 10; // Oktober 2025

        if ($currentMonth >= 8) {
            return ($yearDiff * 2) + 1; // Semester ganjil
        } else {
            return ($yearDiff * 2); // Semester genap
        }
    }

    private function getTahunAjaran($tahunMasuk, $semester)
    {
        $yearStart = $tahunMasuk + floor(($semester - 1) / 2);
        $yearEnd = $yearStart + 1;
        return $yearStart . '/' . $yearEnd;
    }

    private function getTanggalRegistrasi($tahunMasuk, $semester)
    {
        $yearStart = $tahunMasuk + floor(($semester - 1) / 2);
        $month = $semester % 2 == 1 ? '08' : '02';
        return $yearStart . '-' . $month . '-15';
    }

    private function createKRSForSemester($mhs, $semester, $tahunAjaran, $jenisSemester, $dosenIds)
    {
        // Ambil mata kuliah sesuai semester dan prodi
        $mataKuliah = DB::table('mata_kuliah')
            ->where('semester', $semester)
            ->where(function ($q) use ($mhs) {
                $q->where('kode_prodi', $mhs['kode_prodi'])
                    ->orWhereNull('kode_prodi');
            })
            ->where('is_active', 1)
            ->get();

        if ($mataKuliah->isEmpty()) {
            return;
        }

        // Target SKS: 20-24
        $targetSks = rand(20, 24);
        $currentSks = 0;
        $selectedMataKuliah = [];

        // Ambil mata kuliah wajib dulu
        foreach ($mataKuliah as $mk) {
            if ($mk->kategori == 'wajib' && $currentSks + $mk->sks <= $targetSks) {
                $selectedMataKuliah[] = $mk;
                $currentSks += $mk->sks;
            }
        }

        // Tambahkan mata kuliah pilihan jika masih kurang
        foreach ($mataKuliah as $mk) {
            if ($mk->kategori != 'wajib' && $currentSks + $mk->sks <= $targetSks) {
                $selectedMataKuliah[] = $mk;
                $currentSks += $mk->sks;

                if ($currentSks >= 20) {
                    break;
                }
            }
        }

        if (empty($selectedMataKuliah)) {
            return;
        }

        // Insert KRS
        $krsId = DB::table('krs')->insertGetId([
            'id_mahasiswa' => $mhs['id'],
            'semester' => $semester,
            'tahun_ajaran' => $tahunAjaran,
            'tanggal_pengisian' => $this->getTanggalRegistrasi($mhs['tahun'], $semester),
            'status' => 'approved',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Insert Kelas dan Detail KRS
        foreach ($selectedMataKuliah as $mk) {
            // Cek apakah kelas sudah ada
            $kelas = DB::table('kelas')
                ->where('kode_matkul', $mk->kode_matkul)
                ->first();

            if (!$kelas) {
                // Buat kelas baru
                $kelasId = DB::table('kelas')->insertGetId([
                    'nama_kelas' => 'A',
                    'kode_matkul' => $mk->kode_matkul,
                    'id_dosen' => $dosenIds[array_rand($dosenIds)],
                    'ruang_kelas' => 'R' . rand(101, 510),
                    'hari' => ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'][array_rand(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'])],
                    'jam_mulai' => ['08:00:00', '10:00:00', '13:00:00', '15:00:00'][rand(0, 3)],
                    'jam_selesai' => ['09:40:00', '11:40:00', '14:40:00', '16:40:00'][rand(0, 3)],
                    'kapasitas' => 40,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Insert Bobot Nilai
                DB::table('bobot_nilai')->insert([
                    'id_kelas' => $kelasId,
                    'bobot_tugas' => 30,
                    'bobot_uts' => 30,
                    'bobot_uas' => 40,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                $kelasId = $kelas->id_kelas;
            }

            // Insert Detail KRS
            DB::table('detail_krs')->insert([
                'id_krs' => $krsId,
                'id_kelas' => $kelasId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Insert Nilai (untuk semester yang sudah lewat)
            if ($semester < $this->getCurrentSemester($mhs['tahun'])) {
                $nilaiTugas = rand(70, 95);
                $nilaiUts = rand(70, 95);
                $nilaiUas = rand(70, 95);
                $nilaiAkhir = ($nilaiTugas * 0.3) + ($nilaiUts * 0.3) + ($nilaiUas * 0.4);

                DB::table('nilai_mahasiswa')->insert([
                    'id_mahasiswa' => $mhs['id'],
                    'id_kelas' => $kelasId,
                    'nilai_tugas' => $nilaiTugas,
                    'nilai_uts' => $nilaiUts,
                    'nilai_uas' => $nilaiUas,
                    'nilai_akhir' => $nilaiAkhir,
                    'nilai_huruf' => $this->getNilaiHuruf($nilaiAkhir),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Hitung dan insert riwayat akademik untuk semester yang sudah selesai
        if ($semester < $this->getCurrentSemester($mhs['tahun'])) {
            $this->insertRiwayatAkademik($mhs['id'], $semester, $tahunAjaran, $currentSks);
        }
    }

    private function insertRiwayatAkademik($mahasiswaId, $semester, $tahunAjaran, $sksSemester)
    {
        // Ambil semua nilai mahasiswa sampai semester ini
        $nilaiList = DB::table('nilai_mahasiswa')
            ->join('kelas', 'nilai_mahasiswa.id_kelas', '=', 'kelas.id_kelas')
            ->join('mata_kuliah', 'kelas.kode_matkul', '=', 'mata_kuliah.kode_matkul')
            ->join('detail_krs', 'kelas.id_kelas', '=', 'detail_krs.id_kelas')
            ->join('krs', 'detail_krs.id_krs', '=', 'krs.id_krs')
            ->where('nilai_mahasiswa.id_mahasiswa', $mahasiswaId)
            ->where('krs.semester', $semester)
            ->select('nilai_mahasiswa.nilai_akhir', 'mata_kuliah.sks')
            ->get();

        if ($nilaiList->isEmpty()) {
            return;
        }

        // Hitung IPS
        $totalNilai = 0;
        $totalSks = 0;
        foreach ($nilaiList as $nilai) {
            $bobot = $this->getBobotNilai($nilai->nilai_akhir);
            $totalNilai += $bobot * $nilai->sks;
            $totalSks += $nilai->sks;
        }
        $ips = $totalSks > 0 ? $totalNilai / $totalSks : 0;

        // Hitung IPK (semua semester sampai sekarang)
        $allNilai = DB::table('nilai_mahasiswa')
            ->join('kelas', 'nilai_mahasiswa.id_kelas', '=', 'kelas.id_kelas')
            ->join('mata_kuliah', 'kelas.kode_matkul', '=', 'mata_kuliah.kode_matkul')
            ->join('detail_krs', 'kelas.id_kelas', '=', 'detail_krs.id_kelas')
            ->join('krs', 'detail_krs.id_krs', '=', 'krs.id_krs')
            ->where('nilai_mahasiswa.id_mahasiswa', $mahasiswaId)
            ->where('krs.semester', '<=', $semester)
            ->select('nilai_mahasiswa.nilai_akhir', 'mata_kuliah.sks')
            ->get();

        $totalNilaiKumulatif = 0;
        $totalSksKumulatif = 0;
        foreach ($allNilai as $nilai) {
            $bobot = $this->getBobotNilai($nilai->nilai_akhir);
            $totalNilaiKumulatif += $bobot * $nilai->sks;
            $totalSksKumulatif += $nilai->sks;
        }
        $ipk = $totalSksKumulatif > 0 ? $totalNilaiKumulatif / $totalSksKumulatif : 0;

        // Insert riwayat akademik
        DB::table('riwayat_akademik')->insert([
            'id_mahasiswa' => $mahasiswaId,
            'semester' => $semester,
            'tahun_ajaran' => $tahunAjaran,
            'ips_semester' => round($ips, 2),
            'sks_semester' => $totalSks,
            'sks_kumulatif' => $totalSksKumulatif,
            'ipk' => round($ipk, 2),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    private function getBobotNilai($nilaiAkhir)
    {
        if ($nilaiAkhir >= 85)
            return 4.00;
        if ($nilaiAkhir >= 80)
            return 3.70;
        if ($nilaiAkhir >= 75)
            return 3.30;
        if ($nilaiAkhir >= 70)
            return 3.00;
        if ($nilaiAkhir >= 65)
            return 2.70;
        if ($nilaiAkhir >= 60)
            return 2.30;
        if ($nilaiAkhir >= 55)
            return 2.00;
        if ($nilaiAkhir >= 50)
            return 1.70;
        return 0.00;
    }

    private function getNilaiHuruf($nilaiAkhir)
    {
        if ($nilaiAkhir >= 85)
            return 'A';
        if ($nilaiAkhir >= 80)
            return 'A-';
        if ($nilaiAkhir >= 75)
            return 'B+';
        if ($nilaiAkhir >= 70)
            return 'B';
        if ($nilaiAkhir >= 65)
            return 'B-';
        if ($nilaiAkhir >= 60)
            return 'C+';
        if ($nilaiAkhir >= 55)
            return 'C';
        if ($nilaiAkhir >= 50)
            return 'D';
        return 'E';
    }
}
