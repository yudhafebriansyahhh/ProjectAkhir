// resources/js/Pages/Baak/PengaturanKrs/Create.jsx

import { useState, useMemo } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Create({ periodes, mataKuliah, prodis }) {
    const { data, setData, post, processing, errors } = useForm({
        tahun_ajaran: '',
        jenis_semester: '',
        mata_kuliah: [],
    });

    const [searchMk, setSearchMk] = useState('');
    const [filterProdi, setFilterProdi] = useState('');
    const [selectedAll, setSelectedAll] = useState(false);

    // Filter mata kuliah
    const filteredMataKuliah = useMemo(() => {
        return mataKuliah.filter(mk => {
            const matchSearch = mk.nama_matkul.toLowerCase().includes(searchMk.toLowerCase()) ||
                               mk.kode_matkul.toLowerCase().includes(searchMk.toLowerCase());
            const matchProdi = !filterProdi || mk.kode_prodi === filterProdi || (!mk.kode_prodi && filterProdi === 'umum');
            return matchSearch && matchProdi;
        });
    }, [mataKuliah, searchMk, filterProdi]);

    // Handle select/deselect mata kuliah
    const handleToggleMataKuliah = (kodeMatkul) => {
        const exists = data.mata_kuliah.find(mk => mk.kode_matkul === kodeMatkul);

        if (exists) {
            setData('mata_kuliah', data.mata_kuliah.filter(mk => mk.kode_matkul !== kodeMatkul));
        } else {
            setData('mata_kuliah', [
                ...data.mata_kuliah,
                {
                    kode_matkul: kodeMatkul,
                    semester_ditawarkan: '',
                    kuota: 40,
                    is_available: true,
                    catatan: '',
                }
            ]);
        }
    };

    // Handle select all
    const handleSelectAll = () => {
        if (selectedAll) {
            setData('mata_kuliah', []);
        } else {
            setData('mata_kuliah', filteredMataKuliah.map(mk => ({
                kode_matkul: mk.kode_matkul,
                semester_ditawarkan: '',
                kuota: 40,
                is_available: true,
                catatan: '',
            })));
        }
        setSelectedAll(!selectedAll);
    };

    // Update field untuk mata kuliah tertentu
    const updateMataKuliah = (kodeMatkul, field, value) => {
        setData('mata_kuliah', data.mata_kuliah.map(mk =>
            mk.kode_matkul === kodeMatkul ? { ...mk, [field]: value } : mk
        ));
    };

    // Check if mata kuliah is selected
    const isSelected = (kodeMatkul) => {
        return data.mata_kuliah.some(mk => mk.kode_matkul === kodeMatkul);
    };

    // Get selected mata kuliah data
    const getSelectedData = (kodeMatkul) => {
        return data.mata_kuliah.find(mk => mk.kode_matkul === kodeMatkul);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('baak.pengaturan-krs.store'));
    };

    return (
        <BaakLayout title="Set Mata Kuliah KRS">
            <Head title="Set Mata Kuliah KRS" />

            <div className="p-4 md:p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={route('baak.pengaturan-krs.index')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center mb-4"
                    >
                        <i className="fas fa-arrow-left mr-2"></i>
                        Kembali ke Daftar
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Set Mata Kuliah KRS
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Pilih mata kuliah yang akan ditawarkan dan tentukan di semester berapa
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Pilih Periode */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold mb-4">1. Pilih Periode</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tahun Ajaran <span className="text-red-600">*</span>
                                </label>
                                <select
                                    value={data.tahun_ajaran}
                                    onChange={(e) => setData('tahun_ajaran', e.target.value)}
                                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.tahun_ajaran ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Pilih Tahun Ajaran</option>
                                    {periodes.map((periode) => (
                                        <option key={periode.id_periode} value={periode.tahun_ajaran}>
                                            {periode.tahun_ajaran}
                                        </option>
                                    ))}
                                </select>
                                {errors.tahun_ajaran && (
                                    <p className="mt-1 text-sm text-red-600">{errors.tahun_ajaran}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jenis Semester <span className="text-red-600">*</span>
                                </label>
                                <select
                                    value={data.jenis_semester}
                                    onChange={(e) => setData('jenis_semester', e.target.value)}
                                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.jenis_semester ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Pilih Jenis Semester</option>
                                    <option value="ganjil">Ganjil</option>
                                    <option value="genap">Genap</option>
                                    <option value="pendek">Pendek</option>
                                </select>
                                {errors.jenis_semester && (
                                    <p className="mt-1 text-sm text-red-600">{errors.jenis_semester}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Pilih Mata Kuliah */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            2. Pilih Mata Kuliah ({data.mata_kuliah.length} dipilih)
                        </h3>

                        {/* Filter & Search */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                            <div className="md:col-span-2">
                                <input
                                    type="text"
                                    value={searchMk}
                                    onChange={(e) => setSearchMk(e.target.value)}
                                    placeholder="Cari mata kuliah..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <select
                                value={filterProdi}
                                onChange={(e) => setFilterProdi(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Semua Prodi</option>
                                <option value="umum">Mata Kuliah Umum</option>
                                {prodis.map((prodi) => (
                                    <option key={prodi.kode_prodi} value={prodi.kode_prodi}>
                                        {prodi.nama_prodi}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <button
                                type="button"
                                onClick={handleSelectAll}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                {selectedAll ? 'Batalkan Semua' : 'Pilih Semua yang Ditampilkan'}
                            </button>
                        </div>

                        {errors.mata_kuliah && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded text-sm">
                                {errors.mata_kuliah}
                            </div>
                        )}

                        {/* List Mata Kuliah */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr className="text-xs text-gray-600 uppercase">
                                        <th className="px-4 py-3 text-left w-12">
                                            <input
                                                type="checkbox"
                                                checked={selectedAll}
                                                onChange={handleSelectAll}
                                                className="rounded"
                                            />
                                        </th>
                                        <th className="px-4 py-3 text-left">Kode</th>
                                        <th className="px-4 py-3 text-left">Mata Kuliah</th>
                                        <th className="px-4 py-3 text-left">Prodi</th>
                                        <th className="px-4 py-3 text-center">SKS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredMataKuliah.map((mk) => (
                                        <tr key={mk.kode_matkul} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected(mk.kode_matkul)}
                                                    onChange={() => handleToggleMataKuliah(mk.kode_matkul)}
                                                    className="rounded"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded">
                                                    {mk.kode_matkul}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium">{mk.nama_matkul}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {mk.prodi?.nama_prodi || 'Umum'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-center">{mk.sks}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Detail Mata Kuliah Terpilih */}
                    {data.mata_kuliah.length > 0 && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                3. Set Detail Mata Kuliah Terpilih
                            </h3>

                            <div className="space-y-4">
                                {data.mata_kuliah.map((selectedMk) => {
                                    const mkInfo = mataKuliah.find(mk => mk.kode_matkul === selectedMk.kode_matkul);
                                    return (
                                        <div key={selectedMk.kode_matkul} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">
                                                        {mkInfo?.nama_matkul}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">
                                                        {mkInfo?.kode_matkul} • {mkInfo?.prodi?.nama_prodi || 'Umum'} • {mkInfo?.sks} SKS
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleMataKuliah(selectedMk.kode_matkul)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Semester Ditawarkan <span className="text-red-600">*</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="14"
                                                        value={selectedMk.semester_ditawarkan}
                                                        onChange={(e) => updateMataKuliah(selectedMk.kode_matkul, 'semester_ditawarkan', e.target.value)}
                                                        placeholder="Semester"
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Kuota <span className="text-red-600">*</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="10"
                                                        max="200"
                                                        value={selectedMk.kuota}
                                                        onChange={(e) => updateMataKuliah(selectedMk.kode_matkul, 'kuota', e.target.value)}
                                                        placeholder="Kuota"
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Status
                                                    </label>
                                                    <select
                                                        value={selectedMk.is_available}
                                                        onChange={(e) => updateMataKuliah(selectedMk.kode_matkul, 'is_available', e.target.value === 'true')}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="true">Tersedia</option>
                                                        <option value="false">Nonaktif</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="mt-3">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Catatan (Opsional)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={selectedMk.catatan}
                                                    onChange={(e) => updateMataKuliah(selectedMk.kode_matkul, 'catatan', e.target.value)}
                                                    placeholder="Contoh: Khusus mahasiswa ngulang"
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Submit Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-6">
                        <Link
                            href={route('baak.pengaturan-krs.index')}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing || data.mata_kuliah.length === 0}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save"></i>
                                    <span>Simpan Pengaturan</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </BaakLayout>
    );
}
