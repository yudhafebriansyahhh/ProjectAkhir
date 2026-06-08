import { useEffect, useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, CheckCircle2, Eye, Lock, LockOpen, RefreshCcw, Users } from 'lucide-react';
import Swal from 'sweetalert2';
import BaakLayout from '@/Layouts/BaakLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { CardGrid, DataTable, EmptyState, PageHeader, Pagination, SearchInput, SummaryCard } from '@/Components/ui/data-display';
import { SelectDropdown } from '@/Components/ui/select-dropdown';

const statusOptions = [
    { value: 'belum', label: 'Belum Diinput' },
    { value: 'sebagian', label: 'Sebagian' },
    { value: 'lengkap', label: 'Lengkap' },
];

const getStatusBadge = (status) => {
    const badges = {
        belum: 'border-red-200 bg-red-50 text-red-700',
        sebagian: 'border-amber-200 bg-amber-50 text-amber-700',
        lengkap: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    };
    return badges[status] || 'border-slate-200 bg-slate-50 text-slate-700';
};

const getStatusLabel = (status) => {
    const labels = {
        belum: 'Belum Diinput',
        sebagian: 'Sebagian',
        lengkap: 'Lengkap',
    };
    return labels[status] || status || '-';
};

const course = (item) => item.mata_kuliah_periode?.mata_kuliah;

export default function Index({ kelas, prodis = [], dosens = [], periodeList = [], filters = {}, periodStats }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedPeriode, setSelectedPeriode] = useState(() => {
        if (!filters?.tahun_ajaran || !filters?.jenis_semester) return null;
        return periodeList.find((item) => item.tahun_ajaran === filters.tahun_ajaran && item.jenis_semester === filters.jenis_semester) || null;
    });
    const [selectedProdi, setSelectedProdi] = useState(() => {
        if (!filters?.prodi) return null;
        return prodis.find((item) => item.kode_prodi === filters.prodi) || null;
    });
    const [selectedDosen, setSelectedDosen] = useState(() => {
        if (!filters?.dosen) return null;
        return dosens.find((item) => String(item.id_dosen) === String(filters.dosen)) || null;
    });
    const [statusNilai, setStatusNilai] = useState(filters?.status_nilai || '');
    const isFirstRender = useRef(true);

    const kelasData = kelas?.data || [];
    const hasFilters = Boolean(search || selectedPeriode || selectedProdi || selectedDosen || statusNilai);
    const periodeOptions = Array.isArray(periodeList) ? periodeList : [];
    const prodiOptions = prodis.map((item) => ({ value: item.kode_prodi, label: item.nama_prodi, ...item }));
    const dosenOptions = dosens.map((item) => ({ value: item.id_dosen, label: item.nama, ...item }));

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (!selectedPeriode) return;

        const timeout = setTimeout(() => {
            router.get(
                route('baak.nilai.index'),
                {
                    search,
                    tahun_ajaran: selectedPeriode.tahun_ajaran,
                    jenis_semester: selectedPeriode.jenis_semester,
                    prodi: selectedProdi?.kode_prodi || '',
                    dosen: selectedDosen?.id_dosen || '',
                    status_nilai: statusNilai,
                },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 350);

        return () => clearTimeout(timeout);
    }, [search, selectedPeriode, selectedProdi, selectedDosen, statusNilai]);

    const handleReset = () => {
        setSearch('');
        setSelectedPeriode(null);
        setSelectedProdi(null);
        setSelectedDosen(null);
        setStatusNilai('');
        router.get(route('baak.nilai.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleBulkLock = (action) => {
        if (!selectedPeriode) {
            Swal.fire({
                icon: 'warning',
                title: 'Pilih Periode Dulu',
                text: 'Silakan pilih periode terlebih dahulu.',
                confirmButtonColor: '#3B82F6',
            });
            return;
        }

        const actionText = action === 'lock' ? 'Lock' : 'Unlock';
        const confirmText = action === 'lock'
            ? 'Semua nilai di periode ini akan di-lock dan tidak dapat diubah oleh dosen.'
            : 'Semua nilai di periode ini akan di-unlock dan dapat diubah kembali oleh dosen.';
        const warningText = action === 'lock' && periodStats?.nilai_kosong > 0
            ? `<div class="bg-yellow-50 border border-yellow-200 rounded p-2 mt-2"><p class="text-sm text-yellow-800"><strong>${periodStats.nilai_kosong} nilai masih kosong</strong> dan akan diisi otomatis dengan nilai 0 (E).</p></div>`
            : '';

        Swal.fire({
            title: `${actionText} Semua Nilai Periode?`,
            html: `
                <div class="text-left">
                    <p class="mb-3">${confirmText}</p>
                    <div class="bg-blue-50 border border-blue-200 rounded p-3 text-sm space-y-1">
                        <p><strong>Periode:</strong> ${selectedPeriode.label}</p>
                        ${selectedProdi ? `<p><strong>Prodi:</strong> ${selectedProdi.nama_prodi}</p>` : '<p><strong>Scope:</strong> Semua Prodi</p>'}
                        ${periodStats ? `
                            <p><strong>Total Kelas:</strong> ${periodStats.total_kelas}</p>
                            <p><strong>Total Mahasiswa:</strong> ${periodStats.total_mahasiswa}</p>
                            <p><strong>Nilai Sudah Diinput:</strong> ${periodStats.total_nilai} (${periodStats.persen_nilai}%)</p>
                            <p><strong>Nilai Kosong:</strong> ${periodStats.nilai_kosong}</p>
                        ` : ''}
                    </div>
                    ${warningText}
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: action === 'lock' ? '#16a34a' : '#3b82f6',
            cancelButtonColor: '#6b7280',
            confirmButtonText: `Ya, ${actionText}!`,
            cancelButtonText: 'Batal',
            width: '600px',
        }).then((result) => {
            if (!result.isConfirmed) return;

            router.post(
                route('baak.nilai.bulk-lock'),
                {
                    tahun_ajaran: selectedPeriode.tahun_ajaran,
                    jenis_semester: selectedPeriode.jenis_semester,
                    kode_prodi: selectedProdi?.kode_prodi || null,
                    action,
                    auto_fill_empty: true,
                },
                { preserveScroll: true },
            );
        });
    };

    const renderLockBadge = (item) => (
        <Badge variant="outline" className={item.is_locked ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-700'}>
            {item.is_locked ? 'Locked' : 'Unlocked'}
        </Badge>
    );

    const renderAction = (item, compact = false) => (
        <Link href={route('baak.nilai.show', item.id_kelas)} className={compact ? 'block' : ''}>
            <Button variant={compact ? 'outline' : 'ghost'} size={compact ? 'sm' : 'icon'} className={`${compact ? 'w-full gap-2' : 'h-8 w-8'} text-blue-600`}>
                <Eye className="h-4 w-4" />
                {compact ? 'Lihat Detail' : null}
            </Button>
        </Link>
    );

    const columns = [
        { key: 'number', header: 'No', headerClassName: 'w-[56px]', cellClassName: 'font-medium text-slate-500', render: (_item, index) => (kelas.from || 1) + index },
        {
            key: 'mata_kuliah',
            header: 'Mata Kuliah',
            render: (item) => (
                <div className="min-w-[220px]">
                    <Badge variant="outline" className="mb-1 bg-blue-50 font-mono text-blue-700">{course(item)?.kode_matkul || '-'}</Badge>
                    <p className="break-words font-semibold text-slate-900">{course(item)?.nama_matkul || '-'}</p>
                </div>
            ),
        },
        { key: 'kelas', header: 'Kelas', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <Badge variant="outline" className="bg-violet-50 text-violet-700">Kelas {item.nama_kelas}</Badge> },
        { key: 'dosen', header: 'Dosen', render: (item) => <span className="break-words text-sm text-slate-700">{item.dosen?.nama || '-'}</span> },
        { key: 'mahasiswa', header: 'Jumlah Mhs', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <Badge variant="outline" className="bg-blue-50 text-blue-700">{item.nilai_count || 0}/{item.total_mahasiswa || 0}</Badge> },
        { key: 'status_input', header: 'Status Input', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <Badge variant="outline" className={getStatusBadge(item.status_input)}>{getStatusLabel(item.status_input)}</Badge> },
        { key: 'lock', header: 'Status Lock', headerClassName: 'text-center', cellClassName: 'text-center', render: renderLockBadge },
        { key: 'actions', header: 'Aksi', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => renderAction(item) },
    ];

    const renderNilaiCard = (item, _index, key) => (
        <Card key={key} className="rounded-lg border-slate-200 shadow-sm">
            <CardContent className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap gap-2">
                            <Badge variant="outline" className="bg-blue-50 font-mono text-blue-700">{course(item)?.kode_matkul || '-'}</Badge>
                            <Badge variant="outline" className="bg-violet-50 text-violet-700">Kelas {item.nama_kelas}</Badge>
                        </div>
                        <p className="break-words font-semibold text-slate-950">{course(item)?.nama_matkul || '-'}</p>
                        <p className="mt-1 text-sm text-slate-500">{item.dosen?.nama || '-'}</p>
                    </div>
                    <Badge variant="outline" className={getStatusBadge(item.status_input)}>{getStatusLabel(item.status_input)}</Badge>
                </div>

                <div className="grid gap-2 rounded-lg bg-slate-50 p-3 text-sm">
                    <p className="text-slate-600"><span className="font-medium text-slate-800">Mahasiswa:</span> {item.nilai_count || 0}/{item.total_mahasiswa || 0}</p>
                    <p className="text-slate-600"><span className="font-medium text-slate-800">Lock:</span> {item.is_locked ? 'Locked' : 'Unlocked'}</p>
                </div>

                {renderAction(item, true)}
            </CardContent>
        </Card>
    );

    return (
        <BaakLayout title="Manajemen Nilai">
            <Head title="Manajemen Nilai" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5">
                    <PageHeader title="Manajemen Nilai" description="Monitor kelengkapan input nilai dan finalisasi lock nilai per periode." />

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="space-y-3 p-4">
                            <div className="grid gap-3 lg:grid-cols-4">
                                <SelectDropdown value={selectedPeriode} onChange={setSelectedPeriode} options={periodeOptions} placeholder="Pilih Periode..." />
                                <SelectDropdown value={selectedProdi} onChange={setSelectedProdi} options={prodiOptions} placeholder="Semua Prodi" isDisabled={!selectedPeriode} />
                                <SelectDropdown value={selectedDosen} onChange={setSelectedDosen} options={dosenOptions} placeholder="Semua Dosen" isDisabled={!selectedPeriode} />
                                <SelectDropdown value={statusNilai} onChange={(selected) => setStatusNilai(selected ? selected.value : '')} options={statusOptions} placeholder="Semua Status Input" isDisabled={!selectedPeriode} isSearchable={false} />
                            </div>
                            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
                                <SearchInput value={search} onChange={setSearch} onClear={() => setSearch('')} placeholder="Cari mata kuliah atau kelas..." className={!selectedPeriode ? 'pointer-events-none opacity-60' : ''} />
                                <Button type="button" variant="outline" className="w-full gap-2 lg:w-auto" onClick={handleReset} disabled={!hasFilters}>
                                    <RefreshCcw className="h-4 w-4" />
                                    Reset
                                </Button>
                            </div>

                            {!selectedPeriode ? (
                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                                    Pilih periode terlebih dahulu untuk melihat data nilai.
                                </div>
                            ) : null}
                        </CardContent>
                    </Card>

                    {selectedPeriode && periodStats ? (
                        <>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                <SummaryCard title="Total Kelas" value={periodStats.total_kelas || 0} icon={BookOpen} tone="blue" />
                                <SummaryCard title="Total Mahasiswa" value={periodStats.total_mahasiswa || 0} icon={Users} tone="violet" />
                                <SummaryCard title="Nilai Diinput" value={periodStats.total_nilai || 0} icon={CheckCircle2} tone="emerald" />
                                <SummaryCard title="Nilai Kosong" value={periodStats.nilai_kosong || 0} icon={LockOpen} tone="amber" />
                            </div>

                            <Card className="rounded-lg border-blue-200 bg-blue-50/60 shadow-sm">
                                <CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="min-w-0">
                                        <p className="font-semibold text-slate-950">Statistik Periode {selectedPeriode.label}{selectedProdi ? ` - ${selectedProdi.nama_prodi}` : ''}</p>
                                        <p className="mt-1 text-sm text-slate-600">
                                            Progress input {periodStats.persen_nilai || 0}% dan lock {periodStats.persen_locked || 0}%.
                                        </p>
                                    </div>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        <Button type="button" className="gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => handleBulkLock('lock')}>
                                            <Lock className="h-4 w-4" />
                                            Lock All
                                        </Button>
                                        <Button type="button" className="gap-2" onClick={() => handleBulkLock('unlock')}>
                                            <LockOpen className="h-4 w-4" />
                                            Unlock All
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    ) : null}

                    {selectedPeriode ? (
                        <>
                            <DataTable
                                columns={columns}
                                data={kelasData}
                                getRowKey={(item) => item.id_kelas}
                                emptyState={<EmptyState title="Tidak ada data kelas" description="Ubah filter untuk melihat data lainnya." />}
                                className="hidden lg:block"
                            />

                            <CardGrid
                                data={kelasData}
                                getCardKey={(item) => item.id_kelas}
                                renderCard={renderNilaiCard}
                                emptyState={<EmptyState title="Tidak ada data kelas" description="Ubah filter untuk melihat data lainnya." compact />}
                                className="grid gap-3 md:grid-cols-2 lg:hidden"
                                emptyClassName="lg:hidden"
                            />

                            <Pagination pagination={kelas} />
                        </>
                    ) : null}
                </div>
            </div>
        </BaakLayout>
    );
}
