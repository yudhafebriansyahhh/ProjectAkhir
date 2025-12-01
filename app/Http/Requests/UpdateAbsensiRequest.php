<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAbsensiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tanggal' => 'required|date',
            'topik_pembahasan' => 'required|string|max:500',
            'mahasiswa' => 'required|array|min:1',
            'mahasiswa.*.id_mahasiswa' => 'required|exists:mahasiswa,id_mahasiswa',
            'mahasiswa.*.status' => 'required|in:hadir,izin,sakit,alpha',
        ];
    }

    public function messages(): array
    {
        return [
            'tanggal.required' => 'Tanggal wajib diisi',
            'tanggal.date' => 'Format tanggal tidak valid',
            'topik_pembahasan.required' => 'Topik pembahasan wajib diisi',
            'topik_pembahasan.max' => 'Topik pembahasan maksimal 500 karakter',
            'mahasiswa.required' => 'Data mahasiswa wajib diisi',
            'mahasiswa.array' => 'Data mahasiswa harus berupa array',
            'mahasiswa.min' => 'Minimal harus ada 1 mahasiswa',
            'mahasiswa.*.id_mahasiswa.required' => 'ID mahasiswa wajib diisi',
            'mahasiswa.*.id_mahasiswa.exists' => 'Mahasiswa tidak valid',
            'mahasiswa.*.status.required' => 'Status kehadiran wajib diisi',
            'mahasiswa.*.status.in' => 'Status kehadiran tidak valid (hadir/izin/sakit/alpha)',
        ];
    }
}
