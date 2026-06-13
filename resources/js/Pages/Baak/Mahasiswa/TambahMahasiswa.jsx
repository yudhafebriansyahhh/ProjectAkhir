import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ImagePlus, Info, X } from 'lucide-react';
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

const agamaOptions = [
    { value: 'Islam', label: 'Islam' },
    { value: 'Kristen Protestan', label: 'Kristen Protestan' },
    { value: 'Katolik', label: 'Katolik' },
    { value: 'Hindu', label: 'Hindu' },
    { value: 'Buddha', label: 'Buddha' },
    { value: 'Konghucu', label: 'Konghucu' },
];

export default function TambahMahasiswa({ prodis = [], dosens = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        nama: '',
        kode_prodi: '',
        id_dosen_wali: '',
        tahun_masuk: new Date().getFullYear(),
        tanggal_lahir: '',
        jenis_kelamin: '',
        agama: '',
        alamat: '',
        no_hp: '',
        nama_ayah: '',
        nama_ibu: '',
        no_telp_ayah: '',
        no_telp_ibu: '',
        status: 'aktif',
        foto: null,
    });

    const [previewImage, setPreviewImage] = useState(null);
    const prodiOptions = prodis.map((prodi) => ({ value: prodi.kode_prodi, label: prodi.nama_prodi }));
    const dosenOptions = dosens.map((dosen) => ({ value: dosen.id_dosen, label: `${dosen.nama} - ${dosen.nip}` }));

    const handleSubmit = (event) => {
        event.preventDefault();
        post(route('baak.mahasiswa.store'));
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

    return (
        <BaakLayout title="Tambah Data Mahasiswa">
            <Head title="Tambah Data Mahasiswa" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5">
                    <PageHeader
                        title="Tambah Data Mahasiswa"
                        description="Isi data mahasiswa baru untuk sistem akademik."
                    />

                    <div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                        <p>NIM akan dibuat melalui tombol Generate NIM pada halaman daftar mahasiswa. Password default akan mengikuti NIM.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <FormCard
                            footer={
                                <div className="grid gap-2 sm:flex sm:justify-end">
                                    <Link href={route('baak.mahasiswa.index')} className="order-2 sm:order-1">
                                        <Button type="button" variant="outline" className="w-full sm:w-auto">
                                            Batal
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing} className="order-1 w-full sm:order-2 sm:w-auto">
                                        {processing ? 'Menyimpan...' : 'Simpan Data'}
                                    </Button>
                                </div>
                            }
                        >
                            <div className="grid gap-5 md:grid-cols-2">
                                <FormField label="Nama Lengkap" required error={errors.nama}>
                                    <Input
                                        type="text"
                                        value={data.nama}
                                        onChange={(event) => setData('nama', event.target.value)}
                                        placeholder="Nama lengkap mahasiswa"
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

                                <FormField label="Tahun Masuk" required error={errors.tahun_masuk}>
                                    <Input
                                        type="number"
                                        value={data.tahun_masuk}
                                        onChange={(event) => setData('tahun_masuk', event.target.value)}
                                        min="2000"
                                        max={new Date().getFullYear() + 1}
                                        className={errors.tahun_masuk ? 'border-red-300 focus-visible:ring-red-500' : ''}
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

                                <FormField label="Agama" required error={errors.agama}>
                                    <SelectDropdown
                                        value={data.agama}
                                        onChange={(selected) => setData('agama', selected ? selected.value : '')}
                                        options={agamaOptions}
                                        placeholder="Pilih Agama"
                                    />
                                </FormField>

                                <FormField label="Nomor Telepon" error={errors.no_hp}>
                                    <Input
                                        type="text"
                                        value={data.no_hp}
                                        onChange={(event) => setData('no_hp', event.target.value)}
                                        placeholder="08xxxxxxxxxx"
                                        className={errors.no_hp ? 'border-red-300 focus-visible:ring-red-500' : ''}
                                    />
                                </FormField>

                                <FormField label="Nama Ayah" error={errors.nama_ayah}>
                                    <Input
                                        type="text"
                                        value={data.nama_ayah}
                                        onChange={(event) => setData('nama_ayah', event.target.value)}
                                        placeholder="Nama Ayah"
                                        className={errors.nama_ayah ? 'border-red-300 focus-visible:ring-red-500' : ''}
                                    />
                                </FormField>

                                <FormField label="Nama Ibu" error={errors.nama_ibu}>
                                    <Input
                                        type="text"
                                        value={data.nama_ibu}
                                        onChange={(event) => setData('nama_ibu', event.target.value)}
                                        placeholder="Nama Ibu"
                                        className={errors.nama_ibu ? 'border-red-300 focus-visible:ring-red-500' : ''}
                                    />
                                </FormField>

                                <FormField label="No Telp Ayah" error={errors.no_telp_ayah}>
                                    <Input
                                        type="text"
                                        value={data.no_telp_ayah}
                                        onChange={(event) => setData('no_telp_ayah', event.target.value)}
                                        placeholder="08xxxxxxxxxx"
                                        className={errors.no_telp_ayah ? 'border-red-300 focus-visible:ring-red-500' : ''}
                                    />
                                </FormField>

                                <FormField label="No Telp Ibu" error={errors.no_telp_ibu}>
                                    <Input
                                        type="text"
                                        value={data.no_telp_ibu}
                                        onChange={(event) => setData('no_telp_ibu', event.target.value)}
                                        placeholder="08xxxxxxxxxx"
                                        className={errors.no_telp_ibu ? 'border-red-300 focus-visible:ring-red-500' : ''}
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
                                            placeholder="Alamat lengkap mahasiswa"
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
