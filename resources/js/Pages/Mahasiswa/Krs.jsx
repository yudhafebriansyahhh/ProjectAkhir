import { Head } from '@inertiajs/react';
import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import Swal from 'sweetalert2';

export default function Krs() {
    const mataKuliah = [
        { kode: 'IF301', nama: 'Pemrograman Web', dosen: 'Dr. Ahmad Sholeh, M.Kom', hari: 'Senin', jam: '09:10-10:50', ruang: 'Lab Komputer 1', sks: 3 },
        { kode: 'IF303', nama: 'Sistem Operasi', dosen: 'Dr. Budi Santoso, M.Kom', hari: 'Rabu', jam: '10:00-11:40', ruang: 'R302', sks: 3 },
        { kode: 'IF304', nama: 'Rekayasa Perangkat Lunak', dosen: 'Ir. Dewi Lestari, M.T', hari: 'Kamis', jam: '13:00-14:40', ruang: 'R105', sks: 3 },
    ];

    const handleHapus = (id) => {
        Swal.fire({
            title: 'Yakin ingin hapus?',
            text: "Data ini akan hilang secara permanen.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = `/hapus/${id}`;
            }
        });
    };

    return (
        <MahasiswaLayout title="Kartu Rencana Studi (KRS)">
            <Head title="Kartu Rencana Studi (KRS)" />

            <div className="container mx-auto px-4 py-8 max-w-[600px] sm:max-w-full ">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Kartu Rencana Studi (KRS)</h1>
                    <p className="text-gray-600">Kelola pengambilan mata kuliah untuk semester mendatang dan lihat riwayat KRS Anda.</p>
                </div>

                <div className="mb-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                            <span className="text-sm font-medium text-blue-800">Semester Aktif: </span>
                            <span className="text-sm text-blue-600 ml-1">Ganjil 2024/2025</span>
                        </div>
                    </div>

                    <a href="/mahasiswa/tambah-krs"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm border border-blue-600 transition-colors duration-200">
                        <i className="fas fa-plus mr-2"></i>
                        Tambah Mata Kuliah
                    </a>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700">Daftar Mata Kuliah yang Diambil</h3>
                        <p className="text-sm text-gray-600 mt-1">Berikut adalah mata kuliah yang telah Anda tambahkan untuk semester ini.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr className="text-gray-600 font-semibold text-xs">
                                    <th className="px-6 py-4 text-left uppercase tracking-wider">No</th>
                                    <th className="px-6 py-4 text-left uppercase tracking-wider">Kode MK</th>
                                    <th className="px-6 py-4 text-left uppercase tracking-wider">Mata Kuliah</th>
                                    <th className="px-6 py-4 text-left uppercase tracking-wider">Dosen</th>
                                    <th className="px-6 py-4 text-center uppercase tracking-wider">SKS</th>
                                    <th className="px-6 py-4 text-center uppercase tracking-wider">Jadwal</th>
                                    <th className="px-6 py-4 text-center uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {mataKuliah.map((mk, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 ">
                                            {mk.kode}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            <div className="font-medium">{mk.nama}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {mk.dosen}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-gray-700">
                                            {mk.sks}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                                            <div className="text-xs">
                                                <div className="font-medium text-gray-700">{mk.hari}</div>
                                                <div className="text-gray-600">{mk.jam}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                            <button type="button"
                                                onClick={() => handleHapus(mk.kode)}
                                                className="hapus-btn inline-flex items-center px-3 py-1.5 border gap-2 border-red-300 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-semibold transition duration-200">
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

                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 max-w-sm mt-6">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700">Ringkasan SKS</h3>
                        <p className="text-sm text-gray-600 mt-1">Total beban SKS berdasarkan mata kuliah yang telah Anda pilih.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Kategori</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        SKS</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr className="hover:bg-gray-50 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        Pemrograman
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        <div className="font-medium">3</div>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        Sistem Operasi
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        <div className="font-medium">3</div>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        Total SKS
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        <div className="font-medium">6</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <a href="/mahasiswa/krs"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm border border-blue-600">
                        <i className="fa-solid fa-save mr-2"></i> Simpan KRS
                    </a>
                </div>
            </div>
        </MahasiswaLayout>
    );
}
