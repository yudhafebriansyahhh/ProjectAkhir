import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Building2, CalendarDays, Pencil, Users } from 'lucide-react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { EmptyState, PageHeader, SummaryCard } from '@/Components/ui/data-display';

const StatusBadge = ({ active }) => (
    <Badge variant="outline" className={active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-700 border-slate-200'}>
        {active ? 'Aktif' : 'Nonaktif'}
    </Badge>
);

const InfoItem = ({ label, value }) => (
    <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-slate-900">{value || '-'}</p>
    </div>
);

export default function Show({ ruangan, jadwal = {}, days = [] }) {
    const usedDays = days.filter((day) => (jadwal[day] || []).length > 0).length;

    return (
        <BaakLayout title="Detail Ruangan">
            <Head title={`Ruangan ${ruangan.kode_ruangan}`} />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5">
                    <div>
                        <Link href={route('baak.ruangan.index')} className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Daftar Ruangan
                        </Link>
                        <PageHeader
                            title={`Ruangan ${ruangan.kode_ruangan}`}
                            description="Jadwal pemakaian ruangan dari Senin sampai Sabtu."
                            actionHref={route('baak.ruangan.edit', ruangan.id_ruangan)}
                            actionLabel="Edit Ruangan"
                            actionIcon={Pencil}
                        />
                    </div>

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                            <div className="min-w-0">
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                    <StatusBadge active={ruangan.is_active} />
                                    {ruangan.gedung ? <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{ruangan.gedung}</Badge> : null}
                                </div>
                                <h2 className="break-words text-xl font-bold text-slate-950 sm:text-2xl">{ruangan.nama_ruangan}</h2>
                                {ruangan.keterangan ? <p className="mt-2 text-sm text-slate-500">{ruangan.keterangan}</p> : null}
                            </div>
                            <div className="grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3 text-sm sm:min-w-[320px]">
                                <InfoItem label="Kode" value={ruangan.kode_ruangan} />
                                <InfoItem label="Lantai" value={ruangan.lantai ?? '-'} />
                                <InfoItem label="Kapasitas" value={ruangan.kapasitas ? `${ruangan.kapasitas} Orang` : '-'} />
                                <InfoItem label="Total Kelas" value={`${ruangan.kelas_count || 0} Kelas`} />
                            </div>
                        </CardContent>
                    </Card>

                    <section className="grid gap-3 sm:grid-cols-3">
                        <SummaryCard title="Total Jadwal" value={ruangan.kelas_count || 0} icon={CalendarDays} tone="blue" />
                        <SummaryCard title="Hari Terpakai" value={usedDays} icon={Building2} tone="violet" />
                        <SummaryCard title="Kapasitas" value={ruangan.kapasitas || 0} icon={Users} tone="emerald" />
                    </section>

                    <section className="grid gap-3 lg:grid-cols-2">
                        {days.map((day) => {
                            const daySchedule = jadwal[day] || [];

                            return (
                                <Card key={day} className="rounded-lg border-slate-200 shadow-sm">
                                    <CardContent className="p-4">
                                        <div className="mb-3 flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                                            <h3 className="font-bold text-slate-950">{day}</h3>
                                            <Badge variant="outline" className={daySchedule.length ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-600 border-slate-200'}>
                                                {daySchedule.length} Jadwal
                                            </Badge>
                                        </div>

                                        {daySchedule.length ? (
                                            <div className="space-y-3">
                                                {daySchedule.map((item) => (
                                                    <div key={item.id_kelas} className="rounded-lg border border-slate-200 bg-white p-3">
                                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                            <div className="min-w-0">
                                                                <p className="break-words font-semibold text-slate-950">{item.mata_kuliah || '-'}</p>
                                                                <p className="mt-0.5 text-xs text-slate-500">
                                                                    {item.kode_matkul || '-'} - Kelas {item.nama_kelas || '-'}
                                                                </p>
                                                                <p className="mt-1 text-sm text-slate-600">{item.dosen || '-'}</p>
                                                            </div>
                                                            <Badge variant="outline" className="shrink-0 bg-emerald-50 text-emerald-700 border-emerald-200">
                                                                {item.jam_mulai || '-'} - {item.jam_selesai || '-'}
                                                            </Badge>
                                                        </div>
                                                        <Link href={route('baak.kelas.show', item.id_kelas)} className="mt-3 inline-flex">
                                                            <Button variant="outline" size="sm" className="text-blue-600">Lihat Kelas</Button>
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <EmptyState title="Tidak ada jadwal" description={`Ruangan tidak dipakai pada hari ${day}.`} compact />
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </section>
                </div>
            </div>
        </BaakLayout>
    );
}
