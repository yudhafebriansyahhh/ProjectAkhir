import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';
import Swal from 'sweetalert2';

export default function Show({ krs, totalSks, mataKuliahList, allKrsList }) {
    const [selectedKrsId, setSelectedKrsId] = useState(krs.id_krs);

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-700',
            approved: 'bg-green-100 text-green-700',
            rejected: 'bg-red-100 text-red-700',
        };
        return badges[status] || 'bg-gray-100 text-gray-700';
    };

    const getStatusLabel = (status) => {
        const labels = {
            pending: 'Menunggu',
            approved: 'Disetujui',
            rejected: 'Ditolak',
        };
        return labels[status] || status;
    };

    const getSemesterLabel = (krsItem) => {
        const jenisSemester = krsItem.semester % 2 === 0 ? 'Genap' : 'Ganjil';
        return `SEMESTER ${krsItem.semester} #${jenisSemester} - Tahun ${krsItem.tahun_ajaran}`;
    };

    const handleChangeSemester = (e) => {
        const newKrsId = e.target.value;
        if (newKrsId !== selectedKrsId) {
            router.get(route('baak.krs.show', newKrsId));
        }
    };

    return (
        <BaakLayout title="Detail KRS">
            <Head title="Detail KRS" />

            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={route('baak.krs.index')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center mb-4 transition-colors"
                    >
                        <i className="fas fa-arrow-left mr-2"></i>
                        Kembali ke Daftar KRS
                    </Link>
                </div>

                {/* Info Mahasiswa Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">NIM</p>
                            <p className="font-semibold text-gray-900">{krs.mahasiswa?.nim}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Nama</p>
                            <p className="font-semibold text-gray-900">{krs.mahasiswa?.nama}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Program Studi</p>
                            <p className="font-semibold text-gray-900">{krs.mahasiswa?.prodi?.nama_prodi}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Status KRS</p>
                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${getStatusBadge(krs.status)}`}>
                                {getStatusLabel(krs.status)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* KRS Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header dengan Dropdown Semester - WORKING NOW! */}
                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                            <div className="flex-1 w-full md:w-auto">
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                    Pilih Semester untuk Melihat KRS
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedKrsId}
                                        onChange={handleChangeSemester}
                                        style={{
                                            backgroundImage: 'none',
                                            WebkitAppearance: 'none',
                                            MozAppearance: 'none',
                                            appearance: 'none'
                                        }}
                                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    >
                                        {allKrsList && allKrsList.length > 0 ? (
                                            allKrsList.map((krsItem) => (
                                                <option key={krsItem.id_krs} value={krsItem.id_krs}>
                                                    {getSemesterLabel(krsItem)} - {getStatusLabel(krsItem.status)} ({krsItem.total_sks || 0} SKS)
                                                </option>
                                            ))
                                        ) : (
                                            <option value={krs.id_krs}>
                                                {getSemesterLabel(krs)} - {getStatusLabel(krs.status)}
                                            </option>
                                        )}
                                    </select>
                                    <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        Swal.fire({
                                            icon: 'info',
                                            title: 'Coming Soon',
                                            text: 'Fitur cetak KRS akan segera tersedia',
                                            confirmButtonText: 'OK',
                                            confirmButtonColor: '#3B82F6'
                                        });
                                    }}
                                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                                    title="Cetak KRS"
                                >
                                    <i className="fas fa-print"></i>
                                    <span className="hidden sm:inline">Cetak</span>
                                </button>
                            </div>
                        </div>

                        {/* Info Badge */}
                        {allKrsList && allKrsList.length > 1 && (
                            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                                <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
                                <p className="text-sm text-blue-800">
                                    Mahasiswa ini memiliki <span className="font-semibold">{allKrsList.length} semester</span> data KRS.
                                    Pilih semester di dropdown untuk melihat detail KRS lainnya.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Table - Desktop */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">No</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Kode</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Mata Kuliah</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Kelas</th>
                                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">SKS</th>
                                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Jadwal</th>
                                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Ruang</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Dosen</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {mataKuliahList && mataKuliahList.length > 0 ? (
                                    mataKuliahList.map((mk, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {mk.kode_matkul}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {mk.nama_matkul}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                Kelas {mk.nama_kelas}
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm text-gray-900 font-semibold">
                                                {mk.sks}
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm text-gray-700">
                                                {mk.hari}, {mk.jam_mulai}-{mk.jam_selesai}
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm text-gray-700">
                                                {mk.ruang}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {mk.dosen}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                            <i className="fas fa-inbox text-4xl mb-2 text-gray-400 block"></i>
                                            <p className="font-medium">Tidak ada mata kuliah yang diambil</p>
                                            <p className="text-sm text-gray-400 mt-1">Mahasiswa belum mengisi KRS untuk semester ini</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            {mataKuliahList && mataKuliahList.length > 0 && (
                                <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-left">
                                            <span className="text-sm font-bold text-gray-900">Total SKS</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-lg font-bold text-gray-900">{totalSks}</span>
                                        </td>
                                        <td colSpan="3"></td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>

                    {/* Cards - Mobile */}
                    <div className="block md:hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                            <p className="text-sm font-semibold text-gray-700">
                                Total: {mataKuliahList?.length || 0} Mata Kuliah
                            </p>
                        </div>

                        {mataKuliahList && mataKuliahList.length > 0 ? (
                            <>
                                <div className="divide-y divide-gray-200">
                                    {mataKuliahList.map((mk, index) => (
                                        <div key={index} className="p-4">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-sm font-semibold text-blue-700">
                                                        {index + 1}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <span className="px-2 py-0.5 text-xs font-semibold text-blue-800 bg-blue-100 rounded">
                                                            {mk.kode_matkul}
                                                        </span>
                                                        <span className="px-2 py-0.5 text-xs font-semibold text-purple-800 bg-purple-100 rounded">
                                                            Kelas {mk.nama_kelas}
                                                        </span>
                                                        <span className="px-2 py-0.5 text-xs font-semibold text-green-800 bg-green-100 rounded">
                                                            {mk.sks} SKS
                                                        </span>
                                                    </div>
                                                    <p className="font-medium text-gray-900 mb-2">{mk.nama_matkul}</p>
                                                    <div className="space-y-1 text-xs text-gray-600">
                                                        <p><span className="font-medium">Dosen:</span> {mk.dosen}</p>
                                                        <p><span className="font-medium">Jadwal:</span> {mk.hari}, {mk.jam_mulai}-{mk.jam_selesai}</p>
                                                        <p><span className="font-medium">Ruang:</span> {mk.ruang}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 bg-gray-50 border-t-2 border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-gray-900">Total SKS</span>
                                        <span className="text-lg font-bold text-gray-900">{totalSks}</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="p-12 text-center text-gray-500">
                                <i className="fas fa-inbox text-4xl mb-2 text-gray-400 block"></i>
                                <p className="font-medium">Tidak ada mata kuliah yang diambil</p>
                                <p className="text-sm text-gray-400 mt-1">Mahasiswa belum mengisi KRS untuk semester ini</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Tambahan */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <p className="text-xs text-gray-500 mb-1">Dosen Wali</p>
                        <p className="font-semibold text-gray-900">{krs.mahasiswa?.dosen_wali?.nama || '-'}</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <p className="text-xs text-gray-500 mb-1">Tanggal Pengisian</p>
                        <p className="font-semibold text-gray-900">
                            {new Date(krs.tanggal_pengisian).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <p className="text-xs text-gray-500 mb-1">Jumlah Mata Kuliah</p>
                        <p className="font-semibold text-gray-900">{mataKuliahList?.length || 0} Mata Kuliah</p>
                    </div>
                </div>
            </div>
        </BaakLayout>
    );
}
