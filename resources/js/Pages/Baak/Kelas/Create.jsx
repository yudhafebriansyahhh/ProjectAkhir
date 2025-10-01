import { Head, Link, useForm } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Create({ mata_kuliah, dosen }) {
    const { data, setData, post, processing, errors } = useForm({
        nama_kelas: '',
        kode_matkul: '',
        id_dosen: '',
        ruang_kelas: '',
        hari: '',
        jam_mulai: '',
        jam_selesai: '',
        kapasitas: 40,
    });

    const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('baak.kelas.store'));
    };

    return (
        <BaakLayout title="Tambah Kelas">
            <Head title="Tambah Kelas" />

            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={route('baak.kelas.index')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-3 inline-flex items-center gap-1"
                    >
                        <i className="fas fa-arrow-left"></i>
                        <span>Kembali ke Daftar Kelas</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-700 mt-2">Tambah Kelas Baru</h1>
                    <p className="text-sm text-gray-600 mt-1">Isi form untuk menambah kelas perkuliahan baru</p>
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <i className="fas fa-info-circle mr-2"></i>
                            Sistem akan otomatis mengecek bentrok jadwal dosen dan ruangan.
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Mata Kuliah */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mata Kuliah <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.kode_matkul}
                                    onChange={(e) => setData('kode_matkul', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.kode_matkul ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">-- Pilih Mata Kuliah --</option>
                                    {mata_kuliah.map((mk) => (
                                        <option key={mk.kode_matkul} value={mk.kode_matkul}>
                                            {mk.kode_matkul} - {mk.nama_matkul} ({mk.sks} SKS) - Semester {mk.semester}
                                        </option>
                                    ))}
                                </select>
                                {errors.kode_matkul && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.kode_matkul}
                                    </p>
                                )}
                            </div>

                            {/* Nama Kelas */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Kelas <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.nama_kelas}
                                    onChange={(e) => setData('nama_kelas', e.target.value)}
                                    placeholder="Contoh: A, B, C"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.nama_kelas ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    maxLength="10"
                                />
                                {errors.nama_kelas && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.nama_kelas}
                                    </p>
                                )}
                            </div>

                            {/* Dosen */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Dosen Pengampu <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.id_dosen}
                                    onChange={(e) => setData('id_dosen', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.id_dosen ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">-- Pilih Dosen --</option>
                                    {dosen.map((d) => (
                                        <option key={d.id_dosen} value={d.id_dosen}>
                                            {d.nama} - {d.prodi?.nama_prodi}
                                        </option>
                                    ))}
                                </select>
                                {errors.id_dosen && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.id_dosen}
                                    </p>
                                )}
                            </div>

                            {/* Ruang Kelas */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ruang Kelas <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.ruang_kelas}
                                    onChange={(e) => setData('ruang_kelas', e.target.value)}
                                    placeholder="Contoh: R101, Lab Komputer 1"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.ruang_kelas ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    maxLength="20"
                                />
                                {errors.ruang_kelas && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.ruang_kelas}
                                    </p>
                                )}
                            </div>

                            {/* Hari */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hari <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.hari}
                                    onChange={(e) => setData('hari', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.hari ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">-- Pilih Hari --</option>
                                    {hariList.map((h) => (
                                        <option key={h} value={h}>{h}</option>
                                    ))}
                                </select>
                                {errors.hari && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.hari}
                                    </p>
                                )}
                            </div>

                            {/* Jam Mulai */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jam Mulai <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    value={data.jam_mulai}
                                    onChange={(e) => setData('jam_mulai', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.jam_mulai ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.jam_mulai && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.jam_mulai}
                                    </p>
                                )}
                            </div>

                            {/* Jam Selesai */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jam Selesai <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    value={data.jam_selesai}
                                    onChange={(e) => setData('jam_selesai', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.jam_selesai ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.jam_selesai && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.jam_selesai}
                                    </p>
                                )}
                            </div>

                            {/* Kapasitas */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kapasitas Mahasiswa <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.kapasitas}
                                    onChange={(e) => setData('kapasitas', e.target.value)}
                                    min="20"
                                    max="50"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.kapasitas ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.kapasitas && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.kapasitas}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Minimal 20, maksimal 50 mahasiswa
                                </p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                            <Link
                                href={route('baak.kelas.index')}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 text-center transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
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
