import { Head, Link, router } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';
import { useState } from 'react';

export default function DetailMahasiswa({ mahasiswa, krsData, statistik }) {
    const [activeTab, setActiveTab] = useState('biodata');
    const [selectedSemester, setSelectedSemester] = useState(krsData && krsData.length > 0 ? krsData.length : null);

    const handleResetPassword = () => {
        if (window.Swal) {
            window.Swal.fire({
                title: 'Reset Password?',
                text: `Password akan direset menjadi NIM: ${mahasiswa.nim}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, Reset!',
                cancelButtonText: 'Batal',
                confirmButtonColor: '#3b82f6',
            }).then((result) => {
                if (result.isConfirmed) {
                    router.post(route('baak.mahasiswa.reset-password', mahasiswa.id_mahasiswa), {}, {
                        onSuccess: () => {
                            window.Swal.fire('Berhasil!', 'Password berhasil direset ke NIM', 'success');
                        }
                    });
                }
            });
        }
    };

    const getPredikat = (ipk) => {
        const ipkNum = parseFloat(ipk);
        if (ipkNum >= 3.75) return 'Summa Cum Laude';
        if (ipkNum >= 3.50) return 'Magna Cum Laude';
        if (ipkNum >= 3.25) return 'Cum Laude';
        if (ipkNum >= 3.00) return 'Sangat Memuaskan';
        if (ipkNum >= 2.75) return 'Memuaskan';
        return 'Cukup';
    };

    const getSemesterData = (semesterNumber) => {
        return krsData?.find(semester => semester.semester_ke === semesterNumber);
    };

    return (
        <BaakLayout title="Detail Mahasiswa">
            <Head title={`Detail - ${mahasiswa.nama}`} />

            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={route('baak.mahasiswa.index')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-3 inline-flex items-center gap-1"
                    >
                        <i className="fas fa-arrow-left"></i>
                        <span>Kembali ke Daftar Mahasiswa</span>
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mt-3">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-700">Detail Mahasiswa</h1>
                            <p className="text-sm text-gray-600 mt-1">Informasi lengkap mahasiswa</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Link
                                href={route('baak.mahasiswa.edit', mahasiswa.id_mahasiswa)}
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
                <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Photo */}
                        <div className="flex-shrink-0 mx-auto md:mx-0">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-white shadow-md">
                                {mahasiswa.foto ? (
                                    <img
                                        src={`/storage/${mahasiswa.foto}`}
                                        alt={mahasiswa.nama}
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
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                <div className="text-center md:text-left">
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 break-words">{mahasiswa.nama}</h2>
                                    <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                                        <i className="fas fa-id-card text-gray-400 text-sm"></i>
                                        <p className="text-gray-600 text-sm md:text-base">{mahasiswa.nim}</p>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                                        <i className="fas fa-envelope text-gray-400 text-sm"></i>
                                        <p className="text-gray-600 text-sm break-all">{mahasiswa.user?.email || '-'}</p>
                                    </div>
                                    {mahasiswa.no_hp && (
                                        <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                                            <i className="fas fa-phone text-gray-400 text-sm"></i>
                                            <p className="text-gray-600 text-sm">{mahasiswa.no_hp}</p>
                                        </div>
                                    )}
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap mx-auto sm:mx-0 ${
                                    mahasiswa.status === 'aktif' ? 'bg-green-100 text-green-700' :
                                    mahasiswa.status === 'lulus' ? 'bg-blue-100 text-blue-700' :
                                    mahasiswa.status === 'keluar' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {mahasiswa.status?.toUpperCase()}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-6">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 md:p-4 border border-blue-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <i className="fas fa-graduation-cap text-blue-600 text-sm"></i>
                                        <p className="text-xs md:text-sm text-gray-600 font-medium">Program Studi</p>
                                    </div>
                                    <p className="font-semibold text-gray-800 text-sm md:text-base break-words">{mahasiswa.prodi?.nama_prodi || '-'}</p>
                                    <p className="text-xs text-gray-600 mt-1 break-words">{mahasiswa.prodi?.fakultas?.nama_fakultas || ''}</p>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 md:p-4 border border-purple-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <i className="fas fa-calendar-alt text-purple-600 text-sm"></i>
                                        <p className="text-xs md:text-sm text-gray-600 font-medium">Semester</p>
                                    </div>
                                    <p className="font-semibold text-gray-800 text-lg md:text-xl">Semester {mahasiswa.semester_ke || '-'}</p>
                                    <p className="text-xs text-gray-600 mt-1">Angkatan 20{mahasiswa.nim?.substring(0, 2)}</p>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 md:p-4 border border-green-200 sm:col-span-2 lg:col-span-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <i className="fas fa-chart-line text-green-600 text-sm"></i>
                                        <p className="text-xs md:text-sm text-gray-600 font-medium">IPK</p>
                                    </div>
                                    <p className="font-bold text-gray-800 text-xl md:text-2xl">{statistik?.ipk || '0.00'}</p>
                                    <p className="text-xs text-gray-600 mt-1">{getPredikat(statistik?.ipk || 0)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {/* Tab Headers */}
                    <div className="border-b border-gray-200 bg-gray-50 overflow-x-auto">
                        <div className="flex min-w-max">
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
                                onClick={() => setActiveTab('akademik')}
                                className={`flex-1 sm:flex-none px-4 md:px-6 py-3 text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
                                    activeTab === 'akademik'
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                }`}
                            >
                                <i className="fas fa-book mr-1 md:mr-2"></i>
                                <span>Akademik</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('krs')}
                                className={`flex-1 sm:flex-none px-4 md:px-6 py-3 text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
                                    activeTab === 'krs'
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                }`}
                            >
                                <i className="fas fa-file-alt mr-1 md:mr-2"></i>
                                <span>Riwayat KRS</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('nilai')}
                                className={`flex-1 sm:flex-none px-4 md:px-6 py-3 text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
                                    activeTab === 'nilai'
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                }`}
                            >
                                <i className="fas fa-chart-bar mr-1 md:mr-2"></i>
                                <span>Transkrip</span>
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-4 md:p-6">
                        {/* Biodata Tab */}
                        {activeTab === 'biodata' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">NIM</label>
                                    <p className="text-gray-800 text-sm md:text-base mt-1">{mahasiswa.nim || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Nama Lengkap</label>
                                    <p className="text-gray-800 text-sm md:text-base mt-1 break-words">{mahasiswa.nama || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Email</label>
                                    <p className="text-gray-800 text-sm break-all mt-1">{mahasiswa.user?.email || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Nomor Telepon</label>
                                    <p className="text-gray-800 text-sm mt-1">{mahasiswa.no_hp || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Tanggal Lahir</label>
                                    <p className="text-gray-800 text-sm mt-1">
                                        {mahasiswa.tanggal_lahir
                                            ? new Date(mahasiswa.tanggal_lahir).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })
                                            : '-'
                                        }
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Jenis Kelamin</label>
                                    <p className="text-gray-800 text-sm mt-1">{mahasiswa.jenis_kelamin || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Dosen Wali</label>
                                    <p className="text-gray-800 text-sm mt-1">{mahasiswa.dosen_wali?.nama || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">NIP Dosen Wali</label>
                                    <p className="text-gray-800 text-sm mt-1">{mahasiswa.dosen_wali?.nip || '-'}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs md:text-sm font-semibold text-gray-600">Alamat</label>
                                    <p className="text-gray-800 text-sm mt-1 break-words">{mahasiswa.alamat || '-'}</p>
                                </div>
                            </div>
                        )}

                        {/* Akademik Tab */}
                        {activeTab === 'akademik' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 md:p-4 border border-blue-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-xs md:text-sm text-gray-600 font-medium">Total SKS</p>
                                            <i className="fas fa-book text-blue-600 text-sm"></i>
                                        </div>
                                        <p className="text-2xl md:text-3xl font-bold text-gray-800">{statistik?.total_sks || 0}</p>
                                        <p className="text-xs text-gray-600 mt-1">SKS Diambil</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 md:p-4 border border-green-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-xs md:text-sm text-gray-600 font-medium">SKS Lulus</p>
                                            <i className="fas fa-check-circle text-green-600 text-sm"></i>
                                        </div>
                                        <p className="text-2xl md:text-3xl font-bold text-green-700">{statistik?.sks_lulus || 0}</p>
                                        <p className="text-xs text-gray-600 mt-1">SKS Berhasil</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 md:p-4 border border-purple-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-xs md:text-sm text-gray-600 font-medium">IPK</p>
                                            <i className="fas fa-chart-line text-purple-600 text-sm"></i>
                                        </div>
                                        <p className="text-2xl md:text-3xl font-bold text-purple-700">{statistik?.ipk || '0.00'}</p>
                                        <p className="text-xs text-gray-600 mt-1">Indeks Prestasi</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-3 md:p-4 border border-yellow-200 col-span-2 lg:col-span-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-xs md:text-sm text-gray-600 font-medium">Predikat</p>
                                            <i className="fas fa-trophy text-yellow-600 text-sm"></i>
                                        </div>
                                        <p className="text-base md:text-lg font-bold text-yellow-700">
                                            {getPredikat(statistik?.ipk || 0)}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">Prestasi</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div>
                                        <label className="text-xs md:text-sm font-semibold text-gray-600">Program Studi</label>
                                        <p className="text-gray-800 text-sm mt-1 break-words">{mahasiswa.prodi?.nama_prodi || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs md:text-sm font-semibold text-gray-600">Fakultas</label>
                                        <p className="text-gray-800 text-sm mt-1 break-words">{mahasiswa.prodi?.fakultas?.nama_fakultas || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs md:text-sm font-semibold text-gray-600">Jenjang</label>
                                        <p className="text-gray-800 text-sm mt-1">{mahasiswa.prodi?.jenjang || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs md:text-sm font-semibold text-gray-600">Angkatan</label>
                                        <p className="text-gray-800 text-sm mt-1">20{mahasiswa.nim?.substring(0, 2) || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs md:text-sm font-semibold text-gray-600">Semester Ke</label>
                                        <p className="text-gray-800 text-sm mt-1">Semester {mahasiswa.semester_ke || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs md:text-sm font-semibold text-gray-600">Status Akademik</label>
                                        <p className="text-gray-800 text-sm mt-1">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                mahasiswa.status === 'aktif' ? 'bg-green-100 text-green-700' :
                                                mahasiswa.status === 'lulus' ? 'bg-blue-100 text-blue-700' :
                                                mahasiswa.status === 'keluar' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {mahasiswa.status?.toUpperCase()}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* KRS Tab dengan Tombol Semester */}
                        {activeTab === 'krs' && (
                            <div className="space-y-4">
                                {/* Semester Buttons */}
                                {krsData && krsData.length > 0 && (
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <p className="text-sm font-semibold text-gray-700 mb-3">
                                            <i className="fas fa-calendar mr-2"></i>
                                            Pilih Semester:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {Array.from({ length: mahasiswa.semester_ke || krsData.length }, (_, i) => i + 1).map((sem) => {
                                                const semesterData = getSemesterData(sem);
                                                return (
                                                    <button
                                                        key={sem}
                                                        onClick={() => setSelectedSemester(sem)}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                            selectedSemester === sem
                                                                ? 'bg-blue-600 text-white shadow-md'
                                                                : semesterData
                                                                ? 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400 hover:text-blue-600'
                                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                        disabled={!semesterData}
                                                    >
                                                        Semester {sem}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Display Selected Semester */}
                                {selectedSemester && getSemesterData(selectedSemester) ? (
                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                        <div className="bg-white px-4 md:px-6 py-3 md:py-4 border-b border-gray-200">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                                <div className="min-w-0">
                                                    <h3 className="font-bold text-gray-800 text-base md:text-lg break-words">
                                                        <i className="fas fa-calendar-check mr-2 text-blue-600"></i>
                                                        {getSemesterData(selectedSemester).tahun_ajaran} - Semester {selectedSemester}
                                                    </h3>
                                                    <p className="text-xs md:text-sm text-gray-600 mt-1">
                                                        Total: {getSemesterData(selectedSemester).mata_kuliah.length} Mata Kuliah
                                                    </p>
                                                </div>
                                                <div className="bg-blue-50 px-3 md:px-4 py-2 rounded-lg border border-blue-200 w-fit flex-shrink-0">
                                                    <span className="text-xs md:text-sm text-gray-600">IPS: </span>
                                                    <span className="font-bold text-blue-600 text-base md:text-lg">{getSemesterData(selectedSemester).ips || '0.00'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Table Desktop */}
                                        <div className="hidden md:block overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-gray-50">
                                                    <tr className="text-gray-600 font-semibold text-xs">
                                                        <th className="px-4 py-3 text-left uppercase tracking-wider">No</th>
                                                        <th className="px-4 py-3 text-left uppercase tracking-wider">Kode MK</th>
                                                        <th className="px-4 py-3 text-left uppercase tracking-wider">Mata Kuliah</th>
                                                        <th className="px-4 py-3 text-center uppercase tracking-wider">SKS</th>
                                                        <th className="px-4 py-3 text-center uppercase tracking-wider">Nilai</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 bg-white">
                                                    {getSemesterData(selectedSemester).mata_kuliah.map((mk, mkIndex) => (
                                                        <tr key={mkIndex} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-4 py-3 text-sm text-gray-700">{mkIndex + 1}</td>
                                                            <td className="px-4 py-3 text-sm font-medium text-gray-700">{mk.kode_mk}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-700">{mk.nama_mk}</td>
                                                            <td className="px-4 py-3 text-sm text-center text-gray-700">{mk.sks}</td>
                                                            <td className="px-4 py-3 text-center">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                                    mk.nilai === 'A' || mk.nilai === 'A-' ? 'bg-green-100 text-green-700' :
                                                                    mk.nilai === 'B+' || mk.nilai === 'B' || mk.nilai === 'B-' ? 'bg-blue-100 text-blue-700' :
                                                                    mk.nilai === 'C+' || mk.nilai === 'C' ? 'bg-yellow-100 text-yellow-700' :
                                                                    mk.nilai === 'D' || mk.nilai === 'E' ? 'bg-red-100 text-red-700' :
                                                                    'bg-gray-100 text-gray-700'
                                                                }`}>
                                                                    {mk.nilai || '-'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot className="bg-gray-50">
                                                    <tr>
                                                        <td colSpan="3" className="px-4 py-3 text-right font-semibold text-gray-700 text-sm">Total SKS:</td>
                                                        <td className="px-4 py-3 text-center font-bold text-gray-800 text-sm">
                                                            {getSemesterData(selectedSemester).mata_kuliah.reduce((sum, mk) => sum + mk.sks, 0)}
                                                        </td>
                                                        <td></td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>

                                        {/* Cards Mobile */}
                                        <div className="md:hidden p-4 space-y-3">
                                            {getSemesterData(selectedSemester).mata_kuliah.map((mk, mkIndex) => (
                                                <div key={mkIndex} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs text-gray-500 mb-1">#{mkIndex + 1}</p>
                                                            <h4 className="font-semibold text-gray-800 text-sm break-words">{mk.nama_mk}</h4>
                                                            <p className="text-xs text-gray-600 mt-1">{mk.kode_mk}</p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ml-2 flex-shrink-0 ${
                                                            mk.nilai === 'A' || mk.nilai === 'A-' ? 'bg-green-100 text-green-700' :
                                                            mk.nilai === 'B+' || mk.nilai === 'B' || mk.nilai === 'B-' ? 'bg-blue-100 text-blue-700' :
                                                            mk.nilai === 'C+' || mk.nilai === 'C' ? 'bg-yellow-100 text-yellow-700' :
                                                            mk.nilai === 'D' || mk.nilai === 'E' ? 'bg-red-100 text-red-700' :
                                                            'bg-gray-100 text-gray-700'
                                                        }`}>
                                                            {mk.nilai || '-'}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-medium">SKS:</span> {mk.sks}
                                                    </p>
                                                </div>
                                            ))}
                                            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-semibold text-gray-700">Total SKS:</span>
                                                    <span className="text-lg font-bold text-blue-600">
                                                        {getSemesterData(selectedSemester).mata_kuliah.reduce((sum, mk) => sum + mk.sks, 0)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                        <i className="fas fa-inbox text-4xl mb-2 text-gray-400"></i>
                                        <p className="font-medium">
                                            {selectedSemester ? `Tidak ada data KRS untuk Semester ${selectedSemester}` : 'Belum ada data KRS'}
                                        </p>
                                        <p className="text-xs mt-1">Data KRS mahasiswa akan muncul di sini</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Nilai Tab - Transkrip */}
                        {activeTab === 'nilai' && (
                            <div>
                                <div className="mb-6 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 rounded-lg p-4 md:p-6 border border-blue-200">
                                    <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <i className="fas fa-chart-pie text-blue-600"></i>
                                        Ringkasan Akademik
                                    </h3>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                                        <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm">
                                            <p className="text-xs md:text-sm text-gray-600 mb-1">Total SKS</p>
                                            <p className="text-xl md:text-2xl font-bold text-gray-800">{statistik?.total_sks || 0}</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm">
                                            <p className="text-xs md:text-sm text-gray-600 mb-1">SKS Lulus</p>
                                            <p className="text-xl md:text-2xl font-bold text-gray-800">{statistik?.sks_lulus || 0}</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm">
                                            <p className="text-xs md:text-sm text-gray-600 mb-1">IPK</p>
                                            <p className="text-xl md:text-2xl font-bold text-gray-800">{statistik?.ipk || '0.00'}</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm col-span-2 lg:col-span-1">
                                            <p className="text-xs md:text-sm text-gray-600 mb-1">Predikat</p>
                                            <p className="text-base md:text-lg font-bold text-gray-800">
                                                {getPredikat(statistik?.ipk || 0)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Table View */}
                                <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr className="text-gray-600 font-semibold text-xs">
                                                <th className="px-4 py-3 text-left uppercase tracking-wider">No</th>
                                                <th className="px-4 py-3 text-left uppercase tracking-wider">Kode MK</th>
                                                <th className="px-4 py-3 text-left uppercase tracking-wider">Mata Kuliah</th>
                                                <th className="px-4 py-3 text-center uppercase tracking-wider">SKS</th>
                                                <th className="px-4 py-3 text-center uppercase tracking-wider">Nilai</th>
                                                <th className="px-4 py-3 text-center uppercase tracking-wider">Mutu</th>
                                                <th className="px-4 py-3 text-center uppercase tracking-wider">Semester</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {krsData && krsData.length > 0 ? (
                                                krsData.map((semester, semIndex) => (
                                                    semester.mata_kuliah.map((mk, mkIndex) => (
                                                        <tr key={`${semIndex}-${mkIndex}`} className="hover:bg-blue-50 transition-colors">
                                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                                {krsData.slice(0, semIndex).reduce((sum, s) => sum + s.mata_kuliah.length, 0) + mkIndex + 1}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm font-medium text-gray-700">{mk.kode_mk}</td>
                                                            <td className="px-4 py-3 text-sm text-gray-700">{mk.nama_mk}</td>
                                                            <td className="px-4 py-3 text-sm text-center text-gray-700 font-medium">{mk.sks}</td>
                                                            <td className="px-4 py-3 text-center">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                                    mk.nilai === 'A' || mk.nilai === 'A-' ? 'bg-green-100 text-green-700' :
                                                                    mk.nilai === 'B+' || mk.nilai === 'B' || mk.nilai === 'B-' ? 'bg-blue-100 text-blue-700' :
                                                                    mk.nilai === 'C+' || mk.nilai === 'C' ? 'bg-yellow-100 text-yellow-700' :
                                                                    mk.nilai === 'D' || mk.nilai === 'E' ? 'bg-red-100 text-red-700' :
                                                                    'bg-gray-100 text-gray-700'
                                                                }`}>
                                                                    {mk.nilai || '-'}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-center font-medium text-gray-700">
                                                                {mk.bobot !== '-' ? Number(mk.bobot).toFixed(2) : '-'}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-center text-gray-600">
                                                                {semester.semester_ke}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="px-4 py-12 text-center">
                                                        <div className="text-gray-400">
                                                            <i className="fas fa-clipboard-list text-5xl mb-3"></i>
                                                            <p className="text-lg font-medium text-gray-500">Belum ada data nilai</p>
                                                            <p className="text-sm mt-1">Transkrip nilai akan muncul setelah mahasiswa mengambil mata kuliah</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Card View */}
                                <div className="md:hidden space-y-3">
                                    {krsData && krsData.length > 0 ? (
                                        krsData.map((semester, semIndex) => (
                                            semester.mata_kuliah.map((mk, mkIndex) => (
                                                <div key={`${semIndex}-${mkIndex}`} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                                <span className="text-xs font-semibold text-gray-500">
                                                                    #{krsData.slice(0, semIndex).reduce((sum, s) => sum + s.mata_kuliah.length, 0) + mkIndex + 1}
                                                                </span>
                                                                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                                                    Sem {semester.semester_ke}
                                                                </span>
                                                            </div>
                                                            <h4 className="font-semibold text-gray-800 text-sm mb-1 break-words">{mk.nama_mk}</h4>
                                                            <p className="text-xs text-gray-500">{mk.kode_mk}</p>
                                                        </div>
                                                        <span className={`px-3 py-1.5 rounded-full text-sm font-bold ml-2 flex-shrink-0 ${
                                                            mk.nilai === 'A' || mk.nilai === 'A-' ? 'bg-green-100 text-green-700' :
                                                            mk.nilai === 'B+' || mk.nilai === 'B' || mk.nilai === 'B-' ? 'bg-blue-100 text-blue-700' :
                                                            mk.nilai === 'C+' || mk.nilai === 'C' ? 'bg-yellow-100 text-yellow-700' :
                                                            mk.nilai === 'D' || mk.nilai === 'E' ? 'bg-red-100 text-red-700' :
                                                            'bg-gray-100 text-gray-700'
                                                        }`}>
                                                            {mk.nilai || '-'}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-1">SKS</p>
                                                            <p className="text-sm font-semibold text-gray-800">{mk.sks}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-1">Mutu</p>
                                                            <p className="text-sm font-semibold text-gray-800">
                                                                {mk.bobot !== '-' ? Number(mk.bobot).toFixed(2) : '-'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ))
                                    ) : (
                                        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                            <i className="fas fa-clipboard-list text-5xl mb-4 text-gray-400"></i>
                                            <p className="text-base font-medium text-gray-500">Belum ada data nilai</p>
                                            <p className="text-xs mt-1">Transkrip nilai akan muncul setelah mahasiswa mengambil mata kuliah</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </BaakLayout>
    );
}
