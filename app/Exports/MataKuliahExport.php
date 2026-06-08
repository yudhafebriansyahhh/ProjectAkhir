<?php

namespace App\Exports;

use App\Models\MataKuliah;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithCustomValueBinder;
use PhpOffice\PhpSpreadsheet\Cell\StringValueBinder;

class MataKuliahExport extends StringValueBinder implements FromCollection, WithHeadings, WithMapping, WithCustomValueBinder
{
    public function collection()
    {
        return MataKuliah::with('prodi')->get();
    }

    public function headings(): array
    {
        return [
            'Kode Matkul',
            'Nama Matkul',
            'Prodi',
            'Kategori',
            'SKS',
            'Status',
            'Deskripsi',
        ];
    }

    public function map($mk): array
    {
        return [
            $mk->kode_matkul,
            $mk->nama_matkul,
            $mk->prodi ? $mk->prodi->nama_prodi : 'Mata Kuliah Umum',
            $mk->kategori,
            $mk->sks,
            $mk->is_active ? 'Aktif' : 'Nonaktif',
            $mk->deskripsi,
        ];
    }
}
