import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Index({ jadwalKrs, prodiList, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [selectedProdi, setSelectedProdi] = useState(filters.prodi || '');
    const [selectedTahun, setSelectedTahun] = useState(filters.tahun_ajaran || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('baak.jadwal-krs.index'), {
            search,
            prodi: selectedProdi,
            tahun_ajaran: selectedTahun,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        setSelectedProdi('');
        setSelectedTahun('');
        router.get(route('baak.jadwal-krs.index'));
    };

    const handleDelete = (jadwal) => {
        if (window.Swal) {
            window.Swal.fire({
                title: 'Hapus Jadwal KRS?',
                text: `Jadwal KRS ${jadwal.prodi.nama_prodi} akan dihapus permanen!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc2626',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.delete(route('baak.jadwal-krs.destroy', jadwal.id_jadwal), {
                        preserveScroll: true,
                    });
                }
            });
        }
    };

    const getCountdown = (jadwal) => {
        const now = new Date();
        const mulai = new Date(jadwal.tanggal_mulai);
        const selesai = new Date(jadwal.tanggal_selesai);

        if (jadwal.status_label === 'Belum Mulai') {
            const days = Math.ceil((mulai - now) / (1000 * 60 * 60 * 24));
            return `${days} hari lagi`;
        } else if (jadwal.status_label === 'Sedang Berjalan') {
            const days = Math.ceil((selesai - now) / (1000 * 60 * 60 * 24));
            return `${days} hari tersisa`;
        }
        return null;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatSemesterList = (semesterList) => {
        if (!semesterList || semesterList.length === 0) return '-';

        const sorted = [...semesterList].sort((a, b) => a - b);
        return sorted.map(sem => `Semester ${sem}`).join(', ');
    };

    const getSemesterBadges = (semesterList) => {
        if (!semesterList || semesterList.length === 0) return null;

        const sorted = [...semesterList].sort((a, b) => a - b);

        return (
            <div className="flex flex-wrap gap-1">
                {sorted.map((sem) => (
                    <span
                        key={sem}
                        className="inline-block px-2 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded"
                    >
                        Sem {sem}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <BaakLayout>
            <Head title="Manajemen Jadwal KRS" />

            <div className="p-4 md:p-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Manajemen Jadwal Pengisian KRS</h1>
                    <p className="text-gray-600">Kelola jadwal pengisian KRS untuk setiap program studi</p>
                </div>

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

                <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-1">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari prodi..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>

                        <select
                            value={selectedProdi}
                            onChange={(e) => setSelectedProdi(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Semua Program Studi</option>
                            {prodiList.map((prodi) => (
                                <option key={prodi.kode_prodi} value={prodi.kode_prodi}>
                                    {prodi.nama_prodi}
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            value={selectedTahun}
                            onChange={(e) => setSelectedTahun(e.target.value)}
                            placeholder="Tahun Ajaran (2024/2025)"
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>

                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={handleFilter}
                            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                            <i className="fas fa-filter"></i>
                            <span>Filter</span>
                        </button>
                        {(search || selectedProdi || selectedTahun) && (
                            <button
                                onClick={handleReset}
                                className="flex-1 md:flex-none bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 flex items-center justify-center gap-2 transition-colors"
                            >
                                <i className="fas fa-redo"></i>
                                <span>Reset</span>
                            </button>
                        )}
                        <Link
                            href={route('baak.jadwal-krs.create')}
                            className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                            <i className="fas fa-plus"></i>
                            <span>Tambah Jadwal KRS</span>
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
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Program Studi</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Semester</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Tahun Ajaran</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Periode</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {jadwalKrs.data.length > 0 ? (
                                    jadwalKrs.data.map((jadwal, index) => {
                                        const countdown = getCountdown(jadwal);
                                        return (
                                            <tr key={jadwal.id_jadwal} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {jadwalKrs.from + index}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{jadwal.prodi.nama_prodi}</div>
                                                    <div className="text-sm text-gray-500">{jadwal.prodi.jenjang}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getSemesterBadges(jadwal.semester_list)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                    {jadwal.tahun_ajaran}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {formatDate(jadwal.tanggal_mulai)}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        s/d {formatDate(jadwal.tanggal_selesai)}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        ({jadwal.durasi} hari)
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className={`px-3 py-1 text-xs font-semibold rounded-lg ${jadwal.status_badge}`}>
                                                        {jadwal.status_label}
                                                    </span>
                                                    {countdown && (
                                                        <div className="text-xs text-blue-600 mt-1 font-medium">{countdown}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Link
                                                            href={route('baak.jadwal-krs.edit', jadwal.id_jadwal)}
                                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                                            title="Edit"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(jadwal)}
                                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                                            title="Hapus"
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                            <i className="fas fa-inbox text-4xl mb-2 text-gray-400"></i>
                                            <p>Tidak ada data jadwal KRS</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {jadwalKrs.last_page > 1 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Menampilkan {jadwalKrs.from} - {jadwalKrs.to} dari {jadwalKrs.total} data
                            </div>
                            <div className="flex gap-2">
                                {jadwalKrs.links.map((link, index) => (
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
                    {jadwalKrs.data.length > 0 ? (
                        jadwalKrs.data.map((jadwal) => {
                            const countdown = getCountdown(jadwal);
                            return (
                                <div key={jadwal.id_jadwal} className="bg-white rounded-lg border border-gray-200 p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{jadwal.prodi.nama_prodi}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {jadwal.tahun_ajaran}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-lg ${jadwal.status_badge}`}>
                                            {jadwal.status_label}
                                        </span>
                                    </div>

                                    <div className="mb-3">
                                        <p className="text-xs text-gray-500 mb-1">Semester:</p>
                                        {getSemesterBadges(jadwal.semester_list)}
                                    </div>

                                    <div className="space-y-2 text-sm mb-4">
                                        <p className="text-gray-600">
                                            <span className="font-medium">Mulai:</span> {formatDate(jadwal.tanggal_mulai)}
                                        </p>
                                        <p className="text-gray-600">
                                            <span className="font-medium">Selesai:</span> {formatDate(jadwal.tanggal_selesai)}
                                        </p>
                                        <p className="text-gray-600">
                                            <span className="font-medium">Durasi:</span> {jadwal.durasi} hari
                                        </p>
                                        {countdown && (
                                            <p className="text-blue-600 font-medium">
                                                <span className="text-gray-600">Countdown:</span> {countdown}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                                        <Link
                                            href={route('baak.jadwal-krs.edit', jadwal.id_jadwal)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm font-medium text-center transition-colors"
                                        >
                                            <i className="fas fa-edit mr-1"></i> Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(jadwal)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                                        >
                                            <i className="fas fa-trash mr-1"></i> Hapus
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                            <i className="fas fa-inbox text-4xl mb-2 text-gray-400"></i>
                            <p className="text-gray-500">Tidak ada data jadwal KRS</p>
                        </div>
                    )}

                    {jadwalKrs.last_page > 1 && (
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="text-sm text-gray-600 mb-3 text-center">
                                Menampilkan {jadwalKrs.from} - {jadwalKrs.to} dari {jadwalKrs.total} data
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {jadwalKrs.links.map((link, index) => (
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
