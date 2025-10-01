import { useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import DosenLayout from '@/Layouts/DosenLayout';

export default function Index() {
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
                labels: ['Pemrograman Web', 'Sistem Operasi', 'Struktur Data'],
                datasets: [{
                    label: 'Rata-rata Nilai',
                    data: [82, 75, 88],
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 2,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
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

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Dashboard</h1>
                    <p className="text-gray-600">
                        Selamat datang <span className="font-bold">Muhammad Raihan</span>. Pantau aktivitas akademik dan informasi
                        pengajaran Anda di sini.
                    </p>
                </div>

                {/* Ringkasan Statistik Kelas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white px-6 py-4 rounded-lg border border-gray-200 shadow-sm">
                        <p className="text-sm font-medium text-gray-600 mb-1">Kelas Diampu</p>
                        <h2 className="text-2xl font-bold text-gray-700">5</h2>
                    </div>
                    <div className="bg-white px-6 py-4 rounded-lg border border-gray-200 shadow-sm">
                        <p className="text-sm font-medium text-gray-600 mb-1">Total Mahasiswa</p>
                        <h2 className="text-2xl font-bold text-gray-700">134</h2>
                    </div>
                    <div className="bg-white px-6 py-4 rounded-lg border border-gray-200 shadow-sm">
                        <p className="text-sm font-medium text-gray-600 mb-1">Pertemuan Minggu Ini</p>
                        <h2 className="text-2xl font-bold text-gray-700">8</h2>
                    </div>
                </div>

                {/* Kelas Diampu & Grafik Nilai Rata-Rata */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Tabel Kelas Diampu */}
                    <div className="lg:col-span-5 px-4 py-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Kelas yang Diampu</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-700">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-semibold">Mata Kuliah</th>
                                        <th className="px-3 py-2 text-center font-semibold">SKS</th>
                                        <th className="px-3 py-2 text-center font-semibold">Kelas</th>
                                        <th className="px-3 py-2 text-center font-semibold">Jadwal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-3 py-2">Pemrograman Web</td>
                                        <td className="px-3 py-2 text-center">3</td>
                                        <td className="px-3 py-2 text-center">A</td>
                                        <td className="px-3 py-2 text-center">
                                            <div className="text-xs">
                                                <div className="font-medium text-gray-800">Senin,</div>
                                                <div className="text-gray-600">10:00 - 12:00</div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2">Sistem Operasi</td>
                                        <td className="px-3 py-2 text-center">3</td>
                                        <td className="px-3 py-2 text-center">B</td>
                                        <td className="px-3 py-2 text-center">
                                            <div className="text-xs">
                                                <div className="font-medium text-gray-800">Selasa,</div>
                                                <div className="text-gray-600">10:00 - 12:00</div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2">Struktur Data</td>
                                        <td className="px-3 py-2 text-center">3</td>
                                        <td className="px-3 py-2 text-center">C</td>
                                        <td className="px-3 py-2 text-center">
                                            <div className="text-xs">
                                                <div className="font-medium text-gray-800">Rabu,</div>
                                                <div className="text-gray-600">10:00 - 12:00</div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Grafik Nilai Rata-Rata */}
                    <div className="lg:col-span-7 px-4 py-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Rata-rata Nilai Mahasiswa</h2>
                        <canvas ref={chartRerataNilaiRef} id="chartRerataNilai" className="w-full h-60"></canvas>
                    </div>
                </div>

                {/* Jadwal Hari Ini */}
                <div className="bg-white px-6 py-4 rounded-lg border border-gray-200 shadow-sm my-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">Jadwal Hari Ini</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-700">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2 text-left">Mata Kuliah</th>
                                    <th className="px-3 py-2 text-center">Waktu</th>
                                    <th className="px-3 py-2 text-center">Ruangan</th>
                                    <th className="px-3 py-2 text-center">Kelas</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-300">
                                    <td className="px-3 py-2">Pemrograman Web</td>
                                    <td className="px-3 py-2 text-center">08:00 - 10:00</td>
                                    <td className="px-3 py-2 text-center">Lab A</td>
                                    <td className="px-3 py-2 text-center">A</td>
                                </tr>
                                <tr className="border-b border-gray-300">
                                    <td className="px-3 py-2">Sistem Operasi</td>
                                    <td className="px-3 py-2 text-center">13:00 - 15:00</td>
                                    <td className="px-3 py-2 text-center">Lab B</td>
                                    <td className="px-3 py-2 text-center">B</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DosenLayout>
    );
}
