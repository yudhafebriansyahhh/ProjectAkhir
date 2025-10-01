import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Index({ mata_kuliah, prodi_list, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [prodi, setProdi] = useState(filters.prodi || '');
    const [semester, setSemester] = useState(filters.semester || '');
    const [kategori, setKategori] = useState(filters.kategori || '');
    const [status, setStatus] = useState(filters.status || '');

    const kategoriList = [
        { value: 'wajib', label: 'Wajib' },
        { value: 'pilihan', label: 'Pilihan' },
        { value: 'umum', label: 'Umum' }
    ];

    const statusList = [
        { value: '1', label: 'Aktif' },
        { value: '0', label: 'Nonaktif' }
    ];

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('baak.mata-kuliah.index'), {
            search,
            prodi,
            semester,
            kategori,
            status
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        setProdi('');
        setSemester('');
        setKategori('');
        setStatus('');
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

    const handleToggleStatus = (kode_matkul, nama_matkul, is_active) => {
        const action = is_active ? 'nonaktifkan' : 'aktifkan';

        if (window.Swal) {
            window.Swal.fire({
                title: `${action.charAt(0).toUpperCase() + action.slice(1)} Mata Kuliah?`,
                text: `Apakah Anda yakin ingin ${action} mata kuliah "${nama_matkul}"?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: is_active ? '#dc2626' : '#10b981',
                cancelButtonColor: '#6b7280',
                confirmButtonText: `Ya, ${action.charAt(0).toUpperCase() + action.slice(1)}!`,
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.post(route('baak.mata-kuliah.toggle-status', kode_matkul), {}, {
                        preserveScroll: true,
                    });
                }
            });
        } else {
            if (confirm(`Apakah Anda yakin ingin ${action} mata kuliah "${nama_matkul}"?`)) {
                router.post(route('baak.mata-kuliah.toggle-status', kode_matkul), {}, {
                    preserveScroll: true,
                });
            }
        }
    };

    const getKategoriBadge = (kategori) => {
        const badges = {
            'wajib': 'bg-red-100 text-red-700',
            'pilihan': 'bg-blue-100 text-blue-700',
            'umum': 'bg-green-100 text-green-700'
        };
        return badges[kategori] || 'bg-gray-100 text-gray-700';
    };

    return (
        <BaakLayout title="Data Mata Kuliah">
            <Head title="Data Mata Kuliah" />

            <div className="p-4 md:p-6">
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
                <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
                        {/* Search */}
                        <div className="lg:col-span-2">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari kode atau nama mata kuliah..."
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
                            <option value="umum">Mata Kuliah Umum</option>
                            {prodi_list.map((item) => (
                                <option key={item.kode_prodi} value={item.kode_prodi}>
                                    {item.nama_prodi}
                                </option>
                            ))}
                        </select>

                        {/* Semester Filter */}
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

                        {/* Kategori Filter */}
                        <select
                            value={kategori}
                            onChange={(e) => setKategori(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Semua Kategori</option>
                            {kategoriList.map((item) => (
                                <option key={item.value} value={item.value}>{item.label}</option>
                            ))}
                        </select>

                        {/* Status Filter */}
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Semua Status</option>
                            {statusList.map((item) => (
                                <option key={item.value} value={item.value}>{item.label}</option>
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
                        {(search || prodi || semester || kategori || status) && (
                            <button
                                onClick={handleReset}
                                className="flex-1 md:flex-none bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 flex items-center justify-center gap-2 transition-colors"
                            >
                                <i className="fas fa-redo"></i>
                                <span>Reset</span>
                            </button>
                        )}
                        <Link
                            href={route('baak.mata-kuliah.create')}
                            className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                            <i className="fas fa-plus"></i>
                            <span>Tambah Mata Kuliah</span>
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
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Nama Mata Kuliah</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">SKS</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Semester</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Program Studi</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Kategori</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Kelas</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {mata_kuliah.data.length > 0 ? (
                                    mata_kuliah.data.map((item, index) => (
                                        <tr key={item.kode_matkul} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {mata_kuliah.from + index}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-lg">
                                                    {item.kode_matkul}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                                {item.nama_matkul}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700 font-medium">
                                                {item.sks}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                                                {item.semester}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {item.prodi ? item.prodi.nama_prodi : <span className="text-green-600 font-medium">Mata Kuliah Umum</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getKategoriBadge(item.kategori)}`}>
                                                    {item.kategori.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-purple-100 text-purple-800">
                                                    {item.kelas_count} Kelas
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <button
                                                    onClick={() => handleToggleStatus(item.kode_matkul, item.nama_matkul, item.is_active)}
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                                                        item.is_active
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    }`}
                                                >
                                                    {item.is_active ? 'AKTIF' : 'NONAKTIF'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        href={route('baak.mata-kuliah.show', item.kode_matkul)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                                        title="Detail"
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </Link>
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
                                        <td colSpan="10" className="px-6 py-8 text-center text-gray-500">
                                            <i className="fas fa-inbox text-4xl mb-2 text-gray-400"></i>
                                            <p>Tidak ada data mata kuliah</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Desktop */}
                    {mata_kuliah.last_page > 1 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Menampilkan {mata_kuliah.from} - {mata_kuliah.to} dari {mata_kuliah.total} data
                            </div>
                            <div className="flex gap-2">
                                {mata_kuliah.links.map((link, index) => (
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
                    {mata_kuliah.data.length > 0 ? (
                        mata_kuliah.data.map((item) => (
                            <div key={item.kode_matkul} className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className="px-2 py-0.5 text-xs font-semibold text-blue-800 bg-blue-100 rounded">
                                                {item.kode_matkul}
                                            </span>
                                            <span className={`px-2 py-0.5 text-xs font-semibold rounded ${getKategoriBadge(item.kategori)}`}>
                                                {item.kategori.toUpperCase()}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 text-sm break-words">{item.nama_matkul}</h3>
                                    </div>
                                    <button
                                        onClick={() => handleToggleStatus(item.kode_matkul, item.nama_matkul, item.is_active)}
                                        className={`px-2 py-1 rounded text-xs font-semibold ml-2 flex-shrink-0 ${
                                            item.is_active
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}
                                    >
                                        {item.is_active ? 'AKTIF' : 'NON'}
                                    </button>
                                </div>
                                <div className="space-y-1 mb-3 text-sm">
                                    <p className="text-gray-600">
                                        <span className="font-medium">SKS:</span> {item.sks} | <span className="font-medium">Semester:</span> {item.semester}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Prodi:</span> {item.prodi ? item.prodi.nama_prodi : <span className="text-green-600">Mata Kuliah Umum</span>}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Kelas:</span>{' '}
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                            {item.kelas_count} Kelas
                                        </span>
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100">
                                    <Link
                                        href={route('baak.mata-kuliah.show', item.kode_matkul)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium text-center transition-colors"
                                    >
                                        <i className="fas fa-eye mr-1"></i> Detail
                                    </Link>
                                    <Link
                                        href={route('baak.mata-kuliah.edit', item.kode_matkul)}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm font-medium text-center transition-colors"
                                    >
                                        <i className="fas fa-edit mr-1"></i> Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(item.kode_matkul, item.nama_matkul)}
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
                            <p className="text-gray-500">Tidak ada data mata kuliah</p>
                        </div>
                    )}

                    {/* Pagination Mobile */}
                    {mata_kuliah.last_page > 1 && (
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="text-sm text-gray-600 mb-3 text-center">
                                Menampilkan {mata_kuliah.from} - {mata_kuliah.to} dari {mata_kuliah.total} data
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {mata_kuliah.links.map((link, index) => (
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
