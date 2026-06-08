// resources/js/Pages/Baak/Kelas/Edit.jsx

import { Head, Link, useForm } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { PageHeader } from '@/Components/ui/data-display';

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

export default function Edit({ kelas, dosen, ruangan = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        nama_kelas: kelas.nama_kelas || '',
        id_dosen: kelas.id_dosen || '',
        id_ruangan: kelas.id_ruangan || '',
        hari: kelas.hari || '',
        jam_mulai: kelas.jam_mulai ? kelas.jam_mulai.substring(0, 5) : '',
        jam_selesai: kelas.jam_selesai ? kelas.jam_selesai.substring(0, 5) : '',
        kapasitas: kelas.kapasitas || 40,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('baak.kelas.update', kelas.id_kelas));
    };

    const hariOptions = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    const dosenOptions = dosen.map(d => ({
        value: d.id_dosen,
        label: `${d.nama} - ${d.nip}`
    }));

    const ruanganOptions = ruangan.map(r => ({
        value: r.id_ruangan,
        label: `${r.kode_ruangan} - ${r.nama_ruangan}${r.kapasitas ? ` (${r.kapasitas} orang)` : ''}`
    }));

    return (
        <BaakLayout title="Edit Kelas">
            <Head title="Edit Kelas" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[1120px] space-y-4 md:space-y-5">
                {/* Header */}
                <div>
                    <Link
                        href={route('baak.kelas.index')}
                        className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Daftar
                    </Link>
                    <PageHeader
                        title="Edit Kelas"
                        description="Perbarui informasi dosen, ruangan, jadwal, dan kapasitas kelas."
                    />
                </div>

                {/* Info Mata Kuliah (Read-Only) */}
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                        <i className="fas fa-info-circle mr-2"></i>
                        Informasi Mata Kuliah (Tidak dapat diubah)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="text-blue-700 font-medium">Periode:</span>
                            <p className="text-blue-900 mt-1">
                                {kelas.mata_kuliah_periode?.tahun_ajaran}{' '}
                                <span className="capitalize">
                                    {kelas.mata_kuliah_periode?.jenis_semester}
                                </span>
                            </p>
                        </div>
                        <div>
                            <span className="text-blue-700 font-medium">Semester:</span>
                            <p className="text-blue-900 mt-1">
                                Semester {kelas.mata_kuliah_periode?.semester_ditawarkan}
                            </p>
                        </div>
                        <div>
                            <span className="text-blue-700 font-medium">Kode MK:</span>
                            <p className="text-blue-900 mt-1">
                                {kelas.mata_kuliah_periode?.mata_kuliah?.kode_matkul}
                            </p>
                        </div>
                        <div>
                            <span className="text-blue-700 font-medium">Mata Kuliah:</span>
                            <p className="text-blue-900 mt-1">
                                {kelas.mata_kuliah_periode?.mata_kuliah?.nama_matkul}
                            </p>
                        </div>
                        <div>
                            <span className="text-blue-700 font-medium">Prodi:</span>
                            <p className="text-blue-900 mt-1">
                                {kelas.mata_kuliah_periode?.prodi?.nama_prodi}
                            </p>
                        </div>
                        <div>
                            <span className="text-blue-700 font-medium">SKS:</span>
                            <p className="text-blue-900 mt-1">
                                {kelas.mata_kuliah_periode?.mata_kuliah?.sks} SKS
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                        <h3 className="text-lg font-semibold mb-4 pb-3 border-b">
                            Detail Kelas yang Dapat Diubah
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                            {/* Dosen Pengampu */}
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

                            {/* Ruangan */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ruangan <span className="text-red-500">*</span>
                                </label>
                                <SearchableSelect
                                    options={ruanganOptions}
                                    value={data.id_ruangan}
                                    onChange={(val) => setData('id_ruangan', val)}
                                    placeholder="-- Pilih Ruangan --"
                                    displayKey="label"
                                    valueKey="value"
                                    error={errors.id_ruangan}
                                />
                                {errors.id_ruangan && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.id_ruangan}
                                    </p>
                                )}
                                {ruanganOptions.length === 0 && (
                                    <p className="text-amber-600 text-xs mt-1">
                                        Belum ada ruangan aktif. Tambahkan ruangan terlebih dahulu.
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
                        <div className="flex flex-col-reverse gap-3 mt-6 pt-6 border-t border-slate-100 sm:flex-row sm:justify-end">
                            <Link
                                href={route('baak.kelas.index')}
                                className="w-full sm:w-auto"
                            >
                                <Button type="button" variant="outline" className="w-full sm:w-auto">Batal</Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                    </div>
                </form>
                </div>
            </div>
        </BaakLayout>
    );
}
