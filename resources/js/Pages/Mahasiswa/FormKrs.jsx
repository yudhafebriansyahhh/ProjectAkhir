import { Head } from '@inertiajs/react';
import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import { useState } from 'react';

export default function FormKrs() {
    const [openSemester, setOpenSemester] = useState(null);

    const toggleSemester = (semester) => {
        setOpenSemester(openSemester === semester ? null : semester);
    };

    const courses = {
        1: [
            ['IF101', 'Algoritma dan Pemrograman', 'Senin 08:00-10:00', 3],
            ['IF102', 'Matematika Diskrit', 'Selasa 10:00-12:00', 3],
            ['IF103', 'Pengantar Teknologi Informasi', 'Rabu 08:00-09:30', 2],
            ['IF104', 'Bahasa Inggris', 'Kamis 13:00-14:30', 2],
            ['IF105', 'Pancasila', 'Jumat 08:00-09:30', 2]
        ],
        2: [
            ['IF201', 'Struktur Data', 'Senin 10:00-12:00', 3],
            ['IF202', 'Pemrograman Berorientasi Objek', 'Selasa 08:00-10:00', 3],
            ['IF203', 'Matematika Numerik', 'Rabu 10:00-12:00', 3],
            ['IF204', 'Sistem Digital', 'Kamis 08:00-10:00', 3]
        ],
        3: [
            ['IF301', 'Basis Data', 'Senin 08:00-10:00', 3],
            ['IF302', 'Analisis dan Desain Algoritma', 'Selasa 10:00-12:00', 3],
            ['IF303', 'Rekayasa Perangkat Lunak', 'Rabu 08:00-10:00', 3],
            ['IF304', 'Jaringan Komputer', 'Kamis 10:00-12:00', 3]
        ]
    };

    const getDefaultCourses = (semester) => [
        [`IF${semester}01`, `Mata Kuliah ${semester}.1`, 'Senin 08:00-10:00', 3],
        [`IF${semester}02`, `Mata Kuliah ${semester}.2`, 'Selasa 10:00-12:00', 3],
        [`IF${semester}03`, `Mata Kuliah ${semester}.3`, 'Rabu 08:00-10:00', 2]
    ];

    const getSemesterDescription = (semester) => {
        if (semester === 1) return 'Mata kuliah dasar - Pengenalan pemrograman dan matematika';
        if (semester === 2) return 'Mata kuliah dasar - Struktur data dan algoritma lanjutan';
        if (semester === 3) return 'Mata kuliah inti - Pemrograman berorientasi objek';
        if (semester === 4) return 'Mata kuliah inti - Database dan sistem informasi';
        if (semester <= 6) return 'Mata kuliah lanjutan - Spesialisasi bidang';
        return 'Mata kuliah pilihan dan tugas akhir';
    };

    const semesters = Array.from({ length: 8 }, (_, i) => i + 1);

    return (
        <MahasiswaLayout title="Pengisian Kartu Rencana Studi (KRS)">
            <Head title="Pengisian Kartu Rencana Studi (KRS)" />

            <div className="container max-w-6xl mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Pengisian Kartu Rencana Studi (KRS)</h1>
                    <p className="text-gray-600">Pilih mata kuliah yang ingin diambil pada semester ini. Pastikan total SKS sesuai dengan ketentuan akademik.</p>
                </div>

                {/* Semester Packages */}
                {semesters.map((semester) => {
                    const semesterCourses = courses[semester] || getDefaultCourses(semester);
                    const isOpen = openSemester === semester;

                    return (
                        <div key={semester} className="relative mb-4 text-sm">
                            {/* Semester Header */}
                            <div
                                onClick={() => toggleSemester(semester)}
                                className="bg-white py-2 px-4 border border-gray-200 rounded-lg shadow-sm flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                                <h2 className="font-medium text-gray-700">Paket Semester {semester}</h2>

                                <svg
                                    className={`w-5 h-5 transition-transform duration-200 text-gray-500 ${isOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            {/* Semester Content */}
                            {isOpen && (
                                <div className="mt-2 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-all duration-200">
                                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                        <h3 className="text-lg font-semibold text-gray-700">Semester {semester}</h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {getSemesterDescription(semester)}
                                        </p>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr className="text-gray-600 font-semibold text-xs">
                                                    <th className="px-6 py-3 text-left uppercase tracking-wider w-16">No</th>
                                                    <th className="px-6 py-3 text-left uppercase tracking-wider w-20">Kode</th>
                                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Mata Kuliah</th>
                                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Jadwal</th>
                                                    <th className="px-6 py-3 uppercase tracking-wider w-16 text-center">SKS</th>
                                                    <th className="px-6 py-3 uppercase tracking-wider w-24 text-center">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {semesterCourses.map((course, index) => (
                                                    <tr
                                                        key={course[0]}
                                                        data-course-id={course[0]}
                                                        data-sks={course[3]}
                                                        className="hover:bg-gray-50 transition-colors duration-150">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{index + 1}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                                                            {course[0]}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-700">{course[1]}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-500">{course[2]}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center font-medium">
                                                            {course[3]}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                            <button
                                                                className="btn-pilih inline-flex items-center px-3 py-1.5 border border-green-300 text-green-700 bg-green-50 hover:bg-green-100 rounded-lg text-xs font-semibold transition-all duration-200 transform hover:scale-105">
                                                                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                                </svg>
                                                                Pilih
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Action Buttons */}
                <div className="mt-8 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">Catatan:</span> Maksimal 24 SKS per semester
                    </div>
                    <div className="flex gap-3">
                        <a href="/mahasiswa/krs"
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all duration-200">
                            <i className="fa-solid fa-xmark mr-2"></i>
                            Batal
                        </a>
                        <a href="/mahasiswa/krs"
                            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all duration-200 transform disabled:opacity-50 disabled:cursor-not-allowed">
                            <i className="fas fa-check mr-2"></i>
                            Simpan KRS
                        </a>
                    </div>
                </div>
            </div>
        </MahasiswaLayout>
    );
}
