<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFakultasRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $fakultas = $this->route('fakultas'); // Get fakultas from route

        return [
            'kode_fakultas' => [
                'required',
                'string',
                'max:10',
                Rule::unique('fakultas', 'kode_fakultas')->ignore($fakultas, 'kode_fakultas')
            ],
            'nama_fakultas' => 'required|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'kode_fakultas.required' => 'Kode fakultas wajib diisi',
            'kode_fakultas.unique' => 'Kode fakultas sudah digunakan',
            'kode_fakultas.max' => 'Kode fakultas maksimal 10 karakter',
            'nama_fakultas.required' => 'Nama fakultas wajib diisi',
            'nama_fakultas.max' => 'Nama fakultas maksimal 100 karakter',
        ];
    }
}
