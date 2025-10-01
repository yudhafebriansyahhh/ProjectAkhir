import { Head, Link, useForm } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Edit({ fakultas }) {
    const { data, setData, put, processing, errors } = useForm({
        kode_fakultas: fakultas.kode_fakultas || '',
        nama_fakultas: fakultas.nama_fakultas || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('baak.fakultas.update', fakultas.kode_fakultas));
    };

    return (
        <BaakLayout title="Edit Fakultas">
            <Head title="Edit Fakultas" />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Edit Fakultas</h1>
                    <p className="text-gray-600">Ubah data fakultas yang sudah ada</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="grid grid-cols-1 gap-6">
                            {/* Kode Fakultas */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kode Fakultas <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.kode_fakultas}
                                    onChange={(e) => setData('kode_fakultas', e.target.value.toUpperCase())}
                                    placeholder="Contoh: FT"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.kode_fakultas ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    maxLength="10"
                                />
                                {errors.kode_fakultas && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.kode_fakultas}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Maksimal 10 karakter, akan otomatis diubah ke huruf kapital
                                </p>
                            </div>

                            {/* Nama Fakultas */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Fakultas <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.nama_fakultas}
                                    onChange={(e) => setData('nama_fakultas', e.target.value)}
                                    placeholder="Contoh: Fakultas Teknik"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.nama_fakultas ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    maxLength="100"
                                />
                                {errors.nama_fakultas && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.nama_fakultas}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Maksimal 100 karakter
                                </p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                            <Link
                                href={route('baak.fakultas.index')}
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
