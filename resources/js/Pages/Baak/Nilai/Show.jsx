// resources/js/Pages/Baak/Nilai/Show.jsx

import { Head, Link, router } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';
import Swal from 'sweetalert2';

export default function Show({ kelas, nilaiList, isLocked }) {
    const handleToggleLock = () => {
        const action = isLocked ? 'unlock' : 'lock';
        const actionText = isLocked ? 'Unlock' : 'Lock';
        const confirmText = isLocked
            ? 'Dosen akan dapat mengedit nilai kembali.'
            : 'Nilai tidak dapat diubah kecuali di-unlock oleh BAAK.';

        Swal.fire({
            title: `${actionText} Nilai?`,
            text: confirmText,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: isLocked ? '#3b82f6' : '#16a34a',
            cancelButtonColor: '#6b7280',
            confirmButtonText: `Ya, ${actionText}!`,
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('baak.nilai.toggle-lock', kelas.id_kelas), {}, {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil!',
                            text: `Nilai berhasil di-${action}.`,
                            timer: 2000,
                            showConfirmButton: false
                        });
                    }
                });
            }
        });
    };

    const handleExport = () => {
        Swal.fire({
            icon: 'info',
            title: 'Coming Soon',
            text: 'Fitur export nilai akan segera tersedia',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3B82F6'
        });
    };

    const getGradeBadgeColor = (grade) => {
        if (!grade) return 'bg-gray-100 text-gray-700';
        if (['A', 'A-'].includes(grade)) return 'bg-green-100 text-green-700';
        if (['B+', 'B', 'B-'].includes(grade)) return 'bg-blue-100 text-blue-700';
        if (['C+', 'C'].includes(grade)) return 'bg-yellow-100 text-yellow-700';
        if (grade === 'D') return 'bg-orange-100 text-orange-700';
        return 'bg-red-100 text-red-700';
    };

    const calculateStats = () => {
        const total = nilaiList.length;
        const sudahDiinput = nilaiList.filter(n => n.nilai_akhir !== null).length;
        const belumDiinput = total - sudahDiinput;
        const persentase = total > 0 ? ((sudahDiinput / total) * 100).toFixed(1) : 0;

        return { total, sudahDiinput, belumDiinput, persentase };
    };

    const stats = calculateStats();

    return (
        <BaakLayout title="Detail Nilai">
            <Head title="Detail Nilai" />

            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={route('baak.nilai.index')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center mb-4 transition-colors"
                    >
                        <i className="fas fa-arrow-left mr-2"></i>
                        Kembali ke Daftar Nilai
                    </Link>
                </div>

                {/* Info Kelas Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Kode Mata Kuliah</p>
                            <p className="font-semibold text-gray-900">
                                {kelas.mata_kuliah_periode?.mata_kuliah?.kode_matkul}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Mata Kuliah</p>
                            <p className="font-semibold text-gray-900">
                                {kelas.mata_kuliah_periode?.mata_kuliah?.nama_matkul}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Kelas</p>
                            <p className="font-semibold text-gray-900">Kelas {kelas.nama_kelas}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Dosen Pengampu</p>
                            <p className="font-semibold text-gray-900">{kelas.dosen?.nama}</p>
                        </div>
                    </div>

                    {/* Bobot Nilai Info */}
                    {kelas.bobot_nilai && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-500 mb-2">Bobot Penilaian</p>
                            <div className="flex gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Tugas:</span>
                                    <span className="ml-1 font-semibold text-gray-900">
                                        {kelas.bobot_nilai.bobot_tugas}%
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-600">UTS:</span>
                                    <span className="ml-1 font-semibold text-gray-900">
                                        {kelas.bobot_nilai.bobot_uts}%
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-600">UAS:</span>
                                    <span className="ml-1 font-semibold text-gray-900">
                                        {kelas.bobot_nilai.bobot_uas}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <i className="fas fa-users text-blue-600 text-xl"></i>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Total Mahasiswa</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <i className="fas fa-check-circle text-green-600 text-xl"></i>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Sudah Diinput</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.sudahDiinput}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <i className="fas fa-times-circle text-red-600 text-xl"></i>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Belum Diinput</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.belumDiinput}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <i className="fas fa-percentage text-purple-600 text-xl"></i>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Progress</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.persentase}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Nilai */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header dengan Action Buttons */}
                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Daftar Nilai Mahasiswa</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Status: {isLocked ? (
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                                            <i className="fas fa-lock mr-1"></i> Locked
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                            <i className="fas fa-lock-open mr-1"></i> Unlocked
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleToggleLock}
                                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                                        isLocked
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                                    disabled={stats.sudahDiinput === 0}
                                >
                                    <i className={`fas fa-${isLocked ? 'lock-open' : 'lock'}`}></i>
                                    <span className="hidden sm:inline">{isLocked ? 'Unlock' : 'Lock'} Nilai</span>
                                </button>
                                <button
                                    onClick={handleExport}
                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                                >
                                    <i className="fas fa-download"></i>
                                    <span className="hidden sm:inline">Export</span>
                                </button>
                            </div>
                        </div>

                        {/* Warning if locked */}
                        {isLocked && (
                            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                                <i className="fas fa-lock text-green-600 mt-0.5"></i>
                                <p className="text-sm text-green-800">
                                    Nilai sudah di-lock. Dosen tidak dapat mengedit nilai. Klik <strong>Unlock</strong> untuk membuka kembali.
                                </p>
                            </div>
                        )}

                        {/* Warning if not locked */}
                        {!isLocked && stats.sudahDiinput > 0 && (
                            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                                <i className="fas fa-exclamation-triangle text-yellow-600 mt-0.5"></i>
                                <p className="text-sm text-yellow-800">
                                    Nilai belum di-lock. Dosen masih dapat mengedit nilai. Klik <strong>Lock</strong> untuk finalisasi.
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
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">NIM</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Nama</th>
                                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Tugas</th>
                                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">UTS</th>
                                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">UAS</th>
                                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Nilai Akhir</th>
                                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Grade</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {nilaiList && nilaiList.length > 0 ? (
                                    nilaiList.map((nilai, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {nilai.nim}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {nilai.nama}
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm text-gray-900">
                                                {nilai.nilai_tugas !== null ? Number(nilai.nilai_tugas).toFixed(0) : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm text-gray-900">
                                                {nilai.nilai_uts !== null ? Number(nilai.nilai_uts).toFixed(0) : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm text-gray-900">
                                                {nilai.nilai_uas !== null ? Number(nilai.nilai_uas).toFixed(0) : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                                                {nilai.nilai_akhir !== null ? Number(nilai.nilai_akhir).toFixed(2) : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {nilai.nilai_huruf ? (
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold ${getGradeBadgeColor(nilai.nilai_huruf)}`}>
                                                        {nilai.nilai_huruf}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                            <i className="fas fa-inbox text-4xl mb-2 text-gray-400 block"></i>
                                            <p className="font-medium">Tidak ada data mahasiswa</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Cards - Mobile */}
                    <div className="block md:hidden">
                        {nilaiList && nilaiList.length > 0 ? (
                            <div className="divide-y divide-gray-200">
                                {nilaiList.map((nilai, index) => (
                                    <div key={index} className="p-4">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-sm font-semibold text-blue-700">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900">{nilai.nama}</p>
                                                <p className="text-sm text-gray-600">{nilai.nim}</p>
                                            </div>
                                            {nilai.nilai_huruf && (
                                                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold ${getGradeBadgeColor(nilai.nilai_huruf)}`}>
                                                    {nilai.nilai_huruf}
                                                </span>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="bg-gray-50 rounded p-2">
                                                <p className="text-xs text-gray-500">Tugas</p>
                                                <p className="font-semibold text-gray-900">
                                                    {nilai.nilai_tugas !== null ? Number(nilai.nilai_tugas).toFixed(0) : '-'}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 rounded p-2">
                                                <p className="text-xs text-gray-500">UTS</p>
                                                <p className="font-semibold text-gray-900">
                                                    {nilai.nilai_uts !== null ? Number(nilai.nilai_uts).toFixed(0) : '-'}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 rounded p-2">
                                                <p className="text-xs text-gray-500">UAS</p>
                                                <p className="font-semibold text-gray-900">
                                                    {nilai.nilai_uas !== null ? Number(nilai.nilai_uas).toFixed(0) : '-'}
                                                </p>
                                            </div>
                                            <div className="bg-blue-50 rounded p-2">
                                                <p className="text-xs text-gray-500">Nilai Akhir</p>
                                                <p className="font-semibold text-blue-900">
                                                    {nilai.nilai_akhir !== null ? Number(nilai.nilai_akhir).toFixed(2) : '-'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-gray-500">
                                <i className="fas fa-inbox text-4xl mb-2 text-gray-400 block"></i>
                                <p className="font-medium">Tidak ada data mahasiswa</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </BaakLayout>
    );
}
