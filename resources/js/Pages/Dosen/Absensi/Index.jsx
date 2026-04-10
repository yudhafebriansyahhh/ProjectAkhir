import { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DosenLayout from '@/Layouts/DosenLayout';

export default function AbsensiIndex({ tahunAjaranList, selectedTahunAjaran, mataKuliahList }) {
    const [tahunAjaran, setTahunAjaran] = useState(selectedTahunAjaran);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMataKuliah = useMemo(() => {
        if (!mataKuliahList) return [];
        if (!searchQuery.trim()) return mataKuliahList;

        const lowerQuery = searchQuery.toLowerCase();
        return mataKuliahList.filter((mk) => 
            mk.kode_matkul.toLowerCase().includes(lowerQuery) ||
            mk.nama_matkul.toLowerCase().includes(lowerQuery)
        );
    }, [mataKuliahList, searchQuery]);

    const hasAnyMataKuliah = mataKuliahList && mataKuliahList.length > 0;

    const handleTahunAjaranChange = (e) => {
        const value = e.target.value;
        setTahunAjaran(value);
        router.get(route('dosen.absensi.index'), { tahun_ajaran: value }, { preserveState: true });
    };

    return (
        <DosenLayout>
            <Head title="Absensi Mahasiswa">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
            </Head>

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Absensi Mahasiswa</h1>
                    <p className="text-gray-600">
                        Kelola dan catat kehadiran mahasiswa di kelas Anda.
                    </p>
                </div>

                {/* Filter & Search */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <i className="fas fa-calendar-alt mr-2 text-blue-600"></i>
                                Tahun Ajaran
                            </label>
                            <select
                                value={tahunAjaran}
                                onChange={handleTahunAjaranChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-sm"
                            >
                                {tahunAjaranList.map((ta) => (
                                    <option key={ta} value={ta}>{ta}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <i className="fas fa-search mr-2 text-blue-600"></i>
                                Cari Mata Kuliah
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Ketik kode atau nama..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                                <i className="fas fa-search absolute left-3.5 top-3 text-gray-400"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* List Mata Kuliah */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-700">
                            Daftar Mata Kuliah
                        </h2>
                        {searchQuery && (
                            <span className="text-sm text-gray-500">
                                Menemukan {filteredMataKuliah.length} hasil
                            </span>
                        )}
                    </div>

                    {hasAnyMataKuliah ? (
                        filteredMataKuliah.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">#</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Matakuliah</th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600">SKS</th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600">Kelas</th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredMataKuliah.map((mk, index) => (
                                        <tr key={mk.id_mk_periode} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-800">
                                                    {mk.kode_matkul} - {mk.nama_matkul}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {mk.jenis_semester}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-sm font-semibold text-gray-700">{mk.sks}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                                                    {mk.jumlah_kelas} Kelas
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Link
                                                    href={route('dosen.absensi.mata-kuliah.show', mk.id_mk_periode)}
                                                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                                                >
                                                    <i className="fas fa-eye mr-2"></i>
                                                    Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        ) : (
                            <div className="text-center py-12">
                                <i className="fas fa-search text-gray-400 text-4xl mb-4"></i>
                                <p className="text-gray-500 text-lg font-medium">Pencarian Tidak Ditemukan</p>
                                <p className="text-gray-400 text-sm mt-2">Tidak ada mata kuliah yang cocok dengan "{searchQuery}"</p>
                            </div>
                        )
                    ) : (
                        <div className="text-center py-12">
                            <i className="fas fa-inbox text-gray-400 text-5xl mb-4"></i>
                            <p className="text-gray-500 text-lg">Tidak ada mata kuliah</p>
                            <p className="text-gray-400 text-sm mt-2">Belum ada mata kuliah pada tahun ajaran ini</p>
                        </div>
                    )}
                </div>
            </div>
        </DosenLayout>
    );
}
