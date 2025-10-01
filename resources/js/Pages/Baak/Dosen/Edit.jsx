import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Edit({ dosen, prodi }) {
    const { data, setData, post, processing, errors } = useForm({
        nip: dosen.nip || '',
        nama: dosen.nama || '',
        kode_prodi: dosen.kode_prodi || '',
        jenis_kelamin: dosen.jenis_kelamin || '',
        alamat: dosen.alamat || '',
        no_hp: dosen.no_hp || '',
        foto: null,
        _method: 'PUT',
    });

    const [previewImage, setPreviewImage] = useState(
        dosen.foto ? `/storage/${dosen.foto}` : null
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('baak.dosen.update', dosen.id_dosen));
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
        <BaakLayout title="Edit Dosen">
            <Head title="Edit Dosen" />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Edit Data Dosen</h1>
                    <p className="text-gray-600">Ubah data dosen yang sudah ada</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* NIP */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    NIP <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.nip}
                                    onChange={(e) => setData('nip', e.target.value)}
                                    placeholder="Nomor Induk Pegawai"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.nip ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    maxLength="20"
                                />
                                {errors.nip && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.nip}
                                    </p>
                                )}
                            </div>

                            {/* Nama */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    placeholder="Nama Lengkap Dosen"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.nama ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    maxLength="100"
                                />
                                {errors.nama && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.nama}
                                    </p>
                                )}
                            </div>

                            {/* Program Studi */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Program Studi <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.kode_prodi}
                                    onChange={(e) => setData('kode_prodi', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.kode_prodi ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">-- Pilih Program Studi --</option>
                                    {prodi.map((item) => (
                                        <option key={item.kode_prodi} value={item.kode_prodi}>
                                            {item.nama_prodi} - {item.fakultas?.nama_fakultas}
                                        </option>
                                    ))}
                                </select>
                                {errors.kode_prodi && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.kode_prodi}
                                    </p>
                                )}
                            </div>

                            {/* Jenis Kelamin */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jenis Kelamin <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            value="Laki-laki"
                                            checked={data.jenis_kelamin === 'Laki-laki'}
                                            onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                            className="mr-2"
                                        />
                                        <span className="text-sm">Laki-laki</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            value="Perempuan"
                                            checked={data.jenis_kelamin === 'Perempuan'}
                                            onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                            className="mr-2"
                                        />
                                        <span className="text-sm">Perempuan</span>
                                    </label>
                                </div>
                                {errors.jenis_kelamin && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.jenis_kelamin}
                                    </p>
                                )}
                            </div>

                            {/* Nomor HP */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nomor HP
                                </label>
                                <input
                                    type="text"
                                    value={data.no_hp}
                                    onChange={(e) => setData('no_hp', e.target.value)}
                                    placeholder="08xxxxxxxxxx"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.no_hp ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    maxLength="15"
                                />
                                {errors.no_hp && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.no_hp}
                                    </p>
                                )}
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
                                    placeholder="Alamat lengkap dosen"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.alamat ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.alamat && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.alamat}
                                    </p>
                                )}
                            </div>

                            {/* Foto */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Foto Dosen
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    {previewImage ? (
                                        <div className="space-y-3">
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="mx-auto h-32 w-32 object-cover rounded-full"
                                            />
                                            <div className="flex gap-2 justify-center">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                    id="foto-input"
                                                />
                                                <label
                                                    htmlFor="foto-input"
                                                    className="cursor-pointer inline-block px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-sm font-medium text-blue-700"
                                                >
                                                    Ganti Foto
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPreviewImage(null);
                                                        setData('foto', null);
                                                    }}
                                                    className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-sm font-medium text-red-700"
                                                >
                                                    Hapus Foto
                                                </button>
                                            </div>
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
                                {errors.foto && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.foto}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Format: JPG, JPEG, PNG. Maksimal 2MB
                                </p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                            <Link
                                href={route('baak.dosen.index')}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 text-center transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
                            >
                                {processing ? 'Menyimpan...' : 'Update Data'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </BaakLayout>
    );
}
