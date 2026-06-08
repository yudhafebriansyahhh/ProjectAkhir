import { useEffect, useRef, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { CalendarDays, Clock3, Pencil, RefreshCcw, Trash2, Users } from 'lucide-react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { CardGrid, DataTable, EmptyState, PageHeader, Pagination, SearchInput, SummaryCard } from '@/Components/ui/data-display';
import { SelectDropdown } from '@/Components/ui/select-dropdown';

const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const normalizeStatusBadge = (classes = '') => classes
    .replace('bg-gray-100 text-gray-700', 'border-slate-200 bg-slate-50 text-slate-700')
    .replace('bg-blue-100 text-blue-700', 'border-blue-200 bg-blue-50 text-blue-700')
    .replace('bg-green-100 text-green-700', 'border-emerald-200 bg-emerald-50 text-emerald-700');

const getCountdown = (jadwal) => {
    const now = new Date();
    const mulai = new Date(jadwal.tanggal_mulai);
    const selesai = new Date(jadwal.tanggal_selesai);

    if (jadwal.status_label === 'Belum Mulai') {
        return `${Math.ceil((mulai - now) / (1000 * 60 * 60 * 24))} hari lagi`;
    }

    if (jadwal.status_label === 'Sedang Berjalan') {
        return `${Math.ceil((selesai - now) / (1000 * 60 * 60 * 24))} hari tersisa`;
    }

    return null;
};

const semesterBadges = (semesterList) => {
    if (!semesterList?.length) return <span className="text-slate-400">-</span>;

    return (
        <div className="flex flex-wrap gap-1">
            {[...semesterList].sort((a, b) => a - b).map((sem) => (
                <Badge key={sem} variant="outline" className="bg-violet-50 text-violet-700">Sem {sem}</Badge>
            ))}
        </div>
    );
};

export default function Index({ jadwalKrs, prodiList = [], filters = {} }) {
    const { flash = {} } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [selectedProdi, setSelectedProdi] = useState(filters.prodi || '');
    const [selectedTahun, setSelectedTahun] = useState(filters.tahun_ajaran || '');
    const isFirstRender = useRef(true);

    const jadwalData = jadwalKrs.data || [];
    const hasFilters = Boolean(search || selectedProdi || selectedTahun);
    const prodiOptions = prodiList.map((prodi) => ({ value: prodi.kode_prodi, label: prodi.nama_prodi }));

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                route('baak.jadwal-krs.index'),
                { search, prodi: selectedProdi, tahun_ajaran: selectedTahun },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 350);

        return () => clearTimeout(timeout);
    }, [search, selectedProdi, selectedTahun]);

    const handleReset = () => {
        setSearch('');
        setSelectedProdi('');
        setSelectedTahun('');
        router.get(route('baak.jadwal-krs.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleDelete = (jadwal) => {
        const destroy = () => router.delete(route('baak.jadwal-krs.destroy', jadwal.id_jadwal), { preserveScroll: true });

        if (window.Swal) {
            window.Swal.fire({
                title: 'Hapus Jadwal KRS?',
                text: `Jadwal KRS ${jadwal.prodi?.nama_prodi || '-'} akan dihapus permanen!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc2626',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal',
            }).then((result) => {
                if (result.isConfirmed) destroy();
            });
            return;
        }

        if (confirm(`Hapus jadwal KRS ${jadwal.prodi?.nama_prodi || '-'}?`)) destroy();
    };

    const renderActions = (jadwal, compact = false) => {
        if (compact) {
            return (
                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                    <Link href={route('baak.jadwal-krs.edit', jadwal.id_jadwal)}>
                        <Button variant="outline" size="sm" className="w-full gap-1.5 text-amber-600">
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                        </Button>
                    </Link>
                    <Button type="button" variant="outline" size="sm" className="w-full gap-1.5 text-red-600" onClick={() => handleDelete(jadwal)}>
                        <Trash2 className="h-3.5 w-3.5" />
                        Hapus
                    </Button>
                </div>
            );
        }

        return (
            <div className="flex items-center justify-center gap-1.5">
                <Link href={route('baak.jadwal-krs.edit', jadwal.id_jadwal)}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600" title="Edit">
                        <Pencil className="h-4 w-4" />
                    </Button>
                </Link>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-600" title="Hapus" onClick={() => handleDelete(jadwal)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        );
    };

    const columns = [
        { key: 'number', header: 'No', headerClassName: 'w-[56px]', cellClassName: 'font-medium text-slate-500', render: (_item, index) => (jadwalKrs.from || 1) + index },
        {
            key: 'prodi',
            header: 'Program Studi',
            render: (item) => (
                <div className="min-w-[200px]">
                    <p className="break-words font-semibold text-slate-900">{item.prodi?.nama_prodi || '-'}</p>
                    <p className="text-xs text-slate-500">{item.prodi?.jenjang || '-'}</p>
                </div>
            ),
        },
        { key: 'semester', header: 'Semester', render: (item) => semesterBadges(item.semester_list) },
        { key: 'tahun', header: 'Tahun Ajaran', render: (item) => <span className="font-semibold text-slate-900">{item.tahun_ajaran || '-'}</span> },
        {
            key: 'periode',
            header: 'Periode',
            render: (item) => (
                <div className="text-sm text-slate-700">
                    <p>{formatDate(item.tanggal_mulai)}</p>
                    <p className="text-slate-500">s/d {formatDate(item.tanggal_selesai)}</p>
                    <p className="text-xs text-slate-400">{item.durasi} hari</p>
                </div>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            headerClassName: 'text-center',
            cellClassName: 'text-center',
            render: (item) => {
                const countdown = getCountdown(item);
                return (
                    <div className="space-y-1">
                        <Badge variant="outline" className={normalizeStatusBadge(item.status_badge)}>{item.status_label}</Badge>
                        {countdown ? <p className="text-xs font-medium text-blue-600">{countdown}</p> : null}
                    </div>
                );
            },
        },
        { key: 'actions', header: 'Aksi', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => renderActions(item) },
    ];

    const renderCard = (jadwal, _index, key) => {
        const countdown = getCountdown(jadwal);

        return (
            <Card key={key} className="rounded-lg border-slate-200 shadow-sm">
                <CardContent className="space-y-4 p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="break-words font-semibold text-slate-950">{jadwal.prodi?.nama_prodi || '-'}</p>
                            <p className="text-sm text-slate-500">{jadwal.tahun_ajaran || '-'}</p>
                        </div>
                        <Badge variant="outline" className={normalizeStatusBadge(jadwal.status_badge)}>{jadwal.status_label}</Badge>
                    </div>
                    <div>{semesterBadges(jadwal.semester_list)}</div>
                    <div className="grid gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                        <p><span className="font-medium text-slate-800">Mulai:</span> {formatDate(jadwal.tanggal_mulai)}</p>
                        <p><span className="font-medium text-slate-800">Selesai:</span> {formatDate(jadwal.tanggal_selesai)}</p>
                        <p><span className="font-medium text-slate-800">Durasi:</span> {jadwal.durasi} hari</p>
                        {countdown ? <p className="font-medium text-blue-600">{countdown}</p> : null}
                    </div>
                    {renderActions(jadwal, true)}
                </CardContent>
            </Card>
        );
    };

    return (
        <BaakLayout title="Manajemen Jadwal KRS">
            <Head title="Manajemen Jadwal KRS" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5">
                    <PageHeader
                        title="Manajemen Jadwal KRS"
                        description="Kelola jadwal pengisian KRS untuk setiap program studi."
                        actionHref={route('baak.jadwal-krs.create')}
                        actionLabel="Tambah Jadwal KRS"
                    />

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <SummaryCard title="Total Jadwal" value={jadwalKrs.total || 0} icon={CalendarDays} tone="blue" />
                        <SummaryCard title="Berjalan" value={jadwalData.filter((item) => item.status_label === 'Sedang Berjalan').length} icon={Clock3} tone="emerald" />
                        <SummaryCard title="Belum Mulai" value={jadwalData.filter((item) => item.status_label === 'Belum Mulai').length} icon={Clock3} tone="amber" />
                        <SummaryCard title="Prodi" value={prodiList.length || 0} icon={Users} tone="violet" />
                    </div>

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="grid gap-3 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(200px,280px)_minmax(160px,220px)_auto]">
                            <SearchInput value={search} onChange={setSearch} onClear={() => setSearch('')} placeholder="Cari program studi..." />
                            <SelectDropdown value={selectedProdi} onChange={(selected) => setSelectedProdi(selected ? selected.value : '')} options={prodiOptions} placeholder="Semua Program Studi" />
                            <SearchInput value={selectedTahun} onChange={setSelectedTahun} onClear={() => setSelectedTahun('')} placeholder="Tahun ajaran..." />
                            <Button type="button" variant="outline" className="w-full gap-2 lg:w-auto" onClick={handleReset} disabled={!hasFilters}>
                                <RefreshCcw className="h-4 w-4" />
                                Reset
                            </Button>
                        </CardContent>
                    </Card>

                    <DataTable
                        columns={columns}
                        data={jadwalData}
                        getRowKey={(item) => item.id_jadwal}
                        emptyState={<EmptyState title="Tidak ada jadwal KRS" description="Jadwal KRS belum tersedia atau tidak sesuai filter." />}
                        className="hidden lg:block"
                    />

                    <CardGrid
                        data={jadwalData}
                        getCardKey={(item) => item.id_jadwal}
                        renderCard={renderCard}
                        emptyState={<EmptyState title="Tidak ada jadwal KRS" description="Jadwal KRS belum tersedia atau tidak sesuai filter." compact />}
                        className="grid gap-3 md:grid-cols-2 lg:hidden"
                        emptyClassName="lg:hidden"
                    />

                    <Pagination pagination={jadwalKrs} />
                </div>
            </div>
        </BaakLayout>
    );
}
