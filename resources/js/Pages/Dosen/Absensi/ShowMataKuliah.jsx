import { Head, Link } from '@inertiajs/react';
import DosenLayout from '@/Layouts/DosenLayout';

export default function ShowMataKuliah({ mataKuliah, kelasList }) {
    // Safely access nested properties
    const mkData = mataKuliah?.mataKuliah || {};
    const namaMatkul = mkData.nama_matkul || 'Mata Kuliah';
    const kodeMatkul = mkData.kode_matkul || '-';
    const sks = mkData.sks || 0;
    const tahunAjaran = mataKuliah?.tahun_ajaran || '-';
    const jenisSemester = mataKuliah?.jenis_semester || '-';

    return (
        <DosenLayout>
            <Head title={`${namaMatkul} - Daftar Kelas`}>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
            </Head>

            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <nav className="flex items-center text-sm text-gray-600 mb-4">
                        <Link
                            href={route('dosen.absensi.index')}
                            className="hover:text-blue-600 transition-colors"
                        >
                            <i className="fas fa-home mr-1"></i>
                            Absensi
                        </Link>
                        <i className="fas fa-chevron-right mx-2 text-xs"></i>
                        <span className="text-gray-800 font-medium">
                            {namaMatkul}
                        </span>
                    </nav>
                </div>

                {/* Header Info Mata Kuliah */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 mb-6 text-white">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">{namaMatkul}</h1>
                            <div className="flex items-center gap-4 text-blue-100">
                                <span className="flex items-center">
                                    <i className="fas fa-code mr-2"></i>
                                    {kodeMatkul}
                                </span>
                                <span className="flex items-center">
                                    <i className="fas fa-book mr-2"></i>
                                    {sks} SKS
                                </span>
                                <span className="flex items-center">
                                    <i className="fas fa-calendar mr-2"></i>
                                    {tahunAjaran} - {jenisSemester}
                                </span>
                            </div>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                            <div className="text-3xl font-bold">{kelasList?.length || 0}</div>
                            <div className="text-sm text-blue-100">Kelas</div>
                        </div>
                    </div>
                </div>

                {/* List Kelas */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    <div className="px-6 py-4 border-b bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-700">
                            Daftar Kelas
                        </h2>
                    </div>

                    {kelasList && kelasList.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">#</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Nama Kelas</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Jadwal</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Ruangan</th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600">Mahasiswa</th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600">Pertemuan</th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {kelasList.map((kelas, index) => (
                                        <tr key={kelas.id_kelas} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-semibold text-gray-800">
                                                    Kelas {kelas.nama_kelas}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-700">
                                                    <div className="font-medium">{kelas.hari}</div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {kelas.jam_mulai} - {kelas.jam_selesai}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-semibold">
                                                    <i className="fas fa-door-open mr-1"></i>
                                                    {kelas.ruang_kelas}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                                                    <i className="fas fa-users mr-1"></i>
                                                    {kelas.jumlah_mahasiswa}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                                    {kelas.total_pertemuan}x
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Link
                                                    href={route('dosen.absensi.kelas.show', kelas.id_kelas)}
                                                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                                                >
                                                    <i className="fas fa-eye mr-2"></i>
                                                    Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <i className="fas fa-chalkboard-teacher text-gray-400 text-5xl mb-4"></i>
                            <p className="text-gray-500 text-lg">Tidak ada kelas</p>
                            <p className="text-gray-400 text-sm mt-2">Belum ada kelas untuk mata kuliah ini</p>
                        </div>
                    )}
                </div>
            </div>
        </DosenLayout>
    );
}
