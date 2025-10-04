// resources/js/Pages/Baak/PengaturanKrs/Create.jsx

import { useState, useMemo, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Create({ mataKuliah, prodis }) {
    const { data, setData, post, processing, errors } = useForm({
        tahun_ajaran: '',
        jenis_semester: '',
        kode_prodi: '',
        semester_ditawarkan: '',
        mata_kuliah: [], // Array of { kode_matkul, catatan }
    });

    const [searchMk, setSearchMk] = useState('');
    const [filterKategori, setFilterKategori] = useState('');

    // Auto-generate tahun ajaran
    const generateTahunAjaran = () => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        if (currentMonth >= 7) {
            return `${currentYear}/${currentYear + 1}`;
        } else {
            return `${currentYear - 1}/${currentYear}`;
        }
    };

    useEffect(() => {
        if (!data.tahun_ajaran) {
            setData('tahun_ajaran', generateTahunAjaran());
        }
    }, []);

    // Filter mata kuliah berdasarkan prodi yang dipilih
    const filteredMataKuliah = useMemo(() => {
        if (!data.kode_prodi) return [];

        return mataKuliah.filter(mk => {
            // MK Umum + MK Prodi yang dipilih
            const belongsToProdi = !mk.kode_prodi || mk.kode_prodi === data.kode_prodi;

            // Search filter
            const matchSearch = !searchMk ||
                mk.nama_matkul.toLowerCase().includes(searchMk.toLowerCase()) ||
                mk.kode_matkul.toLowerCase().includes(searchMk.toLowerCase());

            // Kategori filter
            const matchKategori = !filterKategori || mk.kategori === filterKategori;

            return belongsToProdi && matchSearch && matchKategori;
        });
    }, [mataKuliah, data.kode_prodi, searchMk, filterKategori]);

    // Get available semester options (max 8)
    const getSemesterOptions = () => {
        if (data.jenis_semester === 'ganjil') {
            return [1, 3, 5, 7];
        } else if (data.jenis_semester === 'genap') {
            return [2, 4, 6, 8];
        }
        return [];
    };

    // Handle toggle mata kuliah
    const handleToggleMataKuliah = (kodeMatkul) => {
        const exists = data.mata_kuliah.find(mk => mk.kode_matkul === kodeMatkul);

        if (exists) {
            setData('mata_kuliah', data.mata_kuliah.filter(mk => mk.kode_matkul !== kodeMatkul));
        } else {
            setData('mata_kuliah', [
                ...data.mata_kuliah,
                {
                    kode_matkul: kodeMatkul,
                    catatan: '',
                }
            ]);
        }
    };

    // Handle select all
    const handleSelectAll = () => {
        if (data.mata_kuliah.length === filteredMataKuliah.length && filteredMataKuliah.length > 0) {
            setData('mata_kuliah', []);
        } else {
            setData('mata_kuliah', filteredMataKuliah.map(mk => ({
                kode_matkul: mk.kode_matkul,
                catatan: '',
            })));
        }
    };

    // Check if selected
    const isSelected = (kodeMatkul) => {
        return data.mata_kuliah.some(mk => mk.kode_matkul === kodeMatkul);
    };

    // Update catatan
    const updateCatatan = (kodeMatkul, value) => {
        setData('mata_kuliah', data.mata_kuliah.map(mk =>
            mk.kode_matkul === kodeMatkul ? { ...mk, catatan: value } : mk
        ));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('baak.pengaturan-krs.store'));
    };

    return (
        <BaakLayout title="Set Mata Kuliah KRS">
            <Head title="Set Mata Kuliah KRS" />

            <div className="p-4 md:p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={route('baak.pengaturan-krs.index')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center mb-4"
                    >
                        <i className="fas fa-arrow-left mr-2"></i>
                        Kembali ke Daftar
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Set Mata Kuliah KRS
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Pilih mata kuliah yang akan ditawarkan untuk satu semester tertentu
                    </p>
                </div>

                {/* Info Box */}
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
                        <i className="fas fa-info-circle mr-2"></i>
                        Cara Kerja
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
                        <li>Pilih periode, prodi, dan semester yang akan di-setup</li>
                        <li>Centang mata kuliah yang ditawarkan di semester tersebut</li>
                        <li>Mata kuliah umum dan mata kuliah prodi akan ditampilkan</li>
                        <li>Mahasiswa dapat mengambil mata kuliah dari semester mana saja yang tersedia</li>
                        <li>Ulangi untuk semester lain dengan membuat setup baru</li>
                    </ul>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Step 1: Pilih Periode & Prodi */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            <span className="bg-blue-600 text-white w-7 h-7 rounded-full inline-flex items-center justify-center text-sm mr-2">1</span>
                            Pilih Periode, Prodi & Semester
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Tahun Ajaran */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tahun Ajaran <span className="text-red-600">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={data.tahun_ajaran}
                                        onChange={(e) => setData('tahun_ajaran', e.target.value)}
                                        placeholder="2024/2025"
                                        maxLength={9}
                                        className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.tahun_ajaran ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setData('tahun_ajaran', generateTahunAjaran())}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50"
                                    >
                                        <i className="fas fa-sync-alt mr-1"></i>
                                        Auto
                                    </button>
                                </div>
                                {errors.tahun_ajaran && (
                                    <p className="mt-1 text-sm text-red-600">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.tahun_ajaran}
                                    </p>
                                )}
                            </div>

                            {/* Jenis Semester */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jenis Semester <span className="text-red-600">*</span>
                                </label>
                                <select
                                    value={data.jenis_semester}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            jenis_semester: e.target.value,
                                            semester_ditawarkan: ''
                                        });
                                    }}
                                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.jenis_semester ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Pilih Jenis Semester</option>
                                    <option value="ganjil">Ganjil (Semester 1, 3, 5, 7)</option>
                                    <option value="genap">Genap (Semester 2, 4, 6, 8)</option>
                                    <option value="pendek">Pendek (Semester Intensif)</option>
                                </select>
                                {errors.jenis_semester && (
                                    <p className="mt-1 text-sm text-red-600">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.jenis_semester}
                                    </p>
                                )}
                            </div>

                            {/* Prodi */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Program Studi <span className="text-red-600">*</span>
                                </label>
                                <select
                                    value={data.kode_prodi}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            kode_prodi: e.target.value,
                                            mata_kuliah: []
                                        });
                                    }}
                                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.kode_prodi ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Pilih Prodi</option>
                                    {prodis.map((prodi) => (
                                        <option key={prodi.kode_prodi} value={prodi.kode_prodi}>
                                            {prodi.nama_prodi}
                                        </option>
                                    ))}
                                </select>
                                {errors.kode_prodi && (
                                    <p className="mt-1 text-sm text-red-600">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.kode_prodi}
                                    </p>
                                )}
                            </div>

                            {/* Semester Ditawarkan */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Semester <span className="text-red-600">*</span>
                                </label>
                                <select
                                    value={data.semester_ditawarkan}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            semester_ditawarkan: e.target.value,
                                            mata_kuliah: []
                                        });
                                    }}
                                    disabled={!data.jenis_semester}
                                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${
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
                                    <p className="mt-1 text-sm text-red-600">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.semester_ditawarkan}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    Max semester 8 (mahasiswa semester 9+ tetap bisa ambil)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Pilih Mata Kuliah */}
                    {data.kode_prodi && data.semester_ditawarkan && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                <span className="bg-blue-600 text-white w-7 h-7 rounded-full inline-flex items-center justify-center text-sm mr-2">2</span>
                                Pilih Mata Kuliah ({data.mata_kuliah.length} dipilih)
                            </h3>

                            {/* Search & Filter */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                <div>
                                    <input
                                        type="text"
                                        value={searchMk}
                                        onChange={(e) => setSearchMk(e.target.value)}
                                        placeholder="Cari mata kuliah..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <select
                                        value={filterKategori}
                                        onChange={(e) => setFilterKategori(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Semua Kategori</option>
                                        <option value="wajib">Wajib</option>
                                        <option value="pilihan">Pilihan</option>
                                        <option value="umum">Umum</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-3 flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={handleSelectAll}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    {data.mata_kuliah.length === filteredMataKuliah.length && filteredMataKuliah.length > 0
                                        ? 'Batalkan Semua'
                                        : 'Pilih Semua'}
                                </button>
                                <span className="text-sm text-gray-600">
                                    Menampilkan {filteredMataKuliah.length} mata kuliah
                                </span>
                            </div>

                            {errors.mata_kuliah && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded text-sm">
                                    <i className="fas fa-exclamation-circle mr-2"></i>
                                    {errors.mata_kuliah}
                                </div>
                            )}

                            {/* List Mata Kuliah */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr className="text-xs text-gray-600 uppercase">
                                            <th className="px-4 py-3 text-left w-12">
                                                <input
                                                    type="checkbox"
                                                    checked={data.mata_kuliah.length === filteredMataKuliah.length && filteredMataKuliah.length > 0}
                                                    onChange={handleSelectAll}
                                                    className="rounded"
                                                />
                                            </th>
                                            <th className="px-4 py-3 text-left">Kode</th>
                                            <th className="px-4 py-3 text-left">Mata Kuliah</th>
                                            <th className="px-4 py-3 text-center">Kategori</th>
                                            <th className="px-4 py-3 text-center">SKS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredMataKuliah.length > 0 ? (
                                            filteredMataKuliah.map((mk) => (
                                                <tr key={mk.kode_matkul} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected(mk.kode_matkul)}
                                                            onChange={() => handleToggleMataKuliah(mk.kode_matkul)}
                                                            className="rounded"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">
                                                        <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded">
                                                            {mk.kode_matkul}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-medium">
                                                        {mk.nama_matkul}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                                                            mk.kategori === 'wajib' ? 'bg-red-100 text-red-700' :
                                                            mk.kategori === 'pilihan' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-green-100 text-green-700'
                                                        }`}>
                                                            {mk.kategori}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-center">{mk.sks}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                                                    <i className="fas fa-search text-3xl mb-2 text-gray-400"></i>
                                                    <p>Tidak ada mata kuliah</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Set Detail (Catatan) */}
                    {data.mata_kuliah.length > 0 && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                <span className="bg-blue-600 text-white w-7 h-7 rounded-full inline-flex items-center justify-center text-sm mr-2">3</span>
                                Detail Mata Kuliah ({data.mata_kuliah.length})
                            </h3>

                            <div className="space-y-3">
                                {data.mata_kuliah.map((selectedMk) => {
                                    const mkInfo = mataKuliah.find(mk => mk.kode_matkul === selectedMk.kode_matkul);
                                    return (
                                        <div key={selectedMk.kode_matkul} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900 text-sm">
                                                        {mkInfo?.nama_matkul}
                                                    </h4>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        {mkInfo?.kode_matkul} • {mkInfo?.sks} SKS
                                                        <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded capitalize ${
                                                            mkInfo?.kategori === 'wajib' ? 'bg-red-100 text-red-700' :
                                                            mkInfo?.kategori === 'pilihan' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-green-100 text-green-700'
                                                        }`}>
                                                            {mkInfo?.kategori}
                                                        </span>
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleMataKuliah(selectedMk.kode_matkul)}
                                                    className="ml-3 text-red-600 hover:text-red-800 flex-shrink-0"
                                                    title="Hapus"
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Catatan (Opsional)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={selectedMk.catatan}
                                                    onChange={(e) => updateCatatan(selectedMk.kode_matkul, e.target.value)}
                                                    placeholder="Contoh: Khusus mahasiswa ngulang"
                                                    maxLength={500}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Submit Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-gray-200">
                        <Link
                            href={route('baak.pengaturan-krs.index')}
                            className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-center"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing || data.mata_kuliah.length === 0}
                            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save"></i>
                                    <span>Simpan Mata Kuliah Semester {data.semester_ditawarkan}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </BaakLayout>
    );
}
