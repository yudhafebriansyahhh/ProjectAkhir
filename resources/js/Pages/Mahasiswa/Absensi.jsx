import { Head } from '@inertiajs/react';
import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import { useState } from 'react';

export default function Absensi() {
    const [activeSemester, setActiveSemester] = useState(1);

    const semesters = [
        {
            id: 1,
            totalSks: 21,
            mata_kuliah: [
                { nama: 'Algoritma Pemrograman', sks: 3, kelas: "A", persen: 92 },
                { nama: 'Matematika Diskrit', sks: 3, kelas: "A", persen: 85 },
                { nama: 'Sistem Digital', sks: 3, kelas: "A", persen: 75 },
                { nama: 'Bahasa Inggris', sks: 3, kelas: "A", persen: 60 },
                { nama: 'Pancasila', sks: 3, kelas: "A", persen: 45 },
                { nama: 'Pengantar Teknologi Informasi', sks: 3, kelas: "A", persen: 30 },
                { nama: 'Kalkulus I', sks: 3, kelas: "A", persen: 15 }
            ]
        },
        {
            id: 2,
            totalSks: 18,
            mata_kuliah: [
                { nama: 'Struktur Data', sks: 3, kelas: "A", persen: 95 },
                { nama: 'Basis Data', sks: 3, kelas: "A", persen: 88 },
                { nama: 'Jaringan Komputer', sks: 3, kelas: "A", persen: 70 },
                { nama: 'Etika Profesi', sks: 3, kelas: "A", persen: 50 },
                { nama: 'Kalkulus II', sks: 3, kelas: "A", persen: 35 },
                { nama: 'Pemrograman Web', sks: 3, kelas: "A", persen: 20 }
            ]
        },
        {
            id: 3,
            totalSks: 18,
            mata_kuliah: [
                { nama: 'Analisis Algoritma', sks: 3, kelas: "A", persen: 97 },
                { nama: 'Sistem Operasi', sks: 3, kelas: "A", persen: 87 },
                { nama: 'Pemrograman Mobile', sks: 3, kelas: "A", persen: 78 },
                { nama: 'Interaksi Manusia dan Komputer', sks: 3, kelas: "A", persen: 62 },
                { nama: 'Kecerdasan Buatan', sks: 3, kelas: "A", persen: 40 },
                { nama: 'Rekayasa Perangkat Lunak', sks: 3, kelas: "A", persen: 25 }
            ]
        },
        {
            id: 4,
            totalSks: 18,
            mata_kuliah: [
                { nama: 'Pemrograman Lanjut', sks: 3, kelas: "A", persen: 99 },
                { nama: 'Sistem Terdistribusi', sks: 3, kelas: "A", persen: 90 },
                { nama: 'Keamanan Informasi', sks: 3, kelas: "A", persen: 68 },
                { nama: 'Komputasi Awan', sks: 3, kelas: "A", persen: 55 },
                { nama: 'Manajemen Proyek TI', sks: 3, kelas: "A", persen: 32 },
                { nama: 'Data Mining', sks: 3, kelas: "A", persen: 10 }
            ]
        },
    ];

    const getCurrentSemester = () => {
        return semesters.find(s => s.id === activeSemester);
    };

    const getKehadiranColorByPersen = (persen) => {
        if (persen >= 70) return 'text-green-600';
        return 'text-red-600';
    };

    return (
        <MahasiswaLayout title="Absensi">
            <Head title="Absensi" />

            <div className="container mx-auto px-4 py-8 max-w-[600px] sm:max-w-full">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Absensi</h1>
                    <p className="text-gray-600">Pantau kehadiran Anda di setiap mata kuliah dan pastikan memenuhi syarat minimal kehadiran.</p>
                </div>

                <div className="mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex flex-wrap gap-2">
                            {semesters.map((semester) => (
                                <button
                                    key={semester.id}
                                    onClick={() => setActiveSemester(semester.id)}
                                    className={
                                        activeSemester === semester.id
                                            ? 'px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm border border-blue-600'
                                            : 'px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all duration-200'
                                    }
                                >
                                    Semester {semester.id}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Grades Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700">Absensi Kuliah</h3>
                        <p className="text-sm text-gray-600 mt-1">Semester 1 (Ganjil 2024/2025)</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr className="text-gray-600 font-semibold text-xs">
                                    <th className="px-6 py-3 text-start uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Mata Kuliah</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Dosen</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">SKS</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Kelas</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Kehadiran</th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {getCurrentSemester().mata_kuliah.map((mata_kuliah, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                            {mata_kuliah.nama}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            Dr. Joko Widodo, M.Kom
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-700">
                                            {mata_kuliah.sks}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-medium">
                                                {mata_kuliah.kelas}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                                            <span className={`px-2 py-1 font-semibold ${getKehadiranColorByPersen(mata_kuliah.persen)}`}>
                                                {mata_kuliah.persen}%
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
