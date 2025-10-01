import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Index({ mataKuliah, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [semester, setSemester] = useState(filters.semester || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('baak.mata-kuliah.index'), { search, semester }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        setSemester('');
        router.get(route('baak.mata-kuliah.index'));
    };

    const handleDelete = (kode_matkul, nama_matkul) => {
        if (window.Swal) {
            window.Swal.fire({
                title: 'Hapus Mata Kuliah?',
                text: `Apakah Anda yakin ingin menghapus mata kuliah "${nama_matkul}"?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc2626',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.delete(route('baak.mata-kuliah.destroy', kode_matkul), {
                        preserveScroll: true,
                    });
                }
            });
        } else {
            if (confirm(`Apakah Anda yakin ingin menghapus mata kuliah "${nama_matkul}"?`)) {
                router.delete(route('baak.mata-kuliah.destroy', kode_matkul), {
                    preserveScroll: true,
                });
            }
        }
    };

    const getSemesterBadge = (sem) => {
        const colors = {
            1: 'bg-blue-100 text-blue-800',
            2: 'bg-green-100 text-green-800',
            3: 'bg-yellow-100 text-yellow-800',
            4: 'bg-orange-100 text-orange-800',
            5: 'bg-red-100 text-red-800',
            6: 'bg-purple-100 text-purple-800',
            7: 'bg-pink-100 text-pink-800',
            8: 'bg-indigo-100 text-indigo-800',
        };
        return colors[sem] || 'bg-gray-100 text-gray-800';
    };

    return (
        <BaakLayout title="Data Mata Kuliah">
            <Head title="Data Mata Kuliah" />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Data Mata Kuliah</h1>
                    <p className="text-gray-600">Kelola data mata kuliah di sistem akademik</p>
                </div>

                {/* Alert */}
                {flash.success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center">
                        <i className="fas fa-check-circle mr-2"></i>
                        {flash.success}
                    </div>
                )}

                {flash.error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center">
                        <i className="fas fa-exclamation-circle mr-2"></i>
                        {flash.error}
                    </div>
                )}

                {/* Filter & Add */}
                <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari kode atau nama mata kuliah..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>

                        {/* Semester Filter */}
                        <select
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Semua Semester</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                <option key={sem} value={sem}>
                                    Semester {sem}
                                </option>
                            ))}
                        </select>

                        {/* Add Button Desktop */}
                        <Link
                            href={route('baak.mata-kuliah.create')}
                            className="hidden md:inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
                        >
                            <i className="fas fa-plus mr-2"></i>
                            Tambah Mata Kuliah
                        </Link>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={handleFilter}
                            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                            <i className="fas fa-filter"></i>
                            <span>Filter</span>
                        </button>
                        {(search || semester) && (
                            <button
                                onClick={handleReset}
                                className="flex-1 md:flex-none bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 flex items-center justify-center gap-2 transition-colors"
                            >
                                <i className="fas fa-redo"></i>
                                <span>Reset</span>
                            </button>
                        )}
                        {/* Add Button Mobile */}
                        <Link
                            href={route('baak.mata-kuliah.create')}
                            className="md:hidden flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                            <i className="fas fa-plus"></i>
                            <span>Tambah</span>
                        </Link>
                    </div>
                </div>

                {/* Table - Desktop */}
                <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-gray-50">
                                <tr className="text-gray-600 font-semibold text-xs">
                                    <th className="px-6 py-4 text-left uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Kode MK</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Nama Mata Kuliah</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">SKS</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Semester</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Jumlah Kelas</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {mataKuliah.data.length > 0 ? (
                                    mataKuliah.data.map((item, index) => (
                                        <tr key={item.kode_matkul} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {mataKuliah.from + index}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-lg">
                                                    {item.kode_matkul}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                                {item.nama_matkul}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center font-medium">
                                                {item.sks}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getSemesterBadge(item.semester)}`}>
                                                    Semester {item.semester}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-800">
                                                    {item.kelas_count} Kelas
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        href={route('baak.mata-kuliah.edit', item.kode_matkul)}
                                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                                        title="Edit"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(item.kode_matkul, item.nama_matkul)}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                            <i className="fas fa-inbox text-4xl mb-2 text-gray-400"></i>
                                            <p>Tidak ada data mata kuliah</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Desktop */}
                    {mataKuliah.last_page > 1 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Menampilkan {mataKuliah.from} - {mataKuliah.to} dari {mataKuliah.total} data
                            </div>
                            <div className="flex gap-2">
                                {mataKuliah.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        preserveState
                                        preserveScroll
                                        className={`px-3 py-1 text-sm rounded ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url
                                                ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Cards - Mobile */}
                <div className="block md:hidden space-y-4">
                    {mataKuliah.data.length > 0 ? (
                        mataKuliah.data.map((item) => (
                            <div key={item.kode_matkul} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{item.nama_matkul}</h3>
                                        <div className="flex gap-2 mt-1">
                                            <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-lg">
                                                {item.kode_matkul}
                                            </span>
                                            <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getSemesterBadge(item.semester)}`}>
                                                Sem {item.semester}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1 mb-3">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">SKS:</span> {item.sks}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Jumlah Kelas:</span>{' '}
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-800">
                                            {item.kelas_count} Kelas
                                        </span>
                                    </p>
                                    {item.deskripsi && (
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Deskripsi:</span> {item.deskripsi.substring(0, 50)}...
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                                    <Link
                                        href={route('baak.mata-kuliah.edit', item.kode_matkul)}
                                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm font-medium text-center transition-colors"
                                    >
                                        <i className="fas fa-edit mr-1"></i> Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(item.kode_matkul, item.nama_matkul)}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                                    >
                                        <i className="fas fa-trash mr-1"></i> Hapus
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                            <i className="fas fa-inbox text-4xl mb-2 text-gray-400"></i>
                            <p className="text-gray-500">Tidak ada data mata kuliah</p>
                        </div>
                    )}

                    {/* Pagination Mobile */}
                    {mataKuliah.last_page > 1 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="text-sm text-gray-600 mb-3 text-center">
                                Menampilkan {mataKuliah.from} - {mataKuliah.to} dari {mataKuliah.total} data
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {mataKuliah.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        preserveState
                                        preserveScroll
                                        className={`px-3 py-1 text-sm rounded ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url
                                                ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </BaakLayout>
    );
}
