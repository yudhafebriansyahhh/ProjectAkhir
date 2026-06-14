import { useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Award,
    BookOpen,
    CalendarDays,
    ClipboardList,
    FileText,
    GraduationCap,
    Mail,
    Phone,
    UserCircle,
    UserCheck,
} from 'lucide-react';
import DosenLayout from '@/Layouts/DosenLayout';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent } from '@/Components/ui/card';
import { CardGrid, DataTable, EmptyState, PageHeader, SummaryCard } from '@/Components/ui/data-display';
import { SelectDropdown } from '@/Components/ui/select-dropdown';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';

const getStatusBadge = (status) => {
    const badges = {
        aktif: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        lulus: 'bg-blue-50 text-blue-700 border-blue-200',
        keluar: 'bg-amber-50 text-amber-700 border-amber-200',
        DO: 'bg-red-50 text-red-700 border-red-200',
    };

    return badges[status] || 'bg-slate-50 text-slate-700 border-slate-200';
};

const getGradeBadge = (grade) => {
    if (['A', 'A-'].includes(grade)) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (['B+', 'B', 'B-'].includes(grade)) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (['C+', 'C'].includes(grade)) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (['D', 'E'].includes(grade)) return 'bg-red-50 text-red-700 border-red-200';

    return 'bg-slate-50 text-slate-700 border-slate-200';
};

const getJenisBadge = (jenis) => {
    const badges = {
        Umum: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        Wajib: 'bg-blue-50 text-blue-700 border-blue-200',
        Pilihan: 'bg-violet-50 text-violet-700 border-violet-200',
    };

    return badges[jenis] || 'bg-slate-50 text-slate-700 border-slate-200';
};

const formatDate = (value) => {
    if (!value) return '-';

    return new Date(value).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

const formatNumber = (value) => {
    if (typeof value === 'number') return value.toFixed(2);
    return value ?? '-';
};

const InfoItem = ({ label, value, className = '' }) => (
    <div className={`min-w-0 ${className}`}>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-slate-900">{value || '-'}</p>
    </div>
);

export default function DetailMahasiswa({
    mahasiswa,
    rencanaStudiData = [],
    hasilStudiData = [],
    transkripData = [],
    statistik = {},
    prestasiAkademik = {},
    keteranganNilai = {},
    statistikNilai = [],
}) {
    const [activeTab, setActiveTab] = useState('biodata');
    const [selectedRencanaSemester, setSelectedRencanaSemester] = useState('');
    const [selectedHasilSemester, setSelectedHasilSemester] = useState('');

    const getPredikat = (ipk) => {
        const ipkNum = parseFloat(ipk);
        if (ipkNum >= 3.75) return 'Summa Cum Laude';
        if (ipkNum >= 3.50) return 'Magna Cum Laude';
        if (ipkNum >= 3.25) return 'Cum Laude';
        if (ipkNum >= 3.00) return 'Sangat Memuaskan';
        if (ipkNum >= 2.75) return 'Memuaskan';
        return 'Cukup';
    };

    const rencanaSemesterOptions = rencanaStudiData.map((item) => ({
        value: `${item.semester}`,
        label: `Semester ${item.semester} - ${item.jenis_semester} ${item.tahun_ajaran}`,
    }));

    const hasilSemesterOptions = hasilStudiData.map((item) => ({
        value: `${item.no}`,
        label: `Semester ${item.no} - ${item.semester} ${item.periode}`,
    }));

    const filteredRencanaStudi = useMemo(
        () => rencanaStudiData.filter((item) => !selectedRencanaSemester || `${item.semester}` === selectedRencanaSemester),
        [rencanaStudiData, selectedRencanaSemester],
    );

    const rencanaRows = filteredRencanaStudi.flatMap((semester) =>
        (semester.mata_kuliah || []).map((mk, index) => ({
            ...mk,
            nomor: index + 1,
            semester: semester.semester,
            tahun_ajaran: semester.tahun_ajaran,
        })),
    );

    const totalRencanaSks = filteredRencanaStudi.reduce((sum, semester) => sum + (semester.total_sks || 0), 0);
    const selectedHasilData = hasilStudiData.find((item) => `${item.no}` === selectedHasilSemester);
    const hasilRows = selectedHasilData?.mata_kuliah || [];

    const tabs = [
        { key: 'biodata', label: 'Biodata' },
        { key: 'resume-perkuliahan', label: 'Resume Perkuliahan' },
        { key: 'rencana-studi', label: 'Rencana Studi' },
        { key: 'hasil-studi', label: 'Hasil Studi' },
        { key: 'transkrip', label: 'Transkrip' },
    ];

    const summaryCards = [
        { title: 'Semester', value: mahasiswa.semester_ke || 0, icon: CalendarDays, tone: 'blue' },
        { title: 'Total SKS', value: statistik.total_sks || 0, icon: BookOpen, tone: 'violet' },
        { title: 'SKS Lulus', value: statistik.sks_lulus || 0, icon: UserCheck, tone: 'emerald' },
        { title: 'IPK', value: statistik.ipk || '0.00', icon: Award, tone: 'amber' },
    ];

    const biodataItems = [
        { label: 'NIM', value: mahasiswa.nim || '-' },
        { label: 'Nama Lengkap', value: mahasiswa.nama || '-' },
        { label: 'Email', value: mahasiswa.user?.email || '-' },
        { label: 'Nomor Telepon', value: mahasiswa.no_hp || '-' },
        { label: 'Tanggal Lahir', value: formatDate(mahasiswa.tanggal_lahir) },
        { label: 'Jenis Kelamin', value: mahasiswa.jenis_kelamin || '-' },
        { label: 'Agama', value: mahasiswa.agama || '-' },
        { label: 'Dosen Wali', value: mahasiswa.dosen_wali?.nama || '-' },
        { label: 'NIP Dosen Wali', value: mahasiswa.dosen_wali?.nip || '-' },
        { label: 'Nama Ayah', value: mahasiswa.nama_ayah || '-' },
        { label: 'No Telp Ayah', value: mahasiswa.no_telp_ayah || '-' },
        { label: 'Nama Ibu', value: mahasiswa.nama_ibu || '-' },
        { label: 'No Telp Ibu', value: mahasiswa.no_telp_ibu || '-' },
        { label: 'Alamat', value: mahasiswa.alamat || '-', className: 'md:col-span-2' },
    ];



    const rencanaColumns = [
        { key: 'nomor', header: 'No', headerClassName: 'w-[56px]', cellClassName: 'font-medium text-slate-500', render: (item) => item.nomor },
        { key: 'kode_mk', header: 'Kode', render: (item) => <span className="font-mono font-semibold text-blue-700">{item.kode_mk}</span> },
        { key: 'nama_mk', header: 'Mata Kuliah', render: (item) => <span className="font-semibold text-slate-800">{item.nama_mk}</span> },
        { key: 'nama_kelas', header: 'Kelas', render: (item) => `Kelas ${item.nama_kelas}` },
        { key: 'semester', header: 'Semester', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => item.semester },
        { key: 'sks', header: 'SKS', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => item.sks },
    ];

    const hasilColumns = [
        { key: 'nomor', header: 'No', headerClassName: 'w-[56px]', cellClassName: 'font-medium text-slate-500', render: (_item, index) => index + 1 },
        { key: 'kode_mk', header: 'Kode', render: (item) => <span className="font-mono font-semibold text-blue-700">{item.kode_mk}</span> },
        { key: 'nama_mk', header: 'Mata Kuliah', render: (item) => <span className="font-semibold text-slate-800">{item.nama_mk}</span> },
        { key: 'sks', header: 'SKS', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => item.sks },
        { key: 'bobot', header: 'Bobot', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => formatNumber(item.bobot) },
        {
            key: 'nilai',
            header: 'Nilai',
            headerClassName: 'text-center',
            cellClassName: 'text-center',
            render: (item) => (
                <Badge variant="outline" className={getGradeBadge(item.nilai)}>
                    {item.nilai || '-'}
                </Badge>
            ),
        },
    ];



    const renderResumeCard = (item, _index, key) => (
        <Card key={key} className="rounded-lg border-slate-200 shadow-sm">
            <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-xs font-medium text-slate-400">Semester {item.no}</p>
                        <p className="font-semibold text-slate-900">{item.periode} - {item.semester}</p>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {item.sks_semester} SKS
                    </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3 text-sm">
                    <InfoItem label="IPS" value={item.ips} />
                    <InfoItem label="IPK" value={item.ipk} />
                    <InfoItem label="SKS Kumulatif" value={item.sks_kumulatif} />
                    <InfoItem label="Distribusi" value={`A:${item.distribusi_nilai?.A || 0} B:${item.distribusi_nilai?.B || 0} C:${item.distribusi_nilai?.C || 0}`} />
                </div>
            </CardContent>
        </Card>
    );

    const renderMataKuliahCard = (item, index, key) => (
        <Card key={key} className="rounded-lg border-slate-200 shadow-sm">
            <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-400">#{index + 1}</p>
                        <p className="break-words font-semibold text-slate-900">{item.nama_mk}</p>
                        <p className="mt-0.5 font-mono text-xs text-slate-400">{item.kode_mk}</p>
                    </div>
                    {'nilai' in item ? (
                        <Badge variant="outline" className={`shrink-0 ${getGradeBadge(item.nilai)}`}>
                            {item.nilai || '-'}
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="shrink-0 bg-blue-50 text-blue-700 border-blue-200">
                            {item.sks} SKS
                        </Badge>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3 text-sm">
                    <InfoItem label="SKS" value={item.sks || item.total_sks} />
                    <InfoItem label="Bobot" value={formatNumber(item.bobot)} />
                    <InfoItem label="Kelas/Jenis" value={item.nama_kelas ? `Kelas ${item.nama_kelas}` : item.jenis} className="col-span-2" />
                    {item.semester_pengambilan ? <InfoItem label="Semester" value={item.semester_pengambilan} className="col-span-2" /> : null}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <DosenLayout title="Detail Mahasiswa Wali">
            <Head title={`Detail ${mahasiswa.nama}`} />

            <div className="min-h-screen min-w-0 bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full min-w-0 max-w-[1440px] space-y-4 md:space-y-5">
                    <div className="min-w-0">
                        <Link href={route('dosen.mahasiswa-wali.index')} className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Mahasiswa Wali
                        </Link>
                        <PageHeader
                            title="Detail Mahasiswa"
                            description="Informasi lengkap mahasiswa dan riwayat akademik."
                        />
                    </div>

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
                            <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-blue-50 shadow-sm lg:mx-0">
                                {mahasiswa.foto ? (
                                    <img src={`/storage/${mahasiswa.foto}`} alt={mahasiswa.nama} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-blue-400">
                                        <UserCircle className="h-14 w-14" />
                                    </div>
                                )}
                            </div>
                            <div className="min-w-0 text-center lg:text-left">
                                <div className="mb-2 flex flex-wrap justify-center gap-1.5 lg:justify-start">
                                    <Badge variant="outline" className="bg-blue-50 font-mono text-blue-700">
                                        {mahasiswa.nim || 'Belum ada NIM'}
                                    </Badge>
                                    <Badge variant="outline" className={getStatusBadge(mahasiswa.status)}>
                                        {mahasiswa.status?.toUpperCase() || '-'}
                                    </Badge>
                                </div>
                                <h2 className="break-words text-xl font-bold text-slate-950 sm:text-2xl">{mahasiswa.nama}</h2>
                                <div className="mt-2 grid gap-1 text-sm text-slate-500">
                                    <p className="flex min-w-0 items-center justify-center gap-1.5 lg:justify-start">
                                        <GraduationCap className="h-4 w-4 shrink-0 text-slate-400" />
                                        <span className="break-words">{mahasiswa.prodi?.nama_prodi || '-'}</span>
                                    </p>
                                    <p className="flex min-w-0 items-center justify-center gap-1.5 lg:justify-start">
                                        <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                                        <span className="break-all">{mahasiswa.user?.email || '-'}</span>
                                    </p>
                                    {mahasiswa.no_hp ? (
                                        <p className="flex items-center justify-center gap-1.5 lg:justify-start">
                                            <Phone className="h-4 w-4 text-slate-400" />
                                            {mahasiswa.no_hp}
                                        </p>
                                    ) : null}
                                </div>
                            </div>
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
                                <div className="space-y-5">
                                    <section>
                                        <h3 className="mb-3 text-base font-bold text-slate-950">Biodata Mahasiswa</h3>
                                        <div className="grid gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
                                            {biodataItems.map((item) => (
                                                <InfoItem key={item.label} label={item.label} value={item.value} className={item.className} />
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            ) : null}

                            {activeTab === 'resume-perkuliahan' ? (
                                <div className="space-y-4">
                                    <div className="hidden overflow-hidden rounded-lg border border-slate-200 lg:block">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-slate-50 hover:bg-slate-50">
                                                    <TableHead rowSpan={2} className="border-r border-slate-200 text-center align-middle">NO</TableHead>
                                                    <TableHead rowSpan={2} className="border-r border-slate-200 text-center align-middle">PERIODE</TableHead>
                                                    <TableHead rowSpan={2} className="border-r border-slate-200 text-center align-middle">SMT</TableHead>
                                                    <TableHead colSpan={2} className="border-b border-r border-slate-200 text-center">IP SEMESTER</TableHead>
                                                    <TableHead colSpan={2} className="border-b border-r border-slate-200 text-center">IP KUMULATIF</TableHead>
                                                    <TableHead colSpan={5} className="border-b border-slate-200 text-center">DISTRIBUSI NILAI</TableHead>
                                                </TableRow>
                                                <TableRow className="bg-slate-50 hover:bg-slate-50">
                                                    <TableHead className="border-r border-slate-200 text-center">SKS</TableHead>
                                                    <TableHead className="border-r border-slate-200 text-center">IP</TableHead>
                                                    <TableHead className="border-r border-slate-200 text-center">SKS</TableHead>
                                                    <TableHead className="border-r border-slate-200 text-center">IPK</TableHead>
                                                    <TableHead className="border-r border-slate-200 text-center">A</TableHead>
                                                    <TableHead className="border-r border-slate-200 text-center">B</TableHead>
                                                    <TableHead className="border-r border-slate-200 text-center">C</TableHead>
                                                    <TableHead className="border-r border-slate-200 text-center">D</TableHead>
                                                    <TableHead className="text-center">E</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {hasilStudiData.length > 0 ? (
                                                    hasilStudiData.map((item) => (
                                                        <TableRow key={item.no}>
                                                            <TableCell className="text-center">{item.no}</TableCell>
                                                            <TableCell className="text-center">{item.periode}</TableCell>
                                                            <TableCell className="text-center">{item.semester}</TableCell>
                                                            <TableCell className="text-center">{item.sks_semester}</TableCell>
                                                            <TableCell className="text-center font-semibold text-blue-600">{item.ips}</TableCell>
                                                            <TableCell className="text-center">{item.sks_kumulatif}</TableCell>
                                                            <TableCell className="text-center font-semibold text-blue-600">{item.ipk}</TableCell>
                                                            <TableCell className="text-center">{item.distribusi_nilai?.A || 0}</TableCell>
                                                            <TableCell className="text-center">{item.distribusi_nilai?.B || 0}</TableCell>
                                                            <TableCell className="text-center">{item.distribusi_nilai?.C || 0}</TableCell>
                                                            <TableCell className="text-center">{item.distribusi_nilai?.D || 0}</TableCell>
                                                            <TableCell className="text-center">{item.distribusi_nilai?.E || 0}</TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={12} className="text-center">
                                                            <EmptyState title="Belum ada resume" description="Data hasil studi belum tersedia" />
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <CardGrid
                                        data={hasilStudiData}
                                        getCardKey={(item) => item.no}
                                        renderCard={renderResumeCard}
                                        emptyState={<EmptyState title="Belum ada resume" description="Data hasil studi belum tersedia" compact />}
                                        className="grid gap-3 md:grid-cols-2 lg:hidden"
                                        emptyClassName="lg:hidden"
                                    />
                                </div>
                            ) : null}

                            {activeTab === 'rencana-studi' ? (
                                <div className="space-y-4">
                                    <div className="max-w-sm">
                                        <SelectDropdown
                                            value={selectedRencanaSemester}
                                            onChange={(selected) => setSelectedRencanaSemester(selected ? selected.value : '')}
                                            options={rencanaSemesterOptions}
                                            placeholder="Semua Semester"
                                            isSearchable={false}
                                        />
                                    </div>
                                    <DataTable
                                        columns={rencanaColumns}
                                        data={rencanaRows}
                                        getRowKey={(item, index) => `${item.semester}-${item.kode_mk}-${index}`}
                                        emptyState={<EmptyState title="Belum ada rencana studi" description="Data KRS belum tersedia" />}
                                        className="hidden lg:block"
                                        asCard={false}
                                    />
                                    <CardGrid
                                        data={rencanaRows}
                                        getCardKey={(item, index) => `${item.semester}-${item.kode_mk}-${index}`}
                                        renderCard={renderMataKuliahCard}
                                        emptyState={<EmptyState title="Belum ada rencana studi" description="Data KRS belum tersedia" compact />}
                                        className="grid gap-3 md:grid-cols-2 lg:hidden"
                                        emptyClassName="lg:hidden"
                                    />
                                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm font-semibold text-blue-700">
                                        Total SKS: {totalRencanaSks}
                                    </div>
                                </div>
                            ) : null}

                            {activeTab === 'hasil-studi' ? (
                                <div className="space-y-4">
                                    <div className="max-w-sm">
                                        <SelectDropdown
                                            value={selectedHasilSemester}
                                            onChange={(selected) => setSelectedHasilSemester(selected ? selected.value : '')}
                                            options={hasilSemesterOptions}
                                            placeholder="Pilih Semester"
                                            isSearchable={false}
                                        />
                                    </div>
                                    {selectedHasilData ? (
                                        <>
                                            <DataTable
                                                columns={hasilColumns}
                                                data={hasilRows}
                                                getRowKey={(item, index) => `${item.kode_mk}-${index}`}
                                                emptyState={<EmptyState title="Belum ada hasil studi" description="Data nilai semester belum tersedia" />}
                                                className="hidden lg:block"
                                                asCard={false}
                                            />
                                            <CardGrid
                                                data={hasilRows}
                                                getCardKey={(item, index) => `${item.kode_mk}-${index}`}
                                                renderCard={renderMataKuliahCard}
                                                emptyState={<EmptyState title="Belum ada hasil studi" description="Data nilai semester belum tersedia" compact />}
                                                className="grid gap-3 md:grid-cols-2 lg:hidden"
                                                emptyClassName="lg:hidden"
                                            />
                                            <div className="grid gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 sm:grid-cols-3">
                                                <InfoItem label="Total SKS" value={selectedHasilData.sks_semester} />
                                                <InfoItem label="IPS" value={selectedHasilData.ips} />
                                                <InfoItem label="IPK" value={selectedHasilData.ipk} />
                                            </div>
                                        </>
                                    ) : (
                                        <EmptyState title="Pilih semester" description="Pilih semester untuk melihat detail nilai" compact />
                                    )}
                                </div>
                            ) : null}

                            {activeTab === 'transkrip' ? (
                                <div className="space-y-5">
                                    <div className="hidden overflow-hidden rounded-lg border border-slate-200 lg:block">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-slate-50 hover:bg-slate-50">
                                                    <TableHead rowSpan={2} className="w-[56px] border-r border-slate-200 text-center align-middle">NO</TableHead>
                                                    <TableHead colSpan={2} className="border-b border-r border-slate-200 text-center">MATAKULIAH</TableHead>
                                                    <TableHead rowSpan={2} className="border-r border-slate-200 text-center align-middle">TOTAL SKS</TableHead>
                                                    <TableHead rowSpan={2} className="border-r border-slate-200 text-center align-middle">JENIS</TableHead>
                                                    <TableHead rowSpan={2} className="border-r border-slate-200 text-center align-middle">SEMESTER PENGAMBILAN</TableHead>
                                                    <TableHead colSpan={2} className="border-b border-slate-200 text-center">NILAI</TableHead>
                                                </TableRow>
                                                <TableRow className="bg-slate-50 hover:bg-slate-50">
                                                    <TableHead className="border-r border-slate-200 text-center">KODE</TableHead>
                                                    <TableHead className="border-r border-slate-200 text-center">NAMA</TableHead>
                                                    <TableHead className="border-r border-slate-200 text-center">BOBOT</TableHead>
                                                    <TableHead className="text-center">KODE</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {transkripData.length > 0 ? (
                                                    transkripData.map((item, index) => (
                                                        <TableRow key={`${item.kode_mk}-${index}`}>
                                                            <TableCell className="text-center font-medium text-slate-500">{index + 1}</TableCell>
                                                            <TableCell className="text-center"><span className="font-mono font-semibold text-blue-700">{item.kode_mk}</span></TableCell>
                                                            <TableCell><span className="font-semibold text-slate-800">{item.nama_mk}</span></TableCell>
                                                            <TableCell className="text-center">{item.total_sks}</TableCell>
                                                            <TableCell className="text-center">
                                                                <Badge variant="outline" className={getJenisBadge(item.jenis)}>
                                                                    {item.jenis || '-'}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-center">{item.semester_pengambilan}</TableCell>
                                                            <TableCell className="text-center">{formatNumber(item.bobot)}</TableCell>
                                                            <TableCell className="text-center">
                                                                <Badge variant="outline" className={getGradeBadge(item.nilai)}>
                                                                    {item.nilai || '-'}
                                                                </Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={8} className="text-center">
                                                            <EmptyState title="Belum ada transkrip" description="Data transkrip belum tersedia" />
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <CardGrid
                                        data={transkripData}
                                        getCardKey={(item, index) => `${item.kode_mk}-${index}`}
                                        renderCard={renderMataKuliahCard}
                                        emptyState={<EmptyState title="Belum ada transkrip" description="Data transkrip belum tersedia" compact />}
                                        className="grid gap-3 md:grid-cols-2 lg:hidden"
                                        emptyClassName="lg:hidden"
                                    />

                                    <div className="grid gap-3 lg:grid-cols-3">
                                        <Card className="rounded-lg border-slate-200 shadow-sm">
                                            <CardContent className="space-y-3 p-4">
                                                <div className="flex items-center gap-2">
                                                    <Award className="h-4 w-4 text-blue-600" />
                                                    <h4 className="text-sm font-bold text-slate-900">Prestasi Akademik</h4>
                                                </div>
                                                <div className="rounded-lg bg-slate-50 p-3 text-sm">
                                                    <div className="flex justify-between">
                                                        <span>SKS Wajib</span>
                                                        <span className="font-semibold">{prestasiAkademik?.jumlah_sks_matakuliah?.wajib || 0}</span>
                                                    </div>
                                                    <div className="mt-1 flex justify-between">
                                                        <span>SKS Pilihan</span>
                                                        <span className="font-semibold">{prestasiAkademik?.jumlah_sks_matakuliah?.pilihan || 0}</span>
                                                    </div>
                                                    <div className="mt-2 flex justify-between border-t border-slate-200 pt-2">
                                                        <span>Total SKS</span>
                                                        <span className="font-semibold text-blue-700">{prestasiAkademik?.jumlah_sks_matakuliah?.total || 0}</span>
                                                    </div>
                                                </div>
                                                <InfoItem label="Total SKS x Bobot" value={formatNumber(prestasiAkademik?.total_sks_bobot)} />
                                                <InfoItem label="IP Kumulatif" value={prestasiAkademik?.ipk || '0.00'} />
                                                <InfoItem label="Predikat" value={prestasiAkademik?.predikat || getPredikat(prestasiAkademik?.ipk || 0)} />
                                            </CardContent>
                                        </Card>

                                        <Card className="rounded-lg border-slate-200 shadow-sm">
                                            <CardContent className="space-y-3 p-4">
                                                <div className="flex items-center gap-2">
                                                    <ClipboardList className="h-4 w-4 text-emerald-600" />
                                                    <h4 className="text-sm font-bold text-slate-900">Keterangan Nilai</h4>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    {Object.entries(keteranganNilai || {}).map(([huruf, bobot]) => (
                                                        <div key={huruf} className="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
                                                            <span className="font-semibold text-slate-700">{huruf}</span>
                                                            <span className="font-bold text-emerald-700">{bobot}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="rounded-lg border-slate-200 shadow-sm">
                                            <CardContent className="space-y-3 p-4">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-orange-600" />
                                                    <h4 className="text-sm font-bold text-slate-900">Statistik Nilai</h4>
                                                </div>
                                                <div className="space-y-2 text-xs">
                                                    {(statistikNilai || []).map((stat) => (
                                                        <div key={stat.nilai} className="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
                                                            <span className="font-semibold text-slate-700">{stat.nilai}</span>
                                                            <span className="font-bold text-orange-700">
                                                                {stat.sks} SKS ({parseFloat(stat.persentase).toFixed(2)}%)
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </section>
                </div>
            </div>
        </DosenLayout>
    );
}
