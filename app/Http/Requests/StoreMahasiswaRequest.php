<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMahasiswaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama' => ['required', 'string', 'max:255'],
            'kode_prodi' => ['required', 'exists:prodi,kode_prodi'],
            'id_dosen_wali' => ['nullable', 'exists:dosen,id_dosen'],
            'tahun_masuk' => ['required', 'integer', 'min:2000', 'max:' . (date('Y') + 1)],
            'tanggal_lahir' => ['required', 'date', 'before:today'],
            'jenis_kelamin' => ['required', Rule::in(['Laki-laki', 'Perempuan'])],
            'alamat' => ['nullable', 'string', 'max:500'],
            'no_hp' => ['nullable', 'string', 'regex:/^[0-9]{10,15}$/', 'max:15'],
            'status' => ['required', Rule::in(['aktif', 'lulus', 'keluar', 'DO'])],
            'foto' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'nama.required' => 'Nama mahasiswa wajib diisi',
            'nama.max' => 'Nama maksimal 255 karakter',
            'kode_prodi.required' => 'Program studi wajib dipilih',
            'kode_prodi.exists' => 'Program studi tidak valid',
            'id_dosen_wali.exists' => 'Dosen wali tidak valid',
            'tahun_masuk.required' => 'Tahun masuk wajib diisi',
            'tahun_masuk.integer' => 'Tahun masuk harus berupa angka',
            'tahun_masuk.min' => 'Tahun masuk minimal 2000',
            'tahun_masuk.max' => 'Tahun masuk tidak valid',
            'tanggal_lahir.required' => 'Tanggal lahir wajib diisi',
            'tanggal_lahir.date' => 'Format tanggal lahir tidak valid',
            'tanggal_lahir.before' => 'Tanggal lahir harus sebelum hari ini',
            'jenis_kelamin.required' => 'Jenis kelamin wajib dipilih',
            'jenis_kelamin.in' => 'Jenis kelamin tidak valid',
            'alamat.max' => 'Alamat maksimal 500 karakter',
            'no_hp.regex' => 'Format nomor HP tidak valid (10-15 digit angka)',
            'no_hp.max' => 'Nomor HP maksimal 15 karakter',
            'status.required' => 'Status wajib dipilih',
            'status.in' => 'Status tidak valid',
            'foto.image' => 'File harus berupa gambar',
            'foto.mimes' => 'Format gambar harus jpeg, png, atau jpg',
            'foto.max' => 'Ukuran gambar maksimal 2MB',
        ];
    }

    protected function prepareForValidation()
    {
        // Sanitize nama - remove extra spaces
        if ($this->has('nama')) {
            $this->merge([
                'nama' => trim(preg_replace('/\s+/', ' ', $this->nama))
            ]);
        }

        // Sanitize no_hp - remove non-numeric characters except +
        if ($this->has('no_hp')) {
            $this->merge([
                'no_hp' => preg_replace('/[^0-9+]/', '', $this->no_hp)
            ]);
        }
    }
}
