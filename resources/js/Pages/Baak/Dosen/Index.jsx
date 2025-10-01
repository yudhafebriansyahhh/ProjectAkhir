import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Index({ dosen, prodi_list, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [prodi, setProdi] = useState(filters.prodi || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('baak.dosen.index'), { search, prodi }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        setProdi('');
        router.get(route('baak.dosen.index'));
    };

    const handleDelete = (id_dosen, nama) => {
        if (window.Swal) {
            window.Swal.fire({
                title: 'Hapus Dosen?',
                text: `Apakah Anda yakin ingin menghapus dosen "${nama}"?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc2626',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.delete(route('baak.dosen.destroy', id_dosen), {
                        preserveScroll: true,
                    });
                }
            });
        } else {
            if (confirm(`Apakah Anda yakin ingin menghapus dosen "${nama}"?`)) {
                router.delete(route('baak.dosen.destroy', id_dosen), {
                    preserveScroll: true,
                });
            }
        }
    };

    const handleResetPassword = (id_dosen, nip) => {
        if (window.Swal) {
            window.Swal.fire({
                title: 'Reset Password?',
                text: `Password akan direset ke NIP: ${nip}`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3b82f6',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Ya, Reset!',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.post(route('baak.dosen.reset-password', id_dosen), {}, {
                        preserveScroll: true,
                    });
                }
            });
        } else {
            if (confirm(`Reset password ke NIP: ${nip}?`)) {
                router.post(route('baak.dosen.reset-password', id_dosen), {}, {
                    preserveScroll: true,
                });
            }
        }
    };

    return (
        <BaakLayout title="Data Dosen">
            <Head title="Data Dosen" />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Data Dosen</h1>
                    <p className="text-gray-600">Kelola data dosen di sistem akademik</p>
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
                                placeholder="Cari nama atau NIP dosen..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>

                        {/* Prodi Filter */}
                        <select
                            value={prodi}
                            onChange={(e) => setProdi(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Semua Prodi</option>
                            {prodi_list.map((item) => (
                                <option key={item.kode_prodi} value={item.kode_prodi}>
                                    {item.nama_prodi}
                                </option>
                            ))}
                        </select>

                        {/* Add Button Desktop */}
                        <Link
                            href={route('baak.dosen.create')}
                            className="hidden md:inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
                        >
                            <i className="fas fa-plus mr-2"></i>
                            Tambah Dosen
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
                        {(search || prodi) && (
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
                            href={route('baak.dosen.create')}
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
                        <table className="w-full min-w-[900px]">
                            <thead className="bg-gray-50">
                                <tr className="text-gray-600 font-semibold text-xs">
                                    <th className="px-6 py-4 text-left uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">NIP</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Nama Dosen</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Program Studi</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Jenis Kelamin</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Jumlah Kelas</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Mahasiswa Bimbingan</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dosen.data.length > 0 ? (
                                    dosen.data.map((item, index) => (
                                        <tr key={item.id_dosen} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {dosen.from + index}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-lg">
                                                    {item.nip}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                                {item.nama}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {item.prodi?.nama_prodi || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                {item.jenis_kelamin === 'Laki-laki' ? (
                                                    <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-800">
                                                        <i className="fas fa-mars mr-1"></i>Laki-laki
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-pink-100 text-pink-800">
                                                        <i className="fas fa-venus mr-1"></i>Perempuan
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-800">
                                                    {item.kelas_count} Kelas
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-purple-100 text-purple-800">
                                                    {item.mahasiswa_bimbingan_count} Mahasiswa
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        href={route('baak.dosen.show', item.id_dosen)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                                        title="Detail"
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </Link>
                                                    <Link
                                                        href={route('baak.dosen.edit', item.id_dosen)}
                                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                                        title="Edit"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleResetPassword(item.id_dosen, item.nip)}
                                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                                        title="Reset Password"
                                                    >
                                                        <i className="fas fa-key"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id_dosen, item.nama)}
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
                                        <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                            <i className="fas fa-inbox text-4xl mb-2 text-gray-400"></i>
                                            <p>Tidak ada data dosen</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Desktop */}
                    {dosen.last_page > 1 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Menampilkan {dosen.from} - {dosen.to} dari {dosen.total} data
                            </div>
                            <div className="flex gap-2">
                                {dosen.links.map((link, index) => (
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
                    {dosen.data.length > 0 ? (
                        dosen.data.map((item) => (
                            <div key={item.id_dosen} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{item.nama}</h3>
                                        <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-lg">
                                            {item.nip}
                                        </span>
                                    </div>
                                    {item.jenis_kelamin === 'Laki-laki' ? (
                                        <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-800">
                                            <i className="fas fa-mars mr-1"></i>L
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-pink-100 text-pink-800">
                                            <i className="fas fa-venus mr-1"></i>P
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-1 mb-3">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Prodi:</span> {item.prodi?.nama_prodi || '-'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Kelas:</span>{' '}
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-800">
                                            {item.kelas_count} Kelas
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Mahasiswa Bimbingan:</span>{' '}
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-purple-100 text-purple-800">
                                            {item.mahasiswa_bimbingan_count} Mahasiswa
                                        </span>
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100">
                                    <Link
                                        href={route('baak.dosen.show', item.id_dosen)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium text-center transition-colors"
                                    >
                                        <i className="fas fa-eye mr-1"></i> Detail
                                    </Link>
                                    <Link
                                        href={route('baak.dosen.edit', item.id_dosen)}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm font-medium text-center transition-colors"
                                    >
                                        <i className="fas fa-edit mr-1"></i> Edit
                                    </Link>
                                    <button
                                        onClick={() => handleResetPassword(item.id_dosen, item.nip)}
                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                                    >
                                        <i className="fas fa-key mr-1"></i> Reset PW
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id_dosen, item.nama)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                                    >
                                        <i className="fas fa-trash mr-1"></i> Hapus
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                            <i className="fas fa-inbox text-4xl mb-2 text-gray-400"></i>
                            <p className="text-gray-500">Tidak ada data dosen</p>
                        </div>
                    )}

                    {/* Pagination Mobile */}
                    {dosen.last_page > 1 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="text-sm text-gray-600 mb-3 text-center">
                                Menampilkan {dosen.from} - {dosen.to} dari {dosen.total} data
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {dosen.links.map((link, index) => (
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
