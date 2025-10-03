import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Show({ mata_kuliah }) {
    const [activeTab, setActiveTab] = useState('info');

    const handleToggleStatus = () => {
        const action = mata_kuliah.is_active ? 'nonaktifkan' : 'aktifkan';

        if (window.Swal) {
            window.Swal.fire({
                title: `${action.charAt(0).toUpperCase() + action.slice(1)} Mata Kuliah?`,
                text: `Apakah Anda yakin ingin ${action} mata kuliah "${mata_kuliah.nama_matkul}"?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: mata_kuliah.is_active ? '#dc2626' : '#10b981',
                cancelButtonColor: '#6b7280',
                confirmButtonText: `Ya, ${action.charAt(0).toUpperCase() + action.slice(1)}!`,
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.post(route('baak.mata-kuliah.toggle-status', mata_kuliah.kode_matkul), {}, {
                        preserveScroll: true,
                    });
                }
            });
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
        <BaakLayout title="Detail Mata Kuliah">
            <Head title={`Detail - ${mata_kuliah.nama_matkul}`} />

            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={route('baak.mata-kuliah.index')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-3 inline-flex items-center gap-1"
                    >
                        <i className="fas fa-arrow-left"></i>
                        <span>Kembali ke Daftar Mata Kuliah</span>
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mt-3">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-700">Detail Mata Kuliah</h1>
                            <p className="text-sm text-gray-600 mt-1">Informasi lengkap mata kuliah</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <button
                                onClick={handleToggleStatus}
                                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                                    mata_kuliah.is_active
                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                        : 'bg-green-500 hover:bg-green-600 text-white'
                                }`}
                            >
                                <i className={`fas ${mata_kuliah.is_active ? 'fa-times-circle' : 'fa-check-circle'}`}></i>
                                <span>{mata_kuliah.is_active ? 'Nonaktifkan' : 'Aktifkan'}</span>
                            </button>
                            <Link
                                href={route('baak.mata-kuliah.edit', mata_kuliah.kode_matkul)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                                <i className="fas fa-edit"></i>
                                <span>Edit Data</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Icon */}
                        <div className="flex-shrink-0 mx-auto lg:mx-0">
                            <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-white shadow-md flex items-center justify-center">
                                <i className="fas fa-book-open text-5xl lg:text-6xl text-blue-500"></i>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="text-center lg:text-left">
                                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2 flex-wrap">
                                    <span className="px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-lg">
                                        {mata_kuliah.kode_matkul}
                                    </span>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-lg ${getKategoriBadge(mata_kuliah.kategori)}`}>
                                        {mata_kuliah.kategori.toUpperCase()}
                                    </span>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                                        mata_kuliah.is_active
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                        {mata_kuliah.is_active ? 'AKTIF' : 'NONAKTIF'}
                                    </span>
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 break-words">
                                    {mata_kuliah.nama_matkul}
                                </h2>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center lg:justify-start gap-2">
                                        <i className="fas fa-graduation-cap text-gray-400 text-sm"></i>
                                        <p className="text-gray-600 text-sm break-words">
                                            <span className="font-medium">Program Studi:</span>{' '}
                                            {mata_kuliah.prodi ? mata_kuliah.prodi.nama_prodi : <span className="text-green-600 font-medium">Semua Prodi (Mata Kuliah Umum)</span>}
                                        </p>
                                    </div>
                                    {mata_kuliah.prodi && (
                                        <div className="flex items-center justify-center lg:justify-start gap-2">
                                            <i className="fas fa-building text-gray-400 text-sm"></i>
                                            <p className="text-gray-600 text-sm break-words">
                                                <span className="font-medium">Fakultas:</span> {mata_kuliah.prodi.fakultas?.nama_fakultas || '-'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4 mt-4 md:mt-6">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 md:p-4 border border-blue-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <i className="fas fa-book text-blue-600 text-sm"></i>
                                        <p className="text-xs md:text-sm text-gray-600 font-medium">SKS</p>
                                    </div>
                                    <p className="font-bold text-gray-800 text-xl md:text-2xl">{mata_kuliah.sks} SKS</p>
                                    <p className="text-xs text-gray-600 mt-1">Satuan Kredit</p>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 md:p-4 border border-green-200 sm:col-span-2 lg:col-span-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <i className="fas fa-chalkboard text-green-600 text-sm"></i>
                                        <p className="text-xs md:text-sm text-gray-600 font-medium">Kelas</p>
                                    </div>
                                    <p className="font-bold text-gray-800 text-xl md:text-2xl">
                                        {mata_kuliah.kelas?.length || 0} Kelas
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">Kelas Tersedia</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {/* Tab Headers */}
                    <div className="border-b border-gray-200 bg-gray-50 overflow-x-auto">
                        <div className="flex min-w-max">
                            <button
                                onClick={() => setActiveTab('info')}
                                className={`flex-1 sm:flex-none px-4 md:px-6 py-3 text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
                                    activeTab === 'info'
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                }`}
                            >
                                <i className="fas fa-info-circle mr-1 md:mr-2"></i>
                                <span>Informasi Mata Kuliah</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('kelas')}
                                className={`flex-1 sm:flex-none px-4 md:px-6 py-3 text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
                                    activeTab === 'kelas'
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                }`}
                            >
                                <i className="fas fa-chalkboard-teacher mr-1 md:mr-2"></i>
                                <span>Daftar Kelas ({mata_kuliah.kelas?.length || 0})</span>
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-4 md:p-6">
                        {/* Info Tab */}
                        {activeTab === 'info' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Kode Mata Kuliah</label>
                                    <p className="text-gray-800 text-sm md:text-base mt-1">{mata_kuliah.kode_matkul || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Nama Mata Kuliah</label>
                                    <p className="text-gray-800 text-sm md:text-base mt-1 break-words">{mata_kuliah.nama_matkul || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">SKS</label>
                                    <p className="text-gray-800 text-sm md:text-base mt-1">{mata_kuliah.sks || '-'} SKS</p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Program Studi</label>
                                    <p className="text-gray-800 text-sm md:text-base mt-1 break-words">
                                        {mata_kuliah.prodi ? mata_kuliah.prodi.nama_prodi : <span className="text-green-600 font-medium">Semua Prodi (Mata Kuliah Umum)</span>}
                                    </p>
                                </div>
                                {mata_kuliah.prodi && (
                                    <div>
                                        <label className="text-xs md:text-sm font-semibold text-gray-600">Fakultas</label>
                                        <p className="text-gray-800 text-sm md:text-base mt-1 break-words">{mata_kuliah.prodi.fakultas?.nama_fakultas || '-'}</p>
                                    </div>
                                )}
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Kategori</label>
                                    <p className="text-gray-800 text-sm md:text-base mt-1">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getKategoriBadge(mata_kuliah.kategori)}`}>
                                            {mata_kuliah.kategori === 'wajib' ? 'Mata Kuliah Wajib' :
                                             mata_kuliah.kategori === 'pilihan' ? 'Mata Kuliah Pilihan' :
                                             'Mata Kuliah Umum'}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Status</label>
                                    <p className="text-gray-800 text-sm md:text-base mt-1">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            mata_kuliah.is_active
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                            {mata_kuliah.is_active ? 'AKTIF' : 'NONAKTIF'}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Jumlah Kelas</label>
                                    <p className="text-gray-800 text-sm md:text-base mt-1">{mata_kuliah.kelas?.length || 0} Kelas</p>
                                </div>
                                {mata_kuliah.deskripsi && (
                                    <div className="md:col-span-2">
                                        <label className="text-xs md:text-sm font-semibold text-gray-600">Deskripsi</label>
                                        <p className="text-gray-800 text-sm mt-1 break-words">{mata_kuliah.deskripsi}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Kelas Tab */}
                        {activeTab === 'kelas' && (
                            <div>
                                {mata_kuliah.kelas && mata_kuliah.kelas.length > 0 ? (
                                    <>
                                        {/* Desktop Table */}
                                        <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
                                            <table className="w-full">
                                                <thead className="bg-gray-50">
                                                    <tr className="text-gray-600 font-semibold text-xs">
                                                        <th className="px-6 py-4 text-left uppercase tracking-wider">No</th>
                                                        <th className="px-6 py-3 text-center uppercase tracking-wider">Kelas</th>
                                                        <th className="px-6 py-3 text-left uppercase tracking-wider">Dosen Pengampu</th>
                                                        <th className="px-6 py-3 text-center uppercase tracking-wider">Hari</th>
                                                        <th className="px-6 py-3 text-center uppercase tracking-wider">Jam</th>
                                                        <th className="px-6 py-3 text-center uppercase tracking-wider">Ruang</th>
                                                        <th className="px-6 py-3 text-center uppercase tracking-wider">Kapasitas</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {mata_kuliah.kelas.map((item, index) => (
                                                        <tr key={item.id_kelas} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                                {index + 1}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                                <span className="px-3 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-lg">
                                                                    {item.nama_kelas}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-700 font-medium">
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
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                                {item.kapasitas} mhs
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Mobile Cards */}
                                        <div className="md:hidden space-y-4">
                                            {mata_kuliah.kelas.map((item, index) => (
                                                <div key={item.id_kelas} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-xs font-semibold text-gray-500">#{index + 1}</span>
                                                                <span className="px-2 py-0.5 text-xs font-semibold text-purple-800 bg-purple-100 rounded">
                                                                    Kelas {item.nama_kelas}
                                                                </span>
                                                            </div>
                                                            <h4 className="font-semibold text-gray-800 text-sm break-words">
                                                                {item.dosen?.nama || '-'}
                                                            </h4>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1 text-sm text-gray-600">
                                                        <p><span className="font-medium">Hari:</span> {item.hari}</p>
                                                        <p><span className="font-medium">Jam:</span> {item.jam_mulai?.substring(0, 5)} - {item.jam_selesai?.substring(0, 5)}</p>
                                                        <p><span className="font-medium">Ruang:</span> {item.ruang_kelas}</p>
                                                        <p><span className="font-medium">Kapasitas:</span> {item.kapasitas} mahasiswa</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                        <i className="fas fa-chalkboard-teacher text-4xl md:text-5xl mb-4 text-gray-400"></i>
                                        <p className="text-base md:text-lg font-medium">Belum ada kelas untuk mata kuliah ini</p>
                                        <p className="text-xs md:text-sm mt-1">Tambahkan kelas baru di menu Manajemen Kelas</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </BaakLayout>
    );
}
