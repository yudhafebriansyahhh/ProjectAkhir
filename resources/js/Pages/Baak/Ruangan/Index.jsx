import { Fragment, useEffect, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Building2, CalendarDays, Eye, Pencil, RefreshCcw, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { CardGrid, DataTable, EmptyState, PageHeader, Pagination, SearchInput, SummaryCard } from '@/Components/ui/data-display';
import { SelectDropdown } from '@/Components/ui/select-dropdown';

const statusOptions = [
    { value: 'aktif', label: 'Aktif' },
    { value: 'nonaktif', label: 'Nonaktif' },
];

const timeSlots = [
    { label: '7.00 - 8.00', start: 7 * 60, end: 8 * 60 },
    { label: '8.00 - 9.00', start: 8 * 60, end: 9 * 60 },
    { label: '9.00 - 10.00', start: 9 * 60, end: 10 * 60 },
    { label: '10.00 - 11.00', start: 10 * 60, end: 11 * 60 },
    { label: '11.00 - 12.00', start: 11 * 60, end: 12 * 60 },
    { label: '12.00 - 13.00', start: 12 * 60, end: 13 * 60 },
    { label: '13.00 - 14.00', start: 13 * 60, end: 14 * 60 },
    { label: '14.00 - 15.00', start: 14 * 60, end: 15 * 60 },
    { label: '15.00 - 16.00', start: 15 * 60, end: 16 * 60 },
    { label: '16.00 - 17.00', start: 16 * 60, end: 17 * 60 },
    { label: '17.00 - 18.00', start: 17 * 60, end: 18 * 60 },
    { label: '18.00 - 19.00', start: 18 * 60, end: 19 * 60 },
    { label: '19.00 - 20.00', start: 19 * 60, end: 20 * 60 },
    { label: '20.00 - 21.00', start: 20 * 60, end: 21 * 60 },
];

const scheduleDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const tabs = [
    { key: 'daftar', label: 'Daftar Ruangan' },
    { key: 'jadwal', label: 'Jadwal Ruangan' },
];

const eventTones = [
    'bg-sky-200 text-blue-950',
    'bg-violet-500 text-white',
    'bg-lime-200 text-green-950',
    'bg-rose-200 text-red-950',
    'bg-amber-200 text-amber-950',
    'bg-cyan-200 text-cyan-950',
    'bg-fuchsia-300 text-fuchsia-950',
    'bg-red-600 text-white',
    'bg-black text-white',
    'bg-emerald-200 text-emerald-950',
    'bg-purple-300 text-purple-950',
    'bg-slate-300 text-slate-950',
];

const parseTime = (value) => {
    if (!value) return null;
    const [hours, minutes] = value.split(':').map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
    return hours * 60 + minutes;
};

const floorToSlot = (minutes) => {
    if (minutes === null) return null;
    return timeSlots.reduce((current, slot) => (minutes >= slot.start ? slot.start : current), timeSlots[0].start);
};

const getEventTone = (event) => eventTones[(event.id_kelas || 0) % eventTones.length];

const StatusBadge = ({ active }) => (
    <Badge variant="outline" className={active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-700 border-slate-200'}>
        {active ? 'Aktif' : 'Nonaktif'}
    </Badge>
);

function ScheduleMatrix({ rooms = [], days = [] }) {
    const eventMap = new Map();
    const coveredMap = new Set();

    rooms.forEach((room) => {
        (room.kelas || []).forEach((event) => {
            const startMinutes = parseTime(event.jam_mulai);
            const endMinutes = parseTime(event.jam_selesai);
            const startSlot = floorToSlot(startMinutes);
            if (startSlot === null || endMinutes === null) return;

            const rowSpan = Math.max(1, Math.ceil((endMinutes - startSlot) / 60));
            const normalized = { ...event, rowSpan };
            eventMap.set(`${event.hari}-${room.id_ruangan}-${startSlot}`, normalized);

            timeSlots.forEach((slot) => {
                if (slot.start > startSlot && slot.start < endMinutes) {
                    coveredMap.add(`${event.hari}-${room.id_ruangan}-${slot.start}`);
                }
            });
        });
    });

    return (
        <Card className="overflow-hidden rounded-lg border-slate-200 shadow-sm">
            <CardContent className="p-0">
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                    <h2 className="text-base font-bold text-slate-950">Jadwal Pemakaian Ruangan</h2>
                </div>

                {rooms.length ? (
                    <div className="max-h-[720px] overflow-auto">
                        <table className="border-collapse text-sm">
                            <tbody>
                                {days.map((day) => (
                                    <Fragment key={day}>
                                        <tr key={`${day}-header`}>
                                            <th className="sticky left-0 z-30 h-8 w-[112px] min-w-[112px] border border-slate-900 bg-slate-300 px-3 text-center font-bold text-slate-950">
                                                Jam
                                            </th>
                                            <th className="sticky left-[112px] z-30 h-8 w-[96px] min-w-[96px] border border-slate-900 bg-slate-300 px-2 text-center font-bold uppercase text-slate-950">
                                                {day}
                                            </th>
                                            {rooms.map((room) => (
                                                <th key={`${day}-${room.id_ruangan}-head`} className="h-8 min-w-[138px] border border-slate-900 bg-orange-100 px-2 text-center font-bold text-slate-950">
                                                    {room.kode_ruangan}
                                                </th>
                                            ))}
                                        </tr>
                                        {timeSlots.map((slot, slotIndex) => (
                                            <tr key={`${day}-${slot.start}`}>
                                                <td className="sticky left-0 z-20 h-7 w-[112px] min-w-[112px] whitespace-nowrap border border-slate-900 bg-white px-3 text-center font-mono text-[13px] leading-7 text-slate-950">
                                                    {slot.label}
                                                </td>
                                                <td className="sticky left-[112px] z-20 h-7 w-[96px] min-w-[96px] border border-slate-900 bg-white px-2 text-center leading-7 text-slate-950">
                                                    {slotIndex + 1}
                                                </td>
                                                {rooms.map((room) => {
                                                    const coveredKey = `${day}-${room.id_ruangan}-${slot.start}`;
                                                    if (coveredMap.has(coveredKey)) return null;

                                                    const event = eventMap.get(coveredKey);
                                                    if (!event) {
                                                        return <td key={coveredKey} className="h-7 min-w-[138px] border border-slate-200 bg-white" />;
                                                    }

                                                    return (
                                                        <td key={coveredKey} rowSpan={event.rowSpan} className={`min-w-[138px] max-w-[138px] border border-slate-900 p-1 align-top ${getEventTone(event)}`}>
                                                            <Link href={route('baak.kelas.show', event.id_kelas)} className="block min-h-full">
                                                                <p className="line-clamp-2 font-semibold leading-tight">{event.mata_kuliah || '-'}</p>
                                                                <p className="mt-1 font-mono text-xs leading-tight">{event.kode_matkul || '-'} / {event.nama_kelas || '-'}</p>
                                                                <p className="mt-1 text-xs leading-tight">{event.dosen || '-'}</p>
                                                                <p className="mt-1 text-right text-xs font-bold leading-tight">{event.jam_mulai || '-'} - {event.jam_selesai || '-'}</p>
                                                            </Link>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <EmptyState title="Belum ada ruangan" description="Tambahkan ruangan untuk melihat matriks jadwal." />
                )}
            </CardContent>
        </Card>
    );
}

export default function Index({ ruangan, scheduleRooms = [], days = [], filters = {}, stats = {} }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [activeTab, setActiveTab] = useState('daftar');
    const visibleScheduleDays = (days.length ? days : scheduleDays).filter((day) => scheduleDays.includes(day));

    useEffect(() => {
        const timeout = setTimeout(() => {
            const next = { search, status };
            const current = { search: filters.search || '', status: filters.status || '' };
            if (next.search === current.search && next.status === current.status) return;

            router.get(route('baak.ruangan.index'), next, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 350);

        return () => clearTimeout(timeout);
    }, [search, status, filters.search, filters.status]);

    const handleReset = () => {
        setSearch('');
        setStatus('');
        router.get(route('baak.ruangan.index'), {}, { preserveScroll: true, replace: true });
    };

    const handleDelete = (item) => {
        const destroy = () => router.delete(route('baak.ruangan.destroy', item.id_ruangan), { preserveScroll: true });

        if (window.Swal) {
            window.Swal.fire({
                title: 'Hapus Ruangan?',
                text: `Apakah Anda yakin ingin menghapus ruangan "${item.kode_ruangan}"?`,
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

        if (confirm(`Hapus ruangan "${item.kode_ruangan}"?`)) destroy();
    };

    const roomName = (item) => [item.nama_ruangan, item.gedung].filter(Boolean).join(' - ') || '-';

    const columns = [
        { key: 'number', header: 'No', headerClassName: 'w-[64px]', cellClassName: 'font-medium text-slate-500', render: (_item, index) => (ruangan.from || 1) + index },
        { key: 'kode_ruangan', header: 'Kode', render: (item) => <span className="font-mono font-semibold text-blue-700">{item.kode_ruangan}</span> },
        { key: 'nama_ruangan', header: 'Nama Ruangan', render: (item) => <span className="font-semibold text-slate-900">{roomName(item)}</span> },
        { key: 'lantai', header: 'Lantai', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => item.lantai ?? '-' },
        { key: 'kapasitas', header: 'Kapasitas', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => item.kapasitas ? `${item.kapasitas} Orang` : '-' },
        { key: 'kelas_count', header: 'Jadwal', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => `${item.kelas_count || 0} Kelas` },
        { key: 'is_active', header: 'Status', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <StatusBadge active={item.is_active} /> },
        {
            key: 'actions',
            header: 'Aksi',
            headerClassName: 'text-center',
            cellClassName: 'text-center',
            render: (item) => (
                <div className="flex items-center justify-center gap-1.5">
                    <Link href={route('baak.ruangan.show', item.id_ruangan)}>
                        <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600" title="Jadwal">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={route('baak.ruangan.edit', item.id_ruangan)}>
                        <Button variant="outline" size="icon" className="h-8 w-8 text-amber-600" title="Edit">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Button type="button" variant="outline" size="icon" className="h-8 w-8 text-red-600" title="Hapus" onClick={() => handleDelete(item)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    const renderRoomCard = (item, _index, key) => (
        <Card key={key} className="rounded-lg border-slate-200 shadow-sm">
            <CardContent className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="font-mono text-xs font-semibold text-blue-700">{item.kode_ruangan}</p>
                        <p className="break-words font-semibold text-slate-950">{roomName(item)}</p>
                    </div>
                    <StatusBadge active={item.is_active} />
                </div>
                <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3 text-sm">
                    <div>
                        <p className="text-xs font-medium text-slate-500">Lantai</p>
                        <p className="mt-1 font-semibold text-slate-900">{item.lantai ?? '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500">Kapasitas</p>
                        <p className="mt-1 font-semibold text-slate-900">{item.kapasitas ? `${item.kapasitas} Orang` : '-'}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-xs font-medium text-slate-500">Jadwal</p>
                        <p className="mt-1 font-semibold text-slate-900">{item.kelas_count || 0} Kelas</p>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
                    <Link href={route('baak.ruangan.show', item.id_ruangan)}>
                        <Button variant="outline" className="w-full text-blue-600">Jadwal</Button>
                    </Link>
                    <Link href={route('baak.ruangan.edit', item.id_ruangan)}>
                        <Button variant="outline" className="w-full text-amber-600">Edit</Button>
                    </Link>
                    <Button type="button" variant="outline" className="w-full text-red-600" onClick={() => handleDelete(item)}>Hapus</Button>
                </div>
            </CardContent>
        </Card>
    );

    const hasFilters = Boolean(search || status);

    return (
        <BaakLayout title="Data Ruangan">
            <Head title="Data Ruangan" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5">
                    <PageHeader
                        title="Data Ruangan"
                        description="Kelola master ruangan dan lihat pemakaian kelas per minggu."
                        actionHref={route('baak.ruangan.create')}
                        actionLabel="Tambah Ruangan"
                    />

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <SummaryCard title="Total Ruangan" value={stats.total || 0} icon={Building2} tone="blue" />
                        <SummaryCard title="Aktif" value={stats.aktif || 0} icon={ToggleRight} tone="emerald" />
                        <SummaryCard title="Nonaktif" value={stats.nonaktif || 0} icon={ToggleLeft} tone="amber" />
                        <SummaryCard title="Dipakai Kelas" value={stats.dipakai || 0} icon={CalendarDays} tone="violet" />
                    </div>

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_minmax(180px,240px)_auto]">
                            <SearchInput value={search} onChange={setSearch} onClear={() => setSearch('')} placeholder="Cari kode, nama, atau gedung..." />
                            <SelectDropdown
                                value={status}
                                onChange={(selected) => setStatus(selected ? selected.value : '')}
                                options={statusOptions}
                                placeholder="Semua Status"
                                isSearchable={false}
                            />
                            <Button type="button" variant="outline" className="w-full gap-2 md:w-auto" onClick={handleReset} disabled={!hasFilters}>
                                <RefreshCcw className="h-4 w-4" />
                                Reset
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="p-2">
                            <div className="overflow-x-auto">
                                <div className="flex min-w-max gap-2">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.key}
                                            type="button"
                                            onClick={() => setActiveTab(tab.key)}
                                            className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-semibold transition ${
                                                activeTab === tab.key
                                                    ? 'bg-blue-600 text-white shadow-sm'
                                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {activeTab === 'daftar' ? (
                        <>
                            <DataTable
                                columns={columns}
                                data={ruangan.data || []}
                                getRowKey={(item) => item.id_ruangan}
                                emptyState={<EmptyState title="Tidak ada data ruangan" description="Ruangan belum tersedia atau tidak sesuai filter." />}
                                className="hidden lg:block"
                            />

                            <CardGrid
                                data={ruangan.data || []}
                                getCardKey={(item) => item.id_ruangan}
                                renderCard={renderRoomCard}
                                emptyState={<EmptyState title="Tidak ada data ruangan" description="Ruangan belum tersedia atau tidak sesuai filter." compact />}
                                className="grid gap-3 sm:grid-cols-2 lg:hidden"
                                emptyClassName="lg:hidden"
                            />

                            <Pagination pagination={ruangan} />
                        </>
                    ) : (
                        <ScheduleMatrix rooms={scheduleRooms} days={visibleScheduleDays} />
                    )}
                </div>
            </div>
        </BaakLayout>
    );
}
