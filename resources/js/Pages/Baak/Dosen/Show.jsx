import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, BookOpen, GraduationCap, KeyRound, Mail, Pencil, Phone, UserCheck, UserCircle, UsersRound } from 'lucide-react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { CardGrid, DataTable, EmptyState, PageHeader, SummaryCard } from '@/Components/ui/data-display';

const getGenderBadge = (gender) => {
    if (gender === 'Laki-laki') return 'bg-blue-50 text-blue-700 border-blue-200';
    if (gender === 'Perempuan') return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
};

const getStatusBadge = (status) => {
    const badges = {
        aktif: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        lulus: 'bg-blue-50 text-blue-700 border-blue-200',
        keluar: 'bg-amber-50 text-amber-700 border-amber-200',
        DO: 'bg-red-50 text-red-700 border-red-200',
    };

    return badges[status] || 'bg-slate-50 text-slate-700 border-slate-200';
};

const formatTime = (time) => (time ? time.substring(0, 5) : '-');

const InfoItem = ({ label, value, className = '' }) => (
    <div className={`min-w-0 ${className}`}>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-slate-900">{value || '-'}</p>
    </div>
);

export default function Show({ dosen }) {
    const [activeTab, setActiveTab] = useState('biodata');

    const handleResetPassword = () => {
        const resetPassword = () => {
            router.post(route('baak.dosen.reset-password', dosen.id_dosen), {}, { preserveScroll: true });
        };

        if (window.Swal) {
            window.Swal.fire({
                title: 'Reset Password?',
                text: `Password akan direset ke NIP: ${dosen.nip || '-'}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, Reset!',
                cancelButtonText: 'Batal',
                confirmButtonColor: '#3b82f6',
            }).then((result) => {
                if (result.isConfirmed) resetPassword();
            });
            return;
        }

        if (confirm(`Reset password ke NIP: ${dosen.nip || '-'}?`)) resetPassword();
    };

    const tabs = [
        { key: 'biodata', label: 'Biodata' },
        { key: 'kelas', label: 'Kelas Diampu' },
        { key: 'mahasiswa', label: 'Mahasiswa Bimbingan' },
    ];

    const summaryCards = [
        { title: 'Kelas Diampu', value: dosen.kelas_count || 0, icon: BookOpen, tone: 'blue' },
        { title: 'Mahasiswa Bimbingan', value: dosen.mahasiswa_bimbingan_count || 0, icon: UsersRound, tone: 'violet' },
        { title: 'Program Studi', value: dosen.prodi ? 1 : 0, icon: GraduationCap, tone: 'emerald' },
        { title: 'Status Akun', value: dosen.user ? 1 : 0, icon: UserCheck, tone: 'amber' },
    ];

    const biodataItems = [
        { label: 'NIP', value: dosen.nip || '-' },
        { label: 'Nama Lengkap', value: dosen.nama || '-' },
        { label: 'Email', value: dosen.user?.email || '-' },
        { label: 'Nomor HP', value: dosen.no_hp || '-' },
        { label: 'Jenis Kelamin', value: dosen.jenis_kelamin || '-' },
        { label: 'Program Studi', value: dosen.prodi?.nama_prodi || '-' },
        { label: 'Jenjang', value: dosen.prodi?.jenjang || '-' },
        { label: 'Alamat', value: dosen.alamat || '-', className: 'md:col-span-2' },
    ];

    const kelasColumns = [
        { key: 'number', header: 'No', headerClassName: 'w-[64px]', cellClassName: 'font-medium text-slate-500', render: (_item, index) => index + 1 },
        { key: 'kode', header: 'Kode MK', render: (item) => <span className="font-mono font-semibold text-blue-700">{item.mata_kuliah_periode?.mata_kuliah?.kode_matkul || '-'}</span> },
        { key: 'mata_kuliah', header: 'Mata Kuliah', render: (item) => <span className="font-semibold text-slate-900">{item.mata_kuliah_periode?.mata_kuliah?.nama_matkul || '-'}</span> },
        { key: 'kelas', header: 'Kelas', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => item.nama_kelas || '-' },
        { key: 'sks', header: 'SKS', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => item.mata_kuliah_periode?.mata_kuliah?.sks || 0 },
        { key: 'hari', header: 'Hari', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => item.hari || '-' },
        { key: 'jam', header: 'Jam', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => `${formatTime(item.jam_mulai)} - ${formatTime(item.jam_selesai)}` },
        { key: 'ruang', header: 'Ruang', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => item.ruang_kelas || '-' },
    ];

    const mahasiswaColumns = [
        { key: 'number', header: 'No', headerClassName: 'w-[64px]', cellClassName: 'font-medium text-slate-500', render: (_item, index) => index + 1 },
        { key: 'nim', header: 'NIM', render: (item) => <span className="font-mono font-semibold text-blue-700">{item.nim || '-'}</span> },
        { key: 'nama', header: 'Nama Mahasiswa', render: (item) => <span className="font-semibold text-slate-900">{item.nama || '-'}</span> },
        { key: 'angkatan', header: 'Angkatan', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => (item.nim ? `20${item.nim.substring(0, 2)}` : '-') },
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
    ];

    const renderKelasCard = (kelas, index, key) => (
        <Card key={key} className="rounded-lg border-slate-200 shadow-sm">
            <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-400">#{index + 1}</p>
                        <p className="break-words font-semibold text-slate-950">{kelas.mata_kuliah_periode?.mata_kuliah?.nama_matkul || '-'}</p>
                        <p className="mt-0.5 font-mono text-xs text-blue-700">{kelas.mata_kuliah_periode?.mata_kuliah?.kode_matkul || '-'}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0 bg-violet-50 text-violet-700 border-violet-200">
                        {kelas.mata_kuliah_periode?.mata_kuliah?.sks || 0} SKS
                    </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3 text-sm">
                    <InfoItem label="Kelas" value={kelas.nama_kelas} />
                    <InfoItem label="Hari" value={kelas.hari} />
                    <InfoItem label="Jam" value={`${formatTime(kelas.jam_mulai)} - ${formatTime(kelas.jam_selesai)}`} />
                    <InfoItem label="Ruang" value={kelas.ruang_kelas} />
                </div>
            </CardContent>
        </Card>
    );

    const renderMahasiswaCard = (mhs, index, key) => (
        <Card key={key} className="rounded-lg border-slate-200 shadow-sm">
            <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-400">#{index + 1}</p>
                        <p className="break-words font-semibold text-slate-950">{mhs.nama || '-'}</p>
                        <p className="mt-0.5 font-mono text-xs text-blue-700">{mhs.nim || '-'}</p>
                    </div>
                    <Badge variant="outline" className={`shrink-0 ${getStatusBadge(mhs.status)}`}>
                        {mhs.status?.toUpperCase() || '-'}
                    </Badge>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                    <InfoItem label="Angkatan" value={mhs.nim ? `20${mhs.nim.substring(0, 2)}` : '-'} />
                </div>
            </CardContent>
        </Card>
    );

    return (
        <BaakLayout title="Detail Dosen">
            <Head title={`Detail ${dosen.nama}`} />

            <div className="min-h-screen min-w-0 bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full min-w-0 max-w-[1440px] space-y-4 md:space-y-5">
                    <div className="min-w-0">
                        <Link href={route('baak.dosen.index')} className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Daftar Dosen
                        </Link>
                        <PageHeader
                            title="Detail Dosen"
                            description="Informasi lengkap dosen dan aktivitas akademik."
                            actionHref={route('baak.dosen.edit', dosen.id_dosen)}
                            actionLabel="Edit Data"
                            actionIcon={Pencil}
                        />
                    </div>

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
                            <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-blue-50 shadow-sm lg:mx-0">
                                {dosen.foto ? (
                                    <img src={`/storage/${dosen.foto}`} alt={dosen.nama} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-blue-400">
                                        <UserCircle className="h-14 w-14" />
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0 text-center lg:text-left">
                                <div className="mb-2 flex flex-wrap justify-center gap-1.5 lg:justify-start">
                                    <Badge variant="outline" className="bg-blue-50 font-mono text-blue-700">
                                        {dosen.nip || '-'}
                                    </Badge>
                                    <Badge variant="outline" className={getGenderBadge(dosen.jenis_kelamin)}>
                                        {dosen.jenis_kelamin || '-'}
                                    </Badge>
                                </div>
                                <h2 className="break-words text-xl font-bold text-slate-950 sm:text-2xl">{dosen.nama}</h2>
                                <div className="mt-2 grid gap-1 text-sm text-slate-500">
                                    <p className="flex min-w-0 items-center justify-center gap-1.5 lg:justify-start">
                                        <GraduationCap className="h-4 w-4 shrink-0 text-slate-400" />
                                        <span className="break-words">{dosen.prodi?.nama_prodi || '-'}</span>
                                    </p>
                                    <p className="flex min-w-0 items-center justify-center gap-1.5 lg:justify-start">
                                        <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                                        <span className="break-all">{dosen.user?.email || '-'}</span>
                                    </p>
                                    {dosen.no_hp ? (
                                        <p className="flex items-center justify-center gap-1.5 lg:justify-start">
                                            <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                                            <span>{dosen.no_hp}</span>
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            <Button type="button" variant="outline" className="w-full gap-2 border-amber-200 text-amber-700 hover:bg-amber-50 lg:w-auto" onClick={handleResetPassword}>
                                <KeyRound className="h-4 w-4" />
                                Reset Password
                            </Button>
                        </CardContent>
                    </Card>

                    <section className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                        {summaryCards.map((card) => (
                            <SummaryCard key={card.title} {...card} />
                        ))}
                    </section>

                    <section className="min-w-0 max-w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                        <div className="min-w-0 max-w-full border-b border-slate-100">
                            <div className="flex min-w-0 max-w-full snap-x overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:thin]">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`shrink-0 snap-start whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition sm:px-5 ${
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
                            {activeTab === 'biodata' ? (
                                <div className="grid gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
                                    {biodataItems.map((item) => (
                                        <InfoItem key={item.label} label={item.label} value={item.value} className={item.className} />
                                    ))}
                                </div>
                            ) : null}

                            {activeTab === 'kelas' ? (
                                <div className="space-y-4">
                                    <DataTable
                                        columns={kelasColumns}
                                        data={dosen.kelas || []}
                                        getRowKey={(item, index) => item.id_kelas || index}
                                        emptyState={<EmptyState title="Belum ada kelas" description="Dosen belum mengampu kelas semester ini." />}
                                        className="hidden lg:block"
                                        asCard={false}
                                    />
                                    <CardGrid
                                        data={dosen.kelas || []}
                                        getCardKey={(item, index) => item.id_kelas || index}
                                        renderCard={renderKelasCard}
                                        emptyState={<EmptyState title="Belum ada kelas" description="Dosen belum mengampu kelas semester ini." compact />}
                                        className="grid gap-3 md:grid-cols-2 lg:hidden"
                                        emptyClassName="lg:hidden"
                                    />
                                </div>
                            ) : null}

                            {activeTab === 'mahasiswa' ? (
                                <div className="space-y-4">
                                    <DataTable
                                        columns={mahasiswaColumns}
                                        data={dosen.mahasiswa_bimbingan || []}
                                        getRowKey={(item, index) => item.id_mahasiswa || index}
                                        emptyState={<EmptyState title="Belum ada mahasiswa bimbingan" description="Dosen belum menjadi dosen wali mahasiswa." />}
                                        className="hidden lg:block"
                                        asCard={false}
                                    />
                                    <CardGrid
                                        data={dosen.mahasiswa_bimbingan || []}
                                        getCardKey={(item, index) => item.id_mahasiswa || index}
                                        renderCard={renderMahasiswaCard}
                                        emptyState={<EmptyState title="Belum ada mahasiswa bimbingan" description="Dosen belum menjadi dosen wali mahasiswa." compact />}
                                        className="grid gap-3 md:grid-cols-2 lg:hidden"
                                        emptyClassName="lg:hidden"
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
