<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMataKuliahPeriodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $mkPeriode = $this->route('pengaturan_kr');

        return [
            'semester_ditawarkan' => [
                'required',
                'integer',
                'min:1',
                'max:8',
                // Validasi unique: kecuali untuk record yang sedang diedit
                Rule::unique('mata_kuliah_periode')
                    ->where('kode_matkul', $mkPeriode->kode_matkul)
                    ->where('kode_prodi', $mkPeriode->kode_prodi)
                    ->where('tahun_ajaran', $mkPeriode->tahun_ajaran)
                    ->where('jenis_semester', $mkPeriode->jenis_semester)
                    ->ignore($mkPeriode->id_mk_periode, 'id_mk_periode')
            ],
            'catatan' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'semester_ditawarkan.required' => 'Semester wajib diisi',
            'semester_ditawarkan.max' => 'Semester maksimal 8',
            'semester_ditawarkan.unique' => 'Mata kuliah ini sudah ditawarkan di semester tersebut untuk periode yang sama',
            'catatan.max' => 'Catatan maksimal 500 karakter',
        ];
    }
}
