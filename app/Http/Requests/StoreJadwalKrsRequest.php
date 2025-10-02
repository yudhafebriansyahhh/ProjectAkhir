<?php

namespace App\Http\Requests;

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
            'semester_list' => 'required|array|min:1',
            'semester_list.*' => 'integer|min:1|max:14',
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
            'semester_list.required' => 'Minimal pilih 1 semester',
            'semester_list.array' => 'Format semester tidak valid',
            'semester_list.min' => 'Minimal pilih 1 semester',
            'semester_list.*.integer' => 'Semester harus berupa angka',
            'semester_list.*.min' => 'Semester minimal 1',
            'semester_list.*.max' => 'Semester maksimal 14',
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
            // Cek duplikasi jadwal KRS untuk semester yang sama
            foreach ($this->semester_list as $semester) {
                $exists = \DB::table('jadwal_pengisian_krs')
                    ->where('kode_prodi', $this->kode_prodi)
                    ->where('tahun_ajaran', $this->tahun_ajaran)
                    ->whereRaw("JSON_CONTAINS(semester_list, '\"$semester\"')")
                    ->exists();

                if ($exists) {
                    $validator->errors()->add(
                        'semester_list',
                        "Jadwal KRS untuk semester $semester di prodi dan tahun ajaran ini sudah ada"
                    );
                    break;
                }
            }
        });
    }
}
