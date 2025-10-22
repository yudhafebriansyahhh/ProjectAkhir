<?php
// app/Exports/IpkExport.php

namespace App\Exports;

use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class IpkExport implements FromCollection, WithHeadings, WithMapping, WithTitle, WithStyles
{
    public function collection()
    {
        return DB::table('mahasiswa as m')
            ->join('prodi as p', 'm.kode_prodi', '=', 'p.kode_prodi')
            ->join('riwayat_akademik as ra', function($join) {
                $join->on('m.id_mahasiswa', '=', 'ra.id_mahasiswa')
                     ->whereRaw('ra.id_riwayat = (
                         SELECT id_riwayat
                         FROM riwayat_akademik
                         WHERE id_mahasiswa = m.id_mahasiswa
                         ORDER BY semester DESC
                         LIMIT 1
                     )');
            })
            ->where('m.status', 'aktif')
            ->select('m.nim', 'm.nama', 'p.nama_prodi', 'm.semester_ke', 'ra.ipk')
            ->orderBy('ra.ipk', 'desc')
            ->limit(50)
            ->get();
    }

    public function headings(): array
    {
        return [
            'Ranking',
            'NIM',
            'Nama',
            'Program Studi',
            'Semester',
            'IPK',
            'Predikat',
        ];
    }

    public function map($mahasiswa): array
    {
        static $no = 0;
        $no++;

        $predikat = $this->getPredikat($mahasiswa->ipk);

        return [
            $no,
            $mahasiswa->nim,
            $mahasiswa->nama,
            $mahasiswa->nama_prodi,
            $mahasiswa->semester_ke,
            number_format($mahasiswa->ipk, 2),
            $predikat,
        ];
    }

    private function getPredikat($ipk)
    {
        if ($ipk >= 3.51) return 'Cumlaude';
        if ($ipk >= 3.01) return 'Sangat Memuaskan';
        if ($ipk >= 2.76) return 'Memuaskan';
        if ($ipk >= 2.00) return 'Cukup';
        return 'Kurang';
    }

    public function title(): string
    {
        return 'Top 50 Mahasiswa IPK Tertinggi';
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
