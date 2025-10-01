<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMataKuliahRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'kode_matkul' => 'required|string|max:10|unique:mata_kuliah,kode_matkul',
            'nama_matkul' => 'required|string|max:100',
            'sks' => 'required|integer|min:1|max:6',
            'semester' => 'required|integer|min:1|max:8',
            'kode_prodi' => 'nullable|string|exists:prodi,kode_prodi',
            'kategori' => ['required', Rule::in(['wajib', 'pilihan', 'umum'])],
            'is_active' => 'boolean',
            'deskripsi' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'kode_matkul.required' => 'Kode mata kuliah wajib diisi',
            'kode_matkul.unique' => 'Kode mata kuliah sudah digunakan',
            'nama_matkul.required' => 'Nama mata kuliah wajib diisi',
            'sks.required' => 'SKS wajib diisi',
            'sks.min' => 'SKS minimal 1',
            'sks.max' => 'SKS maksimal 6',
            'semester.required' => 'Semester wajib diisi',
            'semester.min' => 'Semester minimal 1',
            'semester.max' => 'Semester maksimal 8',
            'kode_prodi.exists' => 'Program studi tidak ditemukan',
            'kategori.required' => 'Kategori wajib dipilih',
            'kategori.in' => 'Kategori tidak valid',
        ];
    }
}
