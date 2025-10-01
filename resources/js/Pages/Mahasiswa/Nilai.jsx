import { useState } from 'react';
import { Head } from '@inertiajs/react';
import MahasiswaLayout from '@/Layouts/MahasiswaLayout';

export default function Nilai() {
    const [activeSemester, setActiveSemester] = useState(1);

    // Data semester
    const semesters = [
        {
            id: 1,
            ipkSemester: '3.67',
            ipkKumulatif: '3.67',
            totalSks: 18,
            mata_kuliah: [
                { nama: 'Algoritma Pemrograman', bobot: 3, uts: 88, uas: 90, uni: 89, total: 89, grade: 'A' },
                { nama: 'Matematika Diskrit', bobot: 3, uts: 85, uas: 87, uni: 86, total: 86, grade: 'A' },
                { nama: 'Sistem Digital', bobot: 3, uts: 78, uas: 82, uni: 80, total: 80, grade: 'B+' },
                { nama: 'Bahasa Inggris', bobot: 2, uts: 85, uas: 88, uni: 87, total: 87, grade: 'A' },
                { nama: 'Pancasila', bobot: 2, uts: 90, uas: 92, uni: 91, total: 91, grade: 'A' },
                { nama: 'Pengantar Teknologi Informasi', bobot: 3, uts: 82, uas: 85, uni: 84, total: 84, grade: 'A-' },
                { nama: 'Kalkulus I', bobot: 2, uts: 75, uas: 78, uni: 77, total: 77, grade: 'B' }
            ]
        },
        {
            id: 2,
            ipkSemester: '3.55',
            ipkKumulatif: '3.61',
            totalSks: 20,
            mata_kuliah: [
                { nama: 'Pemrograman Berorientasi Objek', bobot: 3, uts: 85, uas: 88, uni: 87, total: 87, grade: 'A' },
                { nama: 'Struktur Data', bobot: 3, uts: 80, uas: 83, uni: 82, total: 82, grade: 'A-' },
                { nama: 'Matematika Lanjut', bobot: 3, uts: 78, uas: 80, uni: 79, total: 79, grade: 'B+' },
                { nama: 'Fisika Dasar', bobot: 3, uts: 75, uas: 77, uni: 76, total: 76, grade: 'B' },
                { nama: 'Kewarganegaraan', bobot: 2, uts: 88, uas: 90, uni: 89, total: 89, grade: 'A' },
                { nama: 'Bahasa Indonesia', bobot: 2, uts: 85, uas: 87, uni: 86, total: 86, grade: 'A' },
                { nama: 'Statistika', bobot: 2, uts: 82, uas: 84, uni: 83, total: 83, grade: 'A-' },
                { nama: 'Etika Profesi', bobot: 2, uts: 78, uas: 80, uni: 79, total: 79, grade: 'B+' }
            ]
        },
        {
            id: 3,
            ipkSemester: '3.45',
            ipkKumulatif: '3.56',
            totalSks: 18,
            mata_kuliah: [
                { nama: 'Basis Data', bobot: 3, uts: 82, uas: 85, uni: 84, total: 84, grade: 'A-' },
                { nama: 'Sistem Operasi', bobot: 3, uts: 78, uas: 80, uni: 79, total: 79, grade: 'B+' },
                { nama: 'Jaringan Komputer', bobot: 3, uts: 75, uas: 77, uni: 76, total: 76, grade: 'B' },
                { nama: 'Rekayasa Perangkat Lunak', bobot: 3, uts: 85, uas: 88, uni: 87, total: 87, grade: 'A' },
                { nama: 'Analisis Algoritma', bobot: 3, uts: 80, uas: 82, uni: 81, total: 81, grade: 'A-' },
                { nama: 'Interaksi Manusia Komputer', bobot: 3, uts: 78, uas: 80, uni: 79, total: 79, grade: 'B+' }
            ]
        },
        {
            id: 4,
            ipkSemester: '3.62',
            ipkKumulatif: '3.57',
            totalSks: 16,
            mata_kuliah: [
                { nama: 'Pemrograman Web', bobot: 3, uts: 88, uas: 90, uni: 89, total: 89, grade: 'A' },
                { nama: 'Kecerdasan Buatan', bobot: 3, uts: 82, uas: 85, uni: 84, total: 84, grade: 'A-' },
                { nama: 'Grafika Komputer', bobot: 3, uts: 78, uas: 80, uni: 79, total: 79, grade: 'B+' },
                { nama: 'Keamanan Komputer', bobot: 3, uts: 85, uas: 87, uni: 86, total: 86, grade: 'A' },
                { nama: 'Metodologi Penelitian', bobot: 2, uts: 80, uas: 82, uni: 81, total: 81, grade: 'A-' },
                { nama: 'Manajemen Proyek TI', bobot: 2, uts: 75, uas: 77, uni: 76, total: 76, grade: 'B' }
            ]
        },
        {
            id: 5,
            ipkSemester: '3.48',
            ipkKumulatif: '3.54',
            totalSks: 17,
            mata_kuliah: [
                { nama: 'Pemrograman Mobile', bobot: 3, uts: 85, uas: 87, uni: 86, total: 86, grade: 'A' },
                { nama: 'Data Mining', bobot: 3, uts: 80, uas: 82, uni: 81, total: 81, grade: 'A-' },
                { nama: 'Sistem Terdistribusi', bobot: 3, uts: 75, uas: 77, uni: 76, total: 76, grade: 'B' },
                { nama: 'Komputer Vision', bobot: 3, uts: 78, uas: 80, uni: 79, total: 79, grade: 'B+' },
                { nama: 'Wirausaha Teknologi', bobot: 2, uts: 88, uas: 90, uni: 89, total: 89, grade: 'A' },
                { nama: 'Sistem Informasi', bobot: 3, uts: 82, uas: 84, uni: 83, total: 83, grade: 'A-' }
            ]
        },
        {
            id: 6,
            ipkSemester: '3.51',
            ipkKumulatif: '3.53',
            totalSks: 16,
            mata_kuliah: [
                { nama: 'Machine Learning', bobot: 3, uts: 85, uas: 87, uni: 86, total: 86, grade: 'A' },
                { nama: 'Cloud Computing', bobot: 3, uts: 78, uas: 80, uni: 79, total: 79, grade: 'B+' },
                { nama: 'Big Data', bobot: 3, uts: 82, uas: 84, uni: 83, total: 83, grade: 'A-' },
                { nama: 'DevOps', bobot: 3, uts: 75, uas: 77, uni: 76, total: 76, grade: 'B' },
                { nama: 'Blockchain', bobot: 2, uts: 88, uas: 90, uni: 89, total: 89, grade: 'A' },
                { nama: 'IoT', bobot: 2, uts: 80, uas: 82, uni: 81, total: 81, grade: 'A-' }
            ]
        },
        {
            id: 7,
            ipkSemester: '3.58',
            ipkKumulatif: '3.54',
            totalSks: 14,
            mata_kuliah: [
                { nama: 'Kerja Praktek', bobot: 4, uts: 85, uas: 87, uni: 86, total: 86, grade: 'A' },
                { nama: 'Seminar Proposal', bobot: 2, uts: 88, uas: 90, uni: 89, total: 89, grade: 'A' },
                { nama: 'Mata Kuliah Pilihan 1', bobot: 3, uts: 78, uas: 80, uni: 79, total: 79, grade: 'B+' },
                { nama: 'Mata Kuliah Pilihan 2', bobot: 3, uts: 82, uas: 84, uni: 83, total: 83, grade: 'A-' },
                { nama: 'Mata Kuliah Pilihan 3', bobot: 2, uts: 80, uas: 82, uni: 81, total: 81, grade: 'A-' }
            ]
        },
        {
            id: 8,
            ipkSemester: '3.45',
            ipkKumulatif: '3.52',
            totalSks: 15,
            mata_kuliah: [
                { nama: 'Pemrograman Web', bobot: 3, uts: 85, uas: 88, uni: 87, total: 86, grade: 'A' },
                { nama: 'Basis Data', bobot: 3, uts: 78, uas: 82, uni: 80, total: 80, grade: 'B+' },
                { nama: 'Jaringan Komputer', bobot: 3, uts: 75, uas: 79, uni: 77, total: 77, grade: 'B' },
                { nama: 'Struktur Data', bobot: 3, uts: 82, uas: 85, uni: 84, total: 83, grade: 'A-' },
                { nama: 'Sistem Operasi', bobot: 3, uts: 70, uas: 74, uni: 72, total: 72, grade: 'B' }
            ]
        }
    ];

    const getCurrentSemester = () => {
        return semesters.find(s => s.id === activeSemester);
    };

    const getGradeColor = (grade) => {
        const colors = {
            'A': 'bg-green-100 text-green-600',
            'A-': 'bg-green-100 text-green-600',
            'B+': 'bg-blue-100 text-blue-800',
            'B': 'bg-blue-100 text-blue-800',
            'B-': 'bg-yellow-100 text-yellow-800',
            'C+': 'bg-yellow-100 text-yellow-800',
            'C': 'bg-orange-100 text-orange-800',
            'D': 'bg-red-100 text-red-800',
            'E': 'bg-red-100 text-red-800'
        };
        return colors[grade] || 'bg-gray-100 text-gray-700';
    };

    const currentSemester = getCurrentSemester();

    return (
        <MahasiswaLayout title="Nilai">
            <Head title="Nilai Mahasiswa" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Nilai</h1>
                    <p className="text-gray-600">Lihat nilai semester dan transkrip akademik Anda</p>
                </div>

                <div className="mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex flex-wrap gap-2">
                            {semesters.map((semester) => (
                                <button
                                    key={semester.id}
                                    onClick={() => setActiveSemester(semester.id)}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                        activeSemester === semester.id
                                            ? 'text-white bg-blue-600 shadow-sm border border-blue-600'
                                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300'
                                    }`}
                                >
                                    Semester {semester.id}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* IP Semester */}
                    <div className="bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">IP Semester</h3>
                        <div className="flex items-center gap-3">
                            <i className="fas fa-graduation-cap text-xl text-blue-300"></i>
                            <p className="text-lg font-bold text-blue-700">{currentSemester.ipkSemester}</p>
                        </div>
                    </div>

                    {/* IPK Kumulatif */}
                    <div className="bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">IPK Kumulatif</h3>
                        <div className="flex items-center gap-3">
                            <i className="fas fa-star text-xl text-emerald-200"></i>
                            <p className="text-lg font-bold text-emerald-700">{currentSemester.ipkKumulatif}</p>
                        </div>
                    </div>

                    {/* Total SKS */}
                    <div className="bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200 sm:col-span-2 lg:col-span-1">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Total SKS</h3>
                        <div className="flex items-center gap-3">
                            <i className="fas fa-book text-xl text-indigo-300"></i>
                            <p className="text-lg font-bold text-indigo-700">{currentSemester.totalSks}</p>
                        </div>
                    </div>
                </div>

                {/* Grades Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700">Nilai Matakuliah</h3>
                        <p className="text-sm text-gray-600 mt-1">Semester {activeSemester}</p>
                    </div>

                    {/* Mobile Card View */}
                    <div className="block sm:hidden">
                        {currentSemester.mata_kuliah.map((mata_kuliah, index) => (
                            <div key={index} className="border-b border-gray-200 p-4 last:border-b-0">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-gray-900 text-sm pr-2">{mata_kuliah.nama}</h4>
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded-lg flex-shrink-0 ${getGradeColor(mata_kuliah.grade)}`}
                                    >
                                        {mata_kuliah.grade}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div className="flex justify-between">
                                        <span>SKS:</span>
                                        <span className="font-medium">{mata_kuliah.bobot}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tugas:</span>
                                        <span className="font-medium">{mata_kuliah.uts}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>UTS:</span>
                                        <span className="font-medium">{mata_kuliah.uas}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>UAS:</span>
                                        <span className="font-medium">{mata_kuliah.uni}</span>
                                    </div>
                                </div>
                                <div className="mt-2 pt-2 border-t border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-700">Nilai Akhir:</span>
                                        <span className="text-sm font-bold text-gray-900">{mata_kuliah.total}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-gray-50">
                                <tr className="text-gray-600 font-semibold text-xs">
                                    <th className="px-6 py-4 text-left uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Mata Kuliah</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">SKS</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Tugas</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">UTS</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">UAS</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Nilai Akhir</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Nilai Huruf</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentSemester.mata_kuliah.map((mata_kuliah, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{mata_kuliah.nama}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{mata_kuliah.bobot}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 text-center">{mata_kuliah.uts}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 text-center">{mata_kuliah.uas}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 text-center">{mata_kuliah.uni}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700 text-center">{mata_kuliah.total}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${getGradeColor(mata_kuliah.grade)}`}>
                                                {mata_kuliah.grade}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </MahasiswaLayout>
    );
}
