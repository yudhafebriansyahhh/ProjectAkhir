import { useEffect, useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle2, Clock3, Eye, FileText, LockOpen, RefreshCcw, XCircle } from 'lucide-react';
import DosenLayout from '@/Layouts/DosenLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { CardGrid, DataTable, EmptyState, PageHeader, Pagination, SearchInput, SummaryCard } from '@/Components/ui/data-display';
import { SelectDropdown } from '@/Components/ui/select-dropdown';

const semesterOptions = Array.from({ length: 8 }, (_, index) => ({ value: String(index + 1), label: `Semester ${index + 1}` }));
const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Menunggu' },
    { value: 'approved', label: 'Disetujui' },
    { value: 'rejected', label: 'Ditolak' },
];

const getStatusLabel = (status) => ({
    draft: 'Draft',
    pending: 'Menunggu',
    approved: 'Disetujui',
    rejected: 'Ditolak',
}[status] || status || '-');

const getStatusBadge = (status) => ({
    draft: 'border-slate-200 bg-slate-50 text-slate-700',
    pending: 'border-amber-200 bg-amber-50 text-amber-700',
    approved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    rejected: 'border-red-200 bg-red-50 text-red-700',
}[status] || 'border-slate-200 bg-slate-50 text-slate-700');

const formatDate = (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function Index({ krs, stats = {}, tahunAjaranList = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [semester, setSemester] = useState(filters.semester || '');
    const [tahunAjaran, setTahunAjaran] = useState(filters.tahun_ajaran || '');
    const isFirstRender = useRef(true);

    const krsData = krs.data || [];
    const hasFilters = Boolean(search || status || semester || tahunAjaran);
    const tahunOptions = tahunAjaranList.map((item) => ({ value: item, label: item }));

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                route('dosen.acc-krs.index'),
                { search, status, semester, tahun_ajaran: tahunAjaran },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 350);

        return () => clearTimeout(timeout);
    }, [search, status, semester, tahunAjaran]);

    const resetFilters = () => {
        setSearch('');
        setStatus('');
        setSemester('');
        setTahunAjaran('');
        router.get(route('dosen.acc-krs.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const updateStatus = (item, nextStatus) => {
        const isUnlock = nextStatus === 'draft';
        const isCancelApproved = nextStatus === 'rejected' && item.status === 'approved';
        const actionLabel = nextStatus === 'approved'
            ? 'menyetujui'
            : isUnlock
                ? 'membuka kunci'
                : isCancelApproved
                    ? 'membatalkan'
                    : 'menolak';
        const confirmText = nextStatus === 'approved'
            ? 'KRS mahasiswa akan disetujui.'
            : isUnlock
                ? 'Status KRS akan dikembalikan ke draft agar mahasiswa dapat mengedit lagi.'
                : isCancelApproved
                    ? 'KRS yang sudah disetujui akan dibatalkan.'
                    : 'KRS mahasiswa akan ditolak.';

        const submit = () => {
            router.patch(route('dosen.acc-krs.update', item.id_krs), { status: nextStatus }, { preserveScroll: true });
        };

        if (window.Swal) {
            window.Swal.fire({
                title: `Yakin ${actionLabel} KRS?`,
                text: confirmText,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: nextStatus === 'approved'
                    ? 'Ya, setujui'
                    : isUnlock
                        ? 'Ya, buka kunci'
                        : isCancelApproved
                            ? 'Ya, batalkan'
                            : 'Ya, tolak',
                cancelButtonText: 'Batal',
                confirmButtonColor: nextStatus === 'approved' ? '#2563eb' : isUnlock ? '#059669' : '#dc2626',
            }).then((result) => {
                if (result.isConfirmed) submit();
            });
            return;
        }

        if (confirm(`Yakin ${actionLabel} KRS?`)) submit();
    };

    const renderStatus = (item) => (
        <Badge variant="outline" className={getStatusBadge(item.status)}>
            {getStatusLabel(item.status)}
        </Badge>
    );

    const renderActions = (item, compact = false) => (
        <div className={`flex ${compact ? 'flex-col' : 'items-center justify-center'} gap-2`}>
            <Link href={route('dosen.acc-krs.show', item.id_krs)} className={compact ? 'w-full' : ''}>
                <Button type="button" variant="outline" size={compact ? 'sm' : 'icon'} className={`${compact ? 'w-full gap-2' : 'h-8 w-8'} text-blue-600`}>
                    <Eye className="h-4 w-4" />
                    {compact ? 'Lihat Detail' : null}
                </Button>
            </Link>
            {item.status === 'pending' ? (
                <>
                    <Button type="button" size={compact ? 'sm' : 'icon'} className={`${compact ? 'w-full gap-2' : 'h-8 w-8'} bg-blue-600`} onClick={() => updateStatus(item, 'approved')}>
                        <CheckCircle2 className="h-4 w-4" />
                        {compact ? 'Setujui' : null}
                    </Button>
                    <Button type="button" variant="outline" size={compact ? 'sm' : 'icon'} className={`${compact ? 'w-full gap-2' : 'h-8 w-8'} text-red-600`} onClick={() => updateStatus(item, 'rejected')}>
                        <XCircle className="h-4 w-4" />
                        {compact ? 'Tolak' : null}
                    </Button>
                    <Button type="button" variant="outline" size={compact ? 'sm' : 'icon'} className={`${compact ? 'w-full gap-2' : 'h-8 w-8'} text-emerald-600`} onClick={() => updateStatus(item, 'draft')}>
                        <LockOpen className="h-4 w-4" />
                        {compact ? 'Buka Edit' : null}
                    </Button>
                </>
            ) : null}
            {item.status === 'approved' ? (
                <>
                    <Button type="button" variant="outline" size={compact ? 'sm' : 'icon'} className={`${compact ? 'w-full gap-2' : 'h-8 w-8'} text-emerald-600`} onClick={() => updateStatus(item, 'draft')}>
                        <LockOpen className="h-4 w-4" />
                        {compact ? 'Buka Edit' : null}
                    </Button>
                    <Button type="button" variant="outline" size={compact ? 'sm' : 'icon'} className={`${compact ? 'w-full gap-2' : 'h-8 w-8'} text-red-600`} onClick={() => updateStatus(item, 'rejected')}>
                        <XCircle className="h-4 w-4" />
                        {compact ? 'Batalkan KRS' : null}
                    </Button>
                </>
            ) : null}
            {item.status === 'rejected' ? (
                <Button type="button" variant="outline" size={compact ? 'sm' : 'icon'} className={`${compact ? 'w-full gap-2' : 'h-8 w-8'} text-emerald-600`} onClick={() => updateStatus(item, 'draft')}>
                    <LockOpen className="h-4 w-4" />
                    {compact ? 'Buka Edit' : null}
                </Button>
            ) : null}
        </div>
    );

    const columns = [
        { key: 'number', header: 'No', headerClassName: 'w-[56px]', cellClassName: 'font-medium text-slate-500', render: (_item, index) => (krs.from || 1) + index },
        { key: 'nim', header: 'NIM', render: (item) => <span className="font-mono text-sm font-semibold text-slate-900">{item.mahasiswa?.nim || '-'}</span> },
        {
            key: 'mahasiswa',
            header: 'Mahasiswa',
            render: (item) => (
                <div className="min-w-[220px]">
                    <p className="break-words font-semibold text-slate-900">{item.mahasiswa?.nama || '-'}</p>
                    <p className="text-xs text-slate-500">{item.mahasiswa?.prodi?.nama_prodi || '-'}</p>
                </div>
            ),
        },
        { key: 'semester', header: 'Semester', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <Badge variant="outline" className="bg-slate-50 text-slate-700">Semester {item.semester || '-'}</Badge> },
        { key: 'sks', header: 'SKS', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <Badge variant="outline" className="bg-blue-50 text-blue-700">{item.total_sks || 0} SKS</Badge> },
        { key: 'status', header: 'Status', headerClassName: 'text-center', cellClassName: 'text-center', render: renderStatus },
        { key: 'tanggal', header: 'Tanggal', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <span className="whitespace-nowrap text-sm text-slate-700">{formatDate(item.tanggal_pengisian)}</span> },
        { key: 'actions', header: 'Aksi', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => renderActions(item) },
    ];

    const renderCard = (item, _index, key) => (
        <Card key={key} className="rounded-lg border-slate-200 shadow-sm">
            <CardContent className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="break-words font-semibold text-slate-950">{item.mahasiswa?.nama || '-'}</p>
                        <p className="font-mono text-sm text-slate-500">{item.mahasiswa?.nim || '-'}</p>
                    </div>
                    {renderStatus(item)}
                </div>
                <div className="grid gap-2 rounded-lg bg-slate-50 p-3 text-sm">
                    <p className="text-slate-600"><span className="font-medium text-slate-800">Prodi:</span> {item.mahasiswa?.prodi?.nama_prodi || '-'}</p>
                    <p className="text-slate-600"><span className="font-medium text-slate-800">Semester:</span> {item.semester || '-'} - {item.total_sks || 0} SKS</p>
                    <p className="text-slate-600"><span className="font-medium text-slate-800">Mata Kuliah:</span> {item.jumlah_mata_kuliah || 0}</p>
                    <p className="text-slate-600"><span className="font-medium text-slate-800">Tanggal:</span> {formatDate(item.tanggal_pengisian)}</p>
                </div>
                {renderActions(item, true)}
            </CardContent>
        </Card>
    );

    return (
        <DosenLayout title="ACC KRS">
            <Head title="ACC KRS" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5">
                    <PageHeader title="ACC KRS" description="Periksa dan setujui KRS mahasiswa wali Anda." />

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        <SummaryCard title="Total KRS" value={stats.total || 0} icon={FileText} tone="blue" />
                        <SummaryCard title="Draft" value={stats.draft || 0} icon={LockOpen} tone="blue" />
                        <SummaryCard title="Menunggu" value={stats.pending || 0} icon={Clock3} tone="amber" />
                        <SummaryCard title="Disetujui" value={stats.approved || 0} icon={CheckCircle2} tone="emerald" />
                        <SummaryCard title="Ditolak" value={stats.rejected || 0} icon={XCircle} tone="violet" />
                    </div>

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="grid gap-3 p-4 lg:grid-cols-[minmax(260px,1.3fr)_repeat(3,minmax(170px,1fr))_auto]">
                            <SearchInput value={search} onChange={setSearch} onClear={() => setSearch('')} placeholder="Cari NIM atau nama mahasiswa..." />
                            <SelectDropdown value={tahunAjaran} onChange={(selected) => setTahunAjaran(selected ? selected.value : '')} options={tahunOptions} placeholder="Semua Tahun" />
                            <SelectDropdown value={semester} onChange={(selected) => setSemester(selected ? selected.value : '')} options={semesterOptions} placeholder="Semua Semester" isSearchable={false} />
                            <SelectDropdown value={status} onChange={(selected) => setStatus(selected ? selected.value : '')} options={statusOptions} placeholder="Semua Status" isSearchable={false} />
                            {hasFilters ? (
                                <Button type="button" variant="outline" className="w-full gap-2 lg:w-auto" onClick={resetFilters}>
                                    <RefreshCcw className="h-4 w-4" />
                                    Reset
                                </Button>
                            ) : null}
                        </CardContent>
                    </Card>

                    <DataTable
                        columns={columns}
                        data={krsData}
                        getRowKey={(item) => item.id_krs}
                        emptyState={<EmptyState title="Tidak ada KRS" description="Belum ada KRS mahasiswa wali yang sesuai filter." />}
                        className="hidden lg:block"
                    />

                    <CardGrid
                        data={krsData}
                        getCardKey={(item) => item.id_krs}
                        renderCard={renderCard}
                        emptyState={<EmptyState title="Tidak ada KRS" description="Belum ada KRS mahasiswa wali yang sesuai filter." compact />}
                        className="grid gap-3 md:grid-cols-2 lg:hidden"
                        emptyClassName="lg:hidden"
                    />

                    <Pagination pagination={krs} />
                </div>
            </div>
        </DosenLayout>
    );
}
