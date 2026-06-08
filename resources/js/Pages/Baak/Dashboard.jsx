import { Head, Link } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Badge } from '@/Components/ui/badge';
import { AlertCard, DashboardPanel, EmptyChart, QuickActionCard, StatCard } from '@/Components/Baak/DashboardCards';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import {
    Activity,
    ArrowUpRight,
    BookOpen,
    CalendarCheck,
    CheckCircle2,
    Clock,
    DoorOpen,
    FileText,
    GraduationCap,
    ShieldCheck,
    TrendingUp,
    University,
    UserCheck,
    UserX,
    Users,
} from 'lucide-react';

export default function Dashboard({ stats, charts, alerts, recent_activities, periode_aktif }) {
    const palette = ['#2563eb', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];
    const statusData = charts.distribusi_status || [];
    const prodiData = charts.mahasiswa_per_prodi || [];
    const trendData = charts.mahasiswa_per_angkatan || [];
    const ipkData = charts.rata_ipk_per_prodi || [];
    const activities = recent_activities || [];
    const totalAlert = alerts.krs_pending + alerts.belum_krs + alerts.nilai_kosong;

    const formatNumber = (value) => new Intl.NumberFormat('id-ID').format(value || 0);

    const metricCards = [
        {
            title: 'Total Mahasiswa',
            value: stats.mahasiswa.total,
            caption: `${formatNumber(stats.mahasiswa.aktif)} aktif`,
            icon: GraduationCap,
            href: route('baak.mahasiswa.index'),
            accent: 'text-blue-600',
            iconBg: 'bg-blue-50',
            progress: stats.mahasiswa.total ? (stats.mahasiswa.aktif / stats.mahasiswa.total) * 100 : 0,
        },
        {
            title: 'Total Dosen',
            value: stats.dosen.total,
            caption: `${formatNumber(stats.dosen.aktif)} aktif`,
            icon: Users,
            href: route('baak.dosen.index'),
            accent: 'text-teal-600',
            iconBg: 'bg-teal-50',
            progress: stats.dosen.total ? (stats.dosen.aktif / stats.dosen.total) * 100 : 0,
        },
        {
            title: 'Mata Kuliah',
            value: stats.mata_kuliah,
            caption: 'aktif ditawarkan',
            icon: BookOpen,
            href: route('baak.mata-kuliah.index'),
            accent: 'text-violet-600',
            iconBg: 'bg-violet-50',
            progress: 100,
        },
        {
            title: 'Kelas',
            value: stats.kelas,
            caption: 'kelas terdaftar',
            icon: DoorOpen,
            href: route('baak.kelas.index'),
            accent: 'text-amber-600',
            iconBg: 'bg-amber-50',
            progress: 100,
        },
    ];

    const alertCards = [
        {
            label: 'KRS Pending',
            value: alerts.krs_pending,
            icon: Clock,
            href: route('baak.krs.index', { status: 'pending' }),
            tone: 'text-amber-700',
            bg: 'bg-amber-50',
            border: 'border-amber-200',
        },
        {
            label: 'Belum KRS',
            value: alerts.belum_krs,
            icon: UserX,
            tone: 'text-red-700',
            bg: 'bg-red-50',
            border: 'border-red-200',
        },
        {
            label: 'Nilai Kosong',
            value: alerts.nilai_kosong,
            icon: FileText,
            href: route('baak.nilai.index'),
            tone: 'text-orange-700',
            bg: 'bg-orange-50',
            border: 'border-orange-200',
        },
    ];

    const quickActions = [
        { label: 'Mahasiswa', icon: GraduationCap, route: 'baak.mahasiswa.index' },
        { label: 'Dosen', icon: UserCheck, route: 'baak.dosen.index' },
        { label: 'Mata Kuliah', icon: BookOpen, route: 'baak.mata-kuliah.index' },
        { label: 'Kelas', icon: DoorOpen, route: 'baak.kelas.index' },
        { label: 'Prodi', icon: University, route: 'baak.prodi.index' },
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null;

        return (
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
                <p className="mb-1 text-xs font-semibold text-slate-700">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-xs text-slate-500">
                        {entry.name}: <span className="font-semibold text-slate-900">{formatNumber(entry.value)}</span>
                    </p>
                ))}
            </div>
        );
    };

    return (
        <BaakLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5">
                    <section className="flex min-w-0 flex-col gap-4 rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <Badge className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50">
                                    BAAK Dashboard
                                </Badge>
                                {periode_aktif ? (
                                    <Badge className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50">
                                        <CalendarCheck className="mr-1 h-3.5 w-3.5" />
                                        {periode_aktif.tahun_ajaran} - {periode_aktif.jenis_semester}
                                    </Badge>
                                ) : (
                                    <Badge className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100">
                                        Tidak ada periode aktif
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-2xl font-bold text-slate-950 md:text-3xl">Dashboard BAAK</h1>
                            <p className="mt-1 text-sm text-slate-500">Ringkasan operasional akademik ITB Riau.</p>
                        </div>

                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                            <Link
                                href={route('baak.laporan.index')}
                                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
                            >
                                Laporan
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </section>

                    <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                        {metricCards.map((metric) => (
                            <StatCard key={metric.title} metric={metric} formatNumber={formatNumber} />
                        ))}
                    </section>

                    <section className="grid grid-cols-1 gap-4 md:gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
                        <DashboardPanel
                            title="Tren Mahasiswa"
                            description="Jumlah mahasiswa aktif per angkatan."
                            headerClassName="space-y-0"
                            action={
                                <Badge className="shrink-0 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50">
                                    Bulanan
                                </Badge>
                            }
                        >
                            {trendData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={290}>
                                    <AreaChart data={trendData} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="studentTrend" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.04} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
                                        <XAxis dataKey="angkatan" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="total" name="Mahasiswa" stroke="#2563eb" strokeWidth={3} fill="url(#studentTrend)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <EmptyChart icon={TrendingUp} label="Belum ada data angkatan" />
                            )}
                        </DashboardPanel>

                        <DashboardPanel title="Status Mahasiswa" description="Distribusi status akademik.">
                            {statusData.length > 0 ? (
                                <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(180px,220px)_minmax(0,1fr)] xl:grid-cols-1">
                                    <ResponsiveContainer width="100%" height={210}>
                                        <PieChart>
                                            <Pie
                                                data={statusData}
                                                cx="50%"
                                                cy="50%"
                                                dataKey="total"
                                                innerRadius={58}
                                                outerRadius={88}
                                                paddingAngle={3}
                                                stroke="#fff"
                                                strokeWidth={3}
                                            >
                                                {statusData.map((entry, index) => (
                                                    <Cell key={entry.status} fill={palette[index % palette.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>

                                    <div className="space-y-3">
                                        {statusData.map((item, index) => (
                                            <div key={item.status} className="flex items-center justify-between gap-3">
                                                <div className="flex min-w-0 items-center gap-2">
                                                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: palette[index % palette.length] }} />
                                                    <span className="truncate text-sm font-medium text-slate-600">{item.status}</span>
                                                </div>
                                                <span className="text-sm font-bold text-slate-950">{formatNumber(item.total)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <EmptyChart icon={Activity} label="Belum ada data status" />
                            )}
                        </DashboardPanel>
                    </section>

                    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.9fr)]">
                        <DashboardPanel title="Rata-rata IPK" description="Per program studi.">
                            {ipkData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={ipkData} margin={{ top: 12, right: 8, left: -22, bottom: 44 }}>
                                        <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
                                        <XAxis
                                            dataKey="prodi"
                                            axisLine={false}
                                            tickLine={false}
                                            interval={0}
                                            angle={-35}
                                            textAnchor="end"
                                            tick={{ fill: '#64748b', fontSize: 11 }}
                                        />
                                        <YAxis domain={[0, 4]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="ipk" name="IPK" radius={[6, 6, 0, 0]} fill="#14b8a6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <EmptyChart icon={ShieldCheck} label="Belum ada data IPK" />
                            )}
                        </DashboardPanel>

                        <DashboardPanel title="Mahasiswa per Prodi" description="Komposisi mahasiswa aktif.">
                            {prodiData.length > 0 ? (
                                <div className="space-y-3">
                                    {prodiData.slice(0, 6).map((item, index) => {
                                        const maxValue = Math.max(...prodiData.map((prodi) => prodi.value), 1);
                                        const width = (item.value / maxValue) * 100;

                                        return (
                                            <div key={item.name}>
                                                <div className="mb-1.5 flex items-center justify-between gap-3">
                                                    <span className="truncate text-sm font-medium text-slate-600">{item.name}</span>
                                                    <span className="text-sm font-bold text-slate-950">{formatNumber(item.value)}</span>
                                                </div>
                                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                                    <div
                                                        className="h-full rounded-full"
                                                        style={{
                                                            width: `${width}%`,
                                                            backgroundColor: palette[index % palette.length],
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <EmptyChart icon={University} label="Belum ada data prodi" />
                            )}
                        </DashboardPanel>

                        <DashboardPanel
                            title="Prioritas Hari Ini"
                            description="Item yang perlu dipantau."
                            className="md:col-span-2 xl:col-span-1"
                            contentClassName="grid grid-cols-2 gap-3"
                            action={
                                <Badge className="shrink-0 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                                    {formatNumber(totalAlert)}
                                </Badge>
                            }
                        >
                            {alertCards.map((alert) => (
                                <AlertCard key={alert.label} alert={alert} formatNumber={formatNumber} />
                            ))}
                        </DashboardPanel>
                    </section>

                    <section className="grid grid-cols-1 gap-4 md:gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                        <DashboardPanel
                            title="Aktivitas Terbaru"
                            description="Riwayat pembaruan akademik terakhir."
                            headerClassName="space-y-0"
                            action={<Activity className="h-5 w-5 shrink-0 text-slate-400" />}
                        >
                            {activities.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {activities.slice(0, 6).map((activity, index) => (
                                        <div key={`${activity.type}-${index}`} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                                                {activity.type === 'krs_approved' ? (
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                                ) : (
                                                    <FileText className="h-4 w-4 text-blue-600" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-slate-700">{activity.message}</p>
                                                <p className="mt-0.5 text-xs text-slate-400">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex h-44 flex-col items-center justify-center text-center">
                                    <Activity className="mb-3 h-8 w-8 text-slate-300" />
                                    <p className="text-sm font-medium text-slate-500">Belum ada aktivitas</p>
                                </div>
                            )}
                        </DashboardPanel>

                        <DashboardPanel
                            title="Akses Cepat"
                            description="Navigasi fitur utama BAAK."
                            contentClassName="grid grid-cols-2 gap-3"
                        >
                            {quickActions.map((action) => (
                                <QuickActionCard key={action.label} action={action} />
                            ))}
                        </DashboardPanel>
                    </section>
                </div>
            </div>
        </BaakLayout>
    );
}
