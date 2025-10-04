import { Head, Link, router } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';
import { useState } from 'react';

export default function DetailMahasiswa({
    mahasiswa,
    rencanaStudiData,
    hasilStudiData,
    transkripData,
    statistik,
    prestasiAkademik,
    keteranganNilai,
    statistikNilai
}) {
    const [activeTab, setActiveTab] = useState('biodata');
    const [selectedSemester, setSelectedSemester] = useState('');

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

    const getSelectedSemesterData = () => {
        if (!selectedSemester) return null;
        return hasilStudiData?.find(item => `${item.no}` === selectedSemester);
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
                                onClick={() => setActiveTab('resume-perkuliahan')}
                                className={`flex-1 sm:flex-none px-4 md:px-6 py-3 text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
                                    activeTab === 'resume-perkuliahan'
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                }`}
                            >
                                <i className="fas fa-book mr-1 md:mr-2"></i>
                                <span>Resume Perkuliahan</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('rencana-studi')}
                                className={`flex-1 sm:flex-none px-4 md:px-6 py-3 text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
                                    activeTab === 'rencana-studi'
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                }`}
                            >
                                <i className="fas fa-clipboard-list mr-1 md:mr-2"></i>
                                <span>Rencana Studi</span>
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('hasil-studi');
                                    setSelectedSemester('');
                                }}
                                className={`flex-1 sm:flex-none px-4 md:px-6 py-3 text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
                                    activeTab === 'hasil-studi'
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                }`}
                            >
                                <i className="fas fa-chart-line mr-1 md:mr-2"></i>
                                <span>Hasil Studi</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('transkrip')}
                                className={`flex-1 sm:flex-none px-4 md:px-6 py-3 text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
                                    activeTab === 'transkrip'
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                }`}
                            >
                                <i className="fas fa-file-alt mr-1 md:mr-2"></i>
                                <span>Transkrip</span>
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-4 md:p-6">
                        {/* Tab Biodata */}
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

                        {/* Tab Resume Perkuliahan */}
                        {activeTab === 'resume-perkuliahan' && (
                            <div className="space-y-4">
                                {/* Table Desktop */}
                                <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-lg">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th rowSpan="2" className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase border-r">NO</th>
                                                <th rowSpan="2" className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase border-r">PERIODE</th>
                                                <th rowSpan="2" className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase border-r">SMT</th>
                                                <th colSpan="2" className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase border-r border-b">IP SEMESTER</th>
                                                <th colSpan="2" className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase border-r border-b">IP KUMULATIF</th>
                                                <th colSpan="5" className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase border-b">DISTRIBUSI NILAI</th>
                                            </tr>
                                            <tr className="bg-gray-50">
                                                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase border-r">SKS</th>
                                                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase border-r">IP</th>
                                                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase border-r">SKS</th>
                                                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase border-r">IPK</th>
                                                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase">A</th>
                                                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase">B</th>
                                                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase">C</th>
                                                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase">D</th>
                                                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase">E</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {hasilStudiData?.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm text-center">{item.no}</td>
                                                    <td className="px-4 py-3 text-sm text-center">{item.periode}</td>
                                                    <td className="px-4 py-3 text-sm text-center">{item.semester}</td>
                                                    <td className="px-4 py-3 text-sm text-center">{item.sks_semester}</td>
                                                    <td className="px-4 py-3 text-sm text-center text-blue-600 font-medium">{item.ips}</td>
                                                    <td className="px-4 py-3 text-sm text-center">{item.sks_kumulatif}</td>
                                                    <td className="px-4 py-3 text-sm text-center text-blue-600 font-medium">{item.ipk}</td>
                                                    <td className="px-4 py-3 text-sm text-center">{item.distribusi_nilai?.A || 0}</td>
                                                    <td className="px-4 py-3 text-sm text-center">{item.distribusi_nilai?.B || 0}</td>
                                                    <td className="px-4 py-3 text-sm text-center">{item.distribusi_nilai?.C || 0}</td>
                                                    <td className="px-4 py-3 text-sm text-center">{item.distribusi_nilai?.D || 0}</td>
                                                    <td className="px-4 py-3 text-sm text-center">{item.distribusi_nilai?.E || 0}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Cards Mobile */}
                                <div className="md:hidden space-y-4">
                                    {hasilStudiData?.map((item, idx) => (
                                        <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <span className="text-xs text-gray-500">Semester {item.no}</span>
                                                    <h4 className="font-semibold text-sm text-gray-800 mt-1">
                                                        {item.periode} - {item.semester}
                                                    </h4>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 mb-3">
                                                <div className="bg-blue-50 rounded-lg p-3">
                                                    <p className="text-xs text-gray-600 mb-1">IPS</p>
                                                    <p className="text-lg font-bold text-blue-600">{item.ips}</p>
                                                    <p className="text-xs text-gray-600 mt-1">{item.sks_semester} SKS</p>
                                                </div>
                                                <div className="bg-green-50 rounded-lg p-3">
                                                    <p className="text-xs text-gray-600 mb-1">IPK</p>
                                                    <p className="text-lg font-bold text-green-600">{item.ipk}</p>
                                                    <p className="text-xs text-gray-600 mt-1">{item.sks_kumulatif} SKS</p>
                                                </div>
                                            </div>

                                            <div className="border-t pt-3">
                                                <p className="text-xs font-semibold text-gray-700 mb-2">Distribusi Nilai:</p>
                                                <div className="flex justify-between text-xs">
                                                    <span>A: <strong>{item.distribusi_nilai?.A || 0}</strong></span>
                                                    <span>B: <strong>{item.distribusi_nilai?.B || 0}</strong></span>
                                                    <span>C: <strong>{item.distribusi_nilai?.C || 0}</strong></span>
                                                    <span>D: <strong>{item.distribusi_nilai?.D || 0}</strong></span>
                                                    <span>E: <strong>{item.distribusi_nilai?.E || 0}</strong></span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tab Rencana Studi */}
                        {activeTab === 'rencana-studi' && (
                            <div className="space-y-4">
                                {/* Semester Selector */}
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <i className="fas fa-filter mr-2"></i>
                                        Pilih Semester:
                                    </label>
                                    <select
                                        value={selectedSemester}
                                        onChange={(e) => setSelectedSemester(e.target.value)}
                                        className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Semua Semester</option>
                                        {rencanaStudiData?.map((item) => (
                                            <option key={item.semester} value={item.semester}>
                                                Semester {item.semester} - {item.jenis_semester} {item.tahun_ajaran}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Table Desktop */}
                                <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-lg">
                                    <table className="w-full">
                                        <thead className="bg-blue-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">No</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Kode</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Mata Kuliah</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nama Kelas</th>
                                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">SKS</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {rencanaStudiData
                                                ?.filter(item => !selectedSemester || `${item.semester}` === selectedSemester)
                                                .map((semester, semIdx) =>
                                                    semester.mata_kuliah.map((mk, mkIdx) => (
                                                        <tr key={`${semIdx}-${mkIdx}`} className="hover:bg-gray-50">
                                                            <td className="px-4 py-3 text-sm">{mkIdx + 1}</td>
                                                            <td className="px-4 py-3 text-sm font-medium">{mk.kode_mk}</td>
                                                            <td className="px-4 py-3 text-sm">{mk.nama_mk}</td>
                                                            <td className="px-4 py-3 text-sm">Kelas {mk.nama_kelas}</td>
                                                            <td className="px-4 py-3 text-sm text-center">{mk.sks}</td>
                                                        </tr>
                                                    ))
                                                )}
                                        </tbody>
                                        <tfoot className="bg-gray-50">
                                            <tr>
                                                <td colSpan="4" className="px-4 py-3 text-right font-bold text-sm">Total SKS</td>
                                                <td className="px-4 py-3 text-center font-bold text-sm">
                                                    {rencanaStudiData
                                                        ?.filter(item => !selectedSemester || `${item.semester}` === selectedSemester)
                                                        .reduce((sum, semester) => sum + semester.total_sks, 0) || 0}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                {/* Cards Mobile */}
                                <div className="md:hidden space-y-3">
                                    {rencanaStudiData
                                        ?.filter(item => !selectedSemester || `${item.semester}` === selectedSemester)
                                        .map((semester, semIdx) =>
                                            semester.mata_kuliah.map((mk, mkIdx) => (
                                                <div key={`${semIdx}-${mkIdx}`} className="bg-white border border-gray-200 rounded-lg p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex-1">
                                                            <span className="text-xs text-gray-500">#{mkIdx + 1}</span>
                                                            <h4 className="font-semibold text-sm text-gray-800 mt-1">{mk.nama_mk}</h4>
                                                            <p className="text-xs text-gray-600 mt-1">{mk.kode_mk}</p>
                                                        </div>
                                                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium ml-2">
                                                            {mk.sks} SKS
                                                        </span>
                                                    </div>
                                                    <div className="pt-2 border-t border-gray-100">
                                                        <p className="text-xs text-gray-500">Kelas</p>
                                                        <p className="text-sm font-medium">Kelas {mk.nama_kelas}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}

                                    {/* Total SKS */}
                                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-semibold text-gray-700">Total SKS:</span>
                                            <span className="text-lg font-bold text-blue-600">
                                                {rencanaStudiData
                                                    ?.filter(item => !selectedSemester || `${item.semester}` === selectedSemester)
                                                    .reduce((sum, semester) => sum + semester.total_sks, 0) || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab Hasil Studi */}
                        {activeTab === 'hasil-studi' && (
                            <div className="space-y-4">
                                {/* Semester Selector */}
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <i className="fas fa-filter mr-2"></i>
                                        Pilih Semester:
                                    </label>
                                    <select
                                        value={selectedSemester}
                                        onChange={(e) => setSelectedSemester(e.target.value)}
                                        className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">-- Pilih Semester --</option>
                                        {hasilStudiData?.map((item) => (
                                            <option key={item.no} value={item.no}>
                                                Semester {item.no} - {item.semester} {item.periode}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Show detail only when semester is selected */}
                                {selectedSemester && getSelectedSemesterData() ? (
                                    <div>
                                        {/* Table Desktop */}
                                        <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-lg">
                                            <table className="w-full">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">No</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Kode</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Mata Kuliah</th>
                                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">SKS</th>
                                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Bobot</th>
                                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Nilai</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 bg-white">
                                                    {getSelectedSemesterData()?.mata_kuliah?.map((mk, idx) => (
                                                        <tr key={idx} className="hover:bg-gray-50">
                                                            <td className="px-4 py-3 text-sm">{idx + 1}</td>
                                                            <td className="px-4 py-3 text-sm font-medium">{mk.kode_mk}</td>
                                                            <td className="px-4 py-3 text-sm">{mk.nama_mk}</td>
                                                            <td className="px-4 py-3 text-sm text-center">{mk.sks}</td>
                                                            <td className="px-4 py-3 text-sm text-center">
                                                                {typeof mk.bobot === 'number' ? mk.bobot.toFixed(2) : mk.bobot}
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                                                                    ['A', 'A-'].includes(mk.nilai) ? 'bg-green-100 text-green-700' :
                                                                    ['B+', 'B', 'B-'].includes(mk.nilai) ? 'bg-blue-100 text-blue-700' :
                                                                    ['C+', 'C'].includes(mk.nilai) ? 'bg-yellow-100 text-yellow-700' :
                                                                    ['D', 'E'].includes(mk.nilai) ? 'bg-red-100 text-red-700' :
                                                                    'bg-gray-100 text-gray-700'
                                                                }`}>
                                                                    {mk.nilai}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot className="bg-gray-50">
                                                    <tr>
                                                        <td colSpan="6" className="px-4 py-4">
                                                            <div className="space-y-2 text-sm">
                                                                <div className="flex justify-between font-semibold">
                                                                    <span>Total SKS</span>
                                                                    <span>{getSelectedSemesterData()?.sks_semester}</span>
                                                                </div>
                                                                <div className="flex justify-between font-semibold">
                                                                    <span>Indeks Prestasi Semester</span>
                                                                    <span className="text-blue-600">{getSelectedSemesterData()?.ips}</span>
                                                                </div>
                                                                <div className="flex justify-between font-semibold">
                                                                    <span>Indeks Prestasi Kumulatif</span>
                                                                    <span className="text-green-600">{getSelectedSemesterData()?.ipk}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>

                                        {/* Cards Mobile */}
                                        <div className="md:hidden space-y-3">
                                            {getSelectedSemesterData()?.mata_kuliah?.map((mk, idx) => (
                                                <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex-1">
                                                            <span className="text-xs text-gray-500">#{idx + 1}</span>
                                                            <h4 className="font-semibold text-sm text-gray-800 mt-1">{mk.nama_mk}</h4>
                                                            <p className="text-xs text-gray-600 mt-1">{mk.kode_mk}</p>
                                                        </div>
                                                        <span className={`px-3 py-1.5 rounded-full text-sm font-bold ml-2 ${
                                                            ['A', 'A-'].includes(mk.nilai) ? 'bg-green-100 text-green-700' :
                                                            ['B+', 'B', 'B-'].includes(mk.nilai) ? 'bg-blue-100 text-blue-700' :
                                                            ['C+', 'C'].includes(mk.nilai) ? 'bg-yellow-100 text-yellow-700' :
                                                            ['D', 'E'].includes(mk.nilai) ? 'bg-red-100 text-red-700' :
                                                            'bg-gray-100 text-gray-700'
                                                        }`}>
                                                            {mk.nilai}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                                                        <div>
                                                            <p className="text-xs text-gray-500">SKS</p>
                                                            <p className="text-sm font-semibold">{mk.sks}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">Bobot</p>
                                                            <p className="text-sm font-semibold">
                                                                {typeof mk.bobot === 'number' ? mk.bobot.toFixed(2) : mk.bobot}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Summary */}
                                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between font-semibold">
                                                        <span>Total SKS</span>
                                                        <span>{getSelectedSemesterData()?.sks_semester}</span>
                                                    </div>
                                                    <div className="flex justify-between font-semibold">
                                                        <span>IPS</span>
                                                        <span className="text-blue-600">{getSelectedSemesterData()?.ips}</span>
                                                    </div>
                                                    <div className="flex justify-between font-semibold">
                                                        <span>IPK</span>
                                                        <span className="text-green-600">{getSelectedSemesterData()?.ipk}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                        <i className="fas fa-filter text-4xl mb-3 text-gray-400"></i>
                                        <p className="font-medium">Pilih semester untuk melihat detail nilai</p>
                                        <p className="text-xs mt-1">Gunakan dropdown di atas untuk memilih semester</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab Transkrip */}
                        {activeTab === 'transkrip' && (
                            <div className="space-y-6">
                                {/* Transkrip Table Desktop */}
                                <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-lg">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th rowSpan="2" className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase border-r">NO</th>
                                                <th colSpan="2" className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase border-r border-b">MATAKULIAH</th>
                                                <th rowSpan="2" className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase border-r">TOTAL<br/>SKS</th>
                                                <th rowSpan="2" className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase border-r">JENIS</th>
                                                <th rowSpan="2" className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase border-r">SEMESTER<br/>PENGAMBILAN</th>
                                                <th colSpan="2" className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase border-b">NILAI</th>
                                            </tr>
                                            <tr className="bg-gray-50">
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase border-r">KODE</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase border-r">NAMA</th>
                                                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase border-r">BOBOT</th>
                                                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase">KODE</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {transkripData?.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm text-center">{idx + 1}</td>
                                                    <td className="px-4 py-3 text-sm font-medium">{item.kode_mk}</td>
                                                    <td className="px-4 py-3 text-sm">{item.nama_mk}</td>
                                                    <td className="px-4 py-3 text-sm text-center">{item.total_sks}</td>
                                                    <td className="px-4 py-3 text-sm text-center">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                            item.jenis === 'Umum' ? 'bg-green-100 text-green-700' :
                                                            item.jenis === 'Wajib' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-purple-100 text-purple-700'
                                                        }`}>
                                                            {item.jenis}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-center">{item.semester_pengambilan}</td>
                                                    <td className="px-4 py-3 text-sm text-center">
                                                        {typeof item.bobot === 'number' ? item.bobot.toFixed(2) : item.bobot}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                            ['A', 'A-'].includes(item.nilai) ? 'bg-green-100 text-green-700' :
                                                            ['B+', 'B', 'B-'].includes(item.nilai) ? 'bg-blue-100 text-blue-700' :
                                                            ['C+', 'C'].includes(item.nilai) ? 'bg-yellow-100 text-yellow-700' :
                                                            ['D', 'E'].includes(item.nilai) ? 'bg-red-100 text-red-700' :
                                                            'bg-gray-100 text-gray-700'
                                                        }`}>
                                                            {item.nilai}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Transkrip Cards Mobile */}
                                <div className="md:hidden space-y-3">
                                    {transkripData?.map((item, idx) => (
                                        <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1">
                                                    <span className="text-xs text-gray-500">#{idx + 1}</span>
                                                    <h4 className="font-semibold text-sm text-gray-800 mt-1">{item.nama_mk}</h4>
                                                    <p className="text-xs text-gray-600 mt-1">{item.kode_mk}</p>
                                                </div>
                                                <span className={`px-3 py-1.5 rounded-full text-sm font-bold ml-2 ${
                                                    ['A', 'A-'].includes(item.nilai) ? 'bg-green-100 text-green-700' :
                                                    ['B+', 'B', 'B-'].includes(item.nilai) ? 'bg-blue-100 text-blue-700' :
                                                    ['C+', 'C'].includes(item.nilai) ? 'bg-yellow-100 text-yellow-700' :
                                                    ['D', 'E'].includes(item.nilai) ? 'bg-red-100 text-red-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {item.nilai}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 text-xs">
                                                <div>
                                                    <p className="text-gray-500">SKS</p>
                                                    <p className="font-semibold">{item.total_sks}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Bobot</p>
                                                    <p className="font-semibold">
                                                        {typeof item.bobot === 'number' ? item.bobot.toFixed(2) : item.bobot}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Jenis</p>
                                                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                                        item.jenis === 'Umum' ? 'bg-green-100 text-green-700' :
                                                        item.jenis === 'Wajib' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-purple-100 text-purple-700'
                                                    }`}>
                                                        {item.jenis}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Semester</p>
                                                    <p className="font-semibold">{item.semester_pengambilan}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary Cards - Placed Below */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                                    {/* Prestasi Akademik */}
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200 shadow-sm">
                                        <div className="flex items-center gap-2 mb-4">
                                            <i className="fas fa-trophy text-blue-600 text-lg"></i>
                                            <h4 className="text-sm font-bold text-gray-800">Prestasi Akademik</h4>
                                        </div>
                                        <div className="space-y-3 text-sm">
                                            <div className="bg-white bg-opacity-60 rounded-lg p-3">
                                                <p className="text-xs text-gray-600 mb-1">Jumlah SKS</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs">Wajib:</span>
                                                    <span className="font-bold">{prestasiAkademik?.jumlah_sks_matakuliah?.wajib || 0}</span>
                                                </div>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-xs">Pilihan:</span>
                                                    <span className="font-bold">{prestasiAkademik?.jumlah_sks_matakuliah?.pilihan || 0}</span>
                                                </div>
                                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-300">
                                                    <span className="text-xs font-bold">Total:</span>
                                                    <span className="font-bold text-blue-600">{prestasiAkademik?.jumlah_sks_matakuliah?.total || 0}</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-700">Total SKS × Bobot:</span>
                                                <span className="font-bold">{prestasiAkademik?.total_sks_bobot?.toFixed(2) || '0.00'}</span>
                                            </div>
                                            <div className="bg-white bg-opacity-60 rounded-lg p-3 text-center">
                                                <p className="text-xs text-gray-600 mb-1">IP Kumulatif</p>
                                                <p className="text-2xl font-bold text-blue-600">{prestasiAkademik?.ipk || '0.00'}</p>
                                                <p className="text-xs font-semibold text-gray-700 mt-2">
                                                    Predikat: <span className="text-blue-700">{prestasiAkademik?.predikat || '-'}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Keterangan Nilai */}
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200 shadow-sm">
                                        <div className="flex items-center gap-2 mb-4">
                                            <i className="fas fa-info-circle text-green-600 text-lg"></i>
                                            <h4 className="text-sm font-bold text-gray-800">Keterangan Nilai</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            {Object.entries(keteranganNilai || {}).map(([huruf, bobot]) => (
                                                <div key={huruf} className="bg-white bg-opacity-60 rounded px-3 py-2 flex justify-between items-center">
                                                    <span className="font-semibold text-gray-700">{huruf}</span>
                                                    <span className="font-bold text-green-700">{bobot}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Statistik Nilai */}
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200 shadow-sm">
                                        <div className="flex items-center gap-2 mb-4">
                                            <i className="fas fa-chart-bar text-purple-600 text-lg"></i>
                                            <h4 className="text-sm font-bold text-gray-800">Statistik Nilai</h4>
                                        </div>
                                        <div className="space-y-2 text-xs">
                                            {statistikNilai?.map((stat) => (
                                                <div key={stat.nilai} className="bg-white bg-opacity-60 rounded px-3 py-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-semibold text-gray-700">{stat.nilai}:</span>
                                                        <div className="text-right">
                                                            <span className="font-bold text-purple-700">{stat.sks} SKS</span>
                                                            <span className="text-gray-600 ml-2">({parseFloat(stat.persentase).toFixed(2)}%)</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </BaakLayout>
    );
}
