<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProdiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $prodi = $this->route('prodi'); // Get prodi from route

        return [
            'kode_prodi' => [
                'required',
                'string',
                'size:2',
                Rule::unique('prodi', 'kode_prodi')->ignore($prodi, 'kode_prodi')
            ],
            'nama_prodi' => 'required|string|max:100',
            'jenjang' => 'required|in:D3,D4,S1,S2,S3',
        ];
    }

    public function messages(): array
    {
        return [
            'kode_prodi.required' => 'Kode prodi wajib diisi',
            'kode_prodi.unique' => 'Kode prodi sudah digunakan',
            'kode_prodi.size' => 'Kode prodi harus 2 digit',
            'nama_prodi.required' => 'Nama prodi wajib diisi',
            'nama_prodi.max' => 'Nama prodi maksimal 100 karakter',
            'jenjang.required' => 'Jenjang wajib dipilih',
            'jenjang.in' => 'Jenjang tidak valid',
        ];
    }
}
