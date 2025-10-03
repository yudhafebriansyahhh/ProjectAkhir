import { Head, Link, useForm } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Create({ prodi }) {
    const { data, setData, post, processing, errors } = useForm({
        kode_matkul: '',
        nama_matkul: '',
        sks: 2,
        kode_prodi: '',
        kategori: 'wajib',
        is_active: true,
        deskripsi: '',
    });

    const kategoriList = [
        { value: 'wajib', label: 'Mata Kuliah Wajib' },
        { value: 'pilihan', label: 'Mata Kuliah Pilihan' },
        { value: 'umum', label: 'Mata Kuliah Umum (Semua Prodi)' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('baak.mata-kuliah.store'));
    };

    return (
        <BaakLayout title="Tambah Mata Kuliah">
            <Head title="Tambah Mata Kuliah" />

            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={route('baak.mata-kuliah.index')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-3 inline-flex items-center gap-1"
                    >
                        <i className="fas fa-arrow-left"></i>
                        <span>Kembali ke Daftar Mata Kuliah</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-700 mt-2">Tambah Mata Kuliah Baru</h1>
                    <p className="text-sm text-gray-600 mt-1">Isi form untuk menambah mata kuliah baru</p>
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <i className="fas fa-info-circle mr-2"></i>
                            Pilih kategori "Umum" untuk mata kuliah yang bisa diambil semua prodi (Pancasila, Bahasa Inggris, dll).
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
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
                                    placeholder="Contoh: TIF101, SI201"
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
                            </div>

                            {/* Nama Mata Kuliah */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Mata Kuliah <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.nama_matkul}
                                    onChange={(e) => setData('nama_matkul', e.target.value)}
                                    placeholder="Nama lengkap mata kuliah"
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
                            </div>

                            {/* SKS */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    SKS (Satuan Kredit Semester) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.sks}
                                    onChange={(e) => setData('sks', e.target.value)}
                                    min="1"
                                    max="6"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.sks ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.sks && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.sks}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Minimal 1 SKS, maksimal 6 SKS
                                </p>
                            </div>

                            {/* Kategori */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kategori Mata Kuliah <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.kategori}
                                    onChange={(e) => {
                                        setData('kategori', e.target.value);
                                        // Jika kategori umum, reset kode_prodi
                                        if (e.target.value === 'umum') {
                                            setData('kode_prodi', '');
                                        }
                                    }}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.kategori ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    {kategoriList.map((item) => (
                                        <option key={item.value} value={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.kategori && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.kategori}
                                    </p>
                                )}
                            </div>

                            {/* Program Studi */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Program Studi {data.kategori !== 'umum' && <span className="text-red-500">*</span>}
                                </label>
                                <select
                                    value={data.kode_prodi}
                                    onChange={(e) => setData('kode_prodi', e.target.value)}
                                    disabled={data.kategori === 'umum'}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        data.kategori === 'umum' ? 'bg-gray-100 cursor-not-allowed' : ''
                                    } ${errors.kode_prodi ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    <option value="">
                                        {data.kategori === 'umum' ? 'Semua Program Studi' : '-- Pilih Program Studi --'}
                                    </option>
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
                                {data.kategori === 'umum' && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Mata kuliah umum bisa diambil oleh semua program studi
                                    </p>
                                )}
                            </div>

                            {/* Status Aktif */}
                            <div className="md:col-span-2">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm font-medium text-gray-700">
                                        Aktifkan mata kuliah ini
                                    </span>
                                </label>
                                <p className="text-xs text-gray-500 mt-1 ml-6">
                                    Hanya mata kuliah aktif yang bisa diambil mahasiswa saat KRS
                                </p>
                            </div>

                            {/* Deskripsi */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Deskripsi Mata Kuliah
                                </label>
                                <textarea
                                    value={data.deskripsi}
                                    onChange={(e) => setData('deskripsi', e.target.value)}
                                    rows="4"
                                    placeholder="Deskripsi singkat tentang mata kuliah (opsional)"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.deskripsi ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    maxLength="500"
                                />
                                {errors.deskripsi && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.deskripsi}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    {data.deskripsi.length}/500 karakter
                                </p>
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
                                {processing ? 'Menyimpan...' : 'Simpan Data'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </BaakLayout>
    );
}
