import { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { AlertCircle, ImagePlus, KeyRound, X } from 'lucide-react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { FormCard, FormField } from '@/Components/ui/form-card';
import { PageHeader } from '@/Components/ui/data-display';
import { SelectDropdown } from '@/Components/ui/select-dropdown';

const statusOptions = [
    { value: 'aktif', label: 'Aktif' },
    { value: 'lulus', label: 'Lulus' },
    { value: 'keluar', label: 'Keluar' },
    { value: 'DO', label: 'DO (Drop Out)' },
];

const genderOptions = [
    { value: 'Laki-laki', label: 'Laki-laki' },
    { value: 'Perempuan', label: 'Perempuan' },
];

export default function EditMahasiswa({ mahasiswa, prodis = [], dosens = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        nama: mahasiswa.nama || '',
        kode_prodi: mahasiswa.kode_prodi || '',
        id_dosen_wali: mahasiswa.id_dosen_wali || '',
        tanggal_lahir: mahasiswa.tanggal_lahir || '',
        jenis_kelamin: mahasiswa.jenis_kelamin || '',
        alamat: mahasiswa.alamat || '',
        no_hp: mahasiswa.no_hp || '',
        status: mahasiswa.status || 'aktif',
        foto: null,
        _method: 'PUT',
    });

    const [previewImage, setPreviewImage] = useState(mahasiswa.foto ? `/storage/${mahasiswa.foto}` : null);
    const prodiOptions = prodis.map((prodi) => ({ value: prodi.kode_prodi, label: prodi.nama_prodi }));
    const dosenOptions = dosens.map((dosen) => ({ value: dosen.id_dosen, label: `${dosen.nama} - ${dosen.nip}` }));

    const handleSubmit = (event) => {
        event.preventDefault();
        post(route('baak.mahasiswa.update', mahasiswa.id_mahasiswa));
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        setData('foto', file);
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        setPreviewImage(null);
        setData('foto', null);
    };

    const handleResetPassword = () => {
        if (window.Swal) {
            window.Swal.fire({
                title: 'Reset Password?',
                text: `Password akan direset menjadi NIM: ${mahasiswa.nim || '-'}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, Reset!',
                cancelButtonText: 'Batal',
                confirmButtonColor: '#2563eb',
            }).then((result) => {
                if (result.isConfirmed) {
                    router.post(route('baak.mahasiswa.reset-password', mahasiswa.id_mahasiswa), {}, {
                        preserveScroll: true,
                    });
                }
            });
        }
    };

    return (
        <BaakLayout title="Edit Data Mahasiswa">
            <Head title={`Edit ${mahasiswa.nama}`} />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5">
                    <PageHeader
                        title="Edit Data Mahasiswa"
                        description="Ubah data mahasiswa yang sudah terdaftar."
                    />

                    <div className="flex items-start gap-3 rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                        <p>NIM: <strong>{mahasiswa.nim || '-'}</strong>. NIM tidak dapat diubah melalui form ini.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <FormCard
                            footer={
                                <div className="grid gap-2 sm:flex sm:justify-between">
                                    <Button type="button" variant="outline" className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-50" onClick={handleResetPassword}>
                                        <KeyRound className="h-4 w-4" />
                                        Reset Password
                                    </Button>
                                    <div className="grid gap-2 sm:flex sm:justify-end">
                                        <Link href={route('baak.mahasiswa.index')} className="order-2 sm:order-1">
                                            <Button type="button" variant="outline" className="w-full sm:w-auto">
                                                Batal
                                            </Button>
                                        </Link>
                                        <Button type="submit" disabled={processing} className="order-1 w-full sm:order-2 sm:w-auto">
                                            {processing ? 'Menyimpan...' : 'Update Data'}
                                        </Button>
                                    </div>
                                </div>
                            }
                        >
                            <div className="grid gap-5 md:grid-cols-2">
                                <FormField label="Nama Lengkap" required error={errors.nama}>
                                    <Input
                                        type="text"
                                        value={data.nama}
                                        onChange={(event) => setData('nama', event.target.value)}
                                        className={errors.nama ? 'border-red-300 focus-visible:ring-red-500' : ''}
                                    />
                                </FormField>

                                <FormField label="Program Studi" required error={errors.kode_prodi}>
                                    <SelectDropdown
                                        value={data.kode_prodi}
                                        onChange={(selected) => setData('kode_prodi', selected ? selected.value : '')}
                                        options={prodiOptions}
                                        placeholder="Pilih Program Studi"
                                    />
                                </FormField>

                                <FormField label="Dosen Wali" error={errors.id_dosen_wali}>
                                    <SelectDropdown
                                        value={data.id_dosen_wali}
                                        onChange={(selected) => setData('id_dosen_wali', selected ? selected.value : '')}
                                        options={dosenOptions}
                                        placeholder="Pilih Dosen Wali"
                                    />
                                </FormField>

                                <FormField label="Tanggal Lahir" required error={errors.tanggal_lahir}>
                                    <Input
                                        type="date"
                                        value={data.tanggal_lahir}
                                        onChange={(event) => setData('tanggal_lahir', event.target.value)}
                                        className={errors.tanggal_lahir ? 'border-red-300 focus-visible:ring-red-500' : ''}
                                    />
                                </FormField>

                                <FormField label="Jenis Kelamin" required error={errors.jenis_kelamin}>
                                    <div className="grid grid-cols-2 gap-2">
                                        {genderOptions.map((option) => (
                                            <label
                                                key={option.value}
                                                className={`flex h-11 cursor-pointer items-center justify-center rounded-lg border text-sm font-semibold transition ${
                                                    data.jenis_kelamin === option.value
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                                                        : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="jenis_kelamin"
                                                    value={option.value}
                                                    checked={data.jenis_kelamin === option.value}
                                                    onChange={(event) => setData('jenis_kelamin', event.target.value)}
                                                    className="sr-only"
                                                />
                                                {option.label}
                                            </label>
                                        ))}
                                    </div>
                                </FormField>

                                <FormField label="Nomor Telepon" error={errors.no_hp}>
                                    <Input
                                        type="text"
                                        value={data.no_hp}
                                        onChange={(event) => setData('no_hp', event.target.value)}
                                        className={errors.no_hp ? 'border-red-300 focus-visible:ring-red-500' : ''}
                                    />
                                </FormField>

                                <FormField label="Status" required error={errors.status}>
                                    <SelectDropdown
                                        value={data.status}
                                        onChange={(selected) => setData('status', selected ? selected.value : '')}
                                        options={statusOptions}
                                        placeholder="Pilih Status"
                                        isSearchable={false}
                                        isClearable={false}
                                    />
                                </FormField>

                                <div className="md:col-span-2">
                                    <FormField label="Alamat" error={errors.alamat}>
                                        <textarea
                                            value={data.alamat}
                                            onChange={(event) => setData('alamat', event.target.value)}
                                            rows="3"
                                            className={`min-h-24 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
                                                errors.alamat ? 'border-red-300 focus-visible:ring-red-500' : ''
                                            }`}
                                        />
                                    </FormField>
                                </div>

                                <div className="md:col-span-2">
                                    <FormField label="Foto Diri" error={errors.foto}>
                                        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
                                            {previewImage ? (
                                                <div className="space-y-3">
                                                    <img src={previewImage} alt="Preview" className="mx-auto h-32 w-32 rounded-full object-cover" />
                                                    <Button type="button" variant="outline" size="sm" className="gap-2 border-red-200 text-red-600 hover:bg-red-50" onClick={clearImage}>
                                                        <X className="h-4 w-4" />
                                                        Hapus Foto
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    <ImagePlus className="mx-auto h-10 w-10 text-slate-400" />
                                                    <p className="text-sm text-slate-500">Pilih foto mahasiswa untuk diupload</p>
                                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="foto-input" />
                                                    <label
                                                        htmlFor="foto-input"
                                                        className="inline-flex h-9 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                                    >
                                                        Pilih File
                                                    </label>
                                                </div>
                                            )}
                                        </div>
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
