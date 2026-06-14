import { useEffect, useRef, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Archive, ArrowLeft, BookOpen, CalendarDays, Clock, Eye, Pencil, RefreshCcw, Trash2, Users } from 'lucide-react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { CardGrid, DataTable, EmptyState, PageHeader, Pagination, SearchInput, SummaryCard } from '@/Components/ui/data-display';
import { SelectDropdown } from '@/Components/ui/select-dropdown';

const hariOptions = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((hari) => ({ value: hari, label: hari }));

const formatTime = (value) => value?.substring(0, 5) || '-';
const roomLabel = (item) => item.ruangan?.kode_ruangan || item.ruang_kelas || '-';
const course = (item) => item.mata_kuliah_periode?.mata_kuliah;
const period = (item) => item.mata_kuliah_periode;

export default function Index({ kelas, mata_kuliah_list = [], dosen_list = [], filters = {}, isArchive = false }) {
    const { flash = {} } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [mataKuliah, setMataKuliah] = useState(filters.mata_kuliah || '');
    const [dosen, setDosen] = useState(filters.dosen || '');
    const [hari, setHari] = useState(filters.hari || '');
    const isFirstRender = useRef(true);

    const kelasData = kelas.data || [];
    const hasFilters = Boolean(search || mataKuliah || dosen || hari);
    const mataKuliahOptions = mata_kuliah_list.map((mk) => ({ value: mk.kode_matkul, label: mk.nama_matkul }));
    const dosenOptions = dosen_list.map((item) => ({ value: item.id_dosen, label: item.nama }));
    const listRoute = isArchive ? 'baak.kelas.arsip' : 'baak.kelas.index';
    const title = isArchive ? 'Arsip Kelas' : 'Data Kelas';
    const description = isArchive
        ? 'Lihat kelas dari periode sebelumnya sebagai record history akademik.'
        : 'Kelola kelas perkuliahan aktif pada periode terbaru.';

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                route(listRoute),
                { search, mata_kuliah: mataKuliah, dosen, hari },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 350);

        return () => clearTimeout(timeout);
    }, [search, mataKuliah, dosen, hari]);

    const handleReset = () => {
        setSearch('');
        setMataKuliah('');
        setDosen('');
        setHari('');
        router.get(route(listRoute), {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleDelete = (item) => {
        const namaMatkul = course(item)?.nama_matkul || '-';
        const destroy = () => router.delete(route('baak.kelas.destroy', item.id_kelas), { preserveScroll: true });

        if (window.Swal) {
            window.Swal.fire({
                title: 'Hapus Kelas?',
                text: `Apakah Anda yakin ingin menghapus kelas "${namaMatkul} - ${item.nama_kelas}"?`,
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

        if (confirm(`Hapus kelas "${namaMatkul} - ${item.nama_kelas}"?`)) destroy();
    };

    const renderActions = (item, compact = false) => {
        if (compact) {
            return (
                <div className={`grid gap-2 border-t border-slate-100 pt-3 ${isArchive ? 'grid-cols-1' : 'grid-cols-3'}`}>
                    <Link href={route('baak.kelas.show', item.id_kelas)}>
                        <Button variant="outline" size="sm" className="w-full gap-1.5 text-blue-600">
                            <Eye className="h-3.5 w-3.5" />
                            Detail
                        </Button>
                    </Link>
                    {!isArchive && (
                        <>
                            <Link href={route('baak.kelas.edit', item.id_kelas)}>
                                <Button variant="outline" size="sm" className="w-full gap-1.5 text-amber-600">
                                    <Pencil className="h-3.5 w-3.5" />
                                    Edit
                                </Button>
                            </Link>
                            <Button type="button" variant="outline" size="sm" className="w-full gap-1.5 text-red-600" onClick={() => handleDelete(item)}>
                                <Trash2 className="h-3.5 w-3.5" />
                                Hapus
                            </Button>
                        </>
                    )}
                </div>
            );
        }

        return (
            <div className="flex items-center justify-center gap-1.5">
                <Link href={route('baak.kelas.show', item.id_kelas)}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" title="Detail">
                        <Eye className="h-4 w-4" />
                    </Button>
                </Link>
                {!isArchive && (
                    <>
                        <Link href={route('baak.kelas.edit', item.id_kelas)}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600" title="Edit">
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-600" title="Hapus" onClick={() => handleDelete(item)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </>
                )}
            </div>
        );
    };

    const columns = [
        { key: 'number', header: 'No', headerClassName: 'w-[56px]', cellClassName: 'font-medium text-slate-500', render: (_item, index) => (kelas.from || 1) + index },
        {
            key: 'mata_kuliah',
            header: 'Mata Kuliah',
            render: (item) => (
                <div className="min-w-[220px]">
                    <Badge variant="outline" className="mb-1 bg-blue-50 font-mono text-blue-700">
                        {course(item)?.kode_matkul || '-'}
                    </Badge>
                    <p className="break-words font-semibold text-slate-900">{course(item)?.nama_matkul || '-'}</p>
                    <p className="text-xs text-slate-500">{period(item)?.tahun_ajaran || '-'} - {period(item)?.jenis_semester || '-'}</p>
                </div>
            ),
        },
        { key: 'nama_kelas', header: 'Kelas', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <Badge variant="outline" className="bg-violet-50 text-violet-700">Kelas {item.nama_kelas}</Badge> },
        { key: 'dosen', header: 'Dosen', render: (item) => <span className="break-words text-sm font-medium text-slate-700">{item.dosen?.nama || '-'}</span> },
        { key: 'jadwal', header: 'Jadwal', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <span className="whitespace-nowrap text-sm text-slate-700">{item.hari || '-'}, {formatTime(item.jam_mulai)} - {formatTime(item.jam_selesai)}</span> },
        { key: 'ruang', header: 'Ruang', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <Badge variant="outline" className="bg-slate-50 font-mono text-slate-700">{roomLabel(item)}</Badge> },
        { key: 'mahasiswa', header: 'Mahasiswa', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <Badge variant="outline" className="bg-emerald-50 text-emerald-700">{item.detail_krs_count || 0}/{item.kapasitas || 0}</Badge> },
        { key: 'actions', header: 'Aksi', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => renderActions(item) },
    ];

    const renderKelasCard = (item, _index, key) => (
        <Card key={key} className="rounded-lg border-slate-200 shadow-sm">
            <CardContent className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap gap-2">
                            <Badge variant="outline" className="bg-blue-50 font-mono text-blue-700">{course(item)?.kode_matkul || '-'}</Badge>
                            <Badge variant="outline" className="bg-violet-50 text-violet-700">Kelas {item.nama_kelas}</Badge>
                        </div>
                        <p className="break-words font-semibold text-slate-950">{course(item)?.nama_matkul || '-'}</p>
                        <p className="mt-1 text-xs text-slate-500">{period(item)?.tahun_ajaran || '-'} - {period(item)?.jenis_semester || '-'}</p>
                    </div>
                </div>

                <div className="grid gap-2 rounded-lg bg-slate-50 p-3 text-sm">
                    <p className="text-slate-600"><span className="font-medium text-slate-800">Dosen:</span> {item.dosen?.nama || '-'}</p>
                    <p className="text-slate-600"><span className="font-medium text-slate-800">Jadwal:</span> {item.hari || '-'}, {formatTime(item.jam_mulai)} - {formatTime(item.jam_selesai)}</p>
                    <p className="text-slate-600"><span className="font-medium text-slate-800">Ruang:</span> {roomLabel(item)}</p>
                    <p className="text-slate-600"><span className="font-medium text-slate-800">Mahasiswa:</span> {item.detail_krs_count || 0}/{item.kapasitas || 0}</p>
                </div>

                {renderActions(item, true)}
            </CardContent>
        </Card>
    );

    return (
        <BaakLayout title={title}>
            <Head title={title} />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5">
                    <PageHeader
                        title={title}
                        description={description}
                        actionHref={isArchive ? route('baak.kelas.index') : route('baak.kelas.create')}
                        actionLabel={isArchive ? 'Kelas Aktif' : 'Tambah Kelas'}
                        actionIcon={isArchive ? ArrowLeft : undefined}
                    >
                        {!isArchive && (
                            <Link href={route('baak.kelas.arsip')} className="w-full sm:w-auto">
                                <Button variant="outline" className="h-10 w-full gap-2 sm:w-auto">
                                    <Archive className="h-4 w-4" />
                                    Arsip Kelas
                                </Button>
                            </Link>
                        )}
                    </PageHeader>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <SummaryCard title={isArchive ? 'Total Arsip' : 'Total Kelas'} value={kelas.total || 0} icon={BookOpen} tone="blue" />
                        <SummaryCard title="Data Halaman Ini" value={kelasData.length} icon={CalendarDays} tone="violet" />
                        <SummaryCard title="Mahasiswa Terdaftar" value={kelasData.reduce((sum, item) => sum + (item.detail_krs_count || 0), 0)} icon={Users} tone="emerald" />
                        <SummaryCard title="Hari Aktif" value={new Set(kelasData.map((item) => item.hari).filter(Boolean)).size} icon={Clock} tone="amber" />
                    </div>

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="grid gap-3 p-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(180px,1fr)_minmax(180px,1fr)_minmax(150px,0.7fr)_auto]">
                            <SearchInput value={search} onChange={setSearch} onClear={() => setSearch('')} placeholder="Cari kelas, mata kuliah, dosen, atau ruang..." />
                            <SelectDropdown value={mataKuliah} onChange={(selected) => setMataKuliah(selected ? selected.value : '')} options={mataKuliahOptions} placeholder="Semua Mata Kuliah" />
                            <SelectDropdown value={dosen} onChange={(selected) => setDosen(selected ? selected.value : '')} options={dosenOptions} placeholder="Semua Dosen" />
                            <SelectDropdown value={hari} onChange={(selected) => setHari(selected ? selected.value : '')} options={hariOptions} placeholder="Semua Hari" isSearchable={false} />
                            <Button type="button" variant="outline" className="w-full gap-2 lg:w-auto" onClick={handleReset} disabled={!hasFilters}>
                                <RefreshCcw className="h-4 w-4" />
                                Reset
                            </Button>
                        </CardContent>
                    </Card>

                    <DataTable
                        columns={columns}
                        data={kelasData}
                        getRowKey={(item) => item.id_kelas}
                        emptyState={<EmptyState title="Tidak ada data kelas" description="Kelas belum tersedia atau tidak sesuai filter." />}
                        className="hidden lg:block"
                    />

                    <CardGrid
                        data={kelasData}
                        getCardKey={(item) => item.id_kelas}
                        renderCard={renderKelasCard}
                        emptyState={<EmptyState title="Tidak ada data kelas" description="Kelas belum tersedia atau tidak sesuai filter." compact />}
                        className="grid gap-3 md:grid-cols-2 lg:hidden"
                        emptyClassName="lg:hidden"
                    />

                    <Pagination pagination={kelas} />
                </div>
            </div>
        </BaakLayout>
    );
}
