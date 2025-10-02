// resources/js/Pages/Baak/RegistrasiSemester/Index.jsx

import { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import BaakLayout from "@/Layouts/BaakLayout";

export default function Index({ registrasi, filters, periodes, prodis, statistik }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState("monitoring");
    const [search, setSearch] = useState(filters.search || "");
    const [selectedFilters, setSelectedFilters] = useState({
        periode: filters.periode || "",
        prodi: filters.prodi || "",
        status: filters.status || "",
    });

    const handleFilter = () => {
        router.get(route("baak.registrasi-semester.index"), {
            ...selectedFilters,
            search,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearch("");
        setSelectedFilters({ periode: "", prodi: "", status: "" });
        router.get(route("baak.registrasi-semester.index"));
    };

    const handleDelete = (id) => {
        if (window.Swal) {
            window.Swal.fire({
                title: "Hapus Data Registrasi?",
                text: "Data yang dihapus tidak dapat dikembalikan!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Ya, Hapus!",
                cancelButtonText: "Batal",
                confirmButtonColor: "#dc2626",
            }).then((result) => {
                if (result.isConfirmed) {
                    router.delete(route("baak.registrasi-semester.destroy", id), {
                        onSuccess: () => {
                            window.Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
                        },
                    });
                }
            });
        }
    };

    return (
        <BaakLayout title="Registrasi Semester">
            <Head title="Registrasi Semester" />

            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">
                        Registrasi Semester Mahasiswa
                    </h1>
                    <p className="text-gray-600">
                        Kelola registrasi semester mahasiswa
                    </p>
                </div>

                {/* Flash Message */}
                {flash.success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center">
                        <i className="fas fa-check-circle mr-2"></i>
                        {flash.success}
                    </div>
                )}

                {flash.error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center">
                        <i className="fas fa-exclamation-circle mr-2"></i>
                        {flash.error}
                    </div>
                )}

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab("monitoring")}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === "monitoring"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            <i className="fas fa-list-ul mr-2"></i>
                            Monitoring Registrasi
                        </button>
                        <button
                            onClick={() => setActiveTab("manual")}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === "manual"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            <i className="fas fa-user-plus mr-2"></i>
                            Registrasi Manual
                        </button>
                    </nav>
                </div>

                {/* Tab Content: Monitoring */}
                {activeTab === "monitoring" && (
                    <div className="space-y-6">
                        {/* Filter & Search */}
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                {/* Search */}
                                <div className="lg:col-span-1">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari NIM atau Nama..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                </div>

                                {/* Periode Filter */}
                                <select
                                    value={selectedFilters.periode}
                                    onChange={(e) => setSelectedFilters({...selectedFilters, periode: e.target.value})}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                    <option value="">Semua Periode</option>
                                    {periodes.map((periode) => (
                                        <option
                                            key={periode.id_periode}
                                            value={`${periode.tahun_ajaran}-${periode.jenis_semester}`}
                                        >
                                            {periode.tahun_ajaran} - {periode.jenis_semester.charAt(0).toUpperCase() + periode.jenis_semester.slice(1)}
                                        </option>
                                    ))}
                                </select>

                                {/* Prodi Filter */}
                                <select
                                    value={selectedFilters.prodi}
                                    onChange={(e) => setSelectedFilters({...selectedFilters, prodi: e.target.value})}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                    <option value="">Semua Prodi</option>
                                    {prodis.map((prodi) => (
                                        <option key={prodi.kode_prodi} value={prodi.kode_prodi}>
                                            {prodi.nama_prodi}
                                        </option>
                                    ))}
                                </select>

                                {/* Status Filter */}
                                <select
                                    value={selectedFilters.status}
                                    onChange={(e) => setSelectedFilters({...selectedFilters, status: e.target.value})}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="aktif">Aktif</option>
                                    <option value="cuti">Cuti</option>
                                </select>
                            </div>

                            {/* Filter Buttons */}
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={handleFilter}
                                    className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                                >
                                    <i className="fas fa-filter"></i>
                                    <span>Filter</span>
                                </button>
                                {(search || selectedFilters.periode || selectedFilters.prodi || selectedFilters.status) && (
                                    <button
                                        onClick={handleReset}
                                        className="flex-1 md:flex-none bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <i className="fas fa-redo"></i>
                                        <span>Reset</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Statistik */}
                        {statistik.length > 0 && (
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold mb-4">Statistik Registrasi per Prodi</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {statistik.map((stat, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <h4 className="font-medium text-gray-900 mb-3">{stat.prodi}</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Total Mahasiswa:</span>
                                                    <span className="font-medium">{stat.total}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Sudah Registrasi:</span>
                                                    <span className="font-medium text-green-600">{stat.sudah}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Belum Registrasi:</span>
                                                    <span className="font-medium text-red-600">{stat.belum}</span>
                                                </div>
                                                <div className="pt-2 border-t border-gray-200">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600">Persentase:</span>
                                                        <span className="font-semibold text-blue-600">{stat.persentase}%</span>
                                                    </div>
                                                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full transition-all"
                                                            style={{ width: `${stat.persentase}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Table - Desktop */}
                        <div className="hidden md:block bg-white rounded-lg overflow-hidden border border-gray-200">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr className="text-gray-600 font-semibold text-xs">
                                            <th className="px-6 py-4 text-left uppercase tracking-wider">No</th>
                                            <th className="px-6 py-3 text-left uppercase tracking-wider">NIM</th>
                                            <th className="px-6 py-3 text-left uppercase tracking-wider">Nama</th>
                                            <th className="px-6 py-3 text-left uppercase tracking-wider">Prodi</th>
                                            <th className="px-6 py-3 text-center uppercase tracking-wider">Semester</th>
                                            <th className="px-6 py-3 text-left uppercase tracking-wider">Periode</th>
                                            <th className="px-6 py-3 text-center uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-center uppercase tracking-wider">Tanggal</th>
                                            <th className="px-6 py-3 text-center uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {registrasi.data.length > 0 ? (
                                            registrasi.data.map((item, index) => (
                                                <tr key={item.id_registrasi} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        {registrasi.from + index}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-lg">
                                                            {item.mahasiswa.nim}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                                        {item.mahasiswa.nama}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">
                                                        {item.mahasiswa.prodi.nama_prodi}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <span className="px-3 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-lg">
                                                            {item.semester}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        {item.tahun_ajaran} - {item.jenis_semester.charAt(0).toUpperCase() + item.jenis_semester.slice(1)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <span className={`px-3 py-1 text-xs font-medium rounded-lg ${
                                                            item.status_semester === "aktif"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-yellow-100 text-yellow-800"
                                                        }`}>
                                                            {item.status_semester.charAt(0).toUpperCase() + item.status_semester.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                        {new Date(item.tanggal_registrasi).toLocaleDateString('id-ID')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Link
                                                                href={route("baak.registrasi-semester.edit", item.id_registrasi)}
                                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                                                title="Edit"
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(item.id_registrasi)}
                                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                                                title="Hapus"
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                                                    <i className="fas fa-inbox text-4xl mb-2 text-gray-400"></i>
                                                    <p>Belum ada data registrasi</p>
                                                    <p className="text-sm">Pilih periode untuk melihat data registrasi</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Desktop */}
                            {registrasi.last_page > 1 && (
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        Menampilkan {registrasi.from} - {registrasi.to} dari {registrasi.total} data
                                    </div>
                                    <div className="flex gap-2">
                                        {registrasi.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                preserveState
                                                preserveScroll
                                                className={`px-3 py-1 text-sm rounded ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white'
                                                        : link.url
                                                        ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Cards - Mobile */}
                        <div className="block md:hidden space-y-4">
                            {registrasi.data.length > 0 ? (
                                registrasi.data.map((item) => (
                                    <div key={item.id_registrasi} className="bg-white rounded-lg border border-gray-200 p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <span className="px-2 py-0.5 text-xs font-semibold text-blue-800 bg-blue-100 rounded">
                                                        {item.mahasiswa.nim}
                                                    </span>
                                                    <span className="px-2 py-0.5 text-xs font-semibold text-purple-800 bg-purple-100 rounded">
                                                        Sem {item.semester}
                                                    </span>
                                                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                                                        item.status_semester === "aktif"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                    }`}>
                                                        {item.status_semester.charAt(0).toUpperCase() + item.status_semester.slice(1)}
                                                    </span>
                                                </div>
                                                <h3 className="font-semibold text-gray-900 text-sm break-words">
                                                    {item.mahasiswa.nama}
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="space-y-1 mb-3 text-sm">
                                            <p className="text-gray-600">
                                                <span className="font-medium">Prodi:</span> {item.mahasiswa.prodi.nama_prodi}
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">Periode:</span> {item.tahun_ajaran} - {item.jenis_semester.charAt(0).toUpperCase() + item.jenis_semester.slice(1)}
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">Tanggal:</span> {new Date(item.tanggal_registrasi).toLocaleDateString('id-ID')}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100">
                                            <Link
                                                href={route("baak.registrasi-semester.edit", item.id_registrasi)}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm font-medium text-center transition-colors"
                                            >
                                                <i className="fas fa-edit mr-1"></i> Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(item.id_registrasi)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                                            >
                                                <i className="fas fa-trash mr-1"></i> Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                                    <i className="fas fa-inbox text-4xl mb-2 text-gray-400"></i>
                                    <p className="text-gray-500">Belum ada data registrasi</p>
                                    <p className="text-sm text-gray-400">Pilih periode untuk melihat data</p>
                                </div>
                            )}

                            {/* Pagination Mobile */}
                            {registrasi.last_page > 1 && (
                                <div className="bg-white rounded-lg border border-gray-200 p-4">
                                    <div className="text-sm text-gray-600 mb-3 text-center">
                                        Menampilkan {registrasi.from} - {registrasi.to} dari {registrasi.total} data
                                    </div>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {registrasi.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                preserveState
                                                preserveScroll
                                                className={`px-3 py-1 text-sm rounded ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white'
                                                        : link.url
                                                        ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Tab Content: Registrasi Manual */}
                {activeTab === "manual" && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Registrasi Manual Mahasiswa
                            </h2>
                            <p className="text-sm text-gray-600">
                                Formulir untuk registrasi manual mahasiswa yang tidak dapat registrasi sendiri
                            </p>
                        </div>

                        <Link
                            href={route("baak.registrasi-semester.create")}
                            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition shadow-sm"
                        >
                            <i className="fas fa-plus-circle mr-2"></i>
                            Registrasi Manual Baru
                        </Link>

                        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
                                <i className="fas fa-info-circle mr-2"></i>
                                Kapan Menggunakan Registrasi Manual?
                            </h3>
                            <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
                                <li>Mahasiswa lupa registrasi & periode sudah tutup</li>
                                <li>Mahasiswa tidak bisa akses sistem (lupa password, dll)</li>
                                <li>Kasus force majeure (sakit, darurat)</li>
                                <li>Koreksi data registrasi yang salah</li>
                            </ul>
                            <p className="mt-3 text-xs text-blue-700">
                                <i className="fas fa-exclamation-triangle mr-1"></i>
                                <strong>Catatan:</strong> Keterangan/alasan wajib diisi untuk tracking dan audit
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </BaakLayout>
    );
}
