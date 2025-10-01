import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Index({ fakultas, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('baak.fakultas.index'), { search }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (kode_fakultas, nama_fakultas) => {
        if (window.Swal) {
            window.Swal.fire({
                title: 'Hapus Fakultas?',
                text: `Apakah Anda yakin ingin menghapus fakultas "${nama_fakultas}"?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc2626',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.delete(route('baak.fakultas.destroy', kode_fakultas), {
                        preserveScroll: true,
                    });
                }
            });
        } else {
            if (confirm(`Apakah Anda yakin ingin menghapus fakultas "${nama_fakultas}"?`)) {
                router.delete(route('baak.fakultas.destroy', kode_fakultas), {
                    preserveScroll: true,
                });
            }
        }
    };

    return (
        <BaakLayout title="Data Fakultas">
            <Head title="Data Fakultas" />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Data Fakultas</h1>
                    <p className="text-gray-600">Kelola data fakultas di sistem akademik</p>
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

                {/* Search & Add */}
                <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <form onSubmit={handleSearch} className="flex-1">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari kode atau nama fakultas..."
                                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                                <i className="fas fa-search absolute left-3 top-3 text-gray-400 text-sm"></i>
                            </div>
                        </form>
                        <Link
                            href={route('baak.fakultas.create')}
                            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
                        >
                            <i className="fas fa-plus mr-2"></i>
                            Tambah Fakultas
                        </Link>
                    </div>
                </div>

                {/* Table - Desktop */}
                <div className="hidden sm:block bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead className="bg-gray-50">
                                <tr className="text-gray-600 font-semibold text-xs">
                                    <th className="px-6 py-4 text-left uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Kode Fakultas</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Nama Fakultas</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Jumlah Prodi</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {fakultas.data.length > 0 ? (
                                    fakultas.data.map((item, index) => (
                                        <tr key={item.kode_fakultas} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {fakultas.from + index}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-lg">
                                                    {item.kode_fakultas}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                                {item.nama_fakultas}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-800">
                                                    {item.prodi_count} Prodi
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        href={route('baak.fakultas.edit', item.kode_fakultas)}
                                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                                        title="Edit"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(item.kode_fakultas, item.nama_fakultas)}
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
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                            <i className="fas fa-inbox text-4xl mb-2 text-gray-400"></i>
                                            <p>Tidak ada data fakultas</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Desktop */}
                    {fakultas.last_page > 1 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Menampilkan {fakultas.from} - {fakultas.to} dari {fakultas.total} data
                            </div>
                            <div className="flex gap-2">
                                {fakultas.links.map((link, index) => (
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
                <div className="block sm:hidden space-y-4">
                    {fakultas.data.length > 0 ? (
                        fakultas.data.map((item) => (
                            <div key={item.kode_fakultas} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{item.nama_fakultas}</h3>
                                        <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-lg">
                                            {item.kode_fakultas}
                                        </span>
                                    </div>
                                    <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-800">
                                        {item.prodi_count} Prodi
                                    </span>
                                </div>
                                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                                    <Link
                                        href={route('baak.fakultas.edit', item.kode_fakultas)}
                                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm font-medium text-center transition-colors"
                                    >
                                        <i className="fas fa-edit mr-1"></i> Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(item.kode_fakultas, item.nama_fakultas)}
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
                            <p className="text-gray-500">Tidak ada data fakultas</p>
                        </div>
                    )}

                    {/* Pagination Mobile */}
                    {fakultas.last_page > 1 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="text-sm text-gray-600 mb-3 text-center">
                                Menampilkan {fakultas.from} - {fakultas.to} dari {fakultas.total} data
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {fakultas.links.map((link, index) => (
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
