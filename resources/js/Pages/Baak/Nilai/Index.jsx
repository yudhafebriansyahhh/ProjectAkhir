// resources/js/Pages/Baak/Nilai/Index.jsx

import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import BaakLayout from "@/Layouts/BaakLayout";

export default function Index({
    kelas,
    prodis,
    dosens,
    tahunAjaranList,
    filters,
}) {
    const [search, setSearch] = useState(filters.search || "");
    const [tahunAjaran, setTahunAjaran] = useState(filters.tahun_ajaran || "");
    const [prodi, setProdi] = useState(filters.prodi || "");
    const [dosen, setDosen] = useState(filters.dosen || "");
    const [statusNilai, setStatusNilai] = useState(filters.status_nilai || "");

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(
            route("baak.nilai.index"),
            {
                search,
                tahun_ajaran: tahunAjaran,
                prodi,
                dosen,
                status_nilai: statusNilai,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleReset = () => {
        setSearch("");
        setTahunAjaran("");
        setProdi("");
        setDosen("");
        setStatusNilai("");
        router.get(route("baak.nilai.index"));
    };

    const getStatusBadge = (status) => {
        const badges = {
            belum: "bg-red-100 text-red-700",
            sebagian: "bg-yellow-100 text-yellow-700",
            lengkap: "bg-green-100 text-green-700",
        };
        return badges[status] || "bg-gray-100 text-gray-700";
    };

    const getStatusLabel = (status) => {
        const labels = {
            belum: "Belum Diinput",
            sebagian: "Sebagian",
            lengkap: "Lengkap",
        };
        return labels[status] || status;
    };

    const handleBulkLock = (action) => {
        if (!tahunAjaran) {
            window.Swal.fire({
                icon: 'warning',
                title: 'Pilih Periode Dulu',
                text: 'Silakan pilih Tahun Ajaran terlebih dahulu',
                confirmButtonColor: '#3B82F6'
            });
            return;
        }

        // Determine jenis_semester from current filter or guess
        const jenisSemester = 'ganjil'; // You might want to add a jenis_semester filter

        const actionText = action === 'lock' ? 'Lock' : 'Unlock';
        const confirmText = action === 'lock'
            ? 'Semua nilai di periode ini akan di-lock dan tidak dapat diubah oleh dosen.'
            : 'Semua nilai di periode ini akan di-unlock dan dapat diubah kembali oleh dosen.';

        window.Swal.fire({
            title: `${actionText} All Period?`,
            html: `
                <p class="mb-2">${confirmText}</p>
                <div class="bg-blue-50 border border-blue-200 rounded p-3 text-left text-sm">
                    <p><strong>Periode:</strong> ${tahunAjaran}</p>
                    ${prodi ? `<p><strong>Prodi:</strong> ${prodis.find(p => p.kode_prodi === prodi)?.nama_prodi}</p>` : ''}
                    <p class="text-xs text-gray-600 mt-2">⚠️ Aksi ini akan mempengaruhi semua kelas di periode ini</p>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: action === 'lock' ? '#16a34a' : '#3b82f6',
            cancelButtonColor: '#6b7280',
            confirmButtonText: `Ya, ${actionText}!`,
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('baak.nilai.bulk-lock'), {
                    tahun_ajaran: tahunAjaran,
                    jenis_semester: jenisSemester,
                    kode_prodi: prodi || null,
                    action: action
                }, {
                    preserveScroll: true,
                    onSuccess: () => {
                        window.Swal.fire({
                            icon: 'success',
                            title: 'Berhasil!',
                            text: `Nilai berhasil di-${action} untuk periode ini.`,
                            timer: 2000,
                            showConfirmButton: false
                        });
                    },
                    onError: () => {
                        window.Swal.fire({
                            icon: 'error',
                            title: 'Gagal!',
                            text: 'Terjadi kesalahan. Silakan coba lagi.',
                            confirmButtonColor: '#dc2626'
                        });
                    }
                });
            }
        });
    };

    return (
        <BaakLayout title="Manajemen Nilai">
            <Head title="Manajemen Nilai" />

            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">
                        Manajemen Nilai
                    </h1>
                    <p className="text-gray-600">
                        Monitor dan kelola nilai mahasiswa per kelas
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
                        {/* Search */}
                        <div className="lg:col-span-2">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari Mata Kuliah atau Kelas..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>

                        {/* Tahun Ajaran */}
                        <select
                            value={tahunAjaran}
                            onChange={(e) => setTahunAjaran(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Semua Tahun Ajaran</option>
                            {tahunAjaranList.map((ta) => (
                                <option key={ta} value={ta}>
                                    {ta}
                                </option>
                            ))}
                        </select>

                        {/* Prodi */}
                        <select
                            value={prodi}
                            onChange={(e) => setProdi(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Semua Prodi</option>
                            {prodis.map((p) => (
                                <option key={p.kode_prodi} value={p.kode_prodi}>
                                    {p.nama_prodi}
                                </option>
                            ))}
                        </select>

                        {/* Dosen */}
                        <select
                            value={dosen}
                            onChange={(e) => setDosen(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Semua Dosen</option>
                            {dosens.map((d) => (
                                <option key={d.id_dosen} value={d.id_dosen}>
                                    {d.nama}
                                </option>
                            ))}
                        </select>

                        {/* Status Nilai */}
                        <select
                            value={statusNilai}
                            onChange={(e) => setStatusNilai(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Semua Status</option>
                            <option value="belum">Belum Diinput</option>
                            <option value="sebagian">Sebagian</option>
                            <option value="lengkap">Lengkap</option>
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
                        {(search ||
                            tahunAjaran ||
                            prodi ||
                            dosen ||
                            statusNilai) && (
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

                {/* Bulk Lock Section */}
                {(tahunAjaran && (statusNilai === 'lengkap' || statusNilai === '')) && (
                    <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                                    🔒 Finalisasi Nilai Periode
                                </h3>
                                <p className="text-xs text-gray-600">
                                    Lock/Unlock semua nilai untuk periode: <span className="font-semibold">{tahunAjaran}</span>
                                    {prodi && ` - Prodi: ${prodis.find(p => p.kode_prodi === prodi)?.nama_prodi}`}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleBulkLock('lock')}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                                >
                                    <i className="fas fa-lock"></i>
                                    Lock All Period
                                </button>
                                <button
                                    onClick={() => handleBulkLock('unlock')}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                                >
                                    <i className="fas fa-lock-open"></i>
                                    Unlock All Period
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table - Desktop */}
                <div className="hidden md:block bg-white rounded-lg overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr className="text-gray-600 font-semibold text-xs">
                                    <th className="px-6 py-4 text-left uppercase tracking-wider">
                                        No
                                    </th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">
                                        Kode MK
                                    </th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">
                                        Mata Kuliah
                                    </th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">
                                        Kelas
                                    </th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">
                                        Dosen
                                    </th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">
                                        Jumlah Mhs
                                    </th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">
                                        Status Input
                                    </th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">
                                        Status Lock
                                    </th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {kelas.data.length > 0 ? (
                                    kelas.data.map((item, index) => (
                                        <tr
                                            key={item.id_kelas}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {kelas.from + index}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {
                                                    item.mata_kuliah_periode
                                                        ?.mata_kuliah
                                                        ?.kode_matkul
                                                }
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {
                                                    item.mata_kuliah_periode
                                                        ?.mata_kuliah
                                                        ?.nama_matkul
                                                }
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                                                Kelas {item.nama_kelas}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {item.dosen?.nama}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                                                {item.nilai_count}/
                                                {item.total_mahasiswa}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span
                                                    className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${getStatusBadge(
                                                        item.status_input
                                                    )}`}
                                                >
                                                    {getStatusLabel(
                                                        item.status_input
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {item.is_locked ? (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700">
                                                        <i className="fas fa-lock mr-1"></i>{" "}
                                                        Locked
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                                                        <i className="fas fa-lock-open mr-1"></i>{" "}
                                                        Unlocked
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                <Link
                                                    href={route(
                                                        "baak.nilai.show",
                                                        item.id_kelas
                                                    )}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                                    title="Detail Nilai"
                                                >
                                                    <i className="fas fa-eye"></i>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="9"
                                            className="px-6 py-8 text-center text-gray-500"
                                        >
                                            <i className="fas fa-inbox text-4xl mb-2 text-gray-400"></i>
                                            <p>Tidak ada data kelas</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {kelas.last_page > 1 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Menampilkan {kelas.from} - {kelas.to} dari{" "}
                                {kelas.total} data
                            </div>
                            <div className="flex gap-2">
                                {kelas.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || "#"}
                                        preserveState
                                        preserveScroll
                                        className={`px-3 py-1 text-sm rounded ${
                                            link.active
                                                ? "bg-blue-600 text-white"
                                                : link.url
                                                ? "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Cards - Mobile */}
                <div className="block md:hidden space-y-4">
                    {kelas.data.length > 0 ? (
                        kelas.data.map((item) => (
                            <div
                                key={item.id_kelas}
                                className="bg-white rounded-lg border border-gray-200 p-4"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {
                                                item.mata_kuliah_periode
                                                    ?.mata_kuliah?.nama_matkul
                                            }
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {
                                                item.mata_kuliah_periode
                                                    ?.mata_kuliah?.kode_matkul
                                            }{" "}
                                            - Kelas {item.nama_kelas}
                                        </p>
                                    </div>
                                    <span
                                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusBadge(
                                            item.status_input
                                        )}`}
                                    >
                                        {getStatusLabel(item.status_input)}
                                    </span>
                                </div>
                                <div className="space-y-1 mb-3 text-sm">
                                    <p className="text-gray-600">
                                        <span className="font-medium">
                                            Dosen:
                                        </span>{" "}
                                        {item.dosen?.nama}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">
                                            Mahasiswa:
                                        </span>{" "}
                                        {item.nilai_count}/
                                        {item.total_mahasiswa}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">
                                            Status:
                                        </span>{" "}
                                        {item.is_locked ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs font-medium">
                                                <i className="fas fa-lock mr-1"></i>{" "}
                                                Locked
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-xs font-medium">
                                                <i className="fas fa-lock-open mr-1"></i>{" "}
                                                Unlocked
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <Link
                                    href={route(
                                        "baak.nilai.show",
                                        item.id_kelas
                                    )}
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium text-center block transition-colors"
                                >
                                    <i className="fas fa-eye mr-2"></i> Lihat
                                    Detail
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                            <i className="fas fa-inbox text-4xl mb-2 text-gray-400"></i>
                            <p className="text-gray-500">
                                Tidak ada data kelas
                            </p>
                        </div>
                    )}

                    {/* Pagination Mobile */}
                    {kelas.last_page > 1 && (
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="text-sm text-gray-600 mb-3 text-center">
                                Menampilkan {kelas.from} - {kelas.to} dari{" "}
                                {kelas.total} data
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {kelas.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || "#"}
                                        preserveState
                                        preserveScroll
                                        className={`px-3 py-1 text-sm rounded ${
                                            link.active
                                                ? "bg-blue-600 text-white"
                                                : link.url
                                                ? "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
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
