import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, BookOpen, CheckCircle2, FileText, LockOpen, Users, XCircle } from 'lucide-react';
import DosenLayout from '@/Layouts/DosenLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { CardGrid, DataTable, EmptyState, PageHeader, SummaryCard } from '@/Components/ui/data-display';
import { SelectDropdown } from '@/Components/ui/select-dropdown';

const getStatusLabel = (status) => ({
    draft: 'Draft',
    pending: 'Menunggu',
    approved: 'Disetujui',
    rejected: 'Ditolak',
}[status] || status || '-');

const getStatusBadge = (status) => ({
    draft: 'border-slate-200 bg-slate-50 text-slate-700',
    pending: 'border-amber-200 bg-amber-50 text-amber-700',
    approved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    rejected: 'border-red-200 bg-red-50 text-red-700',
}[status] || 'border-slate-200 bg-slate-50 text-slate-700');

const formatDate = (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const semesterLabel = (item) => `Semester ${item.semester} - ${item.tahun_ajaran}`;

const InfoItem = ({ label, value, children }) => (
    <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        {children || <p className="mt-1 break-words text-sm font-semibold text-slate-900">{value || '-'}</p>}
    </div>
);

export default function Show({ krs, totalSks = 0, mataKuliahList = [], allKrsList = [] }) {
    const [selectedKrsId, setSelectedKrsId] = useState(krs.id_krs);
    const semesterOptions = (allKrsList.length ? allKrsList : [krs]).map((item) => ({
        value: item.id_krs,
        label: `${semesterLabel(item)} - ${getStatusLabel(item.status)} (${item.total_sks || totalSks || 0} SKS)`,
    }));

    const handleChangeSemester = (selected) => {
        if (!selected || String(selected.value) === String(selectedKrsId)) return;
        setSelectedKrsId(selected.value);
        router.get(route('dosen.acc-krs.show', selected.value));
    };

    const updateStatus = (nextStatus) => {
        const isUnlock = nextStatus === 'draft';
        const isCancelApproved = nextStatus === 'rejected' && krs.status === 'approved';
        const actionLabel = nextStatus === 'approved'
            ? 'menyetujui'
            : isUnlock
                ? 'membuka kunci'
                : isCancelApproved
                    ? 'membatalkan'
                    : 'menolak';
        const submit = () => {
            router.patch(route('dosen.acc-krs.update', krs.id_krs), { status: nextStatus }, { preserveScroll: true });
        };

        if (window.Swal) {
            window.Swal.fire({
                title: `Yakin ${actionLabel} KRS?`,
                text: nextStatus === 'approved'
                    ? 'KRS mahasiswa akan disetujui.'
                    : isUnlock
                        ? 'Status KRS akan dikembalikan ke draft agar mahasiswa dapat mengedit lagi.'
                        : isCancelApproved
                            ? 'KRS yang sudah disetujui akan dibatalkan.'
                            : 'KRS mahasiswa akan ditolak.',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: nextStatus === 'approved'
                    ? 'Ya, setujui'
                    : isUnlock
                        ? 'Ya, buka kunci'
                        : isCancelApproved
                            ? 'Ya, batalkan'
                            : 'Ya, tolak',
                cancelButtonText: 'Batal',
                confirmButtonColor: nextStatus === 'approved' ? '#2563eb' : isUnlock ? '#059669' : '#dc2626',
            }).then((result) => {
                if (result.isConfirmed) submit();
            });
            return;
        }

        if (confirm(`Yakin ${actionLabel} KRS?`)) submit();
    };

    const columns = [
        { key: 'number', header: 'No', headerClassName: 'w-[56px]', cellClassName: 'font-medium text-slate-500', render: (_item, index) => index + 1 },
        { key: 'kode', header: 'Kode', render: (item) => <Badge variant="outline" className="bg-blue-50 font-mono text-blue-700">{item.kode_matkul || '-'}</Badge> },
        { key: 'mata_kuliah', header: 'Mata Kuliah', render: (item) => <span className="break-words font-semibold text-slate-900">{item.nama_matkul || '-'}</span> },
        { key: 'kelas', header: 'Kelas', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <Badge variant="outline" className="bg-violet-50 text-violet-700">Kelas {item.nama_kelas || '-'}</Badge> },
        { key: 'sks', header: 'SKS', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <Badge variant="outline" className="bg-emerald-50 text-emerald-700">{item.sks || 0} SKS</Badge> },
        { key: 'jadwal', header: 'Jadwal', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <span className="whitespace-nowrap text-sm text-slate-700">{item.hari || '-'}, {item.jam_mulai || '-'} - {item.jam_selesai || '-'}</span> },
        { key: 'ruang', header: 'Ruang', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <Badge variant="outline" className="bg-slate-50 font-mono text-slate-700">{item.ruang || '-'}</Badge> },
        { key: 'dosen', header: 'Dosen', render: (item) => <span className="break-words text-sm text-slate-700">{item.dosen || '-'}</span> },
    ];

    const renderCourseCard = (item, index, key) => (
        <Card key={key} className="rounded-lg border-slate-200 shadow-sm">
            <CardContent className="space-y-3 p-4">
                <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700">{index + 1}</div>
                    <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap gap-2">
                            <Badge variant="outline" className="bg-blue-50 font-mono text-blue-700">{item.kode_matkul || '-'}</Badge>
                            <Badge variant="outline" className="bg-violet-50 text-violet-700">Kelas {item.nama_kelas || '-'}</Badge>
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700">{item.sks || 0} SKS</Badge>
                        </div>
                        <p className="break-words font-semibold text-slate-950">{item.nama_matkul || '-'}</p>
                    </div>
                </div>
                <div className="grid gap-2 rounded-lg bg-slate-50 p-3 text-sm">
                    <p className="text-slate-600"><span className="font-medium text-slate-800">Dosen:</span> {item.dosen || '-'}</p>
                    <p className="text-slate-600"><span className="font-medium text-slate-800">Jadwal:</span> {item.hari || '-'}, {item.jam_mulai || '-'} - {item.jam_selesai || '-'}</p>
                    <p className="text-slate-600"><span className="font-medium text-slate-800">Ruang:</span> {item.ruang || '-'}</p>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <DosenLayout title="Detail ACC KRS">
            <Head title="Detail ACC KRS" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5">
                    <div>
                        <Link href={route('dosen.acc-krs.index')} className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke ACC KRS
                        </Link>
                        <PageHeader title={`KRS ${krs.mahasiswa?.nama || '-'}`} description={`${krs.mahasiswa?.nim || '-'} - ${krs.mahasiswa?.prodi?.nama_prodi || '-'}`}>
                            {krs.status === 'pending' ? (
                                <>
                                    <Button type="button" className="w-full gap-2 sm:w-auto" onClick={() => updateStatus('approved')}>
                                        <CheckCircle2 className="h-4 w-4" />
                                        Setujui
                                    </Button>
                                    <Button type="button" variant="outline" className="w-full gap-2 text-red-600 sm:w-auto" onClick={() => updateStatus('rejected')}>
                                        <XCircle className="h-4 w-4" />
                                        Tolak
                                    </Button>
                                    <Button type="button" variant="outline" className="w-full gap-2 text-emerald-600 sm:w-auto" onClick={() => updateStatus('draft')}>
                                        <LockOpen className="h-4 w-4" />
                                        Buka Edit
                                    </Button>
                                </>
                            ) : null}
                            {krs.status === 'approved' ? (
                                <>
                                    <Button type="button" variant="outline" className="w-full gap-2 text-emerald-600 sm:w-auto" onClick={() => updateStatus('draft')}>
                                        <LockOpen className="h-4 w-4" />
                                        Buka Edit
                                    </Button>
                                    <Button type="button" variant="outline" className="w-full gap-2 text-red-600 sm:w-auto" onClick={() => updateStatus('rejected')}>
                                        <XCircle className="h-4 w-4" />
                                        Batalkan KRS
                                    </Button>
                                </>
                            ) : null}
                            {krs.status === 'rejected' ? (
                                <Button type="button" variant="outline" className="w-full gap-2 text-emerald-600 sm:w-auto" onClick={() => updateStatus('draft')}>
                                    <LockOpen className="h-4 w-4" />
                                    Buka Edit
                                </Button>
                            ) : null}
                        </PageHeader>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <SummaryCard title="Total SKS" value={totalSks || 0} icon={BookOpen} tone="blue" />
                        <SummaryCard title="Mata Kuliah" value={mataKuliahList.length || 0} icon={FileText} tone="violet" />
                        <SummaryCard title="Semester" value={krs.semester || 0} icon={Users} tone="emerald" />
                        <SummaryCard title="Riwayat KRS" value={allKrsList.length || 1} icon={CheckCircle2} tone="amber" />
                    </div>

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="space-y-5 p-4 sm:p-5">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <InfoItem label="NIM" value={krs.mahasiswa?.nim} />
                                <InfoItem label="Nama" value={krs.mahasiswa?.nama} />
                                <InfoItem label="Program Studi" value={krs.mahasiswa?.prodi?.nama_prodi} />
                                <InfoItem label="Status KRS">
                                    <Badge variant="outline" className={getStatusBadge(krs.status)}>{getStatusLabel(krs.status)}</Badge>
                                </InfoItem>
                                <InfoItem label="Dosen Wali" value={krs.mahasiswa?.dosen_wali?.nama || '-'} />
                                <InfoItem label="Tanggal Pengisian" value={formatDate(krs.tanggal_pengisian)} />
                                <InfoItem label="Jumlah Mata Kuliah" value={`${mataKuliahList.length || 0} Mata Kuliah`} />
                                <InfoItem label="Total SKS" value={`${totalSks || 0} SKS`} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="p-4">
                            <div className="max-w-xl">
                                <p className="mb-2 text-sm font-semibold text-slate-700">Pilih Semester</p>
                                <SelectDropdown value={selectedKrsId} onChange={handleChangeSemester} options={semesterOptions} placeholder="Pilih semester..." isClearable={false} />
                            </div>
                        </CardContent>
                    </Card>

                    <DataTable
                        columns={columns}
                        data={mataKuliahList}
                        getRowKey={(item, index) => item.id_detail_krs || `${item.kode_matkul}-${item.nama_kelas}-${index}`}
                        emptyState={<EmptyState title="Tidak ada mata kuliah" description="Mahasiswa belum mengisi KRS untuk semester ini." />}
                        className="hidden lg:block"
                    />

                    <CardGrid
                        data={mataKuliahList}
                        getCardKey={(item, index) => item.id_detail_krs || `${item.kode_matkul}-${item.nama_kelas}-${index}`}
                        renderCard={renderCourseCard}
                        emptyState={<EmptyState title="Tidak ada mata kuliah" description="Mahasiswa belum mengisi KRS untuk semester ini." compact />}
                        className="grid gap-3 md:grid-cols-2 lg:hidden"
                        emptyClassName="lg:hidden"
                    />
                </div>
            </div>
        </DosenLayout>
    );
}
