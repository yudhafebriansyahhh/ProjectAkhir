import { useState } from 'react';
import { Head } from '@inertiajs/react';
import MahasiswaLayout from '@/Layouts/MahasiswaLayout';

export default function Penjadwalan({ semesters = [] }) {
    // Default selected semester to the latest one, or empty string if no semesters
    const defaultSemesterId = semesters.length > 0 ? semesters[semesters.length - 1].id.toString() : '';
    
    // States for filtering
    const [selectedSemester, setSelectedSemester] = useState(defaultSemesterId);
    const [filterHari, setFilterHari] = useState('');

    // Get the currently active semester data based on the dropdown
    const activeSemesterData = semesters.find(s => s.id.toString() === selectedSemester);

    // Get the filtered schedules for the active semester
    const filteredMataKuliah = activeSemesterData 
        ? activeSemesterData.mata_kuliah.filter(mk => {
            if (!filterHari) return true;
            return mk.hari.toLowerCase() === filterHari.toLowerCase();
          })
        : [];

    return (
        <MahasiswaLayout title="Penjadwalan">
            <Head title="Penjadwalan" />

            <div className="container mx-auto px-4 py-8 max-w-[600px] sm:max-w-full">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Penjadwalan</h1>
                    <p className="text-gray-600">Akses jadwal kuliah, ujian, dan kegiatan akademik lainnya untuk semester aktif.</p>
                </div>

                {/* Filter Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-2">Pilih Semester</label>
                            <select 
                                id="semester" 
                                name="semester"
                                value={selectedSemester}
                                onChange={(e) => setSelectedSemester(e.target.value)}
                                className="w-full bg-white border border-gray-200 text-sm font-medium px-4 py-2 rounded-lg focus:border-blue-600 transition-all duration-200">
                                {semesters.length === 0 && <option value="">-- Belum ada data --</option>}
                                {semesters.map(semester => (
                                    <option key={semester.id} value={semester.id}>
                                        {semester.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="hari" className="block text-sm font-medium text-gray-700 mb-2">Filter Hari</label>
                            <select 
                                id="hari" 
                                name="hari"
                                value={filterHari}
                                onChange={(e) => setFilterHari(e.target.value)}
                                className="w-full bg-white border border-gray-200 text-sm font-medium px-4 py-2 rounded-lg focus:border-blue-600 transition-all duration-200">
                                <option value="">Semua Hari</option>
                                <option value="senin">Senin</option>
                                <option value="selasa">Selasa</option>
                                <option value="rabu">Rabu</option>
                                <option value="kamis">Kamis</option>
                                <option value="jumat">Jumat</option>
                                <option value="sabtu">Sabtu</option>
                                <option value="minggu">Minggu</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            {/* Filter button can be purely visual now since onChange triggers render automatically */}
                            <button type="button"
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2 cursor-default">
                                <i className="fas fa-search"></i>
                                <span>Filter Aktif</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Jadwal Table */}
                {activeSemesterData ? (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Jadwal Mata Kuliah</h3>
                            <p className="text-sm text-gray-600 mt-1">{activeSemesterData.label}</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px]">
                                <thead className="bg-gray-50">
                                    <tr className="text-gray-600 font-semibold text-xs">
                                        <th className="px-6 py-4 text-left uppercase tracking-wider">No</th>
                                        <th className="px-6 py-4 text-left uppercase tracking-wider">Kode MK</th>
                                        <th className="px-6 py-4 text-left uppercase tracking-wider">Mata Kuliah</th>
                                        <th className="px-6 py-4 text-left uppercase tracking-wider">Dosen</th>
                                        <th className="px-6 py-4 text-center uppercase tracking-wider">Kelas</th>
                                        <th className="px-6 py-4 text-center uppercase tracking-wider">SKS</th>
                                        <th className="px-6 py-4 text-center uppercase tracking-wider">Jadwal</th>
                                        <th className="px-6 py-4 text-center uppercase tracking-wider">Ruangan</th>
                                        <th className="px-6 py-4 text-center uppercase tracking-wider">RPS</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredMataKuliah.length > 0 ? (
                                        filteredMataKuliah.map((mk, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {mk.kode}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    <div className="font-medium">{mk.nama}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {mk.dosen}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-medium">
                                                        {mk.kelas}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-gray-900">
                                                    {mk.sks}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                                                    <div className="text-xs">
                                                        <div className="font-medium text-gray-800">{mk.hari}</div>
                                                        <div className="text-gray-600">{mk.jam}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                                                    {mk.ruang}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                                    {mk.rps ? (
                                                        <button type="button"
                                                            className="inline-flex items-center px-3 py-1.5 border gap-2 border-green-300 text-green-700 bg-green-50 hover:bg-green-100 rounded-lg text-xs font-semibold transition duration-200">
                                                            <i className="fa-regular fa-file-lines"></i>
                                                            <span>RPS</span>
                                                        </button>
                                                    ) : (
                                                        <span
                                                            className="inline-flex items-center px-3 py-1.5 gap-2 bg-gray-100 text-gray-500 rounded-lg text-xs font-semibold">
                                                            <i className="fa-solid fa-xmark"></i>
                                                            <span>Tidak Ada</span>
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                                                Tidak ada jadwal mata kuliah yang ditemukan untuk filter ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6 flex gap-3 text-blue-700">
                        <i className="fa-solid fa-circle-info mt-1"></i>
                        <p>Belum ada data rencana jadwal akademik (KRS Aktif) yang tercatat untuk Anda saat ini.</p>
                    </div>
                )}

                {/* Info Footer */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Informasi Penting:</p>
                            <ul className="list-disc list-inside space-y-1 text-blue-700">
                                <li>Jadwal dapat berubah sewaktu-waktu, selalu periksa pengumuman terbaru</li>
                                <li>RPS (Rencana Pembelajaran Semester) tersedia untuk diunduh pada mata kuliah yang tersedia</li>
                                <li>Untuk perubahan jadwal atau informasi lebih lanjut, hubungi bagian akademik</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </MahasiswaLayout>
    );
}
