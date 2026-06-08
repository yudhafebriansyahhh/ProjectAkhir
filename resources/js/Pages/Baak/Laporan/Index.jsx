import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { Download, RefreshCcw } from 'lucide-react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { DataTable, EmptyState, PageHeader } from '@/Components/ui/data-display';
import { SelectDropdown } from '@/Components/ui/select-dropdown';

const tabs = [
    { key: 'mahasiswa', label: 'Laporan Mahasiswa' },
    { key: 'kelulusan', label: 'Laporan Kelulusan' },
    { key: 'do', label: 'Laporan DO/Keluar' },
    { key: 'ipk', label: 'Laporan IPK' },
];

const statusOptions = [
    { value: 'aktif', label: 'Aktif' },
    { value: 'cuti', label: 'Cuti' },
    { value: 'lulus', label: 'Lulus' },
    { value: 'do', label: 'DO' },
];

const emptyPaginator = { data: [], from: 0, to: 0, total: 0, links: [], current_page: 1, last_page: 1 };

const statusBadgeClass = (status) => {
    const value = String(status || '').toLowerCase();
    const classes = {
        aktif: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        lulus: 'border-blue-200 bg-blue-50 text-blue-700',
        cuti: 'border-amber-200 bg-amber-50 text-amber-700',
        do: 'border-red-200 bg-red-50 text-red-700',
        keluar: 'border-red-200 bg-red-50 text-red-700',
    };

    return classes[value] || 'border-slate-200 bg-slate-50 text-slate-700';
};

export default function LaporanIndex({ tab, prodi = [], tahunAngkatan = [] }) {
    const [activeTab, setActiveTab] = useState(tab || 'mahasiswa');
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        kode_prodi: '',
        tahun_masuk: '',
        status: '',
        tahun_lulus: '',
        tahun: '',
    });
    const isFirstRender = useRef(true);

    const [dataMahasiswa, setDataMahasiswa] = useState({ mahasiswa: emptyPaginator, statistik: {} });
    const [dataKelulusan, setDataKelulusan] = useState({ lulusan: emptyPaginator, statistikProdi: [] });
    const [dataDO, setDataDO] = useState({ mahasiswaDO: emptyPaginator, distribusiSemester: [], distribusiStatus: [] });
    const [dataIpk, setDataIpk] = useState({ distribusiIpk: [], topMahasiswa: [] });

    const prodiOptions = prodi.map((item) => ({ value: item.kode_prodi, label: item.nama_prodi }));
    const tahunAngkatanOptions = tahunAngkatan.map((tahun) => ({ value: String(tahun), label: String(tahun) }));
    const hasFilters = Boolean(filters.kode_prodi || filters.tahun_masuk || filters.status || filters.tahun_lulus || filters.tahun);
    const canExport = activeTab !== 'do';

    const activePayload = useMemo(() => {
        if (activeTab === 'mahasiswa') return dataMahasiswa;
        if (activeTab === 'kelulusan') return dataKelulusan;
        if (activeTab === 'do') return dataDO;
        return dataIpk;
    }, [activeTab, dataMahasiswa, dataKelulusan, dataDO, dataIpk]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            loadData();
        }, isFirstRender.current ? 0 : 350);

        isFirstRender.current = false;
        return () => clearTimeout(timeout);
    }, [activeTab, filters]);

    const loadData = async () => {
        setLoading(true);

        try {
            const endpoints = {
                mahasiswa: 'baak.laporan.mahasiswa',
                kelulusan: 'baak.laporan.kelulusan',
                do: 'baak.laporan.do',
                ipk: 'baak.laporan.ipk',
            };
            const response = await axios.get(route(endpoints[activeTab]), { params: filters });

            if (activeTab === 'mahasiswa') setDataMahasiswa(response.data);
            if (activeTab === 'kelulusan') setDataKelulusan(response.data);
            if (activeTab === 'do') setDataDO(response.data);
            if (activeTab === 'ipk') setDataIpk(response.data);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters((current) => ({ ...current, [key]: value }));
    };

    const resetFilters = () => {
        setFilters({ kode_prodi: '', tahun_masuk: '', status: '', tahun_lulus: '', tahun: '' });
    };

    const exportReport = (format) => {
        const routes = {
            excel: {
                mahasiswa: 'baak.laporan.export.mahasiswa.excel',
                kelulusan: 'baak.laporan.export.kelulusan.excel',
                ipk: 'baak.laporan.export.ipk.excel',
            },
            pdf: {
                mahasiswa: 'baak.laporan.export.mahasiswa.pdf',
                kelulusan: 'baak.laporan.export.kelulusan.pdf',
                ipk: 'baak.laporan.export.ipk.pdf',
            },
        };

        const routeName = routes[format]?.[activeTab];
        if (!routeName) return;

        window.location.href = route(routeName, filters);
    };

    return (
        <BaakLayout title="Laporan Akademik">
            <Head title="Laporan Akademik" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5">
                    <PageHeader
                        title="Laporan Akademik"
                        description="Generate dan export laporan akademik berdasarkan kebutuhan BAAK."
                    />

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <ReportSummary activeTab={activeTab} data={activePayload} />
                    </div>

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="space-y-4 p-4 sm:p-5">
                            <div className="-mx-4 overflow-x-auto px-4 sm:-mx-5 sm:px-5">
                                <div className="flex min-w-max gap-2 border-b border-slate-100 pb-3">
                                    {tabs.map((item) => (
                                        <button
                                            key={item.key}
                                            type="button"
                                            onClick={() => setActiveTab(item.key)}
                                            className={`h-10 rounded-lg px-4 text-sm font-semibold transition ${
                                                activeTab === item.key
                                                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                                                    : 'bg-white text-slate-600 hover:bg-slate-100'
                                            }`}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-3 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
                                <SelectDropdown
                                    value={filters.kode_prodi}
                                    onChange={(selected) => handleFilterChange('kode_prodi', selected ? selected.value : '')}
                                    options={prodiOptions}
                                    placeholder="Semua Program Studi"
                                />

                                {activeTab === 'mahasiswa' ? (
                                    <>
                                        <SelectDropdown
                                            value={filters.tahun_masuk}
                                            onChange={(selected) => handleFilterChange('tahun_masuk', selected ? selected.value : '')}
                                            options={tahunAngkatanOptions}
                                            placeholder="Semua Tahun Masuk"
                                            isSearchable={false}
                                        />
                                        <SelectDropdown
                                            value={filters.status}
                                            onChange={(selected) => handleFilterChange('status', selected ? selected.value : '')}
                                            options={statusOptions}
                                            placeholder="Semua Status"
                                            isSearchable={false}
                                        />
                                    </>
                                ) : null}

                                {activeTab === 'kelulusan' ? (
                                    <input
                                        type="number"
                                        value={filters.tahun_lulus}
                                        onChange={(event) => handleFilterChange('tahun_lulus', event.target.value)}
                                        placeholder="Tahun Lulus"
                                        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : null}

                                {activeTab === 'do' ? (
                                    <input
                                        type="number"
                                        value={filters.tahun}
                                        onChange={(event) => handleFilterChange('tahun', event.target.value)}
                                        placeholder="Tahun Keluar"
                                        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : null}

                                <div className="flex flex-col gap-2 sm:flex-row lg:col-start-5">
                                    <Button type="button" variant="outline" className="w-full gap-2 sm:w-auto" onClick={resetFilters} disabled={!hasFilters}>
                                        <RefreshCcw className="h-4 w-4" />
                                        Reset
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                                <Button type="button" variant="outline" className="w-full gap-2 sm:w-auto" onClick={() => exportReport('excel')} disabled={!canExport}>
                                    <Download className="h-4 w-4" />
                                    Export Excel
                                </Button>
                                <Button type="button" variant="outline" className="w-full gap-2 text-red-600 sm:w-auto" onClick={() => exportReport('pdf')} disabled={!canExport}>
                                    <Download className="h-4 w-4" />
                                    Export PDF
                                </Button>
                            </div>

                            {!canExport ? (
                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                                    Export untuk laporan DO/Keluar belum tersedia pada route backend saat ini.
                                </div>
                            ) : null}
                        </CardContent>
                    </Card>

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="p-4 sm:p-5">
                            {loading ? (
                                <LoadingState />
                            ) : (
                                <>
                                    {activeTab === 'mahasiswa' ? <LaporanMahasiswa data={dataMahasiswa} /> : null}
                                    {activeTab === 'kelulusan' ? <LaporanKelulusan data={dataKelulusan} /> : null}
                                    {activeTab === 'do' ? <LaporanDO data={dataDO} /> : null}
                                    {activeTab === 'ipk' ? <LaporanIPK data={dataIpk} /> : null}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </BaakLayout>
    );
}

function ReportSummary({ activeTab, data }) {
    if (activeTab === 'mahasiswa') {
        const statistik = data.statistik || {};
        return (
            <>
                <MiniSummary title="Total" value={statistik.total || 0} tone="blue" />
                <MiniSummary title="Aktif" value={statistik.aktif || 0} tone="emerald" />
                <MiniSummary title="Lulus" value={statistik.lulus || 0} tone="violet" />
                <MiniSummary title="Cuti/DO" value={(statistik.cuti || 0) + (statistik.do || 0)} tone="amber" />
            </>
        );
    }

    if (activeTab === 'kelulusan') {
        const lulusan = data.lulusan || emptyPaginator;
        const statistikProdi = data.statistikProdi || [];
        return (
            <>
                <MiniSummary title="Total Lulusan" value={lulusan.total || 0} tone="blue" />
                <MiniSummary title="Prodi Aktif" value={statistikProdi.length || 0} tone="emerald" />
                <MiniSummary title="Rata-rata IPK" value={average(statistikProdi.map((item) => Number(item.ipk || 0)))} tone="violet" />
                <MiniSummary title="Data Tampil" value={lulusan.data?.length || 0} tone="amber" />
            </>
        );
    }

    if (activeTab === 'do') {
        const mahasiswaDO = data.mahasiswaDO || emptyPaginator;
        return (
            <>
                <MiniSummary title="Total DO/Keluar" value={mahasiswaDO.total || 0} tone="blue" />
                <MiniSummary title="Distribusi Semester" value={data.distribusiSemester?.length || 0} tone="emerald" />
                <MiniSummary title="Distribusi Status" value={data.distribusiStatus?.length || 0} tone="violet" />
                <MiniSummary title="Data Tampil" value={mahasiswaDO.data?.length || 0} tone="amber" />
            </>
        );
    }

    return (
        <>
            <MiniSummary title="Prodi Dengan IPK" value={data.distribusiIpk?.length || 0} tone="blue" />
            <MiniSummary title="Top Mahasiswa" value={data.topMahasiswa?.length || 0} tone="emerald" />
            <MiniSummary title="Cumlaude" value={(data.distribusiIpk || []).reduce((sum, item) => sum + Number(item.cumlaude || 0), 0)} tone="violet" />
            <MiniSummary title="Kurang" value={(data.distribusiIpk || []).reduce((sum, item) => sum + Number(item.kurang || 0), 0)} tone="amber" />
        </>
    );
}

function MiniSummary({ title, value, tone }) {
    const tones = {
        blue: 'border-blue-200 bg-blue-50 text-blue-700',
        emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        violet: 'border-violet-200 bg-violet-50 text-violet-700',
        amber: 'border-amber-200 bg-amber-50 text-amber-700',
    };

    return (
        <Card className={`rounded-lg shadow-sm ${tones[tone] || tones.blue}`}>
            <CardContent className="p-4">
                <p className="text-2xl font-bold">{new Intl.NumberFormat('id-ID').format(value || 0)}</p>
                <p className="mt-1 text-xs font-semibold opacity-80">{title}</p>
            </CardContent>
        </Card>
    );
}

function LaporanMahasiswa({ data }) {
    const mahasiswa = data.mahasiswa || emptyPaginator;
    const rows = mahasiswa.data || [];
    const columns = [
        { key: 'no', header: 'No', render: (_, index) => (mahasiswa.from || 1) + index },
        { key: 'nim', header: 'NIM', render: (item) => <span className="font-mono font-semibold text-slate-900">{item.nim}</span> },
        { key: 'nama', header: 'Nama', render: (item) => <span className="font-semibold text-slate-900">{item.nama}</span> },
        { key: 'prodi', header: 'Prodi', render: (item) => item.prodi?.nama_prodi || '-' },
        { key: 'tahun_masuk', header: 'Tahun Masuk', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => item.tahun_masuk || '-' },
        { key: 'semester', header: 'Semester', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => item.semester_ke || '-' },
        { key: 'status', header: 'Status', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <StatusBadge status={item.status} /> },
    ];

    return (
        <ReportSection>
            <DesktopTable columns={columns} rows={rows} getRowKey={(item) => item.id_mahasiswa} />
            <MobileList
                rows={rows}
                render={(item) => (
                    <PersonCard key={item.id_mahasiswa} item={item}>
                        <p><span className="font-medium text-slate-800">Tahun Masuk:</span> {item.tahun_masuk || '-'}</p>
                        <p><span className="font-medium text-slate-800">Semester:</span> {item.semester_ke || '-'}</p>
                        <p><span className="font-medium text-slate-800">Status:</span> <StatusBadge status={item.status} /></p>
                    </PersonCard>
                )}
            />
        </ReportSection>
    );
}

function LaporanKelulusan({ data }) {
    const lulusan = data.lulusan || emptyPaginator;
    const rows = lulusan.data || [];
    const statistikProdi = data.statistikProdi || [];
    const columns = [
        { key: 'no', header: 'No', render: (_, index) => (lulusan.from || 1) + index },
        { key: 'nim', header: 'NIM', render: (item) => <span className="font-mono font-semibold text-slate-900">{item.nim}</span> },
        { key: 'nama', header: 'Nama', render: (item) => <span className="font-semibold text-slate-900">{item.nama}</span> },
        { key: 'prodi', header: 'Prodi', render: (item) => item.prodi?.nama_prodi || '-' },
        { key: 'tahun_lulus', header: 'Tahun Lulus', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => new Date(item.updated_at).getFullYear() },
    ];

    return (
        <ReportSection>
            <StatistikProdi data={statistikProdi} />
            <DesktopTable columns={columns} rows={rows} getRowKey={(item) => item.id_mahasiswa} />
            <MobileList
                rows={rows}
                render={(item) => (
                    <PersonCard key={item.id_mahasiswa} item={item}>
                        <p><span className="font-medium text-slate-800">Tahun Lulus:</span> {new Date(item.updated_at).getFullYear()}</p>
                    </PersonCard>
                )}
            />
        </ReportSection>
    );
}

function LaporanDO({ data }) {
    const mahasiswaDO = data.mahasiswaDO || emptyPaginator;
    const rows = mahasiswaDO.data || [];
    const columns = [
        { key: 'no', header: 'No', render: (_, index) => (mahasiswaDO.from || 1) + index },
        { key: 'nim', header: 'NIM', render: (item) => <span className="font-mono font-semibold text-slate-900">{item.nim}</span> },
        { key: 'nama', header: 'Nama', render: (item) => <span className="font-semibold text-slate-900">{item.nama}</span> },
        { key: 'prodi', header: 'Prodi', render: (item) => item.prodi?.nama_prodi || '-' },
        { key: 'semester', header: 'Semester', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => item.semester_ke || '-' },
        { key: 'status', header: 'Status', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <StatusBadge status={item.status} /> },
    ];

    return (
        <ReportSection>
            <div className="grid gap-3 md:grid-cols-2">
                <DistributionCard title="Distribusi per Semester" data={data.distribusiSemester || []} labelKey="semester" />
                <DistributionCard title="Distribusi per Status" data={data.distribusiStatus || []} labelKey="status" />
            </div>
            <DesktopTable columns={columns} rows={rows} getRowKey={(item) => item.id_mahasiswa} />
            <MobileList
                rows={rows}
                render={(item) => (
                    <PersonCard key={item.id_mahasiswa} item={item}>
                        <p><span className="font-medium text-slate-800">Semester:</span> {item.semester_ke || '-'}</p>
                        <p><span className="font-medium text-slate-800">Status:</span> <StatusBadge status={item.status} /></p>
                    </PersonCard>
                )}
            />
        </ReportSection>
    );
}

function LaporanIPK({ data }) {
    const distribusiIpk = data.distribusiIpk || [];
    const topMahasiswa = data.topMahasiswa || [];
    const distribusiColumns = [
        { key: 'nama_prodi', header: 'Prodi', render: (item) => <span className="font-semibold text-slate-900">{item.nama_prodi}</span> },
        { key: 'cumlaude', header: 'Cumlaude', headerClassName: 'text-center', cellClassName: 'text-center font-semibold text-blue-600' },
        { key: 'sangat_memuaskan', header: 'Sangat Memuaskan', headerClassName: 'text-center', cellClassName: 'text-center font-semibold text-blue-700' },
        { key: 'memuaskan', header: 'Memuaskan', headerClassName: 'text-center', cellClassName: 'text-center font-semibold text-emerald-600' },
        { key: 'cukup', header: 'Cukup', headerClassName: 'text-center', cellClassName: 'text-center font-semibold text-amber-600' },
        { key: 'kurang', header: 'Kurang', headerClassName: 'text-center', cellClassName: 'text-center font-semibold text-red-600' },
    ];
    const topColumns = [
        { key: 'rank', header: 'Rank', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <RankBadge rank={item.rank} /> },
        { key: 'nim', header: 'NIM', render: (item) => <span className="font-mono font-semibold text-slate-900">{item.nim}</span> },
        { key: 'nama', header: 'Nama', render: (item) => <span className="font-semibold text-slate-900">{item.nama}</span> },
        { key: 'prodi', header: 'Prodi' },
        { key: 'semester', header: 'Semester', headerClassName: 'text-center', cellClassName: 'text-center' },
        { key: 'ipk', header: 'IPK', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => <Badge variant="outline" className="bg-blue-50 font-semibold text-blue-700">{item.ipk}</Badge> },
    ];

    return (
        <ReportSection>
            <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-700">Distribusi IPK per Prodi</h3>
                <DesktopTable columns={distribusiColumns} rows={distribusiIpk} getRowKey={(item, index) => `${item.nama_prodi}-${index}`} />
                <MobileList
                    rows={distribusiIpk}
                    render={(item, index) => (
                        <Card key={`${item.nama_prodi}-${index}`} className="rounded-lg border-slate-200 shadow-sm">
                            <CardContent className="space-y-3 p-4">
                                <p className="font-semibold text-slate-950">{item.nama_prodi}</p>
                                <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                                    <Metric label="Cumlaude" value={item.cumlaude} />
                                    <Metric label="S. Memuaskan" value={item.sangat_memuaskan} />
                                    <Metric label="Memuaskan" value={item.memuaskan} />
                                    <Metric label="Cukup" value={item.cukup} />
                                    <Metric label="Kurang" value={item.kurang} />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                />
            </div>

            <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-700">Top 10 Mahasiswa IPK Tertinggi</h3>
                <DesktopTable columns={topColumns} rows={topMahasiswa} getRowKey={(item) => item.rank} />
                <MobileList
                    rows={topMahasiswa}
                    render={(item) => (
                        <Card key={item.rank} className="rounded-lg border-slate-200 shadow-sm">
                            <CardContent className="space-y-3 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="font-semibold text-slate-950">{item.nama}</p>
                                        <p className="font-mono text-sm text-slate-500">{item.nim}</p>
                                    </div>
                                    <RankBadge rank={item.rank} />
                                </div>
                                <div className="grid gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                                    <p><span className="font-medium text-slate-800">Prodi:</span> {item.prodi}</p>
                                    <p><span className="font-medium text-slate-800">Semester:</span> {item.semester || '-'}</p>
                                    <p><span className="font-medium text-slate-800">IPK:</span> <Badge variant="outline" className="bg-blue-50 font-semibold text-blue-700">{item.ipk}</Badge></p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                />
            </div>
        </ReportSection>
    );
}

function DesktopTable({ columns, rows, getRowKey }) {
    return (
        <div className="hidden overflow-x-auto lg:block">
            <DataTable
                columns={columns}
                data={rows}
                getRowKey={getRowKey}
                emptyState={<EmptyState compact title="Tidak ada data" description="Data laporan belum tersedia." />}
                asCard={false}
                className="min-w-[820px]"
            />
        </div>
    );
}

function MobileList({ rows, render }) {
    if (!rows.length) {
        return (
            <div className="lg:hidden">
                <Card className="rounded-lg border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                        <EmptyState compact title="Tidak ada data" description="Data laporan belum tersedia." />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return <div className="grid gap-3 md:grid-cols-2 lg:hidden">{rows.map(render)}</div>;
}

function PersonCard({ item, children }) {
    return (
        <Card className="rounded-lg border-slate-200 shadow-sm">
            <CardContent className="space-y-3 p-4">
                <div>
                    <p className="break-words font-semibold text-slate-950">{item.nama}</p>
                    <p className="font-mono text-sm text-slate-500">{item.nim}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.prodi?.nama_prodi || '-'}</p>
                </div>
                <div className="grid gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                    {children}
                </div>
            </CardContent>
        </Card>
    );
}

function StatistikProdi({ data }) {
    if (!data.length) return null;

    return (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-blue-900">Statistik Kelulusan per Prodi</h3>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {data.map((item, index) => (
                    <div key={`${item.prodi}-${index}`} className="rounded-lg border border-blue-100 bg-white p-3 text-sm">
                        <p className="font-semibold text-slate-950">{item.prodi}</p>
                        <div className="mt-2 grid gap-1 text-slate-600">
                            <p>Total lulusan: <span className="font-semibold text-blue-700">{item.total}</span></p>
                            <p>Rata-rata IPK: <span className="font-semibold text-blue-700">{item.ipk}</span></p>
                            <p>Lama studi: <span className="font-semibold text-slate-800">{item.lama_studi}</span></p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function DistributionCard({ title, data, labelKey }) {
    return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-red-900">{title}</h3>
            {data.length ? (
                <div className="space-y-2">
                    {data.map((item, index) => (
                        <div key={`${item[labelKey]}-${index}`} className="flex items-center justify-between gap-3 rounded-lg bg-white p-3 text-sm">
                            <span className="font-medium text-slate-700">{item[labelKey]}</span>
                            <Badge variant="outline" className="bg-red-50 font-semibold text-red-700">{item.total}</Badge>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-red-700">Belum ada data distribusi.</p>
            )}
        </div>
    );
}

function StatusBadge({ status }) {
    return (
        <Badge variant="outline" className={`capitalize ${statusBadgeClass(status)}`}>
            {status || '-'}
        </Badge>
    );
}

function RankBadge({ rank }) {
    const className =
        rank === 1
            ? 'bg-blue-600 text-white'
            : rank === 2
                ? 'bg-slate-500 text-white'
                : rank === 3
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 text-slate-700';

    return <span className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-sm font-bold ${className}`}>{rank}</span>;
}

function Metric({ label, value }) {
    return (
        <div className="rounded-lg bg-white p-2">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="font-semibold text-slate-950">{value}</p>
        </div>
    );
}

function ReportSection({ children }) {
    return <div className="space-y-5">{children}</div>;
}

function LoadingState() {
    return (
        <div className="flex min-h-[260px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
        </div>
    );
}

function average(values) {
    const clean = values.filter((value) => Number.isFinite(value) && value > 0);
    if (!clean.length) return 0;
    return Number((clean.reduce((sum, value) => sum + value, 0) / clean.length).toFixed(2));
}
