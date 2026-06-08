import { useEffect, useRef, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Building2, Eye, GraduationCap, Pencil, Trash2, Users } from 'lucide-react';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import {
    CardGrid,
    DataTable,
    EmptyState,
    PageHeader,
    Pagination,
    SearchCard,
    SummaryCard,
} from '@/Components/ui/data-display';

const getJenjangBadge = (jenjang) => {
    const badges = {
        D3: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        D4: 'bg-sky-50 text-sky-700 border-sky-200',
        S1: 'bg-violet-50 text-violet-700 border-violet-200',
        S2: 'bg-amber-50 text-amber-700 border-amber-200',
        S3: 'bg-rose-50 text-rose-700 border-rose-200',
    };

    return badges[jenjang] || 'bg-gray-50 text-gray-700 border-gray-200';
};

export default function Index({ prodi, stats, filters }) {
    const { flash = {} } = usePage().props;
    const [search, setSearch] = useState(filters?.search || '');
    const isFirstRender = useRef(true);

    const prodiData = prodi.data || [];
    const totalMahasiswa = prodiData.reduce((sum, item) => sum + (item.mahasiswa_count || 0), 0);
    const totalS1 = prodiData.filter((item) => item.jenjang === 'S1').length;
    const totalDiploma = prodiData.filter((item) => ['D3', 'D4'].includes(item.jenjang)).length;

    const summaryCards = [
        {
            title: 'Total Prodi',
            value: stats?.total ?? prodi.total ?? 0,
            icon: Building2,
            tone: 'blue',
        },
        {
            title: 'Total Mahasiswa',
            value: stats?.total_mahasiswa ?? totalMahasiswa,
            icon: Users,
            tone: 'violet',
        },
        {
            title: 'Prodi S1',
            value: stats?.s1 ?? totalS1,
            icon: GraduationCap,
            tone: 'emerald',
        },
        {
            title: 'Prodi D3/D4',
            value: stats?.diploma ?? totalDiploma,
            icon: GraduationCap,
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
                route('baak.prodi.index'),
                search ? { search } : {},
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [search]);

    const handleDelete = (kodeProdi, namaProdi) => {
        if (window.Swal) {
            window.Swal.fire({
                title: 'Hapus Program Studi?',
                text: `Apakah Anda yakin ingin menghapus prodi "${namaProdi}"?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc2626',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal',
            }).then((result) => {
                if (result.isConfirmed) {
                    router.delete(route('baak.prodi.destroy', kodeProdi), {
                        preserveScroll: true,
                    });
                }
            });

            return;
        }

        if (confirm(`Apakah Anda yakin ingin menghapus prodi "${namaProdi}"?`)) {
            router.delete(route('baak.prodi.destroy', kodeProdi), {
                preserveScroll: true,
            });
        }
    };

    const renderIdentity = (item) => (
        <div className="min-w-0">
            <p className="break-words text-sm font-semibold text-slate-900">{item.nama_prodi}</p>
        </div>
    );

    const renderActions = (item, compact = false) => {
        if (compact) {
            return (
                <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
                    <Link href={route('baak.prodi.show', item.kode_prodi)} className="min-w-0">
                        <Button variant="outline" size="sm" className="w-full gap-1.5 border-blue-200 text-blue-600 hover:bg-blue-50">
                            <Eye className="h-3.5 w-3.5" />
                            <span>Detail</span>
                        </Button>
                    </Link>
                    <Link href={route('baak.prodi.edit', item.kode_prodi)} className="min-w-0">
                        <Button variant="outline" size="sm" className="w-full gap-1.5 border-amber-200 text-amber-600 hover:bg-amber-50">
                            <Pencil className="h-3.5 w-3.5" />
                            <span>Edit</span>
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(item.kode_prodi, item.nama_prodi)}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Hapus</span>
                    </Button>
                </div>
            );
        }

        return (
            <div className="flex items-center justify-center gap-1.5">
                <Link href={route('baak.prodi.show', item.kode_prodi)}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700" title="Detail">
                        <Eye className="h-4 w-4" />
                    </Button>
                </Link>
                <Link href={route('baak.prodi.edit', item.kode_prodi)}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:bg-amber-50 hover:text-amber-700" title="Edit">
                        <Pencil className="h-4 w-4" />
                    </Button>
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleDelete(item.kode_prodi, item.nama_prodi)}
                    title="Hapus"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        );
    };

    const prodiColumns = [
        {
            key: 'number',
            header: 'No',
            headerClassName: 'w-[56px]',
            cellClassName: 'font-medium text-slate-500',
            render: (_item, index) => (prodi.from || 1) + index,
        },
        {
            key: 'kode_prodi',
            header: 'Kode',
            headerClassName: 'w-[140px]',
            render: (item) => (
                <Badge variant="outline" className="bg-blue-50 font-mono text-blue-700">
                    {item.kode_prodi}
                </Badge>
            ),
        },
        {
            key: 'nama_prodi',
            header: 'Program Studi',
            render: renderIdentity,
        },
        {
            key: 'jenjang',
            header: 'Jenjang',
            headerClassName: 'text-center',
            cellClassName: 'text-center',
            render: (item) => (
                <Badge variant="outline" className={getJenjangBadge(item.jenjang)}>
                    {item.jenjang || '-'}
                </Badge>
            ),
        },
        {
            key: 'mahasiswa_count',
            header: 'Mahasiswa',
            headerClassName: 'text-center',
            cellClassName: 'text-center',
            render: (item) => (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-sm font-medium text-slate-700">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    {item.mahasiswa_count || 0}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Aksi',
            headerClassName: 'w-[160px] text-center',
            render: (item) => renderActions(item),
        },
    ];

    const renderProdiCard = (item, _index, key) => (
        <Card key={key} className="min-w-0 overflow-hidden rounded-lg border-slate-200 shadow-sm transition hover:shadow-md">
            <CardContent className="space-y-3 p-4">
                <div className="flex min-w-0 items-start justify-between gap-3">
                    {renderIdentity(item)}
                    <Badge variant="outline" className={`shrink-0 ${getJenjangBadge(item.jenjang)}`}>
                        {item.jenjang || '-'}
                    </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3 text-sm">
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-400">Kode</p>
                        <p className="mt-1 truncate font-mono font-semibold text-blue-700">{item.kode_prodi}</p>
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-400">Mahasiswa</p>
                        <p className="mt-1 inline-flex items-center gap-1.5 font-semibold text-slate-800">
                            <Users className="h-3.5 w-3.5 text-slate-400" />
                            {item.mahasiswa_count || 0}
                        </p>
                    </div>
                </div>

                {renderActions(item, true)}
            </CardContent>
        </Card>
    );

    const emptyState = (
        <EmptyState
            title="Tidak ada data"
            description="Belum ada program studi yang terdaftar"
        />
    );

    return (
        <BaakLayout title="Data Program Studi">
            <Head title="Data Program Studi" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5">
                    <PageHeader
                        title="Data Program Studi"
                        description="Kelola data program studi di sistem akademik."
                        actionHref={route('baak.prodi.create')}
                        actionLabel="Tambah Prodi"
                    />

                    <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                        {summaryCards.map((card) => (
                            <SummaryCard key={card.title} {...card} />
                        ))}
                    </section>

                    <SearchCard
                        value={search}
                        onChange={setSearch}
                        onClear={() => setSearch('')}
                        placeholder="Cari kode atau nama prodi..."
                    />

                    <DataTable
                        columns={prodiColumns}
                        data={prodiData}
                        getRowKey={(item) => item.kode_prodi}
                        emptyState={emptyState}
                        className="hidden lg:block"
                    />
                    <CardGrid
                        data={prodiData}
                        getCardKey={(item) => item.kode_prodi}
                        renderCard={renderProdiCard}
                        emptyState={<EmptyState title="Tidak ada data" description="Belum ada program studi yang terdaftar" compact />}
                        className="grid gap-3 md:grid-cols-2 lg:hidden"
                        emptyClassName="lg:hidden"
                    />
                    <Pagination pagination={prodi} />
                </div>
            </div>
        </BaakLayout>
    );
}
