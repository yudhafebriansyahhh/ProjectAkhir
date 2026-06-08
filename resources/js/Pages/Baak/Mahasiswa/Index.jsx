import { useEffect, useRef, useState } from 'react';
import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Download,
    Eye,
    FileSpreadsheet,
    GraduationCap,
    Loader2,
    Pencil,
    RotateCcw,
    Trash2,
    Upload,
    UserCheck,
    Users,
    Wand2,
} from 'lucide-react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import {
    CardGrid,
    DataTable,
    EmptyState,
    PageHeader,
    Pagination,
    SearchInput,
    SummaryCard,
} from '@/Components/ui/data-display';
import { SelectDropdown } from '@/Components/ui/select-dropdown';
import Modal from '@/Components/Modal';

const statusOptions = [
    { value: 'aktif', label: 'Aktif' },
    { value: 'lulus', label: 'Lulus' },
    { value: 'keluar', label: 'Keluar' },
    { value: 'DO', label: 'DO' },
];

const getStatusBadge = (status) => {
    const badges = {
        aktif: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        lulus: 'bg-blue-50 text-blue-700 border-blue-200',
        keluar: 'bg-amber-50 text-amber-700 border-amber-200',
        DO: 'bg-red-50 text-red-700 border-red-200',
    };

    return badges[status] || 'bg-slate-50 text-slate-700 border-slate-200';
};

const getAngkatan = (mahasiswa) => mahasiswa.tahun_masuk || (mahasiswa.nim ? `20${mahasiswa.nim.substring(0, 2)}` : '-');

export default function Index({ mahasiswas, prodis = [], filters = {}, mahasiswaTanpaNimCount = 0, stats }) {
    const { flash = {} } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [selectedProdi, setSelectedProdi] = useState(filters.kode_prodi || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [sortField, setSortField] = useState(filters.sort_field || 'created_at');
    const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'desc');
    const [nimGenerating, setNimGenerating] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const isFirstRender = useRef(true);

    const { data, setData, post, processing, errors, reset } = useForm({
        file: null,
    });

    const handleImportSubmit = (e) => {
        e.preventDefault();
        post(route('baak.mahasiswa.import'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsImportModalOpen(false);
                reset('file');
            },
        });
    };

    const mahasiswaData = mahasiswas.data || [];
    const hasFilters = search || selectedProdi || selectedStatus || sortField !== 'created_at';
    const prodiOptions = prodis.map((prodi) => ({ value: prodi.kode_prodi, label: prodi.nama_prodi }));

    const summaryCards = [
        {
            title: 'Total Mahasiswa',
            value: stats?.total ?? mahasiswas.total ?? mahasiswaData.length,
            icon: Users,
            tone: 'blue',
        },
        {
            title: 'Aktif',
            value: stats?.aktif ?? mahasiswaData.filter((mahasiswa) => mahasiswa.status === 'aktif').length,
            icon: UserCheck,
            tone: 'emerald',
        },
        {
            title: 'Lulus',
            value: stats?.lulus ?? mahasiswaData.filter((mahasiswa) => mahasiswa.status === 'lulus').length,
            icon: GraduationCap,
            tone: 'violet',
        },
        {
            title: 'Nonaktif',
            value: stats?.nonaktif ?? mahasiswaData.filter((mahasiswa) => mahasiswa.status !== 'aktif').length,
            icon: AlertCircle,
            tone: 'amber',
        },
    ];

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                route('baak.mahasiswa.index'),
                {
                    search,
                    kode_prodi: selectedProdi,
                    status: selectedStatus,
                    sort_field: sortField,
                    sort_direction: sortDirection,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, selectedProdi, selectedStatus, sortField, sortDirection]);

    const handleSort = (field) => {
        const isAsc = sortField === field && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setSortField(field);
    };

    const SortableHeader = ({ field, label, justify = 'start' }) => (
        <button
            type="button"
            onClick={() => handleSort(field)}
            className={`flex w-full items-center gap-1 hover:text-slate-700 ${
                justify === 'center' ? 'justify-center' : 'justify-start'
            }`}
        >
            {label}
            {sortField === field ? (
                sortDirection === 'asc' ? (
                    <ArrowUp className="h-3.5 w-3.5" />
                ) : (
                    <ArrowDown className="h-3.5 w-3.5" />
                )
            ) : (
                <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-50" />
            )}
        </button>
    );

    const handleReset = () => {
        setSearch('');
        setSelectedProdi('');
        setSelectedStatus('');
        setSortField('created_at');
        setSortDirection('desc');
        router.get(route('baak.mahasiswa.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleGenerateNim = () => {
        const confirmAction = () => {
            setNimGenerating(true);
            router.post(route('baak.mahasiswa.generate-nim'), {}, {
                preserveScroll: true,
                onFinish: () => setNimGenerating(false),
            });
        };

        if (window.Swal) {
            window.Swal.fire({
                title: 'Generate NIM?',
                html: `<p>Akan men-generate NIM untuk <strong>${mahasiswaTanpaNimCount} mahasiswa</strong> yang belum memiliki NIM.</p>
                       <p class="mt-2 text-sm text-gray-500">NIM akan di-generate berdasarkan tahun masuk, kode prodi, dan urutan nama secara alfabet.</p>`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Ya, Generate!',
                cancelButtonText: 'Batal',
                confirmButtonColor: '#2563eb',
            }).then((result) => {
                if (result.isConfirmed) {
                    confirmAction();
                }
            });

            return;
        }

        if (confirm(`Yakin ingin generate NIM untuk ${mahasiswaTanpaNimCount} mahasiswa?`)) {
            confirmAction();
        }
    };

    const handleDelete = (id, nama) => {
        if (window.Swal) {
            window.Swal.fire({
                title: 'Hapus Mahasiswa?',
                text: `Data mahasiswa "${nama}" akan dihapus permanen.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal',
                confirmButtonColor: '#dc2626',
                cancelButtonColor: '#6b7280',
            }).then((result) => {
                if (result.isConfirmed) {
                    router.delete(route('baak.mahasiswa.destroy', id), {
                        preserveScroll: true,
                    });
                }
            });

            return;
        }

        if (confirm(`Yakin ingin menghapus data mahasiswa "${nama}"?`)) {
            router.delete(route('baak.mahasiswa.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const renderIdentity = (mahasiswa) => (
        <div className="min-w-0">
            <p className="break-words text-sm font-semibold text-slate-900">{mahasiswa.nama}</p>
        </div>
    );

    const renderActions = (mahasiswa, compact = false) => {
        if (compact) {
            return (
                <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
                    <Link href={route('baak.mahasiswa.show', mahasiswa.id_mahasiswa)} className="min-w-0">
                        <Button variant="outline" size="sm" className="w-full gap-1.5 border-blue-200 text-blue-600 hover:bg-blue-50">
                            <Eye className="h-3.5 w-3.5" />
                            <span>Detail</span>
                        </Button>
                    </Link>
                    <Link href={route('baak.mahasiswa.edit', mahasiswa.id_mahasiswa)} className="min-w-0">
                        <Button variant="outline" size="sm" className="w-full gap-1.5 border-amber-200 text-amber-600 hover:bg-amber-50">
                            <Pencil className="h-3.5 w-3.5" />
                            <span>Edit</span>
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(mahasiswa.id_mahasiswa, mahasiswa.nama)}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Hapus</span>
                    </Button>
                </div>
            );
        }

        return (
            <div className="flex items-center justify-center gap-1.5">
                <Link href={route('baak.mahasiswa.show', mahasiswa.id_mahasiswa)}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700" title="Detail">
                        <Eye className="h-4 w-4" />
                    </Button>
                </Link>
                <Link href={route('baak.mahasiswa.edit', mahasiswa.id_mahasiswa)}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:bg-amber-50 hover:text-amber-700" title="Edit">
                        <Pencil className="h-4 w-4" />
                    </Button>
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleDelete(mahasiswa.id_mahasiswa, mahasiswa.nama)}
                    title="Hapus"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        );
    };

    const mahasiswaColumns = [
        {
            key: 'number',
            header: 'No',
            headerClassName: 'w-[56px]',
            cellClassName: 'font-medium text-slate-500',
            render: (_mahasiswa, index) => (mahasiswas.from || 1) + index,
        },
        {
            key: 'nim',
            header: <SortableHeader field="nim" label="NIM" />,
            headerClassName: 'w-[160px]',
            render: (mahasiswa) =>
                mahasiswa.nim ? (
                    <Badge variant="outline" className="bg-blue-50 font-mono text-blue-700">
                        {mahasiswa.nim}
                    </Badge>
                ) : (
                    <Badge variant="outline" className="gap-1 bg-amber-50 text-amber-700 border-amber-200">
                        <AlertCircle className="h-3 w-3" />
                        Belum ada NIM
                    </Badge>
                ),
        },
        {
            key: 'nama',
            header: <SortableHeader field="nama" label="Mahasiswa" />,
            render: renderIdentity,
        },
        {
            key: 'prodi',
            header: 'Program Studi',
            render: (mahasiswa) => (
                <span className="break-words text-sm text-slate-700">{mahasiswa.prodi?.nama_prodi || '-'}</span>
            ),
        },
        {
            key: 'angkatan',
            header: <SortableHeader field="tahun_masuk" label="Angkatan" justify="center" />,
            headerClassName: 'text-center',
            cellClassName: 'text-center',
            render: getAngkatan,
        },
        {
            key: 'dosen_wali',
            header: 'Dosen Wali',
            render: (mahasiswa) => mahasiswa.dosen_wali?.nama || '-',
        },
        {
            key: 'status',
            header: 'Status',
            headerClassName: 'text-center',
            cellClassName: 'text-center',
            render: (mahasiswa) => (
                <Badge variant="outline" className={getStatusBadge(mahasiswa.status)}>
                    {mahasiswa.status?.toUpperCase() || '-'}
                </Badge>
            ),
        },
        {
            key: 'actions',
            header: 'Aksi',
            headerClassName: 'w-[160px] text-center',
            render: (mahasiswa) => renderActions(mahasiswa),
        },
    ];

    const renderMahasiswaCard = (mahasiswa, _index, key) => (
        <Card key={key} className="min-w-0 overflow-hidden rounded-lg border-slate-200 shadow-sm transition hover:shadow-md">
            <CardContent className="space-y-3 p-4">
                <div className="flex min-w-0 items-start justify-between gap-3">
                    {renderIdentity(mahasiswa)}
                    <Badge variant="outline" className={`shrink-0 ${getStatusBadge(mahasiswa.status)}`}>
                        {mahasiswa.status?.toUpperCase() || '-'}
                    </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3 text-sm">
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-400">Angkatan</p>
                        <p className="mt-1 font-semibold text-slate-800">{getAngkatan(mahasiswa)}</p>
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-400">Dosen Wali</p>
                        <p className="mt-1 truncate font-semibold text-slate-800">{mahasiswa.dosen_wali?.nama || '-'}</p>
                    </div>
                    <div className="col-span-2 min-w-0">
                        <p className="text-xs font-medium text-slate-400">Program Studi</p>
                        <p className="mt-1 break-words font-semibold text-slate-800">{mahasiswa.prodi?.nama_prodi || '-'}</p>
                    </div>
                </div>

                {renderActions(mahasiswa, true)}
            </CardContent>
        </Card>
    );

    const emptyState = <EmptyState title="Tidak ada data" description="Belum ada mahasiswa yang terdaftar" />;

    return (
        <BaakLayout title="Data Mahasiswa">
            <Head title="Data Mahasiswa" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5">
                    <PageHeader
                        title="Data Mahasiswa"
                        description="Kelola data mahasiswa di sistem akademik."
                        actionHref={route('baak.mahasiswa.create')}
                        actionLabel="Tambah Mahasiswa"
                    >
                        <a href={route('baak.mahasiswa.export')} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full gap-2 text-slate-700 sm:w-auto">
                                <Download className="h-4 w-4" />
                                Export Excel
                            </Button>
                        </a>
                        <Button 
                            variant="outline" 
                            className="w-full gap-2 text-emerald-700 sm:w-auto"
                            onClick={() => setIsImportModalOpen(true)}
                        >
                            <Upload className="h-4 w-4" />
                            Import Excel
                        </Button>
                    </PageHeader>

                    {mahasiswaTanpaNimCount > 0 ? (
                        <Card className="rounded-lg border-amber-200 bg-amber-50 shadow-sm">
                            <CardContent className="grid gap-3 p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-amber-800">{mahasiswaTanpaNimCount} mahasiswa belum memiliki NIM</p>
                                    <p className="mt-0.5 text-xs text-amber-700">
                                        Generate NIM berdasarkan tahun masuk, kode prodi, dan urutan nama secara alfabet.
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    onClick={handleGenerateNim}
                                    disabled={nimGenerating}
                                    className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 sm:w-auto"
                                >
                                    {nimGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                                    <span>{nimGenerating ? 'Generating...' : 'Generate NIM'}</span>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : null}

                    <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                        {summaryCards.map((card) => (
                            <SummaryCard key={card.title} {...card} />
                        ))}
                    </section>

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="space-y-3 p-4">
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_260px_180px_auto]">
                                <SearchInput
                                    value={search}
                                    onChange={setSearch}
                                    onClear={() => setSearch('')}
                                    placeholder="Cari nama atau NIM..."
                                />
                                <SelectDropdown
                                    value={selectedProdi}
                                    onChange={(selected) => setSelectedProdi(selected ? selected.value : '')}
                                    options={prodiOptions}
                                    placeholder="Semua Prodi"
                                />
                                <SelectDropdown
                                    value={selectedStatus}
                                    onChange={(selected) => setSelectedStatus(selected ? selected.value : '')}
                                    options={statusOptions}
                                    placeholder="Semua Status"
                                    isSearchable={false}
                                />
                                <div className="grid gap-2 sm:col-span-2 sm:flex sm:justify-end lg:col-span-1">
                                    {hasFilters ? (
                                        <Button type="button" variant="outline" className="gap-2" onClick={handleReset}>
                                            <RotateCcw className="h-4 w-4" />
                                            <span>Reset</span>
                                        </Button>
                                    ) : null}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <DataTable
                        columns={mahasiswaColumns}
                        data={mahasiswaData}
                        getRowKey={(mahasiswa) => mahasiswa.id_mahasiswa}
                        emptyState={emptyState}
                        className="hidden lg:block"
                    />
                    <CardGrid
                        data={mahasiswaData}
                        getCardKey={(mahasiswa) => mahasiswa.id_mahasiswa}
                        renderCard={renderMahasiswaCard}
                        emptyState={<EmptyState title="Tidak ada data" description="Belum ada mahasiswa yang terdaftar" compact />}
                        className="grid gap-3 md:grid-cols-2 lg:hidden"
                        emptyClassName="lg:hidden"
                    />
                    <Pagination pagination={mahasiswas} />
                </div>
            </div>

            <Modal show={isImportModalOpen} onClose={() => setIsImportModalOpen(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-slate-900">Import Data Mahasiswa</h2>
                    <p className="mt-1 text-sm text-slate-600">
                        Pilih file Excel (.xlsx) atau CSV yang berisi data mahasiswa untuk diunggah.
                        Belum punya template?{' '}
                        <a href={route('baak.mahasiswa.export-template')} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-medium">
                            Unduh Template Excel
                        </a>
                    </p>

                    <form onSubmit={handleImportSubmit} className="mt-6 space-y-4">
                        <div>
                            <input
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                onChange={(e) => setData('file', e.target.files[0])}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {errors.file && <p className="mt-2 text-sm text-red-600">{errors.file}</p>}
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsImportModalOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing || !data.file} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                {processing ? 'Mengunggah...' : 'Import Data'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </BaakLayout>
    );
}
