import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Index({ prodi, fakultas_list, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [fakultas, setFakultas] = useState(filters.fakultas || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('baak.prodi.index'), { search, fakultas }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        setFakultas('');
        router.get(route('baak.prodi.index'));
    };

    const handleDelete = (kode_prodi, nama_prodi) => {
        if (window.Swal) {
            window.Swal.fire({
                title: 'Hapus Program Studi?',
                text: `Apakah Anda yakin ingin menghapus prodi "${nama_prodi}"?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc2626',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.delete(route('baak.prodi.destroy', kode_prodi), {
                        preserveScroll: true,
                    });
                }
            });
        } else {
            if (confirm(`Apakah Anda yakin ingin menghapus prodi "${nama_prodi}"?`)) {
                router.delete(route('baak.prodi.destroy', kode_prodi), {
                    preserveScroll: true,
                });
            }
        }
    };

    const getJenjangBadge = (jenjang) => {
        const badges = {
            'D3': 'bg-green-100 text-green-600',
            'D4': 'bg-blue-100 text-blue-800',
            'S1': 'bg-purple-100 text-purple-800',
            'S2': 'bg-orange-100 text-orange-800',
            'S3': 'bg-red-100 text-red-800',
        };
        return badges[jenjang] || 'bg-gray-100 text-gray-800';
    };

    return (
        <BaakLayout title="Data Program Studi">
            <Head title="Data Program Studi" />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Data Program Studi</h1>
                    <p className="text-gray-600">Kelola data program studi di sistem akademik</p>
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
                                placeholder="Cari kode atau nama prodi..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>

                        {/* Fakultas Filter */}
                        <select
                            value={fakultas}
                            onChange={(e) => setFakultas(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Semua Fakultas</option>
                            {fakultas_list.map((item) => (
                                <option key={item.kode_fakultas} value={item.kode_fakultas}>
                                    {item.nama_fakultas}
                                </option>
                            ))}
                        </select>

                        {/* Add Button Desktop */}
                        <Link
                            href={route('baak.prodi.create')}
                            className="hidden md:inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
                        >
                            <i className="fas fa-plus mr-2"></i>
                            Tambah Prodi
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
                        {(search || fakultas) && (
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
                            href={route('baak.prodi.create')}
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
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Kode Prodi</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Nama Program Studi</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Fakultas</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Jenjang</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Jumlah Mahasiswa</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {prodi.data.length > 0 ? (
                                    prodi.data.map((item, index) => (
                                        <tr key={item.kode_prodi} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {prodi.from + index}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-lg">
                                                    {item.kode_prodi}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                                {item.nama_prodi}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {item.fakultas?.nama_fakultas || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getJenjangBadge(item.jenjang)}`}>
                                                    {item.jenjang}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-800">
                                                    {item.mahasiswa_count} Mahasiswa
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        href={route('baak.prodi.edit', item.kode_prodi)}
                                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                                        title="Edit"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(item.kode_prodi, item.nama_prodi)}
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
                                            <p>Tidak ada data program studi</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Desktop */}
                    {prodi.last_page > 1 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Menampilkan {prodi.from} - {prodi.to} dari {prodi.total} data
                            </div>
                            <div className="flex gap-2">
                                {prodi.links.map((link, index) => (
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
                    {prodi.data.length > 0 ? (
                        prodi.data.map((item) => (
                            <div key={item.kode_prodi} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{item.nama_prodi}</h3>
                                        <div className="flex gap-2 mt-1">
                                            <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-lg">
                                                {item.kode_prodi}
                                            </span>
                                            <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getJenjangBadge(item.jenjang)}`}>
                                                {item.jenjang}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1 mb-3">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Fakultas:</span> {item.fakultas?.nama_fakultas || '-'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Mahasiswa:</span>{' '}
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-800">
                                            {item.mahasiswa_count} Mahasiswa
                                        </span>
                                    </p>
                                </div>
                                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                                    <Link
                                        href={route('baak.prodi.edit', item.kode_prodi)}
                                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm font-medium text-center transition-colors"
                                    >
                                        <i className="fas fa-edit mr-1"></i> Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(item.kode_prodi, item.nama_prodi)}
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
                            <p className="text-gray-500">Tidak ada data program studi</p>
                        </div>
                    )}

                    {/* Pagination Mobile */}
                    {prodi.last_page > 1 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="text-sm text-gray-600 mb-3 text-center">
                                Menampilkan {prodi.from} - {prodi.to} dari {prodi.total} data
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {prodi.links.map((link, index) => (
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
