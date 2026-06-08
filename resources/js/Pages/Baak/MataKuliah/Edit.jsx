import { Head, Link, useForm } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { FormCard, FormField } from '@/Components/ui/form-card';
import { PageHeader } from '@/Components/ui/data-display';
import { SelectDropdown } from '@/Components/ui/select-dropdown';

const kategoriOptions = [
    { value: 'wajib', label: 'Mata Kuliah Wajib' },
    { value: 'pilihan', label: 'Mata Kuliah Pilihan' },
    { value: 'umum', label: 'Mata Kuliah Umum (Semua Prodi)' },
];

const statusOptions = [
    { value: true, label: 'Aktif' },
    { value: false, label: 'Nonaktif' },
];

export default function Edit({ mata_kuliah, prodi = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        kode_matkul: mata_kuliah.kode_matkul || '',
        nama_matkul: mata_kuliah.nama_matkul || '',
        sks: mata_kuliah.sks || 2,
        kode_prodi: mata_kuliah.kode_prodi || '',
        kategori: mata_kuliah.kategori || 'wajib',
        is_active: mata_kuliah.is_active ?? true,
        deskripsi: mata_kuliah.deskripsi || '',
    });

    const prodiOptions = prodi.map((item) => ({ value: item.kode_prodi, label: item.nama_prodi }));
    const isUmum = data.kategori === 'umum';

    const handleKategoriChange = (selected) => {
        const value = selected ? selected.value : '';
        setData('kategori', value);

        if (value === 'umum') {
            setData('kode_prodi', '');
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        put(route('baak.mata-kuliah.update', mata_kuliah.kode_matkul));
    };

    return (
        <BaakLayout title="Edit Mata Kuliah">
            <Head title={`Edit ${mata_kuliah.nama_matkul}`} />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5">
                    <PageHeader
                        title="Edit Mata Kuliah"
                        description="Ubah data mata kuliah yang sudah terdaftar."
                    />

                    <form onSubmit={handleSubmit}>
                        <FormCard
                            footer={
                                <div className="grid gap-2 sm:flex sm:justify-end">
                                    <Link href={route('baak.mata-kuliah.index')} className="order-2 sm:order-1">
                                        <Button type="button" variant="outline" className="w-full sm:w-auto">
                                            Batal
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing} className="order-1 w-full sm:order-2 sm:w-auto">
                                        {processing ? 'Menyimpan...' : 'Update Data'}
                                    </Button>
                                </div>
                            }
                        >
                            <div className="grid gap-5 md:grid-cols-2">
                                <FormField
                                    label="Kode Mata Kuliah"
                                    required
                                    error={errors.kode_matkul}
                                    hint="Maksimal 10 karakter."
                                >
                                    <Input
                                        type="text"
                                        value={data.kode_matkul}
                                        onChange={(event) => setData('kode_matkul', event.target.value.toUpperCase())}
                                        placeholder="Contoh: TIF101"
                                        className={errors.kode_matkul ? 'border-red-300 focus-visible:ring-red-500' : ''}
                                        maxLength="10"
                                    />
                                </FormField>

                                <FormField
                                    label="Nama Mata Kuliah"
                                    required
                                    error={errors.nama_matkul}
                                    hint="Maksimal 100 karakter."
                                >
                                    <Input
                                        type="text"
                                        value={data.nama_matkul}
                                        onChange={(event) => setData('nama_matkul', event.target.value)}
                                        placeholder="Contoh: Algoritma dan Pemrograman"
                                        className={errors.nama_matkul ? 'border-red-300 focus-visible:ring-red-500' : ''}
                                        maxLength="100"
                                    />
                                </FormField>

                                <FormField label="SKS" required error={errors.sks} hint="Minimal 1 SKS, maksimal 6 SKS.">
                                    <Input
                                        type="number"
                                        value={data.sks}
                                        onChange={(event) => setData('sks', event.target.value)}
                                        min="1"
                                        max="6"
                                        className={errors.sks ? 'border-red-300 focus-visible:ring-red-500' : ''}
                                    />
                                </FormField>

                                <FormField label="Kategori Mata Kuliah" required error={errors.kategori}>
                                    <SelectDropdown
                                        value={data.kategori}
                                        onChange={handleKategoriChange}
                                        options={kategoriOptions}
                                        placeholder="Pilih Kategori"
                                        isSearchable={false}
                                        isClearable={false}
                                    />
                                </FormField>

                                <FormField
                                    label="Program Studi"
                                    required={!isUmum}
                                    error={errors.kode_prodi}
                                    hint={isUmum ? 'Mata kuliah umum bisa diambil oleh semua program studi.' : null}
                                >
                                    <SelectDropdown
                                        value={data.kode_prodi}
                                        onChange={(selected) => setData('kode_prodi', selected ? selected.value : '')}
                                        options={prodiOptions}
                                        placeholder={isUmum ? 'Semua Program Studi' : 'Pilih Program Studi'}
                                        isDisabled={isUmum}
                                    />
                                </FormField>

                                <FormField label="Status" required error={errors.is_active} hint="Hanya mata kuliah aktif yang bisa diambil mahasiswa saat KRS.">
                                    <SelectDropdown
                                        value={data.is_active}
                                        onChange={(selected) => setData('is_active', selected ? selected.value : false)}
                                        options={statusOptions}
                                        placeholder="Pilih Status"
                                        isSearchable={false}
                                        isClearable={false}
                                    />
                                </FormField>

                                <div className="md:col-span-2">
                                    <FormField
                                        label="Deskripsi Mata Kuliah"
                                        error={errors.deskripsi}
                                        hint={`${data.deskripsi.length}/500 karakter`}
                                    >
                                        <textarea
                                            value={data.deskripsi}
                                            onChange={(event) => setData('deskripsi', event.target.value)}
                                            rows="4"
                                            placeholder="Deskripsi singkat tentang mata kuliah (opsional)"
                                            className={`min-h-28 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
                                                errors.deskripsi ? 'border-red-300 focus-visible:ring-red-500' : ''
                                            }`}
                                            maxLength="500"
                                        />
                                    </FormField>
                                </div>
                            </div>
                        </FormCard>
                    </form>
                </div>
            </div>
        </BaakLayout>
    );
}
