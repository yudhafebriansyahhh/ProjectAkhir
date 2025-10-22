<?php
// app/Exports/MahasiswaExport.php

namespace App\Exports;

use App\Models\Mahasiswa;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class MahasiswaExport implements FromCollection, WithHeadings, WithMapping, WithTitle, WithStyles
{
    protected $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = Mahasiswa::with('prodi:kode_prodi,nama_prodi');

        if (isset($this->filters['kode_prodi'])) {
            $query->where('kode_prodi', $this->filters['kode_prodi']);
        }

        if (isset($this->filters['tahun_masuk'])) {
            $query->where('tahun_masuk', $this->filters['tahun_masuk']);
        }

        if (isset($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }

        return $query->orderBy('nim', 'asc')->get();
    }

    public function headings(): array
    {
        return [
            'No',
            'NIM',
            'Nama',
            'Program Studi',
            'Tahun Masuk',
            'Semester',
            'Status',
            'Email',
            'No HP',
        ];
    }

    public function map($mahasiswa): array
    {
        static $no = 0;
        $no++;

        return [
            $no,
            $mahasiswa->nim,
            $mahasiswa->nama,
            $mahasiswa->prodi->nama_prodi ?? '-',
            $mahasiswa->tahun_masuk,
            $mahasiswa->semester_ke,
            ucfirst($mahasiswa->status),
            $mahasiswa->user->email ?? '-',
            $mahasiswa->no_hp ?? '-',
        ];
    }

    public function title(): string
    {
        return 'Laporan Mahasiswa';
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
