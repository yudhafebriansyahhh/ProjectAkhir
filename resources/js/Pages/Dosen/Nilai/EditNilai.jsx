import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import DosenLayout from '@/Layouts/DosenLayout';

export default function EditNilai({ nilai: initialNilai, mahasiswa, kelas, bobot }) {
    const { data, setData, put, processing, errors } = useForm({
        nilai_tugas: initialNilai?.nilai_tugas || '',
        nilai_uts: initialNilai?.nilai_uts || '',
        nilai_uas: initialNilai?.nilai_uas || ''
    });

    const [nilaiAkhir, setNilaiAkhir] = useState(0);

    // Hitung nilai akhir otomatis
    useEffect(() => {
        const total = (
            (parseFloat(data.nilai_tugas) || 0) * (bobot?.tugas / 100 || 0.30) +
            (parseFloat(data.nilai_uts) || 0) * (bobot?.uts / 100 || 0.35) +
            (parseFloat(data.nilai_uas) || 0) * (bobot?.uas / 100 || 0.35)
        );
        setNilaiAkhir(total.toFixed(2));
    }, [data.nilai_tugas, data.nilai_uts, data.nilai_uas, bobot]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const numValue = parseFloat(value);

        // Validasi nilai antara 0-100
        if (value === '' || (numValue >= 0 && numValue <= 100)) {
            setData(name, value === '' ? '' : numValue);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.nilai_tugas === '' || data.nilai_uts === '' || data.nilai_uas === '') {
            if (window.Swal) {
                window.Swal.fire({
                    title: 'Data Tidak Lengkap',
                    text: 'Silakan isi semua komponen nilai (Tugas, UTS, UAS).',
                    icon: 'warning',
                    confirmButtonColor: '#2563eb',
                });
            } else {
                alert('Silakan isi semua komponen nilai (Tugas, UTS, UAS).');
            }
            return;
        }

        if (window.Swal) {
            window.Swal.fire({
                title: 'Simpan Perubahan?',
                text: "Nilai akan diupdate.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Ya, Simpan',
                cancelButtonText: 'Batal',
                confirmButtonColor: '#2563eb',
            }).then((result) => {
                if (result.isConfirmed) {
                    put(route('dosen.nilai.update', initialNilai.id_nilai), {
                        onSuccess: () => {
                            window.Swal.fire({
                                title: 'Berhasil!',
                                text: 'Nilai berhasil diupdate.',
                                icon: 'success',
                                confirmButtonColor: '#2563eb',
                            });
                        }
                    });
                }
            });
        } else {
            if (confirm('Simpan perubahan nilai?')) {
                put(route('dosen.nilai.update', initialNilai.id_nilai));
            }
        }
    };

    return (
        <DosenLayout title="Edit Nilai">
            <Head title="Edit Nilai">
                <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            </Head>

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Edit Nilai</h1>
                    <p className="text-gray-600">Penilaian berdasarkan tugas, UTS, dan UAS.</p>
                </div>

                <div className="max-w-4xl bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
                    {/* Header Card */}
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                        <h3 className="text-lg font-semibold text-gray-700">Form Penilaian - {mahasiswa?.nama} ({mahasiswa?.nim})</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Mata Kuliah: <span className="font-semibold">{kelas?.mata_kuliah}</span> | Kelas: <span className="font-semibold">{kelas?.nama_kelas}</span>
                        </p>
                    </div>

                    {/* Form Content */}
                    <div className="p-6">
                        <div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-sm">
                                {/* Kolom Kiri - Input Nilai */}
                                <div className="space-y-4">
                                    <h4 className="text-md font-medium text-gray-800 mb-4">Input Nilai</h4>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-4">
                                            <label className="w-16 text-gray-700 font-medium text-sm">Tugas</label>
                                            <div className="flex-1">
                                                <input
                                                    type="number"
                                                    name="nilai_tugas"
                                                    min="0"
                                                    max="100"
                                                    placeholder="0-100"
                                                    value={data.nilai_tugas}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-2 border ${errors.nilai_tugas ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-blue-600'} rounded-lg bg-white text-gray-700 focus:outline-none transition-all duration-200`}
                                                />
                                                {errors.nilai_tugas && <p className="text-red-500 text-xs mt-1">{errors.nilai_tugas}</p>}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <label className="w-16 text-gray-700 font-medium text-sm">UTS</label>
                                            <div className="flex-1">
                                                <input
                                                    type="number"
                                                    name="nilai_uts"
                                                    min="0"
                                                    max="100"
                                                    placeholder="0-100"
                                                    value={data.nilai_uts}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-2 border ${errors.nilai_uts ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-blue-600'} rounded-lg bg-white text-gray-700 focus:outline-none transition-all duration-200`}
                                                />
                                                {errors.nilai_uts && <p className="text-red-500 text-xs mt-1">{errors.nilai_uts}</p>}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <label className="w-16 text-gray-700 font-medium text-sm">UAS</label>
                                            <div className="flex-1">
                                                <input
                                                    type="number"
                                                    name="nilai_uas"
                                                    min="0"
                                                    max="100"
                                                    placeholder="0-100"
                                                    value={data.nilai_uas}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-2 border ${errors.nilai_uas ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-blue-600'} rounded-lg bg-white text-gray-700 focus:outline-none transition-all duration-200`}
                                                />
                                                {errors.nilai_uas && <p className="text-red-500 text-xs mt-1">{errors.nilai_uas}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Kolom Kanan - Bobot */}
                                <div className="space-y-4">
                                    <h4 className="text-md font-medium text-gray-800 mb-4">Bobot Penilaian</h4>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-4">
                                            <label className="w-16 text-gray-700 font-medium text-sm">Bobot</label>
                                            <input
                                                type="text"
                                                value={`${bobot?.tugas || 30}%`}
                                                readOnly
                                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none text-gray-600 cursor-not-allowed"
                                            />
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <label className="w-16 text-gray-700 font-medium text-sm">Bobot</label>
                                            <input
                                                type="text"
                                                value={`${bobot?.uts || 35}%`}
                                                readOnly
                                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none text-gray-600 cursor-not-allowed"
                                            />
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <label className="w-16 text-gray-700 font-medium text-sm">Bobot</label>
                                            <input
                                                type="text"
                                                value={`${bobot?.uas || 35}%`}
                                                readOnly
                                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none text-gray-600 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Summary Section */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h5 className="text-sm font-medium text-blue-900">Total Bobot: 100%</h5>
                                            <p className="text-xs text-blue-700 mt-1">Tugas ({bobot?.tugas || 30}%) + UTS ({bobot?.uts || 35}%) + UAS ({bobot?.uas || 35}%)</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-blue-900">Nilai Akhir:</p>
                                            <p className="text-lg font-bold text-blue-900">
                                                {nilaiAkhir > 0 ? nilaiAkhir : '-'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 flex gap-3">
                                <Link
                                    href={route('dosen.nilai')}
                                    className="px-6 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none transition-all duration-200 font-medium"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={processing}
                                    className="px-6 py-2 text-sm shadow-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <i className="fas fa-save mr-2"></i>
                                    {processing ? 'Menyimpan...' : 'Edit Nilai'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DosenLayout>
    );
}
