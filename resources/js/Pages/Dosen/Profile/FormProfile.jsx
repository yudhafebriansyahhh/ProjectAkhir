import { useState, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ImagePlus, X, Info } from 'lucide-react';
import DosenLayout from '@/Layouts/DosenLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { FormCard, FormField } from '@/Components/ui/form-card';
import { PageHeader } from '@/Components/ui/data-display';

export default function FormProfile({ dosen }) {
    const getFotoPreviewUrl = () => {
        if (dosen?.foto_url) return dosen.foto_url;
        if (!dosen?.foto) return null;
        if (dosen.foto.startsWith('http') || dosen.foto.startsWith('/')) return dosen.foto;
        return `/storage/${dosen.foto}`;
    };

    const { data, setData, post, processing, errors } = useForm({
        alamat: dosen?.alamat || '',
        no_hp: dosen?.no_hp || '',
        foto: null,
        hapus_foto: false,
        _method: 'PATCH',
    });

    const [previewImage, setPreviewImage] = useState(getFotoPreviewUrl());
    const fileInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('dosen.profile.update-data'));
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
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <DosenLayout title="Perbarui Data Profil">
            <Head title="Perbarui Data Profil" />

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-6 max-w-5xl mx-auto">
                    <PageHeader
                        title="Perbarui Data Profil"
                        description="Lengkapi dan perbarui informasi data diri Anda."
                    />

                    <div className="flex gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
                        <Info className="mt-0.5 h-4 w-4 shrink-0" />
                        <p>Pastikan data yang Anda masukkan sudah benar. Data ini digunakan untuk keperluan administrasi akademik.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <FormCard
                            footer={
                                <div className="flex justify-end gap-3">
                                    <Link href={route('dosen.profile')}>
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
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField label="Nama Lengkap">
                                    <Input type="text" value={dosen?.nama || '-'} disabled className="bg-slate-100 cursor-not-allowed" />
                                </FormField>
                                <FormField label="NIP">
                                    <Input type="text" value={dosen?.nip || '-'} disabled className="bg-slate-100 cursor-not-allowed" />
                                </FormField>
                                <FormField label="Jenis Kelamin">
                                    <Input type="text" value={dosen?.jenis_kelamin || '-'} disabled className="bg-slate-100 cursor-not-allowed" />
                                </FormField>
                                <FormField label="Program Studi">
                                    <Input type="text" value={dosen?.prodi || '-'} disabled className="bg-slate-100 cursor-not-allowed" />
                                </FormField>

                                <div className="md:col-span-2 border-t border-slate-200 my-2 pt-4">
                                    <h3 className="font-semibold text-slate-800 mb-4">Informasi Kontak</h3>
                                </div>

                                <FormField label="Nomor HP / WhatsApp" error={errors.no_hp}>
                                    <Input
                                        type="text"
                                        value={data.no_hp}
                                        onChange={(e) => setData('no_hp', e.target.value)}
                                        placeholder="08xxxxxxxxxx"
                                        maxLength="20"
                                    />
                                </FormField>

                                <div className="md:col-span-2">
                                    <FormField label="Alamat" error={errors.alamat}>
                                        <textarea
                                            value={data.alamat}
                                            onChange={(e) => setData('alamat', e.target.value)}
                                            rows="3"
                                            placeholder="Alamat lengkap domisili saat ini"
                                            className="min-h-[96px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </FormField>
                                </div>

                                <div className="md:col-span-2 border-t border-slate-200 my-2 pt-4">
                                    <h3 className="font-semibold text-slate-800 mb-4">Foto Profil</h3>
                                    <FormField label="" error={errors.foto} hint="Format JPG, JPEG, PNG. Maksimal 2MB.">
                                        <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                                            {previewImage ? (
                                                <div className="space-y-3">
                                                    <img src={previewImage} alt="Preview foto profil" className="mx-auto h-32 w-32 rounded-full object-cover ring-4 ring-white" />
                                                    <div className="flex flex-col justify-center gap-2 sm:flex-row">
                                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" ref={fileInputRef} id="foto-input" />
                                                        <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-100">
                                                            Ganti Foto
                                                        </button>
                                                        <Button type="button" variant="outline" className="gap-2 text-red-600" onClick={clearImage}>
                                                            <X className="h-4 w-4" />
                                                            Hapus Foto
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-white text-slate-400 shadow-sm">
                                                        <ImagePlus className="h-7 w-7" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-700">Pilih foto untuk diupload</p>
                                                        <p className="text-xs text-slate-500">Foto akan ditampilkan pada profil Anda.</p>
                                                    </div>
                                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" ref={fileInputRef} id="foto-input" />
                                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 shadow-sm">
                                                        Pilih File
                                                    </button>
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
        </DosenLayout>
    );
}
