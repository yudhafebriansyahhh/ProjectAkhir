import { Head, Link } from '@inertiajs/react';
import DosenLayout from '@/Layouts/DosenLayout';

export default function Nilai({ kelasList }) {
    const hasKelas = kelasList && kelasList.length > 0;

    return (
        <DosenLayout title="Nilai">
            <Head title="Nilai Mahasiswa">
                <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            </Head>

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Nilai Mahasiswa</h1>
                    <p className="text-gray-600">Pilih kelas yang Anda ampu untuk melakukan penilaian.</p>
                </div>

                {hasKelas ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {kelasList.map((kelas) => (
                            <div key={kelas.id_kelas} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded mb-2">
                                                {kelas.mata_kuliah.kode_matkul}
                                            </span>
                                            <h3 className="font-bold text-gray-800 text-lg leading-tight">
                                                {kelas.mata_kuliah.nama_matkul}
                                            </h3>
                                        </div>
                                        <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded">
                                            {kelas.mata_kuliah.sks} SKS
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-700 mt-2">
                                        Kelas: <span className="font-bold text-blue-600">{kelas.nama_kelas}</span>
                                    </p>
                                </div>
                                <div className="p-5">
                                    <div className="space-y-3 mb-5">
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <div className="w-6 flex justify-center text-gray-400">
                                                <i className="far fa-calendar-alt"></i>
                                            </div>
                                            <span>{kelas.periode.tahun_ajaran} ({kelas.periode.jenis_semester})</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <div className="w-6 flex justify-center text-gray-400">
                                                <i className="far fa-clock"></i>
                                            </div>
                                            <span>{kelas.hari}, {kelas.jam_mulai} - {kelas.jam_selesai}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <div className="w-6 flex justify-center text-gray-400">
                                                <i className="fas fa-map-marker-alt"></i>
                                            </div>
                                            <span>Ruang {kelas.ruang_kelas}</span>
                                        </div>
                                    </div>

                                    <Link
                                        href={route('dosen.nilai.show', kelas.id_kelas)}
                                        className="w-full inline-flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
                                    >
                                        <i className="fas fa-users"></i>
                                        <span>Lihat Mahasiswa & Nilai</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center text-gray-700 mt-6 shadow-sm">
                        <i className="fas fa-chalkboard text-4xl text-yellow-500 mb-4 opacity-75"></i>
                        <h3 className="text-lg font-bold mb-2">Belum Mengampu Kelas</h3>
                        <p>Anda belum memiliki jadwal mengajar pada semester ini.</p>
                    </div>
                )}
            </div>
        </DosenLayout>
    );
}