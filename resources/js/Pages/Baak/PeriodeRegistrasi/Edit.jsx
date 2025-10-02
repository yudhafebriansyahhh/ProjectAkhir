import { Head, Link, useForm } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Edit({ periode }) {
    const { data, setData, put, processing, errors } = useForm({
        tanggal_mulai: periode.tanggal_mulai || '',
        tanggal_selesai: periode.tanggal_selesai || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('baak.periode-registrasi.update', periode.id_periode));
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <BaakLayout title="Edit Periode Registrasi">
            <Head title="Edit Periode Registrasi" />

            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={route('baak.periode-registrasi.index')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-3 inline-flex items-center gap-1"
                    >
                        <i className="fas fa-arrow-left"></i>
                        <span>Kembali ke Daftar Periode</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-700 mt-2">Edit Periode Registrasi</h1>
                    <p className="text-sm text-gray-600 mt-1">Ubah tanggal periode registrasi yang sudah ada</p>
                </div>

                {/* Info Periode */}
                <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Informasi Periode</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Tahun Ajaran</p>
                            <p className="font-semibold text-gray-900">{periode.tahun_ajaran}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Jenis Semester</p>
                            <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-lg capitalize">
                                {periode.jenis_semester}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Status</p>
                            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-lg ${
                                periode.status === 'aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {periode.status === 'aktif' ? 'Aktif' : 'Tutup'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Tanggal Mulai */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tanggal Mulai <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={data.tanggal_mulai}
                                    onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.tanggal_mulai ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.tanggal_mulai && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.tanggal_mulai}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Sebelumnya: {formatDate(periode.tanggal_mulai)}
                                </p>
                            </div>

                            {/* Tanggal Selesai */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tanggal Selesai <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={data.tanggal_selesai}
                                    onChange={(e) => setData('tanggal_selesai', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.tanggal_selesai ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.tanggal_selesai && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.tanggal_selesai}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Sebelumnya: {formatDate(periode.tanggal_selesai)}
                                </p>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex gap-3">
                                <i className="fas fa-exclamation-triangle text-yellow-600 mt-0.5"></i>
                                <div className="text-sm text-yellow-800">
                                    <p className="font-medium mb-1">Perhatian:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Anda hanya bisa mengubah tanggal mulai dan selesai</li>
                                        <li>Tahun ajaran dan jenis semester tidak dapat diubah</li>
                                        <li>Pastikan tanggal selesai lebih besar dari tanggal mulai</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                            <Link
                                href={route('baak.periode-registrasi.index')}
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
