<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithCustomValueBinder;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Cell\StringValueBinder;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class MataKuliahTemplateExport extends StringValueBinder implements FromArray, WithHeadings, WithStyles, WithColumnWidths, WithCustomValueBinder, WithEvents
{
    public function array(): array
    {
        return [
            [
                'IF101',
                'Algoritma dan Pemrograman',
                '01',
                'wajib',
                '3',
                '1',
                'Mata kuliah dasar pemrograman',
            ],
            [
                'KU102',
                'Pendidikan Kewarganegaraan',
                '', // Umum, bisa kosong prodi-nya
                'umum',
                '2',
                '1',
                'Mata kuliah wajib nasional',
            ]
        ];
    }

    public function headings(): array
    {
        return [
            ['TEMPLATE IMPORT DATA MATA KULIAH'],
            ['Petunjuk Penggunaan:'],
            ['1. Kolom kode_matkul dan nama_matkul WAJIB diisi.'],
            ['2. Kolom kode_prodi opsional (lihat tabel di sebelah kanan). Kosongkan jika matkul umum.'],
            ['3. Kolom kategori diisi dengan: wajib, pilihan, atau umum.'],
            ['4. Kolom is_active diisi angka: 1 (Aktif) atau 0 (Tidak Aktif).'],
            ['5. Hapus baris contoh data di bawah sebelum melakukan import data Anda.'],
            [
                'kode_matkul',
                'nama_matkul',
                'kode_prodi',
                'kategori',
                'sks',
                'is_active',
                'deskripsi',
            ]
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true, 'size' => 14]],
            2 => ['font' => ['bold' => true]],
            8 => ['font' => ['bold' => true], 'fill' => ['fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID, 'color' => ['argb' => 'FFE2EFDA']]], // Light green highlight for headers
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 15,
            'B' => 35,
            'C' => 15,
            'D' => 15,
            'E' => 10,
            'F' => 15,
            'G' => 40,
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                // Freeze pane
                $event->sheet->getDelegate()->freezePane('A9');

                // Gambar Tabel Kode Prodi
                $prodis = \App\Models\Prodi::all();
                $row = 2;
                $event->sheet->setCellValue('F' . $row, 'Daftar Kode Prodi');
                $event->sheet->mergeCells("F{$row}:G{$row}");
                $event->sheet->getStyle("F{$row}")->getFont()->setBold(true);
                $event->sheet->getStyle("F{$row}")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
                
                $row++;
                $event->sheet->setCellValue('F' . $row, 'Kode');
                $event->sheet->setCellValue('G' . $row, 'Program Studi');
                $event->sheet->getStyle("F{$row}:G{$row}")->getFont()->setBold(true);
                $event->sheet->getStyle("F{$row}:G{$row}")->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
                $event->sheet->getStyle("F{$row}:G{$row}")->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('FFE2EFDA');

                $row++;
                foreach ($prodis as $prodi) {
                    $event->sheet->setCellValue('F' . $row, $prodi->kode_prodi);
                    $event->sheet->setCellValue('G' . $row, $prodi->nama_prodi);
                    $event->sheet->getStyle("F{$row}:G{$row}")->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
                    $row++;
                }
            },
        ];
    }
}
