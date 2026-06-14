import { useState, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ImagePlus, X, Info, CheckCircle2, XCircle } from 'lucide-react';
import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { FormCard, FormField } from '@/Components/ui/form-card';
import { PageHeader } from '@/Components/ui/data-display';
import { SelectDropdown } from '@/Components/ui/select-dropdown';
import Modal from '@/Components/Modal';

const agamaOptions = [
    { value: 'Islam', label: 'Islam' },
    { value: 'Kristen Protestan', label: 'Kristen Protestan' },
    { value: 'Katolik', label: 'Katolik' },
    { value: 'Hindu', label: 'Hindu' },
    { value: 'Buddha', label: 'Buddha' },
    { value: 'Konghucu', label: 'Konghucu' },
];

export default function FormProfile({ mahasiswa }) {
    const getFotoPreviewUrl = () => {
        if (mahasiswa?.foto_url) return mahasiswa.foto_url;
        if (!mahasiswa?.foto) return null;
        if (mahasiswa.foto.startsWith('http') || mahasiswa.foto.startsWith('/')) return mahasiswa.foto;
        return `/storage/${mahasiswa.foto}`;
    };

    const { data, setData, post, processing, errors } = useForm({
        alamat: mahasiswa?.alamat || '',
        no_hp: mahasiswa?.no_hp || '',
        agama: mahasiswa?.agama || '',
        nama_ayah: mahasiswa?.nama_ayah || '',
        nama_ibu: mahasiswa?.nama_ibu || '',
        no_telp_ayah: mahasiswa?.no_telp_ayah || '',
        no_telp_ibu: mahasiswa?.no_telp_ibu || '',
        foto: null,
        hapus_foto: false,
        _method: 'PATCH',
    });

    const [previewImage, setPreviewImage] = useState(getFotoPreviewUrl());
    const [isPanduanOpen, setIsPanduanOpen] = useState(false);
    const fileInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('mahasiswa.profile.update-data'));
    };

    const openPanduan = () => setIsPanduanOpen(true);
    const closePanduan = () => setIsPanduanOpen(false);

    const handleLanjutUpload = () => {
        closePanduan();
        setTimeout(() => {
            if (fileInputRef.current) {
                fileInputRef.current.click();
            }
        }, 300); // Wait for modal animation to close
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
        <MahasiswaLayout title="Perbarui Data Profil">
            <Head title="Perbarui Data Profil" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-5xl space-y-4 md:space-y-5">
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
                                    <Link href={route('mahasiswa.profile')}>
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
                                    <Input type="text" value={mahasiswa?.nama || '-'} disabled className="bg-slate-100 cursor-not-allowed" />
                                </FormField>
                                <FormField label="NIM">
                                    <Input type="text" value={mahasiswa?.nim || '-'} disabled className="bg-slate-100 cursor-not-allowed" />
                                </FormField>
                                <FormField label="Program Studi">
                                    <Input type="text" value={mahasiswa?.prodi || '-'} disabled className="bg-slate-100 cursor-not-allowed" />
                                </FormField>
                                <FormField label="Jurusan">
                                    <Input type="text" value={mahasiswa?.jurusan || '-'} disabled className="bg-slate-100 cursor-not-allowed" />
                                </FormField>

                                <div className="md:col-span-2 border-t border-slate-200 my-2 pt-4">
                                    <h3 className="font-semibold text-slate-800 mb-4">Informasi Kontak & Pribadi</h3>
                                </div>

                                <FormField label="Agama" error={errors.agama}>
                                    <SelectDropdown
                                        value={data.agama}
                                        onChange={(selected) => setData('agama', selected ? selected.value : '')}
                                        options={agamaOptions}
                                        placeholder="Pilih Agama"
                                    />
                                </FormField>

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
                                    <h3 className="font-semibold text-slate-800 mb-4">Informasi Orang Tua</h3>
                                </div>

                                <FormField label="Nama Ayah" error={errors.nama_ayah}>
                                    <Input
                                        type="text"
                                        value={data.nama_ayah}
                                        onChange={(e) => setData('nama_ayah', e.target.value)}
                                        placeholder="Nama lengkap ayah"
                                    />
                                </FormField>

                                <FormField label="No Telp Ayah" error={errors.no_telp_ayah}>
                                    <Input
                                        type="text"
                                        value={data.no_telp_ayah}
                                        onChange={(e) => setData('no_telp_ayah', e.target.value)}
                                        placeholder="Nomor telepon ayah"
                                        maxLength="15"
                                    />
                                </FormField>

                                <FormField label="Nama Ibu" error={errors.nama_ibu}>
                                    <Input
                                        type="text"
                                        value={data.nama_ibu}
                                        onChange={(e) => setData('nama_ibu', e.target.value)}
                                        placeholder="Nama lengkap ibu"
                                    />
                                </FormField>

                                <FormField label="No Telp Ibu" error={errors.no_telp_ibu}>
                                    <Input
                                        type="text"
                                        value={data.no_telp_ibu}
                                        onChange={(e) => setData('no_telp_ibu', e.target.value)}
                                        placeholder="Nomor telepon ibu"
                                        maxLength="15"
                                    />
                                </FormField>

                                <div className="md:col-span-2 border-t border-slate-200 my-2 pt-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-slate-800">Foto Profil</h3>
                                        <button
                                            type="button"
                                            onClick={openPanduan}
                                            className="text-sm text-blue-600 hover:text-blue-800 font-medium underline flex items-center gap-1"
                                        >
                                            <Info className="h-4 w-4" />
                                            Lihat Panduan Foto
                                        </button>
                                    </div>
                                    <FormField label="" error={errors.foto} hint="Format JPG, JPEG, PNG. Maksimal 2MB.">
                                        <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                                            {previewImage ? (
                                                <div className="space-y-3">
                                                    <img src={previewImage} alt="Preview foto profil" className="mx-auto h-32 w-32 rounded-full object-cover ring-4 ring-white" />
                                                    <div className="flex flex-col justify-center gap-2 sm:flex-row">
                                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" ref={fileInputRef} id="foto-input" />
                                                        <button type="button" onClick={openPanduan} className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-100">
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
                                                        <p className="text-xs text-slate-500">Foto akan ditampilkan pada profil dan kartu mahasiswa Anda.</p>
                                                    </div>
                                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" ref={fileInputRef} id="foto-input" />
                                                    <button type="button" onClick={openPanduan} className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 shadow-sm">
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

            <Modal show={isPanduanOpen} onClose={closePanduan} maxWidth="2xl">
                <div className="p-3 sm:p-4">
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                        <h2 className="text-sm font-bold text-slate-800 uppercase sm:text-lg">Panduan Unggah Foto Profil Mahasiswa</h2>
                        <button onClick={closePanduan} className="text-slate-400 hover:text-slate-600 transition">
                            <X className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 sm:gap-4">
                        {/* Kolom Kiri: Foto yang Benar */}
                        <div className="md:col-span-2 space-y-1.5 rounded-lg border border-green-200 bg-green-50/50 p-2.5 sm:space-y-2 sm:rounded-xl sm:p-3 relative overflow-hidden">
                            <div className="absolute top-2 left-2 bg-green-500 rounded-full p-0.5 text-white shadow-sm sm:top-2.5 sm:left-2.5 sm:p-1">
                                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </div>
                            <img src="/panduan_foto/01_foto_yang_benar.png" alt="Foto yang benar" className="mx-auto max-h-36 w-auto rounded-lg shadow-sm border border-slate-200 sm:max-h-52" />
                            
                            <div className="text-center pb-1.5 border-b border-green-200 sm:pb-2">
                                <h3 className="text-xs font-bold text-green-700 uppercase tracking-wide sm:text-sm">Foto Yang Benar</h3>
                            </div>
                            
                            <ul className="text-[11px] text-slate-700 space-y-1 font-medium sm:space-y-1.5 sm:text-xs">
                                <li className="flex items-start gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5 sm:h-4 sm:w-4" /> Wajah Terlihat Jelas</li>
                                <li className="flex items-start gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5 sm:h-4 sm:w-4" /> Latar Belakang Polos</li>
                                <li className="flex items-start gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5 sm:h-4 sm:w-4" /> Menghadap Depan</li>
                                <li className="flex items-start gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5 sm:h-4 sm:w-4" /> Pencahayaan Merata</li>
                                <li className="flex items-start gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5 sm:h-4 sm:w-4" /> Pakai Almet Resmi & Logo</li>
                            </ul>
                        </div>

                        {/* Kolom Kanan: Hal yang harus dihindari */}
                        <div className="md:col-span-3 space-y-2 rounded-lg border border-red-200 bg-red-50/50 p-2.5 sm:space-y-3 sm:rounded-xl sm:p-3">
                            <div className="text-center pb-1.5 border-b border-red-200 sm:pb-2">
                                <h3 className="text-xs font-bold text-red-700 uppercase tracking-wide sm:text-sm">Hal Yang Harus Dihindari</h3>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                                <div className="relative group">
                                    <img src="/panduan_foto/02_hindari_foto_blur.png" alt="Blur" className="mx-auto max-h-20 w-auto rounded-md border border-red-200 shadow-sm transition-all group-hover:border-red-400 sm:max-h-28 sm:rounded-lg sm:border-2" />
                                    <div className="absolute top-1 left-1 bg-red-500 rounded-full p-0.5 text-white shadow-sm"><XCircle className="h-3 w-3 sm:h-4 sm:w-4" /></div>
                                </div>
                                <div className="relative group">
                                    <img src="/panduan_foto/03_hindari_pencahayaan_gelap.png" alt="Gelap" className="mx-auto max-h-20 w-auto rounded-md border border-red-200 shadow-sm transition-all group-hover:border-red-400 sm:max-h-28 sm:rounded-lg sm:border-2" />
                                    <div className="absolute top-1 left-1 bg-red-500 rounded-full p-0.5 text-white shadow-sm"><XCircle className="h-3 w-3 sm:h-4 sm:w-4" /></div>
                                </div>
                                <div className="relative group">
                                    <img src="/panduan_foto/04_hindari_wajah_tidak_jelas.png" alt="Wajah tidak jelas" className="mx-auto max-h-20 w-auto rounded-md border border-red-200 shadow-sm transition-all group-hover:border-red-400 sm:max-h-28 sm:rounded-lg sm:border-2" />
                                    <div className="absolute top-1 left-1 bg-red-500 rounded-full p-0.5 text-white shadow-sm"><XCircle className="h-3 w-3 sm:h-4 sm:w-4" /></div>
                                </div>
                                <div className="relative group">
                                    <img src="/panduan_foto/05_hindari_memakai_kacamata.png" alt="Memakai kacamata hitam" className="mx-auto max-h-20 w-auto rounded-md border border-red-200 shadow-sm transition-all group-hover:border-red-400 sm:max-h-28 sm:rounded-lg sm:border-2" />
                                    <div className="absolute top-1 left-1 bg-red-500 rounded-full p-0.5 text-white shadow-sm"><XCircle className="h-3 w-3 sm:h-4 sm:w-4" /></div>
                                </div>
                                <div className="relative group">
                                    <img src="/panduan_foto/06_hindari_latar_belakang_ramai.png" alt="Background ramai" className="mx-auto max-h-20 w-auto rounded-md border border-red-200 shadow-sm transition-all group-hover:border-red-400 sm:max-h-28 sm:rounded-lg sm:border-2" />
                                    <div className="absolute top-1 left-1 bg-red-500 rounded-full p-0.5 text-white shadow-sm"><XCircle className="h-3 w-3 sm:h-4 sm:w-4" /></div>
                                </div>
                                <div className="relative group">
                                    <img src="/panduan_foto/07_hindari_foto_tidak_resmi.png" alt="Baju tidak resmi" className="mx-auto max-h-20 w-auto rounded-md border border-red-200 shadow-sm transition-all group-hover:border-red-400 sm:max-h-28 sm:rounded-lg sm:border-2" />
                                    <div className="absolute top-1 left-1 bg-red-500 rounded-full p-0.5 text-white shadow-sm"><XCircle className="h-3 w-3 sm:h-4 sm:w-4" /></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 flex justify-end sm:mt-4">
                        <Button type="button" onClick={handleLanjutUpload} className="w-full sm:w-auto px-4 py-2 text-xs gap-2 bg-blue-600 hover:bg-blue-700 sm:px-6 sm:text-sm">
                            <ImagePlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            Saya Mengerti, Pilih Foto
                        </Button>
                    </div>
                </div>
            </Modal>
        </MahasiswaLayout>
    );
}
