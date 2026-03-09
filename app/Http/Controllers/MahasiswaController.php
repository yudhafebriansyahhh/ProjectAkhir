<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MahasiswaController extends Controller
{
    public function dashboard()
    {
        $user = auth()->user();
        if (!$user || !$user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $mahasiswa = $user->mahasiswa;

        // 1. Data IP & SKS dari Krs dan NilaiMahasiswa (Sama seperti detail Baak)
        $krsList = \App\Models\Krs::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->with(['detailKrs.kelas.mataKuliahPeriode.mataKuliah'])
            ->orderBy('semester', 'asc')
            ->get();

        $ipData = [];
        $sksData = [];
        $totalSksKumulatif = 0;
        $totalBobotKumulatif = 0;
        
        $currentIpk = "0.00";

        foreach ($krsList as $krs) {
            $totalBobotSemester = 0;
            $totalSksSemester = 0;

            foreach ($krs->detailKrs as $detail) {
                // Ensure the relationships aren't null before diving in
                if ($detail->kelas && $detail->kelas->mataKuliahPeriode && $detail->kelas->mataKuliahPeriode->mataKuliah) {
                    $mk = $detail->kelas->mataKuliahPeriode->mataKuliah;

                    $nilai = \App\Models\NilaiMahasiswa::where('id_mahasiswa', $krs->id_mahasiswa)
                        ->where('id_kelas', $detail->id_kelas)
                        ->first();
                        
                    // Kalkulasi bobot (dari Baak\MahasiswaController)
                    $bobotMap = [
                        'A' => 4.00, 'A-' => 3.75, 'B+' => 3.50,
                        'B' => 3.00, 'B-' => 2.75, 'C+' => 2.50,
                        'C' => 2.00, 'D' => 1.00, 'E' => 0.00,
                    ];
                    $bobot = $nilai ? ($bobotMap[$nilai->nilai_huruf] ?? 0) : 0;
                    
                    if ($bobot > 0 && $mk->sks) {
                        $totalBobotSemester += $bobot * $mk->sks;
                        $totalSksSemester += $mk->sks;
                        
                        $totalBobotKumulatif += $bobot * $mk->sks;
                        $totalSksKumulatif += $mk->sks;
                    } elseif ($mk->sks) {
                        // Even if grade is E (bobot 0), SKS is still counted attempt on Baak logic
                        // Need to check the BAAK logic carefully. Usually SKS is counted if taking.
                         $totalSksSemester += $mk->sks;
                         $totalSksKumulatif += $mk->sks;
                    }
                }
            }

            $ips = $totalSksSemester > 0 ? number_format($totalBobotSemester / $totalSksSemester, 2) : "0.00";
            $ipData[] = floatval($ips);
            $sksData[] = $totalSksSemester;
        }

        if ($totalSksKumulatif > 0) {
            $currentIpk = number_format($totalBobotKumulatif / $totalSksKumulatif, 2);
        }

        // 3. Data Absensi Semester Berjalan (terakhir approved)
        $latestKrs = \App\Models\Krs::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->where('status', 'approved')
            ->orderBy('semester', 'desc')
            ->with([
                'detailKrs.kelas.mataKuliahPeriode.mataKuliah',
                'detailKrs.kelas.pertemuans.absensis' => function ($query) use ($mahasiswa) {
                    $query->where('id_mahasiswa', $mahasiswa->id_mahasiswa);
                }
            ])
            ->first();

        $attendanceData = [];
        if ($latestKrs) {
            foreach ($latestKrs->detailKrs as $detail) {
                $kelas = $detail->kelas;
                if (!$kelas) continue;

                $mkp = $kelas->mataKuliahPeriode;
                $mk = $mkp ? $mkp->mataKuliah : null;
                
                $pertemuans = $kelas->pertemuans;
                $total_pertemuan = $pertemuans->count();
                $hadir_count = 0;
                
                foreach ($pertemuans as $pertemuan) {
                    $absensi = $pertemuan->absensis->first();
                    if ($absensi && strtolower($absensi->status) === 'hadir') {
                        $hadir_count++;
                    }
                }
                
                $persentase = $total_pertemuan > 0 ? round(($hadir_count / $total_pertemuan) * 100) : 0;
                
                if ($mk) {
                    $attendanceData[] = [
                        'mataKuliah' => $mk->nama_matkul,
                        'sks' => $mk->sks,
                        'kelas' => $kelas->nama_kelas,
                        'persentase' => $persentase
                    ];
                }
            }
        }

        return Inertia::render('Mahasiswa/Index', [
            'ipData' => $ipData,
            'sksData' => $sksData,
            'currentIpk' => $currentIpk,
            'attendanceData' => $attendanceData
        ]);
    }

    public function nilai()
    {
        $user = auth()->user();
        if (!$user || !$user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $mahasiswa = $user->mahasiswa;

        // Fetch all KRS for this student with details
        $krsList = \App\Models\Krs::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->with(['detailKrs.kelas.mataKuliahPeriode.mataKuliah'])
            ->orderBy('semester', 'asc')
            ->get();

        $semesters = [];
        $totalSksKumulatif = 0;
        $totalBobotKumulatif = 0;

        $bobotMap = [
            'A' => 4.00, 'A-' => 3.75, 'B+' => 3.50,
            'B' => 3.00, 'B-' => 2.75, 'C+' => 2.50,
            'C' => 2.00, 'D' => 1.00, 'E' => 0.00,
        ];

        foreach ($krsList as $krs) {
            if (strtolower($krs->status) !== 'approved') {
                continue; // Optionally only show approved semesters, but usually Khs is from approved krs.
            }

            $totalSksSemester = 0;
            $totalBobotSemester = 0;
            $mataKuliahArr = [];

            foreach ($krs->detailKrs as $detail) {
                if ($detail->kelas && $detail->kelas->mataKuliahPeriode && $detail->kelas->mataKuliahPeriode->mataKuliah) {
                    $mk = $detail->kelas->mataKuliahPeriode->mataKuliah;

                    $nilai = \App\Models\NilaiMahasiswa::where('id_mahasiswa', $krs->id_mahasiswa)
                        ->where('id_kelas', $detail->id_kelas)
                        ->first();

                    $nilaiHuruf = $nilai ? $nilai->nilai_huruf : '-';
                    $bobot = $bobotMap[$nilaiHuruf] ?? 0;
                    
                    if ($bobot > 0 && $mk->sks) {
                        $totalBobotSemester += $bobot * $mk->sks;
                        $totalSksSemester += $mk->sks;
                        
                        $totalBobotKumulatif += $bobot * $mk->sks;
                        $totalSksKumulatif += $mk->sks;
                    } elseif ($mk->sks) {
                        $totalSksSemester += $mk->sks;
                        $totalSksKumulatif += $mk->sks;
                    }

                    $mataKuliahArr[] = [
                        'nama' => $mk->nama_matkul,
                        'bobot' => $mk->sks,
                        'tugas' => $nilai ? floatval($nilai->nilai_tugas) : 0,
                        'uts' => $nilai ? floatval($nilai->nilai_uts) : 0,
                        'uas' => $nilai ? floatval($nilai->nilai_uas) : 0,
                        'total' => $nilai ? floatval($nilai->nilai_akhir) : 0,
                        'grade' => $nilaiHuruf
                    ];
                }
            }

            $ipkSemester = $totalSksSemester > 0 ? number_format($totalBobotSemester / $totalSksSemester, 2) : "0.00";
            $ipkKumulatif = $totalSksKumulatif > 0 ? number_format($totalBobotKumulatif / $totalSksKumulatif, 2) : "0.00";

            if (count($mataKuliahArr) > 0) {
                $semesters[] = [
                    'id' => intval($krs->semester),
                    'ipkSemester' => $ipkSemester,
                    'ipkKumulatif' => $ipkKumulatif,
                    'totalSks' => $totalSksSemester,
                    'mata_kuliah' => $mataKuliahArr
                ];
            }
        }

        return Inertia::render('Mahasiswa/Nilai', [
            'semesters' => $semesters
        ]);
    }

    public function penjadwalan()
    {
        $user = auth()->user();
        if (!$user || !$user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $mahasiswa = $user->mahasiswa;

        // Fetch all approved KRS for this student with schedule details
        $krsList = \App\Models\Krs::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->where('status', 'approved')
            ->with(['detailKrs.kelas.mataKuliahPeriode.mataKuliah', 'detailKrs.kelas.dosen'])
            ->orderBy('semester', 'asc')
            ->get();

        $semesters = [];

        foreach ($krsList as $krs) {
            $jadwalArr = [];

            foreach ($krs->detailKrs as $detail) {
                if ($detail->kelas && $detail->kelas->mataKuliahPeriode && $detail->kelas->mataKuliahPeriode->mataKuliah) {
                    $kelas = $detail->kelas;
                    $mk = $kelas->mataKuliahPeriode->mataKuliah;

                    // Parse the time or use fallback 
                    $jamMulai = $kelas->jam_mulai ? \Carbon\Carbon::parse($kelas->jam_mulai)->format('H:i') : '-';
                    $jamSelesai = $kelas->jam_selesai ? \Carbon\Carbon::parse($kelas->jam_selesai)->format('H:i') : '-';
                    $jadwalJam = ($jamMulai !== '-' && $jamSelesai !== '-') ? "{$jamMulai}-{$jamSelesai}" : '-';

                    $jadwalArr[] = [
                        'kode' => $mk->kode_matkul,
                        'nama' => $mk->nama_matkul,
                        'dosen' => $kelas->dosen ? $kelas->dosen->nama : 'Belum Ditentukan',
                        'hari' => $kelas->hari ?? '-',
                        'jam' => $jadwalJam,
                        'ruang' => $kelas->ruangan ?? '-',
                        'sks' => $mk->sks,
                        'kelas' => $kelas->nama_kelas,
                        'rps' => false // Hardcoded for now unless rps is added to model
                    ];
                }
            }

            // Create a label for the semester
            $jenisSemester = ($krs->semester % 2 == 0) ? 'Genap' : 'Ganjil';
            $semesterLabel = "Semester {$krs->semester} ({$jenisSemester} {$krs->tahun_ajaran})";

            if (count($jadwalArr) > 0) {
                $semesters[] = [
                    'id' => intval($krs->semester),
                    'label' => $semesterLabel,
                    'mata_kuliah' => $jadwalArr
                ];
            }
        }

        return Inertia::render('Mahasiswa/Penjadwalan', [
            'semesters' => $semesters
        ]);
    }

    public function krs()
    {
        $user = auth()->user();
        if (!$user || !$user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $mahasiswa = $user->mahasiswa;

        // Fetch the most recent KRS (could be pending or approved)
        $latestKrs = \App\Models\Krs::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->with(['detailKrs.kelas.mataKuliahPeriode.mataKuliah', 'detailKrs.kelas.dosen'])
            ->orderBy('semester', 'desc')
            ->first();

        $mataKuliahArr = [];
        $semesterAktif = 'Belum ada KRS';

        if ($latestKrs) {
            $jenisSemester = ($latestKrs->semester % 2 == 0) ? 'Genap' : 'Ganjil';
            $semesterAktif = "Semester {$latestKrs->semester} ({$jenisSemester} {$latestKrs->tahun_ajaran}) - Status: " . ucfirst($latestKrs->status);

            foreach ($latestKrs->detailKrs as $detail) {
                if ($detail->kelas && $detail->kelas->mataKuliahPeriode && $detail->kelas->mataKuliahPeriode->mataKuliah) {
                    $kelas = $detail->kelas;
                    $mk = $kelas->mataKuliahPeriode->mataKuliah;

                    $jamMulai = $kelas->jam_mulai ? \Carbon\Carbon::parse($kelas->jam_mulai)->format('H:i') : '-';
                    $jamSelesai = $kelas->jam_selesai ? \Carbon\Carbon::parse($kelas->jam_selesai)->format('H:i') : '-';
                    $jadwalJam = ($jamMulai !== '-' && $jamSelesai !== '-') ? "{$jamMulai}-{$jamSelesai}" : '-';

                    $mataKuliahArr[] = [
                        'id_detail_krs' => $detail->id_detail_krs,
                        'kode' => $mk->kode_matkul,
                        'nama' => $mk->nama_matkul,
                        'dosen' => $kelas->dosen ? $kelas->dosen->nama : 'Belum Ditentukan',
                        'hari' => $kelas->hari ?? '-',
                        'jam' => $jadwalJam,
                        'ruang' => $kelas->ruangan ?? '-',
                        'sks' => $mk->sks
                    ];
                }
            }
        }

        return Inertia::render('Mahasiswa/Krs', [
            'semesterAktif' => $semesterAktif,
            'krsStatus' => $latestKrs ? clone $latestKrs : null,
            'mataKuliah' => $mataKuliahArr
        ]);
    }

    public function absensi()
    {
        $user = auth()->user();
        if (!$user || !$user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $mahasiswa = $user->mahasiswa;

        $krsList = \App\Models\Krs::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->where('status', 'approved')
            ->orderBy('semester', 'asc')
            ->with([
                'detailKrs.kelas.mataKuliahPeriode.mataKuliah',
                'detailKrs.kelas.dosen',
                'detailKrs.kelas.pertemuans.absensis' => function ($query) use ($mahasiswa) {
                    $query->where('id_mahasiswa', $mahasiswa->id_mahasiswa);
                }
            ])
            ->get();

        $semesters = [];

        foreach ($krsList as $krs) {
            $mata_kuliah = [];
            
            foreach ($krs->detailKrs as $detail) {
                $kelas = $detail->kelas;
                if (!$kelas) continue;

                $mkp = $kelas->mataKuliahPeriode;
                $mk = $mkp ? $mkp->mataKuliah : null;
                $dosen = $kelas->dosen;
                
                $pertemuans = $kelas->pertemuans;
                $total_pertemuan = $pertemuans->count();
                $hadir_count = 0;
                
                foreach ($pertemuans as $pertemuan) {
                    $absensi = $pertemuan->absensis->first();
                    if ($absensi && strtolower($absensi->status) === 'hadir') {
                        $hadir_count++;
                    }
                }
                
                $persen = $total_pertemuan > 0 ? round(($hadir_count / $total_pertemuan) * 100) : 0;
                
                if ($mk) {
                    $mata_kuliah[] = [
                        'nama' => $mk->nama_matkul,
                        'sks' => $mk->sks,
                        'kelas' => $kelas->nama_kelas,
                        'dosen' => $dosen ? $dosen->nama : 'Belum Ditentukan',
                        'persen' => $persen
                    ];
                }
            }
            
            $semesters[] = [
                'id' => $krs->semester,
                'totalSks' => $krs->total_sks,
                'mata_kuliah' => $mata_kuliah
            ];
        }

        return Inertia::render('Mahasiswa/Absensi', [
            'semesters' => $semesters
        ]);
    }


    public function profile()
    {
        $user = auth()->user();
        if (!$user || !$user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $mahasiswa = $user->mahasiswa()->with('prodi.fakultas')->first();

        return Inertia::render('Mahasiswa/Profile', [
            'mahasiswa' => [
                'nama' => $mahasiswa->nama ?? '-',
                'nim' => $mahasiswa->nim ?? '-',
                'alamat' => $mahasiswa->alamat ?? '-',
                'prodi' => $mahasiswa->prodi ? $mahasiswa->prodi->nama_prodi : '-',
                'jurusan' => ($mahasiswa->prodi && $mahasiswa->prodi->fakultas) ? $mahasiswa->prodi->fakultas->nama_fakultas : '-',
                'no_hp' => $mahasiswa->no_hp ?? '-',
                'foto' => $mahasiswa->foto_url ?? '/profile.png',
                // Assuming ayah/ibu not available in DB fields for now
                'nama_ayah' => '-',
                'nama_ibu' => '-'
            ]
        ]);
    }

    public function tambah_krs()
    {
        return Inertia::render('Mahasiswa/FormKrs');
    }
    public function perbarui_data()
    {
        $user = auth()->user();
        if (!$user || !$user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $mahasiswa = $user->mahasiswa()->with('prodi.fakultas')->first();

        return Inertia::render('Mahasiswa/FormProfile', [
            'mahasiswa' => [
                'nama' => $mahasiswa->nama ?? '',
                'nim' => $mahasiswa->nim ?? '',
                'alamat' => $mahasiswa->alamat ?? '',
                'prodi' => $mahasiswa->prodi ? $mahasiswa->prodi->nama_prodi : '',
                'jurusan' => ($mahasiswa->prodi && $mahasiswa->prodi->fakultas) ? $mahasiswa->prodi->fakultas->nama_fakultas : '',
                'no_hp' => $mahasiswa->no_hp ?? '',
                'nama_ayah' => '',
                'nama_ibu' => ''
            ]
        ]);
    }

    public function update_profile(\Illuminate\Http\Request $request)
    {
        $user = auth()->user();
        if (!$user || !$user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $validated = $request->validate([
            'alamat' => 'nullable|string|max:255',
            'no_hp' => 'nullable|string|max:20',
            // fields like ayah/ibu can be added here if DB implements them later
        ]);

        $mahasiswa = $user->mahasiswa;
        if ($mahasiswa) {
            $mahasiswa->update([
                'alamat' => $validated['alamat'],
                'no_hp' => $validated['no_hp'],
            ]);
        }

        return redirect()->route('mahasiswa.profile')->with('success', 'Profil berhasil diperbarui!');
    }
    public function ganti_password()
    {
        return Inertia::render('Mahasiswa/GantiPassword');
    }
}
