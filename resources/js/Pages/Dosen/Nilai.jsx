import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DosenLayout from '@/Layouts/DosenLayout';

export default function Nilai({ prodiList, mataKuliahList, mahasiswaList, filters: initialFilters }) {
    const [filters, setFilters] = useState({
        prodi: initialFilters?.prodi || '',
        mataKuliah: initialFilters?.mataKuliah || '',
        semester: initialFilters?.semester || '',
        kelas: initialFilters?.kelas || ''
    });

    const [kelasList, setKelasList] = useState([]);
    const [loadingKelas, setLoadingKelas] = useState(false);

    // Fetch kelas ketika mata kuliah dipilih
    useEffect(() => {
        if (filters.mataKuliah) {
            setLoadingKelas(true);
            fetch(route('dosen.api.kelas_by_matakuliah', { kode_mk: filters.mataKuliah }))
                .then(res => res.json())
                .then(data => {
                    setKelasList(data);
                    setLoadingKelas(false);
                })
                .catch(err => {
                    console.error('Error fetching kelas:', err);
                    setLoadingKelas(false);
                });
        } else {
            setKelasList([]);
            setFilters(prev => ({ ...prev, kelas: '' }));
        }
    }, [filters.mataKuliah]);

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

        // Reload dengan filters
        router.get(route('dosen.nilai'), filters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const showData = mahasiswaList && mahasiswaList.length > 0;

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
                                {prodiList.map(prodi => (
                                    <option key={prodi.kode_prodi} value={prodi.kode_prodi}>
                                        {prodi.nama_prodi}
                                    </option>
                                ))}
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
                                {mataKuliahList.map(mk => (
                                    <option key={mk.kode_mk} value={mk.kode_mk}>
                                        {mk.nama_mk}
                                    </option>
                                ))}
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
                                disabled={!filters.mataKuliah || loadingKelas}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-blue-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="">
                                    {loadingKelas ? 'Memuat...' : 'Pilih Kelas'}
                                </option>
                                {kelasList.map(kelas => (
                                    <option key={kelas.value} value={kelas.value}>
                                        {kelas.label}
                                    </option>
                                ))}
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
                                {mahasiswaList.map((mhs, index) => (
                                    <tr key={mhs.id_mahasiswa} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                                        <td className="px-6 py-4 text-gray-700">{mhs.nama}</td>
                                        <td className="px-6 py-4 text-center text-gray-700">{mhs.nim}</td>
                                        <td className="px-6 py-4 text-center text-gray-700">
                                            {mhs.nilai_akhir ? parseFloat(mhs.nilai_akhir).toFixed(2) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-700">
                                            {mhs.nilai_huruf ? (
                                                <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                                                    mhs.nilai_huruf.startsWith('A') ? 'bg-green-100 text-green-700' :
                                                    mhs.nilai_huruf.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                                                    mhs.nilai_huruf.startsWith('C') ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                    {mhs.nilai_huruf}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex gap-2">
                                                {!mhs.has_nilai ? (
                                                    <Link
                                                        href={route('dosen.input_nilai', {
                                                            id_mahasiswa: mhs.id_mahasiswa,
                                                            id_kelas: mhs.id_kelas
                                                        })}
                                                        className="px-3 font-semibold py-1.5 text-xs bg-blue-100 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-200 transition flex items-center gap-1"
                                                    >
                                                        <i className="fas fa-file-signature"></i> Nilai
                                                    </Link>
                                                ) : (
                                                    <>
                                                        {!mhs.is_locked && (
                                                            <Link
                                                                href={route('dosen.edit_nilai', mhs.id_nilai)}
                                                                className="px-3 font-semibold py-1.5 text-xs bg-amber-100 text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-200 transition flex items-center gap-1"
                                                            >
                                                                <i className="fas fa-pen-to-square"></i> Edit
                                                            </Link>
                                                        )}
                                                        {mhs.is_locked && (
                                                            <span className="px-3 py-1.5 text-xs bg-gray-100 text-gray-500 border border-gray-200 rounded-lg flex items-center gap-1">
                                                                <i className="fas fa-lock"></i> Terkunci
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* No Data Message */}
                {filters.prodi && filters.mataKuliah && filters.semester && filters.kelas && !showData && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                        <i className="fas fa-info-circle text-yellow-600 text-3xl mb-3"></i>
                        <p className="text-gray-700 font-medium">Tidak ada data mahasiswa untuk filter yang dipilih.</p>
                    </div>
                )}
            </div>
        </DosenLayout>
    );
}