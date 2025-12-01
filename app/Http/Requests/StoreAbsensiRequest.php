<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAbsensiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_kelas' => 'required|exists:kelas,id_kelas',
            'pertemuan_ke' => 'required|integer|min:1|max:16',
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
            'id_kelas.required' => 'Kelas wajib dipilih',
            'id_kelas.exists' => 'Kelas tidak valid',
            'pertemuan_ke.required' => 'Pertemuan ke- wajib diisi',
            'pertemuan_ke.integer' => 'Pertemuan ke- harus berupa angka',
            'pertemuan_ke.min' => 'Pertemuan ke- minimal 1',
            'pertemuan_ke.max' => 'Pertemuan ke- maksimal 16',
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

    /**
     * Validation untuk cek duplikasi pertemuan
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $exists = \App\Models\Pertemuan::where('id_kelas', $this->id_kelas)
                ->where('pertemuan_ke', $this->pertemuan_ke)
                ->exists();

            if ($exists) {
                $validator->errors()->add(
                    'pertemuan_ke',
                    "Pertemuan ke-{$this->pertemuan_ke} sudah ada untuk kelas ini"
                );
            }
        });
    }
}
