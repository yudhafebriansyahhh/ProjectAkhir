import { Head } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Dashboard({ stats }) {
    const defaultStats = {
        mahasiswa: stats?.mahasiswa || 657,
        dosen: stats?.dosen || 10,
        prodi: stats?.prodi || 4,
        matakuliah: stats?.matakuliah || 108,
        ruangan: stats?.ruangan || 10,
    };

    return (
        <BaakLayout title="Dashboard">
            <Head title="Dashboard BAAK" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-700 mb-2">Dashboard</h1>
                    <p className="text-gray-600">
                        Selamat datang <span className="font-semibold text-gray-700">Admin BAAK</span>.
                        Pantau aktivitas akademik dan informasi pengajaran di sini.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Mahasiswa Card */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Total Mahasiswa</p>
                                <p className="text-4xl font-bold text-gray-700">{defaultStats.mahasiswa}</p>
                                <p className="text-xs text-gray-600 mt-2">Mahasiswa aktif</p>
                            </div>
                            <div className="bg-blue-100 rounded-full p-4">
                                <i className="fas fa-users text-3xl text-blue-600"></i>
                            </div>
                        </div>
                    </div>

                    {/* Dosen Card */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Total Dosen</p>
                                <p className="text-4xl font-bold text-gray-700">{defaultStats.dosen}</p>
                                <p className="text-xs text-gray-600 mt-2">Dosen pengajar</p>
                            </div>
                            <div className="bg-green-100 rounded-full p-4">
                                <i className="fas fa-chalkboard-teacher text-3xl text-green-600"></i>
                            </div>
                        </div>
                    </div>

                    {/* Prodi Card */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Program Studi</p>
                                <p className="text-4xl font-bold text-gray-700">{defaultStats.prodi}</p>
                                <p className="text-xs text-gray-600 mt-2">Prodi tersedia</p>
                            </div>
                            <div className="bg-purple-100 rounded-full p-4">
                                <i className="fas fa-graduation-cap text-3xl text-purple-600"></i>
                            </div>
                        </div>
                    </div>

                    {/* Matakuliah Card */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Mata Kuliah</p>
                                <p className="text-4xl font-bold text-gray-700">{defaultStats.matakuliah}</p>
                                <p className="text-xs text-gray-600 mt-2">Mata kuliah aktif</p>
                            </div>
                            <div className="bg-orange-100 rounded-full p-4">
                                <i className="fas fa-book text-3xl text-orange-600"></i>
                            </div>
                        </div>
                    </div>

                    {/* Ruangan Card */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Ruangan</p>
                                <p className="text-4xl font-bold text-gray-700">{defaultStats.ruangan}</p>
                                <p className="text-xs text-gray-600 mt-2">Ruang kuliah</p>
                            </div>
                            <div className="bg-red-100 rounded-full p-4">
                                <i className="fas fa-door-open text-3xl text-red-600"></i>
                            </div>
                        </div>
                    </div>

                    {/* Semester Card - Extra */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Semester Aktif</p>
                                <p className="text-4xl font-bold text-gray-700">Genap</p>
                                <p className="text-xs text-gray-600 mt-2">2024/2025</p>
                            </div>
                            <div className="bg-indigo-100 rounded-full p-4">
                                <i className="fas fa-calendar-alt text-3xl text-indigo-600"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Quick Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-start">
                            <div className="bg-blue-600 rounded-lg p-3 mr-4">
                                <i className="fas fa-info-circle text-white text-xl"></i>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Informasi Penting</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Periode pengisian KRS untuk semester genap 2024/2025 akan dibuka pada tanggal 15 Januari 2025.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <div className="flex items-start">
                            <div className="bg-green-600 rounded-lg p-3 mr-4">
                                <i className="fas fa-bolt text-white text-xl"></i>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Akses Cepat</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Kelola data mahasiswa, dosen, dan jadwal perkuliahan melalui menu navigasi di sidebar.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BaakLayout>
    );
}
