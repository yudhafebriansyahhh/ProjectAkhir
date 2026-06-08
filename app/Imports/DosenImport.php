<?php

namespace App\Imports;

use App\Models\Dosen;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class DosenImport implements ToCollection, WithHeadingRow
{
    public function headingRow(): int
    {
        return 8; // Baris ke-8 adalah baris header pada template
    }

    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            // NIP dan Nama wajib ada
            if (empty($row['nip']) || empty($row['nama_dosen'])) {
                continue;
            }

            // Skip jika NIP sudah ada
            $exists = Dosen::where('nip', $row['nip'])->exists();
            if ($exists) {
                continue;
            }

            // Generate email unik berdasarkan nama
            $emailUsername = strtolower(str_replace(' ', '', $row['nama_dosen']));
            $email = $emailUsername . '@itbriau.ac.id';

            $counter = 1;
            while (User::where('email', $email)->exists()) {
                $email = $emailUsername . $counter . '@itbriau.ac.id';
                $counter++;
            }

            // Create User (password default = NIP)
            $user = User::create([
                'role' => 'dosen',
                'username' => $row['nip'],
                'email' => $email,
                'password' => Hash::make($row['nip']),
            ]);

            // Create Dosen
            Dosen::create([
                'nip' => $row['nip'],
                'nama' => $row['nama_dosen'],
                'kode_prodi' => $row['kode_prodi'] ?? null,
                'jenis_kelamin' => $row['jenis_kelamin'] ?? null,
                'no_hp' => $row['no_hp'] ?? null,
                'agama' => $row['agama'] ?? null,
                'alamat' => $row['alamat'] ?? null,
                'user_id' => $user->id,
            ]);
        }
    }
}
