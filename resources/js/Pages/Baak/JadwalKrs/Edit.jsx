import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import BaakLayout from '@/Layouts/BaakLayout';

export default function Edit({ jadwalKrs }) {
    const { data, setData, put, processing, errors } = useForm({
        semester_list: jadwalKrs.semester_list || [],
        tanggal_mulai: jadwalKrs.tanggal_mulai,
        tanggal_selesai: jadwalKrs.tanggal_selesai,
    });

    const [selectAllOdd, setSelectAllOdd] = useState(false);
    const [selectAllEven, setSelectAllEven] = useState(false);

    const handleSemesterToggle = (semester) => {
        const currentList = [...data.semester_list];
        const index = currentList.indexOf(semester);

        if (index > -1) {
            currentList.splice(index, 1);
        } else {
            currentList.push(semester);
        }

        setData('semester_list', currentList.sort((a, b) => a - b));
    };

    const handleSelectAllOdd = () => {
        const oddSemesters = [1, 3, 5, 7, 9, 11, 13];
        if (selectAllOdd) {
            const newList = data.semester_list.filter(s => !oddSemesters.includes(s));
            setData('semester_list', newList);
        } else {
            const newList = [...new Set([...data.semester_list, ...oddSemesters])].sort((a, b) => a - b);
            setData('semester_list', newList);
        }
        setSelectAllOdd(!selectAllOdd);
    };

    const handleSelectAllEven = () => {
        const evenSemesters = [2, 4, 6, 8, 10, 12, 14];
        if (selectAllEven) {
            const newList = data.semester_list.filter(s => !evenSemesters.includes(s));
            setData('semester_list', newList);
        } else {
            const newList = [...new Set([...data.semester_list, ...evenSemesters])].sort((a, b) => a - b);
            setData('semester_list', newList);
        }
        setSelectAllEven(!selectAllEven);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('baak.jadwal-krs.update', jadwalKrs.id_jadwal));
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <BaakLayout>
            <Head title="Edit Jadwal KRS" />

            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={route('baak.jadwal-krs.index')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-3 inline-flex items-center gap-1"
                    >
                        <i className="fas fa-arrow-left"></i>
                        <span>Kembali ke Daftar Jadwal</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-700 mt-2">Edit Jadwal Pengisian KRS</h1>
                    <p className="text-sm text-gray-600 mt-1">Perbarui jadwal pengisian KRS yang sudah ada</p>
                </div>

                {/* Info Jadwal */}
                <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Informasi Jadwal KRS</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Program Studi</p>
                            <p className="font-semibold text-gray-900">{jadwalKrs.prodi.nama_prodi}</p>
                            <p className="text-xs text-gray-500">{jadwalKrs.prodi.fakultas.nama_fakultas}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Semester Sebelumnya</p>
                            <span className="inline-block px-3 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-lg">
                                {jadwalKrs.semester_list.sort((a, b) => a - b).join(', ')}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Tahun Ajaran</p>
                            <p className="font-semibold text-gray-900">{jadwalKrs.tahun_ajaran}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Jenjang</p>
                            <p className="font-semibold text-gray-900">{jadwalKrs.prodi.jenjang}</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        {/* Pilih Semester - Multi Select dengan Checkbox */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pilih Semester <span className="text-red-500">*</span>
                            </label>

                            {/* Quick Select Buttons */}
                            <div className="flex gap-2 mb-3">
                                <button
                                    type="button"
                                    onClick={handleSelectAllOdd}
                                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                                >
                                    {selectAllOdd ? 'Unselect' : 'Select'} Semester Ganjil (1,3,5,7,9,11,13)
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSelectAllEven}
                                    className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                                >
                                    {selectAllEven ? 'Unselect' : 'Select'} Semester Genap (2,4,6,8,10,12,14)
                                </button>
                            </div>

                            {/* Checkbox Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                                {[...Array(14)].map((_, i) => {
                                    const semester = i + 1;
                                    const isChecked = data.semester_list.includes(semester);
                                    return (
                                        <label
                                            key={semester}
                                            className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition ${
                                                isChecked
                                                    ? 'bg-blue-50 border-blue-500'
                                                    : 'bg-white border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleSemesterToggle(semester)}
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm font-medium">Sem {semester}</span>
                                        </label>
                                    );
                                })}
                            </div>

                            {errors.semester_list && (
                                <p className="text-red-500 text-xs mt-2">
                                    <i className="fas fa-exclamation-circle mr-1"></i>
                                    {errors.semester_list}
                                </p>
                            )}

                            {/* Selected Semester Display */}
                            {data.semester_list.length > 0 && (
                                <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                    <p className="text-sm text-gray-700">
                                        <span className="font-medium">Semester terpilih:</span>{' '}
                                        {data.semester_list.join(', ')}
                                        <span className="ml-2 text-gray-500">({data.semester_list.length} semester)</span>
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Tanggal */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tanggal Mulai <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={data.tanggal_mulai}
                                    onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.tanggal_mulai ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.tanggal_mulai && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.tanggal_mulai}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Sebelumnya: {formatDate(jadwalKrs.tanggal_mulai)}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tanggal Selesai <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={data.tanggal_selesai}
                                    onChange={(e) => setData('tanggal_selesai', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                        errors.tanggal_selesai ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.tanggal_selesai && (
                                    <p className="text-red-500 text-xs mt-1">
                                        <i className="fas fa-exclamation-circle mr-1"></i>
                                        {errors.tanggal_selesai}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Sebelumnya: {formatDate(jadwalKrs.tanggal_selesai)}
                                </p>
                            </div>
                        </div>

                        {/* Durasi */}
                        {data.tanggal_mulai && data.tanggal_selesai && (
                            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                <p className="text-sm text-gray-700">
                                    <span className="font-medium">Durasi Baru:</span>{' '}
                                    {Math.ceil(
                                        (new Date(data.tanggal_selesai) - new Date(data.tanggal_mulai)) /
                                            (1000 * 60 * 60 * 24)
                                    ) + 1}{' '}
                                    hari
                                </p>
                            </div>
                        )}

                        {/* Info Box */}
                        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex gap-3">
                                <i className="fas fa-exclamation-triangle text-yellow-600 mt-0.5"></i>
                                <div className="text-sm text-yellow-800">
                                    <p className="font-medium mb-1">Perhatian:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Anda bisa mengubah semester dan tanggal periode</li>
                                        <li>Prodi dan tahun ajaran tidak dapat diubah</li>
                                        <li>Pastikan tanggal selesai lebih besar dari tanggal mulai</li>
                                        <li>Sistem akan validasi duplikasi semester dengan jadwal lain</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                            <Link
                                href={route('baak.jadwal-krs.index')}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 text-center transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
                            >
                                {processing ? 'Menyimpan...' : 'Update Jadwal KRS'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </BaakLayout>
    );
}
