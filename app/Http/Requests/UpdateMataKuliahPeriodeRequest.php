<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMataKuliahPeriodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'semester_ditawarkan' => 'required|integer|min:1|max:14',
            'kuota' => 'required|integer|min:10|max:200',
            'is_available' => 'boolean',
            'catatan' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'semester_ditawarkan.required' => 'Semester ditawarkan wajib diisi',
            'kuota.required' => 'Kuota wajib diisi',
        ];
    }
}
