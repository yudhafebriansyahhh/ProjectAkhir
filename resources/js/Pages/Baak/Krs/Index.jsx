import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Index({ krs, stats, prodis, tahunAjaranList, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [tahunAjaran, setTahunAjaran] = useState(filters.tahun_ajaran || '');
    const [prodi, setProdi] = useState(filters.prodi || '');
    const [semester, setSemester] = useState(filters.semester || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('baak.krs.index'), {
            search,
            tahun_ajaran: tahunAjaran,
            prodi,
            semester,
            status
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        setTahunAjaran('');
        setProdi('');
        setSemester('');
        setStatus('');
        router.get(route('baak.krs.index'));
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-700',
            approved: 'bg-green-100 text-green-700',
            rejected: 'bg-red-100 text-red-700',
        };
        return badges[status] || 'bg-gray-100 text-gray-700';
    };

    const getStatusLabel = (status) => {
        const labels = {
            pending: 'Pending',
            approved: 'Disetujui',
            rejected: 'Ditolak',
        };
        return labels[status] || status;
    };

    return (
        <BaakLayout title="Monitoring KRS">
            <Head title="Monitoring KRS" />

            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Monitoring KRS</h1>
                    <p className="text-gray-600">Monitor dan lihat data KRS mahasiswa</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <i className="fas fa-clipboard-list text-blue-600 text-xl"></i>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Total KRS</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <i className="fas fa-clock text-yellow-600 text-xl"></i>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Pending</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <i className="fas fa-check-circle text-green-600 text-xl"></i>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Disetujui</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <i className="fas fa-times-circle text-red-600 text-xl"></i>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Ditolak</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
                        {/* Search */}
                        <div className="lg:col-span-2">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari NIM atau Nama..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>

                        {/* Tahun Ajaran */}
                        <select
                            value={tahunAjaran}
                            onChange={(e) => setTahunAjaran(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Semua Tahun Ajaran</option>
                            {tahunAjaranList.map((ta) => (
                                <option key={ta} value={ta}>{ta}</option>
                            ))}
                        </select>

                        {/* Prodi */}
                        <select
                            value={prodi}
                            onChange={(e) => setProdi(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Semua Prodi</option>
                            {prodis.map((p) => (
                                <option key={p.kode_prodi} value={p.kode_prodi}>
                                    {p.nama_prodi}
                                </option>
                            ))}
                        </select>

                        {/* Semester */}
                        <select
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Semua Semester</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                <option key={sem} value={sem}>Semester {sem}</option>
                            ))}
                        </select>

                        {/* Status */}
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Semua Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Disetujui</option>
                            <option value="rejected">Ditolak</option>
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
                        {(search || tahunAjaran || prodi || semester || status) && (
                            <button
                                onClick={handleReset}
                                className="flex-1 md:flex-none bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 flex items-center justify-center gap-2 transition-colors"
                            >
                                <i className="fas fa-redo"></i>
                                <span>Reset</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Table - Desktop */}
                <div className="hidden md:block bg-white rounded-lg overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr className="text-gray-600 font-semibold text-xs">
                                    <th className="px-6 py-4 text-left uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">NIM</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Nama</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Prodi</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Semester</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">SKS</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Dosen Wali</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Tanggal</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {krs.data.length > 0 ? (
                                    krs.data.map((item, index) => (
                                        <tr key={item.id_krs} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {krs.from + index}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {item.mahasiswa?.nim}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {item.mahasiswa?.nama}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {item.mahasiswa?.prodi?.nama_prodi}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                                                {item.semester}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-800">
                                                    {item.total_sks || 0} SKS
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${getStatusBadge(item.status)}`}>
                                                    {getStatusLabel(item.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {item.mahasiswa?.dosen_wali?.nama || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                                                {new Date(item.tanggal_pengisian).toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                <Link
                                                    href={route('baak.krs.show', item.id_krs)}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                                    title="Detail"
                                                >
                                                    <i className="fas fa-eye"></i>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="px-6 py-8 text-center text-gray-500">
                                            <i className="fas fa-inbox text-4xl mb-2 text-gray-400"></i>
                                            <p>Tidak ada data KRS</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {krs.last_page > 1 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Menampilkan {krs.from} - {krs.to} dari {krs.total} data
                            </div>
                            <div className="flex gap-2">
                                {krs.links.map((link, index) => (
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
                    {krs.data.length > 0 ? (
                        krs.data.map((item) => (
                            <div key={item.id_krs} className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-semibold text-gray-900">{item.mahasiswa?.nama}</p>
                                        <p className="text-sm text-gray-600">{item.mahasiswa?.nim}</p>
                                    </div>
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusBadge(item.status)}`}>
                                        {getStatusLabel(item.status)}
                                    </span>
                                </div>
                                <div className="space-y-1 mb-3 text-sm">
                                    <p className="text-gray-600">
                                        <span className="font-medium">Prodi:</span> {item.mahasiswa?.prodi?.nama_prodi}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Semester:</span> {item.semester} •
                                        <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-medium">
                                            {item.total_sks || 0} SKS
                                        </span>
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Dosen Wali:</span> {item.mahasiswa?.dosen_wali?.nama || '-'}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Tanggal:</span> {new Date(item.tanggal_pengisian).toLocaleDateString('id-ID')}
                                    </p>
                                </div>
                                <Link
                                    href={route('baak.krs.show', item.id_krs)}
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium text-center block transition-colors"
                                >
                                    <i className="fas fa-eye mr-2"></i> Lihat Detail
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                            <i className="fas fa-inbox text-4xl mb-2 text-gray-400"></i>
                            <p className="text-gray-500">Tidak ada data KRS</p>
                        </div>
                    )}

                    {/* Pagination Mobile */}
                    {krs.last_page > 1 && (
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="text-sm text-gray-600 mb-3 text-center">
                                Menampilkan {krs.from} - {krs.to} dari {krs.total} data
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {krs.links.map((link, index) => (
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
