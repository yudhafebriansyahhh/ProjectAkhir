import { Head, Link, useForm } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { FormCard, FormField } from '@/Components/ui/form-card';
import { PageHeader } from '@/Components/ui/data-display';
import { SelectDropdown } from '@/Components/ui/select-dropdown';

const getKategoriBadge = (kategori) => {
    const badges = {
        wajib: 'border-rose-200 bg-rose-50 text-rose-700',
        pilihan: 'border-blue-200 bg-blue-50 text-blue-700',
        umum: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    };

    return badges[kategori] || 'border-slate-200 bg-slate-50 text-slate-700';
};

export default function Edit({ pengaturan }) {
    const { data, setData, put, processing, errors } = useForm({
        semester_ditawarkan: pengaturan.semester_ditawarkan || '',
        catatan: pengaturan.catatan || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('baak.pengaturan-krs.update', pengaturan.id_mk_periode));
    };

    const getSemesterOptions = () => {
        if (pengaturan.jenis_semester === 'ganjil') return [1, 3, 5, 7];
        if (pengaturan.jenis_semester === 'genap') return [2, 4, 6, 8];
        return [1, 2, 3, 4, 5, 6, 7, 8];
    };

    const semesterOptions = getSemesterOptions().map((semester) => ({
        value: String(semester),
        label: `Semester ${semester}`,
    }));

    return (
        <BaakLayout title="Edit Pengaturan Mata Kuliah">
            <Head title="Edit Pengaturan Mata Kuliah" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 lg:px-6">
                <div className="mx-auto flex max-w-5xl flex-col gap-5">
                    <Link
                        href={route('baak.pengaturan-krs.index')}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Kembali ke Daftar
                    </Link>

                    <PageHeader
                        title="Edit Pengaturan Mata Kuliah"
                        description="Perbarui semester dan catatan pengaturan mata kuliah KRS."
                    />

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="p-4 sm:p-5">
                            <h3 className="text-sm font-semibold text-slate-700">Informasi Mata Kuliah</h3>
                            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <div>
                                    <p className="text-xs text-slate-500">Kode Mata Kuliah</p>
                                    <p className="font-mono font-semibold text-slate-950">
                                        {pengaturan.mata_kuliah?.kode_matkul || '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Nama Mata Kuliah</p>
                                    <p className="font-semibold text-slate-950">
                                        {pengaturan.mata_kuliah?.nama_matkul || '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Program Studi</p>
                                    <p className="font-semibold text-slate-950">{pengaturan.prodi?.nama_prodi || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">SKS</p>
                                    <p className="font-semibold text-slate-950">{pengaturan.mata_kuliah?.sks || 0} SKS</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Kategori</p>
                                    <Badge variant="outline" className={`mt-1 capitalize ${getKategoriBadge(pengaturan.mata_kuliah?.kategori)}`}>
                                        {pengaturan.mata_kuliah?.kategori || '-'}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Periode</p>
                                    <p className="font-semibold capitalize text-slate-950">
                                        {pengaturan.tahun_ajaran} - {pengaturan.jenis_semester}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <form onSubmit={handleSubmit}>
                        <FormCard
                            footer={
                                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                    <Link href={route('baak.pengaturan-krs.index')} className="w-full sm:w-auto">
                                        <Button type="button" variant="outline" className="w-full sm:w-auto">
                                            Batal
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                                        {processing ? 'Menyimpan...' : 'Update Data'}
                                    </Button>
                                </div>
                            }
                        >
                            <h3 className="mb-4 text-sm font-semibold text-slate-700">Detail yang Dapat Diubah</h3>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <FormField
                                    label="Semester Ditawarkan"
                                    required
                                    error={errors.semester_ditawarkan}
                                    hint={`Sebelumnya: Semester ${pengaturan.semester_ditawarkan}`}
                                >
                                    <SelectDropdown
                                        value={data.semester_ditawarkan ? String(data.semester_ditawarkan) : ''}
                                        onChange={(selected) => setData('semester_ditawarkan', selected ? selected.value : '')}
                                        options={semesterOptions}
                                        placeholder="Pilih Semester"
                                        isSearchable={false}
                                    />
                                </FormField>

                                <FormField label="Catatan (Opsional)" error={errors.catatan}>
                                    <input
                                        type="text"
                                        value={data.catatan}
                                        onChange={(e) => setData('catatan', e.target.value)}
                                        placeholder="Contoh: Khusus mahasiswa mengulang"
                                        maxLength={500}
                                        className={`h-10 w-full rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.catatan ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                </FormField>
                            </div>

                            <div className="mt-5 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                                <p className="mb-1 font-medium">Perhatian:</p>
                                <ul className="list-inside list-disc space-y-1">
                                    <li>Periode, prodi, dan mata kuliah tidak dapat diubah</li>
                                    <li>Semester hanya bisa dipilih sesuai jenis semester</li>
                                    <li>Pastikan tidak ada duplikasi semester untuk mata kuliah yang sama</li>
                                </ul>
                            </div>
                        </FormCard>
                    </form>
                </div>
            </div>
        </BaakLayout>
    );
}
