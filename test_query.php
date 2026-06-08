<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$rataIpkPerProdi = DB::table(DB::raw('(
    SELECT 
        m.kode_prodi,
        m.id_mahasiswa,
        SUM(
            CASE nm.nilai_huruf
                WHEN \'A\' THEN 4.00 WHEN \'A-\' THEN 3.75 WHEN \'B+\' THEN 3.50 WHEN \'B\' THEN 3.00 WHEN \'B-\' THEN 2.75
                WHEN \'C+\' THEN 2.50 WHEN \'C\' THEN 2.00 WHEN \'D\' THEN 1.00 WHEN \'E\' THEN 0.00 ELSE 0.00
            END * mk.sks
        ) / NULLIF(SUM(CASE WHEN nm.nilai_huruf NOT IN (\'-\', \'\') AND nm.nilai_huruf IS NOT NULL THEN mk.sks ELSE 0 END), 0) as ipk
    FROM mahasiswa m
    LEFT JOIN nilai_mahasiswa nm ON m.id_mahasiswa = nm.id_mahasiswa
    LEFT JOIN kelas k ON nm.id_kelas = k.id_kelas
    LEFT JOIN mata_kuliah_periode mkp ON k.id_mk_periode = mkp.id_mk_periode
    LEFT JOIN mata_kuliah mk ON mkp.kode_matkul = mk.kode_matkul
    WHERE m.status = \'aktif\'
    GROUP BY m.kode_prodi, m.id_mahasiswa
) as student_ipk'))
->join('prodi as p', 'student_ipk.kode_prodi', '=', 'p.kode_prodi')
->select(
    'p.nama_prodi as prodi',
    DB::raw('ROUND(COALESCE(AVG(student_ipk.ipk), 0), 2) as ipk'),
    DB::raw('COUNT(student_ipk.id_mahasiswa) as mahasiswa')
)
->groupBy('p.kode_prodi', 'p.nama_prodi')
->orderBy('ipk', 'desc')
->get();

echo json_encode($rataIpkPerProdi);
