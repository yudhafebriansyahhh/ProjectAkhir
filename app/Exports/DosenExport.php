<?php

namespace App\Exports;

use App\Models\Dosen;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithCustomValueBinder;
use PhpOffice\PhpSpreadsheet\Cell\StringValueBinder;

class DosenExport extends StringValueBinder implements FromCollection, WithHeadings, WithMapping, WithCustomValueBinder
{
    public function collection()
    {
        return Dosen::with('prodi')->get();
    }

    public function headings(): array
    {
        return [
            'NIP',
            'Nama Dosen',
            'Prodi',
            'Jenis Kelamin',
            'No. HP',
            'Agama',
            'Alamat',
        ];
    }

    public function map($dosen): array
    {
        return [
            $dosen->nip,
            $dosen->nama,
            $dosen->prodi ? $dosen->prodi->nama_prodi : '-',
            $dosen->jenis_kelamin,
            $dosen->no_hp,
            $dosen->agama,
            $dosen->alamat,
        ];
    }
}
