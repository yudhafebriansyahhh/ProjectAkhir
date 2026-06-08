import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, BookOpen, GraduationCap, IdCard, Pencil, Phone, Users, UserCheck } from 'lucide-react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { CardGrid, ClientPagination, DataTable, EmptyState, PageHeader, SearchInput, SummaryCard } from '@/Components/ui/data-display';
import { SelectDropdown } from '@/Components/ui/select-dropdown';

const ITEMS_PER_PAGE = 10;

const getStatusBadge = (status) => {
    const badges = {
        aktif: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        cuti: 'bg-amber-50 text-amber-700 border-amber-200',
        lulus: 'bg-blue-50 text-blue-700 border-blue-200',
        DO: 'bg-red-50 text-red-700 border-red-200',
    };

    return badges[status] || 'bg-slate-50 text-slate-700 border-slate-200';
};

export default function Show({ prodi, stats }) {
    const [activeTab, setActiveTab] = useState('info');
    const [dosenSearch, setDosenSearch] = useState('');
    const [dosenPage, setDosenPage] = useState(1);
    const [mahasiswaSearch, setMahasiswaSearch] = useState('');
    const [mahasiswaAngkatan, setMahasiswaAngkatan] = useState('');
    const [mahasiswaPage, setMahasiswaPage] = useState(1);
    const mahasiswaPerStatus = stats.mahasiswa_per_status || {};
    const totalMahasiswa = Object.values(mahasiswaPerStatus).reduce((total, value) => total + value, 0);
    const dosenData = prodi.dosen || [];
    const mahasiswaData = prodi.mahasiswa || [];

    const getAngkatan = (mahasiswa) => (mahasiswa.nim ? `20${mahasiswa.nim.substring(0, 2)}` : '-');
    const angkatanOptions = [...new Set(mahasiswaData.map(getAngkatan).filter((item) => item !== '-'))].sort((a, b) => b.localeCompare(a));

    const filteredDosen = dosenData.filter((dosen) => {
        const keyword = dosenSearch.toLowerCase();

        return [dosen.nama, dosen.nip, dosen.no_hp, dosen.jenis_kelamin]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(keyword));
    });

    const filteredMahasiswa = mahasiswaData.filter((mahasiswa) => {
        const keyword = mahasiswaSearch.toLowerCase();
        const angkatan = getAngkatan(mahasiswa);
        const matchesSearch = [mahasiswa.nama, mahasiswa.nim, mahasiswa.status, angkatan]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(keyword));
        const matchesAngkatan = mahasiswaAngkatan ? angkatan === mahasiswaAngkatan : true;

        return matchesSearch && matchesAngkatan;
    });

    const paginate = (items, page) => items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    const paginatedDosen = paginate(filteredDosen, dosenPage);
    const paginatedMahasiswa = paginate(filteredMahasiswa, mahasiswaPage);

    const tabs = [
        { key: 'info', label: 'Informasi' },
        { key: 'dosen', label: `Dosen (${stats.total_dosen || 0})` },
        { key: 'mahasiswa', label: `Mahasiswa (${stats.total_mahasiswa || 0})` },
    ];

    const summaryCards = [
        { title: 'Total Dosen', value: stats.total_dosen, icon: UserCheck, tone: 'blue' },
        { title: 'Mahasiswa Aktif', value: stats.total_mahasiswa, icon: GraduationCap, tone: 'emerald' },
        { title: 'Mata Kuliah', value: stats.total_mata_kuliah, icon: BookOpen, tone: 'violet' },
        { title: 'Total Mahasiswa', value: totalMahasiswa, icon: Users, tone: 'amber' },
    ];

    const dosenColumns = [
        {
            key: 'number',
            header: 'No',
            headerClassName: 'w-[56px]',
            cellClassName: 'font-medium text-slate-500',
            render: (_item, index) => (dosenPage - 1) * ITEMS_PER_PAGE + index + 1,
        },
        { key: 'nip', header: 'NIP', render: (item) => item.nip || '-' },
        { key: 'nama', header: 'Nama', render: (item) => <span className="font-semibold text-slate-800">{item.nama}</span> },
        {
            key: 'jenis_kelamin',
            header: 'Jenis Kelamin',
            render: (item) => (
                <Badge variant="outline" className={item.jenis_kelamin === 'Laki-laki' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'}>
                    {item.jenis_kelamin || '-'}
                </Badge>
            ),
        },
        { key: 'no_hp', header: 'No HP', render: (item) => item.no_hp || '-' },
        {
            key: 'actions',
            header: 'Aksi',
            headerClassName: 'text-center w-[96px]',
            cellClassName: 'text-center',
            render: (item) => (
                <Link href={route('baak.dosen.show', item.id_dosen)} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                    Detail
                </Link>
            ),
        },
    ];

    const mahasiswaColumns = [
        {
            key: 'number',
            header: 'No',
            headerClassName: 'w-[56px]',
            cellClassName: 'font-medium text-slate-500',
            render: (_item, index) => (mahasiswaPage - 1) * ITEMS_PER_PAGE + index + 1,
        },
        { key: 'nim', header: 'NIM', render: (item) => <span className="font-mono font-semibold text-slate-800">{item.nim}</span> },
        { key: 'nama', header: 'Nama', render: (item) => <span className="font-semibold text-slate-800">{item.nama}</span> },
        { key: 'angkatan', header: 'Angkatan', render: getAngkatan },
        {
            key: 'status',
            header: 'Status',
            headerClassName: 'text-center',
            cellClassName: 'text-center',
            render: (item) => (
                <Badge variant="outline" className={getStatusBadge(item.status)}>
                    {item.status?.toUpperCase() || '-'}
                </Badge>
            ),
        },
        {
            key: 'actions',
            header: 'Aksi',
            headerClassName: 'text-center w-[96px]',
            cellClassName: 'text-center',
            render: (item) => (
                <Link href={route('baak.mahasiswa.show', item.id_mahasiswa)} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                    Detail
                </Link>
            ),
        },
    ];

    const renderDosenCard = (dosen, _index, key) => (
        <Card key={key} className="rounded-lg border-slate-200 shadow-sm">
            <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="break-words font-semibold text-slate-900">{dosen.nama}</p>
                        <p className="mt-0.5 font-mono text-xs text-slate-400">{dosen.nip || '-'}</p>
                    </div>
                    <Badge variant="outline" className={dosen.jenis_kelamin === 'Laki-laki' ? 'shrink-0 bg-blue-50 text-blue-700' : 'shrink-0 bg-pink-50 text-pink-700'}>
                        {dosen.jenis_kelamin || '-'}
                    </Badge>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{dosen.no_hp || '-'}</span>
                </div>
                <Link href={route('baak.dosen.show', dosen.id_dosen)}>
                    <Button variant="outline" size="sm" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                        Detail
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );

    const renderMahasiswaCard = (mahasiswa, _index, key) => (
        <Card key={key} className="rounded-lg border-slate-200 shadow-sm">
            <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="break-words font-semibold text-slate-900">{mahasiswa.nama}</p>
                        <p className="mt-0.5 font-mono text-xs text-slate-400">{mahasiswa.nim}</p>
                    </div>
                    <Badge variant="outline" className={`shrink-0 ${getStatusBadge(mahasiswa.status)}`}>
                        {mahasiswa.status?.toUpperCase() || '-'}
                    </Badge>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                    <IdCard className="h-4 w-4 text-slate-400" />
                    <span>Angkatan 20{mahasiswa.nim?.substring(0, 2) || '-'}</span>
                </div>
                <Link href={route('baak.mahasiswa.show', mahasiswa.id_mahasiswa)}>
                    <Button variant="outline" size="sm" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                        Detail
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );

    return (
        <BaakLayout title="Detail Program Studi">
            <Head title={`Detail ${prodi.nama_prodi}`} />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5">
                    <div>
                        <Link href={route('baak.prodi.index')} className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Daftar Prodi
                        </Link>
                        <PageHeader
                            title="Detail Program Studi"
                            description={`${prodi.nama_prodi} (${prodi.kode_prodi})`}
                            actionHref={route('baak.prodi.edit', prodi.kode_prodi)}
                            actionLabel="Edit Prodi"
                            actionIcon={Pencil}
                        />
                    </div>

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                            <div className="min-w-0">
                                <h2 className="break-words text-xl font-bold text-slate-950 sm:text-2xl">{prodi.nama_prodi}</h2>
                                <p className="mt-1 text-sm text-slate-500">Kode Prodi {prodi.kode_prodi}</p>
                            </div>
                            <Badge variant="outline" className="w-fit rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                                {prodi.jenjang || '-'}
                            </Badge>
                        </CardContent>
                    </Card>

                    <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                        {summaryCards.map((card) => (
                            <SummaryCard key={card.title} {...card} />
                        ))}
                    </section>

                    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 p-0">
                            <div className="flex overflow-x-auto">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`min-w-max border-b-2 px-4 py-3 text-sm font-semibold transition sm:px-5 ${
                                            activeTab === tab.key
                                                ? 'border-blue-600 bg-blue-50/60 text-blue-700'
                                                : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 sm:p-5">
                            {activeTab === 'info' ? (
                                <div className="space-y-5">
                                    <section>
                                        <h3 className="mb-3 text-base font-bold text-slate-950">Statistik Mahasiswa per Status</h3>
                                        {Object.keys(mahasiswaPerStatus).length > 0 ? (
                                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                                {Object.entries(mahasiswaPerStatus).map(([status, total]) => (
                                                    <div key={status} className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
                                                        <p className="text-2xl font-bold text-slate-950">{total}</p>
                                                        <p className="mt-1 text-sm font-medium capitalize text-slate-500">{status}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <EmptyState title="Belum ada statistik" description="Data status mahasiswa belum tersedia" compact />
                                        )}
                                    </section>

                                    <section>
                                        <h3 className="mb-3 text-base font-bold text-slate-950">Informasi Program Studi</h3>
                                        <div className="grid gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 sm:grid-cols-3">
                                            <div>
                                                <p className="text-xs font-medium text-slate-500">Nama Program Studi</p>
                                                <p className="mt-1 font-semibold text-slate-900">{prodi.nama_prodi}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-slate-500">Kode Prodi</p>
                                                <p className="mt-1 font-mono font-semibold text-slate-900">{prodi.kode_prodi}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-slate-500">Jenjang</p>
                                                <p className="mt-1 font-semibold text-slate-900">{prodi.jenjang}</p>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            ) : null}

                            {activeTab === 'dosen' ? (
                                <div className="space-y-4">
                                    <SearchInput
                                        value={dosenSearch}
                                        onChange={(value) => {
                                            setDosenSearch(value);
                                            setDosenPage(1);
                                        }}
                                        onClear={() => {
                                            setDosenSearch('');
                                            setDosenPage(1);
                                        }}
                                        placeholder="Cari nama, NIP, jenis kelamin, atau nomor HP dosen..."
                                    />
                                    <DataTable
                                        columns={dosenColumns}
                                        data={paginatedDosen}
                                        getRowKey={(item) => item.id_dosen}
                                        emptyState={<EmptyState title="Belum ada dosen" description="Belum ada dosen di program studi ini" />}
                                        className="hidden lg:block"
                                        asCard={false}
                                    />
                                    <CardGrid
                                        data={paginatedDosen}
                                        getCardKey={(item) => item.id_dosen}
                                        renderCard={renderDosenCard}
                                        emptyState={<EmptyState title="Belum ada dosen" description="Belum ada dosen di program studi ini" compact />}
                                        className="grid gap-3 md:grid-cols-2 lg:hidden"
                                        emptyClassName="lg:hidden"
                                    />
                                    <ClientPagination
                                        page={dosenPage}
                                        perPage={ITEMS_PER_PAGE}
                                        total={filteredDosen.length}
                                        onPageChange={setDosenPage}
                                    />
                                </div>
                            ) : null}

                            {activeTab === 'mahasiswa' ? (
                                <div className="space-y-4">
                                    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
                                        <SearchInput
                                            value={mahasiswaSearch}
                                            onChange={(value) => {
                                                setMahasiswaSearch(value);
                                                setMahasiswaPage(1);
                                            }}
                                            onClear={() => {
                                                setMahasiswaSearch('');
                                                setMahasiswaPage(1);
                                            }}
                                            placeholder="Cari nama, NIM, status, atau angkatan mahasiswa..."
                                        />
                                        <div className="w-full">
                                            <SelectDropdown
                                                value={mahasiswaAngkatan}
                                                onChange={(selected) => {
                                                    setMahasiswaAngkatan(selected ? selected.value : '');
                                                    setMahasiswaPage(1);
                                                }}
                                                options={angkatanOptions.map(a => ({ value: a, label: a }))}
                                                placeholder="Semua Angkatan"
                                                isSearchable={false}
                                            />
                                        </div>
                                    </div>
                                    <DataTable
                                        columns={mahasiswaColumns}
                                        data={paginatedMahasiswa}
                                        getRowKey={(item) => item.id_mahasiswa}
                                        emptyState={<EmptyState title="Belum ada mahasiswa" description="Belum ada mahasiswa aktif di program studi ini" />}
                                        className="hidden lg:block"
                                        asCard={false}
                                    />
                                    <CardGrid
                                        data={paginatedMahasiswa}
                                        getCardKey={(item) => item.id_mahasiswa}
                                        renderCard={renderMahasiswaCard}
                                        emptyState={<EmptyState title="Belum ada mahasiswa" description="Belum ada mahasiswa aktif di program studi ini" compact />}
                                        className="grid gap-3 md:grid-cols-2 lg:hidden"
                                        emptyClassName="lg:hidden"
                                    />
                                    <ClientPagination
                                        page={mahasiswaPage}
                                        perPage={ITEMS_PER_PAGE}
                                        total={filteredMahasiswa.length}
                                        onPageChange={setMahasiswaPage}
                                    />
                                </div>
                            ) : null}
                        </div>
                    </section>

                </div>
            </div>
        </BaakLayout>
    );
}
