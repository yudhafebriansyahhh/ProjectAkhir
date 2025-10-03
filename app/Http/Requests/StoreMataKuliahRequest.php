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
            'kode_matkul' => 'required|string|max:10|unique:mata_kuliah,kode_matkul',
            'nama_matkul' => 'required|string|max:100',
            'sks' => 'required|integer|min:1|max:6',
            'kode_prodi' => 'nullable|exists:prodi,kode_prodi',
            'kategori' => 'required|in:wajib,pilihan,umum',
            'deskripsi' => 'required|string|max:500',
            'is_active' => 'boolean',
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
            'kategori.required' => 'Kategori wajib dipilih',
            'deskripsi.required' => 'Deskripsi wajib diisi',
        ];
    }
}
