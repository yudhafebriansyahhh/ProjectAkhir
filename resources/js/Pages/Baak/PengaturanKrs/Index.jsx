import { useEffect, useRef, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { BookOpen, Layers, Pencil, Plus, RefreshCcw, Trash2 } from 'lucide-react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { DataTable, EmptyState, PageHeader, SummaryCard } from '@/Components/ui/data-display';
import { SelectDropdown } from '@/Components/ui/select-dropdown';

const semesterTypeOptions = [
    { value: 'ganjil', label: 'Ganjil' },
    { value: 'genap', label: 'Genap' },
    { value: 'pendek', label: 'Pendek' },
];

const getKategoriBadge = (kategori) => {
    const badges = {
        wajib: 'border-rose-200 bg-rose-50 text-rose-700',
        pilihan: 'border-blue-200 bg-blue-50 text-blue-700',
        umum: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    };
    return badges[kategori] || 'border-slate-200 bg-slate-50 text-slate-700';
};

export default function Index({ pengaturan = [], filters = {}, prodis = [], periodes = [] }) {
    const { flash = {} } = usePage().props;
    const [selectedFilters, setSelectedFilters] = useState({
        tahun_ajaran: filters.tahun_ajaran || '',
        jenis_semester: filters.jenis_semester || '',
        kode_prodi: filters.kode_prodi || '',
        semester: filters.semester || '',
    });
    const isFirstRender = useRef(true);

    const hasFilters = Boolean(selectedFilters.tahun_ajaran || selectedFilters.jenis_semester || selectedFilters.kode_prodi || selectedFilters.semester);
    const periodeOptions = periodes.map((periode) => ({ value: periode.tahun_ajaran, label: periode.tahun_ajaran }));
    const prodiOptions = prodis.map((prodi) => ({ value: prodi.kode_prodi, label: prodi.nama_prodi }));
    const semesterOptions = (() => {
        if (selectedFilters.jenis_semester === 'ganjil') return [1, 3, 5, 7];
        if (selectedFilters.jenis_semester === 'genap') return [2, 4, 6, 8];
        return [1, 2, 3, 4, 5, 6, 7, 8];
    })().map((sem) => ({ value: String(sem), label: `Semester ${sem}` }));

    const groupedBySemester = pengaturan.reduce((acc, item) => {
        const semester = item.semester_ditawarkan;
        if (!acc[semester]) acc[semester] = [];
        acc[semester].push(item);
        return acc;
    }, {});
    const sortedSemesters = Object.keys(groupedBySemester).sort((a, b) => Number(a) - Number(b));

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(route('baak.pengaturan-krs.index'), selectedFilters, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 350);

        return () => clearTimeout(timeout);
    }, [selectedFilters]);

    const handleFilterChange = (key, value) => {
        setSelectedFilters((current) => ({
            ...current,
            [key]: value,
            ...(key === 'jenis_semester' ? { semester: '' } : {}),
        }));
    };

    const handleReset = () => {
        setSelectedFilters({ tahun_ajaran: '', jenis_semester: '', kode_prodi: '', semester: '' });
        router.get(route('baak.pengaturan-krs.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleDelete = (id, namaMk) => {
        const destroy = () => router.delete(route('baak.pengaturan-krs.destroy', id), { preserveScroll: true });

        if (window.Swal) {
            window.Swal.fire({
                title: 'Hapus Pengaturan?',
                text: `Hapus pengaturan "${namaMk}"?`,
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

        if (confirm(`Hapus pengaturan "${namaMk}"?`)) destroy();
    };

    const renderActions = (item, compact = false) => {
        if (compact) {
            return (
                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                    <Link href={route('baak.pengaturan-krs.edit', item.id_mk_periode)}>
                        <Button variant="outline" size="sm" className="w-full gap-1.5 text-amber-600">
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                        </Button>
                    </Link>
                    <Button type="button" variant="outline" size="sm" className="w-full gap-1.5 text-red-600" onClick={() => handleDelete(item.id_mk_periode, item.mata_kuliah?.nama_matkul)}>
                        <Trash2 className="h-3.5 w-3.5" />
                        Hapus
                    </Button>
                </div>
            );
        }

        return (
            <div className="flex items-center justify-center gap-1.5">
                <Link href={route('baak.pengaturan-krs.edit', item.id_mk_periode)}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600" title="Edit">
                        <Pencil className="h-4 w-4" />
                    </Button>
                </Link>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-600" title="Hapus" onClick={() => handleDelete(item.id_mk_periode, item.mata_kuliah?.nama_matkul)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        );
    };

    const columns = [
        {
            key: 'kode',
            header: 'Kode',
            render: (item) => <Badge variant="outline" className="bg-blue-50 font-mono text-blue-700">{item.mata_kuliah?.kode_matkul || '-'}</Badge>,
        },
        {
            key: 'mata_kuliah',
            header: 'Mata Kuliah',
            render: (item) => (
                <div className="min-w-[220px]">
                    <p className="break-words font-semibold text-slate-900">{item.mata_kuliah?.nama_matkul || '-'}</p>
                    {item.catatan ? <p className="mt-1 break-words text-xs italic text-slate-500">{item.catatan}</p> : null}
                </div>
            ),
        },
        { key: 'prodi', header: 'Program Studi', render: (item) => <span className="break-words text-sm text-slate-700">{item.prodi?.nama_prodi || '-'}</span> },
        { key: 'kategori', header: 'Kategori', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <Badge variant="outline" className={getKategoriBadge(item.mata_kuliah?.kategori)}>{item.mata_kuliah?.kategori || '-'}</Badge> },
        { key: 'sks', header: 'SKS', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <Badge variant="outline" className="bg-slate-50 text-slate-700">{item.mata_kuliah?.sks || 0}</Badge> },
        { key: 'periode', header: 'Periode', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <span className="whitespace-nowrap text-sm text-slate-700">{item.tahun_ajaran}<br /><span className="text-xs capitalize text-slate-500">{item.jenis_semester}</span></span> },
        { key: 'kelas', header: 'Kelas', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => item.kelas?.length ? <Badge variant="outline" className="bg-violet-50 text-violet-700">{item.kelas.length} Kelas</Badge> : <span className="text-slate-400">-</span> },
        { key: 'actions', header: 'Aksi', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => renderActions(item) },
    ];

    const renderMobileCard = (item) => (
        <Card key={item.id_mk_periode} className="rounded-lg border-slate-200 shadow-sm">
            <CardContent className="space-y-4 p-4">
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-blue-50 font-mono text-blue-700">{item.mata_kuliah?.kode_matkul || '-'}</Badge>
                    <Badge variant="outline" className={getKategoriBadge(item.mata_kuliah?.kategori)}>{item.mata_kuliah?.kategori || '-'}</Badge>
                    <Badge variant="outline" className="bg-slate-50 text-slate-700">{item.mata_kuliah?.sks || 0} SKS</Badge>
                </div>
                <div>
                    <p className="break-words font-semibold text-slate-950">{item.mata_kuliah?.nama_matkul || '-'}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.prodi?.nama_prodi || '-'}</p>
                    {item.catatan ? <p className="mt-2 break-words text-xs italic text-slate-500">{item.catatan}</p> : null}
                </div>
                <div className="grid gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                    <p><span className="font-medium text-slate-800">Periode:</span> {item.tahun_ajaran} - {item.jenis_semester}</p>
                    <p><span className="font-medium text-slate-800">Kelas:</span> {item.kelas?.length ? `${item.kelas.length} Kelas` : '-'}</p>
                </div>
                {renderActions(item, true)}
            </CardContent>
        </Card>
    );

    return (
        <BaakLayout title="Pengaturan Mata Kuliah KRS">
            <Head title="Pengaturan Mata Kuliah KRS" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5">
                    <PageHeader
                        title="Pengaturan Mata Kuliah KRS"
                        description="Kelola mata kuliah yang ditawarkan per periode dan semester."
                        actionHref={route('baak.pengaturan-krs.create')}
                        actionLabel="Set Mata Kuliah KRS"
                    />

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <SummaryCard title="Total Pengaturan" value={pengaturan.length || 0} icon={BookOpen} tone="blue" />
                        <SummaryCard title="Semester" value={sortedSemesters.length || 0} icon={Layers} tone="violet" />
                        <SummaryCard title="Program Studi" value={new Set(pengaturan.map((item) => item.kode_prodi).filter(Boolean)).size} icon={Layers} tone="emerald" />
                        <SummaryCard title="Total Kelas" value={pengaturan.reduce((sum, item) => sum + (item.kelas?.length || 0), 0)} icon={Layers} tone="amber" />
                    </div>

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="grid gap-3 p-4 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
                            <SelectDropdown value={selectedFilters.tahun_ajaran} onChange={(selected) => handleFilterChange('tahun_ajaran', selected ? selected.value : '')} options={periodeOptions} placeholder="Semua Tahun Ajaran" />
                            <SelectDropdown value={selectedFilters.jenis_semester} onChange={(selected) => handleFilterChange('jenis_semester', selected ? selected.value : '')} options={semesterTypeOptions} placeholder="Semua Jenis Semester" isSearchable={false} />
                            <SelectDropdown value={selectedFilters.kode_prodi} onChange={(selected) => handleFilterChange('kode_prodi', selected ? selected.value : '')} options={prodiOptions} placeholder="Semua Prodi" />
                            <SelectDropdown value={selectedFilters.semester} onChange={(selected) => handleFilterChange('semester', selected ? selected.value : '')} options={semesterOptions} placeholder="Semua Semester" isSearchable={false} />
                            <Button type="button" variant="outline" className="w-full gap-2 lg:w-auto" onClick={handleReset} disabled={!hasFilters}>
                                <RefreshCcw className="h-4 w-4" />
                                Reset
                            </Button>
                        </CardContent>
                    </Card>

                    {pengaturan.length > 0 ? (
                        <div className="space-y-5">
                            {sortedSemesters.map((semester) => (
                                <Card key={semester} className="overflow-hidden rounded-lg border-slate-200 shadow-sm">
                                    <CardContent className="border-b border-slate-100 bg-blue-600 p-4 text-white sm:px-5">
                                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                            <h2 className="text-lg font-bold">Semester {semester}</h2>
                                            <p className="text-sm text-blue-100">{groupedBySemester[semester].length} Mata Kuliah</p>
                                        </div>
                                    </CardContent>
                                    <div className="hidden lg:block">
                                        <DataTable
                                            columns={columns}
                                            data={groupedBySemester[semester]}
                                            getRowKey={(item) => item.id_mk_periode}
                                            emptyState={<EmptyState compact />}
                                            asCard={false}
                                        />
                                    </div>
                                    <div className="grid gap-3 p-3 md:grid-cols-2 lg:hidden">
                                        {groupedBySemester[semester].map(renderMobileCard)}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="rounded-lg border-slate-200 shadow-sm">
                            <CardContent className="p-4">
                                <EmptyState
                                    title="Belum ada pengaturan"
                                    description={hasFilters ? 'Tidak ada data dengan filter yang dipilih.' : 'Belum ada pengaturan mata kuliah KRS.'}
                                />
                                <div className="flex justify-center pb-4">
                                    <Link href={route('baak.pengaturan-krs.create')}>
                                        <Button className="gap-2">
                                            <Plus className="h-4 w-4" />
                                            Set Mata Kuliah KRS
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </BaakLayout>
    );
}
