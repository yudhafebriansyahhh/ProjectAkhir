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
                    // Logic untuk menyimpan absensi
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

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Absensi Dosen</h1>
                    <p className="text-gray-600">Kelola absensi kelas yang diajar</p>
                </div>

                {/* Main Content */}
                <div className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
                    <div className="grid lg:grid-cols-5 gap-0">
                        {/* Form Section */}
                        <div className="lg:col-span-2 p-6 border-r border-gray-200 text-sm">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">Data Kelas</h2>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Mata Kuliah</label>
                                    <select
                                        name="mataKuliah"
                                        value={formData.mataKuliah}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-blue-600 transition-all duration-200"
                                    >
                                        <option value="">Pilih Mata Kuliah</option>
                                        <option value="algoritma">Algoritma dan Pemrograman</option>
                                        <option value="database">Basis Data</option>
                                        <option value="web">Pemrograman Web</option>
                                        <option value="mobile">Pemrograman Mobile</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">SKS</label>
                                    <input
                                        type="number"
                                        name="sks"
                                        min="1"
                                        max="6"
                                        placeholder="3"
                                        value={formData.sks}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-blue-600 transition-all duration-200"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Kelas</label>
                                    <select
                                        name="kelas"
                                        value={formData.kelas}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-blue-600 transition-all duration-200"
                                    >
                                        <option value="">Pilih Kelas</option>
                                        <option value="A">Kelas A</option>
                                        <option value="B">Kelas B</option>
                                        <option value="C">Kelas C</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                                        <input
                                            type="date"
                                            name="tanggal"
                                            value={formData.tanggal}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-blue-600 transition-all duration-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Waktu</label>
                                        <input
                                            type="time"
                                            name="waktu"
                                            value={formData.waktu}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-blue-600 transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Materi Pembelajaran</label>
                                    <textarea
                                        name="materi"
                                        rows="4"
                                        placeholder="Masukkan materi yang akan diajarkan..."
                                        value={formData.materi}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-blue-600 transition-all duration-200 resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Student List Section */}
                        <div className="lg:col-span-3 p-6">
                            <h2 className="text-lg font-semibold text-gray-700 flex items-center mb-6">Daftar Mahasiswa</h2>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">No</th>
                                            <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">NIM</th>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama Mahasiswa</th>
                                            <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">Keterangan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {mahasiswa.map((mhs, index) => (
                                            <tr key={mhs.nim} className="hover:bg-gray-50 transition duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{index + 1}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{mhs.nim}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{mhs.nama}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    <div className="inline-flex items-center gap-2">
                                                        <label className="text-gray-600 text-xs font-semibold cursor-pointer">Hadir</label>
                                                        <div className="relative inline-block w-11 h-5">
                                                            <input
                                                                id={`switch-${index}`}
                                                                type="checkbox"
                                                                checked={attendance[mhs.nim]}
                                                                onChange={() => handleAttendanceToggle(mhs.nim)}
                                                                className="peer appearance-none w-11 h-5 rounded-full bg-blue-600 checked:bg-red-600 cursor-pointer transition-colors duration-300"
                                                            />
                                                            <label
                                                                htmlFor={`switch-${index}`}
                                                                className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-gray-700 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-gray-800 cursor-pointer"
                                                            />
                                                        </div>
                                                        <label className="text-gray-600 text-xs font-semibold cursor-pointer">Alpha</label>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Save Button */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={saveAttendance}
                                        className="bg-blue-600 text-white text-sm shadow-sm font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center"
                                    >
                                        <i className="fas fa-save mr-2"></i>
                                        Simpan Absensi
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DosenLayout>
    );
}
