<?php

namespace App\Imports;

use App\Models\MataKuliah;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class MataKuliahImport implements ToCollection, WithHeadingRow
{
    public function headingRow(): int
    {
        return 8; // Baris ke-8 adalah baris header pada template
    }

    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            // Kode dan Nama wajib ada
            if (empty($row['kode_matkul']) || empty($row['nama_matkul'])) {
                continue;
            }

            // Skip jika Kode Matkul sudah ada
            $exists = MataKuliah::where('kode_matkul', $row['kode_matkul'])->exists();
            if ($exists) {
                continue;
            }

            // Create MataKuliah
            MataKuliah::create([
                'kode_matkul' => $row['kode_matkul'],
                'nama_matkul' => $row['nama_matkul'],
                'kode_prodi' => !empty($row['kode_prodi']) ? $row['kode_prodi'] : null,
                'kategori' => $row['kategori'] ?? 'wajib',
                'sks' => $row['sks'] ?? 0,
                'is_active' => isset($row['is_active']) ? (int) $row['is_active'] : 1,
                'deskripsi' => $row['deskripsi'] ?? null,
            ]);
        }
    }
}
