import { useEffect, useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AlertCircle, ArrowDown, ArrowUp, ArrowUpDown, Clock3, Eye, RefreshCcw, UserCheck, Users } from 'lucide-react';
import DosenLayout from '@/Layouts/DosenLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { CardGrid, DataTable, EmptyState, PageHeader, Pagination, SearchInput, SummaryCard } from '@/Components/ui/data-display';
import { SelectDropdown } from '@/Components/ui/select-dropdown';

const statusOptions = [
    { value: 'aktif', label: 'Aktif' },
    { value: 'lulus', label: 'Lulus' },
    { value: 'keluar', label: 'Keluar' },
    { value: 'DO', label: 'DO' },
];

const getStatusBadge = (status) => ({
    aktif: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    lulus: 'border-blue-200 bg-blue-50 text-blue-700',
    keluar: 'border-amber-200 bg-amber-50 text-amber-700',
    DO: 'border-red-200 bg-red-50 text-red-700',
}[status] || 'border-slate-200 bg-slate-50 text-slate-700');



const getAngkatan = (item) => item.tahun_masuk || (item.nim ? `20${item.nim.substring(0, 2)}` : '-');

export default function Index({ mahasiswa, stats = {}, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [sortField, setSortField] = useState(filters.sort_field || 'nama');
    const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'asc');
    const isFirstRender = useRef(true);
    const mahasiswaData = mahasiswa.data || [];
    const hasFilters = Boolean(search || selectedStatus || sortField !== 'nama' || sortDirection !== 'asc');

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                route('dosen.mahasiswa-wali.index'),
                { search, status: selectedStatus, sort_field: sortField, sort_direction: sortDirection },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 350);

        return () => clearTimeout(timeout);
    }, [search, selectedStatus, sortField, sortDirection]);

    const resetFilters = () => {
        setSearch('');
        setSelectedStatus('');
        setSortField('nama');
        setSortDirection('asc');
        router.get(route('dosen.mahasiswa-wali.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleSort = (field) => {
        const isAsc = sortField === field && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setSortField(field);
    };

    const SortableHeader = ({ field, label, justify = 'start' }) => (
        <button
            type="button"
            onClick={() => handleSort(field)}
            className={`flex w-full items-center gap-1 hover:text-slate-700 ${justify === 'center' ? 'justify-center' : 'justify-start'}`}
        >
            {label}
            {sortField === field ? (
                sortDirection === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
            ) : (
                <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-50" />
            )}
        </button>
    );



    const renderAction = (item, compact = false) => (
        <Link href={route('dosen.mahasiswa-wali.show', item.id_mahasiswa)} className={compact ? 'block' : ''}>
            <Button type="button" variant={compact ? 'outline' : 'ghost'} size={compact ? 'sm' : 'icon'} className={`${compact ? 'w-full gap-2' : 'h-8 w-8'} text-blue-600`}>
                <Eye className="h-4 w-4" />
                {compact ? 'Lihat Detail' : null}
            </Button>
        </Link>
    );

    const columns = [
        { key: 'number', header: 'No', headerClassName: 'w-[56px]', cellClassName: 'font-medium text-slate-500', render: (_item, index) => (mahasiswa.from || 1) + index },
        {
            key: 'nim',
            header: <SortableHeader field="nim" label="NIM" />,
            headerClassName: 'w-[160px]',
            render: (item) => item.nim ? (
                <Badge variant="outline" className="bg-blue-50 font-mono text-blue-700">{item.nim}</Badge>
            ) : (
                <Badge variant="outline" className="gap-1 border-amber-200 bg-amber-50 text-amber-700">
                    <AlertCircle className="h-3 w-3" />
                    Belum ada NIM
                </Badge>
            ),
        },
        {
            key: 'nama',
            header: <SortableHeader field="nama" label="Mahasiswa" />,
            render: (item) => (
                <div className="min-w-[220px]">
                    <p className="break-words font-semibold text-slate-900">{item.nama || '-'}</p>
                    <p className="text-xs text-slate-500">Angkatan {getAngkatan(item)}</p>
                </div>
            ),
        },
        { key: 'prodi', header: 'Program Studi', render: (item) => <span className="break-words text-sm text-slate-700">{item.prodi?.nama_prodi || '-'}</span> },
        {
            key: 'angkatan',
            header: <SortableHeader field="tahun_masuk" label="Angkatan" justify="center" />,
            headerClassName: 'text-center',
            cellClassName: 'text-center',
            render: getAngkatan,
        },
        { key: 'status', header: 'Status', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <Badge variant="outline" className={getStatusBadge(item.status)}>{item.status?.toUpperCase() || '-'}</Badge> },
        { key: 'actions', header: 'Aksi', headerClassName: 'w-[100px] text-center', cellClassName: 'text-center', render: (item) => renderAction(item) },
    ];

    const renderCard = (item, _index, key) => (
        <Card key={key} className="rounded-lg border-slate-200 shadow-sm">
            <CardContent className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="break-words font-semibold text-slate-950">{item.nama || '-'}</p>
                        <p className="font-mono text-sm text-slate-500">{item.nim || '-'}</p>
                    </div>
                    <Badge variant="outline" className={getStatusBadge(item.status)}>{item.status || '-'}</Badge>
                </div>
                <div className="grid gap-2 rounded-lg bg-slate-50 p-3 text-sm">
                    <p className="text-slate-600"><span className="font-medium text-slate-800">Prodi:</span> {item.prodi?.nama_prodi || '-'}</p>
                    <p className="text-slate-600"><span className="font-medium text-slate-800">Angkatan:</span> {getAngkatan(item)}</p>
                </div>
                {renderAction(item, true)}
            </CardContent>
        </Card>
    );

    return (
        <DosenLayout title="Mahasiswa Wali">
            <Head title="Mahasiswa Wali" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5">
                    <PageHeader title="Mahasiswa Wali" description="Daftar mahasiswa yang berada di bawah bimbingan akademik Anda." />

                    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                        <SummaryCard title="Total Mahasiswa Wali" value={stats.total || 0} icon={Users} tone="blue" />
                        <SummaryCard title="Mahasiswa Aktif" value={stats.aktif || 0} icon={UserCheck} tone="emerald" />
                        <SummaryCard title="Mahasiswa Nonaktif" value={stats.nonaktif || 0} icon={AlertCircle} tone="violet" />
                    </div>

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="space-y-3 p-4">
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
                                <SearchInput value={search} onChange={setSearch} onClear={() => setSearch('')} placeholder="Cari NIM atau nama mahasiswa..." />
                                <SelectDropdown
                                    value={selectedStatus}
                                    onChange={(selected) => setSelectedStatus(selected ? selected.value : '')}
                                    options={statusOptions}
                                    placeholder="Semua Status"
                                    isSearchable={false}
                                />
                                <div className="grid gap-2 sm:col-span-2 sm:flex sm:justify-end lg:col-span-1">
                                    {hasFilters ? (
                                        <Button type="button" variant="outline" className="gap-2" onClick={resetFilters}>
                                            <RefreshCcw className="h-4 w-4" />
                                            <span>Reset</span>
                                        </Button>
                                    ) : null}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <DataTable
                        columns={columns}
                        data={mahasiswaData}
                        getRowKey={(item) => item.id_mahasiswa}
                        emptyState={<EmptyState title="Tidak ada mahasiswa wali" description="Belum ada mahasiswa yang terhubung sebagai mahasiswa wali Anda." />}
                        className="hidden lg:block"
                    />

                    <CardGrid
                        data={mahasiswaData}
                        getCardKey={(item) => item.id_mahasiswa}
                        renderCard={renderCard}
                        emptyState={<EmptyState title="Tidak ada mahasiswa wali" description="Belum ada mahasiswa yang terhubung sebagai mahasiswa wali Anda." compact />}
                        className="grid gap-3 md:grid-cols-2 lg:hidden"
                        emptyClassName="lg:hidden"
                    />

                    <Pagination pagination={mahasiswa} />
                </div>
            </div>
        </DosenLayout>
    );
}
