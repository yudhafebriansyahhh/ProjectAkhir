import { Head, Link, useForm } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { FormCard, FormField } from '@/Components/ui/form-card';
import { PageHeader } from '@/Components/ui/data-display';

export default function Edit({ periode }) {
    const { data, setData, put, processing, errors } = useForm({
        tanggal_mulai: periode.tanggal_mulai || '',
        tanggal_selesai: periode.tanggal_selesai || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('baak.periode-registrasi.update', periode.id_periode));
    };

    const formatDate = (date) => {
        if (!date) return '-';

        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <BaakLayout title="Edit Periode Registrasi">
            <Head title="Edit Periode Registrasi" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 lg:px-6">
                <div className="mx-auto flex max-w-5xl flex-col gap-5">
                    <Link
                        href={route('baak.periode-registrasi.index')}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Kembali ke Daftar Periode
                    </Link>

                    <PageHeader
                        title="Edit Periode Registrasi"
                        description="Ubah tanggal periode registrasi yang sudah ada."
                    />

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="p-4 sm:p-5">
                            <h3 className="text-sm font-semibold text-slate-700">Informasi Periode</h3>
                            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <p className="text-xs text-slate-500">Tahun Ajaran</p>
                                    <p className="font-semibold text-slate-950">{periode.tahun_ajaran}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Jenis Semester</p>
                                    <span className="mt-1 inline-block rounded-lg bg-blue-100 px-3 py-1 text-xs font-semibold capitalize text-blue-800">
                                        {periode.jenis_semester}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Status</p>
                                    <span
                                        className={`mt-1 inline-block rounded-lg px-3 py-1 text-xs font-semibold ${
                                            periode.status === 'aktif'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}
                                    >
                                        {periode.status === 'aktif' ? 'Aktif' : 'Tutup'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <form onSubmit={handleSubmit}>
                        <FormCard
                            footer={
                                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                    <Link href={route('baak.periode-registrasi.index')} className="w-full sm:w-auto">
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
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <FormField
                                    label="Tanggal Mulai"
                                    required
                                    error={errors.tanggal_mulai}
                                    hint={`Sebelumnya: ${formatDate(periode.tanggal_mulai)}`}
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
                                    hint={`Sebelumnya: ${formatDate(periode.tanggal_selesai)}`}
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

                            <div className="mt-5 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                                <div className="text-sm text-yellow-800">
                                    <p className="mb-1 font-medium">Perhatian:</p>
                                    <ul className="list-inside list-disc space-y-1">
                                        <li>Anda hanya bisa mengubah tanggal mulai dan selesai</li>
                                        <li>Tahun ajaran dan jenis semester tidak dapat diubah</li>
                                        <li>Pastikan tanggal selesai lebih besar dari tanggal mulai</li>
                                    </ul>
                                </div>
                            </div>
                        </FormCard>
                    </form>
                </div>
            </div>
        </BaakLayout>
    );
}
