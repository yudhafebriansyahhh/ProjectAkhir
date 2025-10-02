<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRegistrasiSemesterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nim' => [
                'required',
                'exists:mahasiswa,nim'
            ],
            'tahun_ajaran' => 'required|string|max:10',
            'jenis_semester' => 'required|in:ganjil,genap',
            'status_semester' => 'required|in:aktif,cuti',
            'keterangan' => 'required|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'nim.required' => 'Mahasiswa harus dipilih',
            'nim.exists' => 'Mahasiswa tidak ditemukan',
            'keterangan.required' => 'Keterangan wajib diisi untuk registrasi manual',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Check duplikasi registrasi
            if ($this->nim && $this->tahun_ajaran && $this->jenis_semester) {
                $mahasiswa = \App\Models\Mahasiswa::where('nim', $this->nim)->first();

                if ($mahasiswa) {
                    $exists = \App\Models\RegistrasiSemester::where('id_mahasiswa', $mahasiswa->id_mahasiswa)
                        ->where('tahun_ajaran', $this->tahun_ajaran)
                        ->where('jenis_semester', $this->jenis_semester)
                        ->exists();

                    if ($exists) {
                        $validator->errors()->add('nim', 'Mahasiswa sudah registrasi untuk periode ini!');
                    }
                }
            }
        });
    }
}
