import { Head, Link, useForm } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { FormCard, FormField, RadioCardGroup } from '@/Components/ui/form-card';
import { PageHeader } from '@/Components/ui/data-display';

export default function Edit({ registrasi }) {
    const { data, setData, put, processing, errors } = useForm({
        status_semester: registrasi.status_semester,
        keterangan: registrasi.keterangan || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('baak.registrasi-semester.update', registrasi.id_registrasi));
    };

    const semesterLabel = registrasi.jenis_semester
        ? registrasi.jenis_semester.charAt(0).toUpperCase() + registrasi.jenis_semester.slice(1)
        : '-';

    return (
        <BaakLayout title="Edit Registrasi">
            <Head title="Edit Registrasi" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 lg:px-6">
                <div className="mx-auto flex max-w-5xl flex-col gap-5">
                    <Link
                        href={route('baak.registrasi-semester.index')}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Kembali ke Daftar Registrasi
                    </Link>

                    <PageHeader
                        title="Edit Data Registrasi"
                        description="Koreksi data registrasi mahasiswa."
                    />

                    <Card className="rounded-lg border-blue-200 bg-blue-50 shadow-sm">
                        <CardContent className="p-4 sm:p-5">
                            <h4 className="text-sm font-semibold text-blue-900">Data Mahasiswa</h4>
                            <div className="mt-3 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                                <div>
                                    <p className="text-xs text-slate-500">NIM</p>
                                    <p className="font-semibold text-slate-950">{registrasi.mahasiswa.nim}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Nama</p>
                                    <p className="font-semibold text-slate-950">{registrasi.mahasiswa.nama}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Prodi</p>
                                    <p className="font-semibold text-slate-950">
                                        {registrasi.mahasiswa.prodi?.nama_prodi || '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Semester</p>
                                    <p className="font-semibold text-slate-950">{registrasi.semester}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Periode</p>
                                    <p className="font-semibold text-slate-950">
                                        {registrasi.tahun_ajaran} - {semesterLabel}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Tanggal Registrasi</p>
                                    <p className="font-semibold text-slate-950">
                                        {new Date(registrasi.tanggal_registrasi).toLocaleDateString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <form onSubmit={handleSubmit}>
                        <FormCard
                            footer={
                                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                    <Link href={route('baak.registrasi-semester.index')} className="w-full sm:w-auto">
                                        <Button type="button" variant="outline" className="w-full sm:w-auto">
                                            Batal
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </Button>
                                </div>
                            }
                        >
                            <FormField label="Status Semester" required error={errors.status_semester}>
                                <RadioCardGroup
                                    name="status_semester"
                                    value={data.status_semester}
                                    onChange={(value) => setData('status_semester', value)}
                                    options={[
                                        { value: 'aktif', label: 'Aktif' },
                                        { value: 'cuti', label: 'Cuti' },
                                    ]}
                                />
                            </FormField>

                            <div className="mt-6">
                                <FormField
                                    label="Keterangan"
                                    error={errors.keterangan}
                                    hint="Keterangan tambahan untuk perubahan data."
                                >
                                    <textarea
                                        value={data.keterangan}
                                        onChange={(e) => setData('keterangan', e.target.value)}
                                        placeholder="Keterangan tambahan (opsional)"
                                        rows={4}
                                        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.keterangan ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    <div className="mt-1 text-right text-xs text-slate-500">{data.keterangan.length}/500</div>
                                </FormField>
                            </div>
                        </FormCard>
                    </form>
                </div>
            </div>
        </BaakLayout>
    );
}
