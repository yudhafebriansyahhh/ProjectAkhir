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
            'mata_kuliah_periode',
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
            ['kode_fakultas' => '301', 'nama_fakultas' => 'Fakultas Teknologi Informasi', 'created_at' => now(), 'updated_at' => now()],
            ['kode_fakultas' => '302', 'nama_fakultas' => 'Fakultas Ekonomi dan Bisnis', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // ========================================
        // 2. PRODI
        // ========================================
        DB::table('prodi')->insert([
            ['kode_prodi' => '55', 'kode_fakultas' => '301', 'nama_prodi' => 'Teknik Informatika', 'jenjang' => 'S1', 'created_at' => now(), 'updated_at' => now()],
            ['kode_prodi' => '56', 'kode_fakultas' => '301', 'nama_prodi' => 'Sistem Informasi', 'jenjang' => 'S1', 'created_at' => now(), 'updated_at' => now()],
            ['kode_prodi' => '31', 'kode_fakultas' => '302', 'nama_prodi' => 'Manajemen', 'jenjang' => 'S1', 'created_at' => now(), 'updated_at' => now()],
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
            ['nama' => 'Dr. Ahmad Fauzi, M.Kom', 'nip' => '198501012010011001', 'kode_prodi' => '55', 'jk' => 'Laki-laki'],
            ['nama' => 'Siti Nurhaliza, S.Kom., M.T', 'nip' => '198702152011012001', 'kode_prodi' => '55', 'jk' => 'Perempuan'],
            ['nama' => 'Budi Santoso, M.Kom', 'nip' => '198803202012011002', 'kode_prodi' => '56', 'jk' => 'Laki-laki'],
            ['nama' => 'Rina Wati, S.Kom., M.Sc', 'nip' => '198904102013012001', 'kode_prodi' => '56', 'jk' => 'Perempuan'],
            ['nama' => 'Dr. Hendra Wijaya, S.E., M.M', 'nip' => '198605152014011001', 'kode_prodi' => '31', 'jk' => 'Laki-laki'],
        ];

        $dosenIds = [];
        foreach ($dosenData as $dosen) {
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
        // 5. MAHASISWA (Semester 3-7)
        // ========================================
        $mahasiswaData = [
            // Semester 7 (Angkatan 2021)
            ['nama' => 'Andi Pratama', 'kode_prodi' => '55', 'tahun' => 2021, 'jk' => 'Laki-laki', 'tgl_lahir' => '2003-01-15'],
            ['nama' => 'Dewi Lestari', 'kode_prodi' => '55', 'tahun' => 2021, 'jk' => 'Perempuan', 'tgl_lahir' => '2003-03-20'],
            ['nama' => 'Rudi Hartono', 'kode_prodi' => '56', 'tahun' => 2021, 'jk' => 'Laki-laki', 'tgl_lahir' => '2003-05-12'],

            // Semester 6 (Angkatan 2022)
            ['nama' => 'Riko Saputra', 'kode_prodi' => '56', 'tahun' => 2022, 'jk' => 'Laki-laki', 'tgl_lahir' => '2004-05-10'],
            ['nama' => 'Lina Marlina', 'kode_prodi' => '56', 'tahun' => 2022, 'jk' => 'Perempuan', 'tgl_lahir' => '2004-07-25'],
            ['nama' => 'Fahmi Abdullah', 'kode_prodi' => '55', 'tahun' => 2022, 'jk' => 'Laki-laki', 'tgl_lahir' => '2004-02-14'],

            // Semester 5 (Angkatan 2023)
            ['nama' => 'Sari Melati', 'kode_prodi' => '55', 'tahun' => 2023, 'jk' => 'Perempuan', 'tgl_lahir' => '2005-04-18'],
            ['nama' => 'Budi Hermawan', 'kode_prodi' => '56', 'tahun' => 2023, 'jk' => 'Laki-laki', 'tgl_lahir' => '2005-08-22'],
            ['nama' => 'Fitri Handayani', 'kode_prodi' => '31', 'tahun' => 2023, 'jk' => 'Perempuan', 'tgl_lahir' => '2005-06-30'],
            ['nama' => 'Yoga Pratama', 'kode_prodi' => '55', 'tahun' => 2023, 'jk' => 'Laki-laki', 'tgl_lahir' => '2005-09-18'],

            // Semester 4 (Angkatan 2024)
            ['nama' => 'Indah Permata', 'kode_prodi' => '55', 'tahun' => 2024, 'jk' => 'Perempuan', 'tgl_lahir' => '2006-03-22'],
            ['nama' => 'Arif Budiman', 'kode_prodi' => '56', 'tahun' => 2024, 'jk' => 'Laki-laki', 'tgl_lahir' => '2006-07-15'],
            ['nama' => 'Maya Sari', 'kode_prodi' => '31', 'tahun' => 2024, 'jk' => 'Perempuan', 'tgl_lahir' => '2006-05-08'],

            // Semester 3 (Angkatan 2024)
            ['nama' => 'Dian Sastro', 'kode_prodi' => '55', 'tahun' => 2024, 'jk' => 'Perempuan', 'tgl_lahir' => '2006-02-20'],
            ['nama' => 'Hadi Wijaya', 'kode_prodi' => '56', 'tahun' => 2024, 'jk' => 'Laki-laki', 'tgl_lahir' => '2006-11-11'],
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
        // 6. MATA KULIAH (Tanpa kolom semester)
        // ========================================
        $mataKuliahData = [
            // Mata Kuliah Umum
            ['kode' => 'MKU101', 'nama' => 'Pendidikan Pancasila', 'sks' => 2, 'prodi' => null, 'kat' => 'umum'],
            ['kode' => 'MKU102', 'nama' => 'Bahasa Indonesia', 'sks' => 2, 'prodi' => null, 'kat' => 'umum'],
            ['kode' => 'MKU201', 'nama' => 'Bahasa Inggris', 'sks' => 2, 'prodi' => null, 'kat' => 'umum'],
            ['kode' => 'MKU301', 'nama' => 'Kewarganegaraan', 'sks' => 2, 'prodi' => null, 'kat' => 'umum'],

            // Teknik Informatika
            ['kode' => 'IF101', 'nama' => 'Algoritma dan Pemrograman', 'sks' => 3, 'prodi' => '55', 'kat' => 'wajib'],
            ['kode' => 'IF102', 'nama' => 'Matematika Diskrit', 'sks' => 3, 'prodi' => '55', 'kat' => 'wajib'],
            ['kode' => 'IF103', 'nama' => 'Logika Informatika', 'sks' => 3, 'prodi' => '55', 'kat' => 'wajib'],
            ['kode' => 'IF201', 'nama' => 'Struktur Data', 'sks' => 3, 'prodi' => '55', 'kat' => 'wajib'],
            ['kode' => 'IF202', 'nama' => 'Basis Data', 'sks' => 3, 'prodi' => '55', 'kat' => 'wajib'],
            ['kode' => 'IF203', 'nama' => 'Pemrograman Berorientasi Objek', 'sks' => 3, 'prodi' => '55', 'kat' => 'wajib'],
            ['kode' => 'IF301', 'nama' => 'Pemrograman Web', 'sks' => 3, 'prodi' => '55', 'kat' => 'wajib'],
            ['kode' => 'IF302', 'nama' => 'Sistem Operasi', 'sks' => 3, 'prodi' => '55', 'kat' => 'wajib'],
            ['kode' => 'IF303', 'nama' => 'Analisis dan Desain Algoritma', 'sks' => 3, 'prodi' => '55', 'kat' => 'wajib'],
            ['kode' => 'IF401', 'nama' => 'Jaringan Komputer', 'sks' => 3, 'prodi' => '55', 'kat' => 'wajib'],
            ['kode' => 'IF402', 'nama' => 'Rekayasa Perangkat Lunak', 'sks' => 3, 'prodi' => '55', 'kat' => 'wajib'],
            ['kode' => 'IF403', 'nama' => 'Basis Data Lanjut', 'sks' => 3, 'prodi' => '55', 'kat' => 'wajib'],
            ['kode' => 'IF501', 'nama' => 'Kecerdasan Buatan', 'sks' => 3, 'prodi' => '55', 'kat' => 'wajib'],
            ['kode' => 'IF502', 'nama' => 'Machine Learning', 'sks' => 3, 'prodi' => '55', 'kat' => 'pilihan'],
            ['kode' => 'IF503', 'nama' => 'Cloud Computing', 'sks' => 3, 'prodi' => '55', 'kat' => 'pilihan'],
            ['kode' => 'IF504', 'nama' => 'Pemrograman Mobile', 'sks' => 3, 'prodi' => '55', 'kat' => 'pilihan'],
            ['kode' => 'IF601', 'nama' => 'Keamanan Informasi', 'sks' => 3, 'prodi' => '55', 'kat' => 'wajib'],
            ['kode' => 'IF602', 'nama' => 'Data Mining', 'sks' => 3, 'prodi' => '55', 'kat' => 'pilihan'],
            ['kode' => 'IF603', 'nama' => 'Komputasi Paralel', 'sks' => 3, 'prodi' => '55', 'kat' => 'pilihan'],
            ['kode' => 'IF701', 'nama' => 'Metodologi Penelitian', 'sks' => 2, 'prodi' => '55', 'kat' => 'wajib'],
            ['kode' => 'IF702', 'nama' => 'Manajemen Proyek TI', 'sks' => 3, 'prodi' => '55', 'kat' => 'wajib'],
            ['kode' => 'IF703', 'nama' => 'Etika Profesi', 'sks' => 2, 'prodi' => '55', 'kat' => 'wajib'],

            // Sistem Informasi
            ['kode' => 'SI101', 'nama' => 'Pengantar Sistem Informasi', 'sks' => 3, 'prodi' => '56', 'kat' => 'wajib'],
            ['kode' => 'SI102', 'nama' => 'Pengantar Teknologi Informasi', 'sks' => 3, 'prodi' => '56', 'kat' => 'wajib'],
            ['kode' => 'SI201', 'nama' => 'Analisis dan Perancangan SI', 'sks' => 3, 'prodi' => '56', 'kat' => 'wajib'],
            ['kode' => 'SI202', 'nama' => 'Manajemen Basis Data', 'sks' => 3, 'prodi' => '56', 'kat' => 'wajib'],
            ['kode' => 'SI301', 'nama' => 'Sistem Informasi Manajemen', 'sks' => 3, 'prodi' => '56', 'kat' => 'wajib'],
            ['kode' => 'SI302', 'nama' => 'Pemrograman Web SI', 'sks' => 3, 'prodi' => '56', 'kat' => 'wajib'],
            ['kode' => 'SI401', 'nama' => 'E-Business', 'sks' => 3, 'prodi' => '56', 'kat' => 'wajib'],
            ['kode' => 'SI402', 'nama' => 'Sistem Enterprise', 'sks' => 3, 'prodi' => '56', 'kat' => 'wajib'],
            ['kode' => 'SI501', 'nama' => 'Audit Sistem Informasi', 'sks' => 3, 'prodi' => '56', 'kat' => 'wajib'],
            ['kode' => 'SI502', 'nama' => 'Business Intelligence', 'sks' => 3, 'prodi' => '56', 'kat' => 'pilihan'],
            ['kode' => 'SI503', 'nama' => 'Manajemen Proyek SI', 'sks' => 3, 'prodi' => '56', 'kat' => 'pilihan'],
            ['kode' => 'SI601', 'nama' => 'Tata Kelola TI', 'sks' => 3, 'prodi' => '56', 'kat' => 'wajib'],
            ['kode' => 'SI602', 'nama' => 'Sistem Informasi Geografis', 'sks' => 3, 'prodi' => '56', 'kat' => 'pilihan'],
            ['kode' => 'SI701', 'nama' => 'Manajemen Strategi SI', 'sks' => 3, 'prodi' => '56', 'kat' => 'wajib'],
            ['kode' => 'SI702', 'nama' => 'Kewirausahaan TI', 'sks' => 2, 'prodi' => '56', 'kat' => 'wajib'],

            // Manajemen
            ['kode' => 'MN101', 'nama' => 'Pengantar Manajemen', 'sks' => 3, 'prodi' => '31', 'kat' => 'wajib'],
            ['kode' => 'MN102', 'nama' => 'Pengantar Ekonomi', 'sks' => 3, 'prodi' => '31', 'kat' => 'wajib'],
            ['kode' => 'MN201', 'nama' => 'Manajemen Keuangan', 'sks' => 3, 'prodi' => '31', 'kat' => 'wajib'],
            ['kode' => 'MN301', 'nama' => 'Manajemen Pemasaran', 'sks' => 3, 'prodi' => '31', 'kat' => 'wajib'],
            ['kode' => 'MN401', 'nama' => 'Manajemen Operasional', 'sks' => 3, 'prodi' => '31', 'kat' => 'wajib'],
            ['kode' => 'MN501', 'nama' => 'Manajemen Strategis', 'sks' => 3, 'prodi' => '31', 'kat' => 'wajib'],
            ['kode' => 'MN601', 'nama' => 'Manajemen SDM', 'sks' => 3, 'prodi' => '31', 'kat' => 'wajib'],
            ['kode' => 'MN701', 'nama' => 'Etika Bisnis', 'sks' => 2, 'prodi' => '31', 'kat' => 'wajib'],
        ];

        foreach ($mataKuliahData as $mk) {
            DB::table('mata_kuliah')->insert([
                'kode_matkul' => $mk['kode'],
                'nama_matkul' => $mk['nama'],
                'sks' => $mk['sks'],
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
        // 8. MATA KULIAH PERIODE
        // ========================================
        $this->createMataKuliahPeriode();

        // ========================================
        // 9. JADWAL PENGISIAN KRS (dengan semester_list JSON)
        // ========================================
        $jadwalKrsData = [
            ['kode_prodi' => '55', 'semesters' => [1], 'ta' => '2021/2022', 'mulai' => '2021-08-10', 'selesai' => '2021-08-25'],
            ['kode_prodi' => '56', 'semesters' => [1], 'ta' => '2021/2022', 'mulai' => '2021-08-10', 'selesai' => '2021-08-25'],
            ['kode_prodi' => '31', 'semesters' => [1], 'ta' => '2021/2022', 'mulai' => '2021-08-10', 'selesai' => '2021-08-25'],

            ['kode_prodi' => '55', 'semesters' => [2], 'ta' => '2021/2022', 'mulai' => '2022-02-10', 'selesai' => '2022-02-25'],
            ['kode_prodi' => '56', 'semesters' => [2], 'ta' => '2021/2022', 'mulai' => '2022-02-10', 'selesai' => '2022-02-25'],
            ['kode_prodi' => '31', 'semesters' => [2], 'ta' => '2021/2022', 'mulai' => '2022-02-10', 'selesai' => '2022-02-25'],

            ['kode_prodi' => '55', 'semesters' => [3], 'ta' => '2022/2023', 'mulai' => '2022-08-10', 'selesai' => '2022-08-25'],
            ['kode_prodi' => '56', 'semesters' => [3], 'ta' => '2022/2023', 'mulai' => '2022-08-10', 'selesai' => '2022-08-25'],
            ['kode_prodi' => '31', 'semesters' => [3], 'ta' => '2022/2023', 'mulai' => '2022-08-10', 'selesai' => '2022-08-25'],

            ['kode_prodi' => '55', 'semesters' => [4], 'ta' => '2022/2023', 'mulai' => '2023-02-10', 'selesai' => '2023-02-25'],
            ['kode_prodi' => '56', 'semesters' => [4], 'ta' => '2022/2023', 'mulai' => '2023-02-10', 'selesai' => '2023-02-25'],
            ['kode_prodi' => '31', 'semesters' => [4], 'ta' => '2022/2023', 'mulai' => '2023-02-10', 'selesai' => '2023-02-25'],

            ['kode_prodi' => '55', 'semesters' => [5], 'ta' => '2023/2024', 'mulai' => '2023-08-10', 'selesai' => '2023-08-25'],
            ['kode_prodi' => '56', 'semesters' => [5], 'ta' => '2023/2024', 'mulai' => '2023-08-10', 'selesai' => '2023-08-25'],
            ['kode_prodi' => '31', 'semesters' => [5], 'ta' => '2023/2024', 'mulai' => '2023-08-10', 'selesai' => '2023-08-25'],

            ['kode_prodi' => '55', 'semesters' => [6], 'ta' => '2023/2024', 'mulai' => '2024-02-10', 'selesai' => '2024-02-25'],
            ['kode_prodi' => '56', 'semesters' => [6], 'ta' => '2023/2024', 'mulai' => '2024-02-10', 'selesai' => '2024-02-25'],
            ['kode_prodi' => '31', 'semesters' => [6], 'ta' => '2023/2024', 'mulai' => '2024-02-10', 'selesai' => '2024-02-25'],

            ['kode_prodi' => '55', 'semesters' => [7], 'ta' => '2024/2025', 'mulai' => '2024-08-10', 'selesai' => '2024-08-25'],
            ['kode_prodi' => '56', 'semesters' => [7], 'ta' => '2024/2025', 'mulai' => '2024-08-10', 'selesai' => '2024-08-25'],
            ['kode_prodi' => '31', 'semesters' => [7], 'ta' => '2024/2025', 'mulai' => '2024-08-10', 'selesai' => '2024-08-25'],
        ];

        foreach ($jadwalKrsData as $jadwal) {
            DB::table('jadwal_pengisian_krs')->insert([
                'kode_prodi' => $jadwal['kode_prodi'],
                'semester_list' => json_encode($jadwal['semesters']),
                'tahun_ajaran' => $jadwal['ta'],
                'tanggal_mulai' => $jadwal['mulai'],
                'tanggal_selesai' => $jadwal['selesai'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // ========================================
        // 10. REGISTRASI SEMESTER & KRS
        // ========================================
        foreach ($mahasiswaIds as $mhs) {
            $currentSemester = $this->getCurrentSemester($mhs['tahun']);

            for ($sem = 1; $sem <= $currentSemester; $sem++) {
                $tahunAjaran = $this->getTahunAjaran($mhs['tahun'], $sem);
                $jenisSemester = $sem % 2 == 1 ? 'ganjil' : 'genap';
                $tanggalReg = $this->getTanggalRegistrasi($mhs['tahun'], $sem);

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

                $this->createKRSForSemester($mhs, $sem, $tahunAjaran, $jenisSemester, $dosenIds);
            }
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

    private function createMataKuliahPeriode()
    {
        $mkPeriodeMapping = [
            // Semester 1
            ['kode' => 'MKU101', 'prodi' => ['55', '56', '31'], 'sem' => 1, 'ta' => ['2021/2022', '2022/2023', '2023/2024', '2024/2025']],
            ['kode' => 'MKU102', 'prodi' => ['55', '56', '31'], 'sem' => 1, 'ta' => ['2021/2022', '2022/2023', '2023/2024', '2024/2025']],
            ['kode' => 'IF101', 'prodi' => ['55'], 'sem' => 1, 'ta' => ['2021/2022', '2022/2023', '2023/2024', '2024/2025']],
            ['kode' => 'IF102', 'prodi' => ['55'], 'sem' => 1, 'ta' => ['2021/2022', '2022/2023', '2023/2024', '2024/2025']],
            ['kode' => 'IF103', 'prodi' => ['55'], 'sem' => 1, 'ta' => ['2021/2022', '2022/2023', '2023/2024', '2024/2025']],
            ['kode' => 'SI101', 'prodi' => ['56'], 'sem' => 1, 'ta' => ['2021/2022', '2022/2023', '2023/2024', '2024/2025']],
            ['kode' => 'SI102', 'prodi' => ['56'], 'sem' => 1, 'ta' => ['2021/2022', '2022/2023', '2023/2024', '2024/2025']],
            ['kode' => 'MN101', 'prodi' => ['31'], 'sem' => 1, 'ta' => ['2021/2022', '2022/2023', '2023/2024', '2024/2025']],
            ['kode' => 'MN102', 'prodi' => ['31'], 'sem' => 1, 'ta' => ['2021/2022', '2022/2023', '2023/2024', '2024/2025']],

            // Semester 2
            ['kode' => 'MKU201', 'prodi' => ['55', '56', '31'], 'sem' => 2, 'ta' => ['2021/2022', '2022/2023', '2023/2024', '2024/2025']],
            ['kode' => 'IF201', 'prodi' => ['55'], 'sem' => 2, 'ta' => ['2021/2022', '2022/2023', '2023/2024', '2024/2025']],
            ['kode' => 'IF202', 'prodi' => ['55'], 'sem' => 2, 'ta' => ['2021/2022', '2022/2023', '2023/2024', '2024/2025']],
            ['kode' => 'IF203', 'prodi' => ['55'], 'sem' => 2, 'ta' => ['2021/2022', '2022/2023', '2023/2024', '2024/2025']],
            ['kode' => 'SI201', 'prodi' => ['56'], 'sem' => 2, 'ta' => ['2021/2022', '2022/2023', '2023/2024', '2024/2025']],
            ['kode' => 'SI202', 'prodi' => ['56'], 'sem' => 2, 'ta' => ['2021/2022', '2022/2023', '2023/2024', '2024/2025']],
            ['kode' => 'MN201', 'prodi' => ['31'], 'sem' => 2, 'ta' => ['2021/2022', '2022/2023', '2023/2024', '2024/2025']],

            // Semester 3
            ['kode' => 'MKU301', 'prodi' => ['55', '56', '31'], 'sem' => 3, 'ta' => ['2022/2023', '2023/2024', '2024/2025']],
            ['kode' => 'IF301', 'prodi' => ['55'], 'sem' => 3, 'ta' => ['2022/2023', '2023/2024', '2024/2025']],
            ['kode' => 'IF302', 'prodi' => ['55'], 'sem' => 3, 'ta' => ['2022/2023', '2023/2024', '2024/2025']],
            ['kode' => 'IF303', 'prodi' => ['55'], 'sem' => 3, 'ta' => ['2022/2023', '2023/2024', '2024/2025']],
            ['kode' => 'SI301', 'prodi' => ['56'], 'sem' => 3, 'ta' => ['2022/2023', '2023/2024', '2024/2025']],
            ['kode' => 'SI302', 'prodi' => ['56'], 'sem' => 3, 'ta' => ['2022/2023', '2023/2024', '2024/2025']],
            ['kode' => 'MN301', 'prodi' => ['31'], 'sem' => 3, 'ta' => ['2022/2023', '2023/2024', '2024/2025']],

            // Semester 4
            ['kode' => 'IF401', 'prodi' => ['55'], 'sem' => 4, 'ta' => ['2022/2023', '2023/2024', '2024/2025']],
            ['kode' => 'IF402', 'prodi' => ['55'], 'sem' => 4, 'ta' => ['2022/2023', '2023/2024', '2024/2025']],
            ['kode' => 'IF403', 'prodi' => ['55'], 'sem' => 4, 'ta' => ['2022/2023', '2023/2024', '2024/2025']],
            ['kode' => 'SI401', 'prodi' => ['56'], 'sem' => 4, 'ta' => ['2022/2023', '2023/2024', '2024/2025']],
            ['kode' => 'SI402', 'prodi' => ['56'], 'sem' => 4, 'ta' => ['2022/2023', '2023/2024', '2024/2025']],
            ['kode' => 'MN401', 'prodi' => ['31'], 'sem' => 4, 'ta' => ['2022/2023', '2023/2024', '2024/2025']],

            // Semester 5
            ['kode' => 'IF501', 'prodi' => ['55'], 'sem' => 5, 'ta' => ['2023/2024', '2024/2025']],
            ['kode' => 'IF502', 'prodi' => ['55'], 'sem' => 5, 'ta' => ['2023/2024', '2024/2025']],
            ['kode' => 'IF503', 'prodi' => ['55'], 'sem' => 5, 'ta' => ['2023/2024', '2024/2025']],
            ['kode' => 'IF504', 'prodi' => ['55'], 'sem' => 5, 'ta' => ['2023/2024', '2024/2025']],
            ['kode' => 'SI501', 'prodi' => ['56'], 'sem' => 5, 'ta' => ['2023/2024', '2024/2025']],
            ['kode' => 'SI502', 'prodi' => ['56'], 'sem' => 5, 'ta' => ['2023/2024', '2024/2025']],
            ['kode' => 'SI503', 'prodi' => ['56'], 'sem' => 5, 'ta' => ['2023/2024', '2024/2025']],
            ['kode' => 'MN501', 'prodi' => ['31'], 'sem' => 5, 'ta' => ['2023/2024', '2024/2025']],

            // Semester 6
            ['kode' => 'IF601', 'prodi' => ['55'], 'sem' => 6, 'ta' => ['2023/2024', '2024/2025']],
            ['kode' => 'IF602', 'prodi' => ['55'], 'sem' => 6, 'ta' => ['2023/2024', '2024/2025']],
            ['kode' => 'IF603', 'prodi' => ['55'], 'sem' => 6, 'ta' => ['2023/2024', '2024/2025']],
            ['kode' => 'SI601', 'prodi' => ['56'], 'sem' => 6, 'ta' => ['2023/2024', '2024/2025']],
            ['kode' => 'SI602', 'prodi' => ['56'], 'sem' => 6, 'ta' => ['2023/2024', '2024/2025']],
            ['kode' => 'MN601', 'prodi' => ['31'], 'sem' => 6, 'ta' => ['2023/2024', '2024/2025']],

            // Semester 7
            ['kode' => 'IF701', 'prodi' => ['55'], 'sem' => 7, 'ta' => ['2024/2025']],
            ['kode' => 'IF702', 'prodi' => ['55'], 'sem' => 7, 'ta' => ['2024/2025']],
            ['kode' => 'IF703', 'prodi' => ['55'], 'sem' => 7, 'ta' => ['2024/2025']],
            ['kode' => 'SI701', 'prodi' => ['56'], 'sem' => 7, 'ta' => ['2024/2025']],
            ['kode' => 'SI702', 'prodi' => ['56'], 'sem' => 7, 'ta' => ['2024/2025']],
            ['kode' => 'MN701', 'prodi' => ['31'], 'sem' => 7, 'ta' => ['2024/2025']],
        ];

        foreach ($mkPeriodeMapping as $mapping) {
            foreach ($mapping['prodi'] as $prodi) {
                foreach ($mapping['ta'] as $ta) {
                    $jenisSemester = $mapping['sem'] % 2 == 1 ? 'ganjil' : 'genap';

                    DB::table('mata_kuliah_periode')->insert([
                        'kode_matkul' => $mapping['kode'],
                        'kode_prodi' => $prodi,
                        'tahun_ajaran' => $ta,
                        'jenis_semester' => $jenisSemester,
                        'semester_ditawarkan' => $mapping['sem'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }

    private function generateNim($kodeProdi, $tahun, $urutan)
    {
        $tahunMasuk = substr($tahun, 2, 2);
        $urut = str_pad($urutan, 3, '0', STR_PAD_LEFT);
        return $tahunMasuk . $kodeProdi . '55' . $urut;
    }

    private function getCurrentSemester($tahunMasuk)
    {
        $yearDiff = 2024 - $tahunMasuk;
        $currentMonth = 10;

        if ($currentMonth >= 8) {
            return ($yearDiff * 2) + 1;
        } else {
            return ($yearDiff * 2);
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
        $mkPeriodeList = DB::table('mata_kuliah_periode')
            ->join('mata_kuliah', 'mata_kuliah_periode.kode_matkul', '=', 'mata_kuliah.kode_matkul')
            ->where('mata_kuliah_periode.semester_ditawarkan', $semester)
            ->where('mata_kuliah_periode.tahun_ajaran', $tahunAjaran)
            ->where('mata_kuliah_periode.jenis_semester', $jenisSemester)
            ->where(function ($q) use ($mhs) {
                $q->where('mata_kuliah_periode.kode_prodi', $mhs['kode_prodi'])
                    ->orWhere('mata_kuliah.kode_prodi', null);
            })
            ->where('mata_kuliah.is_active', 1)
            ->select('mata_kuliah_periode.*', 'mata_kuliah.sks', 'mata_kuliah.kategori')
            ->get();

        if ($mkPeriodeList->isEmpty()) {
            return;
        }

        $targetSks = rand(20, 24);
        $currentSks = 0;
        $selectedMkPeriode = [];

        foreach ($mkPeriodeList as $mkp) {
            if ($mkp->kategori == 'wajib' && $currentSks + $mkp->sks <= $targetSks) {
                $selectedMkPeriode[] = $mkp;
                $currentSks += $mkp->sks;
            }
        }

        foreach ($mkPeriodeList as $mkp) {
            if ($mkp->kategori != 'wajib' && $currentSks + $mkp->sks <= $targetSks) {
                $selectedMkPeriode[] = $mkp;
                $currentSks += $mkp->sks;

                if ($currentSks >= 20) {
                    break;
                }
            }
        }

        if (empty($selectedMkPeriode)) {
            return;
        }

        $krsId = DB::table('krs')->insertGetId([
            'id_mahasiswa' => $mhs['id'],
            'semester' => $semester,
            'tahun_ajaran' => $tahunAjaran,
            'tanggal_pengisian' => $this->getTanggalRegistrasi($mhs['tahun'], $semester),
            'status' => 'approved',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        foreach ($selectedMkPeriode as $mkp) {
            $kelas = DB::table('kelas')
                ->where('id_mk_periode', $mkp->id_mk_periode)
                ->first();

            if (!$kelas) {
                $kelasId = DB::table('kelas')->insertGetId([
                    'nama_kelas' => 'A',
                    'id_mk_periode' => $mkp->id_mk_periode,
                    'id_dosen' => $dosenIds[array_rand($dosenIds)],
                    'ruang_kelas' => 'R' . rand(101, 510),
                    'hari' => ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'][array_rand(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'])],
                    'jam_mulai' => ['08:00:00', '10:00:00', '13:00:00', '15:00:00'][rand(0, 3)],
                    'jam_selesai' => ['09:40:00', '11:40:00', '14:40:00', '16:40:00'][rand(0, 3)],
                    'kapasitas' => 40,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

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

            DB::table('detail_krs')->insert([
                'id_krs' => $krsId,
                'id_kelas' => $kelasId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // ✅ INSERT NILAI (untuk semester yang sudah lewat)
            if ($semester < $this->getCurrentSemester($mhs['tahun'])) {
                $nilaiTugas = rand(70, 95);
                $nilaiUts = rand(70, 95);
                $nilaiUas = rand(70, 95);
                $nilaiAkhir = ($nilaiTugas * 0.3) + ($nilaiUts * 0.3) + ($nilaiUas * 0.4);

                // ✅ TAMBAH is_locked
                // Semester lama (>= 2 semester lalu) = locked
                // Semester baru (1 semester lalu) = unlocked (masih bisa diedit dosen)
                $currentSem = $this->getCurrentSemester($mhs['tahun']);
                $isLocked = $semester < ($currentSem - 1); // Locked jika >= 2 semester lalu

                DB::table('nilai_mahasiswa')->insert([
                    'id_mahasiswa' => $mhs['id'],
                    'id_kelas' => $kelasId,
                    'nilai_tugas' => $nilaiTugas,
                    'nilai_uts' => $nilaiUts,
                    'nilai_uas' => $nilaiUas,
                    'nilai_akhir' => $nilaiAkhir,
                    'nilai_huruf' => $this->getNilaiHuruf($nilaiAkhir),
                    'is_locked' => $isLocked, // ✅ BARU DITAMBAHKAN
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Insert riwayat akademik
        if ($semester < $this->getCurrentSemester($mhs['tahun'])) {
            $this->insertRiwayatAkademik($mhs['id'], $semester, $tahunAjaran, $currentSks);
        }
    }

    private function insertRiwayatAkademik($mahasiswaId, $semester, $tahunAjaran, $sksSemester)
    {
        $nilaiList = DB::table('nilai_mahasiswa')
            ->join('kelas', 'nilai_mahasiswa.id_kelas', '=', 'kelas.id_kelas')
            ->join('mata_kuliah_periode', 'kelas.id_mk_periode', '=', 'mata_kuliah_periode.id_mk_periode')
            ->join('mata_kuliah', 'mata_kuliah_periode.kode_matkul', '=', 'mata_kuliah.kode_matkul')
            ->join('detail_krs', 'kelas.id_kelas', '=', 'detail_krs.id_kelas')
            ->join('krs', 'detail_krs.id_krs', '=', 'krs.id_krs')
            ->where('nilai_mahasiswa.id_mahasiswa', $mahasiswaId)
            ->where('krs.semester', $semester)
            ->select('nilai_mahasiswa.nilai_akhir', 'mata_kuliah.sks')
            ->get();

        if ($nilaiList->isEmpty()) {
            return;
        }

        $totalNilai = 0;
        $totalSks = 0;
        foreach ($nilaiList as $nilai) {
            $bobot = $this->getBobotNilai($nilai->nilai_akhir);
            $totalNilai += $bobot * $nilai->sks;
            $totalSks += $nilai->sks;
        }
        $ips = $totalSks > 0 ? $totalNilai / $totalSks : 0;

        $allNilai = DB::table('nilai_mahasiswa')
            ->join('kelas', 'nilai_mahasiswa.id_kelas', '=', 'kelas.id_kelas')
            ->join('mata_kuliah_periode', 'kelas.id_mk_periode', '=', 'mata_kuliah_periode.id_mk_periode')
            ->join('mata_kuliah', 'mata_kuliah_periode.kode_matkul', '=', 'mata_kuliah.kode_matkul')
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
