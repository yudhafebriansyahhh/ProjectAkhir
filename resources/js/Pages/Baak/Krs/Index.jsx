import { useEffect, useRef, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { CheckCircle2, Clock3, Eye, FileText, RefreshCcw, XCircle } from 'lucide-react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { CardGrid, DataTable, EmptyState, PageHeader, Pagination, SearchInput, SummaryCard } from '@/Components/ui/data-display';
import { SelectDropdown } from '@/Components/ui/select-dropdown';

const semesterOptions = Array.from({ length: 8 }, (_, index) => ({ value: String(index + 1), label: `Semester ${index + 1}` }));
const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Disetujui' },
    { value: 'rejected', label: 'Ditolak' },
];

const getStatusBadge = (status) => {
    const badges = {
        pending: 'border-amber-200 bg-amber-50 text-amber-700',
        approved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        rejected: 'border-red-200 bg-red-50 text-red-700',
    };
    return badges[status] || 'border-slate-200 bg-slate-50 text-slate-700';
};

const getStatusLabel = (status) => {
    const labels = {
        pending: 'Pending',
        approved: 'Disetujui',
        rejected: 'Ditolak',
    };
    return labels[status] || status || '-';
};

const formatDate = (value, format = 'short') => {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: format === 'long' ? 'long' : 'short',
        year: 'numeric',
    });
};

export default function Index({ krs, stats = {}, prodis = [], tahunAjaranList = [], filters = {} }) {
    const { flash = {} } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [tahunAjaran, setTahunAjaran] = useState(filters.tahun_ajaran || '');
    const [prodi, setProdi] = useState(filters.prodi || '');
    const [semester, setSemester] = useState(filters.semester || '');
    const [status, setStatus] = useState(filters.status || '');
    const isFirstRender = useRef(true);

    const krsData = krs.data || [];
    const hasFilters = Boolean(search || tahunAjaran || prodi || semester || status);
    const tahunOptions = tahunAjaranList.map((item) => ({ value: item, label: item }));
    const prodiOptions = prodis.map((item) => ({ value: item.kode_prodi, label: item.nama_prodi }));

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                route('baak.krs.index'),
                { search, tahun_ajaran: tahunAjaran, prodi, semester, status },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 350);

        return () => clearTimeout(timeout);
    }, [search, tahunAjaran, prodi, semester, status]);

    const handleReset = () => {
        setSearch('');
        setTahunAjaran('');
        setProdi('');
        setSemester('');
        setStatus('');
        router.get(route('baak.krs.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const renderStatus = (item) => (
        <Badge variant="outline" className={getStatusBadge(item.status)}>
            {getStatusLabel(item.status)}
        </Badge>
    );

    const renderAction = (item, compact = false) => (
        <Link href={route('baak.krs.show', item.id_krs)} className={compact ? 'block' : ''}>
            <Button variant={compact ? 'outline' : 'ghost'} size={compact ? 'sm' : 'icon'} className={`${compact ? 'w-full gap-2' : 'h-8 w-8'} text-blue-600`}>
                <Eye className="h-4 w-4" />
                {compact ? 'Lihat Detail' : null}
            </Button>
        </Link>
    );

    const columns = [
        { key: 'number', header: 'No', headerClassName: 'w-[56px]', cellClassName: 'font-medium text-slate-500', render: (_item, index) => (krs.from || 1) + index },
        { key: 'nim', header: 'NIM', render: (item) => <span className="font-mono text-sm font-semibold text-slate-900">{item.mahasiswa?.nim || '-'}</span> },
        {
            key: 'mahasiswa',
            header: 'Mahasiswa',
            render: (item) => (
                <div className="min-w-[200px]">
                    <p className="break-words font-semibold text-slate-900">{item.mahasiswa?.nama || '-'}</p>
                    <p className="text-xs text-slate-500">{item.mahasiswa?.prodi?.nama_prodi || '-'}</p>
                </div>
            ),
        },
        { key: 'semester', header: 'Semester', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <Badge variant="outline" className="bg-slate-50 text-slate-700">Semester {item.semester || '-'}</Badge> },
        { key: 'sks', header: 'SKS', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <Badge variant="outline" className="bg-blue-50 text-blue-700">{item.total_sks || 0} SKS</Badge> },
        { key: 'status', header: 'Status', headerClassName: 'text-center', cellClassName: 'text-center', render: renderStatus },
        { key: 'wali', header: 'Dosen Wali', render: (item) => <span className="break-words text-sm text-slate-700">{item.mahasiswa?.dosen_wali?.nama || '-'}</span> },
        { key: 'tanggal', header: 'Tanggal', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <span className="whitespace-nowrap text-sm text-slate-700">{formatDate(item.tanggal_pengisian)}</span> },
        { key: 'actions', header: 'Aksi', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => renderAction(item) },
    ];

    const renderKrsCard = (item, _index, key) => (
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
                    <p className="text-slate-600"><span className="font-medium text-slate-800">Dosen Wali:</span> {item.mahasiswa?.dosen_wali?.nama || '-'}</p>
                    <p className="text-slate-600"><span className="font-medium text-slate-800">Tanggal:</span> {formatDate(item.tanggal_pengisian, 'long')}</p>
                </div>

                {renderAction(item, true)}
            </CardContent>
        </Card>
    );

    return (
        <BaakLayout title="Monitoring KRS">
            <Head title="Monitoring KRS" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5">
                    <PageHeader title="Monitoring KRS" description="Monitor pengisian KRS mahasiswa berdasarkan periode, prodi, semester, dan status." />

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <SummaryCard title="Total KRS" value={stats.total || 0} icon={FileText} tone="blue" />
                        <SummaryCard title="Pending" value={stats.pending || 0} icon={Clock3} tone="amber" />
                        <SummaryCard title="Disetujui" value={stats.approved || 0} icon={CheckCircle2} tone="emerald" />
                        <SummaryCard title="Ditolak" value={stats.rejected || 0} icon={XCircle} tone="violet" />
                    </div>

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="flex flex-col lg:flex-row gap-3 p-4">
                            <div className="w-full lg:w-[30%]">
                                <SearchInput value={search} onChange={setSearch} onClear={() => setSearch('')} placeholder="Cari NIM atau nama mahasiswa..." />
                            </div>
                            <div className="w-full lg:flex-1">
                                <SelectDropdown value={tahunAjaran} onChange={(selected) => setTahunAjaran(selected ? selected.value : '')} options={tahunOptions} placeholder="Semua Tahun" />
                            </div>
                            <div className="w-full lg:flex-1">
                                <SelectDropdown value={prodi} onChange={(selected) => setProdi(selected ? selected.value : '')} options={prodiOptions} placeholder="Semua Prodi" />
                            </div>
                            <div className="w-full lg:flex-1">
                                <SelectDropdown value={semester} onChange={(selected) => setSemester(selected ? selected.value : '')} options={semesterOptions} placeholder="Semua Semester" isSearchable={false} />
                            </div>
                            <div className="w-full lg:flex-1">
                                <SelectDropdown value={status} onChange={(selected) => setStatus(selected ? selected.value : '')} options={statusOptions} placeholder="Semua Status" isSearchable={false} />
                            </div>
                            {hasFilters && (
                                <div className="w-full lg:w-auto">
                                    <Button type="button" variant="outline" className="w-full lg:w-auto gap-2" onClick={handleReset}>
                                        <RefreshCcw className="h-4 w-4" />
                                        Reset
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <DataTable
                        columns={columns}
                        data={krsData}
                        getRowKey={(item) => item.id_krs}
                        emptyState={<EmptyState title="Tidak ada data KRS" description="KRS belum tersedia atau tidak sesuai filter." />}
                        className="hidden lg:block"
                    />

                    <CardGrid
                        data={krsData}
                        getCardKey={(item) => item.id_krs}
                        renderCard={renderKrsCard}
                        emptyState={<EmptyState title="Tidak ada data KRS" description="KRS belum tersedia atau tidak sesuai filter." compact />}
                        className="grid gap-3 md:grid-cols-2 lg:hidden"
                        emptyClassName="lg:hidden"
                    />

                    <Pagination pagination={krs} />
                </div>
            </div>
        </BaakLayout>
    );
}
