<?php

namespace App\Http\Requests\Baak;

use Illuminate\Foundation\Http\FormRequest;

class UpdateJadwalKrsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
        ];
    }

    public function messages(): array
    {
        return [
            'tanggal_mulai.required' => 'Tanggal mulai harus diisi',
            'tanggal_mulai.date' => 'Tanggal mulai tidak valid',
            'tanggal_selesai.required' => 'Tanggal selesai harus diisi',
            'tanggal_selesai.date' => 'Tanggal selesai tidak valid',
            'tanggal_selesai.after' => 'Tanggal selesai harus setelah tanggal mulai',
        ];
    }
}
