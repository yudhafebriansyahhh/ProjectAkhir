<?php

namespace App\Http\Requests\Baak;

use Illuminate\Foundation\Http\FormRequest;

class StoreJadwalKrsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'kode_prodi' => 'required|exists:prodi,kode_prodi',
            'semester' => 'required|integer|min:1|max:14',
            'tahun_ajaran' => 'required|string|regex:/^\d{4}\/\d{4}$/',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
        ];
    }

    public function messages(): array
    {
        return [
            'kode_prodi.required' => 'Program Studi harus dipilih',
            'kode_prodi.exists' => 'Program Studi tidak valid',
            'semester.required' => 'Semester harus diisi',
            'semester.integer' => 'Semester harus berupa angka',
            'semester.min' => 'Semester minimal 1',
            'semester.max' => 'Semester maksimal 14',
            'tahun_ajaran.required' => 'Tahun Ajaran harus diisi',
            'tahun_ajaran.regex' => 'Format Tahun Ajaran harus YYYY/YYYY (contoh: 2024/2025)',
            'tanggal_mulai.required' => 'Tanggal mulai harus diisi',
            'tanggal_mulai.date' => 'Tanggal mulai tidak valid',
            'tanggal_selesai.required' => 'Tanggal selesai harus diisi',
            'tanggal_selesai.date' => 'Tanggal selesai tidak valid',
            'tanggal_selesai.after' => 'Tanggal selesai harus setelah tanggal mulai',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $exists = \DB::table('jadwal_pengisian_krs')
                ->where('kode_prodi', $this->kode_prodi)
                ->where('semester', $this->semester)
                ->where('tahun_ajaran', $this->tahun_ajaran)
                ->exists();

            if ($exists) {
                $validator->errors()->add(
                    'kode_prodi',
                    'Jadwal KRS untuk prodi, semester, dan tahun ajaran ini sudah ada'
                );
            }
        });
    }
}
