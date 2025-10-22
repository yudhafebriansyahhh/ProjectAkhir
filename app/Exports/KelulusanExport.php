<?php

namespace App\Exports;

use App\Models\Mahasiswa;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class KelulusanExport implements FromCollection, WithHeadings, WithMapping, WithTitle, WithStyles
{
    protected $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = Mahasiswa::with(['prodi:kode_prodi,nama_prodi', 'riwayatAkademik'])
            ->where('status', 'lulus');

        if (isset($this->filters['kode_prodi'])) {
            $query->where('kode_prodi', $this->filters['kode_prodi']);
        }

        if (isset($this->filters['tahun_lulus'])) {
            $query->whereYear('tanggal_lulus', $this->filters['tahun_lulus']);
        }

        return $query->orderBy('tanggal_lulus', 'desc')->get();
    }

    public function headings(): array
    {
        return [
            'No',
            'NIM',
            'Nama',
            'Program Studi',
            'Tahun Masuk',
            'Tahun Lulus',
            'Lama Studi (Tahun)',
            'IPK',
            'Predikat',
        ];
    }

    public function map($mahasiswa): array
    {
        static $no = 0;
        $no++;

        $ipk = $mahasiswa->riwayatAkademik->last()->ipk ?? 0;
        $predikat = $this->getPredikat($ipk);

        $lamaStudi = $mahasiswa->tanggal_masuk && $mahasiswa->tanggal_lulus
            ? round($mahasiswa->tanggal_masuk->diffInMonths($mahasiswa->tanggal_lulus) / 12, 1)
            : '-';

        return [
            $no,
            $mahasiswa->nim,
            $mahasiswa->nama,
            $mahasiswa->prodi->nama_prodi ?? '-',
            $mahasiswa->tahun_masuk,
            $mahasiswa->tanggal_lulus ? $mahasiswa->tanggal_lulus->format('Y') : '-',
            $lamaStudi,
            number_format($ipk, 2),
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
        return 'Laporan Kelulusan';
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
