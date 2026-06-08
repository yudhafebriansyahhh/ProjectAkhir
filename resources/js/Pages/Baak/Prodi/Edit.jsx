import { Head, Link, useForm } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { FormCard, FormField } from '@/Components/ui/form-card';
import { SelectDropdown } from '@/Components/ui/select-dropdown';
import { PageHeader } from '@/Components/ui/data-display';

const jenjangOptions = ['D3', 'D4', 'S1', 'S2', 'S3'].map((value) => ({ value, label: value }));

export default function Edit({ prodi }) {
    const { data, setData, put, processing, errors } = useForm({
        kode_prodi: prodi.kode_prodi || '',
        nama_prodi: prodi.nama_prodi || '',
        jenjang: prodi.jenjang || 'S1',
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        put(route('baak.prodi.update', prodi.kode_prodi));
    };

    return (
        <BaakLayout title="Edit Program Studi">
            <Head title={`Edit ${prodi.nama_prodi}`} />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5">
                    <PageHeader
                        title="Edit Program Studi"
                        description="Ubah data program studi yang sudah terdaftar."
                    />

                    <form onSubmit={handleSubmit}>
                        <FormCard
                            footer={
                                <div className="grid gap-2 sm:flex sm:justify-end">
                                    <Link href={route('baak.prodi.index')} className="order-2 sm:order-1">
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
                                    label="Kode Program Studi"
                                    required
                                    error={errors.kode_prodi}
                                    hint="Maksimal 2 karakter angka."
                                >
                                    <Input
                                        type="text"
                                        value={data.kode_prodi}
                                        onChange={(event) => setData('kode_prodi', event.target.value.toUpperCase())}
                                        placeholder="Contoh: 80"
                                        className={errors.kode_prodi ? 'border-red-300 focus-visible:ring-red-500' : ''}
                                        maxLength="10"
                                    />
                                </FormField>

                                <FormField
                                    label="Nama Program Studi"
                                    required
                                    error={errors.nama_prodi}
                                    hint="Maksimal 100 karakter."
                                >
                                    <Input
                                        type="text"
                                        value={data.nama_prodi}
                                        onChange={(event) => setData('nama_prodi', event.target.value)}
                                        placeholder="Contoh: Teknik Informatika"
                                        className={errors.nama_prodi ? 'border-red-300 focus-visible:ring-red-500' : ''}
                                        maxLength="100"
                                    />
                                </FormField>

                                <div className="md:col-span-2">
                                    <FormField label="Jenjang" required error={errors.jenjang}>
                                        <SelectDropdown
                                            value={data.jenjang}
                                            onChange={(selected) => setData('jenjang', selected ? selected.value : '')}
                                            options={jenjangOptions}
                                            placeholder="Pilih Jenjang"
                                            isSearchable={false}
                                            isClearable={false}
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
