import { useState, useEffect, useRef } from 'react';
import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import {
    BookOpen,
    CheckCircle2,
    Download,
    Eye,
    Filter,
    GraduationCap,
    Hash,
    Layers,
    Pencil,
    RotateCcw,
    ToggleLeft,
    ToggleRight,
    Trash2,
    Upload,
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
import Modal from '@/Components/Modal';
import { SelectDropdown } from '@/Components/ui/select-dropdown';

const kategoriOptions = [
    { value: 'wajib', label: 'Wajib' },
    { value: 'pilihan', label: 'Pilihan' },
    { value: 'umum', label: 'Umum' },
];

const statusOptions = [
    { value: '1', label: 'Aktif' },
    { value: '0', label: 'Nonaktif' },
];

const getKategoriBadge = (kategori) => {
    const badges = {
        wajib: 'bg-rose-50 text-rose-700 border-rose-200',
        pilihan: 'bg-sky-50 text-sky-700 border-sky-200',
        umum: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };

    return badges[kategori] || 'bg-slate-50 text-slate-700 border-slate-200';
};

const getStatusBadge = (isActive) =>
    isActive
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
        : 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100';

export default function Index({ mata_kuliah, prodi_list = [], stats, filters = {} }) {
    const { flash = {} } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [prodi, setProdi] = useState(filters.prodi || '');
    const [kategori, setKategori] = useState(filters.kategori || '');
    const [status, setStatus] = useState(filters.status || '');
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        file: null,
    });

    const handleImportSubmit = (e) => {
        e.preventDefault();
        post(route('baak.mata-kuliah.import'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsImportModalOpen(false);
                reset('file');
            },
        });
    };

    const mataKuliahData = mata_kuliah.data || [];
    const hasFilters = search || prodi || kategori || status;
    const prodiOptions = [...prodi_list.map((item) => ({ value: item.kode_prodi, label: item.nama_prodi })),
    ];

    const summaryCards = [
        {
            title: 'Total MK',
            value: stats?.total ?? mata_kuliah.total ?? 0,
            icon: BookOpen,
            tone: 'blue',
        },
        {
            title: 'MK Aktif',
            value: stats?.aktif ?? mataKuliahData.filter((item) => item.is_active).length,
            icon: CheckCircle2,
            tone: 'emerald',
        },
        {
            title: 'MK Wajib',
            value: stats?.wajib ?? mataKuliahData.filter((item) => item.kategori === 'wajib').length,
            icon: Hash,
            tone: 'amber',
        },
        {
            title: 'Total Kelas',
            value: stats?.total_kelas ?? mataKuliahData.reduce((sum, item) => sum + (item.kelas_count || 0), 0),
            icon: Layers,
            tone: 'violet',
        },
    ];

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                route('baak.mata-kuliah.index'),
                { search, prodi, kategori, status },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, prodi, kategori, status]);

    const handleReset = () => {
        setSearch('');
        setProdi('');
        setKategori('');
        setStatus('');
        router.get(route('baak.mata-kuliah.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleDelete = (kodeMatkul, namaMatkul) => {
        if (window.Swal) {
            window.Swal.fire({
                title: 'Hapus Mata Kuliah?',
                text: `Apakah Anda yakin ingin menghapus mata kuliah "${namaMatkul}"?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc2626',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal',
            }).then((result) => {
                if (result.isConfirmed) {
                    router.delete(route('baak.mata-kuliah.destroy', kodeMatkul), {
                        preserveScroll: true,
                    });
                }
            });

            return;
        }

        if (confirm(`Apakah Anda yakin ingin menghapus mata kuliah "${namaMatkul}"?`)) {
            router.delete(route('baak.mata-kuliah.destroy', kodeMatkul), {
                preserveScroll: true,
            });
        }
    };

    const handleToggleStatus = (kodeMatkul, namaMatkul, isActive) => {
        const action = isActive ? 'nonaktifkan' : 'aktifkan';

        if (window.Swal) {
            window.Swal.fire({
                title: `${action.charAt(0).toUpperCase() + action.slice(1)} Mata Kuliah?`,
                text: `Apakah Anda yakin ingin ${action} mata kuliah "${namaMatkul}"?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: isActive ? '#dc2626' : '#10b981',
                cancelButtonColor: '#6b7280',
                confirmButtonText: `Ya, ${action.charAt(0).toUpperCase() + action.slice(1)}!`,
                cancelButtonText: 'Batal',
            }).then((result) => {
                if (result.isConfirmed) {
                    router.post(route('baak.mata-kuliah.toggle-status', kodeMatkul), {}, { preserveScroll: true });
                }
            });

            return;
        }

        if (confirm(`Apakah Anda yakin ingin ${action} mata kuliah "${namaMatkul}"?`)) {
            router.post(route('baak.mata-kuliah.toggle-status', kodeMatkul), {}, { preserveScroll: true });
        }
    };

    const renderIdentity = (item) => (
        <div className="min-w-0">
            <p className="break-words text-sm font-semibold text-slate-900">{item.nama_matkul}</p>
        </div>
    );

    const renderProdi = (item) =>
        item.prodi ? (
            <span className="inline-flex min-w-0 items-center gap-1.5 text-sm text-slate-700">
                <GraduationCap className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="break-words">{item.prodi.nama_prodi}</span>
            </span>
        ) : (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                Mata Kuliah Umum
            </Badge>
        );

    const renderStatus = (item, compact = false) => (
        <button
            type="button"
            onClick={() => handleToggleStatus(item.kode_matkul, item.nama_matkul, item.is_active)}
            className={`inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition ${getStatusBadge(item.is_active)}`}
            title={item.is_active ? 'Nonaktifkan' : 'Aktifkan'}
        >
            {item.is_active ? <ToggleRight className="h-3.5 w-3.5" /> : <ToggleLeft className="h-3.5 w-3.5" />}
            {item.is_active ? 'AKTIF' : compact ? 'NON' : 'NONAKTIF'}
        </button>
    );

    const renderActions = (item, compact = false) => {
        if (compact) {
            return (
                <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
                    <Link href={route('baak.mata-kuliah.show', item.kode_matkul)} className="min-w-0">
                        <Button variant="outline" size="sm" className="w-full gap-1.5 border-blue-200 text-blue-600 hover:bg-blue-50">
                            <Eye className="h-3.5 w-3.5" />
                            <span>Detail</span>
                        </Button>
                    </Link>
                    <Link href={route('baak.mata-kuliah.edit', item.kode_matkul)} className="min-w-0">
                        <Button variant="outline" size="sm" className="w-full gap-1.5 border-amber-200 text-amber-600 hover:bg-amber-50">
                            <Pencil className="h-3.5 w-3.5" />
                            <span>Edit</span>
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(item.kode_matkul, item.nama_matkul)}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Hapus</span>
                    </Button>
                </div>
            );
        }

        return (
            <div className="flex items-center justify-center gap-1.5">
                <Link href={route('baak.mata-kuliah.show', item.kode_matkul)}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700" title="Detail">
                        <Eye className="h-4 w-4" />
                    </Button>
                </Link>
                <Link href={route('baak.mata-kuliah.edit', item.kode_matkul)}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:bg-amber-50 hover:text-amber-700" title="Edit">
                        <Pencil className="h-4 w-4" />
                    </Button>
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleDelete(item.kode_matkul, item.nama_matkul)}
                    title="Hapus"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        );
    };

    const mataKuliahColumns = [
        {
            key: 'number',
            header: 'No',
            headerClassName: 'w-[56px]',
            cellClassName: 'font-medium text-slate-500',
            render: (_item, index) => (mata_kuliah.from || 1) + index,
        },
        {
            key: 'kode_matkul',
            header: 'Kode MK',
            headerClassName: 'w-[140px]',
            render: (item) => (
                <Badge variant="outline" className="bg-blue-50 font-mono text-blue-700">
                    {item.kode_matkul}
                </Badge>
            ),
        },
        {
            key: 'nama_matkul',
            header: 'Nama Mata Kuliah',
            render: renderIdentity,
        },
        {
            key: 'sks',
            header: 'SKS',
            headerClassName: 'text-center w-[72px]',
            cellClassName: 'text-center',
            render: (item) => (
                <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-slate-50 px-2 text-sm font-bold text-slate-700">
                    {item.sks}
                </span>
            ),
        },
        {
            key: 'prodi',
            header: 'Program Studi',
            render: renderProdi,
        },
        {
            key: 'kategori',
            header: 'Kategori',
            headerClassName: 'text-center',
            cellClassName: 'text-center',
            render: (item) => (
                <Badge variant="outline" className={getKategoriBadge(item.kategori)}>
                    {item.kategori?.toUpperCase() || '-'}
                </Badge>
            ),
        },
        {
            key: 'kelas_count',
            header: 'Kelas',
            headerClassName: 'text-center',
            cellClassName: 'text-center',
            render: (item) => (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-2.5 py-1 text-sm font-medium text-violet-700">
                    <Layers className="h-3.5 w-3.5" />
                    {item.kelas_count || 0}
                </span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            headerClassName: 'text-center',
            cellClassName: 'text-center',
            render: (item) => renderStatus(item),
        },
        {
            key: 'actions',
            header: 'Aksi',
            headerClassName: 'w-[160px] text-center',
            render: (item) => renderActions(item),
        },
    ];

    const renderMataKuliahCard = (item, _index, key) => (
        <Card key={key} className="min-w-0 overflow-hidden rounded-lg border-slate-200 shadow-sm transition hover:shadow-md">
            <CardContent className="space-y-3 p-4">
                <div className="flex min-w-0 items-start justify-between gap-3">
                    {renderIdentity(item)}
                    <div className="shrink-0">{renderStatus(item, true)}</div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                    <Badge variant="outline" className="bg-blue-50 font-mono text-blue-700">
                        {item.kode_matkul}
                    </Badge>
                    <Badge variant="outline" className={getKategoriBadge(item.kategori)}>
                        {item.kategori?.toUpperCase() || '-'}
                    </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3 text-sm">
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-400">SKS</p>
                        <p className="mt-1 font-semibold text-slate-800">{item.sks} SKS</p>
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-400">Kelas</p>
                        <p className="mt-1 inline-flex items-center gap-1.5 font-semibold text-slate-800">
                            <Layers className="h-3.5 w-3.5 text-slate-400" />
                            {item.kelas_count || 0}
                        </p>
                    </div>
                    <div className="col-span-2 min-w-0">
                        <p className="text-xs font-medium text-slate-400">Program Studi</p>
                        <div className="mt-1">{renderProdi(item)}</div>
                    </div>
                </div>

                {renderActions(item, true)}
            </CardContent>
        </Card>
    );

    const emptyState = <EmptyState title="Tidak ada data" description="Belum ada mata kuliah yang terdaftar" />;

    return (
        <BaakLayout title="Data Mata Kuliah">
            <Head title="Data Mata Kuliah" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5">
                    <PageHeader
                        title="Data Mata Kuliah"
                        description="Kelola data mata kuliah di sistem akademik."
                        actionHref={route('baak.mata-kuliah.create')}
                        actionLabel="Tambah Mata Kuliah"
                    >
                        <a href={route('baak.mata-kuliah.export')} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
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

                    <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                        {summaryCards.map((card) => (
                            <SummaryCard key={card.title} {...card} />
                        ))}
                    </section>

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="p-4">
                            <div className="lg:hidden">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full gap-2"
                                    onClick={() => setShowMobileFilter(!showMobileFilter)}
                                >
                                    <Filter className="h-4 w-4" />
                                    <span>{showMobileFilter ? 'Sembunyikan Filter' : 'Filter Pencarian'}</span>
                                </Button>
                            </div>
                            <div className={`space-y-3 ${showMobileFilter ? 'mt-4 block' : 'hidden'} lg:mt-0 lg:block`}>
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
                                    <SearchInput
                                        value={search}
                                        onChange={setSearch}
                                        onClear={() => setSearch('')}
                                        placeholder="Cari kode atau nama..."
                                    />
                                    <SelectDropdown
                                        value={prodi}
                                        onChange={(selected) => setProdi(selected ? selected.value : '')}
                                        options={prodiOptions}
                                        placeholder="Semua Prodi"
                                    />
                                    <SelectDropdown
                                        value={kategori}
                                        onChange={(selected) => setKategori(selected ? selected.value : '')}
                                        options={kategoriOptions}
                                        placeholder="Semua Kategori"
                                        isSearchable={false}
                                    />
                                    <SelectDropdown
                                        value={status}
                                        onChange={(selected) => setStatus(selected ? selected.value : '')}
                                        options={statusOptions}
                                        placeholder="Semua Status"
                                        isSearchable={false}
                                    />
                                </div>
                                {hasFilters && (
                                    <div className="flex justify-end">
                                        <Button type="button" variant="outline" className="gap-2" onClick={handleReset}>
                                            <RotateCcw className="h-4 w-4" />
                                            <span>Reset Filter</span>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <DataTable
                        columns={mataKuliahColumns}
                        data={mataKuliahData}
                        getRowKey={(item) => item.kode_matkul}
                        emptyState={emptyState}
                        className="hidden lg:block"
                    />
                    <CardGrid
                        data={mataKuliahData}
                        getCardKey={(item) => item.kode_matkul}
                        renderCard={renderMataKuliahCard}
                        emptyState={<EmptyState title="Tidak ada data" description="Belum ada mata kuliah yang terdaftar" compact />}
                        className="grid gap-3 md:grid-cols-2 lg:hidden"
                        emptyClassName="lg:hidden"
                    />
                    <Pagination pagination={mata_kuliah} />
                </div>
            </div>

            <Modal show={isImportModalOpen} onClose={() => setIsImportModalOpen(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-slate-900">Import Data Mata Kuliah</h2>
                    <p className="mt-1 text-sm text-slate-600">
                        Pilih file Excel (.xlsx) atau CSV yang berisi data mata kuliah untuk diunggah.
                        Belum punya template?{' '}
                        <a href={route('baak.mata-kuliah.export-template')} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-medium">
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
