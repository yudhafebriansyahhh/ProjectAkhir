import { useEffect, useMemo, useState } from 'react';
import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import { Eye, KeyRound, Pencil, RefreshCcw, Trash2, UserCheck, UsersRound, GraduationCap, BookOpen, Download, Upload } from 'lucide-react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { CardGrid, DataTable, EmptyState, PageHeader, Pagination, SearchInput, SummaryCard } from '@/Components/ui/data-display';
import Modal from '@/Components/Modal';
import { SelectDropdown } from '@/Components/ui/select-dropdown';

const getGenderBadge = (gender) => {
    if (gender === 'Laki-laki') return 'bg-blue-50 text-blue-700 border-blue-200';
    if (gender === 'Perempuan') return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
};

export default function Index({ dosen, prodi_list = [], filters = {}, stats = {} }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [prodi, setProdi] = useState(filters.prodi || '');

    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        file: null,
    });

    const handleImportSubmit = (e) => {
        e.preventDefault();
        post(route('baak.dosen.import'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsImportModalOpen(false);
                reset('file');
            },
        });
    };

    const prodiOptions = useMemo(
        () => prodi_list.map((item) => ({ value: item.kode_prodi, label: item.nama_prodi })),
        [prodi_list],
    );

    useEffect(() => {
        const timeout = setTimeout(() => {
            const nextFilters = { search, prodi };
            const currentFilters = {
                search: filters.search || '',
                prodi: filters.prodi || '',
            };

            if (nextFilters.search === currentFilters.search && nextFilters.prodi === currentFilters.prodi) return;

            router.get(route('baak.dosen.index'), nextFilters, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 350);

        return () => clearTimeout(timeout);
    }, [search, prodi, filters.search, filters.prodi]);

    const handleReset = () => {
        setSearch('');
        setProdi('');
        router.get(route('baak.dosen.index'), {}, { preserveScroll: true, replace: true });
    };

    const handleDelete = (id_dosen, nama) => {
        const deleteDosen = () => {
            router.delete(route('baak.dosen.destroy', id_dosen), { preserveScroll: true });
        };

        if (window.Swal) {
            window.Swal.fire({
                title: 'Hapus Dosen?',
                text: `Apakah Anda yakin ingin menghapus dosen "${nama}"?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc2626',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal',
            }).then((result) => {
                if (result.isConfirmed) deleteDosen();
            });
            return;
        }

        if (confirm(`Apakah Anda yakin ingin menghapus dosen "${nama}"?`)) deleteDosen();
    };

    const handleResetPassword = (id_dosen, nip) => {
        const resetPassword = () => {
            router.post(route('baak.dosen.reset-password', id_dosen), {}, { preserveScroll: true });
        };

        if (window.Swal) {
            window.Swal.fire({
                title: 'Reset Password?',
                text: `Password akan direset ke NIP: ${nip}`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3b82f6',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Ya, Reset!',
                cancelButtonText: 'Batal',
            }).then((result) => {
                if (result.isConfirmed) resetPassword();
            });
            return;
        }

        if (confirm(`Reset password ke NIP: ${nip}?`)) resetPassword();
    };

    const columns = [
        { key: 'number', header: 'No', headerClassName: 'w-[64px]', cellClassName: 'font-medium text-slate-500', render: (_item, index) => (dosen.from || 1) + index },
        { key: 'nip', header: 'NIP', render: (item) => <span className="font-mono font-semibold text-blue-700">{item.nip}</span> },
        { key: 'nama', header: 'Nama Dosen', render: (item) => <span className="font-semibold text-slate-900">{item.nama}</span> },
        { key: 'prodi', header: 'Program Studi', render: (item) => item.prodi?.nama_prodi || '-' },
        {
            key: 'jenis_kelamin',
            header: 'Jenis Kelamin',
            headerClassName: 'text-center',
            cellClassName: 'text-center',
            render: (item) => (
                <Badge variant="outline" className={getGenderBadge(item.jenis_kelamin)}>
                    {item.jenis_kelamin || '-'}
                </Badge>
            ),
        },
        { key: 'kelas_count', header: 'Kelas', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => `${item.kelas_count || 0} Kelas` },
        { key: 'mahasiswa_bimbingan_count', header: 'Bimbingan', headerClassName: 'text-center', cellClassName: 'text-center', render: (item) => `${item.mahasiswa_bimbingan_count || 0} Mahasiswa` },
        {
            key: 'actions',
            header: 'Aksi',
            headerClassName: 'text-center',
            cellClassName: 'text-center',
            render: (item) => (
                <div className="flex items-center justify-center gap-1.5">
                    <Link href={route('baak.dosen.show', item.id_dosen)}>
                        <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600" title="Detail">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={route('baak.dosen.edit', item.id_dosen)}>
                        <Button variant="outline" size="icon" className="h-8 w-8 text-amber-600" title="Edit">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Button type="button" variant="outline" size="icon" className="h-8 w-8 text-emerald-600" title="Reset Password" onClick={() => handleResetPassword(item.id_dosen, item.nip)}>
                        <KeyRound className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="outline" size="icon" className="h-8 w-8 text-red-600" title="Hapus" onClick={() => handleDelete(item.id_dosen, item.nama)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    const renderDosenCard = (item) => (
        <Card key={item.id_dosen} className="rounded-lg border-slate-200 shadow-sm">
            <CardContent className="space-y-4 p-4">
                <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="break-words font-semibold text-slate-950">{item.nama}</p>
                        <p className="mt-1 font-mono text-xs font-semibold text-blue-700">{item.nip || '-'}</p>
                    </div>
                    <Badge variant="outline" className={`shrink-0 ${getGenderBadge(item.jenis_kelamin)}`}>
                        {item.jenis_kelamin === 'Laki-laki' ? 'L' : item.jenis_kelamin === 'Perempuan' ? 'P' : '-'}
                    </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3 text-sm">
                    <div className="col-span-2 min-w-0">
                        <p className="text-xs font-medium text-slate-500">Program Studi</p>
                        <p className="mt-1 break-words font-semibold text-slate-900">{item.prodi?.nama_prodi || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500">Kelas</p>
                        <p className="mt-1 font-semibold text-slate-900">{item.kelas_count || 0}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500">Bimbingan</p>
                        <p className="mt-1 font-semibold text-slate-900">{item.mahasiswa_bimbingan_count || 0}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                    <Link href={route('baak.dosen.show', item.id_dosen)}>
                        <Button variant="outline" className="w-full gap-2 text-blue-600">
                            <Eye className="h-4 w-4" />
                            Detail
                        </Button>
                    </Link>
                    <Link href={route('baak.dosen.edit', item.id_dosen)}>
                        <Button variant="outline" className="w-full gap-2 text-amber-600">
                            <Pencil className="h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                    <Button type="button" variant="outline" className="w-full gap-2 text-emerald-600" onClick={() => handleResetPassword(item.id_dosen, item.nip)}>
                        <KeyRound className="h-4 w-4" />
                        Reset
                    </Button>
                    <Button type="button" variant="outline" className="w-full gap-2 text-red-600" onClick={() => handleDelete(item.id_dosen, item.nama)}>
                        <Trash2 className="h-4 w-4" />
                        Hapus
                    </Button>
                </div>
            </CardContent>
        </Card>
    );

    const hasFilters = Boolean(search || prodi);

    return (
        <BaakLayout title="Data Dosen">
            <Head title="Data Dosen" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1440px] space-y-4 md:space-y-5">
                    <PageHeader
                        title="Data Dosen"
                        description="Kelola data dosen di sistem akademik."
                        actionHref={route('baak.dosen.create')}
                        actionLabel="Tambah Dosen"
                    >
                        <a href={route('baak.dosen.export')} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full gap-2 text-slate-700 sm:w-auto">
                                <Download className="h-4 w-4" />
                                Export Excel
                            </Button>
                        </a>
                        <Button 
                            variant="outline" 
                            className="w-full gap-2 text-emerald-700 sm:w-auto"
                            onClick={() => setIsImportModalOpen(true)}
                        >
                            <Upload className="h-4 w-4" />
                            Import Excel
                        </Button>
                    </PageHeader>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <SummaryCard title="Total Dosen" value={stats.total ?? dosen.total ?? 0} icon={UserCheck} tone="blue" />
                        <SummaryCard title="Program Studi" value={stats.total_prodi ?? 0} icon={GraduationCap} tone="violet" />
                        <SummaryCard title="Total Kelas" value={stats.total_kelas ?? 0} icon={BookOpen} tone="emerald" />
                        <SummaryCard title="Mahasiswa Bimbingan" value={stats.total_bimbingan ?? 0} icon={UsersRound} tone="amber" />
                    </div>

                    <Card className="rounded-lg border-slate-200 shadow-sm">
                        <CardContent className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_minmax(220px,280px)_auto]">
                            <SearchInput
                                value={search}
                                onChange={setSearch}
                                onClear={() => setSearch('')}
                                placeholder="Cari nama atau NIP dosen..."
                            />
                            <SelectDropdown
                                value={prodi}
                                onChange={(selected) => setProdi(selected ? selected.value : '')}
                                options={prodiOptions}
                                placeholder="Semua Prodi"
                                isSearchable
                            />
                            <Button type="button" variant="outline" className="w-full gap-2 md:w-auto" onClick={handleReset} disabled={!hasFilters}>
                                <RefreshCcw className="h-4 w-4" />
                                Reset
                            </Button>
                        </CardContent>
                    </Card>

                    <DataTable
                        columns={columns}
                        data={dosen.data || []}
                        getRowKey={(item) => item.id_dosen}
                        emptyState={<EmptyState title="Tidak ada data dosen" description="Data dosen belum tersedia atau tidak sesuai filter." />}
                        className="hidden xl:block"
                    />

                    <CardGrid
                        data={dosen.data || []}
                        getCardKey={(item) => item.id_dosen}
                        renderCard={renderDosenCard}
                        emptyState={<EmptyState title="Tidak ada data dosen" description="Data dosen belum tersedia atau tidak sesuai filter." compact />}
                        className="grid gap-3 sm:grid-cols-2 xl:hidden"
                        emptyClassName="xl:hidden"
                    />

                    <Pagination pagination={dosen} />
                </div>
            </div>

            <Modal show={isImportModalOpen} onClose={() => setIsImportModalOpen(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-slate-900">Import Data Dosen</h2>
                    <p className="mt-1 text-sm text-slate-600">
                        Pilih file Excel (.xlsx) atau CSV yang berisi data dosen untuk diunggah.
                        Belum punya template?{' '}
                        <a href={route('baak.dosen.export-template')} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-medium">
                            Unduh Template Excel
                        </a>
                    </p>

                    <form onSubmit={handleImportSubmit} className="mt-6 space-y-4">
                        <div>
                            <input
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                onChange={(e) => setData('file', e.target.files[0])}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {errors.file && <p className="mt-2 text-sm text-red-600">{errors.file}</p>}
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsImportModalOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing || !data.file} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                {processing ? 'Mengunggah...' : 'Import Data'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </BaakLayout>
    );
}
