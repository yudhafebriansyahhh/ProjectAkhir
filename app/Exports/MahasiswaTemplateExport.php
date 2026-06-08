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

class MahasiswaTemplateExport extends StringValueBinder implements FromArray, WithHeadings, WithStyles, WithColumnWidths, WithCustomValueBinder, WithEvents
{
    public function array(): array
    {
        return [
            [
                '2201010001',
                'Andi Saputra',
                '2022',
                '01',
                '198001012005011001', // nip_dosen_wali
                '2004-05-12',
                'Laki-laki',
                '081234567891',
                'Jl. Mawar No. 10, Pekanbaru',
                'aktif',
            ],
            [
                '2202020002',
                'Bunga Lestari',
                '2022',
                '02',
                '198502022010022002', // nip_dosen_wali
                '2004-08-20',
                'Perempuan',
                '089876543211',
                'Jl. Melati No. 5, Pekanbaru',
                'aktif',
            ]
        ];
    }

    public function headings(): array
    {
        return [
            ['TEMPLATE IMPORT DATA MAHASISWA'],
            ['Petunjuk Penggunaan:'],
            ['1. Kolom nim dan nama WAJIB diisi.'],
            ['2. Kolom kode_prodi diisi dengan kode prodi (lihat tabel di sebelah kanan).'],
            ['3. Kolom nip_dosen_wali opsional (kosongkan jika belum ada dosen wali).'],
            ['4. Hapus baris contoh data (baris 8 dan 9) sebelum melakukan import data Anda.'],
            [],
            [
                'nim',
                'nama',
                'tahun_masuk',
                'kode_prodi',
                'nip_dosen_wali',
                'tanggal_lahir',
                'jenis_kelamin',
                'no_hp',
                'alamat',
                'status',
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
            'A' => 20,
            'B' => 30,
            'C' => 15,
            'D' => 15,
            'E' => 25,
            'F' => 15,
            'G' => 15,
            'H' => 15,
            'I' => 30,
            'J' => 15,
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
                $event->sheet->setCellValue('E' . $row, 'Daftar Kode Prodi');
                $event->sheet->mergeCells("E{$row}:F{$row}");
                $event->sheet->getStyle("E{$row}")->getFont()->setBold(true);
                $event->sheet->getStyle("E{$row}")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
                
                $row++;
                $event->sheet->setCellValue('E' . $row, 'Kode');
                $event->sheet->setCellValue('F' . $row, 'Program Studi');
                $event->sheet->getStyle("E{$row}:F{$row}")->getFont()->setBold(true);
                $event->sheet->getStyle("E{$row}:F{$row}")->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
                $event->sheet->getStyle("E{$row}:F{$row}")->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('FFE2EFDA');

                $row++;
                foreach ($prodis as $prodi) {
                    $event->sheet->setCellValue('E' . $row, $prodi->kode_prodi);
                    $event->sheet->setCellValue('F' . $row, $prodi->nama_prodi);
                    $event->sheet->getStyle("E{$row}:F{$row}")->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
                    $row++;
                }
            },
        ];
    }
}
