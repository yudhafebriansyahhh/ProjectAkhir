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
            'tahun_ajaran' => 'required|string|max:10',
            'jenis_semester' => 'required|in:ganjil,genap,pendek',
            'mata_kuliah' => 'required|array|min:1',
            'mata_kuliah.*.kode_matkul' => 'required|exists:mata_kuliah,kode_matkul',
            'mata_kuliah.*.semester_ditawarkan' => 'required|integer|min:1|max:14',
            'mata_kuliah.*.kuota' => 'required|integer|min:10|max:200',
            'mata_kuliah.*.is_available' => 'boolean',
            'mata_kuliah.*.catatan' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'tahun_ajaran.required' => 'Tahun ajaran wajib diisi',
            'jenis_semester.required' => 'Jenis semester wajib dipilih',
            'mata_kuliah.required' => 'Pilih minimal 1 mata kuliah',
            'mata_kuliah.*.semester_ditawarkan.required' => 'Semester ditawarkan wajib diisi',
            'mata_kuliah.*.semester_ditawarkan.min' => 'Semester minimal 1',
            'mata_kuliah.*.semester_ditawarkan.max' => 'Semester maksimal 14',
            'mata_kuliah.*.kuota.required' => 'Kuota wajib diisi',
            'mata_kuliah.*.kuota.min' => 'Kuota minimal 10',
            'mata_kuliah.*.kuota.max' => 'Kuota maksimal 200',
        ];
    }
}
