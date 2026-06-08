import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { FormCard, FormField } from '@/Components/ui/form-card';
import { PageHeader } from '@/Components/ui/data-display';

const oddSemesters = [1, 3, 5, 7, 9, 11, 13];
const evenSemesters = [2, 4, 6, 8, 10, 12, 14];
const allSemesters = Array.from({ length: 14 }, (_, index) => index + 1);

export default function Edit({ jadwalKrs }) {
    const initialSemesterList = (jadwalKrs.semester_list || []).map((semester) => Number(semester));
    const { data, setData, put, processing, errors } = useForm({
        semester_list: initialSemesterList,
        tanggal_mulai: jadwalKrs.tanggal_mulai,
        tanggal_selesai: jadwalKrs.tanggal_selesai,
    });

    const [selectAllOdd, setSelectAllOdd] = useState(false);
    const [selectAllEven, setSelectAllEven] = useState(false);

    const handleSemesterToggle = (semester) => {
        const currentList = [...data.semester_list];
        const index = currentList.indexOf(semester);

        if (index > -1) {
            currentList.splice(index, 1);
        } else {
            currentList.push(semester);
        }

        setData('semester_list', currentList.sort((a, b) => a - b));
    };

    const handleSelectAllOdd = () => {
        if (selectAllOdd) {
            setData('semester_list', data.semester_list.filter((semester) => !oddSemesters.includes(semester)));
        } else {
            setData('semester_list', [...new Set([...data.semester_list, ...oddSemesters])].sort((a, b) => a - b));
        }
        setSelectAllOdd(!selectAllOdd);
    };

    const handleSelectAllEven = () => {
        if (selectAllEven) {
            setData('semester_list', data.semester_list.filter((semester) => !evenSemesters.includes(semester)));
        } else {
            setData('semester_list', [...new Set([...data.semester_list, ...evenSemesters])].sort((a, b) => a - b));
        }
        setSelectAllEven(!selectAllEven);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('baak.jadwal-krs.update', jadwalKrs.id_jadwal));
    };

    const formatDate = (date) => {
        if (!date) return '-';

        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getDuration = () => {
        if (!data.tanggal_mulai || !data.tanggal_selesai) return null;

        return Math.ceil((new Date(data.tanggal_selesai) - new Date(data.tanggal_mulai)) / (1000 * 60 * 60 * 24)) + 1;
    };

    return (
        <BaakLayout title="Edit Jadwal KRS">
            <Head title="Edit Jadwal KRS" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 lg:px-6">
                <div className="mx-auto flex max-w-6xl flex-col gap-5">
                    <Link
                        href={route('baak.jadwal-krs.index')}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Kembali ke Daftar Jadwal
                    </Link>

                    <PageHeader
                        title="Edit Jadwal Pengisian KRS"
                        description="Perbarui jadwal pengisian KRS yang sudah ada."
                    />

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="p-4 sm:p-5">
                            <h3 className="text-sm font-semibold text-slate-700">Informasi Jadwal KRS</h3>
                            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <p className="text-xs text-slate-500">Program Studi</p>
                                    <p className="font-semibold text-slate-950">{jadwalKrs.prodi.nama_prodi}</p>
                                    <p className="text-xs text-slate-500">{jadwalKrs.prodi.jenjang}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Semester Sebelumnya</p>
                                    <span className="mt-1 inline-block rounded-lg bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-800">
                                        {initialSemesterList.sort((a, b) => a - b).join(', ')}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Tahun Ajaran</p>
                                    <p className="font-semibold text-slate-950">{jadwalKrs.tahun_ajaran}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Jenjang</p>
                                    <p className="font-semibold text-slate-950">{jadwalKrs.prodi.jenjang}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <form onSubmit={handleSubmit}>
                        <FormCard
                            footer={
                                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                    <Link href={route('baak.jadwal-krs.index')} className="w-full sm:w-auto">
                                        <Button type="button" variant="outline" className="w-full sm:w-auto">
                                            Batal
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                                        {processing ? 'Menyimpan...' : 'Update Jadwal KRS'}
                                    </Button>
                                </div>
                            }
                        >
                            <FormField label="Pilih Semester" required error={errors.semester_list}>
                                <div className="mb-3 flex flex-wrap gap-2">
                                    <Button type="button" variant="outline" size="sm" onClick={handleSelectAllOdd}>
                                        {selectAllOdd ? 'Batalkan Ganjil' : 'Pilih Ganjil'}
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" onClick={handleSelectAllEven}>
                                        {selectAllEven ? 'Batalkan Genap' : 'Pilih Genap'}
                                    </Button>
                                </div>

                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                                    {allSemesters.map((semester) => {
                                        const isChecked = data.semester_list.includes(semester);
                                        return (
                                            <label
                                                key={semester}
                                                className={`flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold transition ${
                                                    isChecked
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                                                        : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => handleSemesterToggle(semester)}
                                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                Sem {semester}
                                            </label>
                                        );
                                    })}
                                </div>
                            </FormField>

                            {data.semester_list.length > 0 ? (
                                <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                                    <span className="font-medium">Semester terpilih:</span> {data.semester_list.join(', ')}
                                    <span className="ml-2 text-slate-500">({data.semester_list.length} semester)</span>
                                </div>
                            ) : null}

                            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                                <FormField
                                    label="Tanggal Mulai"
                                    required
                                    error={errors.tanggal_mulai}
                                    hint={`Sebelumnya: ${formatDate(jadwalKrs.tanggal_mulai)}`}
                                >
                                    <input
                                        type="date"
                                        value={data.tanggal_mulai}
                                        onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                        className={`h-10 w-full rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.tanggal_mulai ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                </FormField>

                                <FormField
                                    label="Tanggal Selesai"
                                    required
                                    error={errors.tanggal_selesai}
                                    hint={`Sebelumnya: ${formatDate(jadwalKrs.tanggal_selesai)}`}
                                >
                                    <input
                                        type="date"
                                        value={data.tanggal_selesai}
                                        onChange={(e) => setData('tanggal_selesai', e.target.value)}
                                        className={`h-10 w-full rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.tanggal_selesai ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                </FormField>
                            </div>

                            {getDuration() ? (
                                <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                                    <span className="font-medium">Durasi Baru:</span> {getDuration()} hari
                                </div>
                            ) : null}

                            <div className="mt-5 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                                <p className="mb-1 font-medium">Perhatian:</p>
                                <ul className="list-inside list-disc space-y-1">
                                    <li>Anda bisa mengubah semester dan tanggal periode</li>
                                    <li>Prodi dan tahun ajaran tidak dapat diubah</li>
                                    <li>Pastikan tanggal selesai lebih besar dari tanggal mulai</li>
                                    <li>Sistem akan validasi duplikasi semester dengan jadwal lain</li>
                                </ul>
                            </div>
                        </FormCard>
                    </form>
                </div>
            </div>
        </BaakLayout>
    );
}
