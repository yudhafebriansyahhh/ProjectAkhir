import { useState } from 'react';
import { Head } from '@inertiajs/react';
import DosenLayout from '@/Layouts/DosenLayout';

export default function Absensi() {
    const [formData, setFormData] = useState({
        mataKuliah: '',
        sks: '',
        kelas: '',
        tanggal: '2025-06-23',
        waktu: '08:00',
        materi: ''
    });

    const mahasiswa = [
        { nim: "23456789", nama: "Siti Aminah" },
        { nim: "34567890", nama: "Budi Santoso" },
        { nim: "45678901", nama: "Dewi Lestari" },
        { nim: "56789012", nama: "Ahmad Fauzi" },
        { nim: "64364366", nama: "Otong Surotong" },
        { nim: "43336436", nama: "Ucup Surucup" },
    ];

    const [attendance, setAttendance] = useState(
        mahasiswa.reduce((acc, mhs) => {
            acc[mhs.nim] = false; // false = hadir, true = alpha
            return acc;
        }, {})
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAttendanceToggle = (nim) => {
        setAttendance(prev => ({
            ...prev,
            [nim]: !prev[nim]
        }));
    };

    const handleSelectAll = (status) => {
        const newAttendance = {};
        mahasiswa.forEach(mhs => {
            newAttendance[mhs.nim] = status; // true = alpha, false = hadir
        });
        setAttendance(newAttendance);
    };

    // Calculate statistics
    const totalHadir = Object.values(attendance).filter(val => !val).length;
    const totalAlpha = Object.values(attendance).filter(val => val).length;
    const persentaseKehadiran = Math.round((totalHadir / mahasiswa.length) * 100);

    const saveAttendance = () => {
        if (window.Swal) {
            window.Swal.fire({
                title: 'Simpan Absensi?',
                text: "Data absensi akan disimpan.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Ya, Simpan',
                cancelButtonText: 'Batal',
                confirmButtonColor: '#2563eb',
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log('Form Data:', formData);
                    console.log('Attendance Data:', attendance);

                    window.Swal.fire({
                        title: 'Berhasil!',
                        text: 'Data absensi berhasil disimpan.',
                        icon: 'success',
                        confirmButtonColor: '#2563eb',
                    });
                }
            });
        } else {
            if (confirm('Simpan data absensi?')) {
                console.log('Form Data:', formData);
                console.log('Attendance Data:', attendance);
                alert('Data absensi berhasil disimpan.');
            }
        }
    };

    return (
        <DosenLayout title="Absensi">
            <Head title="Absensi Dosen">
                <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            </Head>

            <div className="container mx-auto px-4 py-8 max-w-[600px] sm:max-w-full">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Absensi Mahasiswa</h1>
                    <p className="text-gray-600">
                        Kelola dan catat kehadiran mahasiswa di kelas Anda.
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Hadir</p>
                                <p className="text-3xl font-bold text-gray-800">{totalHadir}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <i className="fas fa-check-circle text-green-600 text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-red-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Alpha</p>
                                <p className="text-3xl font-bold text-gray-800">{totalAlpha}</p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-lg">
                                <i className="fas fa-times-circle text-red-600 text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Persentase Hadir</p>
                                <p className="text-3xl font-bold text-gray-800">{persentaseKehadiran}%</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <i className="fas fa-chart-bar text-blue-600 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    <div className="grid lg:grid-cols-5 gap-0">
                        {/* Form Section */}
                        <div className="lg:col-span-2 p-6 border-r border-gray-200 bg-gray-50">
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-700">Data Kelas</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Mata Kuliah
                                    </label>
                                    <select
                                        name="mataKuliah"
                                        value={formData.mataKuliah}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Pilih Mata Kuliah</option>
                                        <option value="algoritma">Algoritma dan Pemrograman</option>
                                        <option value="database">Basis Data</option>
                                        <option value="web">Pemrograman Web</option>
                                        <option value="mobile">Pemrograman Mobile</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            SKS
                                        </label>
                                        <input
                                            type="number"
                                            name="sks"
                                            min="1"
                                            max="6"
                                            placeholder="3"
                                            value={formData.sks}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Kelas
                                        </label>
                                        <select
                                            name="kelas"
                                            value={formData.kelas}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Pilih</option>
                                            <option value="A">Kelas A</option>
                                            <option value="B">Kelas B</option>
                                            <option value="C">Kelas C</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Tanggal
                                        </label>
                                        <input
                                            type="date"
                                            name="tanggal"
                                            value={formData.tanggal}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Waktu
                                        </label>
                                        <input
                                            type="time"
                                            name="waktu"
                                            value={formData.waktu}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Materi Pembelajaran
                                    </label>
                                    <textarea
                                        name="materi"
                                        rows="5"
                                        placeholder="Masukkan materi yang akan diajarkan hari ini..."
                                        value={formData.materi}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Student List Section */}
                        <div className="lg:col-span-3 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-700">Daftar Mahasiswa</h2>

                                {/* Quick Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleSelectAll(false)}
                                        className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200 transition-colors"
                                    >
                                        <i className="fas fa-check mr-1"></i>
                                        Semua Hadir
                                    </button>
                                    <button
                                        onClick={() => handleSelectAll(true)}
                                        className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200 transition-colors"
                                    >
                                        <i className="fas fa-times mr-1"></i>
                                        Semua Alpha
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr className="text-gray-600 font-semibold text-xs">
                                            <th className="px-6 py-4 text-left">No</th>
                                            <th className="px-6 py-4 text-left">NIM</th>
                                            <th className="px-6 py-4 text-left">Nama Mahasiswa</th>
                                            <th className="px-6 py-4 text-center">Keterangan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {mahasiswa.map((mhs, index) => (
                                            <tr key={mhs.nim} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm">{index + 1}</td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold">
                                                        {mhs.nim}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                                    {mhs.nama}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <span className={`text-xs font-medium ${!attendance[mhs.nim] ? 'text-green-600' : 'text-gray-400'}`}>
                                                            Hadir
                                                        </span>
                                                        <div className="relative inline-block">
                                                            <input
                                                                id={`switch-${index}`}
                                                                type="checkbox"
                                                                checked={attendance[mhs.nim]}
                                                                onChange={() => handleAttendanceToggle(mhs.nim)}
                                                                className="peer appearance-none w-12 h-6 rounded-full bg-green-500 checked:bg-red-500 cursor-pointer transition-all duration-300"
                                                            />
                                                            <label
                                                                htmlFor={`switch-${index}`}
                                                                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 peer-checked:translate-x-6 cursor-pointer"
                                                            />
                                                        </div>
                                                        <span className={`text-xs font-medium ${attendance[mhs.nim] ? 'text-red-600' : 'text-gray-400'}`}>
                                                            Alpha
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Save Button */}
                            <div className="mt-6 flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    <i className="fas fa-info-circle mr-1"></i>
                                    <span className="font-medium">{mahasiswa.length}</span> mahasiswa terdaftar
                                </div>
                                <button
                                    type="button"
                                    onClick={saveAttendance}
                                    className="inline-flex items-center px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                                >
                                    <i className="fas fa-save mr-2"></i>
                                    Simpan Absensi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DosenLayout>
    );
}