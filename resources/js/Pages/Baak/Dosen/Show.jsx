import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Show({ dosen }) {
    const [activeTab, setActiveTab] = useState('biodata');

    const handleResetPassword = () => {
        if (window.Swal) {
            window.Swal.fire({
                title: 'Reset Password?',
                text: `Password akan direset ke NIP: ${dosen.nip}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, Reset!',
                cancelButtonText: 'Batal',
                confirmButtonColor: '#3b82f6',
            }).then((result) => {
                if (result.isConfirmed) {
                    router.post(route('baak.dosen.reset-password', dosen.id_dosen), {}, {
                        preserveScroll: true,
                        onSuccess: () => {
                            window.Swal.fire('Berhasil!', 'Password berhasil direset ke NIP', 'success');
                        }
                    });
                }
            });
        } else {
            if (confirm(`Reset password ke NIP: ${dosen.nip}?`)) {
                router.post(route('baak.dosen.reset-password', dosen.id_dosen), {}, {
                    preserveScroll: true,
                });
            }
        }
    };

    return (
        <BaakLayout title="Detail Dosen">
            <Head title={`Detail - ${dosen.nama}`} />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={route('baak.dosen.index')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-3 inline-flex items-center gap-1"
                    >
                        <i className="fas fa-arrow-left"></i>
                        <span>Kembali ke Daftar Dosen</span>
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mt-3">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-700">Detail Dosen</h1>
                            <p className="text-sm text-gray-600 mt-1">Informasi lengkap dosen</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Link
                                href={route('baak.dosen.edit', dosen.id_dosen)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                                <i className="fas fa-edit"></i>
                                <span>Edit Data</span>
                            </Link>
                            <button
                                onClick={handleResetPassword}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                                <i className="fas fa-key"></i>
                                <span>Reset Password</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Photo */}
                        <div className="flex-shrink-0 mx-auto md:mx-0">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-white shadow-md">
                                {dosen.foto ? (
                                    <img
                                        src={`/storage/${dosen.foto}`}
                                        alt={dosen.nama}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-blue-400">
                                        <i className="fas fa-user text-4xl md:text-5xl"></i>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                <div className="text-center md:text-left">
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">{dosen.nama}</h2>
                                    <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                                        <i className="fas fa-id-card text-gray-400 text-sm"></i>
                                        <p className="text-gray-600 text-sm md:text-base">NIP: {dosen.nip}</p>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                                        <i className="fas fa-envelope text-gray-400 text-sm"></i>
                                        <p className="text-gray-600 text-sm break-all">{dosen.user?.email || '-'}</p>
                                    </div>
                                    {dosen.no_hp && (
                                        <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                                            <i className="fas fa-phone text-gray-400 text-sm"></i>
                                            <p className="text-gray-600 text-sm">{dosen.no_hp}</p>
                                        </div>
                                    )}
                                </div>
                                {dosen.jenis_kelamin === 'Laki-laki' ? (
                                    <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 whitespace-nowrap mx-auto sm:mx-0">
                                        <i className="fas fa-mars mr-1"></i>
                                        Laki-laki
                                    </span>
                                ) : (
                                    <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-pink-100 text-pink-800 whitespace-nowrap mx-auto sm:mx-0">
                                        <i className="fas fa-venus mr-1"></i>
                                        Perempuan
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-6">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 md:p-4 border border-blue-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <i className="fas fa-graduation-cap text-blue-600 text-sm"></i>
                                        <p className="text-xs md:text-sm text-gray-600 font-medium">Program Studi</p>
                                    </div>
                                    <p className="font-semibold text-gray-800 text-sm md:text-base">{dosen.prodi?.nama_prodi || '-'}</p>
                                    <p className="text-xs text-gray-600 mt-1">{dosen.prodi?.fakultas?.nama_fakultas || ''}</p>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 md:p-4 border border-purple-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <i className="fas fa-chalkboard text-purple-600 text-sm"></i>
                                        <p className="text-xs md:text-sm text-gray-600 font-medium">Jumlah Kelas</p>
                                    </div>
                                    <p className="font-bold text-gray-800 text-lg md:text-xl">{dosen.kelas_count || 0} Kelas</p>
                                    <p className="text-xs text-gray-600 mt-1">Mengampu semester ini</p>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 md:p-4 border border-green-200 sm:col-span-2 lg:col-span-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <i className="fas fa-users text-green-600 text-sm"></i>
                                        <p className="text-xs md:text-sm text-gray-600 font-medium">Mahasiswa Bimbingan</p>
                                    </div>
                                    <p className="font-bold text-gray-800 text-lg md:text-xl">{dosen.mahasiswa_bimbingan_count || 0} Mahasiswa</p>
                                    <p className="text-xs text-gray-600 mt-1">Sebagai dosen wali</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Tab Headers */}
                    <div className="border-b border-gray-200 bg-gray-50">
                        <div className="flex overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('biodata')}
                                className={`flex-1 sm:flex-none px-4 md:px-6 py-3 text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
                                    activeTab === 'biodata'
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                }`}
                            >
                                <i className="fas fa-user mr-1 md:mr-2"></i>
                                <span>Biodata</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('kelas')}
                                className={`flex-1 sm:flex-none px-4 md:px-6 py-3 text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
                                    activeTab === 'kelas'
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                }`}
                            >
                                <i className="fas fa-chalkboard mr-1 md:mr-2"></i>
                                <span>Kelas Diampu</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('mahasiswa')}
                                className={`flex-1 sm:flex-none px-4 md:px-6 py-3 text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
                                    activeTab === 'mahasiswa'
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                }`}
                            >
                                <i className="fas fa-user-graduate mr-1 md:mr-2"></i>
                                <span>Mahasiswa Bimbingan</span>
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-4 md:p-6">
                        {/* Biodata Tab */}
                        {activeTab === 'biodata' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">NIP</label>
                                    <p className="text-gray-800 text-sm md:text-lg mt-1">{dosen.nip || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Nama Lengkap</label>
                                    <p className="text-gray-800 text-sm md:text-lg mt-1">{dosen.nama || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Email</label>
                                    <p className="text-gray-800 text-sm break-all mt-1">{dosen.user?.email || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Nomor HP</label>
                                    <p className="text-gray-800 text-sm mt-1">{dosen.no_hp || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Jenis Kelamin</label>
                                    <p className="text-gray-800 text-sm mt-1">{dosen.jenis_kelamin || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Program Studi</label>
                                    <p className="text-gray-800 text-sm mt-1">{dosen.prodi?.nama_prodi || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Fakultas</label>
                                    <p className="text-gray-800 text-sm mt-1">{dosen.prodi?.fakultas?.nama_fakultas || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Jenjang</label>
                                    <p className="text-gray-800 text-sm mt-1">{dosen.prodi?.jenjang || '-'}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Alamat</label>
                                    <p className="text-gray-800 text-sm mt-1">{dosen.alamat || '-'}</p>
                                </div>
                            </div>
                        )}

                        {/* Kelas Tab */}
                        {activeTab === 'kelas' && (
                            <div>
                                {dosen.kelas && dosen.kelas.length > 0 ? (
                                    <>
                                        {/* Desktop Table */}
                                        <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
                                            <table className="w-full">
                                                <thead className="bg-gray-50">
                                                    <tr className="text-gray-600 font-semibold text-xs">
                                                        <th className="px-6 py-4 text-left uppercase tracking-wider">No</th>
                                                        <th className="px-6 py-3 text-left uppercase tracking-wider">Kode MK</th>
                                                        <th className="px-6 py-3 text-left uppercase tracking-wider">Mata Kuliah</th>
                                                        <th className="px-6 py-3 text-center uppercase tracking-wider">Kelas</th>
                                                        <th className="px-6 py-3 text-center uppercase tracking-wider">SKS</th>
                                                        <th className="px-6 py-3 text-center uppercase tracking-wider">Hari</th>
                                                        <th className="px-6 py-3 text-center uppercase tracking-wider">Jam</th>
                                                        <th className="px-6 py-3 text-center uppercase tracking-wider">Ruang</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {dosen.kelas.map((kelas, index) => (
                                                        <tr key={kelas.id_kelas} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                                {index + 1}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-lg">
                                                                    {kelas.mata_kuliah?.kode_matkul || '-'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                                                {kelas.mata_kuliah?.nama_matkul || '-'}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                                {kelas.nama_kelas}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center font-medium">
                                                                {kelas.mata_kuliah?.sks || 0}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                                {kelas.hari}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                                {kelas.jam_mulai?.substring(0, 5)} - {kelas.jam_selesai?.substring(0, 5)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                                {kelas.ruang_kelas}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Mobile Cards */}
                                        <div className="md:hidden space-y-4">
                                            {dosen.kelas.map((kelas, index) => (
                                                <div key={kelas.id_kelas} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-xs font-semibold text-gray-500">#{index + 1}</span>
                                                                <span className="px-2 py-0.5 text-xs font-semibold text-blue-800 bg-blue-100 rounded">
                                                                    {kelas.mata_kuliah?.kode_matkul}
                                                                </span>
                                                            </div>
                                                            <h4 className="font-semibold text-gray-800 text-sm mb-1">
                                                                {kelas.mata_kuliah?.nama_matkul}
                                                            </h4>
                                                            <p className="text-xs text-gray-600">Kelas {kelas.nama_kelas}</p>
                                                        </div>
                                                        <span className="px-2 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-800">
                                                            {kelas.mata_kuliah?.sks || 0} SKS
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-1">Hari</p>
                                                            <p className="text-sm font-semibold text-gray-800">{kelas.hari}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-1">Jam</p>
                                                            <p className="text-sm font-semibold text-gray-800">
                                                                {kelas.jam_mulai?.substring(0, 5)} - {kelas.jam_selesai?.substring(0, 5)}
                                                            </p>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <p className="text-xs text-gray-500 mb-1">Ruang</p>
                                                            <p className="text-sm font-semibold text-gray-800">{kelas.ruang_kelas}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                        <i className="fas fa-chalkboard text-4xl md:text-5xl mb-4 text-gray-400"></i>
                                        <p className="text-base md:text-lg font-medium">Belum ada kelas yang diampu</p>
                                        <p className="text-xs md:text-sm mt-1">Dosen belum mengampu kelas semester ini</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Mahasiswa Bimbingan Tab */}
                        {activeTab === 'mahasiswa' && (
                            <div>
                                {dosen.mahasiswa_bimbingan && dosen.mahasiswa_bimbingan.length > 0 ? (
                                    <>
                                        {/* Desktop Table */}
                                        <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
                                            <table className="w-full">
                                                <thead className="bg-gray-50">
                                                    <tr className="text-gray-600 font-semibold text-xs">
                                                        <th className="px-6 py-4 text-left uppercase tracking-wider">No</th>
                                                        <th className="px-6 py-3 text-left uppercase tracking-wider">NIM</th>
                                                        <th className="px-6 py-3 text-left uppercase tracking-wider">Nama Mahasiswa</th>
                                                        <th className="px-6 py-3 text-center uppercase tracking-wider">Angkatan</th>
                                                        <th className="px-6 py-3 text-center uppercase tracking-wider">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {dosen.mahasiswa_bimbingan.map((mhs, index) => (
                                                        <tr key={mhs.id_mahasiswa} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                                {index + 1}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-lg">
                                                                    {mhs.nim}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                                                {mhs.nama}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                                20{mhs.nim?.substring(0, 2)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                                    mhs.status === 'aktif' ? 'bg-green-100 text-green-700' :
                                                                    mhs.status === 'lulus' ? 'bg-blue-100 text-blue-700' :
                                                                    mhs.status === 'keluar' ? 'bg-yellow-100 text-yellow-700' :
                                                                    'bg-red-100 text-red-700'
                                                                }`}>
                                                                    {mhs.status?.toUpperCase()}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Mobile Cards */}
                                        <div className="md:hidden space-y-4">
                                            {dosen.mahasiswa_bimbingan.map((mhs, index) => (
                                                <div key={mhs.id_mahasiswa} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-xs font-semibold text-gray-500">#{index + 1}</span>
                                                                <span className="px-2 py-0.5 text-xs font-semibold text-blue-800 bg-blue-100 rounded">
                                                                    {mhs.nim}
                                                                </span>
                                                            </div>
                                                            <h4 className="font-semibold text-gray-800 text-sm">
                                                                {mhs.nama}
                                                            </h4>
                                                        </div>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                                            mhs.status === 'aktif' ? 'bg-green-100 text-green-700' :
                                                            mhs.status === 'lulus' ? 'bg-blue-100 text-blue-700' :
                                                            mhs.status === 'keluar' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                        }`}>
                                                            {mhs.status?.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-600 mt-2">
                                                        <span className="font-medium">Angkatan:</span> 20{mhs.nim?.substring(0, 2)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                        <i className="fas fa-user-graduate text-4xl md:text-5xl mb-4 text-gray-400"></i>
                                        <p className="text-base md:text-lg font-medium">Belum ada mahasiswa bimbingan</p>
                                        <p className="text-xs md:text-sm mt-1">Dosen belum menjadi dosen wali mahasiswa</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </BaakLayout>
    );
}
