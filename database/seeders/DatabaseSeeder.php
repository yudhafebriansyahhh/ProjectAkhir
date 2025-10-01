<?php
// database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use App\Models\JadwalPengisianKrs;
use App\Models\RiwayatAkademik;
use App\Models\Rps;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Fakultas;
use App\Models\Prodi;
use App\Models\Baak;
use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\MataKuliah;
use App\Models\Kelas;
use App\Models\PeriodeRegistrasi;
use App\Models\RegistrasiSemester;
use App\Models\Krs;
use App\Models\DetailKrs;
use App\Models\BobotNilai;
use App\Models\NilaiMahasiswa;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ============================================
        // 1. FAKULTAS
        // ============================================
        $fakultasTeknologi = Fakultas::create([
            'kode_fakultas' => '301',
            'nama_fakultas' => 'Fakultas Teknologi Informasi',
        ]);

        // ============================================
        // 2. PRODI
        // ============================================
        $prodiTI = Prodi::create([
            'kode_prodi' => '55',
            'kode_fakultas' => '301',
            'nama_prodi' => 'Teknik Informatika',
            'jenjang' => 'S1',
        ]);

        // ============================================
        // 3. USER & BAAK
        // ============================================
        $userBaak = User::create([
            'role' => 'baak',
            'username' => 'baak@itbriau.ac.id',
            'email' => 'baak@itbriau.ac.id',
            'password' => Hash::make('password'),
        ]);

        Baak::create([
            'user_id' => $userBaak->id,
            'nama' => 'Admin BAAK',
            'nip' => '198501012010011001',
            'no_hp' => '081234567890',
        ]);

        // ============================================
        // 4. USER & DOSEN
        // ============================================
        $userDosen1 = User::create([
            'role' => 'dosen',
            'username' => '1234567890',
            'email' => 'dosen1@itbriau.ac.id',
            'password' => Hash::make('password'),
        ]);

        $dosen1 = Dosen::create([
            'user_id' => $userDosen1->id,
            'nama' => 'Dr. Muhammad Raihan, S.Kom., M.T.',
            'nip' => '1234567890',
            'kode_prodi' => '55',
            'jenis_kelamin' => 'Laki-laki',
            'alamat' => 'Jl. Imam Munandar No. 113, Pekanbaru',
            'no_hp' => '081234567891',
        ]);

        // ============================================
        // 5. MATA KULIAH (Semester 1-7)
        // ============================================
        $mataKuliah = [
            // Semester 1
            ['kode' => 'TIF101', 'nama' => 'Algoritma dan Pemrograman', 'sks' => 4, 'semester' => 1],
            ['kode' => 'TIF102', 'nama' => 'Matematika Diskrit', 'sks' => 3, 'semester' => 1],
            ['kode' => 'TIF103', 'nama' => 'Pengantar Teknologi Informasi', 'sks' => 3, 'semester' => 1],
            ['kode' => 'TIF104', 'nama' => 'Bahasa Inggris I', 'sks' => 2, 'semester' => 1],
            ['kode' => 'TIF105', 'nama' => 'Pancasila', 'sks' => 2, 'semester' => 1],
            ['kode' => 'TIF106', 'nama' => 'Kalkulus I', 'sks' => 3, 'semester' => 1],
            ['kode' => 'TIF107', 'nama' => 'Fisika Dasar', 'sks' => 3, 'semester' => 1],
            // Total: 20 SKS

            // Semester 2
            ['kode' => 'TIF201', 'nama' => 'Struktur Data', 'sks' => 4, 'semester' => 2],
            ['kode' => 'TIF202', 'nama' => 'Matematika Lanjut', 'sks' => 3, 'semester' => 2],
            ['kode' => 'TIF203', 'nama' => 'Sistem Digital', 'sks' => 3, 'semester' => 2],
            ['kode' => 'TIF204', 'nama' => 'Bahasa Inggris II', 'sks' => 2, 'semester' => 2],
            ['kode' => 'TIF205', 'nama' => 'Agama', 'sks' => 2, 'semester' => 2],
            ['kode' => 'TIF206', 'nama' => 'Kalkulus II', 'sks' => 3, 'semester' => 2],
            ['kode' => 'TIF207', 'nama' => 'Statistika', 'sks' => 3, 'semester' => 2],
            // Total: 20 SKS

            // Semester 3
            ['kode' => 'TIF301', 'nama' => 'Basis Data', 'sks' => 4, 'semester' => 3],
            ['kode' => 'TIF302', 'nama' => 'Pemrograman Berorientasi Objek', 'sks' => 4, 'semester' => 3],
            ['kode' => 'TIF303', 'nama' => 'Organisasi Komputer', 'sks' => 3, 'semester' => 3],
            ['kode' => 'TIF304', 'nama' => 'Aljabar Linear', 'sks' => 3, 'semester' => 3],
            ['kode' => 'TIF305', 'nama' => 'Sistem Operasi', 'sks' => 3, 'semester' => 3],
            ['kode' => 'TIF306', 'nama' => 'Kewarganegaraan', 'sks' => 2, 'semester' => 3],
            ['kode' => 'TIF307', 'nama' => 'Etika Profesi', 'sks' => 2, 'semester' => 3],
            // Total: 21 SKS

            // Semester 4
            ['kode' => 'TIF401', 'nama' => 'Pemrograman Web', 'sks' => 4, 'semester' => 4],
            ['kode' => 'TIF402', 'nama' => 'Jaringan Komputer', 'sks' => 4, 'semester' => 4],
            ['kode' => 'TIF403', 'nama' => 'Rekayasa Perangkat Lunak', 'sks' => 3, 'semester' => 4],
            ['kode' => 'TIF404', 'nama' => 'Grafika Komputer', 'sks' => 3, 'semester' => 4],
            ['kode' => 'TIF405', 'nama' => 'Metode Numerik', 'sks' => 3, 'semester' => 4],
            ['kode' => 'TIF406', 'nama' => 'Probabilitas dan Statistik', 'sks' => 3, 'semester' => 4],
            // Total: 20 SKS

            // Semester 5
            ['kode' => 'TIF501', 'nama' => 'Kecerdasan Buatan', 'sks' => 4, 'semester' => 5],
            ['kode' => 'TIF502', 'nama' => 'Keamanan Jaringan', 'sks' => 3, 'semester' => 5],
            ['kode' => 'TIF503', 'nama' => 'Pemrograman Mobile', 'sks' => 4, 'semester' => 5],
            ['kode' => 'TIF504', 'nama' => 'Analisis dan Desain Sistem', 'sks' => 3, 'semester' => 5],
            ['kode' => 'TIF505', 'nama' => 'Data Mining', 'sks' => 3, 'semester' => 5],
            ['kode' => 'TIF506', 'nama' => 'Manajemen Proyek TI', 'sks' => 3, 'semester' => 5],
            // Total: 20 SKS

            // Semester 6
            ['kode' => 'TIF601', 'nama' => 'Machine Learning', 'sks' => 4, 'semester' => 6],
            ['kode' => 'TIF602', 'nama' => 'Cloud Computing', 'sks' => 3, 'semester' => 6],
            ['kode' => 'TIF603', 'nama' => 'Internet of Things', 'sks' => 4, 'semester' => 6],
            ['kode' => 'TIF604', 'nama' => 'Sistem Terdistribusi', 'sks' => 3, 'semester' => 6],
            ['kode' => 'TIF605', 'nama' => 'Interaksi Manusia Komputer', 'sks' => 3, 'semester' => 6],
            ['kode' => 'TIF606', 'nama' => 'Metodologi Penelitian', 'sks' => 2, 'semester' => 6],
            ['kode' => 'TIF607', 'nama' => 'Kewirausahaan', 'sks' => 2, 'semester' => 6],
            // Total: 21 SKS

            // Semester 7
            ['kode' => 'TIF701', 'nama' => 'Kerja Praktek', 'sks' => 4, 'semester' => 7],
            ['kode' => 'TIF702', 'nama' => 'Blockchain Technology', 'sks' => 3, 'semester' => 7],
            ['kode' => 'TIF703', 'nama' => 'Big Data Analytics', 'sks' => 4, 'semester' => 7],
            ['kode' => 'TIF704', 'nama' => 'DevOps Engineering', 'sks' => 3, 'semester' => 7],
            ['kode' => 'TIF705', 'nama' => 'Cyber Security', 'sks' => 3, 'semester' => 7],
            ['kode' => 'TIF706', 'nama' => 'Sistem Informasi Geografis', 'sks' => 3, 'semester' => 7],
            // Total: 20 SKS
        ];

        $mkObjects = [];
        foreach ($mataKuliah as $mk) {
            $mkObjects[$mk['kode']] = MataKuliah::create([
                'kode_matkul' => $mk['kode'],
                'nama_matkul' => $mk['nama'],
                'sks' => $mk['sks'],
                'semester' => $mk['semester'],
            ]);
        }

        // ============================================
        // 6. KELAS (untuk setiap mata kuliah)
        // ============================================
        $kelasObjects = [];
        foreach ($mkObjects as $kode => $mk) {
            $kelasObjects[$kode] = Kelas::create([
                'nama_kelas' => 'A',
                'kode_matkul' => $kode,
                'id_dosen' => $dosen1->id_dosen,
                'ruang_kelas' => 'Lab ' . substr($kode, -1),
                'hari' => ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'][rand(0, 4)],
                'jam_mulai' => '08:00:00',
                'jam_selesai' => '10:00:00',
                'kapasitas' => 40,
            ]);

            // Bobot nilai untuk setiap kelas
            BobotNilai::create([
                'id_kelas' => $kelasObjects[$kode]->id_kelas,
                'bobot_tugas' => 30,
                'bobot_uts' => 30,
                'bobot_uas' => 40,
            ]);
        }

        // Tambahkan di DatabaseSeeder.php setelah generate nilai mahasiswa

        // ============================================
// RPS untuk beberapa mata kuliah
// ============================================
        Rps::create([
            'kode_matkul' => 'TIF101',
            'judul' => 'RPS Algoritma dan Pemrograman',
            'deskripsi' => 'Rencana Pembelajaran Semester untuk mata kuliah Algoritma dan Pemrograman',
            'capaian_pembelajaran' => 'Mahasiswa mampu memahami konsep algoritma dan membuat program sederhana',
            'materi' => 'Pengenalan algoritma, flowchart, pseudocode, variabel, tipe data, operator, percabangan, perulangan',
        ]);

        Rps::create([
            'kode_matkul' => 'TIF301',
            'judul' => 'RPS Basis Data',
            'deskripsi' => 'Rencana Pembelajaran Semester untuk mata kuliah Basis Data',
            'capaian_pembelajaran' => 'Mahasiswa mampu merancang dan mengimplementasikan database',
            'materi' => 'Konsep database, ERD, normalisasi, SQL, transaksi, stored procedure',
        ]);

        // ============================================
// Jadwal Pengisian KRS
// ============================================
        JadwalPengisianKrs::create([
            'kode_prodi' => '55',
            'semester' => 5,
            'tahun_ajaran' => '2024/2025',
            'tanggal_mulai' => '2024-07-15',
            'tanggal_selesai' => '2024-07-30',
        ]);

        JadwalPengisianKrs::create([
            'kode_prodi' => '55',
            'semester' => 6,
            'tahun_ajaran' => '2024/2025',
            'tanggal_mulai' => '2025-01-05',
            'tanggal_selesai' => '2025-01-20',
        ]);

        // ============================================
// Riwayat Akademik (untuk mahasiswa yang sudah ada)
// ============================================
// Ini akan digenerate otomatis berdasarkan nilai yang sudah ada
// Contoh untuk mahasiswa pertama (Ahmad Fauzi - Semester 5)
        $mahasiswaAhmad = Mahasiswa::where('nim', 'like', '2255301001')->first();
        if ($mahasiswaAhmad) {
            // Semester 1
            RiwayatAkademik::create([
                'id_mahasiswa' => $mahasiswaAhmad->id_mahasiswa,
                'semester' => 1,
                'tahun_ajaran' => '2022/2023',
                'ips_semester' => 3.45,
                'sks_semester' => 20,
                'sks_kumulatif' => 20,
                'ipk' => 3.45,
                'keterangan' => 'Semester 1 - Berhasil',
            ]);

            // Semester 2
            RiwayatAkademik::create([
                'id_mahasiswa' => $mahasiswaAhmad->id_mahasiswa,
                'semester' => 2,
                'tahun_ajaran' => '2022/2023',
                'ips_semester' => 3.52,
                'sks_semester' => 20,
                'sks_kumulatif' => 40,
                'ipk' => 3.49,
                'keterangan' => 'Semester 2 - Berhasil',
            ]);

            // Semester 3
            RiwayatAkademik::create([
                'id_mahasiswa' => $mahasiswaAhmad->id_mahasiswa,
                'semester' => 3,
                'tahun_ajaran' => '2023/2024',
                'ips_semester' => 3.60,
                'sks_semester' => 21,
                'sks_kumulatif' => 61,
                'ipk' => 3.52,
                'keterangan' => 'Semester 3 - Berhasil',
            ]);

            // Semester 4
            RiwayatAkademik::create([
                'id_mahasiswa' => $mahasiswaAhmad->id_mahasiswa,
                'semester' => 4,
                'tahun_ajaran' => '2023/2024',
                'ips_semester' => 3.55,
                'sks_semester' => 20,
                'sks_kumulatif' => 81,
                'ipk' => 3.53,
                'keterangan' => 'Semester 4 - Berhasil',
            ]);
        }

        // ============================================
        // 7. PERIODE REGISTRASI
        // ============================================
        PeriodeRegistrasi::create([
            'tahun_ajaran' => '2024/2025',
            'jenis_semester' => 'ganjil',
            'tanggal_mulai' => '2024-08-01',
            'tanggal_selesai' => '2024-08-15',
            'status' => 'tutup',
        ]);

        // ============================================
        // 8. MAHASISWA
        // ============================================
        $mahasiswaData = [
            [
                'nama' => 'Ahmad Fauzi',
                'tahun_masuk' => 2022,
                'jenis_kelamin' => 'Laki-laki',
                'tanggal_lahir' => '2004-03-15',
                'alamat' => 'Jl. Sudirman No. 123, Pekanbaru',
                'no_hp' => '082111111111',
                'semester_awal' => 1,
                'semester_akhir' => 5, // Sekarang semester 5
            ],
            [
                'nama' => 'Siti Nurhaliza',
                'tahun_masuk' => 2022,
                'jenis_kelamin' => 'Perempuan',
                'tanggal_lahir' => '2004-07-20',
                'alamat' => 'Jl. Ahmad Yani No. 45, Pekanbaru',
                'no_hp' => '082222222222',
                'semester_awal' => 1,
                'semester_akhir' => 6, // Sekarang semester 6
            ],
            [
                'nama' => 'Budi Santoso',
                'tahun_masuk' => 2021,
                'jenis_kelamin' => 'Laki-laki',
                'tanggal_lahir' => '2003-11-10',
                'alamat' => 'Jl. Diponegoro No. 78, Pekanbaru',
                'no_hp' => '082333333333',
                'semester_awal' => 1,
                'semester_akhir' => 7, // Sekarang semester 7
            ],
        ];

        foreach ($mahasiswaData as $mhsData) {
            // Generate NIM
            $tahunNim = substr($mhsData['tahun_masuk'], -2);
            $kodeProdi = $prodiTI->kode_prodi;
            $kodeFakultas = $prodiTI->fakultas->kode_fakultas;

            // Hitung urutan
            $prefix = $tahunNim . $kodeProdi . $kodeFakultas;
            $lastMhs = Mahasiswa::where('nim', 'like', $prefix . '%')
                ->orderBy('nim', 'desc')->first();
            $urutan = $lastMhs ? ((int) substr($lastMhs->nim, -3)) + 1 : 1;
            $nim = $prefix . str_pad($urutan, 3, '0', STR_PAD_LEFT);

            // Buat user
            $userMhs = User::create([
                'role' => 'mahasiswa',
                'username' => $nim,
                'email' => strtolower(str_replace(' ', '', $mhsData['nama'])) . '@student.itbriau.ac.id',
                'password' => Hash::make($nim),
            ]);

            // Buat mahasiswa
            $mahasiswa = Mahasiswa::create([
                'user_id' => $userMhs->id,
                'nim' => $nim,
                'nama' => $mhsData['nama'],
                'kode_prodi' => '55',
                'id_dosen_wali' => $dosen1->id_dosen,
                'tanggal_lahir' => $mhsData['tanggal_lahir'],
                'jenis_kelamin' => $mhsData['jenis_kelamin'],
                'alamat' => $mhsData['alamat'],
                'no_hp' => $mhsData['no_hp'],
                'status' => 'aktif',
            ]);

            // Generate registrasi & KRS untuk setiap semester
            for ($sem = $mhsData['semester_awal']; $sem <= $mhsData['semester_akhir']; $sem++) {
                $jenisSemester = ($sem % 2 == 1) ? 'ganjil' : 'genap';
                $tahunAjaran = $this->getTahunAjaran($mhsData['tahun_masuk'], $sem);

                // Registrasi semester
                RegistrasiSemester::create([
                    'id_mahasiswa' => $mahasiswa->id_mahasiswa,
                    'tahun_ajaran' => $tahunAjaran,
                    'semester' => $sem,
                    'jenis_semester' => $jenisSemester,
                    'status_semester' => 'aktif',
                    'tanggal_registrasi' => $this->getTanggalRegistrasi($mhsData['tahun_masuk'], $sem),
                ]);

                // KRS
                $krs = Krs::create([
                    'id_mahasiswa' => $mahasiswa->id_mahasiswa,
                    'semester' => $sem,
                    'tahun_ajaran' => $tahunAjaran,
                    'tanggal_pengisian' => $this->getTanggalRegistrasi($mhsData['tahun_masuk'], $sem),
                    'status' => 'approved',
                ]);

                // Ambil mata kuliah untuk semester ini
                $mkSemester = array_filter($mataKuliah, function ($mk) use ($sem) {
                    return $mk['semester'] == $sem;
                });

                foreach ($mkSemester as $mk) {
                    $kelas = $kelasObjects[$mk['kode']];

                    // Detail KRS
                    DetailKrs::create([
                        'id_krs' => $krs->id_krs,
                        'id_kelas' => $kelas->id_kelas,
                    ]);

                    // Generate nilai (hanya untuk semester yang sudah lewat)
                    if ($sem < $mhsData['semester_akhir']) {
                        $nilaiTugas = rand(70, 95);
                        $nilaiUTS = rand(70, 95);
                        $nilaiUAS = rand(70, 95);
                        $nilaiAkhir = ($nilaiTugas * 0.3) + ($nilaiUTS * 0.3) + ($nilaiUAS * 0.4);
                        $nilaiHuruf = $this->getNilaiHuruf($nilaiAkhir);

                        NilaiMahasiswa::create([
                            'id_mahasiswa' => $mahasiswa->id_mahasiswa,
                            'id_kelas' => $kelas->id_kelas,
                            'nilai_tugas' => $nilaiTugas,
                            'nilai_uts' => $nilaiUTS,
                            'nilai_uas' => $nilaiUAS,
                            'nilai_akhir' => $nilaiAkhir,
                            'nilai_huruf' => $nilaiHuruf,
                        ]);
                    }
                }
            }
        }
    }

    private function getTahunAjaran($tahunMasuk, $semester)
    {
        $tahun = $tahunMasuk + intdiv($semester - 1, 2);
        return $tahun . '/' . ($tahun + 1);
    }

    private function getTanggalRegistrasi($tahunMasuk, $semester)
    {
        $tahun = $tahunMasuk + intdiv($semester - 1, 2);
        $bulan = ($semester % 2 == 1) ? '08' : '01';
        return $tahun . '-' . $bulan . '-10';
    }

    private function getNilaiHuruf($nilai)
    {
        if ($nilai >= 85)
            return 'A';
        if ($nilai >= 80)
            return 'A-';
        if ($nilai >= 75)
            return 'B+';
        if ($nilai >= 70)
            return 'B';
        if ($nilai >= 65)
            return 'B-';
        if ($nilai >= 60)
            return 'C+';
        if ($nilai >= 55)
            return 'C';
        if ($nilai >= 50)
            return 'D';
        return 'E';
    }
}
