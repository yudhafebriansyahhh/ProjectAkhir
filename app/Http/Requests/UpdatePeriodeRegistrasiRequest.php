<?php

namespace App\Http\Requests\Baak;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePeriodeRegistrasiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
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
            'tanggal_mulai.required' => 'Tanggal mulai wajib diisi',
            'tanggal_mulai.before' => 'Tanggal mulai harus sebelum tanggal selesai',
            'tanggal_selesai.required' => 'Tanggal selesai wajib diisi',
            'tanggal_selesai.after' => 'Tanggal selesai harus setelah tanggal mulai',
        ];
    }
}
