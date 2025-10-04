<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Kelas;

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
            'ruang_kelas' => 'required|string|max:20',
            'hari' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'kapasitas' => 'required|integer|min:20|max:100',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Validasi bentrok dosen
            $bentrokDosen = Kelas::where('id_dosen', $this->id_dosen)
                ->where('hari', $this->hari)
                ->where(function($q) {
                    $q->whereBetween('jam_mulai', [$this->jam_mulai, $this->jam_selesai])
                      ->orWhereBetween('jam_selesai', [$this->jam_mulai, $this->jam_selesai])
                      ->orWhere(function($q) {
                          $q->where('jam_mulai', '<=', $this->jam_mulai)
                            ->where('jam_selesai', '>=', $this->jam_selesai);
                      });
                })
                ->exists();

            if ($bentrokDosen) {
                $validator->errors()->add('jadwal', 'Dosen sudah mengajar di waktu yang sama');
            }

            // Validasi bentrok ruangan
            $bentrokRuangan = Kelas::where('ruang_kelas', $this->ruang_kelas)
                ->where('hari', $this->hari)
                ->where(function($q) {
                    $q->whereBetween('jam_mulai', [$this->jam_mulai, $this->jam_selesai])
                      ->orWhereBetween('jam_selesai', [$this->jam_mulai, $this->jam_selesai])
                      ->orWhere(function($q) {
                          $q->where('jam_mulai', '<=', $this->jam_mulai)
                            ->where('jam_selesai', '>=', $this->jam_selesai);
                      });
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
            'ruang_kelas.required' => 'Ruang kelas wajib diisi',
            'hari.required' => 'Hari wajib dipilih',
            'jam_mulai.required' => 'Jam mulai wajib diisi',
            'jam_selesai.required' => 'Jam selesai wajib diisi',
            'jam_selesai.after' => 'Jam selesai harus lebih besar dari jam mulai',
            'kapasitas.required' => 'Kapasitas wajib diisi',
        ];
    }
}
