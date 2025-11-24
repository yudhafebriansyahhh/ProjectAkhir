import React, { useState, useMemo } from "react";
import { usePage } from "@inertiajs/react";
import DosenLayout from "@/Layouts/DosenLayout";

export default function Jadwal() {
    const { props } = usePage();
    const jadwal = props.jadwal ?? [];
    const dosen = props.dosen ?? null;

    const [filterHari, setFilterHari] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");

    // Daftar hari
    const daftarHari = ["Semua", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

    // Filter dan search
    const jadwalFiltered = useMemo(() => {
        return jadwal.filter((item) => {
            const matchHari = filterHari === "Semua" || item.hari === filterHari;
            const matchSearch = 
                item.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.kode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.kelas?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchHari && matchSearch;
        });
    }, [jadwal, filterHari, searchQuery]);

    // Hitung total SKS
    const totalSKS = useMemo(() => {
        return jadwal.reduce((sum, item) => {
            const sks = parseInt(item.sks) || 0;
            return sum + sks;
        }, 0);
    }, [jadwal]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-[600px] sm:max-w-full">
                
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-700 mb-2">Jadwal Mengajar</h1>
                <p className="text-gray-600">
                    Lihat jadwal mengajar Anda untuk semester ini.
                </p>
            </div>

            {jadwal.length === 0 ? (
                /* Empty State */
                <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
                    <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-calendar-xmark text-gray-400 text-2xl"></i>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            Belum Ada Jadwal
                        </h3>
                        <p className="text-gray-500 text-sm">
                            Jadwal mengajar Anda akan muncul di sini setelah dijadwalkan oleh admin.
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {/* Total Mata Kuliah */}
                        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-600">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Mata Kuliah</p>
                                    <p className="text-3xl font-bold text-gray-800">{jadwal.length}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <i className="fas fa-book text-blue-600 text-xl"></i>
                                </div>
                            </div>
                        </div>

                        {/* Total SKS */}
                        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-600">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total SKS</p>
                                    <p className="text-3xl font-bold text-gray-800">{totalSKS}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <i className="fas fa-check-circle text-green-600 text-xl"></i>
                                </div>
                            </div>
                        </div>

                        {/* Total Kelas */}
                        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-purple-600">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Kelas</p>
                                    <p className="text-3xl font-bold text-gray-800">{jadwal.length}</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <i className="fas fa-users text-purple-600 text-xl"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Search Box */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cari Mata Kuliah
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Ketik nama, kode, atau kelas..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <i className="fas fa-search absolute left-3 top-3 text-gray-400 text-sm"></i>
                                </div>
                            </div>

                            {/* Filter Hari */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Filter Hari
                                </label>
                                <select
                                    value={filterHari}
                                    onChange={(e) => setFilterHari(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {daftarHari.map((hari) => (
                                        <option key={hari} value={hari}>
                                            {hari}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Result Counter */}
                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Menampilkan <span className="font-semibold text-blue-600">{jadwalFiltered.length}</span> dari <span className="font-semibold">{jadwal.length}</span> jadwal
                            </p>
                            {(searchQuery || filterHari !== "Semua") && (
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setFilterHari("Semua");
                                    }}
                                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                                >
                                    <i className="fas fa-times text-xs"></i>
                                    Reset Filter
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-700">Daftar Jadwal</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr className="text-gray-600 font-semibold text-xs">
                                        <th className="px-6 py-4 text-left">No</th>
                                        <th className="px-6 py-4 text-left">Kode</th>
                                        <th className="px-6 py-4 text-left">Mata Kuliah</th>
                                        <th className="px-6 py-4 text-left">Kelas</th>
                                        <th className="px-6 py-4 text-left">Hari</th>
                                        <th className="px-6 py-4 text-left">Jam</th>
                                        <th className="px-6 py-4 text-left">Ruangan</th>
                                        <th className="px-6 py-4 text-center">SKS</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {jadwalFiltered.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-8 text-center">
                                                <div className="flex flex-col items-center">
                                                    <i className="fas fa-search text-gray-300 text-3xl mb-2"></i>
                                                    <p className="text-gray-500 text-sm">Tidak ada jadwal yang sesuai</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        jadwalFiltered.map((item, index) => (
                                            <tr
                                                key={item.id_kelas || index}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 text-sm">{index + 1}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold">
                                                        {item.kode}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                                    {item.nama}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className="inline-flex items-center px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-semibold">
                                                        {item.kelas}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-700">
                                                    {item.hari}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    <i className="far fa-clock mr-1 text-gray-400"></i>
                                                    {item.jam}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    <i className="fas fa-door-open mr-1 text-gray-400"></i>
                                                    {item.ruang}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">
                                                        {item.sks} SKS
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

Jadwal.layout = (page) => <DosenLayout>{page}</DosenLayout>;