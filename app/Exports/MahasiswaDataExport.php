<?php

namespace App\Exports;

use App\Models\Mahasiswa;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithCustomValueBinder;
use PhpOffice\PhpSpreadsheet\Cell\StringValueBinder;

class MahasiswaDataExport extends StringValueBinder implements FromCollection, WithHeadings, WithMapping, WithCustomValueBinder
{
    public function collection()
    {
        return Mahasiswa::with(['dosenWali', 'prodi'])->get();
    }

    public function headings(): array
    {
        return [
            'NIM',
            'Nama Mahasiswa',
            'Tahun Masuk',
            'Prodi',
            'Dosen Wali',
            'Tanggal Lahir',
            'Jenis Kelamin',
            'No. HP',
            'Alamat',
            'Status',
        ];
    }

    public function map($mhs): array
    {
        return [
            $mhs->nim,
            $mhs->nama,
            $mhs->tahun_masuk,
            $mhs->prodi ? $mhs->prodi->nama_prodi : $mhs->kode_prodi,
            $mhs->dosenWali ? $mhs->dosenWali->nama : '',
            $mhs->tanggal_lahir ? $mhs->tanggal_lahir->format('Y-m-d') : '',
            $mhs->jenis_kelamin,
            $mhs->no_hp,
            $mhs->alamat,
            $mhs->status,
        ];
    }
}
