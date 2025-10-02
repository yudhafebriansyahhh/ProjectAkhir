import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Show({ prodi, stats }) {
    const [activeTab, setActiveTab] = useState('info');

    const getStatusBadge = (status) => {
        const badges = {
            'aktif': 'bg-green-100 text-green-700',
            'cuti': 'bg-yellow-100 text-yellow-700',
            'lulus': 'bg-blue-100 text-blue-700',
            'DO': 'bg-red-100 text-red-700',
        };
        return badges[status] || 'bg-gray-100 text-gray-700';
    };

    return (
        <BaakLayout>
            <Head title={`Detail ${prodi.nama_prodi}`} />

            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={route('baak.prodi.index')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-3 inline-flex items-center gap-1"
                    >
                        <i className="fas fa-arrow-left"></i>
                        <span>Kembali ke Daftar Prodi</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-700 mt-2">Detail Program Studi</h1>
                </div>

                {/* Info Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{prodi.nama_prodi}</h2>
                            <p className="text-gray-600 mt-1">{prodi.fakultas.nama_fakultas}</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold">
                                {prodi.jenjang}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Kode Prodi</p>
                            <p className="font-semibold text-gray-900">{prodi.kode_prodi}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Kode Fakultas</p>
                            <p className="font-semibold text-gray-900">{prodi.kode_fakultas}</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Dosen</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_dosen}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-chalkboard-teacher text-blue-600 text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Mahasiswa Aktif</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_mahasiswa}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-user-graduate text-green-600 text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Mata Kuliah</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_mata_kuliah}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-book text-purple-600 text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Mahasiswa</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {Object.values(stats.mahasiswa_per_status).reduce((a, b) => a + b, 0)}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-users text-orange-600 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="border-b border-gray-200">
                        <nav className="flex">
                            <button
                                onClick={() => setActiveTab('info')}
                                className={`px-6 py-3 text-sm font-medium ${
                                    activeTab === 'info'
                                        ? 'border-b-2 border-blue-600 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <i className="fas fa-info-circle mr-2"></i>
                                Informasi
                            </button>
                            <button
                                onClick={() => setActiveTab('dosen')}
                                className={`px-6 py-3 text-sm font-medium ${
                                    activeTab === 'dosen'
                                        ? 'border-b-2 border-blue-600 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <i className="fas fa-chalkboard-teacher mr-2"></i>
                                Dosen ({stats.total_dosen})
                            </button>
                            <button
                                onClick={() => setActiveTab('mahasiswa')}
                                className={`px-6 py-3 text-sm font-medium ${
                                    activeTab === 'mahasiswa'
                                        ? 'border-b-2 border-blue-600 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <i className="fas fa-user-graduate mr-2"></i>
                                Mahasiswa ({stats.total_mahasiswa})
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Tab Info */}
                        {activeTab === 'info' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistik Mahasiswa per Status</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {Object.entries(stats.mahasiswa_per_status).map(([status, total]) => (
                                            <div key={status} className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <p className={`text-2xl font-bold mb-1 ${
                                                    status === 'aktif' ? 'text-green-600' :
                                                    status === 'cuti' ? 'text-yellow-600' :
                                                    status === 'lulus' ? 'text-blue-600' : 'text-red-600'
                                                }`}>
                                                    {total}
                                                </p>
                                                <p className="text-sm text-gray-600 capitalize">{status}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Program Studi</h3>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Nama Program Studi</p>
                                                <p className="font-semibold text-gray-900">{prodi.nama_prodi}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Jenjang</p>
                                                <p className="font-semibold text-gray-900">{prodi.jenjang}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Fakultas</p>
                                                <p className="font-semibold text-gray-900">{prodi.fakultas.nama_fakultas}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Kode Prodi</p>
                                                <p className="font-semibold text-gray-900">{prodi.kode_prodi}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab Dosen */}
                        {activeTab === 'dosen' && (
                            <div>
                                {prodi.dosen && prodi.dosen.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr className="text-gray-600 text-xs font-semibold uppercase">
                                                    <th className="px-4 py-3 text-left">No</th>
                                                    <th className="px-4 py-3 text-left">NIP</th>
                                                    <th className="px-4 py-3 text-left">Nama</th>
                                                    <th className="px-4 py-3 text-left">Jenis Kelamin</th>
                                                    <th className="px-4 py-3 text-left">No HP</th>
                                                    <th className="px-4 py-3 text-center">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {prodi.dosen.map((dosen, index) => (
                                                    <tr key={dosen.id_dosen} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-sm">{index + 1}</td>
                                                        <td className="px-4 py-3 text-sm font-medium">{dosen.nip}</td>
                                                        <td className="px-4 py-3 text-sm">{dosen.nama}</td>
                                                        <td className="px-4 py-3 text-sm">
                                                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                                                dosen.jenis_kelamin === 'Laki-laki'
                                                                    ? 'bg-blue-100 text-blue-700'
                                                                    : 'bg-pink-100 text-pink-700'
                                                            }`}>
                                                                <i className={`fas ${dosen.jenis_kelamin === 'Laki-laki' ? 'fa-mars' : 'fa-venus'} mr-1`}></i>
                                                                {dosen.jenis_kelamin}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">{dosen.no_hp || '-'}</td>
                                                        <td className="px-4 py-3 text-center">
                                                            <Link
                                                                href={route('baak.dosen.show', dosen.id_dosen)}
                                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                                            >
                                                                Detail
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <i className="fas fa-users text-4xl text-gray-400 mb-3"></i>
                                        <p className="text-gray-500">Belum ada dosen di program studi ini</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab Mahasiswa */}
                        {activeTab === 'mahasiswa' && (
                            <div>
                                {prodi.mahasiswa && prodi.mahasiswa.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr className="text-gray-600 text-xs font-semibold uppercase">
                                                    <th className="px-4 py-3 text-left">No</th>
                                                    <th className="px-4 py-3 text-left">NIM</th>
                                                    <th className="px-4 py-3 text-left">Nama</th>
                                                    <th className="px-4 py-3 text-left">Angkatan</th>
                                                    <th className="px-4 py-3 text-center">Status</th>
                                                    <th className="px-4 py-3 text-center">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {prodi.mahasiswa.map((mhs, index) => (
                                                    <tr key={mhs.id_mahasiswa} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-sm">{index + 1}</td>
                                                        <td className="px-4 py-3 text-sm font-medium">{mhs.nim}</td>
                                                        <td className="px-4 py-3 text-sm">{mhs.nama}</td>
                                                        <td className="px-4 py-3 text-sm">20{mhs.nim.substring(0, 2)}</td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${getStatusBadge(mhs.status)}`}>
                                                                {mhs.status.toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <Link
                                                                href={route('baak.mahasiswa.show', mhs.id_mahasiswa)}
                                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                                            >
                                                                Detail
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <i className="fas fa-user-graduate text-4xl text-gray-400 mb-3"></i>
                                        <p className="text-gray-500">Belum ada mahasiswa aktif di program studi ini</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex gap-3">
                    <Link
                        href={route('baak.prodi.edit', prodi.kode_prodi)}
                        className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        <i className="fas fa-edit mr-2"></i>
                        Edit Prodi
                    </Link>
                    <Link
                        href={route('baak.prodi.index')}
                        className="px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                    >
                        Kembali
                    </Link>
                </div>
            </div>
        </BaakLayout>
    );
}
