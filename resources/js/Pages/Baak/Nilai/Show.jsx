import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Download, Lock, LockOpen, Percent, Users, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import BaakLayout from '@/Layouts/BaakLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { CardGrid, DataTable, EmptyState, PageHeader, SummaryCard } from '@/Components/ui/data-display';

const getGradeBadgeColor = (grade) => {
    if (!grade) return 'border-slate-200 bg-slate-50 text-slate-700';
    if (['A', 'A-'].includes(grade)) return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    if (['B+', 'B', 'B-'].includes(grade)) return 'border-blue-200 bg-blue-50 text-blue-700';
    if (['C+', 'C'].includes(grade)) return 'border-amber-200 bg-amber-50 text-amber-700';
    if (grade === 'D') return 'border-orange-200 bg-orange-50 text-orange-700';
    return 'border-red-200 bg-red-50 text-red-700';
};

const formatScore = (value, decimals = 0) => (value !== null && value !== undefined ? Number(value).toFixed(decimals) : '-');
const course = (kelas) => kelas.mata_kuliah_periode?.mata_kuliah;

const InfoItem = ({ label, value, children }) => (
    <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        {children || <p className="mt-1 break-words text-sm font-semibold text-slate-900">{value || '-'}</p>}
    </div>
);

export default function Show({ kelas, nilaiList = [], isLocked }) {
    const stats = {
        total: nilaiList.length,
        sudahDiinput: nilaiList.filter((item) => item.nilai_akhir !== null).length,
        belumDiinput: nilaiList.filter((item) => item.nilai_akhir === null).length,
    };
    stats.persentase = stats.total > 0 ? Number(((stats.sudahDiinput / stats.total) * 100).toFixed(1)) : 0;

    const handleToggleLock = () => {
        const action = isLocked ? 'unlock' : 'lock';
        const actionText = isLocked ? 'Unlock' : 'Lock';
        const confirmText = isLocked
            ? 'Dosen akan dapat mengedit nilai kembali.'
            : 'Nilai tidak dapat diubah kecuali di-unlock oleh BAAK.';

        Swal.fire({
            title: `${actionText} Nilai?`,
            text: confirmText,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: isLocked ? '#3b82f6' : '#16a34a',
            cancelButtonColor: '#6b7280',
            confirmButtonText: `Ya, ${actionText}!`,
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (!result.isConfirmed) return;

            router.post(route('baak.nilai.toggle-lock', kelas.id_kelas), {}, { preserveScroll: true });
        });
    };

    const handleExport = () => {
        Swal.fire({
            icon: 'info',
            title: 'Coming Soon',
            text: 'Fitur export nilai akan segera tersedia',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3B82F6',
        });
    };

    const columns = [
        { key: 'number', header: 'No', headerClassName: 'w-[56px]', cellClassName: 'font-medium text-slate-500', render: (_item, index) => index + 1 },
        { key: 'nim', header: 'NIM', render: (item) => <span className="font-mono text-sm font-semibold text-slate-900">{item.nim || '-'}</span> },
        { key: 'nama', header: 'Nama Mahasiswa', render: (item) => <span className="break-words font-semibold text-slate-900">{item.nama || '-'}</span> },
        { key: 'tugas', header: 'Tugas', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => formatScore(item.nilai_tugas) },
        { key: 'uts', header: 'UTS', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => formatScore(item.nilai_uts) },
        { key: 'uas', header: 'UAS', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => formatScore(item.nilai_uas) },
        { key: 'akhir', header: 'Nilai Akhir', headerClassName: 'text-center', cellClassName: 'text-center font-semibold text-slate-900', render: (item) => formatScore(item.nilai_akhir, 2) },
        {
            key: 'grade',
            header: 'Grade',
            headerClassName: 'text-center',
            cellClassName: 'text-center',
            render: (item) => item.nilai_huruf ? <Badge variant="outline" className={getGradeBadgeColor(item.nilai_huruf)}>{item.nilai_huruf}</Badge> : <span className="text-slate-400">-</span>,
        },
    ];

    const renderNilaiCard = (item, index, key) => (
        <Card key={key} className="rounded-lg border-slate-200 shadow-sm">
            <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700">
                            {index + 1}
                        </div>
                        <div className="min-w-0">
                            <p className="break-words font-semibold text-slate-950">{item.nama || '-'}</p>
                            <p className="font-mono text-sm text-slate-500">{item.nim || '-'}</p>
                        </div>
                    </div>
                    {item.nilai_huruf ? <Badge variant="outline" className={getGradeBadgeColor(item.nilai_huruf)}>{item.nilai_huruf}</Badge> : null}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-lg bg-slate-50 p-2">
                        <p className="text-xs text-slate-500">Tugas</p>
                        <p className="font-semibold text-slate-900">{formatScore(item.nilai_tugas)}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2">
                        <p className="text-xs text-slate-500">UTS</p>
                        <p className="font-semibold text-slate-900">{formatScore(item.nilai_uts)}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2">
                        <p className="text-xs text-slate-500">UAS</p>
                        <p className="font-semibold text-slate-900">{formatScore(item.nilai_uas)}</p>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-2">
                        <p className="text-xs text-blue-600">Nilai Akhir</p>
                        <p className="font-semibold text-blue-950">{formatScore(item.nilai_akhir, 2)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <BaakLayout title="Detail Nilai">
            <Head title="Detail Nilai" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5">
                    <div>
                        <Link href={route('baak.nilai.index')} className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Daftar Nilai
                        </Link>
                        <PageHeader title={`Nilai ${course(kelas)?.nama_matkul || '-'}`} description={`${course(kelas)?.kode_matkul || '-'} - Kelas ${kelas.nama_kelas || '-'} - ${kelas.dosen?.nama || '-'}`} />
                    </div>

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="space-y-5 p-4 sm:p-5">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <InfoItem label="Kode Mata Kuliah" value={course(kelas)?.kode_matkul} />
                                <InfoItem label="Mata Kuliah" value={course(kelas)?.nama_matkul} />
                                <InfoItem label="Kelas" value={`Kelas ${kelas.nama_kelas || '-'}`} />
                                <InfoItem label="Dosen Pengampu" value={kelas.dosen?.nama} />
                            </div>

                            {kelas.bobot_nilai ? (
                                <div className="grid gap-2 rounded-lg bg-slate-50 p-3 text-sm sm:grid-cols-3">
                                    <p className="text-slate-600"><span className="font-medium text-slate-800">Tugas:</span> {kelas.bobot_nilai.bobot_tugas}%</p>
                                    <p className="text-slate-600"><span className="font-medium text-slate-800">UTS:</span> {kelas.bobot_nilai.bobot_uts}%</p>
                                    <p className="text-slate-600"><span className="font-medium text-slate-800">UAS:</span> {kelas.bobot_nilai.bobot_uas}%</p>
                                </div>
                            ) : null}
                        </CardContent>
                    </Card>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <SummaryCard title="Total Mahasiswa" value={stats.total} icon={Users} tone="blue" />
                        <SummaryCard title="Sudah Diinput" value={stats.sudahDiinput} icon={CheckCircle2} tone="emerald" />
                        <SummaryCard title="Belum Diinput" value={stats.belumDiinput} icon={XCircle} tone="amber" />
                        <SummaryCard title="Progress (%)" value={stats.persentase} icon={Percent} tone="violet" />
                    </div>

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="space-y-4 p-4 sm:p-5">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div className="min-w-0">
                                    <h2 className="text-lg font-bold text-slate-950">Daftar Nilai Mahasiswa</h2>
                                    <div className="mt-2">
                                        <Badge variant="outline" className={isLocked ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-700'}>
                                            {isLocked ? 'Locked' : 'Unlocked'}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    <Button
                                        type="button"
                                        className={`w-full gap-2 ${isLocked ? '' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                                        onClick={handleToggleLock}
                                        disabled={stats.sudahDiinput === 0}
                                    >
                                        {isLocked ? <LockOpen className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                                        {isLocked ? 'Unlock Nilai' : 'Lock Nilai'}
                                    </Button>
                                    <Button type="button" variant="outline" className="w-full gap-2" onClick={handleExport}>
                                        <Download className="h-4 w-4" />
                                        Export
                                    </Button>
                                </div>
                            </div>

                            {isLocked ? (
                                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                                    Nilai sudah di-lock. Dosen tidak dapat mengedit nilai sampai dibuka kembali.
                                </div>
                            ) : stats.sudahDiinput > 0 ? (
                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                                    Nilai belum di-lock. Dosen masih dapat mengedit nilai.
                                </div>
                            ) : null}
                        </CardContent>
                    </Card>

                    <DataTable
                        columns={columns}
                        data={nilaiList}
                        getRowKey={(item, index) => item.nim || index}
                        emptyState={<EmptyState title="Tidak ada data mahasiswa" description="Belum ada nilai mahasiswa untuk kelas ini." />}
                        className="hidden lg:block"
                    />

                    <CardGrid
                        data={nilaiList}
                        getCardKey={(item, index) => item.nim || index}
                        renderCard={renderNilaiCard}
                        emptyState={<EmptyState title="Tidak ada data mahasiswa" description="Belum ada nilai mahasiswa untuk kelas ini." compact />}
                        className="grid gap-3 md:grid-cols-2 lg:hidden"
                        emptyClassName="lg:hidden"
                    />
                </div>
            </div>
        </BaakLayout>
    );
}
