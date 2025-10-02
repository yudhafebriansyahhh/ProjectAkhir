import { Head, Link, useForm } from "@inertiajs/react";
import BaakLayout from "@/Layouts/BaakLayout";

export default function Edit({ registrasi }) {
    const { data, setData, put, processing, errors } = useForm({
        status_semester: registrasi.status_semester,
        keterangan: registrasi.keterangan || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("baak.registrasi-semester.update", registrasi.id_registrasi));
    };

    return (
        <BaakLayout title="Edit Registrasi">
            <Head title="Edit Registrasi" />

            <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={route("baak.registrasi-semester.index")}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center mb-4"
                    >
                        <i className="fas fa-arrow-left mr-2"></i>
                        Kembali ke Daftar Registrasi
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Edit Data Registrasi
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Koreksi data registrasi mahasiswa
                    </p>
                </div>

                {/* Info Mahasiswa */}
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-900 mb-3">Data Mahasiswa:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-600">NIM:</span>
                            <span className="ml-2 font-medium text-gray-900">{registrasi.mahasiswa.nim}</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Nama:</span>
                            <span className="ml-2 font-medium text-gray-900">{registrasi.mahasiswa.nama}</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Prodi:</span>
                            <span className="ml-2 font-medium text-gray-900">{registrasi.mahasiswa.prodi.nama_prodi}</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Semester:</span>
                            <span className="ml-2 font-medium text-gray-900">{registrasi.semester}</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Periode:</span>
                            <span className="ml-2 font-medium text-gray-900">
                                {registrasi.tahun_ajaran} - {registrasi.jenis_semester.charAt(0).toUpperCase() + registrasi.jenis_semester.slice(1)}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-600">Tanggal Registrasi:</span>
                            <span className="ml-2 font-medium text-gray-900">
                                {new Date(registrasi.tanggal_registrasi).toLocaleDateString('id-ID')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                    {/* Status Semester */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status Semester <span className="text-red-600">*</span>
                        </label>
                        <div className="flex gap-6">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="aktif"
                                    checked={data.status_semester === "aktif"}
                                    onChange={(e) => setData("status_semester", e.target.value)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Aktif</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="cuti"
                                    checked={data.status_semester === "cuti"}
                                    onChange={(e) => setData("status_semester", e.target.value)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Cuti</span>
                            </label>
                        </div>
                        {errors.status_semester && (
                            <p className="mt-1 text-sm text-red-600">{errors.status_semester}</p>
                        )}
                    </div>

                    {/* Keterangan */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Keterangan
                        </label>
                        <textarea
                            value={data.keterangan}
                            onChange={(e) => setData("keterangan", e.target.value)}
                            placeholder="Keterangan tambahan (opsional)"
                            rows={4}
                            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.keterangan ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        <div className="flex justify-between mt-1">
                            {errors.keterangan ? (
                                <p className="text-sm text-red-600">{errors.keterangan}</p>
                            ) : (
                                <p className="text-xs text-gray-500">Keterangan tambahan untuk perubahan data</p>
                            )}
                            <span className={`text-xs ${
                                data.keterangan.length > 500 ? "text-red-600" : "text-gray-500"
                            }`}>
                                {data.keterangan.length}/500
                            </span>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                        <Link
                            href={route("baak.registrasi-semester.index")}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
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
                                    <span>Simpan Perubahan</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </BaakLayout>
    );
}
