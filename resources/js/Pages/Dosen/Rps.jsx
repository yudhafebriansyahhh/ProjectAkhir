import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DosenLayout from '@/Layouts/DosenLayout';

export default function Rps() {
    const mataKuliah = [
        { kode: 'IF301', nama: 'Pemrograman Web', rps: 'ada', hari: 'Senin', jam: '09:10-10:50', ruang: 'Lab Komputer 1', dosen: 'Dr. Ahmad Sholeh, M.Kom' },
        { kode: 'IF303', nama: 'Sistem Operasi', rps: 'ada', hari: 'Rabu', jam: '10:00-11:40', ruang: 'R302', dosen: 'Ir. Dewi Lestari, M.T' },
        { kode: 'IF304', nama: 'Rekayasa Perangkat Lunak', rps: 'tidak_ada', hari: 'Kamis', jam: '13:00-14:40', ruang: 'R105', dosen: 'Prof. Siti Aminah, M.T' },
    ];

    const handleDelete = (kode, nama) => {
        if (window.Swal) {
            window.Swal.fire({
                title: 'Yakin ingin hapus?',
                text: "Data ini akan hilang secara permanen.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, hapus',
                cancelButtonText: 'Batal',
                confirmButtonColor: '#dc2626',
            }).then((result) => {
                if (result.isConfirmed) {
                    // Logic untuk hapus RPS
                    console.log('Hapus RPS:', kode);

                    window.Swal.fire({
                        title: 'Terhapus!',
                        text: `RPS ${nama} berhasil dihapus.`,
                        icon: 'success',
                        confirmButtonColor: '#2563eb',
                    }).then(() => {
                        // Redirect atau refresh data
                        // router.reload();
                    });
                }
            });
        } else {
            if (confirm('Yakin ingin hapus? Data ini akan hilang secara permanen.')) {
                console.log('Hapus RPS:', kode);
                alert(`RPS ${nama} berhasil dihapus.`);
                // router.reload();
            }
        }
    };

    const handleViewRPS = (nama) => {
        if (window.Swal) {
            window.Swal.fire({
                title: `Dokumen RPS - ${nama}`,
                text: 'Fitur preview dokumen akan segera tersedia.',
                icon: 'info',
                confirmButtonColor: '#2563eb',
            });
        } else {
            alert(`Dokumen RPS - ${nama}`);
        }
    };

    return (
        <DosenLayout title="RPS">
            <Head title="RPS">
                <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            </Head>

            <div className="container mx-auto px-4 py-8 max-w-[600px] sm:max-w-full">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Rencana Pembelajaran Semester (RPS)</h1>
                    <p className="text-gray-600">
                        Atur dan kelola dokumen RPS untuk setiap mata kuliah yang Anda ampu.
                    </p>
                </div>

                <div className="mb-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                            <span className="text-sm font-medium text-blue-800">Semester Aktif:</span>
                            <span className="text-sm text-blue-600 ml-1">Ganjil 2024/2025</span>
                        </div>
                    </div>

                    <Link
                        href={route('dosen.tambah_rps')}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm border border-blue-600 transition-colors duration-200"
                    >
                        <i className="fas fa-plus mr-2"></i>
                        Tambah RPS
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700">Daftar RPS</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Berikut adalah daftar RPS tambahkan untuk semester ini.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr className="text-gray-600 font-semibold text-xs">
                                    <th className="px-6 py-4 text-left uppercase tracking-wider">No</th>
                                    <th className="px-6 py-4 text-left uppercase tracking-wider">Kode MK</th>
                                    <th className="px-6 py-4 text-start uppercase tracking-wider">Dosen Pengampu</th>
                                    <th className="px-6 py-4 text-left uppercase tracking-wider">Dokumen RPS</th>
                                    <th className="px-6 py-4 text-center uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {mataKuliah.map((mk, index) => (
                                    <tr key={mk.kode} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {mk.kode}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-700">
                                            {mk.dosen}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {mk.rps === 'ada' ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handleViewRPS(mk.nama)}
                                                    className="inline-flex items-center px-3 py-1.5 border gap-2 border-green-300 text-green-700 bg-green-50 hover:bg-green-100 rounded-lg text-xs font-semibold transition duration-200"
                                                >
                                                    <i className="fa-regular fa-file-lines"></i>
                                                    <span>RPS</span>
                                                </button>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1.5 gap-2 bg-gray-100 text-gray-500 rounded-lg text-xs font-semibold">
                                                    <i className="fa-solid fa-xmark"></i>
                                                    <span>Tidak Ada</span>
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                            <Link
                                                href={route('dosen.edit_rps')}
                                                className="inline-flex items-center px-3 py-1.5 border gap-2 border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg text-xs font-semibold transition duration-200"
                                            >
                                                <i className="fa-solid fa-pen-to-square"></i>
                                                <span>Edit</span>
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(mk.kode, mk.nama)}
                                                className="inline-flex items-center px-3 py-1.5 border gap-2 border-red-300 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-semibold transition duration-200 ml-2"
                                            >
                                                <i className="fa-regular fa-trash-can"></i>
                                                <span>Hapus</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DosenLayout>
    );
}
