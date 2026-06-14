import { useEffect, useMemo, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Copy } from 'lucide-react';
import BaakLayout from '@/Layouts/BaakLayout';
import Modal from '@/Components/Modal';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent } from '@/Components/ui/card';
import { EmptyState, PageHeader, SearchInput } from '@/Components/ui/data-display';
import { FormCard, FormField } from '@/Components/ui/form-card';
import { SelectDropdown } from '@/Components/ui/select-dropdown';

const kategoriOptions = [
    { value: 'wajib', label: 'Wajib' },
    { value: 'pilihan', label: 'Pilihan' },
    { value: 'umum', label: 'Umum' },
];

const semesterTypeOptions = [
    { value: 'ganjil', label: 'Ganjil' },
    { value: 'genap', label: 'Genap' },
    { value: 'pendek', label: 'Pendek' },
];

const generateTahunAjaran = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    return currentMonth >= 7 ? `${currentYear}/${currentYear + 1}` : `${currentYear - 1}/${currentYear}`;
};

const getDefaultJenisSemester = () => {
    const currentMonth = new Date().getMonth() + 1;
    return currentMonth >= 7 ? 'ganjil' : 'genap';
};

const getKategoriBadge = (kategori) => {
    const badges = {
        wajib: 'border-rose-200 bg-rose-50 text-rose-700',
        pilihan: 'border-blue-200 bg-blue-50 text-blue-700',
        umum: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    };

    return badges[kategori] || 'border-slate-200 bg-slate-50 text-slate-700';
};

export default function Create({ mataKuliah = [], prodis = [], periodeSumber = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        tahun_ajaran: '',
        jenis_semester: '',
        kode_prodi: '',
        semester_ditawarkan: '',
        mata_kuliah: [],
    });
    const {
        data: copyData,
        setData: setCopyData,
        post: postCopy,
        processing: copyProcessing,
        errors: copyErrors,
        reset: resetCopyForm,
    } = useForm({
        from_periode: '',
        kode_prodi: '',
        to_tahun_ajaran: generateTahunAjaran(),
        to_jenis_semester: getDefaultJenisSemester(),
    });

    const [searchMk, setSearchMk] = useState('');
    const [filterKategori, setFilterKategori] = useState('');
    const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);

    useEffect(() => {
        if (!data.tahun_ajaran) {
            setData('tahun_ajaran', generateTahunAjaran());
        }
    }, []);

    const filteredMataKuliah = useMemo(() => {
        if (!data.kode_prodi) return [];

        return mataKuliah.filter((mk) => {
            const belongsToProdi = !mk.kode_prodi || mk.kode_prodi === data.kode_prodi;
            const matchSearch =
                !searchMk ||
                mk.nama_matkul.toLowerCase().includes(searchMk.toLowerCase()) ||
                mk.kode_matkul.toLowerCase().includes(searchMk.toLowerCase());
            const matchKategori = !filterKategori || mk.kategori === filterKategori;

            return belongsToProdi && matchSearch && matchKategori;
        });
    }, [mataKuliah, data.kode_prodi, searchMk, filterKategori]);

    const getSemesterOptions = () => {
        if (data.jenis_semester === 'ganjil') return [1, 3, 5, 7];
        if (data.jenis_semester === 'genap') return [2, 4, 6, 8];
        if (data.jenis_semester === 'pendek') return [1, 2, 3, 4, 5, 6, 7, 8];
        return [];
    };

    const handleToggleMataKuliah = (kodeMatkul) => {
        const exists = data.mata_kuliah.find((mk) => mk.kode_matkul === kodeMatkul);

        if (exists) {
            setData('mata_kuliah', data.mata_kuliah.filter((mk) => mk.kode_matkul !== kodeMatkul));
            return;
        }

        setData('mata_kuliah', [...data.mata_kuliah, { kode_matkul: kodeMatkul, catatan: '' }]);
    };

    const handleSelectAll = () => {
        if (filteredMataKuliah.length === 0) return;

        if (data.mata_kuliah.length === filteredMataKuliah.length) {
            setData('mata_kuliah', []);
            return;
        }

        setData(
            'mata_kuliah',
            filteredMataKuliah.map((mk) => ({ kode_matkul: mk.kode_matkul, catatan: '' })),
        );
    };

    const isSelected = (kodeMatkul) => data.mata_kuliah.some((mk) => mk.kode_matkul === kodeMatkul);

    const updateCatatan = (kodeMatkul, value) => {
        setData(
            'mata_kuliah',
            data.mata_kuliah.map((mk) => (mk.kode_matkul === kodeMatkul ? { ...mk, catatan: value } : mk)),
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('baak.pengaturan-krs.store'));
    };

    const handleCopySubmit = (e) => {
        e.preventDefault();

        postCopy(route('baak.pengaturan-krs.copy'), {
            preserveScroll: true,
            onSuccess: () => {
                resetCopyForm('from_periode', 'kode_prodi');
                setIsCopyModalOpen(false);
            },
        });
    };

    const prodiOptions = prodis.map((prodi) => ({ value: prodi.kode_prodi, label: prodi.nama_prodi }));
    const copySourceOptions = periodeSumber.map((periode) => ({
        value: `${periode.tahun_ajaran}|${periode.jenis_semester}`,
        label: `${periode.tahun_ajaran} - ${periode.jenis_semester.charAt(0).toUpperCase() + periode.jenis_semester.slice(1)}`,
    }));
    const semesterOptions = getSemesterOptions().map((semester) => ({
        value: String(semester),
        label: `Semester ${semester}`,
    }));

    const selectedAllVisible =
        filteredMataKuliah.length > 0 && data.mata_kuliah.length === filteredMataKuliah.length;

    return (
        <BaakLayout title="Set Mata Kuliah KRS">
            <Head title="Set Mata Kuliah KRS" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 lg:px-6">
                <div className="mx-auto flex max-w-7xl flex-col gap-5">
                    <Link
                        href={route('baak.pengaturan-krs.index')}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Kembali ke Daftar
                    </Link>

                    <PageHeader
                        title="Set Mata Kuliah KRS"
                        description="Pilih mata kuliah yang akan ditawarkan untuk satu semester tertentu."
                    >
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full gap-2 text-blue-700 sm:w-auto"
                            onClick={() => setIsCopyModalOpen(true)}
                            disabled={copySourceOptions.length === 0}
                        >
                            <Copy className="h-4 w-4" />
                            Copy Konfigurasi
                        </Button>
                    </PageHeader>

                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                        <p className="mb-1 font-semibold">Cara Kerja</p>
                        <ul className="list-inside list-disc space-y-1">
                            <li>Gunakan tombol Copy Konfigurasi untuk menyalin setup mata kuliah dari periode sebelumnya</li>
                            <li>Pilih periode, prodi, dan semester yang akan di-setup</li>
                            <li>Centang mata kuliah yang ditawarkan di semester tersebut</li>
                            <li>Mata kuliah umum dan mata kuliah prodi akan ditampilkan</li>
                        </ul>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <FormCard>
                            <div className="mb-4 flex items-center gap-3">
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                                    1
                                </span>
                                <h3 className="text-base font-semibold text-slate-900">Pilih Periode, Prodi & Semester</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <FormField label="Tahun Ajaran" required error={errors.tahun_ajaran}>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={data.tahun_ajaran}
                                            onChange={(e) => setData('tahun_ajaran', e.target.value)}
                                            placeholder="2024/2025"
                                            maxLength={9}
                                            className={`h-10 min-w-0 flex-1 rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.tahun_ajaran ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        <Button type="button" variant="outline" onClick={() => setData('tahun_ajaran', generateTahunAjaran())}>
                                            Auto
                                        </Button>
                                    </div>
                                </FormField>

                                <FormField label="Jenis Semester" required error={errors.jenis_semester}>
                                    <SelectDropdown
                                        value={data.jenis_semester}
                                        onChange={(selected) =>
                                            setData({
                                                ...data,
                                                jenis_semester: selected ? selected.value : '',
                                                semester_ditawarkan: '',
                                            })
                                        }
                                        options={semesterTypeOptions}
                                        placeholder="Pilih Jenis Semester"
                                        isSearchable={false}
                                    />
                                </FormField>

                                <FormField label="Program Studi" required error={errors.kode_prodi}>
                                    <SelectDropdown
                                        value={data.kode_prodi}
                                        onChange={(selected) =>
                                            setData({
                                                ...data,
                                                kode_prodi: selected ? selected.value : '',
                                                mata_kuliah: [],
                                            })
                                        }
                                        options={prodiOptions}
                                        placeholder="Pilih Prodi"
                                    />
                                </FormField>

                                <FormField
                                    label="Semester"
                                    required
                                    error={errors.semester_ditawarkan}
                                    hint="Maksimal semester 8, mahasiswa semester 9+ tetap bisa mengambil."
                                >
                                    <SelectDropdown
                                        value={data.semester_ditawarkan}
                                        onChange={(selected) =>
                                            setData({
                                                ...data,
                                                semester_ditawarkan: selected ? selected.value : '',
                                                mata_kuliah: [],
                                            })
                                        }
                                        options={semesterOptions}
                                        placeholder="Pilih Semester"
                                        isDisabled={!data.jenis_semester}
                                        isSearchable={false}
                                    />
                                </FormField>
                            </div>
                        </FormCard>

                        {data.kode_prodi && data.semester_ditawarkan ? (
                            <FormCard>
                                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                                            2
                                        </span>
                                        <h3 className="text-base font-semibold text-slate-900">
                                            Pilih Mata Kuliah ({data.mata_kuliah.length} dipilih)
                                        </h3>
                                    </div>
                                    <Button type="button" variant="outline" size="sm" onClick={handleSelectAll} disabled={filteredMataKuliah.length === 0}>
                                        {selectedAllVisible ? 'Batalkan Semua' : 'Pilih Semua'}
                                    </Button>
                                </div>

                                <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <SearchInput
                                        value={searchMk}
                                        onChange={setSearchMk}
                                        onClear={() => setSearchMk('')}
                                        placeholder="Cari mata kuliah..."
                                    />
                                    <SelectDropdown
                                        value={filterKategori}
                                        onChange={(selected) => setFilterKategori(selected ? selected.value : '')}
                                        options={kategoriOptions}
                                        placeholder="Semua Kategori"
                                        isSearchable={false}
                                    />
                                </div>

                                {errors.mata_kuliah ? (
                                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                                        {errors.mata_kuliah}
                                    </div>
                                ) : null}

                                <div className="hidden overflow-hidden rounded-lg border border-slate-200 lg:block">
                                    <div className="max-h-[420px] overflow-auto">
                                        <table className="w-full min-w-[760px]">
                                            <thead className="sticky top-0 bg-slate-50">
                                                <tr className="text-xs uppercase text-slate-500">
                                                    <th className="w-12 px-4 py-3 text-left">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedAllVisible}
                                                            onChange={handleSelectAll}
                                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                    </th>
                                                    <th className="px-4 py-3 text-left">Kode</th>
                                                    <th className="px-4 py-3 text-left">Mata Kuliah</th>
                                                    <th className="px-4 py-3 text-center">Kategori</th>
                                                    <th className="px-4 py-3 text-center">SKS</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {filteredMataKuliah.length > 0 ? (
                                                    filteredMataKuliah.map((mk) => (
                                                        <tr key={mk.kode_matkul} className="hover:bg-slate-50">
                                                            <td className="px-4 py-3">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isSelected(mk.kode_matkul)}
                                                                    onChange={() => handleToggleMataKuliah(mk.kode_matkul)}
                                                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <Badge variant="outline" className="bg-blue-50 font-mono text-blue-700">
                                                                    {mk.kode_matkul}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-4 py-3 text-sm font-semibold text-slate-900">{mk.nama_matkul}</td>
                                                            <td className="px-4 py-3 text-center">
                                                                <Badge variant="outline" className={getKategoriBadge(mk.kategori)}>
                                                                    {mk.kategori}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-4 py-3 text-center text-sm text-slate-700">{mk.sks}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5">
                                                            <EmptyState compact title="Tidak ada mata kuliah" description="Ubah pencarian atau filter kategori." />
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="grid gap-3 lg:hidden">
                                    {filteredMataKuliah.length > 0 ? (
                                        filteredMataKuliah.map((mk) => (
                                            <label
                                                key={mk.kode_matkul}
                                                className={`cursor-pointer rounded-lg border p-4 transition ${
                                                    isSelected(mk.kode_matkul)
                                                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200'
                                                        : 'border-slate-200 bg-white hover:border-blue-200'
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected(mk.kode_matkul)}
                                                        onChange={() => handleToggleMataKuliah(mk.kode_matkul)}
                                                        className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="mb-2 flex flex-wrap gap-2">
                                                            <Badge variant="outline" className="bg-blue-50 font-mono text-blue-700">
                                                                {mk.kode_matkul}
                                                            </Badge>
                                                            <Badge variant="outline" className={getKategoriBadge(mk.kategori)}>
                                                                {mk.kategori}
                                                            </Badge>
                                                            <Badge variant="outline" className="bg-slate-50 text-slate-700">
                                                                {mk.sks} SKS
                                                            </Badge>
                                                        </div>
                                                        <p className="break-words text-sm font-semibold text-slate-950">{mk.nama_matkul}</p>
                                                    </div>
                                                </div>
                                            </label>
                                        ))
                                    ) : (
                                        <Card className="rounded-lg border-slate-200">
                                            <CardContent>
                                                <EmptyState compact title="Tidak ada mata kuliah" description="Ubah pencarian atau filter kategori." />
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </FormCard>
                        ) : null}

                        {data.mata_kuliah.length > 0 ? (
                            <FormCard>
                                <div className="mb-4 flex items-center gap-3">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                                        3
                                    </span>
                                    <h3 className="text-base font-semibold text-slate-900">
                                        Detail Mata Kuliah ({data.mata_kuliah.length})
                                    </h3>
                                </div>

                                <div className="grid gap-3 md:grid-cols-2">
                                    {data.mata_kuliah.map((selectedMk) => {
                                        const mkInfo = mataKuliah.find((mk) => mk.kode_matkul === selectedMk.kode_matkul);

                                        return (
                                            <div key={selectedMk.kode_matkul} className="rounded-lg border border-slate-200 bg-white p-4">
                                                <div className="mb-3 flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="break-words text-sm font-semibold text-slate-950">
                                                            {mkInfo?.nama_matkul || selectedMk.kode_matkul}
                                                        </p>
                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            <Badge variant="outline" className="bg-blue-50 font-mono text-blue-700">
                                                                {mkInfo?.kode_matkul || selectedMk.kode_matkul}
                                                            </Badge>
                                                            <Badge variant="outline" className="bg-slate-50 text-slate-700">
                                                                {mkInfo?.sks || 0} SKS
                                                            </Badge>
                                                            <Badge variant="outline" className={getKategoriBadge(mkInfo?.kategori)}>
                                                                {mkInfo?.kategori || '-'}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="shrink-0 text-red-600"
                                                        onClick={() => handleToggleMataKuliah(selectedMk.kode_matkul)}
                                                    >
                                                        Hapus
                                                    </Button>
                                                </div>

                                                <FormField label="Catatan (Opsional)">
                                                    <input
                                                        type="text"
                                                        value={selectedMk.catatan}
                                                        onChange={(e) => updateCatatan(selectedMk.kode_matkul, e.target.value)}
                                                        placeholder="Contoh: Khusus mahasiswa mengulang"
                                                        maxLength={500}
                                                        className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </FormField>
                                            </div>
                                        );
                                    })}
                                </div>
                            </FormCard>
                        ) : null}

                        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                            <Link href={route('baak.pengaturan-krs.index')} className="w-full sm:w-auto">
                                <Button type="button" variant="outline" className="w-full sm:w-auto">
                                    Batal
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={processing || data.mata_kuliah.length === 0}
                                className="w-full sm:w-auto"
                            >
                                {processing ? 'Menyimpan...' : `Simpan Mata Kuliah Semester ${data.semester_ditawarkan || ''}`}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <Modal show={isCopyModalOpen} onClose={() => setIsCopyModalOpen(false)} maxWidth="xl">
                <div className="p-6">
                    <div className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <Copy className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                            <h2 className="text-lg font-semibold text-slate-950">Copy Konfigurasi KRS</h2>
                            <p className="mt-1 text-sm text-slate-600">
                                Salin mata kuliah yang ditawarkan dari satu periode ke periode tujuan untuk semua prodi atau prodi tertentu.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleCopySubmit} className="mt-6 space-y-4">
                        <FormField label="Periode Sumber" required error={copyErrors.from_periode}>
                            <SelectDropdown
                                value={copyData.from_periode}
                                onChange={(selected) => setCopyData('from_periode', selected ? selected.value : '')}
                                options={copySourceOptions}
                                placeholder="Pilih periode sumber"
                                isDisabled={copySourceOptions.length === 0}
                            />
                        </FormField>

                        <FormField label="Lingkup Prodi" error={copyErrors.kode_prodi} hint="Kosongkan untuk menyalin semua prodi.">
                            <SelectDropdown
                                value={copyData.kode_prodi}
                                onChange={(selected) => setCopyData('kode_prodi', selected ? selected.value : '')}
                                options={prodiOptions}
                                placeholder="Semua Prodi"
                            />
                        </FormField>

                        <FormField label="Tahun Ajaran Tujuan" required error={copyErrors.to_tahun_ajaran}>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={copyData.to_tahun_ajaran}
                                    onChange={(event) => setCopyData('to_tahun_ajaran', event.target.value)}
                                    placeholder="2026/2027"
                                    maxLength={9}
                                    className={`h-10 min-w-0 flex-1 rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        copyErrors.to_tahun_ajaran ? 'border-red-500' : 'border-slate-200'
                                    }`}
                                />
                                <Button type="button" variant="outline" onClick={() => setCopyData('to_tahun_ajaran', generateTahunAjaran())}>
                                    Auto
                                </Button>
                            </div>
                        </FormField>

                        <FormField label="Semester Tujuan" required error={copyErrors.to_jenis_semester}>
                            <SelectDropdown
                                value={copyData.to_jenis_semester}
                                onChange={(selected) => setCopyData('to_jenis_semester', selected ? selected.value : '')}
                                options={semesterTypeOptions}
                                placeholder="Pilih semester tujuan"
                                isSearchable={false}
                            />
                        </FormField>

                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                            Data yang sudah ada di periode tujuan akan dilewati otomatis.
                        </div>

                        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                            <Button type="button" variant="outline" onClick={() => setIsCopyModalOpen(false)}>
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="gap-2"
                                disabled={
                                    copyProcessing ||
                                    !copyData.from_periode ||
                                    !copyData.to_tahun_ajaran ||
                                    !copyData.to_jenis_semester
                                }
                            >
                                <Copy className="h-4 w-4" />
                                {copyProcessing ? 'Menyalin...' : 'Copy Konfigurasi'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </BaakLayout>
    );
}
