// resources/js/Pages/Baak/Kelas/Create.jsx

import { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';
import axios from 'axios';

// Komponen Searchable Select
function SearchableSelect({ options, value, onChange, placeholder, displayKey, valueKey, disabled = false, error = null }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filtered = options.filter(opt =>
        opt[displayKey].toLowerCase().includes(search.toLowerCase())
    );

    const selected = options.find(opt => opt[valueKey] === value);

    return (
        <div ref={wrapperRef} className="relative">
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full px-4 py-2 border rounded-lg cursor-pointer flex items-center justify-between ${
                    disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                } ${error ? 'border-red-500' : 'border-gray-300'}`}
            >
                <span className={selected ? 'text-gray-900' : 'text-gray-500'}>
                    {selected ? selected[displayKey] : placeholder}
                </span>
                <i className={`fas fa-chevron-down text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
            </div>

            {isOpen && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                    <div className="p-2 border-b">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari..."
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                    </div>
                    <div className="overflow-y-auto max-h-48">
                        {filtered.length > 0 ? (
                            filtered.map((opt) => (
                                <div
                                    key={opt[valueKey]}
                                    onClick={() => {
                                        onChange(opt[valueKey]);
                                        setIsOpen(false);
                                        setSearch('');
                                    }}
                                    className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                                        value === opt[valueKey] ? 'bg-blue-100' : ''
                                    }`}
                                >
                                    {opt[displayKey]}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-center text-gray-500 text-sm">
                                Tidak ada hasil
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Create({ periodes, prodis, dosen }) {
    const { data, setData, post, processing, errors } = useForm({
        tahun_ajaran: '',
        jenis_semester: '',
        kode_prodi: '',
        semester: '',
        nama_kelas: '',
        id_mk_periode: '',
        id_dosen: '',
        ruang_kelas: '',
        hari: '',
        jam_mulai: '',
        jam_selesai: '',
        kapasitas: 40,
    });

    const [mataKuliahPeriode, setMataKuliahPeriode] = useState([]);
    const [loadingMataKuliah, setLoadingMataKuliah] = useState(false);
    const [selectedMkPeriode, setSelectedMkPeriode] = useState(null);

    // Load mata kuliah saat semua filter sudah lengkap
    useEffect(() => {
        if (data.tahun_ajaran && data.jenis_semester && data.kode_prodi && data.semester) {
            loadMataKuliah();
        } else {
            setMataKuliahPeriode([]);
            setData('id_mk_periode', '');
            setSelectedMkPeriode(null);
        }
    }, [data.tahun_ajaran, data.jenis_semester, data.kode_prodi, data.semester]);

    const loadMataKuliah = async () => {
        setLoadingMataKuliah(true);
        try {
            const response = await axios.post(route('baak.kelas.get-mata-kuliah-by-periode'), {
                tahun_ajaran: data.tahun_ajaran,
                jenis_semester: data.jenis_semester,
                kode_prodi: data.kode_prodi,
                semester: data.semester,
            });
            setMataKuliahPeriode(response.data);
        } catch (error) {
            console.error('Error loading mata kuliah:', error);
            setMataKuliahPeriode([]);
        } finally {
            setLoadingMataKuliah(false);
        }
    };

    // Handle pilih mata kuliah
    const handleMataKuliahChange = (idMkPeriode) => {
        setData('id_mk_periode', idMkPeriode);
        const mkp = mataKuliahPeriode.find(mk => mk.id_mk_periodo == idMkPeriode);
        setSelectedMkPeriode(mkp);
    };

    // Get semester options based on jenis_semester
    const getSemesterOptions = () => {
        if (data.jenis_semester === 'ganjil') {
            return [1, 3, 5, 7];
        } else if (data.jenis_semester === 'genap') {
            return [2, 4, 6, 8];
        } else if (data.jenis_semester === 'pendek') {
            return [1, 2, 3, 4, 5, 6, 7, 8];
        }
        return [];
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('baak.kelas.store'));
    };

    const hariOptions = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    // Format data untuk searchable select
    const periodeOptions = periodes.map(p => ({
        value: `${p.tahun_ajaran}|${p.jenis_semester}`,
        label: `${p.tahun_ajaran} - ${p.jenis_semester.charAt(0).toUpperCase() + p.jenis_semester.slice(1)}${p.status === 'aktif' ? ' (Aktif)' : ''}`
    }));

    const prodiOptions = prodis.map(p => ({
        value: p.kode_prodi,
        label: `${p.nama_prodi} (${p.jenjang})`
    }));

    const dosenOptions = dosen.map(d => ({
        value: d.id_dosen,
        label: `${d.nama} - ${d.nip}`
    }));

    const mkOptions = mataKuliahPeriode.map(mk => ({
        value: mk.id_mk_periode,
        label: `${mk.mata_kuliah.kode_matkul} - ${mk.mata_kuliah.nama_matkul} (${mk.mata_kuliah.sks} SKS)`
    }));

    return (
        <BaakLayout title="Tambah Kelas">
            <Head title="Tambah Kelas" />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={route('baak.kelas.index')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center mb-4"
                    >
                        <i className="fas fa-arrow-left mr-2"></i>
                        Kembali ke Daftar
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Tambah Kelas Baru</h1>
                    <p className="text-gray-600">Isi form untuk menambah kelas perkuliahan baru</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Periode */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Periode <span className="text-red-500">*</span>
                                </label>
                                <SearchableSelect
                                    options={periodeOptions}
                                    value={`${data.tahun_ajaran}|${data.jenis_semester}`}
                                    onChange={(val) => {
                                        const [tahun, jenis] = val.split('|');
                                        setData({
                                            ...data,
                                            tahun_ajaran: tahun,
                                            jenis_semester: jenis,
                                            semester: '',
                                            id_mk_periode: ''
                                        });
                                    }}
                                    placeholder="-- Pilih Periode --"
                                    displayKey="label"
                                    valueKey="value"
                                    error={errors.tahun_ajaran}
                                />
                                {errors.tahun_ajaran && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.tahun_ajaran}
                                    </p>
                                )}
                            </div>

                            {/* Prodi */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Program Studi <span className="text-red-500">*</span>
                                </label>
                                <SearchableSelect
                                    options={prodiOptions}
                                    value={data.kode_prodi}
                                    onChange={(val) => setData({
                                        ...data,
                                        kode_prodi: val,
                                        semester: '',
                                        id_mk_periode: ''
                                    })}
                                    placeholder="-- Pilih Program Studi --"
                                    displayKey="label"
                                    valueKey="value"
                                    error={errors.kode_prodi}
                                />
                                {errors.kode_prodi && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.kode_prodi}
                                    </p>
                                )}
                            </div>

                            {/* Semester */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Semester <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.semester}
                                    onChange={(e) => setData({
                                        ...data,
                                        semester: e.target.value,
                                        id_mk_periode: ''
                                    })}
                                    disabled={!data.jenis_semester}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100 ${
                                        errors.semester ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">-- Pilih Semester --</option>
                                    {getSemesterOptions().map((sem) => (
                                        <option key={sem} value={sem}>Semester {sem}</option>
                                    ))}
                                </select>
                                {errors.semester && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.semester}
                                    </p>
                                )}
                            </div>

                            {/* Mata Kuliah */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mata Kuliah <span className="text-red-500">*</span>
                                </label>
                                {loadingMataKuliah ? (
                                    <div className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-500">
                                        <i className="fas fa-spinner fa-spin mr-2"></i>
                                        Memuat...
                                    </div>
                                ) : mataKuliahPeriode.length > 0 ? (
                                    <SearchableSelect
                                        options={mkOptions}
                                        value={data.id_mk_periode}
                                        onChange={handleMataKuliahChange}
                                        placeholder="-- Pilih Mata Kuliah --"
                                        displayKey="label"
                                        valueKey="value"
                                        error={errors.id_mk_periode}
                                    />
                                ) : (
                                    <div className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-500">
                                        {data.semester ? 'Tidak ada mata kuliah' : 'Pilih semester terlebih dahulu'}
                                    </div>
                                )}
                                {errors.id_mk_periode && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.id_mk_periode}
                                    </p>
                                )}
                            </div>

                            {/* Info Mata Kuliah */}
                            {selectedMkPeriode && (
                                <div className="md:col-span-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
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
                                            <span className="font-medium text-gray-700">Kategori:</span>
                                            <p className="text-gray-900 capitalize">{selectedMkPeriode.mata_kuliah.kategori}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Nama Kelas */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Kelas <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.nama_kelas}
                                    onChange={(e) => setData('nama_kelas', e.target.value.toUpperCase())}
                                    placeholder="Contoh: A, B, C"
                                    maxLength={10}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.nama_kelas ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.nama_kelas && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.nama_kelas}
                                    </p>
                                )}
                            </div>

                            {/* Dosen */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Dosen Pengampu <span className="text-red-500">*</span>
                                </label>
                                <SearchableSelect
                                    options={dosenOptions}
                                    value={data.id_dosen}
                                    onChange={(val) => setData('id_dosen', val)}
                                    placeholder="-- Pilih Dosen --"
                                    displayKey="label"
                                    valueKey="value"
                                    error={errors.id_dosen}
                                />
                                {errors.id_dosen && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.id_dosen}
                                    </p>
                                )}
                            </div>

                            {/* Hari */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hari <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.hari}
                                    onChange={(e) => setData('hari', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.hari ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">-- Pilih Hari --</option>
                                    {hariOptions.map((hari) => (
                                        <option key={hari} value={hari}>{hari}</option>
                                    ))}
                                </select>
                                {errors.hari && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.hari}
                                    </p>
                                )}
                            </div>

                            {/* Ruang Kelas */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ruang Kelas <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.ruang_kelas}
                                    onChange={(e) => setData('ruang_kelas', e.target.value.toUpperCase())}
                                    placeholder="Contoh: R201, LAB1"
                                    maxLength={50}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.ruang_kelas ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.ruang_kelas && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.ruang_kelas}
                                    </p>
                                )}
                            </div>

                            {/* Jam Mulai */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jam Mulai <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    value={data.jam_mulai}
                                    onChange={(e) => setData('jam_mulai', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.jam_mulai ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.jam_mulai && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.jam_mulai}
                                    </p>
                                )}
                            </div>

                            {/* Jam Selesai */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jam Selesai <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    value={data.jam_selesai}
                                    onChange={(e) => setData('jam_selesai', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.jam_selesai ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.jam_selesai && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.jam_selesai}
                                    </p>
                                )}
                            </div>

                            {/* Kapasitas */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kapasitas Mahasiswa <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="20"
                                    max="100"
                                    value={data.kapasitas}
                                    onChange={(e) => setData('kapasitas', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.kapasitas ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.kapasitas && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.kapasitas}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Kapasitas minimal 20 dan maksimal 100 mahasiswa per kelas
                                </p>
                            </div>

                            {/* Error Jadwal Bentrok */}
                            {errors.jadwal && (
                                <div className="md:col-span-2 p-3 bg-red-50 border border-red-200 text-red-800 rounded text-sm">
                                    <i className="fas fa-exclamation-circle mr-2"></i>
                                    {errors.jadwal}
                                </div>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                            <Link
                                href={route('baak.kelas.index')}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 text-center transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Data'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </BaakLayout>
    );
}
