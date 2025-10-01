import { Head, Link, useForm } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Edit({ mataKuliah }) {
    const { data, setData, put, processing, errors } = useForm({
        kode_matkul: mataKuliah.kode_matkul || '',
        nama_matkul: mataKuliah.nama_matkul || '',
        sks: mataKuliah.sks || 3,
        semester: mataKuliah.semester || 1,
        deskripsi: mataKuliah.deskripsi || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('baak.mata-kuliah.update', mataKuliah.kode_matkul));
    };

    return (
        <BaakLayout title="Edit Mata Kuliah">
            <Head title="Edit Mata Kuliah" />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Edit Mata Kuliah</h1>
                    <p className="text-gray-600">Ubah data mata kuliah yang sudah ada</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Kode Mata Kuliah */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kode Mata Kuliah <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.kode_matkul}
                                    onChange={(e) => setData('kode_matkul', e.target.value.toUpperCase())}
                                    placeholder="Contoh: TIF101"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.kode_matkul ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    maxLength="10"
                                />
                                {errors.kode_matkul && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.kode_matkul}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Format: 3 huruf + 3 angka (contoh: TIF101)
                                </p>
                            </div>

                            {/* SKS */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    SKS <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.sks}
                                    onChange={(e) => setData('sks', parseInt(e.target.value))}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.sks ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    {[1, 2, 3, 4, 5, 6].map((sks) => (
                                        <option key={sks} value={sks}>
                                            {sks} SKS
                                        </option>
                                    ))}
                                </select>
                                {errors.sks && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.sks}
                                    </p>
                                )}
                            </div>

                            {/* Nama Mata Kuliah */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Mata Kuliah <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.nama_matkul}
                                    onChange={(e) => setData('nama_matkul', e.target.value)}
                                    placeholder="Contoh: Algoritma dan Pemrograman"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.nama_matkul ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    maxLength="100"
                                />
                                {errors.nama_matkul && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.nama_matkul}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Maksimal 100 karakter
                                </p>
                            </div>

                            {/* Semester */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Semester <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                        <label
                                            key={sem}
                                            className={`flex items-center justify-center px-4 py-3 border-2 rounded-lg cursor-pointer transition-all text-sm font-medium ${
                                                data.semester === sem
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'border-gray-300 hover:border-blue-300 text-gray-700'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="semester"
                                                value={sem}
                                                checked={data.semester === sem}
                                                onChange={(e) => setData('semester', parseInt(e.target.value))}
                                                className="sr-only"
                                            />
                                            <span>{sem}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.semester && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.semester}
                                    </p>
                                )}
                            </div>

                            {/* Deskripsi */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={data.deskripsi}
                                    onChange={(e) => setData('deskripsi', e.target.value)}
                                    rows="4"
                                    placeholder="Deskripsi mata kuliah (opsional)"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.deskripsi ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.deskripsi && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.deskripsi}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                            <Link
                                href={route('baak.mata-kuliah.index')}
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
