<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePeriodeRegistrasiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tahun_ajaran' => [
                'required',
                'string',
                'regex:/^\d{4}\/\d{4}$/', // Format: 2024/2025
            ],
            'jenis_semester' => [
                'required',
                'in:ganjil,genap',
            ],
            'tanggal_mulai' => [
                'required',
                'date',
                'before:tanggal_selesai',
            ],
            'tanggal_selesai' => [
                'required',
                'date',
                'after:tanggal_mulai',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'tahun_ajaran.required' => 'Tahun ajaran wajib diisi',
            'tahun_ajaran.regex' => 'Format tahun ajaran tidak valid (contoh: 2024/2025)',
            'jenis_semester.required' => 'Jenis semester wajib dipilih',
            'jenis_semester.in' => 'Jenis semester harus Ganjil atau Genap',
            'tanggal_mulai.required' => 'Tanggal mulai wajib diisi',
            'tanggal_mulai.before' => 'Tanggal mulai harus sebelum tanggal selesai',
            'tanggal_selesai.required' => 'Tanggal selesai wajib diisi',
            'tanggal_selesai.after' => 'Tanggal selesai harus setelah tanggal mulai',
        ];
    }

    protected function prepareForValidation(): void
    {
        // Auto-format tahun ajaran jika user input tanpa slash
        if ($this->tahun_ajaran && !str_contains($this->tahun_ajaran, '/')) {
            $tahun = (int) $this->tahun_ajaran;
            $this->merge([
                'tahun_ajaran' => $tahun . '/' . ($tahun + 1),
            ]);
        }
    }
}
