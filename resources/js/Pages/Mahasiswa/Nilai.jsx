import { useState } from 'react';
import { Head } from '@inertiajs/react';
import MahasiswaLayout from '@/Layouts/MahasiswaLayout';

export default function Nilai({ semesters = [] }) {
    // Default to latest semester available, or null if no semesters exist
    const [activeSemester, setActiveSemester] = useState(semesters.length > 0 ? semesters[semesters.length - 1].id : null);

    const getCurrentSemester = () => {
        return semesters.find(s => s.id === activeSemester) || null;
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
                {currentSemester ? (
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
                ) : (
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6 flex gap-3 text-blue-700">
                        <i className="fa-solid fa-circle-info mt-1"></i>
                        <p>Ups! Belum ada data nilai akademik untuk Anda sejauh ini.</p>
                    </div>
                )}

                {/* Grades Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700">Nilai Matakuliah</h3>
                        <p className="text-sm text-gray-600 mt-1">Semester {activeSemester}</p>
                    </div>

                    {/* Mobile Card View */}
                    <div className="block sm:hidden">
                        {currentSemester && currentSemester.mata_kuliah.map((mata_kuliah, index) => (
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
                                        <span className="font-medium">{mata_kuliah.tugas}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>UTS:</span>
                                        <span className="font-medium">{mata_kuliah.uts}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>UAS:</span>
                                        <span className="font-medium">{mata_kuliah.uas}</span>
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
                                {currentSemester && currentSemester.mata_kuliah.map((mata_kuliah, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{mata_kuliah.nama}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{mata_kuliah.bobot}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 text-center">{mata_kuliah.tugas}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 text-center">{mata_kuliah.uts}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 text-center">{mata_kuliah.uas}</td>
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
