import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Index({ kelas, mata_kuliah_list, dosen_list, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [mataKuliah, setMataKuliah] = useState(filters.mata_kuliah || '');
    const [dosen, setDosen] = useState(filters.dosen || '');
    const [hari, setHari] = useState(filters.hari || '');

    const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('baak.kelas.index'), { search, mata_kuliah: mataKuliah, dosen, hari }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        setMataKuliah('');
        setDosen('');
        setHari('');
        router.get(route('baak.kelas.index'));
    };

    const handleDelete = (id_kelas, nama_kelas, nama_matkul) => {
        if (window.Swal) {
            window.Swal.fire({
                title: 'Hapus Kelas?',
                text: `Apakah Anda yakin ingin menghapus kelas "${nama_matkul} - ${nama_kelas}"?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc2626',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.delete(route('baak.kelas.destroy', id_kelas), {
                        preserveScroll: true,
                    });
                }
            });
        } else {
            if (confirm(`Apakah Anda yakin ingin menghapus kelas "${nama_matkul} - ${nama_kelas}"?`)) {
                router.delete(route('baak.kelas.destroy', id_kelas), {
                    preserveScroll: true,
                });
            }
        }
    };

    return (
        <BaakLayout title="Data Kelas">
            <Head title="Data Kelas" />

            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Data Kelas</h1>
                    <p className="text-gray-600">Kelola data kelas perkuliahan di sistem akademik</p>
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
                <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                        {/* Search */}
                        <div className="lg:col-span-2">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari kelas, mata kuliah, dosen..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>

                        {/* Mata Kuliah Filter */}
                        <select
                            value={mataKuliah}
                            onChange={(e) => setMataKuliah(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Semua Mata Kuliah</option>
                            {mata_kuliah_list.map((mk) => (
                                <option key={mk.kode_matkul} value={mk.kode_matkul}>
                                    {mk.nama_matkul}
                                </option>
                            ))}
                        </select>

                        {/* Dosen Filter */}
                        <select
                            value={dosen}
                            onChange={(e) => setDosen(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Semua Dosen</option>
                            {dosen_list.map((d) => (
                                <option key={d.id_dosen} value={d.id_dosen}>
                                    {d.nama}
                                </option>
                            ))}
                        </select>

                        {/* Hari Filter */}
                        <select
                            value={hari}
                            onChange={(e) => setHari(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Semua Hari</option>
                            {hariList.map((h) => (
                                <option key={h} value={h}>{h}</option>
                            ))}
                        </select>
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
                        {(search || mataKuliah || dosen || hari) && (
                            <button
                                onClick={handleReset}
                                className="flex-1 md:flex-none bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 flex items-center justify-center gap-2 transition-colors"
                            >
                                <i className="fas fa-redo"></i>
                                <span>Reset</span>
                            </button>
                        )}
                        <Link
                            href={route('baak.kelas.create')}
                            className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                            <i className="fas fa-plus"></i>
                            <span>Tambah Kelas</span>
                        </Link>
                    </div>
                </div>

                {/* Table - Desktop */}
                <div className="hidden md:block bg-white rounded-lg overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr className="text-gray-600 font-semibold text-xs">
                                    <th className="px-6 py-4 text-left uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Kode MK</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Mata Kuliah</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Kelas</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Dosen</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Hari</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Jam</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Ruang</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Mahasiswa</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {kelas.data.length > 0 ? (
                                    kelas.data.map((item, index) => (
                                        <tr key={item.id_kelas} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {kelas.from + index}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-lg">
                                                    {item.mata_kuliah?.kode_matkul || '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                                {item.mata_kuliah?.nama_matkul || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className="px-3 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-lg">
                                                    {item.nama_kelas}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {item.dosen?.nama || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                {item.hari}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                {item.jam_mulai?.substring(0, 5)} - {item.jam_selesai?.substring(0, 5)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                {item.ruang_kelas}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-800">
                                                    {item.detail_krs_count}/{item.kapasitas}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        href={route('baak.kelas.show', item.id_kelas)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                                        title="Detail"
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </Link>
                                                    <Link
                                                        href={route('baak.kelas.edit', item.id_kelas)}
                                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                                        title="Edit"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(item.id_kelas, item.nama_kelas, item.mata_kuliah?.nama_matkul)}
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
                                        <td colSpan="10" className="px-6 py-8 text-center text-gray-500">
                                            <i className="fas fa-inbox text-4xl mb-2 text-gray-400"></i>
                                            <p>Tidak ada data kelas</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Desktop */}
                    {kelas.last_page > 1 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Menampilkan {kelas.from} - {kelas.to} dari {kelas.total} data
                            </div>
                            <div className="flex gap-2">
                                {kelas.links.map((link, index) => (
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
                    {kelas.data.length > 0 ? (
                        kelas.data.map((item) => (
                            <div key={item.id_kelas} className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className="px-2 py-0.5 text-xs font-semibold text-blue-800 bg-blue-100 rounded">
                                                {item.mata_kuliah?.kode_matkul}
                                            </span>
                                            <span className="px-2 py-0.5 text-xs font-semibold text-purple-800 bg-purple-100 rounded">
                                                Kelas {item.nama_kelas}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 text-sm break-words">{item.mata_kuliah?.nama_matkul}</h3>
                                    </div>
                                </div>
                                <div className="space-y-1 mb-3 text-sm">
                                    <p className="text-gray-600">
                                        <span className="font-medium">Dosen:</span> {item.dosen?.nama || '-'}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Jadwal:</span> {item.hari}, {item.jam_mulai?.substring(0, 5)} - {item.jam_selesai?.substring(0, 5)}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Ruang:</span> {item.ruang_kelas}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Mahasiswa:</span>{' '}
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                            {item.detail_krs_count}/{item.kapasitas}
                                        </span>
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100">
                                    <Link
                                        href={route('baak.kelas.show', item.id_kelas)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium text-center transition-colors"
                                    >
                                        <i className="fas fa-eye mr-1"></i> Detail
                                    </Link>
                                    <Link
                                        href={route('baak.kelas.edit', item.id_kelas)}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm font-medium text-center transition-colors"
                                    >
                                        <i className="fas fa-edit mr-1"></i> Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(item.id_kelas, item.nama_kelas, item.mata_kuliah?.nama_matkul)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                                    >
                                        <i className="fas fa-trash mr-1"></i> Hapus
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                            <i className="fas fa-inbox text-4xl mb-2 text-gray-400"></i>
                            <p className="text-gray-500">Tidak ada data kelas</p>
                        </div>
                    )}

                    {/* Pagination Mobile */}
                    {kelas.last_page > 1 && (
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="text-sm text-gray-600 mb-3 text-center">
                                Menampilkan {kelas.from} - {kelas.to} dari {kelas.total} data
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {kelas.links.map((link, index) => (
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
