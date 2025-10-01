import { Head, Link, router } from "@inertiajs/react";
import BaakLayout from "@/Layouts/BaakLayout";
import { useState } from "react";

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

    return (
        <BaakLayout title="Data Mahasiswa">
            <Head title="Data Mahasiswa" />

            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-700">
                            Data Mahasiswa
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Kelola data mahasiswa
                        </p>
                    </div>
                    <Link
                        href={route("baak.mahasiswa.create")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                        <i className="fas fa-plus"></i>
                        <span>Tambah Mahasiswa</span>
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                placeholder="Cari nama atau NIM..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>

                        {/* Filter Prodi */}
                        <div>
                            <select
                                value={selectedProdi}
                                onChange={(e) => setSelectedProdi(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                                <option value="">Semua Prodi</option>
                                {prodis.map((prodi) => (
                                    <option key={prodi.kode_prodi} value={prodi.kode_prodi}>
                                        {prodi.nama_prodi}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filter Status */}
                        <div>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                                <option value="">Semua Status</option>
                                <option value="aktif">Aktif</option>
                                <option value="lulus">Lulus</option>
                                <option value="keluar">Keluar</option>
                                <option value="DO">DO</option>
                            </select>
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleSearch}
                            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                        >
                            <i className="fas fa-search"></i>
                            <span>Cari</span>
                        </button>
                        <button
                            onClick={handleReset}
                            className="flex-1 md:flex-none bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 flex items-center justify-center gap-2"
                        >
                            <i className="fas fa-redo"></i>
                            <span>Reset</span>
                        </button>
                        <button className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                            <i className="fas fa-file-excel"></i>
                            <span>Export</span>
                        </button>
                    </div>
                </div>

                {/* Table - Desktop */}
                <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">No</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">NIM</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nama</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Program Studi</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Angkatan</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Dosen Wali</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {mahasiswas.data.length > 0 ? (
                                    mahasiswas.data.map((mahasiswa, index) => (
                                        <tr key={mahasiswa.id_mahasiswa} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {mahasiswas.from + index}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-700">
                                                {mahasiswa.nim}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                {mahasiswa.nama}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {mahasiswa.prodi?.nama_prodi || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                20{mahasiswa.nim?.substring(0, 2)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {mahasiswa.dosen_wali?.nama || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    mahasiswa.status === "aktif" ? "bg-green-100 text-green-700" :
                                                    mahasiswa.status === "lulus" ? "bg-blue-100 text-blue-700" :
                                                    mahasiswa.status === "keluar" ? "bg-yellow-100 text-yellow-700" :
                                                    "bg-red-100 text-red-700"
                                                }`}>
                                                    {mahasiswa.status?.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        href={route("baak.mahasiswa.show", mahasiswa.id_mahasiswa)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium"
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </Link>
                                                    <Link
                                                        href={route("baak.mahasiswa.edit", mahasiswa.id_mahasiswa)}
                                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs font-medium"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(mahasiswa.id_mahasiswa)}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                                            <i className="fas fa-inbox text-4xl mb-2 text-gray-400"></i>
                                            <p>Tidak ada data mahasiswa</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {mahasiswas.data.length > 0 && (
                        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Menampilkan {mahasiswas.from} - {mahasiswas.to} dari {mahasiswas.total} data
                            </div>
                            <div className="flex gap-2">
                                {mahasiswas.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || "#"}
                                        className={`px-3 py-1 rounded text-sm ${
                                            link.active
                                                ? "bg-blue-600 text-white"
                                                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                                        } ${!link.url ? "opacity-50 cursor-not-allowed" : ""}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Cards - Mobile */}
                <div className="md:hidden space-y-4">
                    {mahasiswas.data.length > 0 ? (
                        mahasiswas.data.map((mahasiswa) => (
                            <div key={mahasiswa.id_mahasiswa} className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{mahasiswa.nama}</h3>
                                        <p className="text-sm text-gray-600">{mahasiswa.nim}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        mahasiswa.status === "aktif" ? "bg-green-100 text-green-700" :
                                        mahasiswa.status === "lulus" ? "bg-blue-100 text-blue-700" :
                                        mahasiswa.status === "keluar" ? "bg-yellow-100 text-yellow-700" :
                                        "bg-red-100 text-red-700"
                                    }`}>
                                        {mahasiswa.status?.toUpperCase()}
                                    </span>
                                </div>
                                <div className="space-y-1 mb-3">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Prodi:</span> {mahasiswa.prodi?.nama_prodi}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Angkatan:</span> 20{mahasiswa.nim?.substring(0, 2)}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Dosen Wali:</span> {mahasiswa.dosen_wali?.nama || '-'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        href={route("baak.mahasiswa.show", mahasiswa.id_mahasiswa)}
                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium text-center"
                                    >
                                        <i className="fas fa-eye mr-1"></i> Detail
                                    </Link>
                                    <Link
                                        href={route("baak.mahasiswa.edit", mahasiswa.id_mahasiswa)}
                                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm font-medium text-center"
                                    >
                                        <i className="fas fa-edit mr-1"></i> Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(mahasiswa.id_mahasiswa)}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-medium"
                                    >
                                        <i className="fas fa-trash mr-1"></i> Hapus
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                            <i className="fas fa-inbox text-4xl mb-2 text-gray-400"></i>
                            <p className="text-gray-500">Tidak ada data mahasiswa</p>
                        </div>
                    )}

                    {/* Pagination Mobile */}
                    {mahasiswas.data.length > 0 && (
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="text-sm text-gray-600 mb-3 text-center">
                                Menampilkan {mahasiswas.from} - {mahasiswas.to} dari {mahasiswas.total} data
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {mahasiswas.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || "#"}
                                        className={`px-3 py-1 rounded text-sm ${
                                            link.active
                                                ? "bg-blue-600 text-white"
                                                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                                        } ${!link.url ? "opacity-50 cursor-not-allowed" : ""}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </BaakLayout>
    );
}
