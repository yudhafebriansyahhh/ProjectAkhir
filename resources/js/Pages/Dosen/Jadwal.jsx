import { useState } from 'react';
import { Head } from '@inertiajs/react';
import DosenLayout from '@/Layouts/DosenLayout';

export default function Jadwal() {
    const [filters, setFilters] = useState({
        semester: '2',
        hari: ''
    });

    const mataKuliah = [
        { kode: 'IF301', nama: 'Pemrograman Web', dosen: 'Dr. Ahmad Sholeh, M.Kom', hari: 'Senin', jam: '09:10-10:50', ruang: 'Lab Komputer 1', sks: 3, kelas: 'A1', rps: true },
        { kode: 'IF302', nama: 'Basis Data Lanjut', dosen: 'Prof. Siti Aminah, M.T', hari: 'Selasa', jam: '07:30-09:10', ruang: 'R201', sks: 3, kelas: 'A1', rps: true },
        { kode: 'IF303', nama: 'Sistem Operasi', dosen: 'Dr. Budi Santoso, M.Kom', hari: 'Rabu', jam: '10:00-11:40', ruang: 'R302', sks: 3, kelas: 'A1', rps: false },
        { kode: 'IF304', nama: 'Rekayasa Perangkat Lunak', dosen: 'Ir. Dewi Lestari, M.T', hari: 'Kamis', jam: '13:00-14:40', ruang: 'R105', sks: 3, kelas: 'A1', rps: true },
        { kode: 'IF305', nama: 'Jaringan Komputer', dosen: 'Dr. Rizki Pratama, M.Kom', hari: 'Jumat', jam: '08:00-09:40', ruang: 'Lab Jaringan', sks: 3, kelas: 'A1', rps: true },
        { kode: 'IF306', nama: 'Kecerdasan Buatan', dosen: 'Prof. Maya Sari, Ph.D', hari: 'Senin', jam: '15:00-16:40', ruang: 'R204', sks: 3, kelas: 'A1', rps: false },
        { kode: 'IF307', nama: 'Keamanan Sistem Informasi', dosen: 'Dr. Andi Wijaya, M.T', hari: 'Rabu', jam: '13:00-14:40', ruang: 'R301', sks: 3, kelas: 'A1', rps: true },
        { kode: 'IF308', nama: 'Manajemen Proyek TI', dosen: 'Ir. Fatimah Zahra, M.M', hari: 'Kamis', jam: '10:00-11:40', ruang: 'R203', sks: 3, kelas: 'A1', rps: true },
    ];

    const [filteredData, setFilteredData] = useState(mataKuliah);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFilter = () => {
        let filtered = [...mataKuliah];

        // Filter by day
        if (filters.hari) {
            filtered = filtered.filter(mk =>
                mk.hari.toLowerCase() === filters.hari.toLowerCase()
            );
        }

        setFilteredData(filtered);
    };

    const getSemesterText = (semesterValue) => {
        const semesters = {
            '1': 'Semester 1 (Ganjil 2024/2025)',
            '2': 'Semester 2 (Genap 2024/2025)',
            '3': 'Semester 3 (Ganjil 2023/2024)',
            '4': 'Semester 4 (Genap 2023/2024)',
            '5': 'Semester 5 (Ganjil 2022/2023)',
            '6': 'Semester 6 (Genap 2022/2023)',
            '7': 'Semester 7 (Ganjil 2021/2022)',
            '8': 'Semester 8 (Genap 2021/2022)',
        };
        return semesters[semesterValue] || 'Semester 2 (Genap 2024/2025)';
    };

    return (
        <DosenLayout title="Jadwal">
            <Head title="Jadwal" />

            <div className="container mx-auto px-4 py-8 max-w-[600px] sm:max-w-full">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Jadwal</h1>
                    <p className="text-gray-600">Akses jadwal kuliah, ujian, dan kegiatan akademik lainnya untuk semester aktif.</p>
                </div>

                {/* Filter Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-2">
                                Pilih Semester
                            </label>
                            <select
                                id="semester"
                                name="semester"
                                value={filters.semester}
                                onChange={handleFilterChange}
                                className="w-full bg-white border border-gray-200 text-sm font-medium px-4 py-2 rounded-lg focus:border-blue-600 transition-all duration-200"
                            >
                                <option value="">-- Pilih Semester --</option>
                                <option value="1">Semester 1 (Ganjil 2024/2025)</option>
                                <option value="2">Semester 2 (Genap 2024/2025)</option>
                                <option value="3">Semester 3 (Ganjil 2023/2024)</option>
                                <option value="4">Semester 4 (Genap 2023/2024)</option>
                                <option value="5">Semester 5 (Ganjil 2022/2023)</option>
                                <option value="6">Semester 6 (Genap 2022/2023)</option>
                                <option value="7">Semester 7 (Ganjil 2021/2022)</option>
                                <option value="8">Semester 8 (Genap 2021/2022)</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="hari" className="block text-sm font-medium text-gray-700 mb-2">
                                Filter Hari
                            </label>
                            <select
                                id="hari"
                                name="hari"
                                value={filters.hari}
                                onChange={handleFilterChange}
                                className="w-full bg-white border border-gray-200 text-sm font-medium px-4 py-2 rounded-lg focus:border-blue-600 transition-all duration-200"
                            >
                                <option value="">Semua Hari</option>
                                <option value="senin">Senin</option>
                                <option value="selasa">Selasa</option>
                                <option value="rabu">Rabu</option>
                                <option value="kamis">Kamis</option>
                                <option value="jumat">Jumat</option>
                                <option value="sabtu">Sabtu</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                type="button"
                                onClick={handleFilter}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
                            >
                                <i className="fas fa-search"></i>
                                <span>Filter</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Jadwal Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">Jadwal Mata Kuliah</h3>
                        <p className="text-sm text-gray-600 mt-1">{getSemesterText(filters.semester)}</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr className="text-xs font-semibold text-gray-600">
                                    <th className="px-6 py-4 text-left uppercase tracking-wider">No</th>
                                    <th className="px-6 py-4 text-left uppercase tracking-wider">Kode MK</th>
                                    <th className="px-6 py-4 text-left uppercase tracking-wider">Mata Kuliah</th>
                                    <th className="px-6 py-4 text-center uppercase tracking-wider">Kelas</th>
                                    <th className="px-6 py-4 text-center uppercase tracking-wider">Ruangan</th>
                                    <th className="px-6 py-4 text-center uppercase tracking-wider">Waktu</th>
                                    <th className="px-6 py-4 text-center uppercase tracking-wider">SKS</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredData.length > 0 ? (
                                    filteredData.map((mk, index) => (
                                        <tr key={mk.kode} className="hover:bg-gray-50 transition duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {mk.kode}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                <div className="font-medium">{mk.nama}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-medium">
                                                    {mk.kelas}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                                                {mk.ruang}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                                                <div className="text-xs">
                                                    <div className="font-medium text-gray-800">{mk.hari}</div>
                                                    <div className="text-gray-600">{mk.jam}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-gray-900">
                                                {mk.sks}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-sm text-gray-500">
                                            <i className="fas fa-calendar-times text-3xl text-gray-300 mb-2"></i>
                                            <p>Tidak ada jadwal ditemukan</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DosenLayout>
    );
}
