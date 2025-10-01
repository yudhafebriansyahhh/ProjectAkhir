<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMataKuliahRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'kode_matkul' => 'required|string|max:10|unique:mata_kuliah,kode_matkul|regex:/^[A-Z]{3}[0-9]{3}$/',
            'nama_matkul' => 'required|string|max:100',
            'sks' => 'required|integer|min:1|max:6',
            'semester' => 'required|integer|min:1|max:8',
            'deskripsi' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'kode_matkul.required' => 'Kode mata kuliah wajib diisi',
            'kode_matkul.unique' => 'Kode mata kuliah sudah digunakan',
            'kode_matkul.regex' => 'Format kode mata kuliah harus 3 huruf + 3 angka (contoh: TIF101)',
            'nama_matkul.required' => 'Nama mata kuliah wajib diisi',
            'nama_matkul.max' => 'Nama mata kuliah maksimal 100 karakter',
            'sks.required' => 'SKS wajib diisi',
            'sks.min' => 'SKS minimal 1',
            'sks.max' => 'SKS maksimal 6',
            'semester.required' => 'Semester wajib dipilih',
            'semester.min' => 'Semester minimal 1',
            'semester.max' => 'Semester maksimal 8',
        ];
    }
}
