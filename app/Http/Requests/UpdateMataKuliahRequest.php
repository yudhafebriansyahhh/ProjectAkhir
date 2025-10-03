<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMataKuliahRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_matkul' => 'required|string|max:100',
            'sks' => 'required|integer|min:1|max:6',
            'kode_prodi' => 'nullable|exists:prodi,kode_prodi',
            'kategori' => 'required|in:wajib,pilihan,umum',
            'deskripsi' => 'required|string|max:500',
            'is_active' => 'boolean',
        ];
    }
}
