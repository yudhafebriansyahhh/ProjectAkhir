<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRegistrasiSemesterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status_semester' => 'required|in:aktif,cuti',
            'keterangan' => 'nullable|string|max:500',
        ];
    }
}
