import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, Pencil, Trash2, Users } from 'lucide-react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { CardGrid, DataTable, EmptyState, PageHeader, SummaryCard } from '@/Components/ui/data-display';

const formatTime = (value) => value?.substring(0, 5) || '-';
const course = (kelas) => kelas.mata_kuliah_periode?.mata_kuliah;
const period = (kelas) => kelas.mata_kuliah_periode;
const roomLabel = (kelas) => kelas.ruangan?.kode_ruangan || kelas.ruang_kelas || '-';

const InfoItem = ({ label, value, children }) => (
    <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        {children || <p className="mt-1 break-words text-sm font-semibold text-slate-900">{value || '-'}</p>}
    </div>
);

export default function Show({ kelas, mahasiswa = [], isArchived = false }) {
    const progress = kelas.kapasitas ? Math.min(100, Math.round((mahasiswa.length / kelas.kapasitas) * 100)) : 0;
    const isFull = mahasiswa.length >= (kelas.kapasitas || 0);

    const handleDelete = () => {
        const destroy = () => router.delete(route('baak.kelas.destroy', kelas.id_kelas));

        if (window.Swal) {
            window.Swal.fire({
                title: 'Hapus Kelas?',
                html: `Apakah Anda yakin ingin menghapus kelas <strong>${course(kelas)?.nama_matkul || '-'} - ${kelas.nama_kelas}</strong>?`,
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

        if (confirm(`Hapus kelas "${course(kelas)?.nama_matkul || '-'} - ${kelas.nama_kelas}"?`)) destroy();
    };

    const columns = [
        { key: 'number', header: 'No', headerClassName: 'w-[56px]', cellClassName: 'font-medium text-slate-500', render: (_item, index) => index + 1 },
        { key: 'nim', header: 'NIM', render: (item) => <span className="font-mono text-sm font-semibold text-slate-900">{item.nim || '-'}</span> },
        { key: 'nama', header: 'Nama Mahasiswa', render: (item) => <span className="break-words font-semibold text-slate-900">{item.nama || '-'}</span> },
        { key: 'prodi', header: 'Program Studi', render: (item) => <span className="break-words text-sm text-slate-700">{item.prodi?.nama_prodi || '-'}</span> },
        { key: 'semester', header: 'Semester', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <Badge variant="outline" className="bg-blue-50 text-blue-700">Semester {item.semester_aktif || '-'}</Badge> },
    ];

    const renderMahasiswaCard = (item, index, key) => (
        <Card key={key} className="rounded-lg border-slate-200 shadow-sm">
            <CardContent className="space-y-3 p-4">
                <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700">
                        {index + 1}
                    </div>
                    <div className="min-w-0">
                        <p className="break-words font-semibold text-slate-950">{item.nama || '-'}</p>
                        <p className="font-mono text-sm text-slate-500">{item.nim || '-'}</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-slate-50 text-slate-700">{item.prodi?.nama_prodi || '-'}</Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">Sem {item.semester_aktif || '-'}</Badge>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <BaakLayout title="Detail Kelas">
            <Head title="Detail Kelas" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5">
                    <div>
                        <Link href={isArchived ? route('baak.kelas.arsip') : route('baak.kelas.index')} className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
                            <ArrowLeft className="h-4 w-4" />
                            {isArchived ? 'Kembali ke Arsip' : 'Kembali ke Daftar'}
                        </Link>
                        <PageHeader
                            title={`${course(kelas)?.nama_matkul || '-'} - Kelas ${kelas.nama_kelas}`}
                            description={`${course(kelas)?.kode_matkul || '-'} - ${period(kelas)?.prodi?.nama_prodi || '-'}`}
                        />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <SummaryCard title="Mahasiswa" value={mahasiswa.length} icon={Users} tone="blue" />
                        <SummaryCard title="Kapasitas" value={kelas.kapasitas || 0} icon={Users} tone="emerald" />
                        <SummaryCard title="Terisi (%)" value={progress} icon={CalendarDays} tone="violet" />
                        <SummaryCard title="SKS" value={course(kelas)?.sks || 0} icon={CalendarDays} tone="amber" />
                    </div>

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="space-y-5 p-4 sm:p-5">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div className="min-w-0">
                                    <div className="mb-2 flex flex-wrap gap-2">
                                        <Badge variant="outline" className="bg-blue-50 font-mono text-blue-700">{course(kelas)?.kode_matkul || '-'}</Badge>
                                        <Badge variant="outline" className={isFull ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}>
                                            {isFull ? 'Penuh' : 'Tersedia'}
                                        </Badge>
                                    </div>
                                    <h2 className="break-words text-lg font-bold text-slate-950">Informasi Kelas</h2>
                                    <p className="mt-1 text-sm text-slate-500">Detail kelas, dosen pengampu, jadwal, dan kapasitas.</p>
                                </div>
                                {!isArchived && (
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        <Link href={route('baak.kelas.edit', kelas.id_kelas)}>
                                            <Button variant="outline" className="w-full gap-2 text-amber-600">
                                                <Pencil className="h-4 w-4" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button type="button" variant="outline" className="w-full gap-2 text-red-600" onClick={handleDelete}>
                                            <Trash2 className="h-4 w-4" />
                                            Hapus
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <InfoItem label="Periode" value={`${period(kelas)?.tahun_ajaran || '-'} - ${period(kelas)?.jenis_semester || '-'}`} />
                                <InfoItem label="Ditawarkan di" value={`Semester ${period(kelas)?.semester_ditawarkan || '-'}`} />
                                <InfoItem label="Dosen Pengampu" value={kelas.dosen?.nama || '-'} />
                                <InfoItem label="Jadwal" value={`${kelas.hari || '-'}, ${formatTime(kelas.jam_mulai)} - ${formatTime(kelas.jam_selesai)}`} />
                                <InfoItem label="Ruangan" value={roomLabel(kelas)} />
                                <InfoItem label="Kategori" value={course(kelas)?.kategori || '-'} />
                                <InfoItem label="NIP Dosen" value={kelas.dosen?.nip || '-'} />
                                <InfoItem label="Prodi Dosen" value={kelas.dosen?.prodi?.nama_prodi || '-'} />
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="font-medium text-slate-700">Kapasitas Terpakai</span>
                                    <span className="font-semibold text-slate-900">{mahasiswa.length}/{kelas.kapasitas || 0}</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div className={`h-full rounded-full ${isFull ? 'bg-red-500' : progress >= 75 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="border-b border-slate-100 p-4 sm:p-5">
                            <h2 className="text-lg font-bold text-slate-950">Daftar Mahasiswa ({mahasiswa.length})</h2>
                        </CardContent>
                    </Card>

                    <DataTable
                        columns={columns}
                        data={mahasiswa}
                        getRowKey={(item, index) => item.id_mahasiswa || item.nim || index}
                        emptyState={<EmptyState title="Belum ada mahasiswa" description="Belum ada mahasiswa yang mengambil kelas ini." />}
                        className="hidden lg:block"
                    />

                    <CardGrid
                        data={mahasiswa}
                        getCardKey={(item, index) => item.id_mahasiswa || item.nim || index}
                        renderCard={renderMahasiswaCard}
                        emptyState={<EmptyState title="Belum ada mahasiswa" description="Belum ada mahasiswa yang mengambil kelas ini." compact />}
                        className="grid gap-3 md:grid-cols-2 lg:hidden"
                        emptyClassName="lg:hidden"
                    />
                </div>
            </div>
        </BaakLayout>
    );
}
