import { Head, Link, router } from '@inertiajs/react';
import DosenLayout from '@/Layouts/DosenLayout';

export default function Rps({ rps }) {

    const handleDelete = (id, nama) => {
        if (window.Swal) {
            window.Swal.fire({
                title: 'Yakin ingin hapus?',
                text: "Data ini akan hilang permanen.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, hapus',
                cancelButtonText: 'Batal',
                confirmButtonColor: '#dc2626',
            }).then((result) => {
                if (result.isConfirmed) {
                    router.delete(route('dosen.rps.destroy', id), {
                        onSuccess: () => {
                            window.Swal.fire({
                                title: 'Terhapus!',
                                text: `RPS ${nama} berhasil dihapus.`,
                                icon: 'success',
                                confirmButtonColor: '#2563eb',
                            });
                        },
                    });
                }
            });
        }
    };

    return (
        <DosenLayout title="RPS">
            <Head title="RPS">
                <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            </Head>

            <div className="container mx-auto px-4 py-8 max-w-[600px] sm:max-w-full">

                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Rencana Pembelajaran Semester (RPS)</h1>
                    <p className="text-gray-600">
                        Kelola dokumen RPS untuk mata kuliah yang Anda ampu.
                    </p>
                </div>

                {/* Action Bar */}
                <div className="mb-4 flex justify-between items-center">
                    <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                        <span className="text-sm font-medium text-blue-800">Semester Aktif:</span>
                        <span className="text-sm text-blue-600 ml-1">Ganjil 2024/2025</span>
                    </div>

                    <Link
                        href={route('dosen.rps.create')}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                    >
                        <i className="fas fa-plus mr-2"></i>
                        Tambah RPS
                    </Link>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700">Daftar RPS</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr className="text-gray-600 font-semibold text-xs">
                                    <th className="px-6 py-4 text-left">No</th>
                                    <th className="px-6 py-4 text-left">Kode MK</th>
                                    <th className="px-6 py-4 text-left">Judul</th>
                                    <th className="px-6 py-4 text-left">File</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {rps.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <i className="fas fa-inbox text-gray-300 text-3xl mb-2"></i>
                                                <p className="text-gray-500 text-sm">Belum ada RPS</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    rps.map((item, index) => (
                                        <tr key={item.id_rps} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm">{index + 1}</td>
                                            <td className="px-6 py-4 text-sm">{item.kode_matkul}</td>
                                            <td className="px-6 py-4 text-sm">{item.judul}</td>

                                            <td className="px-6 py-4">
                                                {item.file_path ? (
                                                    <a
                                                        href={`/storage/${item.file_path}`}
                                                        target="_blank"
                                                        className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200 transition-colors"
                                                    >
                                                        Lihat Dokumen
                                                    </a>
                                                ) : (
                                                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                                                        Tidak ada
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-center text-sm">
                                                <Link
                                                    href={route('dosen.rps.edit', item.id_rps)}
                                                    className="inline-flex items-center px-3 py-1.5 border gap-2 border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg text-xs font-semibold mr-2 transition-colors"
                                                >
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                    Edit
                                                </Link>

                                                <button
                                                    onClick={() => handleDelete(item.id_rps, item.judul)}
                                                    className="inline-flex items-center px-3 py-1.5 border gap-2 border-red-300 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors"
                                                >
                                                    <i className="fa-regular fa-trash-can"></i>
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DosenLayout>
    );
}