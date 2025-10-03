// resources/js/Pages/Baak/Kelas/Create.jsx

import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';
import axios from 'axios';

export default function Create({ periodes, periodeTerbaru, dosen }) {
    const { data, setData, post, processing, errors } = useForm({
        nama_kelas: '',
        id_mk_periode: '',
        id_dosen: '',
        ruang_kelas: '',
        hari: '',
        jam_mulai: '',
        jam_selesai: '',
        kapasitas: 40,
    });

    // State untuk periode yang dipilih
    const [selectedPeriode, setSelectedPeriode] = useState({
        tahun_ajaran: periodeTerbaru?.tahun_ajaran || '',
        jenis_semester: periodeTerbaru?.jenis_semester || '',
    });

    const [mataKuliahPeriode, setMataKuliahPeriode] = useState({});
    const [loadingMataKuliah, setLoadingMataKuliah] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedMkPeriode, setSelectedMkPeriode] = useState(null);

    // Load mata kuliah saat periode berubah
    useEffect(() => {
        if (selectedPeriode.tahun_ajaran && selectedPeriode.jenis_semester) {
            loadMataKuliah();
        }
    }, [selectedPeriode]);

    const loadMataKuliah = async () => {
        setLoadingMataKuliah(true);
        try {
            const response = await axios.post(route('baak.kelas.get-mata-kuliah-by-periode'), {
                tahun_ajaran: selectedPeriode.tahun_ajaran,
                jenis_semester: selectedPeriode.jenis_semester,
            });
            setMataKuliahPeriode(response.data);
        } catch (error) {
            console.error('Error loading mata kuliah:', error);
            setMataKuliahPeriode({});
        } finally {
            setLoadingMataKuliah(false);
        }
    };

    // Handle pilih periode
    const handlePeriodeChange = (tahun, jenis) => {
        setSelectedPeriode({ tahun_ajaran: tahun, jenis_semester: jenis });
        setSelectedSemester('');
        setData('id_mk_periode', '');
        setSelectedMkPeriode(null);
    };

    // Handle pilih semester
    const handleSemesterChange = (semester) => {
        setSelectedSemester(semester);
        setData('id_mk_periode', '');
        setSelectedMkPeriode(null);
    };

    // Handle pilih mata kuliah
    const handleMataKuliahChange = (idMkPeriode) => {
        setData('id_mk_periode', idMkPeriode);

        Object.values(mataKuliahPeriode).flat().forEach(mkp => {
            if (mkp.id_mk_periode == idMkPeriode) {
                setSelectedMkPeriode(mkp);
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('baak.kelas.store'));
    };

    const hariOptions = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    return (
        <BaakLayout title="Tambah Kelas">
            <Head title="Tambah Kelas" />

            <div className="p-4 md:p-6 max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={route('baak.kelas.index')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center mb-4"
                    >
                        <i className="fas fa-arrow-left mr-2"></i>
                        Kembali ke Daftar
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Tambah Kelas Baru</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Buat kelas perkuliahan dengan memilih periode, mata kuliah, dan jadwal
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Step 1: Pilih Periode */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold mb-2">
                            1. Pilih Periode <span className="text-red-600">*</span>
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Pilih periode untuk membuat kelas (tidak harus periode yang sedang aktif)
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {periodes.map((periode) => (
                                <button
                                    key={periode.id_periode}
                                    type="button"
                                    onClick={() => handlePeriodeChange(periode.tahun_ajaran, periode.jenis_semester)}
                                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                                        selectedPeriode.tahun_ajaran === periode.tahun_ajaran &&
                                        selectedPeriode.jenis_semester === periode.jenis_semester
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-300 hover:border-blue-300'
                                    }`}
                                >
                                    <div className="font-semibold text-gray-900">
                                        {periode.tahun_ajaran}
                                    </div>
                                    <div className="text-sm text-gray-600 capitalize">
                                        Semester {periode.jenis_semester}
                                    </div>
                                    {periode.status === 'aktif' && (
                                        <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
                                            Aktif
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Loading Mata Kuliah */}
                    {loadingMataKuliah && (
                        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                            <i className="fas fa-spinner fa-spin text-3xl text-blue-600 mb-3"></i>
                            <p className="text-gray-600">Memuat mata kuliah...</p>
                        </div>
                    )}

                    {/* Empty state jika belum ada pengaturan mata kuliah */}
                    {!loadingMataKuliah && Object.keys(mataKuliahPeriode).length === 0 && selectedPeriode.tahun_ajaran && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                            <i className="fas fa-exclamation-triangle text-4xl text-yellow-600 mb-3"></i>
                            <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                                Belum Ada Pengaturan Mata Kuliah
                            </h3>
                            <p className="text-sm text-gray-700 mb-4">
                                Belum ada mata kuliah yang diatur untuk periode{' '}
                                <span className="font-semibold">
                                    {selectedPeriode.tahun_ajaran} {selectedPeriode.jenis_semester}
                                </span>
                                .<br />
                                Silakan set mata kuliah KRS terlebih dahulu.
                            </p>
                            <Link
                                href={route('baak.pengaturan-krs.create')}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <i className="fas fa-cog"></i>
                                <span>Set Mata Kuliah KRS</span>
                            </Link>
                        </div>
                    )}

                    {/* Step 2: Pilih Semester */}
                    {!loadingMataKuliah && Object.keys(mataKuliahPeriode).length > 0 && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                2. Pilih Semester <span className="text-red-600">*</span>
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                {Object.keys(mataKuliahPeriode).sort((a, b) => a - b).map((semester) => (
                                    <button
                                        key={semester}
                                        type="button"
                                        onClick={() => handleSemesterChange(semester)}
                                        className={`px-4 py-3 rounded-lg border-2 transition-all ${
                                            selectedSemester == semester
                                                ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                                                : 'border-gray-300 hover:border-blue-300'
                                        }`}
                                    >
                                        <div className="text-center">
                                            <div className="font-semibold">Sem {semester}</div>
                                            <div className="text-xs mt-1 text-gray-600">
                                                {mataKuliahPeriode[semester].length} MK
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Pilih Mata Kuliah */}
                    {selectedSemester && mataKuliahPeriode[selectedSemester] && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                3. Pilih Mata Kuliah <span className="text-red-600">*</span>
                            </h3>
                            <select
                                value={data.id_mk_periode}
                                onChange={(e) => handleMataKuliahChange(e.target.value)}
                                className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.id_mk_periode ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                <option value="">-- Pilih Mata Kuliah --</option>
                                {mataKuliahPeriode[selectedSemester].map((mkp) => (
                                    <option key={mkp.id_mk_periode} value={mkp.id_mk_periode}>
                                        {mkp.mata_kuliah.kode_matkul} - {mkp.mata_kuliah.nama_matkul}{' '}
                                        ({mkp.mata_kuliah.prodi?.nama_prodi || 'Umum'}) - {mkp.mata_kuliah.sks} SKS
                                    </option>
                                ))}
                            </select>
                            {errors.id_mk_periode && (
                                <p className="mt-1 text-sm text-red-600">{errors.id_mk_periode}</p>
                            )}

                            {selectedMkPeriode && (
                                <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-700">Kode:</span>
                                            <p className="text-gray-900">{selectedMkPeriode.mata_kuliah.kode_matkul}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">SKS:</span>
                                            <p className="text-gray-900">{selectedMkPeriode.mata_kuliah.sks}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Kuota Total:</span>
                                            <p className="text-gray-900">{selectedMkPeriode.kuota} mahasiswa</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Kategori:</span>
                                            <p className="text-gray-900 capitalize">{selectedMkPeriode.mata_kuliah.kategori}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 4: Detail Kelas */}
                    {data.id_mk_periode && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold mb-4">4. Detail Kelas</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Nama Kelas */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Kelas <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nama_kelas}
                                        onChange={(e) => setData('nama_kelas', e.target.value.toUpperCase())}
                                        placeholder="Contoh: A, B, C"
                                        maxLength={10}
                                        className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.nama_kelas ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.nama_kelas && (
                                        <p className="mt-1 text-sm text-red-600">{errors.nama_kelas}</p>
                                    )}
                                </div>

                                {/* Dosen Pengampu */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Dosen Pengampu <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        value={data.id_dosen}
                                        onChange={(e) => setData('id_dosen', e.target.value)}
                                        className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.id_dosen ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">-- Pilih Dosen --</option>
                                        {dosen.map((d) => (
                                            <option key={d.id_dosen} value={d.id_dosen}>
                                                {d.nama} - {d.nip} ({d.prodi?.nama_prodi || 'N/A'})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.id_dosen && (
                                        <p className="mt-1 text-sm text-red-600">{errors.id_dosen}</p>
                                    )}
                                </div>

                                {/* Hari */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hari <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        value={data.hari}
                                        onChange={(e) => setData('hari', e.target.value)}
                                        className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.hari ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">-- Pilih Hari --</option>
                                        {hariOptions.map((hari) => (
                                            <option key={hari} value={hari}>{hari}</option>
                                        ))}
                                    </select>
                                    {errors.hari && (
                                        <p className="mt-1 text-sm text-red-600">{errors.hari}</p>
                                    )}
                                </div>

                                {/* Ruang Kelas */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ruang Kelas <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.ruang_kelas}
                                        onChange={(e) => setData('ruang_kelas', e.target.value.toUpperCase())}
                                        placeholder="Contoh: R201, LAB1"
                                        maxLength={50}
                                        className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.ruang_kelas ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.ruang_kelas && (
                                        <p className="mt-1 text-sm text-red-600">{errors.ruang_kelas}</p>
                                    )}
                                </div>

                                {/* Jam Mulai */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Jam Mulai <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        value={data.jam_mulai}
                                        onChange={(e) => setData('jam_mulai', e.target.value)}
                                        className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.jam_mulai ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.jam_mulai && (
                                        <p className="mt-1 text-sm text-red-600">{errors.jam_mulai}</p>
                                    )}
                                </div>

                                {/* Jam Selesai */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Jam Selesai <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        value={data.jam_selesai}
                                        onChange={(e) => setData('jam_selesai', e.target.value)}
                                        className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.jam_selesai ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.jam_selesai && (
                                        <p className="mt-1 text-sm text-red-600">{errors.jam_selesai}</p>
                                    )}
                                </div>

                                {/* Kapasitas */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Kapasitas Mahasiswa <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="20"
                                        max="50"
                                        value={data.kapasitas}
                                        onChange={(e) => setData('kapasitas', e.target.value)}
                                        className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.kapasitas ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.kapasitas && (
                                        <p className="mt-1 text-sm text-red-600">{errors.kapasitas}</p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500">
                                        Kapasitas minimal 20 dan maksimal 50 mahasiswa per kelas
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-6">
                        <Link
                            href={route('baak.kelas.index')}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing || !data.id_mk_periode}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save"></i>
                                    <span>Simpan Kelas</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </BaakLayout>
    );
}
