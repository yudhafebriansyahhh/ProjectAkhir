import { Head, Link, useForm } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Button } from '@/Components/ui/button';
import { FormCard, FormField } from '@/Components/ui/form-card';
import { PageHeader } from '@/Components/ui/data-display';

export default function Create({ defaultTahunAjaran }) {
    const { data, setData, post, processing, errors } = useForm({
        tahun_ajaran: defaultTahunAjaran || '',
        jenis_semester: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('baak.periode-registrasi.store'));
    };

    return (
        <BaakLayout title="Tambah Periode Registrasi">
            <Head title="Tambah Periode Registrasi" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 lg:px-6">
                <div className="mx-auto flex max-w-5xl flex-col gap-5">
                    <Link
                        href={route('baak.periode-registrasi.index')}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Kembali ke Daftar Periode
                    </Link>

                    <PageHeader
                        title="Tambah Periode Registrasi"
                        description="Buat periode registrasi semester baru untuk mahasiswa."
                    />

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
                                        {processing ? 'Menyimpan...' : 'Simpan Data'}
                                    </Button>
                                </div>
                            }
                        >
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <FormField
                                    label="Tahun Ajaran"
                                    required
                                    error={errors.tahun_ajaran}
                                    hint="Format: YYYY/YYYY, contoh: 2024/2025."
                                >
                                <input
                                    type="text"
                                    value={data.tahun_ajaran}
                                    onChange={(e) => setData('tahun_ajaran', e.target.value)}
                                    placeholder="Contoh: 2024/2025"
                                    className={`h-10 w-full rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.tahun_ajaran ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                </FormField>

                                <FormField label="Jenis Semester" required error={errors.jenis_semester}>
                                <select
                                    value={data.jenis_semester}
                                    onChange={(e) => setData('jenis_semester', e.target.value)}
                                    className={`h-10 w-full rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.jenis_semester ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">-- Pilih Jenis Semester --</option>
                                    <option value="ganjil">Ganjil</option>
                                    <option value="genap">Genap</option>
                                </select>
                                </FormField>

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

                            <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4">
                                <div className="text-sm text-blue-800">
                                    <p className="font-medium mb-1">Informasi Penting:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Periode akan dibuat dengan status <strong>Tutup</strong></li>
                                        <li>Aktifkan periode melalui tombol toggle di halaman daftar</li>
                                        <li>Hanya 1 periode yang bisa aktif dalam satu waktu</li>
                                        <li>Mahasiswa hanya bisa registrasi saat periode aktif</li>
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
