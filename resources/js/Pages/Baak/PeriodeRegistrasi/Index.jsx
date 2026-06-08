import { useEffect, useRef, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { CalendarCheck, CalendarClock, CheckCircle2, Pencil, Power, RefreshCcw, Trash2, XCircle } from 'lucide-react';
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

const statusClass = (status) => status === 'aktif'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : 'border-red-200 bg-red-50 text-red-700';

export default function Index({ periodes, tahunAjaranList = [], filters = {} }) {
    const { flash = {} } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [tahunAjaran, setTahunAjaran] = useState(filters.tahun_ajaran || '');
    const isFirstRender = useRef(true);

    const periodeData = periodes.data || [];
    const hasFilters = Boolean(search || tahunAjaran);
    const tahunOptions = tahunAjaranList.map((item) => ({ value: item, label: item }));

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                route('baak.periode-registrasi.index'),
                { search, tahun_ajaran: tahunAjaran },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 350);

        return () => clearTimeout(timeout);
    }, [search, tahunAjaran]);

    const handleReset = () => {
        setSearch('');
        setTahunAjaran('');
        router.get(route('baak.periode-registrasi.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleToggleStatus = (periode) => {
        const action = periode.status === 'tutup' ? 'mengaktifkan' : 'menutup';
        const toggle = () => router.post(route('baak.periode-registrasi.toggle-status', periode.id_periode), {}, { preserveScroll: true });

        if (window.Swal) {
            window.Swal.fire({
                title: 'Konfirmasi',
                text: `Apakah Anda yakin ingin ${action} periode ini?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#2563eb',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Ya, Lanjutkan',
                cancelButtonText: 'Batal',
            }).then((result) => {
                if (result.isConfirmed) toggle();
            });
            return;
        }

        if (confirm(`Yakin ingin ${action} periode ini?`)) toggle();
    };

    const handleDelete = (periode) => {
        const destroy = () => router.delete(route('baak.periode-registrasi.destroy', periode.id_periode), { preserveScroll: true });

        if (window.Swal) {
            window.Swal.fire({
                title: 'Hapus Periode?',
                text: `Periode ${periode.tahun_ajaran} ${periode.jenis_semester} akan dihapus permanen!`,
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

        if (confirm(`Hapus periode ${periode.tahun_ajaran} ${periode.jenis_semester}?`)) destroy();
    };

    const renderActions = (periode, compact = false) => {
        if (compact) {
            return (
                <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
                    <Button type="button" variant="outline" size="sm" className={`w-full gap-1.5 ${periode.status === 'tutup' ? 'text-emerald-600' : 'text-orange-600'}`} onClick={() => handleToggleStatus(periode)}>
                        <Power className="h-3.5 w-3.5" />
                        {periode.status === 'tutup' ? 'Aktifkan' : 'Tutup'}
                    </Button>
                    <Link href={route('baak.periode-registrasi.edit', periode.id_periode)}>
                        <Button variant="outline" size="sm" className="w-full gap-1.5 text-amber-600">
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                        </Button>
                    </Link>
                    <Button type="button" variant="outline" size="sm" className="w-full gap-1.5 text-red-600" onClick={() => handleDelete(periode)}>
                        <Trash2 className="h-3.5 w-3.5" />
                        Hapus
                    </Button>
                </div>
            );
        }

        return (
            <div className="flex items-center justify-center gap-1.5">
                <Button type="button" variant="ghost" size="icon" className={`h-8 w-8 ${periode.status === 'tutup' ? 'text-emerald-600' : 'text-orange-600'}`} title={periode.status === 'tutup' ? 'Aktifkan' : 'Tutup'} onClick={() => handleToggleStatus(periode)}>
                    <Power className="h-4 w-4" />
                </Button>
                <Link href={route('baak.periode-registrasi.edit', periode.id_periode)}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600" title="Edit">
                        <Pencil className="h-4 w-4" />
                    </Button>
                </Link>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-600" title="Hapus" onClick={() => handleDelete(periode)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        );
    };

    const columns = [
        { key: 'number', header: 'No', headerClassName: 'w-[56px]', cellClassName: 'font-medium text-slate-500', render: (_item, index) => (periodes.from || 1) + index },
        { key: 'tahun_ajaran', header: 'Tahun Ajaran', render: (item) => <span className="font-semibold text-slate-900">{item.tahun_ajaran}</span> },
        { key: 'semester', header: 'Semester', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <Badge variant="outline" className="bg-blue-50 capitalize text-blue-700">{item.jenis_semester}</Badge> },
        { key: 'mulai', header: 'Tanggal Mulai', render: (item) => <span className="whitespace-nowrap text-sm text-slate-700">{formatDate(item.tanggal_mulai)}</span> },
        { key: 'selesai', header: 'Tanggal Selesai', render: (item) => <span className="whitespace-nowrap text-sm text-slate-700">{formatDate(item.tanggal_selesai)}</span> },
        { key: 'durasi', header: 'Durasi', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <Badge variant="outline" className="bg-slate-50 text-slate-700">{item.durasi} hari</Badge> },
        { key: 'status', header: 'Status', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <Badge variant="outline" className={statusClass(item.status)}>{item.status === 'aktif' ? 'Aktif' : 'Tutup'}</Badge> },
        { key: 'actions', header: 'Aksi', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => renderActions(item) },
    ];

    const renderCard = (periode, _index, key) => (
        <Card key={key} className={`rounded-lg shadow-sm ${periode.status === 'aktif' ? 'border-emerald-200' : 'border-slate-200'}`}>
            <CardContent className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="font-semibold text-slate-950">{periode.tahun_ajaran}</p>
                        <Badge variant="outline" className="mt-2 bg-blue-50 capitalize text-blue-700">{periode.jenis_semester}</Badge>
                    </div>
                    <Badge variant="outline" className={statusClass(periode.status)}>{periode.status === 'aktif' ? 'Aktif' : 'Tutup'}</Badge>
                </div>
                <div className="grid gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                    <p><span className="font-medium text-slate-800">Mulai:</span> {formatDate(periode.tanggal_mulai)}</p>
                    <p><span className="font-medium text-slate-800">Selesai:</span> {formatDate(periode.tanggal_selesai)}</p>
                    <p><span className="font-medium text-slate-800">Durasi:</span> {periode.durasi} hari</p>
                </div>
                {renderActions(periode, true)}
            </CardContent>
        </Card>
    );

    return (
        <BaakLayout title="Periode Registrasi">
            <Head title="Periode Registrasi" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5">
                    <PageHeader
                        title="Periode Registrasi"
                        description="Kelola periode registrasi semester mahasiswa."
                        actionHref={route('baak.periode-registrasi.create')}
                        actionLabel="Tambah Periode"
                    />

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <SummaryCard title="Total Periode" value={periodes.total || 0} icon={CalendarClock} tone="blue" />
                        <SummaryCard title="Aktif" value={periodeData.filter((item) => item.status === 'aktif').length} icon={CheckCircle2} tone="emerald" />
                        <SummaryCard title="Tutup" value={periodeData.filter((item) => item.status !== 'aktif').length} icon={XCircle} tone="amber" />
                        <SummaryCard title="Tahun Ajaran" value={tahunAjaranList.length || 0} icon={CalendarCheck} tone="violet" />
                    </div>

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_minmax(180px,260px)_auto]">
                            <SearchInput value={search} onChange={setSearch} onClear={() => setSearch('')} placeholder="Cari tahun ajaran..." />
                            <SelectDropdown value={tahunAjaran} onChange={(selected) => setTahunAjaran(selected ? selected.value : '')} options={tahunOptions} placeholder="Semua Tahun Ajaran" />
                            <Button type="button" variant="outline" className="w-full gap-2 md:w-auto" onClick={handleReset} disabled={!hasFilters}>
                                <RefreshCcw className="h-4 w-4" />
                                Reset
                            </Button>
                        </CardContent>
                    </Card>

                    <DataTable
                        columns={columns}
                        data={periodeData}
                        getRowKey={(item) => item.id_periode}
                        emptyState={<EmptyState title="Tidak ada data periode" description="Periode registrasi belum tersedia atau tidak sesuai filter." />}
                        className="hidden lg:block"
                    />

                    <CardGrid
                        data={periodeData}
                        getCardKey={(item) => item.id_periode}
                        renderCard={renderCard}
                        emptyState={<EmptyState title="Tidak ada data periode" description="Periode registrasi belum tersedia atau tidak sesuai filter." compact />}
                        className="grid gap-3 md:grid-cols-2 lg:hidden"
                        emptyClassName="lg:hidden"
                    />

                    <Pagination pagination={periodes} />
                </div>
            </div>
        </BaakLayout>
    );
}
