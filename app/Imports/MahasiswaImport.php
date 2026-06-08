<?php

namespace App\Imports;

use App\Models\Mahasiswa;
use App\Models\User;
use App\Models\Dosen;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class MahasiswaImport implements ToCollection, WithHeadingRow
{
    public function headingRow(): int
    {
        return 8; // Baris ke-8 adalah baris header pada template
    }

    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            // NIM dan Nama wajib ada
            if (empty($row['nim']) || empty($row['nama'])) {
                continue;
            }

            // Skip jika NIM sudah ada
            $exists = Mahasiswa::where('nim', $row['nim'])->exists();
            if ($exists) {
                continue;
            }

            // Generate email unik berdasarkan nama
            $emailUsername = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $row['nama']));
            $email = $emailUsername . '@mahasiswa.itbr.ac.id';

            $counter = 1;
            while (User::where('email', $email)->exists()) {
                $email = $emailUsername . $counter . '@mahasiswa.itbr.ac.id';
                $counter++;
            }

            // Create User (password default = NIM)
            $user = User::create([
                'role' => 'mahasiswa',
                'username' => $row['nim'],
                'email' => $email,
                'password' => Hash::make($row['nim']),
            ]);

            // Cari Dosen Wali jika nip disertakan
            $idDosenWali = null;
            if (!empty($row['nip_dosen_wali'])) {
                $dosen = Dosen::where('nip', $row['nip_dosen_wali'])->first();
                if ($dosen) {
                    $idDosenWali = $dosen->id_dosen;
                }
            }

            // Format tanggal_lahir jika berupa angka Excel
            $tanggalLahir = $row['tanggal_lahir'] ?? null;
            if (is_numeric($tanggalLahir)) {
                $tanggalLahir = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($tanggalLahir)->format('Y-m-d');
            }

            // Create Mahasiswa
            Mahasiswa::create([
                'nim' => $row['nim'],
                'nama' => $row['nama'],
                'tahun_masuk' => $row['tahun_masuk'] ?? null,
                'kode_prodi' => $row['kode_prodi'] ?? null,
                'id_dosen_wali' => $idDosenWali,
                'tanggal_lahir' => $tanggalLahir,
                'jenis_kelamin' => $row['jenis_kelamin'] ?? null,
                'no_hp' => $row['no_hp'] ?? null,
                'alamat' => $row['alamat'] ?? null,
                'status' => $row['status'] ?? 'aktif',
                'user_id' => $user->id,
            ]);
        }
    }
}
