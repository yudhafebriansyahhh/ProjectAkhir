import { Head, Link, useForm } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Edit({ pengaturan }) {
    const { data, setData, put, processing, errors } = useForm({
        semester_ditawarkan: pengaturan.semester_ditawarkan || '',
        catatan: pengaturan.catatan || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('baak.pengaturan-krs.update', pengaturan.id_mk_periode));
    };

    // Get semester options based on jenis_semester
    const getSemesterOptions = () => {
        if (pengaturan.jenis_semester === 'ganjil') {
            return [1, 3, 5, 7];
        } else if (pengaturan.jenis_semester === 'genap') {
            return [2, 4, 6, 8];
        }
        return [1, 2, 3, 4, 5, 6, 7, 8]; // pendek
    };

    return (
        <BaakLayout title="Edit Pengaturan Mata Kuliah">
            <Head title="Edit Pengaturan Mata Kuliah" />

            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={route('baak.pengaturan-krs.index')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-3 inline-flex items-center gap-1"
                    >
                        <i className="fas fa-arrow-left"></i>
                        <span>Kembali ke Daftar</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-700 mt-2">
                        Edit Pengaturan Mata Kuliah
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Perbarui semester dan catatan pengaturan mata kuliah KRS
                    </p>
                </div>

                {/* Info Mata Kuliah (Read-Only) */}
                <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        Informasi Mata Kuliah
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Kode Mata Kuliah</p>
                            <p className="font-semibold text-gray-900">
                                {pengaturan.mata_kuliah?.kode_matkul}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Nama Mata Kuliah</p>
                            <p className="font-semibold text-gray-900">
                                {pengaturan.mata_kuliah?.nama_matkul}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Program Studi</p>
                            <p className="font-semibold text-gray-900">
                                {pengaturan.prodi?.nama_prodi}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">SKS</p>
                            <p className="font-semibold text-gray-900">
                                {pengaturan.mata_kuliah?.sks} SKS
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Kategori</p>
                            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-lg capitalize ${
                                pengaturan.mata_kuliah?.kategori === 'wajib' ? 'bg-red-100 text-red-700' :
                                pengaturan.mata_kuliah?.kategori === 'pilihan' ? 'bg-blue-100 text-blue-700' :
                                'bg-green-100 text-green-700'
                            }`}>
                                {pengaturan.mata_kuliah?.kategori}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Periode</p>
                            <p className="font-semibold text-gray-900 capitalize">
                                {pengaturan.tahun_ajaran} - {pengaturan.jenis_semester}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">
                            Detail yang Dapat Diubah
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Semester Ditawarkan */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Semester Ditawarkan <span className="text-red-600">*</span>
                                </label>
                                <select
                                    value={data.semester_ditawarkan}
                                    onChange={(e) => setData('semester_ditawarkan', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.semester_ditawarkan ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Pilih Semester</option>
                                    {getSemesterOptions().map(sem => (
                                        <option key={sem} value={sem}>
                                            Semester {sem}
                                        </option>
                                    ))}
                                </select>
                                {errors.semester_ditawarkan && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.semester_ditawarkan}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    Sebelumnya: Semester {pengaturan.semester_ditawarkan}
                                </p>
                            </div>

                            {/* Catatan */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Catatan (Opsional)
                                </label>
                                <input
                                    type="text"
                                    value={data.catatan}
                                    onChange={(e) => setData('catatan', e.target.value)}
                                    placeholder="Contoh: Khusus mahasiswa ngulang"
                                    maxLength={500}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.catatan ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.catatan && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.catatan}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex gap-3">
                                <i className="fas fa-exclamation-triangle text-yellow-600 mt-0.5"></i>
                                <div className="text-sm text-yellow-800">
                                    <p className="font-medium mb-1">Perhatian:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Periode, prodi, dan mata kuliah tidak dapat diubah</li>
                                        <li>Semester hanya bisa dipilih sesuai jenis semester (ganjil/genap)</li>
                                        <li>Pastikan tidak ada duplikasi semester untuk mata kuliah yang sama</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                            <Link
                                href={route('baak.pengaturan-krs.index')}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 text-center transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        <span>Menyimpan...</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-save"></i>
                                        <span>Update Data</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </BaakLayout>
    );
}
