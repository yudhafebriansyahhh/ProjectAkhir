import { useEffect, useRef, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { CheckCircle2, Pencil, Plus, RefreshCcw, Trash2, UserCheck2, Users, XCircle } from 'lucide-react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { CardGrid, DataTable, EmptyState, PageHeader, Pagination, SearchInput, SummaryCard } from '@/Components/ui/data-display';
import { SelectDropdown } from '@/Components/ui/select-dropdown';

const statusOptions = [
    { value: 'aktif', label: 'Aktif' },
    { value: 'cuti', label: 'Cuti' },
];

const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

const statusClass = (status) => status === 'aktif'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : 'border-amber-200 bg-amber-50 text-amber-700';

export default function Index({ registrasi, filters = {}, periodes = [], prodis = [], statistik = [] }) {
    const { flash = {} } = usePage().props;
    const [activeTab, setActiveTab] = useState('monitoring');
    const [search, setSearch] = useState(filters.search || '');
    const [selectedFilters, setSelectedFilters] = useState({
        periode: filters.periode || '',
        prodi: filters.prodi || '',
        status: filters.status || '',
    });
    const isFirstRender = useRef(true);

    const registrasiData = registrasi.data || [];
    const hasFilters = Boolean(search || selectedFilters.periode || selectedFilters.prodi || selectedFilters.status);
    const periodeOptions = periodes.map((periode) => ({
        value: `${periode.tahun_ajaran}-${periode.jenis_semester}`,
        label: `${periode.tahun_ajaran} - ${periode.jenis_semester.charAt(0).toUpperCase() + periode.jenis_semester.slice(1)}`,
    }));
    const prodiOptions = prodis.map((prodi) => ({ value: prodi.kode_prodi, label: prodi.nama_prodi }));

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                route('baak.registrasi-semester.index'),
                { ...selectedFilters, search },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 350);

        return () => clearTimeout(timeout);
    }, [search, selectedFilters]);

    const updateFilter = (key, value) => setSelectedFilters((current) => ({ ...current, [key]: value }));

    const handleReset = () => {
        setSearch('');
        setSelectedFilters({ periode: '', prodi: '', status: '' });
        router.get(route('baak.registrasi-semester.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleDelete = (id) => {
        const destroy = () => router.delete(route('baak.registrasi-semester.destroy', id), { preserveScroll: true });

        if (window.Swal) {
            window.Swal.fire({
                title: 'Hapus Data Registrasi?',
                text: 'Data yang dihapus tidak dapat dikembalikan!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal',
                confirmButtonColor: '#dc2626',
                cancelButtonColor: '#6b7280',
            }).then((result) => {
                if (result.isConfirmed) destroy();
            });
            return;
        }

        if (confirm('Hapus data registrasi?')) destroy();
    };

    const renderActions = (item, compact = false) => {
        if (compact) {
            return (
                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                    <Link href={route('baak.registrasi-semester.edit', item.id_registrasi)}>
                        <Button variant="outline" size="sm" className="w-full gap-1.5 text-amber-600">
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                        </Button>
                    </Link>
                    <Button type="button" variant="outline" size="sm" className="w-full gap-1.5 text-red-600" onClick={() => handleDelete(item.id_registrasi)}>
                        <Trash2 className="h-3.5 w-3.5" />
                        Hapus
                    </Button>
                </div>
            );
        }

        return (
            <div className="flex items-center justify-center gap-1.5">
                <Link href={route('baak.registrasi-semester.edit', item.id_registrasi)}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600" title="Edit">
                        <Pencil className="h-4 w-4" />
                    </Button>
                </Link>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-600" title="Hapus" onClick={() => handleDelete(item.id_registrasi)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        );
    };

    const columns = [
        { key: 'number', header: 'No', headerClassName: 'w-[56px]', cellClassName: 'font-medium text-slate-500', render: (_item, index) => (registrasi.from || 1) + index },
        { key: 'nim', header: 'NIM', render: (item) => <span className="font-mono text-sm font-semibold text-blue-700">{item.mahasiswa?.nim || '-'}</span> },
        { key: 'nama', header: 'Nama Mahasiswa', render: (item) => <span className="break-words font-semibold text-slate-900">{item.mahasiswa?.nama || '-'}</span> },
        { key: 'prodi', header: 'Program Studi', render: (item) => <span className="break-words text-sm text-slate-700">{item.mahasiswa?.prodi?.nama_prodi || '-'}</span> },
        { key: 'semester', header: 'Semester', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <Badge variant="outline" className="bg-violet-50 text-violet-700">Sem {item.semester}</Badge> },
        { key: 'periode', header: 'Periode', render: (item) => <span className="whitespace-nowrap text-sm text-slate-700">{item.tahun_ajaran} - {item.jenis_semester}</span> },
        { key: 'status', header: 'Status', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <Badge variant="outline" className={statusClass(item.status_semester)}>{item.status_semester}</Badge> },
        { key: 'tanggal', header: 'Tanggal', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <span className="whitespace-nowrap text-sm text-slate-700">{formatDate(item.tanggal_registrasi)}</span> },
        { key: 'actions', header: 'Aksi', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => renderActions(item) },
    ];

    const renderCard = (item, _index, key) => (
        <Card key={key} className="rounded-lg border-slate-200 shadow-sm">
            <CardContent className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap gap-2">
                            <Badge variant="outline" className="bg-blue-50 font-mono text-blue-700">{item.mahasiswa?.nim || '-'}</Badge>
                            <Badge variant="outline" className="bg-violet-50 text-violet-700">Sem {item.semester}</Badge>
                        </div>
                        <p className="break-words font-semibold text-slate-950">{item.mahasiswa?.nama || '-'}</p>
                    </div>
                    <Badge variant="outline" className={statusClass(item.status_semester)}>{item.status_semester}</Badge>
                </div>
                <div className="grid gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                    <p><span className="font-medium text-slate-800">Prodi:</span> {item.mahasiswa?.prodi?.nama_prodi || '-'}</p>
                    <p><span className="font-medium text-slate-800">Periode:</span> {item.tahun_ajaran} - {item.jenis_semester}</p>
                    <p><span className="font-medium text-slate-800">Tanggal:</span> {formatDate(item.tanggal_registrasi)}</p>
                </div>
                {renderActions(item, true)}
            </CardContent>
        </Card>
    );

    const tabs = [
        { key: 'monitoring', label: 'Monitoring Registrasi' },
        { key: 'manual', label: 'Registrasi Manual' },
    ];

    return (
        <BaakLayout title="Registrasi Semester">
            <Head title="Registrasi Semester" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5">
                    <PageHeader title="Registrasi Semester Mahasiswa" description="Kelola dan monitor registrasi semester mahasiswa." />

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <SummaryCard title="Total Registrasi" value={registrasi.total || 0} icon={UserCheck2} tone="blue" />
                        <SummaryCard title="Aktif" value={registrasiData.filter((item) => item.status_semester === 'aktif').length} icon={CheckCircle2} tone="emerald" />
                        <SummaryCard title="Cuti" value={registrasiData.filter((item) => item.status_semester === 'cuti').length} icon={XCircle} tone="amber" />
                        <SummaryCard title="Prodi Statistik" value={statistik.length || 0} icon={Users} tone="violet" />
                    </div>

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="p-2">
                            <div className="overflow-x-auto">
                                <div className="flex min-w-max gap-2">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.key}
                                            type="button"
                                            onClick={() => setActiveTab(tab.key)}
                                            className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-semibold transition ${
                                                activeTab === tab.key ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {activeTab === 'monitoring' ? (
                        <>
                            <Card className="rounded-lg border-slate-200 shadow-sm">
                                <CardContent className="grid gap-3 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(180px,1fr)_minmax(180px,1fr)_minmax(150px,0.7fr)_auto]">
                                    <SearchInput value={search} onChange={setSearch} onClear={() => setSearch('')} placeholder="Cari NIM atau nama..." />
                                    <SelectDropdown value={selectedFilters.periode} onChange={(selected) => updateFilter('periode', selected ? selected.value : '')} options={periodeOptions} placeholder="Semua Periode" />
                                    <SelectDropdown value={selectedFilters.prodi} onChange={(selected) => updateFilter('prodi', selected ? selected.value : '')} options={prodiOptions} placeholder="Semua Prodi" />
                                    <SelectDropdown value={selectedFilters.status} onChange={(selected) => updateFilter('status', selected ? selected.value : '')} options={statusOptions} placeholder="Semua Status" isSearchable={false} />
                                    <Button type="button" variant="outline" className="w-full gap-2 lg:w-auto" onClick={handleReset} disabled={!hasFilters}>
                                        <RefreshCcw className="h-4 w-4" />
                                        Reset
                                    </Button>
                                </CardContent>
                            </Card>

                            {statistik.length > 0 ? (
                                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                    {statistik.map((stat, index) => (
                                        <Card key={`${stat.prodi}-${index}`} className="rounded-lg border-slate-200 shadow-sm">
                                            <CardContent className="space-y-3 p-4">
                                                <h3 className="break-words font-semibold text-slate-950">{stat.prodi}</h3>
                                                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                                                    <div className="rounded-lg bg-slate-50 p-2">
                                                        <p className="text-xs text-slate-500">Total</p>
                                                        <p className="font-bold text-slate-950">{stat.total}</p>
                                                    </div>
                                                    <div className="rounded-lg bg-emerald-50 p-2">
                                                        <p className="text-xs text-emerald-600">Sudah</p>
                                                        <p className="font-bold text-emerald-700">{stat.sudah}</p>
                                                    </div>
                                                    <div className="rounded-lg bg-red-50 p-2">
                                                        <p className="text-xs text-red-600">Belum</p>
                                                        <p className="font-bold text-red-700">{stat.belum}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="mb-1 flex justify-between text-xs text-slate-500">
                                                        <span>Persentase</span>
                                                        <span className="font-semibold text-blue-600">{stat.persentase}%</span>
                                                    </div>
                                                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                                        <div className="h-full rounded-full bg-blue-600" style={{ width: `${stat.persentase}%` }} />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : null}

                            <DataTable
                                columns={columns}
                                data={registrasiData}
                                getRowKey={(item) => item.id_registrasi}
                                emptyState={<EmptyState title="Belum ada data registrasi" description="Pilih periode atau ubah filter untuk melihat data registrasi." />}
                                className="hidden lg:block"
                            />

                            <CardGrid
                                data={registrasiData}
                                getCardKey={(item) => item.id_registrasi}
                                renderCard={renderCard}
                                emptyState={<EmptyState title="Belum ada data registrasi" description="Pilih periode atau ubah filter untuk melihat data registrasi." compact />}
                                className="grid gap-3 md:grid-cols-2 lg:hidden"
                                emptyClassName="lg:hidden"
                            />

                            <Pagination pagination={registrasi} />
                        </>
                    ) : (
                        <Card className="rounded-lg border-slate-200 shadow-sm">
                            <CardContent className="space-y-5 p-4 sm:p-5">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-950">Registrasi Manual Mahasiswa</h2>
                                    <p className="mt-1 text-sm text-slate-500">Gunakan untuk kasus mahasiswa yang membutuhkan bantuan registrasi dari BAAK.</p>
                                </div>
                                <Link href={route('baak.registrasi-semester.create')} className="inline-flex w-full sm:w-auto">
                                    <Button className="w-full gap-2 sm:w-auto">
                                        <Plus className="h-4 w-4" />
                                        Registrasi Manual Baru
                                    </Button>
                                </Link>
                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                                    <p className="font-semibold text-blue-900">Kapan menggunakan registrasi manual?</p>
                                    <p className="mt-2">Untuk mahasiswa yang lupa registrasi, tidak bisa mengakses sistem, kasus darurat, atau koreksi data registrasi.</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </BaakLayout>
    );
}
