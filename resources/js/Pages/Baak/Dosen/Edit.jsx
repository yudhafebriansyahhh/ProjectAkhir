import { useMemo, useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ImagePlus, Info, KeyRound, X } from 'lucide-react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { FormCard, FormField } from '@/Components/ui/form-card';
import { PageHeader } from '@/Components/ui/data-display';
import { SelectDropdown } from '@/Components/ui/select-dropdown';

const genderOptions = [
    { value: 'Laki-laki', label: 'Laki-laki' },
    { value: 'Perempuan', label: 'Perempuan' },
];

export default function Edit({ dosen, prodi = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        nip: dosen.nip || '',
        nama: dosen.nama || '',
        kode_prodi: dosen.kode_prodi || '',
        jenis_kelamin: dosen.jenis_kelamin || '',
        alamat: dosen.alamat || '',
        no_hp: dosen.no_hp || '',
        foto: null,
        hapus_foto: false,
        _method: 'PUT',
    });

    const [previewImage, setPreviewImage] = useState(dosen.foto ? `/storage/${dosen.foto}` : null);

    const prodiOptions = useMemo(
        () => prodi.map((item) => ({ value: item.kode_prodi, label: item.nama_prodi })),
        [prodi],
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('baak.dosen.update', dosen.id_dosen));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setData((prevData) => ({ ...prevData, foto: file, hapus_foto: false }));
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        setPreviewImage(null);
        setData((prevData) => ({ ...prevData, foto: null, hapus_foto: true }));
    };

    const handleResetPassword = () => {
        const resetPassword = () => {
            router.post(route('baak.dosen.reset-password', dosen.id_dosen), {}, { preserveScroll: true });
        };

        if (window.Swal) {
            window.Swal.fire({
                title: 'Reset Password?',
                text: `Password akan direset ke NIP: ${dosen.nip || '-'}`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3b82f6',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Ya, Reset!',
                cancelButtonText: 'Batal',
            }).then((result) => {
                if (result.isConfirmed) resetPassword();
            });
            return;
        }

        if (confirm(`Reset password ke NIP: ${dosen.nip || '-'}?`)) resetPassword();
    };

    return (
        <BaakLayout title="Edit Dosen">
            <Head title={`Edit ${dosen.nama}`} />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-5xl space-y-4 md:space-y-5">
                    <PageHeader
                        title="Edit Dosen"
                        description="Perbarui data identitas dan kontak dosen."
                    />

                    <div className="flex gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
                        <Info className="mt-0.5 h-4 w-4 shrink-0" />
                        <p>Jika NIP diubah, username akun dosen ikut diperbarui. Reset password akan menggunakan NIP aktif.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <FormCard
                            footer={
                                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <Button type="button" variant="outline" className="gap-2 text-amber-700" onClick={handleResetPassword}>
                                        <KeyRound className="h-4 w-4" />
                                        Reset Password
                                    </Button>
                                    <div className="flex flex-col-reverse gap-3 sm:flex-row">
                                        <Link href={route('baak.dosen.index')} className="w-full sm:w-auto">
                                            <Button type="button" variant="outline" className="w-full sm:w-auto">
                                                Batal
                                            </Button>
                                        </Link>
                                        <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                                            {processing ? 'Menyimpan...' : 'Update Data'}
                                        </Button>
                                    </div>
                                </div>
                            }
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField label="NIP" required error={errors.nip}>
                                    <Input
                                        type="text"
                                        value={data.nip}
                                        onChange={(event) => setData('nip', event.target.value)}
                                        placeholder="Nomor Induk Pegawai"
                                        maxLength="20"
                                    />
                                </FormField>

                                <FormField label="Nama Lengkap" required error={errors.nama}>
                                    <Input
                                        type="text"
                                        value={data.nama}
                                        onChange={(event) => setData('nama', event.target.value)}
                                        placeholder="Nama lengkap dosen"
                                        maxLength="100"
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

                                <FormField label="Jenis Kelamin" required error={errors.jenis_kelamin}>
                                    <div className="grid grid-cols-2 gap-2">
                                        {genderOptions.map((option) => (
                                            <label
                                                key={option.value}
                                                className={`flex h-10 cursor-pointer items-center justify-center rounded-lg border text-sm font-semibold transition ${
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

                                <FormField label="Nomor HP" error={errors.no_hp}>
                                    <Input
                                        type="text"
                                        value={data.no_hp}
                                        onChange={(event) => setData('no_hp', event.target.value)}
                                        placeholder="08xxxxxxxxxx"
                                        maxLength="15"
                                    />
                                </FormField>

                                <div className="md:col-span-2">
                                    <FormField label="Alamat" error={errors.alamat}>
                                        <textarea
                                            value={data.alamat}
                                            onChange={(event) => setData('alamat', event.target.value)}
                                            rows="3"
                                            placeholder="Alamat lengkap dosen"
                                            className="min-h-[96px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </FormField>
                                </div>

                                <div className="md:col-span-2">
                                    <FormField label="Foto Dosen" error={errors.foto} hint="Format JPG, JPEG, PNG. Maksimal 2MB.">
                                        <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                                            {previewImage ? (
                                                <div className="space-y-3">
                                                    <img src={previewImage} alt="Preview foto dosen" className="mx-auto h-32 w-32 rounded-full object-cover ring-4 ring-white" />
                                                    <div className="flex flex-col justify-center gap-2 sm:flex-row">
                                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="foto-input" />
                                                        <label htmlFor="foto-input" className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-100">
                                                            Ganti Foto
                                                        </label>
                                                        <Button type="button" variant="outline" className="gap-2 text-red-600" onClick={clearImage}>
                                                            <X className="h-4 w-4" />
                                                            Hapus Foto
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-white text-slate-400">
                                                        <ImagePlus className="h-7 w-7" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-700">Pilih foto untuk diupload</p>
                                                        <p className="text-xs text-slate-500">Foto akan ditampilkan pada profil dosen.</p>
                                                    </div>
                                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="foto-input" />
                                                    <label htmlFor="foto-input" className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
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
