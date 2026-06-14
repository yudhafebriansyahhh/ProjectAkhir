<?php

namespace App\Http\Controllers;

use App\Models\DetailKrs;
use App\Models\JadwalPengisianKrs;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\NilaiMahasiswa;
use App\Models\PeriodeRegistrasi;
use App\Models\RegistrasiSemester;
use App\Models\RiwayatAkademik;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MahasiswaController extends Controller
{
    public function dashboard()
    {
        $user = auth()->user();
        if (! $user || ! $user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $mahasiswa = $user->mahasiswa;
        $registrasiUlang = $this->getRegistrasiUlangInfo($mahasiswa);

        // 1. Data IP & SKS dari Krs dan NilaiMahasiswa (Sama seperti detail Baak)
        $krsList = \App\Models\Krs::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->with(['detailKrs.kelas.mataKuliahPeriode.mataKuliah'])
            ->orderBy('semester', 'asc')
            ->get();

        $ipData = [];
        $sksData = [];
        $totalSksKumulatif = 0;
        $totalBobotKumulatif = 0;

        $currentIpk = '0.00';

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

                    $nilaiHuruf = $nilai ? ($nilai->nilai_huruf ?: '-') : '-';
                    
                    if ($nilaiHuruf === '-' || $nilaiHuruf === null) {
                        continue; // Lewati kalkulasi jika belum ada nilai
                    }

                    // Kalkulasi bobot (dari Baak\MahasiswaController)
                    $bobotMap = [
                        'A' => 4.00, 'A-' => 3.75, 'B+' => 3.50,
                        'B' => 3.00, 'B-' => 2.75, 'C+' => 2.50,
                        'C' => 2.00, 'D' => 1.00, 'E' => 0.00,
                    ];
                    $bobot = $bobotMap[$nilaiHuruf] ?? 0;

                    if ($mk->sks) {
                        $totalBobotSemester += $bobot * $mk->sks;
                        $totalSksSemester += $mk->sks;

                        $totalBobotKumulatif += $bobot * $mk->sks;
                        $totalSksKumulatif += $mk->sks;
                    }
                }
            }

            $ips = $totalSksSemester > 0 ? number_format($totalBobotSemester / $totalSksSemester, 2) : '0.00';
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
                },
            ])
            ->first();

        $attendanceData = [];
        if ($latestKrs) {
            foreach ($latestKrs->detailKrs as $detail) {
                $kelas = $detail->kelas;
                if (! $kelas) {
                    continue;
                }

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
                        'persentase' => $persentase,
                    ];
                }
            }
        }

        $isProfileLengkap = $mahasiswa->alamat && $mahasiswa->no_hp && $mahasiswa->agama && $mahasiswa->nama_ayah && $mahasiswa->nama_ibu && $mahasiswa->no_telp_ayah && $mahasiswa->no_telp_ibu && $mahasiswa->foto;

        return Inertia::render('Mahasiswa/Index', [
            'ipData' => $ipData,
            'sksData' => $sksData,
            'currentIpk' => $currentIpk,
            'attendanceData' => $attendanceData,
            'registrasiUlang' => $registrasiUlang,
            'isProfileLengkap' => (bool) $isProfileLengkap,
        ]);
    }

    public function store_registrasi_ulang(Request $request)
    {
        $user = auth()->user();
        if (! $user || ! $user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $mahasiswa = $user->mahasiswa;

        if (! $mahasiswa || $mahasiswa->status !== 'aktif') {
            return back()->with('error', 'Registrasi ulang hanya tersedia untuk mahasiswa aktif.');
        }

        $validated = $request->validate([
            'status_semester' => 'required|in:aktif,cuti',
            'keterangan' => 'nullable|required_if:status_semester,cuti|string|max:500',
            'alamat' => 'nullable|string|max:255',
            'no_hp' => 'nullable|string|max:20',
            'agama' => 'nullable|string|max:50',
            'nama_ayah' => 'nullable|string|max:255',
            'nama_ibu' => 'nullable|string|max:255',
            'no_telp_ayah' => 'nullable|string|max:15',
            'no_telp_ibu' => 'nullable|string|max:15',
        ], [
            'status_semester.required' => 'Pilih status semester terlebih dahulu.',
            'status_semester.in' => 'Status semester tidak valid.',
            'keterangan.required_if' => 'Keterangan wajib diisi jika memilih cuti.',
            'keterangan.max' => 'Keterangan maksimal 500 karakter.',
        ]);

        $periode = PeriodeRegistrasi::getPeriodeAktif();

        if (! $periode) {
            return back()->with('error', 'Belum ada periode registrasi aktif.');
        }

        $alreadyRegistered = RegistrasiSemester::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->where('tahun_ajaran', $periode->tahun_ajaran)
            ->where('jenis_semester', $periode->jenis_semester)
            ->exists();

        if ($alreadyRegistered) {
            return back()->with('error', 'Anda sudah melakukan registrasi ulang untuk periode ini.');
        }

        $profileFields = [
            'alamat',
            'no_hp',
            'agama',
            'nama_ayah',
            'nama_ibu',
            'no_telp_ayah',
            'no_telp_ibu',
        ];
        $profileData = [];
        foreach ($profileFields as $field) {
            $profileData[$field] = array_key_exists($field, $validated)
                ? $validated[$field]
                : $mahasiswa->{$field};
        }

        $mahasiswa->update($profileData);

        RegistrasiSemester::create([
            'id_mahasiswa' => $mahasiswa->id_mahasiswa,
            'tahun_ajaran' => $periode->tahun_ajaran,
            'jenis_semester' => $periode->jenis_semester,
            'semester' => $this->getNextRegistrasiSemester($mahasiswa->id_mahasiswa),
            'status_semester' => $validated['status_semester'],
            'tanggal_registrasi' => now(),
            'keterangan' => ($validated['keterangan'] ?? null) ?: 'Registrasi ulang mandiri mahasiswa.',
        ]);

        return back()->with('success', 'Registrasi ulang semester berhasil disimpan.');
    }

    public function registrasi()
    {
        $user = auth()->user();
        if (! $user || ! $user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $mahasiswa = $user->mahasiswa()->with('prodi')->first();

        return Inertia::render('Mahasiswa/Registrasi', [
            'mahasiswa' => [
                'nama' => $mahasiswa->nama ?? '',
                'nim' => $mahasiswa->nim ?? '',
                'alamat' => $mahasiswa->alamat ?? '',
                'prodi' => $mahasiswa->prodi?->nama_prodi ?? '',
                'jurusan' => $mahasiswa->prodi?->nama_prodi ?? '',
                'no_hp' => $mahasiswa->no_hp ?? '',
                'agama' => $mahasiswa->agama ?? '',
                'nama_ayah' => $mahasiswa->nama_ayah ?? '',
                'nama_ibu' => $mahasiswa->nama_ibu ?? '',
                'no_telp_ayah' => $mahasiswa->no_telp_ayah ?? '',
                'no_telp_ibu' => $mahasiswa->no_telp_ibu ?? '',
            ],
            'registrasiUlang' => $this->getRegistrasiUlangInfo($mahasiswa),
        ]);
    }

    public function nilai()
    {
        $user = auth()->user();
        if (! $user || ! $user->isMahasiswa()) {
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

                    $nilaiHuruf = $nilai ? ($nilai->nilai_huruf ?: '-') : '-';
                    $bobot = $bobotMap[$nilaiHuruf] ?? 0;

                    if ($nilaiHuruf !== '-' && $nilaiHuruf !== null) {
                        if ($mk->sks) {
                            $totalBobotSemester += $bobot * $mk->sks;
                            $totalSksSemester += $mk->sks;

                            $totalBobotKumulatif += $bobot * $mk->sks;
                            $totalSksKumulatif += $mk->sks;
                        }
                    }

                    $mataKuliahArr[] = [
                        'nama' => $mk->nama_matkul,
                        'bobot' => $mk->sks,
                        'tugas' => $nilai ? floatval($nilai->nilai_tugas) : 0,
                        'uts' => $nilai ? floatval($nilai->nilai_uts) : 0,
                        'uas' => $nilai ? floatval($nilai->nilai_uas) : 0,
                        'total' => $nilai ? floatval($nilai->nilai_akhir) : 0,
                        'grade' => $nilaiHuruf,
                    ];
                }
            }

            $ipkSemester = $totalSksSemester > 0 ? number_format($totalBobotSemester / $totalSksSemester, 2) : '0.00';
            $ipkKumulatif = $totalSksKumulatif > 0 ? number_format($totalBobotKumulatif / $totalSksKumulatif, 2) : '0.00';

            if (count($mataKuliahArr) > 0) {
                $semesters[] = [
                    'id' => intval($krs->semester),
                    'ipkSemester' => $ipkSemester,
                    'ipkKumulatif' => $ipkKumulatif,
                    'totalSks' => $totalSksSemester,
                    'mata_kuliah' => $mataKuliahArr,
                ];
            }
        }

        return Inertia::render('Mahasiswa/Nilai', [
            'semesters' => $semesters,
        ]);
    }

    public function penjadwalan()
    {
        $user = auth()->user();
        if (! $user || ! $user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $mahasiswa = $user->mahasiswa;
        $periodeTerakhir = PeriodeRegistrasi::getPeriodeTerakhir();

        $krsList = \App\Models\Krs::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->where('status', 'approved')
            ->when($periodeTerakhir, function ($query) use ($periodeTerakhir) {
                $query->where('tahun_ajaran', $periodeTerakhir->tahun_ajaran)
                    ->whereHas('detailKrs.kelas.mataKuliahPeriode', function ($q) use ($periodeTerakhir) {
                        $q->where('tahun_ajaran', $periodeTerakhir->tahun_ajaran)
                            ->where('jenis_semester', $periodeTerakhir->jenis_semester);
                    });
            }, fn ($query) => $query->whereRaw('1 = 0'))
            ->with(['detailKrs.kelas.mataKuliahPeriode.mataKuliah', 'detailKrs.kelas.dosen', 'detailKrs.kelas.ruangan'])
            ->orderBy('semester', 'asc')
            ->get();

        $semesters = [];

        foreach ($krsList as $krs) {
            $jadwalArr = [];

            foreach ($krs->detailKrs as $detail) {
                if ($detail->kelas && $detail->kelas->mataKuliahPeriode && $detail->kelas->mataKuliahPeriode->mataKuliah) {
                    $kelas = $detail->kelas;
                    if (! $this->kelasPadaPeriode($kelas, $periodeTerakhir)) {
                        continue;
                    }

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
                        'ruang' => $kelas->ruangan?->kode_ruangan ?? $kelas->ruang_kelas ?? '-',
                        'sks' => $mk->sks,
                        'kelas' => $kelas->nama_kelas,
                        'rps' => false, // Hardcoded for now unless rps is added to model
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
                    'mata_kuliah' => $jadwalArr,
                ];
            }
        }

        return Inertia::render('Mahasiswa/Penjadwalan', [
            'semesters' => $semesters,
        ]);
    }

    public function krs()
    {
        $user = auth()->user();
        if (! $user || ! $user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $mahasiswa = $user->mahasiswa;
        $context = $this->getKrsContext($mahasiswa);
        $sksLimit = $this->getKrsSksLimit($mahasiswa, $context['registrasi']);

        $latestKrs = $context['currentKrs'];
        $latestKrs?->load(['detailKrs.kelas.mataKuliahPeriode.mataKuliah', 'detailKrs.kelas.dosen', 'detailKrs.kelas.ruangan']);

        $mataKuliahArr = [];
        $semesterAktif = 'Belum ada periode registrasi';

        if ($context['periode'] && $context['registrasi']) {
            $semesterAktif = "Semester {$context['registrasi']->semester} (" .
                ucfirst($context['periode']->jenis_semester) .
                " {$context['periode']->tahun_ajaran})";
        }

        if ($latestKrs) {
            $semesterAktif .= ' - Status: ' . ucfirst($latestKrs->status);

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
                        'ruang' => $kelas->ruangan?->kode_ruangan ?? $kelas->ruang_kelas ?? '-',
                        'sks' => $mk->sks,
                    ];
                }
            }
        }

        return Inertia::render('Mahasiswa/Krs', [
            'semesterAktif' => $semesterAktif,
            'krsStatus' => $latestKrs ? clone $latestKrs : null,
            'mataKuliah' => $mataKuliahArr,
            'canFillKrs' => $this->mahasiswaCanEditKrs($context),
            'canSubmitKrs' => $this->mahasiswaCanEditKrs($context) && $latestKrs && $latestKrs->detailKrs->isNotEmpty(),
            'krsMessage' => $context['message'],
            'sksLimit' => array_merge($sksLimit, [
                'total_sks' => $latestKrs ? (int) $latestKrs->total_sks : 0,
                'sisa_sks' => $latestKrs ? max(0, $sksLimit['maksimal_sks'] - (int) $latestKrs->total_sks) : $sksLimit['maksimal_sks'],
            ]),
        ]);
    }

    public function absensi()
    {
        $user = auth()->user();
        if (! $user || ! $user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $mahasiswa = $user->mahasiswa;
        $periodeTerakhir = PeriodeRegistrasi::getPeriodeTerakhir();

        $krsList = \App\Models\Krs::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->where('status', 'approved')
            ->when($periodeTerakhir, function ($query) use ($periodeTerakhir) {
                $query->where('tahun_ajaran', $periodeTerakhir->tahun_ajaran)
                    ->whereHas('detailKrs.kelas.mataKuliahPeriode', function ($q) use ($periodeTerakhir) {
                        $q->where('tahun_ajaran', $periodeTerakhir->tahun_ajaran)
                            ->where('jenis_semester', $periodeTerakhir->jenis_semester);
                    });
            }, fn ($query) => $query->whereRaw('1 = 0'))
            ->orderBy('semester', 'asc')
            ->with([
                'detailKrs.kelas.mataKuliahPeriode.mataKuliah',
                'detailKrs.kelas.dosen',
                'detailKrs.kelas.pertemuans.absensis' => function ($query) use ($mahasiswa) {
                    $query->where('id_mahasiswa', $mahasiswa->id_mahasiswa);
                },
            ])
            ->get();

        $semesters = [];

        foreach ($krsList as $krs) {
            $mata_kuliah = [];

            foreach ($krs->detailKrs as $detail) {
                $kelas = $detail->kelas;
                if (! $kelas) {
                    continue;
                }

                $mkp = $kelas->mataKuliahPeriode;
                if (! $this->kelasPadaPeriode($kelas, $periodeTerakhir)) {
                    continue;
                }

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
                        'persen' => $persen,
                    ];
                }
            }

            $semesters[] = [
                'id' => $krs->semester,
                'totalSks' => $krs->total_sks,
                'mata_kuliah' => $mata_kuliah,
            ];
        }

        return Inertia::render('Mahasiswa/Absensi', [
            'semesters' => $semesters,
        ]);
    }

    public function profile()
    {
        $user = auth()->user();
        if (! $user || ! $user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $mahasiswa = $user->mahasiswa()->with('prodi')->first();

        return Inertia::render('Mahasiswa/Profile', [
            'mahasiswa' => [
                'nama' => $mahasiswa->nama ?? '-',
                'nim' => $mahasiswa->nim ?? '-',
                'alamat' => $mahasiswa->alamat ?? '-',
                'prodi' => $mahasiswa->prodi ? $mahasiswa->prodi->nama_prodi : '-',
                'jurusan' => $mahasiswa->prodi ? $mahasiswa->prodi->nama_prodi : '-',
                'no_hp' => $mahasiswa->no_hp ?? '-',
                'foto' => $mahasiswa->foto_url ?? '/profile.png',
                'agama' => $mahasiswa->agama ?? '-',
                'nama_ayah' => $mahasiswa->nama_ayah ?? '-',
                'nama_ibu' => $mahasiswa->nama_ibu ?? '-',
                'no_telp_ayah' => $mahasiswa->no_telp_ayah ?? '-',
                'no_telp_ibu' => $mahasiswa->no_telp_ibu ?? '-'
            ]
        ]);
    }

    public function tambah_krs()
    {
        $user = auth()->user();
        if (! $user || ! $user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $mahasiswa = $user->mahasiswa;
        $context = $this->getKrsContext($mahasiswa);

        if (! $context['canFillKrs']) {
            return redirect()
                ->route('mahasiswa.krs')
                ->with('error', $context['message']);
        }

        if ($context['currentKrs'] && ! $context['currentKrs']->isDraft()) {
            return redirect()
                ->route('mahasiswa.krs')
                ->with('error', 'KRS sudah diajukan atau dikunci. Hubungi dosen wali untuk membuka kunci KRS.');
        }

        $registrasi = $context['registrasi'];
        $periode = $context['periode'];
        $sksLimit = $this->getKrsSksLimit($mahasiswa, $registrasi);
        $currentTotalSks = $context['currentKrs'] ? (int) $context['currentKrs']->total_sks : 0;
        $selectedKelasIds = $context['currentKrs']
            ? $context['currentKrs']->detailKrs()->pluck('id_kelas')->map(fn ($id) => (int) $id)->all()
            : [];

        $kelas = Kelas::with(['mataKuliahPeriode.mataKuliah', 'dosen', 'ruangan'])
            ->withCount('detailKrs')
            ->whereHas('mataKuliahPeriode', function ($query) use ($mahasiswa, $registrasi, $periode) {
                $query->where('tahun_ajaran', $periode->tahun_ajaran)
                    ->where('jenis_semester', $periode->jenis_semester)
                    ->where('kode_prodi', $mahasiswa->kode_prodi)
                    ->where('semester_ditawarkan', $registrasi->semester);
            })
            ->orderBy('hari')
            ->orderBy('jam_mulai')
            ->get()
            ->map(fn ($kelas) => [
                'id_kelas' => $kelas->id_kelas,
                'nama_kelas' => $kelas->nama_kelas,
                'kode_matkul' => $kelas->mataKuliahPeriode?->mataKuliah?->kode_matkul,
                'nama_matkul' => $kelas->mataKuliahPeriode?->mataKuliah?->nama_matkul,
                'sks' => $kelas->mataKuliahPeriode?->mataKuliah?->sks,
                'dosen' => $kelas->dosen?->nama ?? 'Belum Ditentukan',
                'hari' => $kelas->hari,
                'jam' => ($kelas->jam_mulai && $kelas->jam_selesai)
                    ? $kelas->jam_mulai->format('H:i') . '-' . $kelas->jam_selesai->format('H:i')
                    : '-',
                'ruang' => $kelas->ruangan?->kode_ruangan ?? $kelas->ruang_kelas ?? '-',
                'kapasitas' => $kelas->kapasitas,
                'jumlah_mahasiswa' => $kelas->detail_krs_count,
                'sisa_slot' => max(0, $kelas->kapasitas - $kelas->detail_krs_count),
            ]);

        return Inertia::render('Mahasiswa/FormKrs', [
            'kelas' => $kelas,
            'selectedKelasIds' => $selectedKelasIds,
            'semester' => $registrasi->semester,
            'periode' => [
                'tahun_ajaran' => $periode->tahun_ajaran,
                'jenis_semester' => ucfirst($periode->jenis_semester),
            ],
            'sksLimit' => array_merge($sksLimit, [
                'total_sks' => $currentTotalSks,
                'sisa_sks' => max(0, $sksLimit['maksimal_sks'] - $currentTotalSks),
            ]),
        ]);
    }

    public function store_krs_item(Request $request, Kelas $kelas)
    {
        $user = auth()->user();
        if (! $user || ! $user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $mahasiswa = $user->mahasiswa;
        $context = $this->getKrsContext($mahasiswa);

        if (! $context['canFillKrs']) {
            return back()->with('error', $context['message']);
        }

        $kelas->load('mataKuliahPeriode.mataKuliah');
        $registrasi = $context['registrasi'];
        $periode = $context['periode'];

        if (! $this->kelasSesuaiKrs($kelas, $mahasiswa, $registrasi, $periode)) {
            return back()->with('error', 'Kelas tidak tersedia untuk periode, prodi, atau semester Anda.');
        }

        if ($kelas->detailKrs()->count() >= $kelas->kapasitas) {
            return back()->with('error', 'Kapasitas kelas sudah penuh.');
        }

        $sksLimit = $this->getKrsSksLimit($mahasiswa, $registrasi);

        DB::transaction(function () use ($mahasiswa, $registrasi, $periode, $kelas, $sksLimit) {
            $krs = Krs::firstOrCreate(
                [
                    'id_mahasiswa' => $mahasiswa->id_mahasiswa,
                    'semester' => $registrasi->semester,
                    'tahun_ajaran' => $periode->tahun_ajaran,
                ],
                [
                    'tanggal_pengisian' => now(),
                    'status' => 'draft',
                ]
            );

            if (! $krs->isDraft()) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'kelas' => 'KRS sudah diajukan atau dikunci. Hubungi dosen wali untuk membuka kunci KRS.',
                ]);
            }

            $alreadySelected = DetailKrs::where('id_krs', $krs->id_krs)
                ->where('id_kelas', $kelas->id_kelas)
                ->exists();

            if ($alreadySelected) {
                return;
            }

            $sameCourseSelected = DetailKrs::where('id_krs', $krs->id_krs)
                ->whereHas('kelas.mataKuliahPeriode', function ($query) use ($kelas) {
                    $query->where('kode_matkul', $kelas->mataKuliahPeriode->kode_matkul);
                })
                ->exists();

            if ($sameCourseSelected) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'kelas' => 'Mata kuliah ini sudah dipilih di kelas lain.',
                ]);
            }

            $currentSks = (int) $krs->total_sks;
            $kelasSks = (int) ($kelas->mataKuliahPeriode?->mataKuliah?->sks ?? 0);

            if ($currentSks + $kelasSks > $sksLimit['maksimal_sks']) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'kelas' => "Maksimal pengambilan KRS Anda {$sksLimit['maksimal_sks']} SKS berdasarkan IPS semester sebelumnya. Total SKS akan menjadi " . ($currentSks + $kelasSks) . ' SKS.',
                ]);
            }

            DetailKrs::create([
                'id_krs' => $krs->id_krs,
                'id_kelas' => $kelas->id_kelas,
            ]);
        });

        return back()->with('success', 'Kelas berhasil ditambahkan ke KRS.');
    }

    public function submit_krs()
    {
        $user = auth()->user();
        if (! $user || ! $user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $mahasiswa = $user->mahasiswa;
        $context = $this->getKrsContext($mahasiswa);

        if (! $context['canFillKrs']) {
            return redirect()
                ->route('mahasiswa.krs')
                ->with('error', $context['message']);
        }

        $krs = $context['currentKrs'];

        if (! $krs) {
            return redirect()
                ->route('mahasiswa.krs')
                ->with('error', 'Tambahkan mata kuliah terlebih dahulu sebelum mengajukan KRS.');
        }

        if (! $krs->isDraft()) {
            return redirect()
                ->route('mahasiswa.krs')
                ->with('error', 'KRS sudah diajukan atau dikunci. Hubungi dosen wali untuk membuka kunci KRS.');
        }

        if (! $krs->detailKrs()->exists()) {
            return redirect()
                ->route('mahasiswa.krs')
                ->with('error', 'Tambahkan minimal satu mata kuliah sebelum mengajukan KRS.');
        }

        $krs->update([
            'status' => 'pending',
            'tanggal_pengisian' => now(),
        ]);

        return redirect()
            ->route('mahasiswa.krs')
            ->with('success', 'KRS berhasil diajukan dan dikunci. Tunggu persetujuan dosen wali.');
    }

    public function destroy_krs_item(DetailKrs $detailKrs)
    {
        $user = auth()->user();
        if (! $user || ! $user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $detailKrs->load('krs');

        if (! $detailKrs->krs || $detailKrs->krs->id_mahasiswa !== $user->mahasiswa->id_mahasiswa) {
            abort(403, 'Unauthorized access');
        }

        if (! $detailKrs->krs->isDraft()) {
            return back()->with('error', 'KRS sudah diajukan atau dikunci. Hubungi dosen wali untuk membuka kunci KRS.');
        }

        $detailKrs->delete();

        return back()->with('success', 'Mata kuliah berhasil dihapus dari KRS.');
    }

    private function getKrsContext($mahasiswa): array
    {
        $periode = PeriodeRegistrasi::getPeriodeTerakhir();

        if (! $periode) {
            return [
                'periode' => null,
                'registrasi' => null,
                'jadwal' => null,
                'currentKrs' => null,
                'canFillKrs' => false,
                'message' => 'Belum ada periode registrasi.',
            ];
        }

        $registrasi = RegistrasiSemester::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->where('tahun_ajaran', $periode->tahun_ajaran)
            ->where('jenis_semester', $periode->jenis_semester)
            ->latest('tanggal_registrasi')
            ->latest('id_registrasi')
            ->first();

        $currentKrs = null;
        if ($registrasi) {
            $currentKrs = Krs::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
                ->where('tahun_ajaran', $periode->tahun_ajaran)
                ->where('semester', $registrasi->semester)
                ->first();
        }

        if (! $registrasi) {
            return [
                'periode' => $periode,
                'registrasi' => null,
                'jadwal' => null,
                'currentKrs' => null,
                'canFillKrs' => false,
                'message' => 'Anda belum melakukan registrasi semester pada periode terbaru.',
            ];
        }

        if ($registrasi->status_semester !== 'aktif') {
            return [
                'periode' => $periode,
                'registrasi' => $registrasi,
                'jadwal' => null,
                'currentKrs' => $currentKrs,
                'canFillKrs' => false,
                'message' => 'Status semester Anda bukan aktif.',
            ];
        }

        $jadwal = JadwalPengisianKrs::where('kode_prodi', $mahasiswa->kode_prodi)
            ->where('tahun_ajaran', $periode->tahun_ajaran)
            ->whereDate('tanggal_mulai', '<=', now())
            ->whereDate('tanggal_selesai', '>=', now())
            ->where(function ($query) use ($registrasi) {
                $query->whereJsonContains('semester_list', (int) $registrasi->semester)
                    ->orWhereJsonContains('semester_list', (string) $registrasi->semester);
            })
            ->first();

        if (! $jadwal) {
            return [
                'periode' => $periode,
                'registrasi' => $registrasi,
                'jadwal' => null,
                'currentKrs' => $currentKrs,
                'canFillKrs' => false,
                'message' => 'Jadwal pengisian KRS untuk prodi dan semester Anda belum dibuka.',
            ];
        }

        return [
            'periode' => $periode,
            'registrasi' => $registrasi,
            'jadwal' => $jadwal,
            'currentKrs' => $currentKrs,
            'canFillKrs' => true,
            'message' => 'Jadwal pengisian KRS sedang dibuka.',
        ];
    }

    private function mahasiswaCanEditKrs(array $context): bool
    {
        return $context['canFillKrs']
            && (! $context['currentKrs'] || $context['currentKrs']->isDraft());
    }

    private function getRegistrasiUlangInfo($mahasiswa): array
    {
        $periode = PeriodeRegistrasi::getPeriodeAktif();
        $riwayat = RegistrasiSemester::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->orderByDesc('semester')
            ->orderByDesc('id_registrasi')
            ->get()
            ->map(fn ($item) => [
                'id_registrasi' => $item->id_registrasi,
                'semester' => $item->semester,
                'tahun_ajaran' => $item->tahun_ajaran,
                'jenis_semester' => ucfirst($item->jenis_semester),
                'status_semester' => $item->status_semester,
                'tanggal_registrasi' => $item->tanggal_registrasi?->format('d M Y'),
                'keterangan' => $item->keterangan,
            ])
            ->values();

        if (! $periode) {
            return [
                'periode' => null,
                'registrasi' => null,
                'next_semester' => $this->getNextRegistrasiSemester($mahasiswa->id_mahasiswa),
                'can_register' => false,
                'message' => 'Belum ada periode registrasi ulang yang sedang dibuka.',
                'riwayat' => $riwayat,
            ];
        }

        $registrasi = RegistrasiSemester::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->where('tahun_ajaran', $periode->tahun_ajaran)
            ->where('jenis_semester', $periode->jenis_semester)
            ->latest('tanggal_registrasi')
            ->latest('id_registrasi')
            ->first();

        if ($registrasi) {
            return [
                'periode' => [
                    'tahun_ajaran' => $periode->tahun_ajaran,
                    'jenis_semester' => ucfirst($periode->jenis_semester),
                    'tanggal_mulai' => $periode->tanggal_mulai?->format('d M Y'),
                    'tanggal_selesai' => $periode->tanggal_selesai?->format('d M Y'),
                ],
                'registrasi' => [
                    'semester' => $registrasi->semester,
                    'status_semester' => $registrasi->status_semester,
                    'tanggal_registrasi' => $registrasi->tanggal_registrasi?->format('d M Y'),
                    'keterangan' => $registrasi->keterangan,
                ],
                'next_semester' => $registrasi->semester,
                'can_register' => false,
                'message' => 'Anda sudah melakukan registrasi ulang untuk periode ini.',
                'riwayat' => $riwayat,
            ];
        }

        return [
            'periode' => [
                'tahun_ajaran' => $periode->tahun_ajaran,
                'jenis_semester' => ucfirst($periode->jenis_semester),
                'tanggal_mulai' => $periode->tanggal_mulai?->format('d M Y'),
                'tanggal_selesai' => $periode->tanggal_selesai?->format('d M Y'),
            ],
            'registrasi' => null,
            'next_semester' => $this->getNextRegistrasiSemester($mahasiswa->id_mahasiswa),
            'can_register' => $mahasiswa->status === 'aktif',
            'message' => $mahasiswa->status === 'aktif'
                ? 'Silakan lakukan registrasi ulang untuk periode aktif.'
                : 'Registrasi ulang hanya tersedia untuk mahasiswa aktif.',
            'riwayat' => $riwayat,
        ];
    }

    private function getNextRegistrasiSemester(int $idMahasiswa): int
    {
        $lastRegistrasi = RegistrasiSemester::where('id_mahasiswa', $idMahasiswa)
            ->orderByDesc('semester')
            ->first();

        return $lastRegistrasi ? ((int) $lastRegistrasi->semester + 1) : 1;
    }

    private function kelasSesuaiKrs(Kelas $kelas, $mahasiswa, RegistrasiSemester $registrasi, PeriodeRegistrasi $periode): bool
    {
        $mkPeriode = $kelas->mataKuliahPeriode;

        return $mkPeriode
            && $mkPeriode->tahun_ajaran === $periode->tahun_ajaran
            && $mkPeriode->jenis_semester === $periode->jenis_semester
            && $mkPeriode->kode_prodi === $mahasiswa->kode_prodi
            && (int) $mkPeriode->semester_ditawarkan === (int) $registrasi->semester;
    }

    private function kelasPadaPeriode(Kelas $kelas, ?PeriodeRegistrasi $periode): bool
    {
        $mkPeriode = $kelas->mataKuliahPeriode;

        return $periode
            && $mkPeriode
            && $mkPeriode->tahun_ajaran === $periode->tahun_ajaran
            && $mkPeriode->jenis_semester === $periode->jenis_semester;
    }

    private function getKrsSksLimit($mahasiswa, ?RegistrasiSemester $registrasi): array
    {
        $default = [
            'ips' => null,
            'maksimal_sks' => 24,
            'semester_referensi' => null,
            'keterangan' => 'Belum ada IPS semester sebelumnya. Jatah maksimal default 24 SKS.',
        ];

        if (! $registrasi) {
            return $default;
        }

        $currentSemester = (int) $registrasi->semester;

        if ($currentSemester <= 1) {
            return $default;
        }

        $riwayat = RiwayatAkademik::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
            ->whereNotNull('ips_semester')
            ->where('semester', '<', $currentSemester)
            ->orderByDesc('semester')
            ->orderByDesc('id_riwayat')
            ->first();

        if ($riwayat) {
            $ips = (float) $riwayat->ips_semester;

            return [
                'ips' => round($ips, 2),
                'maksimal_sks' => $this->getMaksimalSksByIps($ips),
                'semester_referensi' => (int) $riwayat->semester,
                'keterangan' => "Berdasarkan IPS semester {$riwayat->semester}.",
            ];
        }

        $calculatedIps = $this->hitungIpsSemesterTerakhir($mahasiswa->id_mahasiswa, $currentSemester);

        if ($calculatedIps['ips'] !== null) {
            return [
                'ips' => $calculatedIps['ips'],
                'maksimal_sks' => $this->getMaksimalSksByIps($calculatedIps['ips']),
                'semester_referensi' => $calculatedIps['semester'],
                'keterangan' => "Berdasarkan IPS semester {$calculatedIps['semester']}.",
            ];
        }

        return $default;
    }

    private function getMaksimalSksByIps(float $ips): int
    {
        if ($ips >= 3.25) {
            return 24;
        }

        if ($ips >= 3.00) {
            return 22;
        }

        if ($ips >= 2.50) {
            return 20;
        }

        return 18;
    }

    private function hitungIpsSemesterTerakhir(int $idMahasiswa, int $currentSemester): array
    {
        $bobotMap = [
            'A' => 4.00, 'A-' => 3.75, 'B+' => 3.50,
            'B' => 3.00, 'B-' => 2.75, 'C+' => 2.50,
            'C' => 2.00, 'D' => 1.00, 'E' => 0.00,
        ];

        $krsList = Krs::where('id_mahasiswa', $idMahasiswa)
            ->where('status', 'approved')
            ->where('semester', '<', $currentSemester)
            ->with(['detailKrs.kelas.mataKuliahPeriode.mataKuliah'])
            ->orderByDesc('semester')
            ->get();

        if ($krsList->isEmpty()) {
            return ['ips' => null, 'semester' => null];
        }

        foreach ($krsList as $krs) {
            $totalSks = 0;
            $totalBobot = 0;

            foreach ($krs->detailKrs as $detail) {
                $mk = $detail->kelas?->mataKuliahPeriode?->mataKuliah;
                if (! $mk || ! $mk->sks) {
                    continue;
                }

                $nilaiHuruf = NilaiMahasiswa::where('id_mahasiswa', $idMahasiswa)
                    ->where('id_kelas', $detail->id_kelas)
                    ->value('nilai_huruf');

                if (! $nilaiHuruf || $nilaiHuruf === '-') {
                    continue;
                }

                $totalSks += (int) $mk->sks;
                $totalBobot += ($bobotMap[$nilaiHuruf] ?? 0) * (int) $mk->sks;
            }

            if ($totalSks > 0) {
                return [
                    'ips' => round($totalBobot / $totalSks, 2),
                    'semester' => (int) $krs->semester,
                ];
            }
        }

        return ['ips' => null, 'semester' => null];
    }

    public function perbarui_data()
    {
        $user = auth()->user();
        if (! $user || ! $user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $mahasiswa = $user->mahasiswa()->with('prodi')->first();

        return Inertia::render('Mahasiswa/FormProfile', [
            'mahasiswa' => [
                'nama' => $mahasiswa->nama ?? '',
                'nim' => $mahasiswa->nim ?? '',
                'alamat' => $mahasiswa->alamat ?? '',
                'prodi' => $mahasiswa->prodi ? $mahasiswa->prodi->nama_prodi : '',
                'jurusan' => $mahasiswa->prodi ? $mahasiswa->prodi->nama_prodi : '',
                'no_hp' => $mahasiswa->no_hp ?? '',
                'agama' => $mahasiswa->agama ?? '',
                'nama_ayah' => $mahasiswa->nama_ayah ?? '',
                'nama_ibu' => $mahasiswa->nama_ibu ?? '',
                'no_telp_ayah' => $mahasiswa->no_telp_ayah ?? '',
                'no_telp_ibu' => $mahasiswa->no_telp_ibu ?? '',
                'foto' => $mahasiswa->foto,
                'foto_url' => $mahasiswa->foto_url,
            ]
        ]);
    }

    public function update_profile(\Illuminate\Http\Request $request)
    {
        $user = auth()->user();
        if (! $user || ! $user->isMahasiswa()) {
            abort(403, 'Unauthorized access');
        }

        $validated = $request->validate([
            'alamat' => 'nullable|string|max:255',
            'no_hp' => 'nullable|string|max:20',
            'agama' => 'nullable|string|max:50',
            'nama_ayah' => 'nullable|string|max:255',
            'nama_ibu' => 'nullable|string|max:255',
            'no_telp_ayah' => 'nullable|string|max:15',
            'no_telp_ibu' => 'nullable|string|max:15',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'hapus_foto' => 'nullable|boolean',
        ]);

        $mahasiswa = $user->mahasiswa;
        if ($mahasiswa) {
            $data = $validated;
            unset($data['hapus_foto']);
            
            if ($request->hasFile('foto')) {
                if ($mahasiswa->foto) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($mahasiswa->foto);
                }
                $data['foto'] = $request->file('foto')->store('mahasiswa', 'public');
            } elseif ($request->boolean('hapus_foto')) {
                if ($mahasiswa->foto) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($mahasiswa->foto);
                }
                $data['foto'] = null;
            } else {
                unset($data['foto']);
            }

            $mahasiswa->update($data);
        }

        return redirect()->route('mahasiswa.profile')->with('success', 'Profil berhasil diperbarui!');
    }

    public function ganti_password()
    {
        return Inertia::render('Mahasiswa/GantiPassword');
    }
}
