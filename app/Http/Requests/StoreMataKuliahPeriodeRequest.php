<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMataKuliahPeriodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tahun_ajaran' => [
                'required',
                'string',
                'regex:/^\d{4}\/\d{4}$/',
                function ($attribute, $value, $fail) {
                    $parts = explode('/', $value);
                    if (count($parts) === 2) {
                        $year1 = (int)$parts[0];
                        $year2 = (int)$parts[1];
                        if ($year2 !== $year1 + 1) {
                            $fail('Tahun ajaran tidak valid. Tahun kedua harus tahun pertama + 1.');
                        }
                    }
                },
            ],
            'jenis_semester' => 'required|in:ganjil,genap,pendek',
            'kode_prodi' => 'required|exists:prodi,kode_prodi',
            'semester_ditawarkan' => 'required|integer|min:1|max:8',
            'mata_kuliah' => 'required|array|min:1',
            'mata_kuliah.*.kode_matkul' => 'required|exists:mata_kuliah,kode_matkul',
            'mata_kuliah.*.catatan' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'tahun_ajaran.required' => 'Tahun ajaran wajib diisi',
            'tahun_ajaran.regex' => 'Format tahun ajaran harus YYYY/YYYY',
            'kode_prodi.required' => 'Prodi wajib dipilih',
            'semester_ditawarkan.required' => 'Semester wajib dipilih',
            'semester_ditawarkan.max' => 'Semester maksimal 8',
            'mata_kuliah.required' => 'Pilih minimal 1 mata kuliah',
        ];
    }
}
