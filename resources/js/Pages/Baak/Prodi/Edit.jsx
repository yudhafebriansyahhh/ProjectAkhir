import { Head, Link, useForm } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Edit({ prodi, fakultas }) {
    const { data, setData, put, processing, errors } = useForm({
        kode_prodi: prodi.kode_prodi || '',
        kode_fakultas: prodi.kode_fakultas || '',
        nama_prodi: prodi.nama_prodi || '',
        jenjang: prodi.jenjang || 'S1',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('baak.prodi.update', prodi.kode_prodi));
    };

    return (
        <BaakLayout title="Edit Program Studi">
            <Head title="Edit Program Studi" />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Edit Program Studi</h1>
                    <p className="text-gray-600">Ubah data program studi yang sudah ada</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Kode Prodi */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kode Program Studi <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.kode_prodi}
                                    onChange={(e) => setData('kode_prodi', e.target.value.toUpperCase())}
                                    placeholder="Contoh: TIF"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.kode_prodi ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    maxLength="10"
                                />
                                {errors.kode_prodi && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.kode_prodi}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Maksimal 2 karakter angka
                                </p>
                            </div>

                            {/* Fakultas */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fakultas <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.kode_fakultas}
                                    onChange={(e) => setData('kode_fakultas', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.kode_fakultas ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">-- Pilih Fakultas --</option>
                                    {fakultas.map((item) => (
                                        <option key={item.kode_fakultas} value={item.kode_fakultas}>
                                            {item.nama_fakultas}
                                        </option>
                                    ))}
                                </select>
                                {errors.kode_fakultas && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.kode_fakultas}
                                    </p>
                                )}
                            </div>

                            {/* Nama Prodi */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Program Studi <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.nama_prodi}
                                    onChange={(e) => setData('nama_prodi', e.target.value)}
                                    placeholder="Contoh: Teknik Informatika"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.nama_prodi ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    maxLength="100"
                                />
                                {errors.nama_prodi && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.nama_prodi}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Maksimal 100 karakter
                                </p>
                            </div>

                            {/* Jenjang */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jenjang <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                    {['D3', 'D4', 'S1', 'S2', 'S3'].map((jenjang) => (
                                        <label
                                            key={jenjang}
                                            className={`flex items-center justify-center px-4 py-3 border-2 rounded-lg cursor-pointer transition-all text-sm font-medium ${
                                                data.jenjang === jenjang
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'border-gray-300 hover:border-blue-300 text-gray-700'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="jenjang"
                                                value={jenjang}
                                                checked={data.jenjang === jenjang}
                                                onChange={(e) => setData('jenjang', e.target.value)}
                                                className="sr-only"
                                            />
                                            <span>{jenjang}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.jenjang && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.jenjang}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                            <Link
                                href={route('baak.prodi.index')}
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
