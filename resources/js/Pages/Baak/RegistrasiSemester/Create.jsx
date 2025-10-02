import { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import BaakLayout from "@/Layouts/BaakLayout";

export default function Create({ periodes }) {
    const { data, setData, post, processing, errors } = useForm({
        nim: "",
        tahun_ajaran: "",
        jenis_semester: "",
        status_semester: "aktif",
        keterangan: "",
    });

    const [mahasiswaSearch, setMahasiswaSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    // Debounced search
    useEffect(() => {
        if (mahasiswaSearch.length < 3) {
            setSearchResults([]);
            return;
        }

        const timer = setTimeout(() => {
            fetch(route("baak.api.search-mahasiswa", { search: mahasiswaSearch }))
                .then(res => res.json())
                .then(data => {
                    setSearchResults(data);
                    setShowDropdown(true);
                });
        }, 300);

        return () => clearTimeout(timer);
    }, [mahasiswaSearch]);

    const handleSelectMahasiswa = (mahasiswa) => {
        setSelectedMahasiswa(mahasiswa);
        setData("nim", mahasiswa.nim);
        setMahasiswaSearch(`${mahasiswa.nim} - ${mahasiswa.nama}`);
        setShowDropdown(false);
        setSearchResults([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("baak.registrasi-semester.store"));
    };

    return (
        <BaakLayout title="Tambah Registrasi Manual">
            <Head title="Tambah Registrasi Manual" />

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
                        Registrasi Manual Mahasiswa
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Isi formulir berikut untuk melakukan registrasi manual
                    </p>
                </div>

                {/* Alert Info */}
                <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex">
                        <i className="fas fa-exclamation-triangle text-yellow-600 mr-3 mt-0.5"></i>
                        <div className="text-sm text-yellow-800">
                            <p className="font-semibold mb-1">Perhatian!</p>
                            <p>
                                Registrasi manual bypass periode registrasi aktif.
                                Pastikan ada alasan yang jelas dan keterangan yang lengkap untuk keperluan audit.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                    {/* Search Mahasiswa */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cari Mahasiswa <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            value={mahasiswaSearch}
                            onChange={(e) => setMahasiswaSearch(e.target.value)}
                            placeholder="Ketik NIM atau Nama Mahasiswa (min 3 karakter)..."
                            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.nim ? "border-red-500" : "border-gray-300"
                            }`}
                            autoComplete="off"
                        />
                        {errors.nim && (
                            <p className="mt-1 text-sm text-red-600">{errors.nim}</p>
                        )}

                        {/* Dropdown Results */}
                        {showDropdown && searchResults.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                                {searchResults.map((mahasiswa) => (
                                    <button
                                        key={mahasiswa.id_mahasiswa}
                                        type="button"
                                        onClick={() => handleSelectMahasiswa(mahasiswa)}
                                        className="w-full px-4 py-3 text-left hover:bg-blue-50 transition flex items-center gap-3 border-b border-gray-100 last:border-0"
                                    >
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <i className="fas fa-user text-blue-600"></i>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {mahasiswa.nim} - {mahasiswa.nama}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {mahasiswa.prodi.nama_prodi}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {showDropdown && searchResults.length === 0 && mahasiswaSearch.length >= 3 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500 text-sm">
                                <i className="fas fa-search text-gray-400 text-2xl mb-2"></i>
                                <p>Mahasiswa tidak ditemukan</p>
                            </div>
                        )}
                    </div>

                    {/* Selected Mahasiswa Info */}
                    {selectedMahasiswa && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-blue-900 mb-2">Mahasiswa Terpilih:</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">NIM:</span>
                                    <span className="ml-2 font-medium text-gray-900">{selectedMahasiswa.nim}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Nama:</span>
                                    <span className="ml-2 font-medium text-gray-900">{selectedMahasiswa.nama}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Prodi:</span>
                                    <span className="ml-2 font-medium text-gray-900">{selectedMahasiswa.prodi.nama_prodi}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Status:</span>
                                    <span className="ml-2">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            selectedMahasiswa.status === 'aktif'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {selectedMahasiswa.status.charAt(0).toUpperCase() + selectedMahasiswa.status.slice(1)}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="border-t border-gray-200 pt-6"></div>

                    {/* Periode Registrasi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tahun Ajaran <span className="text-red-600">*</span>
                            </label>
                            <select
                                value={data.tahun_ajaran}
                                onChange={(e) => setData("tahun_ajaran", e.target.value)}
                                className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.tahun_ajaran ? "border-red-500" : "border-gray-300"
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
                                onChange={(e) => setData("jenis_semester", e.target.value)}
                                className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.jenis_semester ? "border-red-500" : "border-gray-300"
                                }`}
                            >
                                <option value="">Pilih Jenis Semester</option>
                                <option value="ganjil">Ganjil</option>
                                <option value="genap">Genap</option>
                            </select>
                            {errors.jenis_semester && (
                                <p className="mt-1 text-sm text-red-600">{errors.jenis_semester}</p>
                            )}
                        </div>
                    </div>

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
                            Keterangan/Alasan Registrasi Manual <span className="text-red-600">*</span>
                        </label>
                        <textarea
                            value={data.keterangan}
                            onChange={(e) => setData("keterangan", e.target.value)}
                            placeholder="Contoh: Registrasi manual oleh BAAK - Mahasiswa lupa registrasi saat periode aktif karena sedang sakit"
                            rows={4}
                            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.keterangan ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        <div className="flex justify-between mt-1">
                            {errors.keterangan ? (
                                <p className="text-sm text-red-600">{errors.keterangan}</p>
                            ) : (
                                <p className="text-xs text-gray-500">
                                    Wajib diisi untuk keperluan tracking dan audit
                                </p>
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
                                    <span>Simpan Registrasi</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </BaakLayout>
    );
}
