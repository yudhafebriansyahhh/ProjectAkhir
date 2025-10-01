<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDosenRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $dosen = $this->route('dosen');

        return [
            'nip' => [
                'required',
                'string',
                'max:20',
                Rule::unique('dosen', 'nip')->ignore($dosen, 'id_dosen')
            ],
            'nama' => 'required|string|max:100',
            'kode_prodi' => 'required|exists:prodi,kode_prodi',
            'jenis_kelamin' => 'required|in:Laki-laki,Perempuan',
            'alamat' => 'nullable|string',
            'no_hp' => 'nullable|string|max:15',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'nip.required' => 'NIP wajib diisi',
            'nip.unique' => 'NIP sudah digunakan',
            'nip.max' => 'NIP maksimal 20 karakter',
            'nama.required' => 'Nama dosen wajib diisi',
            'nama.max' => 'Nama maksimal 100 karakter',
            'kode_prodi.required' => 'Program studi wajib dipilih',
            'kode_prodi.exists' => 'Program studi tidak valid',
            'jenis_kelamin.required' => 'Jenis kelamin wajib dipilih',
            'jenis_kelamin.in' => 'Jenis kelamin tidak valid',
            'no_hp.max' => 'Nomor HP maksimal 15 karakter',
            'foto.image' => 'File harus berupa gambar',
            'foto.mimes' => 'Format foto harus jpg, jpeg, atau png',
            'foto.max' => 'Ukuran foto maksimal 2MB',
        ];
    }
}
