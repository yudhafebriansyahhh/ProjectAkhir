import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import DosenLayout from '@/Layouts/DosenLayout';

export default function Nilai() {
    const [filters, setFilters] = useState({
        prodi: '',
        mataKuliah: '',
        semester: '',
        kelas: ''
    });

    const mahasiswa = [
        { nama: 'Siti Aminah', nim: '2210001', nilai_akhir: 87, nilai_huruf: 'A' },
        { nama: 'Budi Santoso', nim: '2210002', nilai_akhir: 76, nilai_huruf: 'B' },
        { nama: 'Dewi Lestari', nim: '2210003', nilai_akhir: 65, nilai_huruf: 'C' },
        { nama: 'Ahmad Fauzi', nim: '2210004', nilai_akhir: 58, nilai_huruf: 'D' },
        { nama: 'Nina Kartika', nim: '2210005', nilai_akhir: 92, nilai_huruf: 'A' },
    ];

    const [showData, setShowData] = useState(true);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleShowData = (e) => {
        e.preventDefault();

        // Validasi filter
        if (!filters.prodi || !filters.mataKuliah || !filters.semester || !filters.kelas) {
            if (window.Swal) {
                window.Swal.fire({
                    title: 'Filter Tidak Lengkap',
                    text: 'Silakan lengkapi semua filter terlebih dahulu.',
                    icon: 'warning',
                    confirmButtonColor: '#2563eb',
                });
            } else {
                alert('Silakan lengkapi semua filter terlebih dahulu.');
            }
            return;
        }

        setShowData(true);
        console.log('Filters applied:', filters);
    };

    return (
        <DosenLayout title="Nilai">
            <Head title="Nilai">
                <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            </Head>

            <div className="container mx-auto px-4 py-8 max-w-[600px] sm:max-w-full">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Nilai</h1>
                    <p className="text-gray-600">Lakukan Penilaian Pada Tiap Matakuliah yang diampu.</p>
                </div>

                {/* Filter Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-white shadow-sm border border-gray-200 p-6 rounded-xl mb-6">
                    {/* Kolom Kiri */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <label className="w-24 text-gray-700 font-medium">Prodi</label>
                            <select
                                name="prodi"
                                value={filters.prodi}
                                onChange={handleFilterChange}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-blue-600"
                            >
                                <option value="">Pilih Prodi</option>
                                <option value="informatika">Teknik Informatika</option>
                                <option value="sistem-informasi">Sistem Informasi</option>
                                <option value="manajemen">Manajemen Informatika</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="w-24 text-gray-700 font-medium">Mata Kuliah</label>
                            <select
                                name="mataKuliah"
                                value={filters.mataKuliah}
                                onChange={handleFilterChange}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-blue-600"
                            >
                                <option value="">Pilih Mata Kuliah</option>
                                <option value="algoritma">Algoritma</option>
                                <option value="basisdata">Basis Data</option>
                                <option value="pemrograman-web">Pemrograman Web</option>
                                <option value="mobile">Pemrograman Mobile</option>
                            </select>
                        </div>
                    </div>

                    {/* Kolom Kanan */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <label className="w-24 text-gray-700 font-medium">Semester</label>
                            <select
                                name="semester"
                                value={filters.semester}
                                onChange={handleFilterChange}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-blue-600"
                            >
                                <option value="">Pilih Semester</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <option key={i} value={i}>Semester {i}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="w-24 text-gray-700 font-medium">Kelas</label>
                            <select
                                name="kelas"
                                value={filters.kelas}
                                onChange={handleFilterChange}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-blue-600"
                            >
                                <option value="">Pilih Kelas</option>
                                <option value="A">Kelas A</option>
                                <option value="B">Kelas B</option>
                                <option value="C">Kelas C</option>
                                <option value="D">Kelas D</option>
                            </select>
                        </div>
                    </div>

                    {/* Tombol */}
                    <div className="col-span-1 md:col-span-2 flex justify-center pt-2">
                        <button
                            onClick={handleShowData}
                            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm border border-blue-600"
                        >
                            <i className="fa-solid fa-users mr-2"></i> Tampilkan Data Mahasiswa
                        </button>
                    </div>
                </div>

                {/* Grades Table */}
                {showData && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-700">Daftar Mahasiswa</h3>
                            <p className="text-sm text-gray-600 mt-1">Berikut adalah daftar mahasiswa untuk penilaian</p>
                        </div>

                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                                <tr>
                                    <th className="px-6 py-3 text-left">No</th>
                                    <th className="px-6 py-3 text-left">Nama Mahasiswa</th>
                                    <th className="px-6 py-3 text-center">NIM</th>
                                    <th className="px-6 py-3 text-center">Nilai Akhir</th>
                                    <th className="px-6 py-3 text-center">Nilai Huruf</th>
                                    <th className="px-6 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {mahasiswa.map((mhs, index) => (
                                    <tr key={mhs.nim} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                                        <td className="px-6 py-4 text-gray-700">{mhs.nama}</td>
                                        <td className="px-6 py-4 text-center text-gray-700">{mhs.nim}</td>
                                        <td className="px-6 py-4 text-center text-gray-700">{mhs.nilai_akhir}</td>
                                        <td className="px-6 py-4 text-center text-gray-700">
                                            <span className="px-2 py-1 rounded-lg text-xs font-semibold">
                                                {mhs.nilai_huruf}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex gap-2">
                                                <Link
                                                    href={route('dosen.input_nilai')}
                                                    className="px-3 font-semibold py-1.5 text-xs bg-blue-100 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-200 transition flex items-center gap-1"
                                                >
                                                    <i className="fas fa-file-signature"></i> Nilai
                                                </Link>

                                                <Link
                                                    href={route('dosen.edit_nilai')}
                                                    className="px-3 font-semibold py-1.5 text-xs bg-amber-100 text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-200 transition flex items-center gap-1"
                                                >
                                                    <i className="fas fa-pen-to-square"></i> Edit
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DosenLayout>
    );
}
