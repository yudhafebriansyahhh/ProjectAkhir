import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Index({ periodes, tahunAjaranList, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [tahunAjaran, setTahunAjaran] = useState(filters.tahun_ajaran || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('baak.periode-registrasi.index'), {
            search,
            tahun_ajaran: tahunAjaran,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        setTahunAjaran('');
        router.get(route('baak.periode-registrasi.index'));
    };

    const handleToggleStatus = (periode) => {
        const action = periode.status === 'tutup' ? 'mengaktifkan' : 'menutup';

        if (window.Swal) {
            window.Swal.fire({
                title: 'Konfirmasi',
                text: `Apakah Anda yakin ingin ${action} periode ini?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ya, Lanjutkan',
                cancelButtonText: 'Batal',
            }).then((result) => {
                if (result.isConfirmed) {
                    router.post(route('baak.periode-registrasi.toggle-status', periode.id_periode), {}, {
                        preserveScroll: true,
                    });
                }
            });
        }
    };

    const handleDelete = (periode) => {
        if (window.Swal) {
            window.Swal.fire({
                title: 'Hapus Periode?',
                text: `Periode ${periode.tahun_ajaran} ${periode.jenis_semester} akan dihapus permanen!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc2626',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.delete(route('baak.periode-registrasi.destroy', periode.id_periode), {
                        preserveScroll: true,
                    });
                }
            });
        }
    };

    const getStatusBadge = (status) => {
        return status === 'aktif'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700';
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <BaakLayout title="Periode Registrasi">
            <Head title="Periode Registrasi" />

            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Periode Registrasi</h1>
                    <p className="text-gray-600">Kelola periode registrasi semester mahasiswa</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Search */}
                        <div className="md:col-span-1">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari tahun ajaran..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>

                        {/* Filter Tahun Ajaran */}
                        <select
                            value={tahunAjaran}
                            onChange={(e) => setTahunAjaran(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Semua Tahun Ajaran</option>
                            {tahunAjaranList.map((ta) => (
                                <option key={ta} value={ta}>
                                    {ta}
                                </option>
                            ))}
                        </select>

                        {/* Placeholder untuk keseimbangan grid */}
                        <div className="hidden md:block"></div>
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
                        {(search || tahunAjaran) && (
                            <button
                                onClick={handleReset}
                                className="flex-1 md:flex-none bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 flex items-center justify-center gap-2 transition-colors"
                            >
                                <i className="fas fa-redo"></i>
                                <span>Reset</span>
                            </button>
                        )}
                        <Link
                            href={route('baak.periode-registrasi.create')}
                            className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                            <i className="fas fa-plus"></i>
                            <span>Tambah Periode</span>
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
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Tahun Ajaran</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Semester</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Tanggal Mulai</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Tanggal Selesai</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Durasi</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {periodes.data.length > 0 ? (
                                    periodes.data.map((periode, index) => (
                                        <tr
                                            key={periode.id_periode}
                                            className={`hover:bg-gray-50 ${periode.status === 'aktif' ? 'bg-green-50' : ''}`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {periodes.from + index}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                {periode.tahun_ajaran}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className="px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-lg capitalize">
                                                    {periode.jenis_semester}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {formatDate(periode.tanggal_mulai)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {formatDate(periode.tanggal_selesai)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                                                {periode.durasi} hari
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-lg ${getStatusBadge(periode.status)}`}>
                                                    {periode.status === 'aktif' ? 'Aktif' : 'Tutup'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleToggleStatus(periode)}
                                                        className={`${
                                                            periode.status === 'tutup'
                                                                ? 'bg-green-500 hover:bg-green-600'
                                                                : 'bg-orange-500 hover:bg-orange-600'
                                                        } text-white px-3 py-1 rounded text-xs font-medium transition-colors`}
                                                        title={periode.status === 'tutup' ? 'Aktifkan' : 'Tutup'}
                                                    >
                                                        <i className={`fas ${periode.status === 'tutup' ? 'fa-check' : 'fa-times'}`}></i>
                                                    </button>
                                                    <Link
                                                        href={route('baak.periode-registrasi.edit', periode.id_periode)}
                                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                                        title="Edit"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(periode)}
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
                                            <p>Tidak ada data periode registrasi</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Desktop */}
                    {periodes.last_page > 1 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Menampilkan {periodes.from} - {periodes.to} dari {periodes.total} data
                            </div>
                            <div className="flex gap-2">
                                {periodes.links.map((link, index) => (
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
                    {periodes.data.length > 0 ? (
                        periodes.data.map((periode) => (
                            <div
                                key={periode.id_periode}
                                className={`bg-white rounded-lg border p-4 ${
                                    periode.status === 'aktif' ? 'border-green-500 border-2' : 'border-gray-200'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{periode.tahun_ajaran}</h3>
                                        <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded capitalize">
                                            {periode.jenis_semester}
                                        </span>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-lg ${getStatusBadge(periode.status)}`}>
                                        {periode.status === 'aktif' ? 'Aktif' : 'Tutup'}
                                    </span>
                                </div>

                                <div className="space-y-2 text-sm mb-4">
                                    <p className="text-gray-600">
                                        <span className="font-medium">Mulai:</span> {formatDate(periode.tanggal_mulai)}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Selesai:</span> {formatDate(periode.tanggal_selesai)}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Durasi:</span> {periode.durasi} hari
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                                    <button
                                        onClick={() => handleToggleStatus(periode)}
                                        className={`${
                                            periode.status === 'tutup'
                                                ? 'bg-green-500 hover:bg-green-600'
                                                : 'bg-orange-500 hover:bg-orange-600'
                                        } text-white px-3 py-2 rounded text-sm font-medium transition-colors`}
                                    >
                                        <i className={`fas ${periode.status === 'tutup' ? 'fa-check' : 'fa-times'} mr-1`}></i>
                                        {periode.status === 'tutup' ? 'Aktifkan' : 'Tutup'}
                                    </button>
                                    <Link
                                        href={route('baak.periode-registrasi.edit', periode.id_periode)}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm font-medium text-center transition-colors"
                                    >
                                        <i className="fas fa-edit mr-1"></i> Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(periode)}
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
                            <p className="text-gray-500">Tidak ada data periode registrasi</p>
                        </div>
                    )}

                    {/* Pagination Mobile */}
                    {periodes.last_page > 1 && (
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="text-sm text-gray-600 mb-3 text-center">
                                Menampilkan {periodes.from} - {periodes.to} dari {periodes.total} data
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {periodes.links.map((link, index) => (
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
