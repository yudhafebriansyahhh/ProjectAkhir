// resources/js/Pages/Baak/PengaturanKrs/Index.jsx

import { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Index({ pengaturan, filters, prodis, periodes }) {
    const { flash } = usePage().props;

    const [selectedFilters, setSelectedFilters] = useState({
        tahun_ajaran: filters.tahun_ajaran || '',
        jenis_semester: filters.jenis_semester || '',
        kode_prodi: filters.kode_prodi || '',
        semester: filters.semester || '',
    });

    // Auto-filter saat filter berubah
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(route('baak.pengaturan-krs.index'), selectedFilters, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [selectedFilters]);

    const handleFilterChange = (key, value) => {
        setSelectedFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleReset = () => {
        setSelectedFilters({
            tahun_ajaran: '',
            jenis_semester: '',
            kode_prodi: '',
            semester: '',
        });
    };

    const handleDelete = (id, namaMk) => {
        if (window.Swal) {
            window.Swal.fire({
                title: 'Hapus Pengaturan?',
                text: `Hapus pengaturan "${namaMk}"?`,
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

    // Group by semester
    const groupedBySemester = pengaturan.reduce((acc, item) => {
        const sem = item.semester_ditawarkan;
        if (!acc[sem]) {
            acc[sem] = [];
        }
        acc[sem].push(item);
        return acc;
    }, {});

    const sortedSemesters = Object.keys(groupedBySemester).sort((a, b) => a - b);

    // Get semester options
    const getSemesterOptions = () => {
        if (selectedFilters.jenis_semester === 'ganjil') {
            return [1, 3, 5, 7];
        } else if (selectedFilters.jenis_semester === 'genap') {
            return [2, 4, 6, 8];
        }
        return [1, 2, 3, 4, 5, 6, 7, 8];
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
                        Kelola mata kuliah yang ditawarkan per periode dan semester
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

                {/* Filters */}
                <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-700">Filter</h3>
                        {(selectedFilters.tahun_ajaran || selectedFilters.jenis_semester || selectedFilters.kode_prodi || selectedFilters.semester) && (
                            <button
                                onClick={handleReset}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                                <i className="fas fa-redo mr-1"></i>
                                Reset Filter
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {/* Tahun Ajaran */}
                        <select
                            value={selectedFilters.tahun_ajaran}
                            onChange={(e) => handleFilterChange('tahun_ajaran', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Semua Tahun Ajaran</option>
                            {periodes.map((periode) => (
                                <option key={periode.tahun_ajaran} value={periode.tahun_ajaran}>
                                    {periode.tahun_ajaran}
                                </option>
                            ))}
                        </select>

                        {/* Jenis Semester */}
                        <select
                            value={selectedFilters.jenis_semester}
                            onChange={(e) => handleFilterChange('jenis_semester', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Semua Jenis Semester</option>
                            <option value="ganjil">Ganjil</option>
                            <option value="genap">Genap</option>
                            <option value="pendek">Pendek</option>
                        </select>

                        {/* Prodi */}
                        <select
                            value={selectedFilters.kode_prodi}
                            onChange={(e) => handleFilterChange('kode_prodi', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Semua Prodi</option>
                            {prodis.map((prodi) => (
                                <option key={prodi.kode_prodi} value={prodi.kode_prodi}>
                                    {prodi.nama_prodi}
                                </option>
                            ))}
                        </select>

                        {/* Semester */}
                        <select
                            value={selectedFilters.semester}
                            onChange={(e) => handleFilterChange('semester', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Semua Semester</option>
                            {getSemesterOptions().map((sem) => (
                                <option key={sem} value={sem}>
                                    Semester {sem}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Action Button */}
                <div className="mb-6 flex justify-end">
                    <Link
                        href={route('baak.pengaturan-krs.create')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                        <i className="fas fa-plus"></i>
                        <span>Set Mata Kuliah KRS</span>
                    </Link>
                </div>

                {/* Content */}
                {pengaturan.length > 0 ? (
                    <div className="space-y-6">
                        {sortedSemesters.map((semester) => (
                            <div key={semester} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                {/* Semester Header */}
                                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                        <i className="fas fa-book"></i>
                                        Semester {semester}
                                    </h2>
                                    <span className="text-blue-100 text-sm">
                                        {groupedBySemester[semester].length} Mata Kuliah
                                    </span>
                                </div>

                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr className="text-xs text-gray-600 uppercase">
                                                <th className="px-6 py-3 text-left">Kode</th>
                                                <th className="px-6 py-3 text-left">Mata Kuliah</th>
                                                <th className="px-6 py-3 text-left">Prodi</th>
                                                <th className="px-6 py-3 text-center">Kategori</th>
                                                <th className="px-6 py-3 text-center">SKS</th>
                                                <th className="px-6 py-3 text-center">Periode</th>
                                                <th className="px-6 py-3 text-center">Kelas</th>
                                                <th className="px-6 py-3 text-center">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {groupedBySemester[semester].map((item) => (
                                                <tr key={item.id_mk_periode} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded">
                                                            {item.mata_kuliah?.kode_matkul}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {item.mata_kuliah?.nama_matkul}
                                                            </p>
                                                            {item.catatan && (
                                                                <p className="text-xs text-gray-500 italic mt-1">
                                                                    <i className="fas fa-info-circle mr-1"></i>
                                                                    {item.catatan}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">
                                                        {item.prodi?.nama_prodi}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                                                            item.mata_kuliah?.kategori === 'wajib' ? 'bg-red-100 text-red-700' :
                                                            item.mata_kuliah?.kategori === 'pilihan' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-green-100 text-green-700'
                                                        }`}>
                                                            {item.mata_kuliah?.kategori}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-center text-gray-700">
                                                        {item.mata_kuliah?.sks}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-center text-gray-700 capitalize">
                                                        {item.tahun_ajaran}<br/>
                                                        <span className="text-xs text-gray-500">{item.jenis_semester}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        {item.kelas && item.kelas.length > 0 ? (
                                                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                                                {item.kelas.length} Kelas
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs text-gray-400">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Link
                                                                href={route('baak.pengaturan-krs.edit', item.id_mk_periode)}
                                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(item.id_mk_periode, item.mata_kuliah?.nama_matkul)}
                                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <i className="fas fa-inbox text-5xl text-gray-400 mb-4"></i>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            Belum Ada Data
                        </h3>
                        <p className="text-gray-500 mb-4">
                            {(selectedFilters.tahun_ajaran || selectedFilters.jenis_semester || selectedFilters.kode_prodi || selectedFilters.semester)
                                ? 'Tidak ada data dengan filter yang dipilih'
                                : 'Belum ada pengaturan mata kuliah KRS'}
                        </p>
                        <Link
                            href={route('baak.pengaturan-krs.create')}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            <i className="fas fa-plus"></i>
                            <span>Set Mata Kuliah KRS</span>
                        </Link>
                    </div>
                )}
            </div>
        </BaakLayout>
    );
}
