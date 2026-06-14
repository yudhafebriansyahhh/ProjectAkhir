import { useEffect, useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, FileText, GraduationCap, Printer, RefreshCcw, Search, UserCheck, Users } from 'lucide-react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { CardGrid, DataTable, EmptyState, PageHeader, Pagination, SearchInput, SummaryCard } from '@/Components/ui/data-display';
import { SelectDropdown } from '@/Components/ui/select-dropdown';

const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'diproses', label: 'Diproses' },
    { value: 'selesai', label: 'Selesai' },
    { value: 'ditolak', label: 'Ditolak' },
];

const getStatusLabel = (status) => ({
    pending: 'Pending',
    diproses: 'Diproses',
    selesai: 'Selesai',
    ditolak: 'Ditolak',
}[status] || status || '-');

const getStatusBadge = (status) => ({
    pending: 'border-amber-200 bg-amber-50 text-amber-700',
    diproses: 'border-blue-200 bg-blue-50 text-blue-700',
    selesai: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    ditolak: 'border-red-200 bg-red-50 text-red-700',
}[status] || 'border-slate-200 bg-slate-50 text-slate-700');

export default function Index({ pengajuans, prodis = [], stats = {}, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [kodeProdi, setKodeProdi] = useState(filters.kode_prodi || '');
    const [statusPengajuan, setStatusPengajuan] = useState(filters.status_pengajuan || '');
    const isFirstRender = useRef(true);

    const pengajuanData = pengajuans.data || [];
    const hasFilters = Boolean(search || kodeProdi || statusPengajuan);
    const prodiOptions = prodis.map((prodi) => ({ value: prodi.kode_prodi, label: prodi.nama_prodi }));

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                route('baak.transkrip.index'),
                { search, kode_prodi: kodeProdi, status_pengajuan: statusPengajuan },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, kodeProdi, statusPengajuan]);

    const resetFilters = () => {
        setSearch('');
        setKodeProdi('');
        setStatusPengajuan('');
        router.get(route('baak.transkrip.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const updateStatus = (id, newStatus, keterangan = null) => {
        router.patch(route('baak.layanan.update-status', id), { 
            status: newStatus,
            keterangan_admin: keterangan
        }, {
            preserveScroll: true,
        });
    };

    const handleSelesaikan = (id) => {
        import('sweetalert2').then(({ default: Swal }) => {
            Swal.fire({
                title: 'Selesaikan Pengajuan',
                input: 'textarea',
                inputLabel: 'Keterangan BAAK (Opsional)',
                inputPlaceholder: 'Masukkan catatan atau pesan untuk mahasiswa...',
                showCancelButton: true,
                confirmButtonText: 'Selesaikan',
                cancelButtonText: 'Batal',
                confirmButtonColor: '#10b981',
            }).then((result) => {
                if (result.isConfirmed) {
                    updateStatus(id, 'selesai', result.value);
                    Swal.fire('Berhasil!', 'Status pengajuan telah diselesaikan.', 'success');
                }
            });
        });
    };

    const renderStatus = (item) => (
        <Badge variant="outline" className={getStatusBadge(item.status_pengajuan)}>
            {getStatusLabel(item.status_pengajuan)}
        </Badge>
    );

    const renderAction = (item, compact = false) => (
        <div className={`flex items-center justify-center gap-2 ${compact ? 'w-full' : ''}`}>
            <Link href={route('baak.transkrip.show', item.mahasiswa?.id_mahasiswa)} className={compact ? 'flex-1' : ''}>
                <Button variant="outline" size="sm" className={`${compact ? 'w-full' : ''} gap-2 text-blue-600`}>
                    <Printer className="h-4 w-4" />
                    Preview & Cetak
                </Button>
            </Link>
            {item.status_pengajuan !== 'selesai' && (
                <Button variant="outline" size="sm" className={`${compact ? 'flex-1' : ''} gap-1 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100`} onClick={() => handleSelesaikan(item.id_pengajuan)}>
                    <CheckCircle2 className="h-4 w-4" />
                    Selesaikan
                </Button>
            )}
        </div>
    );

    const columns = [
        { key: 'number', header: 'No', headerClassName: 'w-[56px]', cellClassName: 'font-medium text-slate-500', render: (_item, index) => (pengajuans.from || 1) + index },
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
        { key: 'tahun_lulus', header: 'Tahun Lulus', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => item.mahasiswa?.tahun_lulus || '-' },
        { key: 'keterangan_mhs', header: 'Ket. Mahasiswa', headerClassName: 'max-w-[200px]', cellClassName: 'max-w-[200px] truncate text-slate-500 text-sm', render: (item) => item.keterangan || '-' },
        { key: 'status', header: 'Status Ajuan', headerClassName: 'text-center', cellClassName: 'text-center', render: renderStatus },
        { key: 'tanggal', header: 'Tgl Pengajuan', headerClassName: 'text-center', cellClassName: 'text-center text-xs text-slate-500', render: (item) => item.tanggal_pengajuan },
        { key: 'actions', header: 'Aksi', headerClassName: 'w-[96px] text-center', cellClassName: 'text-center', render: (item) => renderAction(item) },
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
                    <p className="text-slate-600"><span className="font-medium text-slate-800">Tgl Ajuan:</span> {item.tanggal_pengajuan}</p>
                    {item.keterangan && <p className="text-slate-600"><span className="font-medium text-slate-800">Ket:</span> {item.keterangan}</p>}
                </div>
                {renderAction(item, true)}
            </CardContent>
        </Card>
    );

    return (
        <BaakLayout title="Ajuan Cetak Transkrip">
            <Head title="Ajuan Cetak Transkrip" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5">
                    <PageHeader title="Ajuan Cetak Transkrip" description="Kelola pengajuan cetak transkrip nilai akademik dari mahasiswa." icon={FileText} />

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <SummaryCard title="Total Pengajuan" value={stats.total || 0} icon={Users} tone="blue" />
                        <SummaryCard title="Menunggu" value={stats.pending || 0} icon={UserCheck} tone="amber" />
                        <SummaryCard title="Selesai" value={stats.selesai || 0} icon={GraduationCap} tone="emerald" />
                    </div>

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="grid gap-3 p-4 lg:grid-cols-[minmax(260px,1.3fr)_repeat(2,minmax(170px,1fr))_auto]">
                            <SearchInput value={search} onChange={setSearch} onClear={() => setSearch('')} placeholder="Cari NIM atau nama mahasiswa..." />
                            <SelectDropdown value={kodeProdi} onChange={(selected) => setKodeProdi(selected ? selected.value : '')} options={prodiOptions} placeholder="Semua Prodi" />
                            <SelectDropdown value={statusPengajuan} onChange={(selected) => setStatusPengajuan(selected ? selected.value : '')} options={statusOptions} placeholder="Semua Status" isSearchable={false} />
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
                        data={pengajuanData}
                        getRowKey={(item) => item.id_pengajuan}
                        emptyState={<EmptyState title="Tidak ada ajuan" description="Data ajuan tidak ditemukan atau belum sesuai filter." />}
                        className="hidden lg:block"
                    />

                    <CardGrid
                        data={pengajuanData}
                        getCardKey={(item) => item.id_pengajuan}
                        renderCard={renderCard}
                        emptyState={<EmptyState title="Tidak ada ajuan" description="Data ajuan tidak ditemukan atau belum sesuai filter." compact />}
                        className="grid gap-3 md:grid-cols-2 lg:hidden"
                        emptyClassName="lg:hidden"
                    />

                    <Pagination pagination={pengajuans} />
                </div>
            </div>
        </BaakLayout>
    );
}
