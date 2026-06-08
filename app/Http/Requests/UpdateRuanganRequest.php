<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRuanganRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $ruangan = $this->route('ruangan');
        $idRuangan = is_object($ruangan) ? $ruangan->id_ruangan : $ruangan;

        return [
            'kode_ruangan' => [
                'required',
                'string',
                'max:20',
                Rule::unique('ruangan', 'kode_ruangan')->ignore($idRuangan, 'id_ruangan'),
            ],
            'nama_ruangan' => ['required', 'string', 'max:100'],
            'gedung' => ['nullable', 'string', 'max:100'],
            'lantai' => ['nullable', 'integer', 'min:0', 'max:99'],
            'kapasitas' => ['nullable', 'integer', 'min:1', 'max:1000'],
            'keterangan' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'kode_ruangan.required' => 'Kode ruangan wajib diisi',
            'kode_ruangan.unique' => 'Kode ruangan sudah digunakan',
            'nama_ruangan.required' => 'Nama ruangan wajib diisi',
            'is_active.required' => 'Status ruangan wajib dipilih',
        ];
    }
}
