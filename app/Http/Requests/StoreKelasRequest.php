<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'jam_mulai' => 'required',
            'jam_selesai' => 'required|after:jam_mulai',
            'kapasitas' => 'required|integer|min:20|max:50',
        ];
    }

    public function messages(): array
    {
        return [
            'nama_kelas.required' => 'Nama kelas wajib diisi',
            'kode_matkul.required' => 'Mata kuliah wajib dipilih',
            'kode_matkul.exists' => 'Mata kuliah tidak ditemukan',
            'id_dosen.required' => 'Dosen pengampu wajib dipilih',
            'id_dosen.exists' => 'Dosen tidak ditemukan',
            'ruang_kelas.required' => 'Ruang kelas wajib diisi',
            'hari.required' => 'Hari wajib dipilih',
            'hari.in' => 'Hari tidak valid',
            'jam_mulai.required' => 'Jam mulai wajib diisi',
            'jam_mulai.date_format' => 'Format jam mulai tidak valid',
            'jam_selesai.required' => 'Jam selesai wajib diisi',
            'jam_selesai.date_format' => 'Format jam selesai tidak valid',
            'jam_selesai.after' => 'Jam selesai harus lebih besar dari jam mulai',
            'kapasitas.required' => 'Kapasitas kelas wajib diisi',
            'kapasitas.min' => 'Kapasitas minimal 20 mahasiswa',
            'kapasitas.max' => 'Kapasitas maksimal 50 mahasiswa',
        ];
    }
}
