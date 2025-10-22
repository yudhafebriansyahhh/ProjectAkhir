import { Head, Link } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    Area, AreaChart
} from 'recharts';

export default function Dashboard({ stats, charts, alerts, recent_activities, periode_aktif }) {

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                    <p className="text-sm font-semibold text-gray-700 mb-1">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: <span className="font-bold">{entry.value}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <BaakLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="p-4 md:p-6 space-y-6">
                {/* Header dengan Gradient */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 md:p-8 text-white shadow-xl">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-white opacity-10 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <i className="fas fa-chart-line text-2xl"></i>
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">Dashboard BAAK</h1>
                                <p className="text-blue-100 text-sm md:text-base">Sistem Informasi Akademik - ITB Riau</p>
                            </div>
                        </div>

                        {periode_aktif && (
                            <div className="mt-4 inline-flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 border border-white border-opacity-30">
                                <i className="fas fa-calendar-check text-sm"></i>
                                <span className="text-sm font-medium">
                                    Periode Aktif: {periode_aktif.tahun_ajaran} - {periode_aktif.jenis_semester}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Alert Cards */}
                {(alerts.krs_pending > 0 || alerts.belum_krs > 0 || alerts.nilai_kosong > 0 || alerts.mahasiswa_do > 0) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {alerts.krs_pending > 0 && (
                            <Link
                                href={route('baak.krs.index', { status: 'pending' })}
                                className="group relative overflow-hidden bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-xl p-4 hover:shadow-lg hover:scale-105 transition-all duration-300"
                            >
                                <div className="absolute top-0 right-0 -mt-2 -mr-2 w-20 h-20 bg-yellow-300 opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-300"></div>
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="w-12 h-12 bg-yellow-200 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                                            <i className="fas fa-clock text-yellow-600 text-xl"></i>
                                        </div>
                                        <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-bold rounded-full animate-pulse">
                                            Pending
                                        </span>
                                    </div>
                                    <p className="text-3xl font-bold text-yellow-900 mb-1">{alerts.krs_pending}</p>
                                    <p className="text-sm text-yellow-700 font-medium">KRS Menunggu Persetujuan</p>
                                </div>
                            </Link>
                        )}

                        {alerts.belum_krs > 0 && (
                            <div className="group relative overflow-hidden bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-4 hover:shadow-lg hover:scale-105 transition-all duration-300">
                                <div className="absolute top-0 right-0 -mt-2 -mr-2 w-20 h-20 bg-red-300 opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-300"></div>
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="w-12 h-12 bg-red-200 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                                            <i className="fas fa-user-times text-red-600 text-xl"></i>
                                        </div>
                                        <span className="px-2 py-1 bg-red-200 text-red-800 text-xs font-bold rounded-full">
                                            Alert
                                        </span>
                                    </div>
                                    <p className="text-3xl font-bold text-red-900 mb-1">{alerts.belum_krs}</p>
                                    <p className="text-sm text-red-700 font-medium">Mahasiswa Belum KRS</p>
                                </div>
                            </div>
                        )}

                        {alerts.nilai_kosong > 0 && (
                            <Link
                                href={route('baak.nilai.index')}
                                className="group relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl p-4 hover:shadow-lg hover:scale-105 transition-all duration-300"
                            >
                                <div className="absolute top-0 right-0 -mt-2 -mr-2 w-20 h-20 bg-orange-300 opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-300"></div>
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                                            <i className="fas fa-file-alt text-orange-600 text-xl"></i>
                                        </div>
                                        <span className="px-2 py-1 bg-orange-200 text-orange-800 text-xs font-bold rounded-full">
                                            Action
                                        </span>
                                    </div>
                                    <p className="text-3xl font-bold text-orange-900 mb-1">{alerts.nilai_kosong}</p>
                                    <p className="text-sm text-orange-700 font-medium">Nilai Belum Diinput</p>
                                </div>
                            </Link>
                        )}
                    </div>
                )}

                {/* Stats Cards - FIXED! Tambah Status Lulus */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card Mahasiswa - UPDATED 🔥 */}
                    <div className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>

                        <div className="relative p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                    <i className="fas fa-user-graduate text-white text-2xl"></i>
                                </div>
                                <Link
                                    href={route('baak.mahasiswa.index')}
                                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
                                >
                                    Lihat <i className="fas fa-arrow-right text-xs"></i>
                                </Link>
                            </div>

                            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Mahasiswa</h3>
                            <p className="text-4xl font-bold text-gray-900 mb-3">{stats.mahasiswa.total}</p>

                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold">
                                    <i className="fas fa-check-circle"></i>
                                    {stats.mahasiswa.aktif} Aktif
                                </span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">
                                    <i className="fas fa-graduation-cap"></i>
                                    {stats.mahasiswa.lulus} Lulus
                                </span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-semibold">
                                    <i className="fas fa-pause-circle"></i>
                                    {stats.mahasiswa.cuti} Cuti
                                </span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-semibold">
                                    <i className="fas fa-times-circle"></i>
                                    {stats.mahasiswa.do} DO
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Card Dosen */}
                    <div className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>

                        <div className="relative p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                    <i className="fas fa-chalkboard-teacher text-white text-2xl"></i>
                                </div>
                                <Link
                                    href={route('baak.dosen.index')}
                                    className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
                                >
                                    Lihat <i className="fas fa-arrow-right text-xs"></i>
                                </Link>
                            </div>

                            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Dosen</h3>
                            <p className="text-4xl font-bold text-gray-900 mb-3">{stats.dosen.total}</p>

                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${(stats.dosen.aktif / stats.dosen.total) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs font-semibold text-green-600">
                                    {stats.dosen.aktif} Aktif
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Card Mata Kuliah */}
                    <div className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>

                        <div className="relative p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                    <i className="fas fa-book text-white text-2xl"></i>
                                </div>
                                <Link
                                    href={route('baak.mata-kuliah.index')}
                                    className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
                                >
                                    Lihat <i className="fas fa-arrow-right text-xs"></i>
                                </Link>
                            </div>

                            <h3 className="text-gray-500 text-sm font-medium mb-1">Mata Kuliah</h3>
                            <p className="text-4xl font-bold text-gray-900 mb-3">{stats.mata_kuliah}</p>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <i className="fas fa-layer-group text-purple-500"></i>
                                <span>Mata kuliah terdaftar</span>
                            </div>
                        </div>
                    </div>

                    {/* Card Kelas */}
                    <div className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>

                        <div className="relative p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                    <i className="fas fa-door-open text-white text-2xl"></i>
                                </div>
                                <Link
                                    href={route('baak.kelas.index')}
                                    className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
                                >
                                    Lihat <i className="fas fa-arrow-right text-xs"></i>
                                </Link>
                            </div>

                            <h3 className="text-gray-500 text-sm font-medium mb-1">Kelas Aktif</h3>
                            <p className="text-4xl font-bold text-gray-900 mb-3">{stats.kelas}</p>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <i className="fas fa-door-open text-orange-500"></i>
                                <span>Total kelas terdaftar</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section - FULL WIDTH COMPACT DESIGN 🔥 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Chart 1: Distribusi Mahasiswa per Prodi (Pie) */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between p-6 pb-3">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Distribusi Mahasiswa</h3>
                                <p className="text-sm text-gray-500">Per Program Studi</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-chart-pie text-blue-600"></i>
                            </div>
                        </div>
                        <div className="px-2 pb-2">
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={charts.mahasiswa_per_prodi}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={90}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {charts.mahasiswa_per_prodi.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Chart 2: Mahasiswa per Angkatan (Area Chart) - BALANCED MARGIN */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between p-6 pb-3">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Tren Mahasiswa</h3>
                                <p className="text-sm text-gray-500">Per Angkatan</p>
                            </div>
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-chart-area text-green-600"></i>
                            </div>
                        </div>
                        <div className="pb-2">
                            <ResponsiveContainer width="100%" height={280}>
                                <AreaChart data={charts.mahasiswa_per_angkatan} margin={{ top: 5, right: 15, left: -15, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="colorMahasiswa" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="angkatan" stroke="#6B7280" style={{ fontSize: '12px' }} />
                                    <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorMahasiswa)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Chart 3: Rata-rata IPK per Prodi (Bar Chart) - FULL WIDTH */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between p-6 pb-3">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Rata-rata IPK</h3>
                                <p className="text-sm text-gray-500">Per Program Studi</p>
                            </div>
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-chart-bar text-purple-600"></i>
                            </div>
                        </div>
                        {charts.rata_ipk_per_prodi && charts.rata_ipk_per_prodi.length > 0 ? (
                            <div className="pb-2">
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={charts.rata_ipk_per_prodi} margin={{ top: 5, right: 15, left: -15, bottom: 60 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                        <XAxis
                                            dataKey="prodi"
                                            stroke="#6B7280"
                                            style={{ fontSize: '10px' }}
                                            angle={-45}
                                            textAnchor="end"
                                            height={60}
                                            interval={0}
                                        />
                                        <YAxis
                                            domain={[0, 4]}
                                            stroke="#6B7280"
                                            style={{ fontSize: '12px' }}
                                            ticks={[0, 1, 2, 3, 4]}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="ipk" radius={[8, 8, 0, 0]}>
                                            {charts.rata_ipk_per_prodi.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <i className="fas fa-chart-bar text-gray-400 text-2xl"></i>
                                </div>
                                <p className="text-gray-500 text-sm">Belum ada data IPK</p>
                            </div>
                        )}
                    </div>

                    {/* Chart 4: Distribusi Status Mahasiswa (Bar Chart) - FULL WIDTH */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between p-6 pb-3">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Status Mahasiswa</h3>
                                <p className="text-sm text-gray-500">Distribusi per Status</p>
                            </div>
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-chart-bar text-orange-600"></i>
                            </div>
                        </div>
                        <div className="pb-2">
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={charts.distribusi_status} margin={{ top: 5, right: 15, left: -15, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="status" stroke="#6B7280" style={{ fontSize: '12px' }} />
                                    <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                                        {charts.distribusi_status.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Recent Activities - WITH SCROLL 🔥 */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-history text-indigo-600"></i>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Aktivitas Terbaru</h3>
                                <p className="text-sm text-gray-500">10 aktivitas terakhir</p>
                            </div>
                        </div>
                    </div>

                    {recent_activities && recent_activities.length > 0 ? (
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                            {recent_activities.map((activity, index) => (
                                <div key={index} className="relative flex items-start gap-4 group">
                                    {index !== recent_activities.length - 1 && (
                                        <div className="absolute left-5 top-12 w-0.5 h-full bg-gray-200"></div>
                                    )}

                                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300 ${
                                        activity.type === 'krs_approved'
                                            ? 'bg-gradient-to-br from-green-400 to-green-600'
                                            : 'bg-gradient-to-br from-blue-400 to-blue-600'
                                    }`}>
                                        <i className={`fas ${
                                            activity.type === 'krs_approved'
                                                ? 'fa-check-circle'
                                                : 'fa-file-alt'
                                        } text-white`}></i>
                                    </div>

                                    <div className="flex-1 bg-gray-50 rounded-lg p-4 group-hover:bg-gray-100 transition-colors duration-200">
                                        <p className="text-sm text-gray-700 font-medium mb-1">{activity.message}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <i className="fas fa-clock"></i>
                                            <span>{activity.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-inbox text-gray-400 text-3xl"></i>
                            </div>
                            <p className="text-gray-500 font-medium">Belum ada aktivitas</p>
                            <p className="text-gray-400 text-sm mt-1">Aktivitas akan muncul di sini</p>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-md border border-indigo-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <i className="fas fa-bolt text-white"></i>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
                            <p className="text-sm text-gray-500">Akses cepat ke fitur utama</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        <Link
                            href={route('baak.mahasiswa.index')}
                            className="group flex flex-col items-center gap-2 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-300"
                        >
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
                                <i className="fas fa-user-graduate text-blue-600 group-hover:text-white transition-colors duration-300"></i>
                            </div>
                            <span className="text-xs font-medium text-gray-700 text-center">Mahasiswa</span>
                        </Link>

                        <Link
                            href={route('baak.dosen.index')}
                            className="group flex flex-col items-center gap-2 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-green-500 hover:shadow-md transition-all duration-300"
                        >
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-500 transition-colors duration-300">
                                <i className="fas fa-chalkboard-teacher text-green-600 group-hover:text-white transition-colors duration-300"></i>
                            </div>
                            <span className="text-xs font-medium text-gray-700 text-center">Dosen</span>
                        </Link>

                        <Link
                            href={route('baak.mata-kuliah.index')}
                            className="group flex flex-col items-center gap-2 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-purple-500 hover:shadow-md transition-all duration-300"
                        >
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-500 transition-colors duration-300">
                                <i className="fas fa-book text-purple-600 group-hover:text-white transition-colors duration-300"></i>
                            </div>
                            <span className="text-xs font-medium text-gray-700 text-center">Mata Kuliah</span>
                        </Link>

                        <Link
                            href={route('baak.kelas.index')}
                            className="group flex flex-col items-center gap-2 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-orange-500 hover:shadow-md transition-all duration-300"
                        >
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-300">
                                <i className="fas fa-door-open text-orange-600 group-hover:text-white transition-colors duration-300"></i>
                            </div>
                            <span className="text-xs font-medium text-gray-700 text-center">Kelas</span>
                        </Link>

                        <Link
                            href={route('baak.prodi.index')}
                            className="group flex flex-col items-center gap-2 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-pink-500 hover:shadow-md transition-all duration-300"
                        >
                            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-pink-500 transition-colors duration-300">
                                <i className="fas fa-university text-pink-600 group-hover:text-white transition-colors duration-300"></i>
                            </div>
                            <span className="text-xs font-medium text-gray-700 text-center">Prodi</span>
                        </Link>

                        <Link
                            href={route('baak.fakultas.index')}
                            className="group flex flex-col items-center gap-2 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all duration-300"
                        >
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-500 transition-colors duration-300">
                                <i className="fas fa-building text-indigo-600 group-hover:text-white transition-colors duration-300"></i>
                            </div>
                            <span className="text-xs font-medium text-gray-700 text-center">Fakultas</span>
                        </Link>
                    </div>
                </div>
            </div>
        </BaakLayout>
    );
}
