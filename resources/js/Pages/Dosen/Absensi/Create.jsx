import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import DosenLayout from '@/Layouts/DosenLayout';
import Swal from 'sweetalert2';

export default function AbsensiCreate({ kelas, mahasiswa, totalPertemuan }) {
    // Safely access nested properties
    const mataKuliahPeriode = kelas?.mataKuliahPeriode || {};
    const mataKuliah = mataKuliahPeriode?.mataKuliah || {};

    const namaMatkul = mataKuliah?.nama_matkul || 'Mata Kuliah';
    const kodeMatkul = mataKuliah?.kode_matkul || '-';
    const sks = mataKuliah?.sks || 0;
    const namaKelas = kelas?.nama_kelas || '-';
    const idMkPeriode = kelas?.id_mk_periode || '';
    const idKelas = kelas?.id_kelas || '';
    const jamMulai = kelas?.jam_mulai || '08:00';
    const jamSelesai = kelas?.jam_selesai || '10:00';

    // Safely handle mahasiswa array
    const mahasiswaList = Array.isArray(mahasiswa) ? mahasiswa : [];

    const { data, setData, post, processing } = useForm({
        id_kelas: idKelas,
        pertemuan_ke: (totalPertemuan || 0) + 1,
        tanggal: new Date().toISOString().split('T')[0],
        topik_pembahasan: '',
        mahasiswa: mahasiswaList.map(mhs => ({
            id_mahasiswa: mhs?.id_mahasiswa || '',
            nim: mhs?.nim || '',
            nama: mhs?.nama || '',
            status: 'hadir',
        })),
    });

    const handleStatusChange = (idMahasiswa) => {
        const updatedMahasiswa = data.mahasiswa.map(mhs =>
            mhs.id_mahasiswa === idMahasiswa
                ? { ...mhs, status: mhs.status === 'alpha' ? 'hadir' : 'alpha' }
                : mhs
        );
        setData('mahasiswa', updatedMahasiswa);
    };

    const handleSelectAll = (isAlpha) => {
        const updatedMahasiswa = data.mahasiswa.map(mhs => ({
            ...mhs,
            status: isAlpha ? 'alpha' : 'hadir',
        }));
        setData('mahasiswa', updatedMahasiswa);
    };

    const handleSubmit = () => {
        if (!data.mahasiswa.length) {
            Swal.fire('Error', 'Tidak ada mahasiswa yang terdaftar!', 'error');
            return;
        }

        if (!data.tanggal) {
            Swal.fire('Error', 'Tanggal belum diisi!', 'error');
            return;
        }

        if (!data.topik_pembahasan) {
            Swal.fire('Error', 'Materi pembelajaran belum diisi!', 'error');
            return;
        }

        Swal.fire({
            title: 'Simpan Absensi?',
            text: 'Data absensi akan disimpan.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Simpan',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#2563eb',
        }).then((result) => {
            if (result.isConfirmed) {
                post(route('dosen.absensi.store'), {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Berhasil!',
                            text: 'Data absensi berhasil disimpan.',
                            icon: 'success',
                            confirmButtonColor: '#2563eb',
                        });
                    },
                    onError: (errors) => {
                        let errorMessage = 'Terjadi kesalahan';
                        if (errors.pertemuan_ke) {
                            errorMessage = errors.pertemuan_ke;
                        } else if (errors.topik_pembahasan) {
                            errorMessage = errors.topik_pembahasan;
                        } else if (errors.mahasiswa) {
                            errorMessage = errors.mahasiswa;
                        } else if (typeof errors === 'object') {
                            errorMessage = Object.values(errors).flat().join(', ');
                        }
                        Swal.fire('Gagal!', errorMessage, 'error');
                    }
                });
            }
        });
    };

    const totalHadir = data.mahasiswa.filter(m => m.status === 'hadir').length;
    const totalAlpha = data.mahasiswa.filter(m => m.status === 'alpha').length;
    const persentaseKehadiran = data.mahasiswa.length > 0
        ? Math.round((totalHadir / data.mahasiswa.length) * 100)
        : 0;

    return (
        <DosenLayout>
            <Head title="Tambah Absensi">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
                <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            </Head>

            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <nav className="flex items-center text-sm text-gray-600 mb-4">
                        <Link
                            href={route('dosen.absensi.index')}
                            className="hover:text-blue-600 transition-colors"
                        >
                            <i className="fas fa-home mr-1"></i>
                            Absensi
                        </Link>
                        <i className="fas fa-chevron-right mx-2 text-xs"></i>
                        <Link
                            href={route('dosen.absensi.mata-kuliah.show', idMkPeriode)}
                            className="hover:text-blue-600 transition-colors"
                        >
                            {namaMatkul}
                        </Link>
                        <i className="fas fa-chevron-right mx-2 text-xs"></i>
                        <Link
                            href={route('dosen.absensi.kelas.show', idKelas)}
                            className="hover:text-blue-600 transition-colors"
                        >
                            Kelas {namaKelas}
                        </Link>
                        <i className="fas fa-chevron-right mx-2 text-xs"></i>
                        <span className="text-gray-800 font-medium">Tambah Absensi</span>
                    </nav>
                </div>

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Tambah Absensi</h1>
                    <p className="text-gray-600">
                        {namaMatkul} - Kelas {namaKelas}
                    </p>
                </div>

                {/* Statistics Cards */}
                {data.mahasiswa.length > 0 && (
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
                )}

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
                                    <input
                                        type="text"
                                        value={`${kodeMatkul} - ${namaMatkul}`}
                                        readOnly
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Kelas
                                    </label>
                                    <input
                                        type="text"
                                        value={`Kelas ${namaKelas}`}
                                        readOnly
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tanggal
                                    </label>
                                    <input
                                        type="date"
                                        value={data.tanggal}
                                        onChange={(e) => setData('tanggal', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Waktu Mulai
                                        </label>
                                        <input
                                            type="time"
                                            value={jamMulai}
                                            readOnly
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Waktu Selesai
                                        </label>
                                        <input
                                            type="time"
                                            value={jamSelesai}
                                            readOnly
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Pertemuan Ke-
                                    </label>
                                    <input
                                        type="number"
                                        value={data.pertemuan_ke}
                                        onChange={(e) => setData('pertemuan_ke', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        min="1"
                                        max="16"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Materi Pembelajaran
                                    </label>
                                    <textarea
                                        rows="5"
                                        placeholder="Masukkan materi yang akan diajarkan hari ini..."
                                        value={data.topik_pembahasan}
                                        onChange={(e) => setData('topik_pembahasan', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Student List Section */}
                        <div className="lg:col-span-3 p-6">
                            {data.mahasiswa.length > 0 ? (
                                <>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-lg font-semibold text-gray-700">Daftar Mahasiswa</h2>

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
                                                {data.mahasiswa.map((mhs, index) => (
                                                    <tr key={mhs.id_mahasiswa} className="hover:bg-gray-50 transition-colors">
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
                                                                <span className={`text-xs font-medium transition-colors ${mhs.status === 'hadir' ? 'text-green-600' : 'text-gray-400'}`}>
                                                                    Hadir
                                                                </span>
                                                                <div className="relative inline-block">
                                                                    <input
                                                                        id={`switch-${index}`}
                                                                        type="checkbox"
                                                                        checked={mhs.status === 'alpha'}
                                                                        onChange={() => handleStatusChange(mhs.id_mahasiswa)}
                                                                        className="sr-only peer"
                                                                    />
                                                                    <label
                                                                        htmlFor={`switch-${index}`}
                                                                        className="relative block w-12 h-6 rounded-full cursor-pointer transition-all duration-300 shadow-inner"
                                                                        style={{
                                                                            backgroundColor: mhs.status === 'alpha' ? '#ef4444' : '#22c55e'
                                                                        }}
                                                                    >
                                                                        <span
                                                                            className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300"
                                                                            style={{
                                                                                transform: mhs.status === 'alpha' ? 'translateX(24px)' : 'translateX(2px)'
                                                                            }}
                                                                        ></span>
                                                                    </label>
                                                                </div>
                                                                <span className={`text-xs font-medium transition-colors ${mhs.status === 'alpha' ? 'text-red-600' : 'text-gray-400'}`}>
                                                                    Alpha
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="text-sm text-gray-600">
                                            <i className="fas fa-info-circle mr-1"></i>
                                            <span className="font-medium">{data.mahasiswa.length}</span> mahasiswa terdaftar
                                        </div>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={processing}
                                            className="inline-flex items-center px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                                        >
                                            <i className="fas fa-save mr-2"></i>
                                            {processing ? 'Menyimpan...' : 'Simpan Absensi'}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <i className="fas fa-user-graduate text-gray-400 text-5xl mb-4"></i>
                                    <p className="text-gray-500 text-lg">Tidak ada mahasiswa</p>
                                    <p className="text-gray-400 text-sm mt-2">Belum ada mahasiswa terdaftar di kelas ini</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DosenLayout>
    );
}
