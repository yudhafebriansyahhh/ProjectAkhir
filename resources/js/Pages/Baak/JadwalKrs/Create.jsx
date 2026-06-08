import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Button } from '@/Components/ui/button';
import { FormCard, FormField } from '@/Components/ui/form-card';
import { PageHeader } from '@/Components/ui/data-display';

const oddSemesters = [1, 3, 5, 7, 9, 11, 13];
const evenSemesters = [2, 4, 6, 8, 10, 12, 14];
const allSemesters = Array.from({ length: 14 }, (_, index) => index + 1);

export default function Create({ prodiList }) {
    const getDefaultTahunAjaran = () => {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;

        return month >= 8 || month === 1 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
    };

    const { data, setData, post, processing, errors } = useForm({
        kode_prodi: '',
        semester_list: [],
        tahun_ajaran: getDefaultTahunAjaran(),
        tanggal_mulai: '',
        tanggal_selesai: '',
    });

    const [selectAllOdd, setSelectAllOdd] = useState(false);
    const [selectAllEven, setSelectAllEven] = useState(false);

    useEffect(() => {
        setData('tahun_ajaran', getDefaultTahunAjaran());
    }, []);

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

    const getDuration = () => {
        if (!data.tanggal_mulai || !data.tanggal_selesai) return null;

        return Math.ceil((new Date(data.tanggal_selesai) - new Date(data.tanggal_mulai)) / (1000 * 60 * 60 * 24)) + 1;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('baak.jadwal-krs.store'));
    };

    return (
        <BaakLayout title="Tambah Jadwal KRS">
            <Head title="Tambah Jadwal KRS" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 lg:px-6">
                <div className="mx-auto flex max-w-6xl flex-col gap-5">
                    <Link
                        href={route('baak.jadwal-krs.index')}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Kembali ke Daftar Jadwal
                    </Link>

                    <PageHeader
                        title="Tambah Jadwal Pengisian KRS"
                        description="Buat jadwal pengisian KRS baru untuk program studi."
                    />

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
                                        {processing ? 'Menyimpan...' : 'Simpan Jadwal KRS'}
                                    </Button>
                                </div>
                            }
                        >
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <FormField label="Program Studi" required error={errors.kode_prodi}>
                                    <select
                                        value={data.kode_prodi}
                                        onChange={(e) => setData('kode_prodi', e.target.value)}
                                        className={`h-10 w-full rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.kode_prodi ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Pilih Program Studi</option>
                                        {prodiList.map((prodi) => (
                                            <option key={prodi.kode_prodi} value={prodi.kode_prodi}>
                                                {prodi.nama_prodi} ({prodi.jenjang})
                                            </option>
                                        ))}
                                    </select>
                                </FormField>

                                <FormField label="Tahun Ajaran" required error={errors.tahun_ajaran}>
                                    <input
                                        type="text"
                                        value={data.tahun_ajaran}
                                        onChange={(e) => setData('tahun_ajaran', e.target.value)}
                                        placeholder="2024/2025"
                                        className={`h-10 w-full rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.tahun_ajaran ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                </FormField>
                            </div>

                            <div className="mt-6">
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
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                                <FormField label="Tanggal Mulai" required error={errors.tanggal_mulai}>
                                    <input
                                        type="date"
                                        value={data.tanggal_mulai}
                                        onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                        className={`h-10 w-full rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.tanggal_mulai ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                </FormField>

                                <FormField label="Tanggal Selesai" required error={errors.tanggal_selesai}>
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
                                    <span className="font-medium">Durasi:</span> {getDuration()} hari
                                </div>
                            ) : null}

                            <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                                <p className="mb-1 font-medium">Tips Penggunaan Multi Semester:</p>
                                <ul className="list-inside list-disc space-y-1">
                                    <li>Pilih beberapa semester sekaligus untuk efisiensi</li>
                                    <li>Contoh: pilih semester 3, 5, 7 untuk semester ganjil reguler</li>
                                    <li>Mahasiswa di semester yang dipilih bisa isi KRS dalam periode yang sama</li>
                                </ul>
                            </div>
                        </FormCard>
                    </form>
                </div>
            </div>
        </BaakLayout>
    );
}
