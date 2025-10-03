// resources/js/Pages/Baak/Kelas/Edit.jsx

import { Head, Link, useForm } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Edit({ kelas, mataKuliahPeriode, dosen }) {
    const { data, setData, put, processing, errors } = useForm({
        nama_kelas: kelas.nama_kelas || '',
        id_mk_periode: kelas.id_mk_periode || '',
        id_dosen: kelas.id_dosen || '',
        ruang_kelas: kelas.ruang_kelas || '',
        hari: kelas.hari || '',
        jam_mulai: kelas.jam_mulai ? kelas.jam_mulai.substring(0, 5) : '',
        jam_selesai: kelas.jam_selesai ? kelas.jam_selesai.substring(0, 5) : '',
        kapasitas: kelas.kapasitas || 40,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('baak.kelas.update', kelas.id_kelas));
    };

    const hariOptions = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    // Get semester from kelas
    const currentSemester = kelas.mata_kuliah_periode?.semester_ditawarkan;

    return (
        <BaakLayout title="Edit Kelas">
            <Head title="Edit Kelas" />

            <div className="p-4 md:p-6 max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={route('baak.kelas.index')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center mb-4"
                    >
                        <i className="fas fa-arrow-left mr-2"></i>
                        Kembali ke Daftar
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Kelas</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Perbarui informasi kelas perkuliahan
                    </p>
                </div>

                {/* Info Kelas (Read-Only) */}
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-blue-900 mb-3">
                        <i className="fas fa-info-circle mr-2"></i>
                        Informasi Kelas:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                            <span className="text-blue-700 font-medium">Periode:</span>
                            <span className="ml-2 text-blue-900">
                                {kelas.mata_kuliah_periode?.tahun_ajaran}{' '}
                                {kelas.mata_kuliah_periode?.jenis_semester.charAt(0).toUpperCase() +
                                 kelas.mata_kuliah_periode?.jenis_semester.slice(1)}
                            </span>
                        </div>
                        <div>
                            <span className="text-blue-700 font-medium">Semester:</span>
                            <span className="ml-2 text-blue-900">
                                Semester {currentSemester}
                            </span>
                        </div>
                        <div>
                            <span className="text-blue-700 font-medium">Kode MK:</span>
                            <span className="ml-2 text-blue-900">{kelas.mata_kuliah?.kode_matkul}</span>
                        </div>
                        <div>
                            <span className="text-blue-700 font-medium">Nama MK:</span>
                            <span className="ml-2 text-blue-900">{kelas.mata_kuliah?.nama_matkul}</span>
                        </div>
                        <div>
                            <span className="text-blue-700 font-medium">Prodi:</span>
                            <span className="ml-2 text-blue-900">
                                {kelas.mata_kuliah?.prodi?.nama_prodi || 'Umum'}
                            </span>
                        </div>
                        <div>
                            <span className="text-blue-700 font-medium">SKS:</span>
                            <span className="ml-2 text-blue-900">{kelas.mata_kuliah?.sks}</span>
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-blue-700">
                        <i className="fas fa-lock mr-1"></i>
                        Periode dan mata kuliah tidak dapat diubah. Untuk mengubah, hapus kelas ini dan buat kelas baru.
                    </p>
                </div>

                {/* Form Edit */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-3">Detail Kelas yang Dapat Diubah</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nama Kelas */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nama Kelas <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.nama_kelas}
                                onChange={(e) => setData('nama_kelas', e.target.value.toUpperCase())}
                                placeholder="Contoh: A, B, C"
                                maxLength={10}
                                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.nama_kelas ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.nama_kelas && (
                                <p className="mt-1 text-sm text-red-600">{errors.nama_kelas}</p>
                            )}
                        </div>

                        {/* Dosen Pengampu */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dosen Pengampu <span className="text-red-600">*</span>
                            </label>
                            <select
                                value={data.id_dosen}
                                onChange={(e) => setData('id_dosen', e.target.value)}
                                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.id_dosen ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                <option value="">-- Pilih Dosen --</option>
                                {dosen.map((d) => (
                                    <option key={d.id_dosen} value={d.id_dosen}>
                                        {d.nama} - {d.nip} ({d.prodi?.nama_prodi || 'N/A'})
                                    </option>
                                ))}
                            </select>
                            {errors.id_dosen && (
                                <p className="mt-1 text-sm text-red-600">{errors.id_dosen}</p>
                            )}
                        </div>

                        {/* Hari */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hari <span className="text-red-600">*</span>
                            </label>
                            <select
                                value={data.hari}
                                onChange={(e) => setData('hari', e.target.value)}
                                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.hari ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                <option value="">-- Pilih Hari --</option>
                                {hariOptions.map((hari) => (
                                    <option key={hari} value={hari}>{hari}</option>
                                ))}
                            </select>
                            {errors.hari && (
                                <p className="mt-1 text-sm text-red-600">{errors.hari}</p>
                            )}
                        </div>

                        {/* Ruang Kelas */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ruang Kelas <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.ruang_kelas}
                                onChange={(e) => setData('ruang_kelas', e.target.value.toUpperCase())}
                                placeholder="Contoh: R201, LAB1"
                                maxLength={50}
                                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.ruang_kelas ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.ruang_kelas && (
                                <p className="mt-1 text-sm text-red-600">{errors.ruang_kelas}</p>
                            )}
                        </div>

                        {/* Jam Mulai */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Jam Mulai <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="time"
                                value={data.jam_mulai}
                                onChange={(e) => setData('jam_mulai', e.target.value)}
                                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.jam_mulai ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.jam_mulai && (
                                <p className="mt-1 text-sm text-red-600">{errors.jam_mulai}</p>
                            )}
                        </div>

                        {/* Jam Selesai */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Jam Selesai <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="time"
                                value={data.jam_selesai}
                                onChange={(e) => setData('jam_selesai', e.target.value)}
                                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.jam_selesai ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.jam_selesai && (
                                <p className="mt-1 text-sm text-red-600">{errors.jam_selesai}</p>
                            )}
                        </div>

                        {/* Kapasitas */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kapasitas Mahasiswa <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="number"
                                min="20"
                                max="50"
                                value={data.kapasitas}
                                onChange={(e) => setData('kapasitas', e.target.value)}
                                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.kapasitas ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.kapasitas && (
                                <p className="mt-1 text-sm text-red-600">{errors.kapasitas}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                Kapasitas minimal 20 dan maksimal 50 mahasiswa per kelas
                            </p>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                        <Link
                            href={route('baak.kelas.index')}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save"></i>
                                    <span>Simpan Perubahan</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </BaakLayout>
    );
}
