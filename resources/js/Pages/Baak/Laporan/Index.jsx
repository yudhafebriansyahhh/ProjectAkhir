import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import BaakLayout from '@/Layouts/BaakLayout';
import axios from 'axios';

export default function LaporanIndex({ tab, prodi, tahunAngkatan }) {
    const [activeTab, setActiveTab] = useState(tab || 'mahasiswa');
    const [loading, setLoading] = useState(false);

    // Filters
    const [filters, setFilters] = useState({
        kode_prodi: '',
        tahun_masuk: '',
        status: '',
        tahun_lulus: '',
        tahun: '',
    });

    // Data
    const [dataMahasiswa, setDataMahasiswa] = useState({ mahasiswa: { data: [] }, statistik: {} });
    const [dataKelulusan, setDataKelulusan] = useState({ lulusan: { data: [] }, statistikProdi: [] });
    const [dataDO, setDataDO] = useState({ mahasiswaDO: { data: [] }, distribusiSemester: [], distribusiStatus: [] });
    const [dataIpk, setDataIpk] = useState({ distribusiIpk: [], topMahasiswa: [] });

    useEffect(() => {
        loadData();
    }, [activeTab, filters]);

    const loadData = async () => {
        setLoading(true);
        try {
            let response;
            switch (activeTab) {
                case 'mahasiswa':
                    response = await axios.get(route('baak.laporan.mahasiswa'), { params: filters });
                    setDataMahasiswa(response.data);
                    break;
                case 'kelulusan':
                    response = await axios.get(route('baak.laporan.kelulusan'), { params: filters });
                    setDataKelulusan(response.data);
                    break;
                case 'do':
                    response = await axios.get(route('baak.laporan.do'), { params: filters });
                    setDataDO(response.data);
                    break;
                case 'ipk':
                    response = await axios.get(route('baak.laporan.ipk'), { params: filters });
                    setDataIpk(response.data);
                    break;
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters({
            kode_prodi: '',
            tahun_masuk: '',
            status: '',
            tahun_lulus: '',
            tahun: '',
        });
    };

    const exportExcel = () => {
        const routes = {
            mahasiswa: 'baak.laporan.export.mahasiswa.excel',
            kelulusan: 'baak.laporan.export.kelulusan.excel',
            ipk: 'baak.laporan.export.ipk.excel',
        };
        if (routes[activeTab]) {
            window.location.href = route(routes[activeTab], filters);
        }
    };

    const exportPdf = () => {
        const routes = {
            mahasiswa: 'baak.laporan.export.mahasiswa.pdf',
            kelulusan: 'baak.laporan.export.kelulusan.pdf',
            ipk: 'baak.laporan.export.ipk.pdf',
        };
        if (routes[activeTab]) {
            window.location.href = route(routes[activeTab], filters);
        }
    };

    return (
        <BaakLayout title="Laporan Akademik">
            <Head title="Laporan Akademik" />

            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <i className="fas fa-file-alt text-white text-xl"></i>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Laporan Akademik</h1>
                                <p className="text-sm text-gray-500">Generate & Export laporan akademik</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={exportExcel}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                                <i className="fas fa-file-excel"></i>
                                Export Excel
                            </button>
                            <button
                                onClick={exportPdf}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                <i className="fas fa-file-pdf"></i>
                                Export PDF
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-2 p-2">
                            {[
                                { key: 'mahasiswa', label: 'Laporan Mahasiswa', icon: 'fa-users' },
                                { key: 'kelulusan', label: 'Laporan Kelulusan', icon: 'fa-graduation-cap' },
                                { key: 'do', label: 'Laporan DO/Keluar', icon: 'fa-user-times' },
                                { key: 'ipk', label: 'Laporan IPK', icon: 'fa-chart-line' },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                                        activeTab === tab.key
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <i className={`fas ${tab.icon}`}></i>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Filters */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-gray-700">Filter</h3>
                                <button
                                    onClick={resetFilters}
                                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                >
                                    <i className="fas fa-redo text-xs"></i>
                                    Reset
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Filter Program Studi */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Program Studi
                                    </label>
                                    <select
                                        value={filters.kode_prodi}
                                        onChange={(e) => handleFilterChange('kode_prodi', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Semua Prodi</option>
                                        {prodi.map((p) => (
                                            <option key={p.kode_prodi} value={p.kode_prodi}>
                                                {p.nama_prodi}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Filter Tahun Masuk (Mahasiswa) */}
                                {activeTab === 'mahasiswa' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tahun Masuk
                                        </label>
                                        <select
                                            value={filters.tahun_masuk}
                                            onChange={(e) => handleFilterChange('tahun_masuk', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Semua Tahun</option>
                                            {tahunAngkatan.map((tahun) => (
                                                <option key={tahun} value={tahun}>
                                                    {tahun}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Filter Status (Mahasiswa) */}
                                {activeTab === 'mahasiswa' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Status
                                        </label>
                                        <select
                                            value={filters.status}
                                            onChange={(e) => handleFilterChange('status', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Semua Status</option>
                                            <option value="aktif">Aktif</option>
                                            <option value="cuti">Cuti</option>
                                            <option value="lulus">Lulus</option>
                                            <option value="do">DO</option>
                                        </select>
                                    </div>
                                )}

                                {/* Filter Tahun Lulus (Kelulusan) */}
                                {activeTab === 'kelulusan' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tahun Lulus
                                        </label>
                                        <input
                                            type="number"
                                            value={filters.tahun_lulus}
                                            onChange={(e) => handleFilterChange('tahun_lulus', e.target.value)}
                                            placeholder="2024"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        )}

                        {/* Content per Tab */}
                        {!loading && (
                            <>
                                {activeTab === 'mahasiswa' && (
                                    <LaporanMahasiswa data={dataMahasiswa} />
                                )}
                                {activeTab === 'kelulusan' && (
                                    <LaporanKelulusan data={dataKelulusan} />
                                )}
                                {activeTab === 'do' && (
                                    <LaporanDO data={dataDO} />
                                )}
                                {activeTab === 'ipk' && (
                                    <LaporanIPK data={dataIpk} />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </BaakLayout>
    );
}

// Component: Laporan Mahasiswa
function LaporanMahasiswa({ data }) {
    const { mahasiswa, statistik } = data;

    return (
        <div className="space-y-6">
            {/* Statistik Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <StatCard label="Total" value={statistik.total || 0} color="blue" />
                <StatCard label="Aktif" value={statistik.aktif || 0} color="green" />
                <StatCard label="Lulus" value={statistik.lulus || 0} color="blue" />
                <StatCard label="Cuti" value={statistik.cuti || 0} color="orange" />
                <StatCard label="DO" value={statistik.do || 0} color="red" />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">No</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">NIM</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nama</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Prodi</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tahun Masuk</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Semester</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {mahasiswa.data && mahasiswa.data.length > 0 ? (
                            mahasiswa.data.map((mhs, index) => (
                                <tr key={mhs.id_mahasiswa} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-700">{mahasiswa.from + index}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{mhs.nim}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{mhs.nama}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{mhs.prodi?.nama_prodi}</td>
                                    <td className="px-4 py-3 text-sm text-center text-gray-700">{mhs.tahun_masuk || '-'}</td>
                                    <td className="px-4 py-3 text-sm text-center text-gray-700">
                                        {mhs.semester_ke ? mhs.semester_ke : '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            mhs.status === 'aktif' ? 'bg-green-100 text-green-700' :
                                            mhs.status === 'lulus' ? 'bg-blue-100 text-blue-700' :
                                            mhs.status === 'cuti' ? 'bg-orange-100 text-orange-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {mhs.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <i className="fas fa-inbox text-4xl text-gray-300"></i>
                                        <p>Tidak ada data mahasiswa</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Component: Laporan Kelulusan
function LaporanKelulusan({ data }) {
    const { lulusan, statistikProdi } = data;

    return (
        <div className="space-y-6">
            {/* Statistik per Prodi */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-4">Statistik Kelulusan per Prodi</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Program Studi</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Total Lulusan</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Rata-rata IPK</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Lama Studi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y">
                            {statistikProdi.map((stat, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-900">{stat.prodi}</td>
                                    <td className="px-4 py-3 text-sm text-center font-semibold text-blue-600">{stat.total}</td>
                                    <td className="px-4 py-3 text-sm text-center font-semibold text-blue-700">{stat.ipk}</td>
                                    <td className="px-4 py-3 text-sm text-center text-gray-700">{stat.lama_studi}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Table Lulusan */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">No</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">NIM</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nama</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Prodi</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tahun Lulus</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {lulusan.data.map((mhs, index) => (
                            <tr key={mhs.id_mahasiswa} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-700">{lulusan.from + index}</td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{mhs.nim}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{mhs.nama}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{mhs.prodi?.nama_prodi}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                    {new Date(mhs.updated_at).getFullYear()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Component: Laporan DO
function LaporanDO({ data }) {
    const { mahasiswaDO, distribusiSemester, distribusiStatus } = data;

    return (
        <div className="space-y-6">
            {/* Distribusi */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-6 border border-red-200">
                    <h3 className="font-bold text-gray-900 mb-4">Distribusi per Semester</h3>
                    <div className="space-y-2">
                        {distribusiSemester.map((item, index) => (
                            <div key={index} className="flex justify-between items-center bg-white rounded-lg p-3">
                                <span className="text-sm font-medium text-gray-700">{item.semester}</span>
                                <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-full">
                                    {item.total}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-6 border border-red-200">
                    <h3 className="font-bold text-gray-900 mb-4">Distribusi per Status</h3>
                    <div className="space-y-2">
                        {distribusiStatus.map((item, index) => (
                            <div key={index} className="flex justify-between items-center bg-white rounded-lg p-3">
                                <span className="text-sm font-medium text-gray-700">{item.status}</span>
                                <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-full">
                                    {item.total}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">No</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">NIM</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nama</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Prodi</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Semester</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {mahasiswaDO.data.map((mhs, index) => (
                            <tr key={mhs.id_mahasiswa} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-700">{mahasiswaDO.from + index}</td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{mhs.nim}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{mhs.nama}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{mhs.prodi?.nama_prodi}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{mhs.semester_ke}</td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                                        {mhs.status.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Component: Laporan IPK
function LaporanIPK({ data }) {
    const { distribusiIpk, topMahasiswa } = data;

    return (
        <div className="space-y-6">
            {/* Distribusi IPK per Prodi */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-4">Distribusi IPK per Prodi</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Prodi</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Cumlaude<br/>(3.51-4.00)</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Sangat Memuaskan<br/>(3.01-3.50)</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Memuaskan<br/>(2.76-3.00)</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Cukup<br/>(2.00-2.75)</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Kurang<br/>(&lt;2.00)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y">
                            {distribusiIpk.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.nama_prodi}</td>
                                    <td className="px-4 py-3 text-sm text-center font-semibold text-blue-600">{item.cumlaude}</td>
                                    <td className="px-4 py-3 text-sm text-center font-semibold text-blue-700">{item.sangat_memuaskan}</td>
                                    <td className="px-4 py-3 text-sm text-center font-semibold text-green-600">{item.memuaskan}</td>
                                    <td className="px-4 py-3 text-sm text-center font-semibold text-orange-600">{item.cukup}</td>
                                    <td className="px-4 py-3 text-sm text-center font-semibold text-red-600">{item.kurang}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Top 10 Mahasiswa */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-blue-100">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <i className="fas fa-trophy text-blue-600"></i>
                        Top 10 Mahasiswa IPK Tertinggi
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Rank</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">NIM</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nama</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Prodi</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Semester</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">IPK</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {topMahasiswa.map((mhs) => (
                                <tr key={mhs.rank} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-center">
                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                                            mhs.rank === 1 ? 'bg-blue-600 text-white' :
                                            mhs.rank === 2 ? 'bg-gray-400 text-white' :
                                            mhs.rank === 3 ? 'bg-orange-500 text-white' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {mhs.rank}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{mhs.nim}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{mhs.nama}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{mhs.prodi}</td>
                                    <td className="px-4 py-3 text-sm text-center text-gray-700">{mhs.semester}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-bold rounded-full">
                                            {mhs.ipk}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Component: Stat Card
function StatCard({ label, value, color }) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-700 border-blue-200',
        green: 'bg-green-50 text-green-700 border-green-200',
        orange: 'bg-orange-50 text-orange-700 border-orange-200',
        red: 'bg-red-50 text-red-700 border-red-200',
    };

    return (
        <div className={`rounded-lg p-4 border-2 ${colorClasses[color]}`}>
            <p className="text-sm font-medium opacity-80 mb-1">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    );
}
