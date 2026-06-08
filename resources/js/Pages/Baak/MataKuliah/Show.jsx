import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarDays,
    Clock,
    DoorOpen,
    GraduationCap,
    Hash,
    Layers,
    Pencil,
    ToggleLeft,
    ToggleRight,
    UserCheck,
    Users,
} from 'lucide-react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { CardGrid, DataTable, EmptyState, PageHeader, SummaryCard } from '@/Components/ui/data-display';

const getKategoriBadge = (kategori) => {
    const badges = {
        wajib: 'bg-rose-50 text-rose-700 border-rose-200',
        pilihan: 'bg-sky-50 text-sky-700 border-sky-200',
        umum: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };

    return badges[kategori] || 'bg-slate-50 text-slate-700 border-slate-200';
};

const getStatusBadge = (isActive) =>
    isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200';

const getKategoriLabel = (kategori) => {
    const labels = {
        wajib: 'Mata Kuliah Wajib',
        pilihan: 'Mata Kuliah Pilihan',
        umum: 'Mata Kuliah Umum',
    };

    return labels[kategori] || '-';
};

const formatTimeRange = (kelas) => {
    const start = kelas.jam_mulai?.substring(0, 5) || '-';
    const end = kelas.jam_selesai?.substring(0, 5) || '-';

    return `${start} - ${end}`;
};

export default function Show({ mata_kuliah, kelas = [] }) {
    const [activeTab, setActiveTab] = useState('info');
    const kelasData = kelas || [];

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
                cancelButtonText: 'Batal',
            }).then((result) => {
                if (result.isConfirmed) {
                    router.post(route('baak.mata-kuliah.toggle-status', mata_kuliah.kode_matkul), {}, { preserveScroll: true });
                }
            });

            return;
        }

        if (confirm(`Apakah Anda yakin ingin ${action} mata kuliah "${mata_kuliah.nama_matkul}"?`)) {
            router.post(route('baak.mata-kuliah.toggle-status', mata_kuliah.kode_matkul), {}, { preserveScroll: true });
        }
    };

    const tabs = [
        { key: 'info', label: 'Informasi' },
        { key: 'kelas', label: `Kelas (${kelasData.length})` },
    ];

    const summaryCards = [
        { title: 'SKS', value: mata_kuliah.sks || 0, icon: Hash, tone: 'blue' },
        { title: 'Kelas', value: kelasData.length, icon: Layers, tone: 'violet' },
        { title: 'Kapasitas', value: kelasData.reduce((sum, item) => sum + (item.kapasitas || 0), 0), icon: Users, tone: 'emerald' },
        { title: 'Dosen', value: new Set(kelasData.map((item) => item.dosen?.id_dosen || item.dosen?.nip || item.dosen?.nama).filter(Boolean)).size, icon: UserCheck, tone: 'amber' },
    ];

    const infoItems = [
        { label: 'Kode Mata Kuliah', value: mata_kuliah.kode_matkul || '-' },
        { label: 'Nama Mata Kuliah', value: mata_kuliah.nama_matkul || '-' },
        { label: 'SKS', value: `${mata_kuliah.sks || '-'} SKS` },
        { label: 'Semester', value: mata_kuliah.semester ? `Semester ${mata_kuliah.semester}` : '-' },
        {
            label: 'Program Studi',
            value: mata_kuliah.prodi ? mata_kuliah.prodi.nama_prodi : 'Semua Prodi (Mata Kuliah Umum)',
        },
        { label: 'Kategori', value: getKategoriLabel(mata_kuliah.kategori), badgeClassName: getKategoriBadge(mata_kuliah.kategori) },
        { label: 'Status', value: mata_kuliah.is_active ? 'AKTIF' : 'NONAKTIF', badgeClassName: getStatusBadge(mata_kuliah.is_active) },
        { label: 'Jumlah Kelas', value: `${kelasData.length} Kelas` },
    ];

    const kelasColumns = [
        {
            key: 'number',
            header: 'No',
            headerClassName: 'w-[56px]',
            cellClassName: 'font-medium text-slate-500',
            render: (_item, index) => index + 1,
        },
        {
            key: 'nama_kelas',
            header: 'Kelas',
            headerClassName: 'text-center',
            cellClassName: 'text-center',
            render: (item) => (
                <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200">
                    {item.nama_kelas}
                </Badge>
            ),
        },
        {
            key: 'dosen',
            header: 'Dosen Pengampu',
            render: (item) => <span className="font-semibold text-slate-800">{item.dosen?.nama || '-'}</span>,
        },
        {
            key: 'hari',
            header: 'Hari',
            headerClassName: 'text-center',
            cellClassName: 'text-center',
            render: (item) => item.hari || '-',
        },
        {
            key: 'jam',
            header: 'Jam',
            headerClassName: 'text-center',
            cellClassName: 'text-center',
            render: formatTimeRange,
        },
        {
            key: 'ruang_kelas',
            header: 'Ruang',
            headerClassName: 'text-center',
            cellClassName: 'text-center',
            render: (item) => item.ruang_kelas || '-',
        },
        {
            key: 'kapasitas',
            header: 'Kapasitas',
            headerClassName: 'text-center',
            cellClassName: 'text-center',
            render: (item) => `${item.kapasitas || 0} mhs`,
        },
    ];

    const renderKelasCard = (item, index, key) => (
        <Card key={key} className="rounded-lg border-slate-200 shadow-sm">
            <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-400">#{index + 1}</p>
                        <p className="break-words font-semibold text-slate-900">{item.dosen?.nama || '-'}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0 bg-violet-50 text-violet-700 border-violet-200">
                        {item.nama_kelas}
                    </Badge>
                </div>
                <div className="grid gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-slate-400" />
                        <span>{item.hari || '-'}</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span>{formatTimeRange(item)}</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <DoorOpen className="h-4 w-4 text-slate-400" />
                        <span>{item.ruang_kelas || '-'}</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span>{item.kapasitas || 0} mahasiswa</span>
                    </p>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <BaakLayout title="Detail Mata Kuliah">
            <Head title={`Detail ${mata_kuliah.nama_matkul}`} />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5">
                    <div>
                        <Link href={route('baak.mata-kuliah.index')} className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Daftar Mata Kuliah
                        </Link>
                        <PageHeader
                            title="Detail Mata Kuliah"
                            description={`${mata_kuliah.nama_matkul} (${mata_kuliah.kode_matkul})`}
                            actionHref={route('baak.mata-kuliah.edit', mata_kuliah.kode_matkul)}
                            actionLabel="Edit Mata Kuliah"
                            actionIcon={Pencil}
                        />
                    </div>

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                            <div className="min-w-0">
                                <div className="mb-2 flex flex-wrap gap-1.5">
                                    <Badge variant="outline" className="bg-blue-50 font-mono text-blue-700">
                                        {mata_kuliah.kode_matkul}
                                    </Badge>
                                    <Badge variant="outline" className={getKategoriBadge(mata_kuliah.kategori)}>
                                        {mata_kuliah.kategori?.toUpperCase() || '-'}
                                    </Badge>
                                    <Badge variant="outline" className={getStatusBadge(mata_kuliah.is_active)}>
                                        {mata_kuliah.is_active ? 'AKTIF' : 'NONAKTIF'}
                                    </Badge>
                                </div>
                                <h2 className="break-words text-xl font-bold text-slate-950 sm:text-2xl">{mata_kuliah.nama_matkul}</h2>
                                <p className="mt-1 flex min-w-0 items-center gap-1.5 text-sm text-slate-500">
                                    <GraduationCap className="h-4 w-4 shrink-0 text-slate-400" />
                                    <span className="break-words">
                                        {mata_kuliah.prodi ? mata_kuliah.prodi.nama_prodi : 'Semua Prodi (Mata Kuliah Umum)'}
                                    </span>
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant={mata_kuliah.is_active ? 'destructive' : 'default'}
                                className="w-full gap-2 lg:w-auto"
                                onClick={handleToggleStatus}
                            >
                                {mata_kuliah.is_active ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />}
                                <span>{mata_kuliah.is_active ? 'Nonaktifkan' : 'Aktifkan'}</span>
                            </Button>
                        </CardContent>
                    </Card>

                    <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                        {summaryCards.map((card) => (
                            <SummaryCard key={card.title} {...card} />
                        ))}
                    </section>

                    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 p-0">
                            <div className="flex overflow-x-auto">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`min-w-max border-b-2 px-4 py-3 text-sm font-semibold transition sm:px-5 ${
                                            activeTab === tab.key
                                                ? 'border-blue-600 bg-blue-50/60 text-blue-700'
                                                : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 sm:p-5">
                            {activeTab === 'info' ? (
                                <div className="space-y-5">
                                    <section>
                                        <h3 className="mb-3 text-base font-bold text-slate-950">Informasi Mata Kuliah</h3>
                                        <div className="grid gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
                                            {infoItems.map((item) => (
                                                <div key={item.label} className="min-w-0">
                                                    <p className="text-xs font-medium text-slate-500">{item.label}</p>
                                                    {item.badgeClassName ? (
                                                        <Badge variant="outline" className={`mt-1 ${item.badgeClassName}`}>
                                                            {item.value}
                                                        </Badge>
                                                    ) : (
                                                        <p className="mt-1 break-words font-semibold text-slate-900">{item.value}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {mata_kuliah.deskripsi ? (
                                        <section>
                                            <h3 className="mb-3 text-base font-bold text-slate-950">Deskripsi</h3>
                                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                                <p className="break-words text-sm leading-6 text-slate-700">{mata_kuliah.deskripsi}</p>
                                            </div>
                                        </section>
                                    ) : null}
                                </div>
                            ) : null}

                            {activeTab === 'kelas' ? (
                                <div className="space-y-4">
                                    <DataTable
                                        columns={kelasColumns}
                                        data={kelasData}
                                        getRowKey={(item) => item.id_kelas}
                                        emptyState={<EmptyState title="Belum ada kelas" description="Belum ada kelas untuk mata kuliah ini" />}
                                        className="hidden lg:block"
                                        asCard={false}
                                    />
                                    <CardGrid
                                        data={kelasData}
                                        getCardKey={(item) => item.id_kelas}
                                        renderCard={renderKelasCard}
                                        emptyState={<EmptyState title="Belum ada kelas" description="Belum ada kelas untuk mata kuliah ini" compact />}
                                        className="grid gap-3 md:grid-cols-2 lg:hidden"
                                        emptyClassName="lg:hidden"
                                    />
                                </div>
                            ) : null}
                        </div>
                    </section>
                </div>
            </div>
        </BaakLayout>
    );
}
