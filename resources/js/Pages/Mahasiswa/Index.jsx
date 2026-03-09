import { useEffect, useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import MahasiswaLayout from '@/Layouts/MahasiswaLayout';

export default function Index({ ipData = [], sksData = [], attendanceData = [], currentIpk = "0.00" }) {
    const { auth } = usePage().props;
    const ipChartRef = useRef(null);
    const sksChartRef = useRef(null);
    const ipChartInstance = useRef(null);
    const sksChartInstance = useRef(null);

    const initCharts = () => {
        // Cek apakah Chart.js sudah loaded
        if (!window.Chart) {
            console.error('Chart.js belum loaded');
            return;
        }

        // Cek apakah canvas element sudah ada
        if (!ipChartRef.current || !sksChartRef.current) {
            console.error('Canvas element belum tersedia');
            return;
        }

        try {
            // Destroy existing charts jika ada
            if (ipChartInstance.current) {
                ipChartInstance.current.destroy();
            }
            if (sksChartInstance.current) {
                sksChartInstance.current.destroy();
            }

            // IP Chart
            const ipCtx = ipChartRef.current.getContext('2d');
            const semesterLabels = ipData.map((_, i) => `Sem ${i + 1}`);

            ipChartInstance.current = new window.Chart(ipCtx, {
                type: 'line',
                data: {
                    labels: semesterLabels,
                    datasets: [{
                        label: 'IP Per Semester',
                        data: ipData,
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: 'rgb(59, 130, 246)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 6
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
                            beginAtZero: false,
                            min: 3.0,
                            max: 4.0,
                            ticks: {
                                stepSize: 0.1
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

            // SKS Chart
            const sksCtx = sksChartRef.current.getContext('2d');
            const sksLabels = sksData.map((_, i) => `Sem ${i + 1}`);

            sksChartInstance.current = new window.Chart(sksCtx, {
                type: 'bar',
                data: {
                    labels: sksLabels,
                    datasets: [{
                        label: 'Jumlah SKS',
                        data: sksData,
                        backgroundColor: 'rgba(59, 130, 246, 0.8)',
                        borderColor: 'rgb(59, 130, 246)',
                        borderWidth: 2,
                        borderRadius: 4
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
                            max: 25,
                            ticks: {
                                stepSize: 5
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

            console.log('Charts berhasil diinisialisasi');
        } catch (error) {
            console.error('Error saat membuat chart:', error);
        }
    };

    useEffect(() => {
        // Tunggu hingga Chart.js loaded
        const checkChartJS = setInterval(() => {
            if (window.Chart) {
                clearInterval(checkChartJS);
                // Delay sedikit untuk memastikan DOM sudah siap
                setTimeout(() => {
                    initCharts();
                }, 100);
            }
        }, 100);

        // Cleanup after 5 seconds jika Chart.js tidak loaded
        const timeout = setTimeout(() => {
            clearInterval(checkChartJS);
            if (!window.Chart) {
                console.error('Chart.js gagal dimuat setelah 5 detik');
            }
        }, 5000);

        return () => {
            clearInterval(checkChartJS);
            clearTimeout(timeout);
            if (ipChartInstance.current) ipChartInstance.current.destroy();
            if (sksChartInstance.current) sksChartInstance.current.destroy();
        };
    }, []);

    return (
        <MahasiswaLayout title="Dashboard">
            <Head title="Dashboard Mahasiswa">
                <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
            </Head>

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Dashboard</h1>
                    <p className="text-gray-600">
                        Selamat datang <span className="font-bold">{auth?.user?.name || 'Mahasiswa'}</span>. Pantau ringkasan akademik dan informasi terkini Anda.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    {/* IPK Card */}
                    <div className="bg-white px-6 py-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="text-start">
                            <div className="flex items-center gap-2 mb-2">
                                <i className="fa-solid fa-medal text-3xl text-blue-600"></i>
                                <h1 className="text-3xl text-gray-700 font-bold">{currentIpk}</h1>
                            </div>
                            <p className="text-lg font-semibold text-gray-700 mb-1">Indeks Prestasi Kumulatif</p>
                            <p className="text-sm text-gray-600">
                                Total SKS Diambil <span className="font-bold text-blue-600">{sksData.reduce((acc, curr) => acc + parseInt(curr || 0, 10), 0)}</span>
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        <div className="col-span-full px-4 py-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Perkembangan Studi Per Semester - IP</h2>
                            <div className="relative h-64">
                                <canvas ref={ipChartRef} id="ipChart"></canvas>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        {/* SKS Chart */}
                        <div className="col-span-full lg:col-span-5 px-4 py-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Grafik Jumlah SKS per Semester</h2>
                            <div className="relative h-64">
                                <canvas ref={sksChartRef} id="sksChart"></canvas>
                            </div>
                        </div>

                        <div className="col-span-full lg:col-span-7 px-4 py-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Informasi Absensi</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm min-w-[600px]">
                                    <thead className="bg-gray-50 text-gray-700">
                                        <tr>
                                            <th className="px-3 py-2 text-left font-semibold">Mata Kuliah</th>
                                            <th className="px-3 py-2 text-center font-semibold">SKS</th>
                                            <th className="px-3 py-2 text-center font-semibold">Kelas</th>
                                            <th className="px-3 py-2 text-center font-semibold">Persentase</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {attendanceData.length > 0 ? attendanceData.map((attendance, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="text-gray-700 px-3 py-2 font-semibold">{attendance.mataKuliah}</td>
                                                <td className="text-gray-700 px-3 py-2 text-center">{attendance.sks}</td>
                                                <td className="text-gray-700 px-3 py-2 text-center">{attendance.kelas}</td>
                                                <td className="text-gray-700 px-3 py-2 text-center">
                                                    <span
                                                        className={`font-semibold ${
                                                            attendance.persentase >= 75
                                                                ? 'text-green-600'
                                                                : 'text-red-600'
                                                        }`}
                                                    >
                                                        {attendance.persentase}%
                                                    </span>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="px-3 py-4 text-center text-sm text-gray-500">
                                                    Tidak ada data absensi untuk semester berjalan.
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
        </MahasiswaLayout>
    );
}
