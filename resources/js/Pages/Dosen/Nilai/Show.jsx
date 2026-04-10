import { Head, Link } from '@inertiajs/react';
import DosenLayout from '@/Layouts/DosenLayout';

export default function Show({ kelasData, mahasiswaList }) {
    const showData = mahasiswaList && mahasiswaList.length > 0;

    return (
        <DosenLayout title="Detail Nilai Kelas">
            <Head title={`Nilai Kelas ${kelasData.nama_kelas}`}>
                <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            </Head>

            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="mb-6">
                    <Link
                        href={route('dosen.nilai')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 inline-flex items-center gap-2"
                    >
                        <i className="fas fa-arrow-left"></i>
                        <span>Kembali ke Daftar Kelas</span>
                    </Link>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                                    {kelasData.mata_kuliah.nama_matkul}
                                </h1>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-lg">
                                        {kelasData.mata_kuliah.kode_matkul}
                                    </span>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-lg">
                                        Kelas {kelasData.nama_kelas}
                                    </span>
                                </div>
                            </div>
                            <div className="md:text-right flex flex-col justify-center">
                                <p className="text-gray-600 font-medium">
                                    SKS: <span className="text-gray-800">{kelasData.mata_kuliah.sks} SKS</span>
                                </p>
                                <p className="text-gray-600 font-medium mt-1">
                                    Periode: <span className="text-gray-800">{kelasData.periode.tahun_ajaran} ({kelasData.periode.jenis_semester})</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grades Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Daftar Mahasiswa</h3>
                            <p className="text-sm text-gray-600 mt-1">Input nilai untuk mahasiswa di kelas ini</p>
                        </div>
                        <div className="text-sm font-medium text-gray-600">
                            Total: <span className="text-blue-600 font-bold">{mahasiswaList.length}</span> Mahasiswa
                        </div>
                    </div>

                    {showData ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                                    <tr>
                                        <th className="px-6 py-4 text-left">No</th>
                                        <th className="px-6 py-4 text-left">Nama Mahasiswa</th>
                                        <th className="px-6 py-4 text-center">NIM</th>
                                        <th className="px-6 py-4 text-center">Nilai Akhir</th>
                                        <th className="px-6 py-4 text-center">Nilai Huruf</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {mahasiswaList.map((mhs, index) => (
                                        <tr key={mhs.id_mahasiswa} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-gray-700 font-medium">{index + 1}</td>
                                            <td className="px-6 py-4 text-gray-800 font-semibold">{mhs.nama}</td>
                                            <td className="px-6 py-4 text-center text-gray-600">{mhs.nim}</td>
                                            <td className="px-6 py-4 text-center">
                                                {mhs.nilai_akhir ? (
                                                    <span className="font-bold text-gray-800">{parseFloat(mhs.nilai_akhir).toFixed(2)}</span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {mhs.nilai_huruf ? (
                                                    <span className="px-3 py-1.5 rounded-lg text-sm font-bold bg-blue-100 text-blue-700">
                                                        {mhs.nilai_huruf}
                                                    </span>
                                                ) : <span className="text-gray-400">-</span>}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {mhs.has_nilai ? (
                                                    mhs.is_locked ? (
                                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                                                            <i className="fas fa-lock text-gray-400"></i> Terkunci
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-md border border-blue-200">
                                                            <i className="fas fa-check-circle"></i> Dinilai
                                                        </span>
                                                    )
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-500 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                                                        <i className="fas fa-clock"></i> Menunggu
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="inline-flex gap-2">
                                                    {!mhs.has_nilai ? (
                                                        <Link
                                                            href={route('dosen.input_nilai', {
                                                                id_mahasiswa: mhs.id_mahasiswa,
                                                                id_kelas: mhs.id_kelas
                                                            })}
                                                            className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex items-center gap-1.5"
                                                        >
                                                            <i className="fas fa-file-signature"></i> Input Nilai
                                                        </Link>
                                                    ) : (
                                                        <>
                                                            {!mhs.is_locked && (
                                                                <Link
                                                                    href={route('dosen.edit_nilai', mhs.id_nilai)}
                                                                    className="px-4 py-2 text-xs font-bold bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-sm transition-all focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 flex items-center gap-1.5"
                                                                >
                                                                    <i className="fas fa-pen-to-square"></i> Edit
                                                                </Link>
                                                            )}
                                                            {mhs.is_locked && (
                                                                <button
                                                                    disabled
                                                                    className="px-4 py-2 text-xs font-bold bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed flex items-center gap-1.5"
                                                                >
                                                                    <i className="fas fa-ban"></i> Edit
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-12 bg-white text-center">
                            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-blue-50 text-blue-500 mb-4">
                                <i className="fas fa-users-slash text-2xl"></i>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">Belum Ada Mahasiswa</h3>
                            <p className="text-gray-500 text-sm">Tidak ada mahasiswa yang mengambil kelas ini.</p>
                        </div>
                    )}
                </div>
            </div>
        </DosenLayout>
    );
}
