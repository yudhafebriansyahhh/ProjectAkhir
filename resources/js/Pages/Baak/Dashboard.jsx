import { Head, Link } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    Area, AreaChart
} from 'recharts';
import {
    Users, GraduationCap, BookOpen, DoorOpen, Clock, UserX, FileText,
    TrendingUp, PieChart as PieChartIcon, BarChart3, Activity,
    Zap, Building2, University, ChevronRight, CalendarCheck, ArrowUpRight
} from 'lucide-react';

export default function Dashboard({ stats, charts, alerts, recent_activities, periode_aktif }) {

    const COLORS = ['#2563EB', '#0EA5E9', '#6366F1', '#8B5CF6', '#3B82F6', '#1D4ED8'];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 backdrop-blur-sm border border-blue-100 rounded-xl shadow-xl p-3 ring-1 ring-blue-50">
                    <p className="text-sm font-semibold text-gray-800 mb-1">{label}</p>
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

    const statCards = [
        {
            title: 'Total Mahasiswa',
            value: stats.mahasiswa.total,
            icon: GraduationCap,
            route: 'baak.mahasiswa.index',
            gradient: 'from-blue-500 to-blue-600',
            bgLight: 'bg-blue-50',
            textColor: 'text-blue-600',
            badges: [
                { label: `${stats.mahasiswa.aktif} Aktif`, variant: 'success', icon: '✓' },
                { label: `${stats.mahasiswa.lulus} Lulus`, variant: 'default', icon: '🎓' },
                { label: `${stats.mahasiswa.cuti} Cuti`, variant: 'warning', icon: '⏸' },
                { label: `${stats.mahasiswa.do} DO`, variant: 'destructive', icon: '✕' },
            ],
        },
        {
            title: 'Total Dosen',
            value: stats.dosen.total,
            icon: Users,
            route: 'baak.dosen.index',
            gradient: 'from-sky-500 to-cyan-500',
            bgLight: 'bg-sky-50',
            textColor: 'text-sky-600',
            progress: {
                current: stats.dosen.aktif,
                total: stats.dosen.total,
                label: `${stats.dosen.aktif} Aktif`,
            },
        },
        {
            title: 'Mata Kuliah',
            value: stats.mata_kuliah,
            icon: BookOpen,
            route: 'baak.mata-kuliah.index',
            gradient: 'from-indigo-500 to-violet-500',
            bgLight: 'bg-indigo-50',
            textColor: 'text-indigo-600',
            subtitle: 'Mata kuliah terdaftar',
        },
        {
            title: 'Kelas Aktif',
            value: stats.kelas,
            icon: DoorOpen,
            route: 'baak.kelas.index',
            gradient: 'from-blue-600 to-indigo-600',
            bgLight: 'bg-blue-50',
            textColor: 'text-blue-700',
            subtitle: 'Total kelas terdaftar',
        },
    ];

    const alertCards = [
        {
            condition: alerts.krs_pending > 0,
            count: alerts.krs_pending,
            label: 'KRS Menunggu Persetujuan',
            badge: 'Pending',
            badgeVariant: 'warning',
            icon: Clock,
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600',
            borderColor: 'border-amber-200',
            bgGradient: 'from-amber-50 to-orange-50',
            href: route('baak.krs.index', { status: 'pending' }),
        },
        {
            condition: alerts.belum_krs > 0,
            count: alerts.belum_krs,
            label: 'Mahasiswa Belum KRS',
            badge: 'Alert',
            badgeVariant: 'destructive',
            icon: UserX,
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            borderColor: 'border-red-200',
            bgGradient: 'from-red-50 to-rose-50',
        },
        {
            condition: alerts.nilai_kosong > 0,
            count: alerts.nilai_kosong,
            label: 'Nilai Belum Diinput',
            badge: 'Action',
            badgeVariant: 'warning',
            icon: FileText,
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
            borderColor: 'border-orange-200',
            bgGradient: 'from-orange-50 to-amber-50',
            href: route('baak.nilai.index'),
        },
    ];

    const quickActions = [
        { label: 'Mahasiswa', icon: GraduationCap, route: 'baak.mahasiswa.index' },
        { label: 'Dosen', icon: Users, route: 'baak.dosen.index' },
        { label: 'Mata Kuliah', icon: BookOpen, route: 'baak.mata-kuliah.index' },
        { label: 'Kelas', icon: DoorOpen, route: 'baak.kelas.index' },
        { label: 'Prodi', icon: University, route: 'baak.prodi.index' },
        { label: 'Fakultas', icon: Building2, route: 'baak.fakultas.index' },
    ];

    return (
        <BaakLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="p-4 md:p-6 space-y-6">
                {/* ===== HEADER HERO ===== */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 md:p-8 text-white shadow-2xl">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white opacity-[0.07] rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-blue-300 opacity-[0.1] rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-indigo-400 opacity-[0.08] rounded-full blur-2xl"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg">
                                <TrendingUp className="w-7 h-7" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard BAAK</h1>
                                <p className="text-blue-100/90 text-sm md:text-base font-medium">Sistem Informasi Akademik — ITB Riau</p>
                            </div>
                        </div>

                        {periode_aktif && (
                            <div className="mt-5 inline-flex items-center gap-2.5 bg-white/15 backdrop-blur-sm rounded-full px-5 py-2.5 border border-white/25 shadow-sm">
                                <CalendarCheck className="w-4 h-4" />
                                <span className="text-sm font-semibold">
                                    Periode Aktif: {periode_aktif.tahun_ajaran} – {periode_aktif.jenis_semester}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ===== ALERT CARDS ===== */}
                {alertCards.some(a => a.condition) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {alertCards.map((alert, idx) => {
                            if (!alert.condition) return null;
                            const Wrapper = alert.href ? Link : 'div';
                            const wrapperProps = alert.href ? { href: alert.href } : {};
                            const Icon = alert.icon;
                            return (
                                <Wrapper
                                    key={idx}
                                    {...wrapperProps}
                                    className={`group relative overflow-hidden bg-gradient-to-br ${alert.bgGradient} border-2 ${alert.borderColor} rounded-xl p-5 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
                                >
                                    <div className="absolute top-0 right-0 -mt-3 -mr-3 w-24 h-24 bg-current opacity-[0.04] rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className={`w-12 h-12 ${alert.iconBg} rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-sm`}>
                                                <Icon className={`w-5 h-5 ${alert.iconColor}`} />
                                            </div>
                                            <Badge variant={alert.badgeVariant} className="text-[10px] uppercase tracking-wider">
                                                {alert.badge}
                                            </Badge>
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900 mb-1">{alert.count}</p>
                                        <p className="text-sm text-gray-600 font-medium">{alert.label}</p>
                                    </div>
                                </Wrapper>
                            );
                        })}
                    </div>
                )}

                {/* ===== STATS CARDS ===== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={idx} className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-100/80 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                                <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-br ${stat.gradient} opacity-[0.07] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`}></div>

                                <CardContent className="p-5 relative">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <Link
                                            href={route(stat.route)}
                                            className={`${stat.textColor} hover:opacity-80 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all`}
                                        >
                                            Lihat <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>

                                    <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
                                    <p className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">{stat.value}</p>

                                    {stat.badges && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {stat.badges.map((b, i) => (
                                                <Badge key={i} variant={b.variant} className="text-[10px] font-semibold px-2 py-0.5">
                                                    {b.label}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}

                                    {stat.progress && (
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`bg-gradient-to-r ${stat.gradient} h-full rounded-full transition-all duration-700`}
                                                    style={{ width: `${(stat.progress.current / stat.progress.total) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className={`text-xs font-semibold ${stat.textColor}`}>
                                                {stat.progress.label}
                                            </span>
                                        </div>
                                    )}

                                    {stat.subtitle && (
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Icon className={`w-4 h-4 ${stat.textColor}`} />
                                            <span>{stat.subtitle}</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* ===== CHARTS SECTION ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Distribusi Mahasiswa per Prodi (Pie) */}
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-base font-bold text-gray-900">Distribusi Mahasiswa</CardTitle>
                                <CardDescription>Per Program Studi</CardDescription>
                            </div>
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                <PieChartIcon className="w-5 h-5 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent className="px-2 pb-2 pt-0">
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
                                        stroke="#fff"
                                        strokeWidth={2}
                                    >
                                        {charts.mahasiswa_per_prodi.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Tren Mahasiswa per Angkatan (Area) */}
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-base font-bold text-gray-900">Tren Mahasiswa</CardTitle>
                                <CardDescription>Per Angkatan</CardDescription>
                            </div>
                            <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-sky-600" />
                            </div>
                        </CardHeader>
                        <CardContent className="pb-2 pt-0">
                            <ResponsiveContainer width="100%" height={280}>
                                <AreaChart data={charts.mahasiswa_per_angkatan} margin={{ top: 5, right: 15, left: -15, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="colorMahasiswa" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#2563EB" stopOpacity={0.05}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="angkatan" stroke="#94A3B8" style={{ fontSize: '12px' }} />
                                    <YAxis stroke="#94A3B8" style={{ fontSize: '12px' }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="total" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMahasiswa)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Rata-rata IPK per Prodi (Bar) */}
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-base font-bold text-gray-900">Rata-rata IPK</CardTitle>
                                <CardDescription>Per Program Studi</CardDescription>
                            </div>
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-indigo-600" />
                            </div>
                        </CardHeader>
                        <CardContent className="pb-2 pt-0">
                            {charts.rata_ipk_per_prodi && charts.rata_ipk_per_prodi.length > 0 ? (
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={charts.rata_ipk_per_prodi} margin={{ top: 5, right: 15, left: -15, bottom: 60 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                        <XAxis
                                            dataKey="prodi"
                                            stroke="#94A3B8"
                                            style={{ fontSize: '10px' }}
                                            angle={-45}
                                            textAnchor="end"
                                            height={60}
                                            interval={0}
                                        />
                                        <YAxis
                                            domain={[0, 4]}
                                            stroke="#94A3B8"
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
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                        <BarChart3 className="w-7 h-7 text-gray-300" />
                                    </div>
                                    <p className="text-gray-400 text-sm font-medium">Belum ada data IPK</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Distribusi Status Mahasiswa (Bar) */}
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-base font-bold text-gray-900">Status Mahasiswa</CardTitle>
                                <CardDescription>Distribusi per Status</CardDescription>
                            </div>
                            <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-violet-600" />
                            </div>
                        </CardHeader>
                        <CardContent className="pb-2 pt-0">
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={charts.distribusi_status} margin={{ top: 5, right: 15, left: -15, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                    <XAxis dataKey="status" stroke="#94A3B8" style={{ fontSize: '12px' }} />
                                    <YAxis stroke="#94A3B8" style={{ fontSize: '12px' }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                                        {charts.distribusi_status.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* ===== RECENT ACTIVITIES ===== */}
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                <Activity className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle className="text-base font-bold text-gray-900">Aktivitas Terbaru</CardTitle>
                                <CardDescription>10 aktivitas terakhir</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recent_activities && recent_activities.length > 0 ? (
                            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-50 hover:scrollbar-thumb-blue-300">
                                {recent_activities.map((activity, index) => (
                                    <div key={index} className="relative flex items-start gap-4 group">
                                        {index !== recent_activities.length - 1 && (
                                            <div className="absolute left-5 top-12 w-0.5 h-full bg-blue-100"></div>
                                        )}

                                        <div className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300 ${
                                            activity.type === 'krs_approved'
                                                ? 'bg-gradient-to-br from-emerald-400 to-emerald-600'
                                                : 'bg-gradient-to-br from-blue-500 to-blue-600'
                                        }`}>
                                            {activity.type === 'krs_approved' ? (
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                            ) : (
                                                <FileText className="w-4 h-4 text-white" />
                                            )}
                                        </div>

                                        <div className="flex-1 bg-gray-50/80 rounded-xl p-4 group-hover:bg-blue-50/50 transition-colors duration-200 border border-gray-100 group-hover:border-blue-100">
                                            <p className="text-sm text-gray-700 font-medium mb-1">{activity.message}</p>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <Clock className="w-3 h-3" />
                                                <span>{activity.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-14">
                                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Activity className="w-9 h-9 text-blue-200" />
                                </div>
                                <p className="text-gray-500 font-medium">Belum ada aktivitas</p>
                                <p className="text-gray-400 text-sm mt-1">Aktivitas akan muncul di sini</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* ===== QUICK ACTIONS ===== */}
                <Card className="bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-white border-blue-100/50">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-base font-bold text-gray-900">Quick Actions</CardTitle>
                                <CardDescription>Akses cepat ke fitur utama</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                            {quickActions.map((action, idx) => {
                                const Icon = action.icon;
                                return (
                                    <Link
                                        key={idx}
                                        href={route(action.route)}
                                        className="group flex flex-col items-center gap-2.5 p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-0.5"
                                    >
                                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-600/30">
                                            <Icon className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors duration-300" />
                                        </div>
                                        <span className="text-xs font-semibold text-gray-600 group-hover:text-blue-700 text-center transition-colors">{action.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </BaakLayout>
    );
}
