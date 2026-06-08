import { Head, Link, useForm } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { FormCard, FormField } from '@/Components/ui/form-card';
import { PageHeader } from '@/Components/ui/data-display';

export default function Edit({ ruangan }) {
    const { data, setData, put, processing, errors } = useForm({
        kode_ruangan: ruangan.kode_ruangan || '',
        nama_ruangan: ruangan.nama_ruangan || '',
        gedung: ruangan.gedung || '',
        lantai: ruangan.lantai ?? '',
        kapasitas: ruangan.kapasitas ?? '',
        keterangan: ruangan.keterangan || '',
        is_active: Boolean(ruangan.is_active),
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        put(route('baak.ruangan.update', ruangan.id_ruangan));
    };

    return (
        <BaakLayout title="Edit Ruangan">
            <Head title={`Edit ${ruangan.kode_ruangan}`} />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-4xl space-y-4 md:space-y-5">
                    <PageHeader title="Edit Ruangan" description="Perbarui master ruangan dan status pemakaian." />

                    <form onSubmit={handleSubmit}>
                        <FormCard
                            footer={
                                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                    <Link href={route('baak.ruangan.index')} className="w-full sm:w-auto">
                                        <Button type="button" variant="outline" className="w-full sm:w-auto">Batal</Button>
                                    </Link>
                                    <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                                        {processing ? 'Menyimpan...' : 'Update Data'}
                                    </Button>
                                </div>
                            }
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField label="Kode Ruangan" required error={errors.kode_ruangan}>
                                    <Input value={data.kode_ruangan} onChange={(event) => setData('kode_ruangan', event.target.value.toUpperCase())} placeholder="Contoh: R201, LAB1" maxLength="20" />
                                </FormField>

                                <FormField label="Nama Ruangan" required error={errors.nama_ruangan}>
                                    <Input value={data.nama_ruangan} onChange={(event) => setData('nama_ruangan', event.target.value)} placeholder="Contoh: Ruang 201" maxLength="100" />
                                </FormField>

                                <FormField label="Gedung" error={errors.gedung}>
                                    <Input value={data.gedung} onChange={(event) => setData('gedung', event.target.value)} placeholder="Contoh: Gedung A" maxLength="100" />
                                </FormField>

                                <FormField label="Lantai" error={errors.lantai}>
                                    <Input type="number" min="0" max="99" value={data.lantai} onChange={(event) => setData('lantai', event.target.value)} placeholder="Contoh: 2" />
                                </FormField>

                                <FormField label="Kapasitas" error={errors.kapasitas}>
                                    <Input type="number" min="1" max="1000" value={data.kapasitas} onChange={(event) => setData('kapasitas', event.target.value)} placeholder="Contoh: 40" />
                                </FormField>

                                <FormField label="Status" required error={errors.is_active}>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { value: true, label: 'Aktif' },
                                            { value: false, label: 'Nonaktif' },
                                        ].map((option) => (
                                            <button
                                                key={option.label}
                                                type="button"
                                                onClick={() => setData('is_active', option.value)}
                                                className={`h-10 rounded-lg border text-sm font-semibold transition ${
                                                    data.is_active === option.value
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                                                        : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50'
                                                }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </FormField>

                                <div className="md:col-span-2">
                                    <FormField label="Keterangan" error={errors.keterangan}>
                                        <textarea
                                            value={data.keterangan}
                                            onChange={(event) => setData('keterangan', event.target.value)}
                                            rows="3"
                                            placeholder="Catatan tambahan ruangan"
                                            className="min-h-[96px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
