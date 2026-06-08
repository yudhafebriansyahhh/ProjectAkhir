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

class DosenTemplateExport extends StringValueBinder implements FromArray, WithHeadings, WithStyles, WithColumnWidths, WithCustomValueBinder, WithEvents
{
    public function array(): array
    {
        return [
            [
                '198001012005011001',
                'Dr. Budi Santoso, M.T.',
                '01',
                'Laki-laki',
                '081234567890',
                'Islam',
                'Jl. Sudirman No. 123, Pekanbaru',
            ],
            [
                '198502022010022002',
                'Siti Aminah, M.Kom.',
                '02',
                'Perempuan',
                '089876543210',
                'Islam',
                'Jl. Nangka No. 45, Pekanbaru',
            ]
        ];
    }

    public function headings(): array
    {
        return [
            ['TEMPLATE IMPORT DATA DOSEN'],
            ['Petunjuk Penggunaan:'],
            ['1. Kolom nip dan nama_dosen WAJIB diisi.'],
            ['2. Kolom kode_prodi diisi dengan kode prodi (lihat tabel di sebelah kanan).'],
            ['3. Kolom jenis_kelamin diisi dengan Laki-laki atau Perempuan.'],
            ['4. Hapus baris contoh data (baris 8 dan 9) sebelum melakukan import data Anda.'],
            [],
            [
                'nip',
                'nama_dosen',
                'kode_prodi',
                'jenis_kelamin',
                'no_hp',
                'agama',
                'alamat',
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
            'A' => 25,
            'B' => 30,
            'C' => 25,
            'D' => 18,
            'E' => 18,
            'F' => 15,
            'G' => 40,
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                // Freeze pane (buat panduan sticky)
                $event->sheet->getDelegate()->freezePane('A9');

                // Gambar Tabel Kode Prodi
                $prodis = \App\Models\Prodi::all();
                $row = 2;
                $event->sheet->setCellValue('D' . $row, 'Daftar Kode Prodi');
                $event->sheet->mergeCells("D{$row}:E{$row}");
                $event->sheet->getStyle("D{$row}")->getFont()->setBold(true);
                $event->sheet->getStyle("D{$row}")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
                
                $row++;
                $event->sheet->setCellValue('D' . $row, 'Kode');
                $event->sheet->setCellValue('E' . $row, 'Program Studi');
                $event->sheet->getStyle("D{$row}:E{$row}")->getFont()->setBold(true);
                $event->sheet->getStyle("D{$row}:E{$row}")->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
                $event->sheet->getStyle("D{$row}:E{$row}")->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('FFE2EFDA');

                $row++;
                foreach ($prodis as $prodi) {
                    $event->sheet->setCellValue('D' . $row, $prodi->kode_prodi);
                    $event->sheet->setCellValue('E' . $row, $prodi->nama_prodi);
                    $event->sheet->getStyle("D{$row}:E{$row}")->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
                    $row++;
                }
            },
        ];
    }
}
