import { Head, Link, useForm } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';
import { useState } from 'react';

export default function TambahMahasiswa({ prodis, dosens }) {
    const { data, setData, post, processing, errors } = useForm({
        nama: '',
        kode_prodi: '',
        id_dosen_wali: '',
        tahun_masuk: new Date().getFullYear(),
        tanggal_lahir: '',
        jenis_kelamin: '',
        alamat: '',
        no_hp: '',
        status: 'aktif',
        foto: null,
    });

    const [previewImage, setPreviewImage] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('baak.mahasiswa.store'));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('foto', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <BaakLayout title="Tambah Data Mahasiswa">
            <Head title="Tambah Data Mahasiswa" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-700">Tambah Data Mahasiswa</h1>
                    <p className="text-sm text-gray-600 mt-1">Isi form untuk menambah data mahasiswa baru</p>
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <i className="fas fa-info-circle mr-2"></i>
                            NIM akan digenerate otomatis. Password default sama dengan NIM.
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nama */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nama Lengkap Mahasiswa"
                                />
                                {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
                            </div>

                            {/* Program Studi */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Program Studi <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.kode_prodi}
                                    onChange={(e) => setData('kode_prodi', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Pilih Program Studi</option>
                                    {prodis.map((prodi) => (
                                        <option key={prodi.kode_prodi} value={prodi.kode_prodi}>
                                            {prodi.nama_prodi} - {prodi.fakultas.nama_fakultas}
                                        </option>
                                    ))}
                                </select>
                                {errors.kode_prodi && <p className="text-red-500 text-xs mt-1">{errors.kode_prodi}</p>}
                            </div>

                            {/* Tahun Masuk */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tahun Masuk <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.tahun_masuk}
                                    onChange={(e) => setData('tahun_masuk', e.target.value)}
                                    min="2000"
                                    max={new Date().getFullYear() + 1}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.tahun_masuk && <p className="text-red-500 text-xs mt-1">{errors.tahun_masuk}</p>}
                            </div>

                            {/* Dosen Wali */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Dosen Wali
                                </label>
                                <select
                                    value={data.id_dosen_wali}
                                    onChange={(e) => setData('id_dosen_wali', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Pilih Dosen Wali (Opsional)</option>
                                    {dosens.map((dosen) => (
                                        <option key={dosen.id_dosen} value={dosen.id_dosen}>
                                            {dosen.nama} - {dosen.nip}
                                        </option>
                                    ))}
                                </select>
                                {errors.id_dosen_wali && <p className="text-red-500 text-xs mt-1">{errors.id_dosen_wali}</p>}
                            </div>

                            {/* Tanggal Lahir */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tanggal Lahir <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={data.tanggal_lahir}
                                    onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.tanggal_lahir && <p className="text-red-500 text-xs mt-1">{errors.tanggal_lahir}</p>}
                            </div>

                            {/* Jenis Kelamin */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jenis Kelamin <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="Laki-laki"
                                            checked={data.jenis_kelamin === 'Laki-laki'}
                                            onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                            className="mr-2"
                                        />
                                        Laki-laki
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="Perempuan"
                                            checked={data.jenis_kelamin === 'Perempuan'}
                                            onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                            className="mr-2"
                                        />
                                        Perempuan
                                    </label>
                                </div>
                                {errors.jenis_kelamin && <p className="text-red-500 text-xs mt-1">{errors.jenis_kelamin}</p>}
                            </div>

                            {/* Nomor Telepon */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nomor Telepon
                                </label>
                                <input
                                    type="text"
                                    value={data.no_hp}
                                    onChange={(e) => setData('no_hp', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="08xxxxxxxxxx"
                                />
                                {errors.no_hp && <p className="text-red-500 text-xs mt-1">{errors.no_hp}</p>}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="aktif">Aktif</option>
                                    <option value="lulus">Lulus</option>
                                    <option value="keluar">Keluar</option>
                                    <option value="DO">DO (Drop Out)</option>
                                </select>
                                {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                            </div>

                            {/* Alamat */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Alamat
                                </label>
                                <textarea
                                    value={data.alamat}
                                    onChange={(e) => setData('alamat', e.target.value)}
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Alamat lengkap mahasiswa"
                                />
                                {errors.alamat && <p className="text-red-500 text-xs mt-1">{errors.alamat}</p>}
                            </div>

                            {/* Foto Diri */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Foto Diri
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    {previewImage ? (
                                        <div className="space-y-3">
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="mx-auto h-32 w-32 object-cover rounded-full"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPreviewImage(null);
                                                    setData('foto', null);
                                                }}
                                                className="text-red-500 text-sm hover:underline"
                                            >
                                                Hapus Foto
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                                            <p className="text-sm text-gray-600 mb-2">Pilih foto untuk diupload</p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                                id="foto-input"
                                            />
                                            <label
                                                htmlFor="foto-input"
                                                className="cursor-pointer inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700"
                                            >
                                                Pilih File
                                            </label>
                                        </>
                                    )}
                                </div>
                                {errors.foto && <p className="text-red-500 text-xs mt-1">{errors.foto}</p>}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                            <Link
                                href={route('baak.mahasiswa.index')}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Data'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </BaakLayout>
    );
}
