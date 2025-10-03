// resources/js/Pages/Baak/PengaturanKrs/Index.jsx

import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Index({ pengaturan, filters, periodes, prodis }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [selectedFilters, setSelectedFilters] = useState({
        periode: filters.periode || '',
        prodi: filters.prodi || '',
    });

    const handleFilter = () => {
        router.get(route('baak.pengaturan-krs.index'), {
            ...selectedFilters,
            search,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        setSelectedFilters({ periode: '', prodi: '' });
        router.get(route('baak.pengaturan-krs.index'));
    };

    const handleDelete = (id, kodeMk, namaMk) => {
        if (window.Swal) {
            window.Swal.fire({
                title: 'Hapus Pengaturan?',
                text: `Hapus pengaturan mata kuliah "${namaMk} (${kodeMk})"?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc2626',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.delete(route('baak.pengaturan-krs.destroy', id), {
                        preserveScroll: true,
                    });
                }
            });
        }
    };

    const toggleAvailability = (id) => {
        router.post(route('baak.pengaturan-krs.toggle', id), {}, {
            preserveScroll: true,
        });
    };

    return (
        <BaakLayout title="Pengaturan Mata Kuliah KRS">
            <Head title="Pengaturan Mata Kuliah KRS" />

            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">
                        Pengaturan Mata Kuliah KRS
                    </h1>
                    <p className="text-gray-600">
                        Atur mata kuliah yang ditawarkan per periode dan semester
                    </p>
                </div>

                {/* Flash Messages */}
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

                {/* Info Box */}
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
                        <i className="fas fa-info-circle mr-2"></i>
                        Tentang Pengaturan Mata Kuliah KRS
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
                        <li>Set mata kuliah mana yang ditawarkan di periode tertentu</li>
                        <li>Tentukan di semester berapa mata kuliah ditawarkan (bisa berbeda dari kurikulum)</li>
                        <li>Atur kuota mahasiswa per mata kuliah</li>
                        <li>Aktifkan/nonaktifkan mata kuliah sesuai kebutuhan</li>
                    </ul>
                </div>

                {/* Filter & Actions */}
                <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {/* Search */}
                        <div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari kode atau nama mata kuliah..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>

                        {/* Periode Filter */}
                        <select
                            value={selectedFilters.periode}
                            onChange={(e) => setSelectedFilters({...selectedFilters, periode: e.target.value})}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Semua Periode</option>
                            {periodes.map((periode) => (
                                <option
                                    key={periode.id_periode}
                                    value={`${periode.tahun_ajaran}-${periode.jenis_semester}`}
                                >
                                    {periode.tahun_ajaran} - {periode.jenis_semester.charAt(0).toUpperCase() + periode.jenis_semester.slice(1)}
                                </option>
                            ))}
                        </select>

                        {/* Prodi Filter */}
                        <select
                            value={selectedFilters.prodi}
                            onChange={(e) => setSelectedFilters({...selectedFilters, prodi: e.target.value})}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Semua Prodi</option>
                            {prodis.map((prodi) => (
                                <option key={prodi.kode_prodi} value={prodi.kode_prodi}>
                                    {prodi.nama_prodi}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 mt-3">
                        <button
                            onClick={handleFilter}
                            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                            <i className="fas fa-filter"></i>
                            <span>Filter</span>
                        </button>
                        {(search || selectedFilters.periode || selectedFilters.prodi) && (
                            <button
                                onClick={handleReset}
                                className="flex-1 md:flex-none bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 flex items-center justify-center gap-2 transition-colors"
                            >
                                <i className="fas fa-redo"></i>
                                <span>Reset</span>
                            </button>
                        )}
                        <Link
                            href={route('baak.pengaturan-krs.create')}
                            className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                            <i className="fas fa-plus"></i>
                            <span>Set Mata Kuliah KRS</span>
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
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Prodi</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Periode</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Semester</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Kuota</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {pengaturan.data.length > 0 ? (
                                    pengaturan.data.map((item, index) => (
                                        <tr key={item.id_mk_periode} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {pengaturan.from + index}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-lg">
                                                    {item.mata_kuliah?.kode_matkul}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                                {item.mata_kuliah?.nama_matkul}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {item.mata_kuliah?.prodi?.nama_prodi || 'Umum'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                {item.tahun_ajaran} {item.jenis_semester.charAt(0).toUpperCase() + item.jenis_semester.slice(1)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className="px-3 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-lg">
                                                    Semester {item.semester_ditawarkan}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                {item.kuota}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <button
                                                    onClick={() => toggleAvailability(item.id_mk_periode)}
                                                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                                                        item.is_available
                                                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {item.is_available ? 'Tersedia' : 'Nonaktif'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        href={route('baak.pengaturan-krs.edit', item.id_mk_periode)}
                                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                                        title="Edit"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(item.id_mk_periode, item.mata_kuliah?.kode_matkul, item.mata_kuliah?.nama_matkul)}
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
                                        <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                                            <i className="fas fa-inbox text-4xl mb-2 text-gray-400"></i>
                                            <p>Belum ada pengaturan mata kuliah KRS</p>
                                            <p className="text-sm">Klik tombol "Set Mata Kuliah KRS" untuk menambah</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Desktop */}
                    {pengaturan.last_page > 1 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Menampilkan {pengaturan.from} - {pengaturan.to} dari {pengaturan.total} data
                            </div>
                            <div className="flex gap-2">
                                {pengaturan.links.map((link, index) => (
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
                    {pengaturan.data.length > 0 ? (
                        pengaturan.data.map((item) => (
                            <div key={item.id_mk_periode} className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className="px-2 py-0.5 text-xs font-semibold text-blue-800 bg-blue-100 rounded">
                                                {item.mata_kuliah?.kode_matkul}
                                            </span>
                                            <span className="px-2 py-0.5 text-xs font-semibold text-purple-800 bg-purple-100 rounded">
                                                Sem {item.semester_ditawarkan}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 text-sm break-words">
                                            {item.mata_kuliah?.nama_matkul}
                                        </h3>
                                    </div>
                                </div>
                                <div className="space-y-1 mb-3 text-sm">
                                    <p className="text-gray-600">
                                        <span className="font-medium">Prodi:</span> {item.mata_kuliah?.prodi?.nama_prodi || 'Umum'}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Periode:</span> {item.tahun_ajaran} {item.jenis_semester.charAt(0).toUpperCase() + item.jenis_semester.slice(1)}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Kuota:</span> {item.kuota} mahasiswa
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Status:</span>{' '}
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                                            item.is_available
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {item.is_available ? 'Tersedia' : 'Nonaktif'}
                                        </span>
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100">
                                    <Link
                                        href={route('baak.pengaturan-krs.edit', item.id_mk_periode)}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm font-medium text-center transition-colors"
                                    >
                                        <i className="fas fa-edit mr-1"></i> Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(item.id_mk_periode, item.mata_kuliah?.kode_matkul, item.mata_kuliah?.nama_matkul)}
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
                            <p className="text-gray-500">Belum ada pengaturan mata kuliah KRS</p>
                        </div>
                    )}

                    {/* Pagination Mobile */}
                    {pengaturan.last_page > 1 && (
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="text-sm text-gray-600 mb-3 text-center">
                                Menampilkan {pengaturan.from} - {pengaturan.to} dari {pengaturan.total} data
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {pengaturan.links.map((link, index) => (
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
