<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\PeriodeRegistrasi;
use App\Models\Mahasiswa;
use App\Models\RegistrasiSemester;
use Illuminate\Support\Facades\DB;

class ProcessExpiredRegistrasi extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'registrasi:process-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process unregistered active students and mark them as nonaktif when the registration period expires.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Temukan periode yang aktif tapi tanggal selesainya sudah lewat
        $expiredPeriods = PeriodeRegistrasi::where('status', 'aktif')
            ->whereDate('tanggal_selesai', '<', now())
            ->get();

        if ($expiredPeriods->isEmpty()) {
            $this->info('Tidak ada periode registrasi kedaluwarsa yang perlu diproses.');
            return;
        }

        foreach ($expiredPeriods as $periode) {
            $this->info("Memproses periode: {$periode->tahun_ajaran} - {$periode->jenis_semester}");
            
            DB::transaction(function () use ($periode) {
                // Ambil semua mahasiswa yang statusnya aktif
                $mahasiswas = Mahasiswa::where('status', 'aktif')->get();
                $processedCount = 0;

                foreach ($mahasiswas as $mhs) {
                    // Cek apakah mahasiswa ini sudah melakukan registrasi di periode ini
                    $sudahRegistrasi = RegistrasiSemester::where('id_mahasiswa', $mhs->id_mahasiswa)
                        ->where('tahun_ajaran', $periode->tahun_ajaran)
                        ->where('jenis_semester', $periode->jenis_semester)
                        ->exists();

                    if (!$sudahRegistrasi) {
                        // Tentukan semester ke berapa
                        $semesterBaru = $mhs->semester_ke + 1;

                        // Buat record registrasi nonaktif
                        RegistrasiSemester::create([
                            'id_mahasiswa' => $mhs->id_mahasiswa,
                            'tahun_ajaran' => $periode->tahun_ajaran,
                            'semester' => $semesterBaru,
                            'jenis_semester' => $periode->jenis_semester,
                            'status_semester' => 'nonaktif',
                            'tanggal_registrasi' => now(),
                            'keterangan' => 'Tidak melakukan registrasi'
                        ]);

                        // Update status mahasiswa menjadi nonaktif
                        $mhs->update(['status' => 'nonaktif']);
                        $processedCount++;
                    }
                }

                // Tutup periode tersebut
                $periode->update(['status' => 'tutup']);
                $this->info("Berhasil memproses $processedCount mahasiswa menjadi nonaktif.");
            });
        }
        
        $this->info('Proses selesai.');
    }
}
