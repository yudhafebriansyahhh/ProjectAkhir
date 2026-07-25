<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\DetailKrs;
use App\Models\JadwalPengisianKrs;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\NilaiMahasiswa;
use App\Models\PeriodeRegistrasi;
use App\Models\RegistrasiSemester;
use App\Models\RiwayatAkademik;
use App\Traits\MahasiswaHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class KrsController extends Controller
{
    use MahasiswaHelper;

    public function index()
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

        return Inertia::render('Mahasiswa/Krs/Krs', [
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

    public function create()
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

        return Inertia::render('Mahasiswa/Krs/FormKrs', [
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

    public function storeItem(Request $request, Kelas $kelas)
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

    public function submit()
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

    public function destroyItem(DetailKrs $detailKrs)
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

    // Helper Functions for KRS
    private function getKrsContext($mahasiswa): array
    {
        $periode = PeriodeRegistrasi::getPeriodeAktif();

        if (! $periode) {
            return [
                'periode' => null,
                'registrasi' => null,
                'jadwal' => null,
                'currentKrs' => null,
                'canFillKrs' => false,
                'message' => 'Belum ada periode registrasi aktif.',
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

    private function kelasSesuaiKrs(Kelas $kelas, $mahasiswa, RegistrasiSemester $registrasi, PeriodeRegistrasi $periode): bool
    {
        $mkPeriode = $kelas->mataKuliahPeriode;

        return $mkPeriode
            && $mkPeriode->tahun_ajaran === $periode->tahun_ajaran
            && $mkPeriode->jenis_semester === $periode->jenis_semester
            && $mkPeriode->kode_prodi === $mahasiswa->kode_prodi
            && (int) $mkPeriode->semester_ditawarkan === (int) $registrasi->semester;
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
}
