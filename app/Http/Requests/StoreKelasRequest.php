<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Kelas;
use App\Models\MataKuliahPeriode;

class StoreKelasRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_kelas' => 'required|string|max:10',
            'id_mk_periode' => 'required|exists:mata_kuliah_periode,id_mk_periode',
            'id_dosen' => 'required|exists:dosen,id_dosen',
            'id_ruangan' => 'required|exists:ruangan,id_ruangan',
            'hari' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'kapasitas' => 'required|integer|min:20|max:100',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $mkPeriode = MataKuliahPeriode::find($this->id_mk_periode);

            if (! $mkPeriode) {
                return;
            }

            // Validasi bentrok dosen
            $bentrokDosen = Kelas::where('id_dosen', $this->id_dosen)
                ->forPeriodeValue($mkPeriode->tahun_ajaran, $mkPeriode->jenis_semester)
                ->where('hari', $this->hari)
                ->where(function($q) {
                    $q->where('jam_mulai', '<', $this->jam_selesai)
                        ->where('jam_selesai', '>', $this->jam_mulai);
                })
                ->exists();

            if ($bentrokDosen) {
                $validator->errors()->add('jadwal', 'Dosen sudah mengajar di waktu yang sama');
            }

            // Validasi bentrok ruangan
            $bentrokRuangan = Kelas::where('id_ruangan', $this->id_ruangan)
                ->forPeriodeValue($mkPeriode->tahun_ajaran, $mkPeriode->jenis_semester)
                ->where('hari', $this->hari)
                ->where(function($q) {
                    $q->where('jam_mulai', '<', $this->jam_selesai)
                        ->where('jam_selesai', '>', $this->jam_mulai);
                })
                ->exists();

            if ($bentrokRuangan) {
                $validator->errors()->add('jadwal', 'Ruangan sudah digunakan di waktu yang sama');
            }
        });
    }

    public function messages(): array
    {
        return [
            'nama_kelas.required' => 'Nama kelas wajib diisi',
            'id_mk_periode.required' => 'Mata kuliah wajib dipilih',
            'id_dosen.required' => 'Dosen wajib dipilih',
            'id_ruangan.required' => 'Ruangan wajib dipilih',
            'id_ruangan.exists' => 'Ruangan tidak valid',
            'hari.required' => 'Hari wajib dipilih',
            'jam_mulai.required' => 'Jam mulai wajib diisi',
            'jam_selesai.required' => 'Jam selesai wajib diisi',
            'jam_selesai.after' => 'Jam selesai harus lebih besar dari jam mulai',
            'kapasitas.required' => 'Kapasitas wajib diisi',
        ];
    }
}
