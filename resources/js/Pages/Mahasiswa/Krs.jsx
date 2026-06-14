import { Head, Link, router } from '@inertiajs/react';
import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import Swal from 'sweetalert2';

export default function Krs({ semesterAktif = '-', krsStatus = null, mataKuliah = [], canFillKrs = false, canSubmitKrs = false, krsMessage = '', sksLimit = null }) {
    // Calculate total SKS
    const totalSKS = mataKuliah.reduce((sum, mk) => sum + parseInt(mk.sks || 0, 10), 0);
    const maksimalSks = Number(sksLimit?.maksimal_sks || 24);
    const sisaSks = Math.max(0, maksimalSks - totalSKS);
    const ipsText = sksLimit?.ips !== null && sksLimit?.ips !== undefined ? Number(sksLimit.ips).toFixed(2) : '-';
    const statusStyles = {
        draft: 'border-slate-200 bg-slate-50 text-slate-700',
        approved: 'border-green-200 bg-green-50 text-green-700',
        pending: 'border-blue-200 bg-blue-50 text-blue-700',
        rejected: 'border-red-200 bg-red-50 text-red-700',
    };
    const statusLabels = {
        draft: 'Draft',
        approved: 'Disetujui',
        pending: 'Menunggu Persetujuan',
        rejected: 'Ditolak/Dibatalkan',
    };


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
                router.delete(route('mahasiswa.krs.destroy-item', id), {
                    preserveScroll: true,
                });
            }
        });
    };

    const handleAjukan = () => {
        Swal.fire({
            title: 'Ajukan dan kunci KRS?',
            text: 'Setelah diajukan, KRS tidak bisa Anda ubah sendiri sampai dosen wali membuka kuncinya.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, ajukan',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('mahasiswa.krs.submit'), {}, {
                    preserveScroll: true,
                });
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
                            <span className="text-sm text-blue-600 ml-1">{semesterAktif}</span>
                        </div>

                        {krsStatus && (
                            <div className={`rounded-lg border px-4 py-2 text-sm font-semibold capitalize ${statusStyles[krsStatus.status] || 'border-gray-200 bg-gray-50 text-gray-700'}`}>
                                Status: {statusLabels[krsStatus.status] || krsStatus.status}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap justify-end gap-2">
                        {canFillKrs && (
                            <Link href={route('mahasiswa.krs.create')}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm border border-blue-600 transition-colors duration-200">
                                <i className="fas fa-plus mr-2"></i>
                                Tambah Mata Kuliah
                            </Link>
                        )}
                        {canSubmitKrs && (
                            <button type="button"
                                onClick={handleAjukan}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm border border-emerald-600 transition-colors duration-200">
                                <i className="fa-solid fa-lock mr-2"></i>
                                Ajukan/Kunci KRS
                            </button>
                        )}
                    </div>
                </div>

                {krsMessage && (
                    <div className={`mb-4 rounded-lg border px-4 py-3 text-sm ${canFillKrs ? 'border-green-200 bg-green-50 text-green-700' : 'border-yellow-200 bg-yellow-50 text-yellow-700'}`}>
                        {krsMessage}
                    </div>
                )}

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
                                {mataKuliah.length > 0 ? (
                                    mataKuliah.map((mk, index) => (
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
                                                {canFillKrs ? (
                                                    <button type="button"
                                                        onClick={() => handleHapus(mk.id_detail_krs || mk.kode)}
                                                        className="hapus-btn inline-flex items-center px-3 py-1.5 border gap-2 border-red-300 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-semibold transition duration-200">
                                                        <i className="fa-regular fa-trash-can"></i>
                                                        <span>Hapus</span>
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-gray-400">Terkunci</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                            Belum ada mata kuliah KRS yang diambil pada semester ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,24rem)_minmax(0,26rem)] lg:items-start">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 max-w-sm">
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
                                    {mataKuliah.map((mk, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {mk.nama}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                <div className="font-medium">{mk.sks}</div>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="hover:bg-gray-50 transition duration-150 bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                            Total SKS
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                            {totalSKS}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-700">Catatan Jatah KRS</h3>
                            <p className="text-sm text-gray-600 mt-1">Batas maksimal SKS mengikuti IPS semester sebelumnya.</p>
                        </div>

                        <div className="px-6 py-5">
                            <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                                Jatah maksimal KRS Anda adalah <span className="font-bold">{maksimalSks} SKS</span>
                                {ipsText !== '-' ? (
                                    <> berdasarkan IPS semester sebelumnya <span className="font-bold">{ipsText}</span>.</>
                                ) : (
                                    <>. IPS semester sebelumnya belum tersedia, sehingga memakai jatah default.</>
                                )}
                            </div>

                            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                <div className="rounded-lg border border-gray-200 px-3 py-3">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Terambil</p>
                                    <p className="mt-1 text-lg font-bold text-gray-800">{totalSKS} SKS</p>
                                </div>
                                <div className="rounded-lg border border-gray-200 px-3 py-3">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Sisa</p>
                                    <p className="mt-1 text-lg font-bold text-gray-800">{sisaSks} SKS</p>
                                </div>
                                <div className="rounded-lg border border-gray-200 px-3 py-3">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Maksimal</p>
                                    <p className="mt-1 text-lg font-bold text-gray-800">{maksimalSks} SKS</p>
                                </div>
                            </div>

                            <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Rentang IPS</th>
                                            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">Maks. SKS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white text-sm">
                                        <tr>
                                            <td className="px-4 py-3 text-gray-700">&gt;= 3.25</td>
                                            <td className="px-4 py-3 text-center font-semibold text-gray-900">24</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 text-gray-700">&gt;= 3.00 dan &lt; 3.25</td>
                                            <td className="px-4 py-3 text-center font-semibold text-gray-900">22</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 text-gray-700">&gt;= 2.50 dan &lt; 3.00</td>
                                            <td className="px-4 py-3 text-center font-semibold text-gray-900">20</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 text-gray-700">&lt; 2.50</td>
                                            <td className="px-4 py-3 text-center font-semibold text-gray-900">18</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </MahasiswaLayout>
    );
}
