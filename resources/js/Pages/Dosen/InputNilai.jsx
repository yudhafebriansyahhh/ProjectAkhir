import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DosenLayout from '@/Layouts/DosenLayout';

export default function InputNilai() {
    const [nilai, setNilai] = useState({
        tugas: '',
        uts: '',
        uas: ''
    });

    const [nilaiAkhir, setNilaiAkhir] = useState(0);

    const bobot = {
        tugas: 0.30,
        uts: 0.35,
        uas: 0.35
    };

    // Hitung nilai akhir otomatis
    useEffect(() => {
        const tugas = parseFloat(nilai.tugas) || 0;
        const uts = parseFloat(nilai.uts) || 0;
        const uas = parseFloat(nilai.uas) || 0;

        const total = (
            tugas * bobot.tugas +
            uts * bobot.uts +
            uas * bobot.uas
        );

        setNilaiAkhir(total.toFixed(2));
    }, [nilai]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const numValue = parseFloat(value);

        // Validasi nilai antara 0-100
        if (value === '' || (numValue >= 0 && numValue <= 100)) {
            setNilai(prev => ({
                ...prev,
                [name]: value === '' ? '' : numValue
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validasi input tidak boleh kosong
        if (!nilai.tugas || !nilai.uts || !nilai.uas) {
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
                title: 'Simpan Nilai?',
                text: "Data nilai akan disimpan.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Ya, Simpan',
                cancelButtonText: 'Batal',
                confirmButtonColor: '#2563eb',
            }).then((result) => {
                if (result.isConfirmed) {
                    // Logic untuk menyimpan nilai
                    console.log('Nilai Data:', nilai);
                    console.log('Nilai Akhir:', nilaiAkhir);

                    window.Swal.fire({
                        title: 'Berhasil!',
                        text: 'Nilai berhasil disimpan.',
                        icon: 'success',
                        confirmButtonColor: '#2563eb',
                    }).then(() => {
                        // Redirect ke halaman nilai
                        // router.visit(route('dosen.nilai'));
                    });
                }
            });
        } else {
            if (confirm('Simpan nilai?')) {
                console.log('Nilai Data:', nilai);
                console.log('Nilai Akhir:', nilaiAkhir);
                alert('Nilai berhasil disimpan.');
                // router.visit(route('dosen.nilai'));
            }
        }
    };

    return (
        <DosenLayout title="Input Nilai">
            <Head title="Input Nilai">
                <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            </Head>

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Input Nilai</h1>
                    <p className="text-gray-600">Penilaian berdasarkan tugas, UTS, dan UAS.</p>
                </div>

                <div className="max-w-4xl bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
                    {/* Header Card */}
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                        <h3 className="text-lg font-semibold text-gray-700">Form Penilaian</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Silakan masukkan nilai berdasarkan komponen penilaian: Tugas, UTS, dan UAS.
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
                                            <input
                                                type="number"
                                                name="tugas"
                                                min="0"
                                                max="100"
                                                placeholder="0-100"
                                                value={nilai.tugas}
                                                onChange={handleInputChange}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-blue-600 transition-all duration-200"
                                            />
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <label className="w-16 text-gray-700 font-medium text-sm">UTS</label>
                                            <input
                                                type="number"
                                                name="uts"
                                                min="0"
                                                max="100"
                                                placeholder="0-100"
                                                value={nilai.uts}
                                                onChange={handleInputChange}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-blue-600 transition-all duration-200"
                                            />
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <label className="w-16 text-gray-700 font-medium text-sm">UAS</label>
                                            <input
                                                type="number"
                                                name="uas"
                                                min="0"
                                                max="100"
                                                placeholder="0-100"
                                                value={nilai.uas}
                                                onChange={handleInputChange}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-blue-600 transition-all duration-200"
                                            />
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
                                                value="30%"
                                                readOnly
                                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none text-gray-600 cursor-not-allowed"
                                            />
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <label className="w-16 text-gray-700 font-medium text-sm">Bobot</label>
                                            <input
                                                type="text"
                                                value="35%"
                                                readOnly
                                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none text-gray-600 cursor-not-allowed"
                                            />
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <label className="w-16 text-gray-700 font-medium text-sm">Bobot</label>
                                            <input
                                                type="text"
                                                value="35%"
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
                                            <p className="text-xs text-blue-700 mt-1">Tugas (30%) + UTS (35%) + UAS (35%)</p>
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
                                    className="px-6 py-2 text-sm shadow-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none transition-all duration-200 font-medium"
                                >
                                    <i className="fas fa-save mr-2"></i>
                                    Simpan Nilai
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DosenLayout>
    );
}
