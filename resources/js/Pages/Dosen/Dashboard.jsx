import { useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import DosenLayout from '@/Layouts/DosenLayout';

export default function Index({ dosen, stats, daftar_kelas, jadwal_hari_ini, grafik_nilai }) {
    const chartRerataNilaiRef = useRef(null);
    const chartRerataNilaiInstance = useRef(null);

    const initCharts = () => {
        if (!window.Chart || !chartRerataNilaiRef.current) return;

        if (chartRerataNilaiInstance.current) {
            chartRerataNilaiInstance.current.destroy();
        }

        const ctx = chartRerataNilaiRef.current.getContext('2d');
        chartRerataNilaiInstance.current = new window.Chart(ctx, {
            type: 'bar',
            data: {
                labels: grafik_nilai.labels.length > 0 ? grafik_nilai.labels : ['Belum Ada Kelas'],
                datasets: [{
                    label: 'Rata-rata Nilai',
                    data: grafik_nilai.data.length > 0 ? grafik_nilai.data : [0],
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(37, 99, 235, 0.8)',
                        'rgba(29, 78, 216, 0.8)',
                        'rgba(30, 64, 175, 0.8)',
                        'rgba(30, 58, 138, 0.8)'
                    ],
                    borderColor: [
                        'rgb(59, 130, 246)',
                        'rgb(37, 99, 235)',
                        'rgb(29, 78, 216)',
                        'rgb(30, 64, 175)',
                        'rgb(30, 58, 138)'
                    ],
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    };

    useEffect(() => {
        const checkChartJS = setInterval(() => {
            if (window.Chart) {
                clearInterval(checkChartJS);
                setTimeout(() => {
                    initCharts();
                }, 100);
            }
        }, 100);

        const timeout = setTimeout(() => {
            clearInterval(checkChartJS);
        }, 5000);

        return () => {
            clearInterval(checkChartJS);
            clearTimeout(timeout);
            if (chartRerataNilaiInstance.current) {
                chartRerataNilaiInstance.current.destroy();
            }
        };
    }, []);

    return (
        <DosenLayout title="Dashboard">
            <Head title="Dashboard Dosen">
                <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
                <div className="container mx-auto px-4 py-8">
                    
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                                <i className="fas fa-chart-line text-white text-2xl"></i>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                                <p className="text-gray-600 mt-1">
                                    Selamat datang <span className="font-bold text-blue-600">{dosen.nama}</span>. Pantau aktivitas akademik dan informasi pengajaran Anda di sini.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-600">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Kelas Diampu</p>
                                    <h2 className="text-3xl font-bold text-gray-800">{stats.total_kelas}</h2>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <i className="fas fa-chalkboard-teacher text-blue-600 text-xl"></i>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Mahasiswa</p>
                                    <h2 className="text-3xl font-bold text-gray-800">{stats.total_mahasiswa}</h2>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <i className="fas fa-users text-blue-500 text-xl"></i>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Pertemuan Minggu Ini</p>
                                    <h2 className="text-3xl font-bold text-gray-800">{stats.pertemuan_minggu_ini}</h2>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <i className="fas fa-calendar-check text-blue-700 text-xl"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kelas Diampu & Grafik Nilai */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                        
                        {/* Tabel Kelas Diampu */}
                        <div className="lg:col-span-5 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                    <i className="fas fa-book-open text-gray-700"></i>
                                    <h2 className="text-lg font-bold text-gray-800">Kelas yang Diampu</h2>
                                </div>
                            </div>
                            
                            <div className="p-4">
                                <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                                    <table className="w-full text-sm relative">
                                        <thead className="sticky top-0 z-10">
                                            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 shadow-sm">
                                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase bg-gray-50">Mata Kuliah</th>
                                                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase bg-gray-50">SKS</th>
                                                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase bg-gray-50">Kelas</th>
                                                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase bg-gray-50">Jadwal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {daftar_kelas.length > 0 ? (
                                                daftar_kelas.map((kelas, index) => (
                                                    <tr key={index} className="hover:bg-blue-50 transition-colors">
                                                        <td className="px-4 py-3 font-medium text-gray-800">{kelas.mata_kuliah}</td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">{kelas.sks} SKS</span>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">{kelas.nama_kelas}</span>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <div className="text-xs">
                                                                <div className="font-semibold text-gray-800">{kelas.hari}</div>
                                                                <div className="text-gray-600">{kelas.waktu}</div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="px-4 py-6 text-center text-gray-500 text-sm">
                                                        Belum ada kelas yang diampu pada semester ini.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Grafik Nilai Rata-Rata */}
                        <div className="lg:col-span-7 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                    <i className="fas fa-chart-bar text-gray-700"></i>
                                    <h2 className="text-lg font-bold text-gray-800">Rata-rata Nilai Mahasiswa</h2>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="h-64">
                                    <canvas ref={chartRerataNilaiRef} id="chartRerataNilai"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Jadwal Hari Ini */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <i className="fas fa-calendar-day text-gray-700"></i>
                                <h2 className="text-lg font-bold text-gray-800">Jadwal Hari Ini</h2>
                            </div>
                        </div>
                        
                        <div className="p-4">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Mata Kuliah</th>
                                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Waktu</th>
                                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Ruangan</th>
                                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Kelas</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {jadwal_hari_ini.length > 0 ? (
                                            jadwal_hari_ini.map((kelas, index) => (
                                                <tr key={index} className="hover:bg-blue-50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-gray-800">{kelas.mata_kuliah}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <i className="far fa-clock text-gray-400 text-xs"></i>
                                                            <span className="text-gray-700">{kelas.waktu}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <i className="fas fa-door-open text-gray-400 text-xs"></i>
                                                            <span className="text-gray-700">{kelas.ruangan}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">{kelas.nama_kelas}</span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                    <div className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                                                        <i className="fas fa-mug-hot text-xl text-gray-400"></i>
                                                    </div>
                                                    <p className="font-medium text-gray-600">Tidak ada jadwal mengajar hari ini.</p>
                                                    <p className="text-sm mt-1">Waktunya istirahat atau fokus pada penelitian.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </DosenLayout>
    );
}