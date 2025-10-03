// resources/js/Pages/Baak/Kelas/Show.jsx

import { Head, Link, router } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Show({ kelas, mahasiswa }) {
    const handleDelete = () => {
        if (window.Swal) {
            window.Swal.fire({
                title: 'Hapus Kelas?',
                html: `Apakah Anda yakin ingin menghapus kelas <strong>${kelas.mata_kuliah?.nama_matkul} - ${kelas.nama_kelas}</strong>?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc2626',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.delete(route('baak.kelas.destroy', kelas.id_kelas));
                }
            });
        }
    };

    const getProgressPercentage = () => {
        if (kelas.kapasitas === 0) return 0;
        return Math.round((mahasiswa.length / kelas.kapasitas) * 100);
    };

    const getProgressColor = () => {
        const percentage = getProgressPercentage();
        if (percentage >= 90) return 'bg-red-600';
        if (percentage >= 75) return 'bg-yellow-600';
        return 'bg-green-600';
    };

    return (
        <BaakLayout title="Detail Kelas">
            <Head title="Detail Kelas" />

            <div className="p-4 md:p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={route('baak.kelas.index')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center mb-4"
                    >
                        <i className="fas fa-arrow-left mr-2"></i>
                        Kembali ke Daftar
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {kelas.mata_kuliah?.nama_matkul} - Kelas {kelas.nama_kelas}
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                {kelas.mata_kuliah?.kode_matkul} • {kelas.mata_kuliah?.prodi?.nama_prodi || 'Umum'}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Link
                                href={route('baak.kelas.edit', kelas.id_kelas)}
                                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                            >
                                <i className="fas fa-edit"></i>
                                <span>Edit</span>
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                            >
                                <i className="fas fa-trash"></i>
                                <span>Hapus</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Periode */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-calendar-alt text-blue-600"></i>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Periode</p>
                                <p className="font-semibold text-gray-900">
                                    {kelas.mata_kuliah_periode?.tahun_ajaran}
                                </p>
                                <p className="text-xs text-gray-600 capitalize">
                                    Semester {kelas.mata_kuliah_periode?.jenis_semester}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Semester Ditawarkan */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-layer-group text-purple-600"></i>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Ditawarkan di</p>
                                <p className="font-semibold text-gray-900">
                                    Semester {kelas.mata_kuliah_periode?.semester_ditawarkan}
                                </p>
                                <p className="text-xs text-gray-600">
                                    {kelas.mata_kuliah?.sks} SKS
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Kapasitas */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-users text-green-600"></i>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500">Kapasitas</p>
                                <p className="font-semibold text-gray-900">
                                    {mahasiswa.length} / {kelas.kapasitas} Mahasiswa
                                </p>
                                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${getProgressColor()}`}
                                        style={{ width: `${getProgressPercentage()}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detail Kelas */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Informasi Kelas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Dosen Pengampu</p>
                            <p className="font-medium text-gray-900">
                                {kelas.dosen?.nama}
                            </p>
                            <p className="text-xs text-gray-600">
                                {kelas.dosen?.nip} • {kelas.dosen?.prodi?.nama_prodi}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Jadwal</p>
                            <p className="font-medium text-gray-900">
                                {kelas.hari}, {kelas.jam_mulai?.substring(0, 5)} - {kelas.jam_selesai?.substring(0, 5)}
                            </p>
                            <p className="text-xs text-gray-600">
                                Ruang: {kelas.ruang_kelas}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Kategori Mata Kuliah</p>
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded capitalize ${
                                kelas.mata_kuliah?.kategori === 'wajib' ? 'bg-red-100 text-red-700' :
                                kelas.mata_kuliah?.kategori === 'pilihan' ? 'bg-blue-100 text-blue-700' :
                                'bg-green-100 text-green-700'
                            }`}>
                                {kelas.mata_kuliah?.kategori}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Status Kelas</p>
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                                mahasiswa.length >= kelas.kapasitas
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-green-100 text-green-700'
                            }`}>
                                {mahasiswa.length >= kelas.kapasitas ? 'Penuh' : 'Tersedia'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Daftar Mahasiswa */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold">
                            Daftar Mahasiswa ({mahasiswa.length})
                        </h2>
                    </div>

                    {mahasiswa.length > 0 ? (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr className="text-gray-600 text-xs uppercase">
                                            <th className="px-6 py-3 text-left">No</th>
                                            <th className="px-6 py-3 text-left">NIM</th>
                                            <th className="px-6 py-3 text-left">Nama</th>
                                            <th className="px-6 py-3 text-left">Prodi</th>
                                            <th className="px-6 py-3 text-center">Semester</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {mahasiswa.map((mhs, index) => (
                                            <tr key={mhs.id_mahasiswa} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    {mhs.nim}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {mhs.nama}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {mhs.prodi?.nama_prodi}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                                                    {mhs.semester_aktif || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="block md:hidden divide-y divide-gray-200">
                                {mahasiswa.map((mhs, index) => (
                                    <div key={mhs.id_mahasiswa} className="p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-sm font-semibold text-blue-700">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900">{mhs.nama}</p>
                                                <p className="text-sm text-gray-600">{mhs.nim}</p>
                                                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                                        {mhs.prodi?.nama_prodi}
                                                    </span>
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                                        Sem {mhs.semester_aktif || '-'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <i className="fas fa-users text-4xl mb-3 text-gray-400"></i>
                            <p>Belum ada mahasiswa yang mengambil kelas ini</p>
                        </div>
                    )}
                </div>
            </div>
        </BaakLayout>
    );
}   
