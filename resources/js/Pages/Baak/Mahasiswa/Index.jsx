import { Head, Link, router } from "@inertiajs/react";
import BaakLayout from "@/Layouts/BaakLayout";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Select } from "@/Components/ui/select";
import {
    Table, TableHeader, TableBody, TableRow,
    TableHead, TableCell
} from "@/Components/ui/table";
import {
    GraduationCap, Plus, Search, RotateCcw, FileSpreadsheet,
    Eye, Pencil, Trash2, Inbox, ChevronLeft, ChevronRight, Users
} from "lucide-react";

export default function Index({ mahasiswas, prodis, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [selectedProdi, setSelectedProdi] = useState(filters.kode_prodi || "");
    const [selectedStatus, setSelectedStatus] = useState(filters.status || "");

    const handleSearch = () => {
        router.get(route('baak.mahasiswa.index'), {
            search: search,
            kode_prodi: selectedProdi,
            status: selectedStatus,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setSearch("");
        setSelectedProdi("");
        setSelectedStatus("");
        router.get(route('baak.mahasiswa.index'));
    };

    const handleDelete = (id) => {
        if (window.Swal) {
            window.Swal.fire({
                title: "Yakin ingin menghapus?",
                text: "Data mahasiswa akan dihapus permanen!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Ya, hapus!",
                cancelButtonText: "Batal",
                confirmButtonColor: "#dc2626",
            }).then((result) => {
                if (result.isConfirmed) {
                    router.delete(route("baak.mahasiswa.destroy", id), {
                        onSuccess: () => {
                            window.Swal.fire(
                                "Terhapus!",
                                "Data mahasiswa berhasil dihapus.",
                                "success"
                            );
                        },
                    });
                }
            });
        } else {
            if (confirm("Yakin ingin menghapus data mahasiswa ini?")) {
                router.delete(route("baak.mahasiswa.destroy", id));
            }
        }
    };

    const getStatusBadge = (status) => {
        const map = {
            aktif: { variant: "success", label: "AKTIF" },
            lulus: { variant: "default", label: "LULUS" },
            keluar: { variant: "warning", label: "KELUAR" },
            DO: { variant: "destructive", label: "DO" },
        };
        const config = map[status] || { variant: "secondary", label: status?.toUpperCase() || "-" };
        return <Badge variant={config.variant} className="text-[10px] font-bold">{config.label}</Badge>;
    };

    return (
        <BaakLayout title="Data Mahasiswa">
            <Head title="Data Mahasiswa" />

            <div className="p-4 md:p-6 space-y-5">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                Data Mahasiswa
                            </h1>
                            <p className="text-sm text-gray-500">
                                Kelola data mahasiswa
                            </p>
                        </div>
                    </div>
                    <Link href={route("baak.mahasiswa.create")}>
                        <Button className="gap-2 shadow-md shadow-blue-600/20">
                            <Plus className="w-4 h-4" />
                            Tambah Mahasiswa
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div className="md:col-span-2">
                                <Input
                                    type="text"
                                    placeholder="Cari nama atau NIM..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="h-10"
                                />
                            </div>
                            <Select
                                value={selectedProdi}
                                onChange={(e) => setSelectedProdi(e.target.value)}
                            >
                                <option value="">Semua Prodi</option>
                                {prodis.map((prodi) => (
                                    <option key={prodi.kode_prodi} value={prodi.kode_prodi}>
                                        {prodi.nama_prodi}
                                    </option>
                                ))}
                            </Select>
                            <Select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                <option value="">Semua Status</option>
                                <option value="aktif">Aktif</option>
                                <option value="lulus">Lulus</option>
                                <option value="keluar">Keluar</option>
                                <option value="DO">DO</option>
                            </Select>
                        </div>

                        <div className="flex gap-2 mt-3">
                            <Button onClick={handleSearch} className="gap-2">
                                <Search className="w-4 h-4" />
                                Cari
                            </Button>
                            <Button onClick={handleReset} variant="secondary" className="gap-2">
                                <RotateCcw className="w-4 h-4" />
                                Reset
                            </Button>
                            <Button variant="outline" className="gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700">
                                <FileSpreadsheet className="w-4 h-4" />
                                Export
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Table - Desktop */}
                <Card className="hidden md:block overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                                <TableHead className="w-[50px]">No</TableHead>
                                <TableHead>NIM</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Program Studi</TableHead>
                                <TableHead>Angkatan</TableHead>
                                <TableHead>Dosen Wali</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-center">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mahasiswas.data.length > 0 ? (
                                mahasiswas.data.map((mahasiswa, index) => (
                                    <TableRow key={mahasiswa.id_mahasiswa}>
                                        <TableCell className="text-gray-500 font-medium">
                                            {mahasiswas.from + index}
                                        </TableCell>
                                        <TableCell className="font-semibold text-blue-700">
                                            {mahasiswa.nim}
                                        </TableCell>
                                        <TableCell className="font-medium text-gray-900">
                                            {mahasiswa.nama}
                                        </TableCell>
                                        <TableCell className="text-gray-600">
                                            {mahasiswa.prodi?.nama_prodi || '-'}
                                        </TableCell>
                                        <TableCell className="text-gray-600">
                                            20{mahasiswa.nim?.substring(0, 2)}
                                        </TableCell>
                                        <TableCell className="text-gray-600">
                                            {mahasiswa.dosen_wali?.nama || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(mahasiswa.status)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-1.5">
                                                <Link href={route("baak.mahasiswa.show", mahasiswa.id_mahasiswa)}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={route("baak.mahasiswa.edit", mahasiswa.id_mahasiswa)}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDelete(mahasiswa.id_mahasiswa)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-32 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
                                                <Inbox className="w-7 h-7 text-gray-300" />
                                            </div>
                                            <p className="text-gray-400 font-medium">Tidak ada data mahasiswa</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {mahasiswas.data.length > 0 && (
                        <div className="bg-gray-50/50 px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Menampilkan <span className="font-semibold text-gray-700">{mahasiswas.from}</span> – <span className="font-semibold text-gray-700">{mahasiswas.to}</span> dari <span className="font-semibold text-gray-700">{mahasiswas.total}</span> data
                            </p>
                            <div className="flex gap-1.5">
                                {mahasiswas.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || "#"}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                            link.active
                                                ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                                                : "bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-700 border border-gray-200"
                                        } ${!link.url ? "opacity-40 cursor-not-allowed pointer-events-none" : ""}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </Card>

                {/* Cards - Mobile */}
                <div className="md:hidden space-y-3">
                    {mahasiswas.data.length > 0 ? (
                        mahasiswas.data.map((mahasiswa) => (
                            <Card key={mahasiswa.id_mahasiswa} className="overflow-hidden">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{mahasiswa.nama}</h3>
                                            <p className="text-sm text-blue-600 font-medium">{mahasiswa.nim}</p>
                                        </div>
                                        {getStatusBadge(mahasiswa.status)}
                                    </div>
                                    <div className="space-y-1.5 mb-4 text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <span className="font-medium text-gray-500 w-20 flex-shrink-0">Prodi</span>
                                            <span>{mahasiswa.prodi?.nama_prodi || '-'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <span className="font-medium text-gray-500 w-20 flex-shrink-0">Angkatan</span>
                                            <span>20{mahasiswa.nim?.substring(0, 2)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <span className="font-medium text-gray-500 w-20 flex-shrink-0">Wali</span>
                                            <span>{mahasiswa.dosen_wali?.nama || '-'}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={route("baak.mahasiswa.show", mahasiswa.id_mahasiswa)} className="flex-1">
                                            <Button variant="outline" className="w-full gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50" size="sm">
                                                <Eye className="w-3.5 h-3.5" /> Detail
                                            </Button>
                                        </Link>
                                        <Link href={route("baak.mahasiswa.edit", mahasiswa.id_mahasiswa)} className="flex-1">
                                            <Button variant="outline" className="w-full gap-1.5 text-amber-600 border-amber-200 hover:bg-amber-50" size="sm">
                                                <Pencil className="w-3.5 h-3.5" /> Edit
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
                                            onClick={() => handleDelete(mahasiswa.id_mahasiswa)}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> Hapus
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <Inbox className="w-8 h-8 text-gray-300" />
                                </div>
                                <p className="text-gray-400 font-medium">Tidak ada data mahasiswa</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Pagination Mobile */}
                    {mahasiswas.data.length > 0 && (
                        <Card>
                            <CardContent className="p-4">
                                <p className="text-sm text-gray-500 mb-3 text-center">
                                    Menampilkan <span className="font-semibold">{mahasiswas.from}</span> – <span className="font-semibold">{mahasiswas.to}</span> dari <span className="font-semibold">{mahasiswas.total}</span>
                                </p>
                                <div className="flex flex-wrap gap-1.5 justify-center">
                                    {mahasiswas.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || "#"}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                                link.active
                                                    ? "bg-blue-600 text-white shadow-sm"
                                                    : "bg-white text-gray-600 hover:bg-blue-50 border border-gray-200"
                                            } ${!link.url ? "opacity-40 cursor-not-allowed pointer-events-none" : ""}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </BaakLayout>
    );
}
