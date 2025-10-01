import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Show({ kelas, mahasiswa }) {
    const [activeTab, setActiveTab] = useState('info');

    return (
        <BaakLayout title="Detail Kelas">
            <Head title={`Detail - ${kelas.mata_kuliah?.nama_matkul}`} />

            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={route('baak.kelas.index')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-3 inline-flex items-center gap-1"
                    >
                        <i className="fas fa-arrow-left"></i>
                        <span>Kembali ke Daftar Kelas</span>
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mt-3">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-700">Detail Kelas</h1>
                            <p className="text-sm text-gray-600 mt-1">Informasi lengkap kelas perkuliahan</p>
                        </div>
                        <Link
                            href={route('baak.kelas.edit', kelas.id_kelas)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                            <i className="fas fa-edit"></i>
                            <span>Edit Kelas</span>
                        </Link>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Icon */}
                        <div className="flex-shrink-0 mx-auto lg:mx-0">
                            <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-white shadow-md flex items-center justify-center">
                                <i className="fas fa-chalkboard-teacher text-5xl lg:text-6xl text-blue-500"></i>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="text-center lg:text-left">
                                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2 flex-wrap">
                                    <span className="px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-lg">
                                        {kelas.mata_kuliah?.kode_matkul}
                                    </span>
                                    <span className="px-3 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-lg">
                                        Kelas {kelas.nama_kelas}
                                    </span>
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 break-words">
                                    {kelas.mata_kuliah?.nama_matkul}
                                </h2>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center lg:justify-start gap-2">
                                        <i className="fas fa-user-tie text-gray-400 text-sm"></i>
                                        <p className="text-gray-600 text-sm break-words">
                                            <span className="font-medium">Dosen:</span> {kelas.dosen?.nama}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-center lg:justify-start gap-2">
                                        <i className="fas fa-calendar text-gray-400 text-sm"></i>
                                        <p className="text-gray-600 text-sm">
                                            <span className="font-medium">Jadwal:</span> {kelas.hari}, {kelas.jam_mulai?.substring(0, 5)} - {kelas.jam_selesai?.substring(0, 5)}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-center lg:justify-start gap-2">
                                        <i className="fas fa-door-open text-gray-400 text-sm"></i>
                                        <p className="text-gray-600 text-sm">
                                            <span className="font-medium">Ruang:</span> {kelas.ruang_kelas}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-6">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 md:p-4 border border-blue-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <i className="fas fa-book-open text-blue-600 text-sm"></i>
                                        <p className="text-xs md:text-sm text-gray-600 font-medium">SKS</p>
                                    </div>
                                    <p className="font-bold text-gray-800 text-xl md:text-2xl">{kelas.mata_kuliah?.sks} SKS</p>
                                    <p className="text-xs text-gray-600 mt-1">Bobot Kredit</p>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 md:p-4 border border-green-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <i className="fas fa-users text-green-600 text-sm"></i>
                                        <p className="text-xs md:text-sm text-gray-600 font-medium">Mahasiswa</p>
                                    </div>
                                    <p className="font-bold text-gray-800 text-xl md:text-2xl">
                                        {mahasiswa.length}/{kelas.kapasitas}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {kelas.kapasitas - mahasiswa.length} Kuota Tersisa
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 md:p-4 border border-purple-200 sm:col-span-2 lg:col-span-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <i className="fas fa-chart-line text-purple-600 text-sm"></i>
                                        <p className="text-xs md:text-sm text-gray-600 font-medium">Semester</p>
                                    </div>
                                    <p className="font-bold text-gray-800 text-xl md:text-2xl">
                                        Semester {kelas.mata_kuliah?.semester}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">Periode Mata Kuliah</p>
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
                                <span>Informasi Kelas</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('mahasiswa')}
                                className={`flex-1 sm:flex-none px-4 md:px-6 py-3 text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
                                    activeTab === 'mahasiswa'
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                }`}
                            >
                                <i className="fas fa-user-graduate mr-1 md:mr-2"></i>
                                <span>Daftar Mahasiswa ({mahasiswa.length})</span>
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
                                    <p className="text-gray-800 text-sm md:text-base mt-1">{kelas.mata_kuliah?.kode_matkul || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Nama Mata Kuliah</label>
                                    <p className="text-gray-800 text-sm md:text-base mt-1 break-words">{kelas.mata_kuliah?.nama_matkul || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Nama Kelas</label>
                                    <p className="text-gray-800 text-sm md:text-base mt-1">{kelas.nama_kelas || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">SKS</label>
                                    <p className="text-gray-800 text-sm md:text-base mt-1">{kelas.mata_kuliah?.sks || '-'} SKS</p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Dosen Pengampu</label>
                                    <p className="text-gray-800 text-sm md:text-base mt-1 break-words">{kelas.dosen?.nama || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Program Studi Dosen</label>
                                    <p className="text-gray-800 text-sm md:text-base mt-1 break-words">{kelas.dosen?.prodi?.nama_prodi || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Hari</label>
                                    <p className="text-gray-800 text-sm md:text-base mt-1">{kelas.hari || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Jam Kuliah</label>
                                    <p className="text-gray-800 text-sm md:text-base mt-1">
                                        {kelas.jam_mulai?.substring(0, 5)} - {kelas.jam_selesai?.substring(0, 5)}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Ruang Kelas</label>
                                    <p className="text-gray-800 text-sm md:text-base mt-1">{kelas.ruang_kelas || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Kapasitas</label>
                                    <p className="text-gray-800 text-sm md:text-base mt-1">{kelas.kapasitas || '-'} Mahasiswa</p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Jumlah Mahasiswa</label>
                                    <p className="text-gray-800 text-sm md:text-base mt-1">
                                        {mahasiswa.length} Mahasiswa ({kelas.kapasitas - mahasiswa.length} Kuota Tersisa)
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Semester</label>
                                    <p className="text-gray-800 text-sm md:text-base mt-1">Semester {kelas.mata_kuliah?.semester || '-'}</p>
                                </div>
                                {kelas.mata_kuliah?.deskripsi && (
                                    <div className="md:col-span-2">
                                        <label className="text-xs md:text-sm font-semibold text-gray-600">Deskripsi Mata Kuliah</label>
                                        <p className="text-gray-800 text-sm mt-1 break-words">{kelas.mata_kuliah.deskripsi}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Mahasiswa Tab */}
                        {activeTab === 'mahasiswa' && (
                            <div>
                                {mahasiswa && mahasiswa.length > 0 ? (
                                    <>
                                        {/* Desktop Table */}
                                        <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
                                            <table className="w-full">
                                                <thead className="bg-gray-50">
                                                    <tr className="text-gray-600 font-semibold text-xs">
                                                        <th className="px-6 py-4 text-left uppercase tracking-wider">No</th>
                                                        <th className="px-6 py-3 text-left uppercase tracking-wider">NIM</th>
                                                        <th className="px-6 py-3 text-left uppercase tracking-wider">Nama Mahasiswa</th>
                                                        <th className="px-6 py-3 text-left uppercase tracking-wider">Program Studi</th>
                                                        <th className="px-6 py-3 text-center uppercase tracking-wider">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {mahasiswa.map((mhs, index) => (
                                                        <tr key={mhs.id_mahasiswa} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                                {index + 1}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-lg">
                                                                    {mhs.nim}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                                                {mhs.nama}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                                {mhs.prodi?.nama_prodi || '-'}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                                    mhs.status === 'aktif' ? 'bg-green-100 text-green-700' :
                                                                    mhs.status === 'lulus' ? 'bg-blue-100 text-blue-700' :
                                                                    mhs.status === 'keluar' ? 'bg-yellow-100 text-yellow-700' :
                                                                    'bg-red-100 text-red-700'
                                                                }`}>
                                                                    {mhs.status?.toUpperCase()}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Mobile Cards */}
                                        <div className="md:hidden space-y-4">
                                            {mahasiswa.map((mhs, index) => (
                                                <div key={mhs.id_mahasiswa} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-xs font-semibold text-gray-500">#{index + 1}</span>
                                                                <span className="px-2 py-0.5 text-xs font-semibold text-blue-800 bg-blue-100 rounded">
                                                                    {mhs.nim}
                                                                </span>
                                                            </div>
                                                            <h4 className="font-semibold text-gray-800 text-sm break-words">
                                                                {mhs.nama}
                                                            </h4>
                                                        </div>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 flex-shrink-0 ${
                                                            mhs.status === 'aktif' ? 'bg-green-100 text-green-700' :
                                                            mhs.status === 'lulus' ? 'bg-blue-100 text-blue-700' :
                                                            mhs.status === 'keluar' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                        }`}>
                                                            {mhs.status?.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-600 mt-2 break-words">
                                                        <span className="font-medium">Prodi:</span> {mhs.prodi?.nama_prodi || '-'}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                        <i className="fas fa-user-graduate text-4xl md:text-5xl mb-4 text-gray-400"></i>
                                        <p className="text-base md:text-lg font-medium">Belum ada mahasiswa yang mengambil kelas ini</p>
                                        <p className="text-xs md:text-sm mt-1">Mahasiswa akan muncul setelah melakukan pengisian KRS</p>
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
