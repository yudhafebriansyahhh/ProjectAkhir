import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import DosenLayout from "@/Layouts/DosenLayout";

export default function ShowKelas({ kelas, mahasiswaList }) {
    const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Safely access nested properties
    const mataKuliahPeriode = kelas?.mata_kuliah_periode || {};
    const mataKuliah = mataKuliahPeriode?.mata_kuliah || {};
    const dosen = kelas?.dosen || {};

    const namaMatkul = mataKuliah?.nama_matkul || "Mata Kuliah";
    const kodeMatkul = mataKuliah?.kode_matkul || "-";
    const sks = mataKuliah?.sks || 0;
    const namaKelas = kelas?.nama_kelas || "-";
    const idMkPeriode = kelas?.id_mk_periode || "";
    const idKelas = kelas?.id_kelas || "";
    const hari = kelas?.hari || "-";
    const ruangKelas = kelas?.ruang_kelas || "-";
    const kapasitas = kelas?.kapasitas || 0;
    const namaDosen = dosen?.nama || "-";

    const formatTime = (time) => {
        if (!time || time === "-") return "-";

        // Jika format datetime: "YYYY-MM-DD HH:MM:SS"
        if (time.includes(" ")) {
            const [, clock] = time.split(" ");
            return clock.substring(0, 5); // Ambil HH:MM
        }

        // Jika format HH:MM:SS
        if (time.length >= 8) {
            return time.substring(0, 5); // Ambil HH:MM
        }

        return time; // Jika sudah HH:MM
    };

    const jamMulai = formatTime(kelas?.jam_mulai);
    const jamSelesai = formatTime(kelas?.jam_selesai);


    const handleShowDetail = (mahasiswa) => {
        setSelectedMahasiswa(mahasiswa);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMahasiswa(null);
    };

    return (
        <DosenLayout>
            <Head title={`Kelas ${namaKelas} - ${namaMatkul}`}>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
                />
            </Head>

            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <nav className="flex items-center text-sm text-gray-600 mb-4">
                        <Link
                            href={route("dosen.absensi.index")}
                            className="hover:text-blue-600 transition-colors"
                        >
                            <i className="fas fa-home mr-1"></i>
                            Absensi
                        </Link>
                        <i className="fas fa-chevron-right mx-2 text-xs"></i>
                        <Link
                            href={route(
                                "dosen.absensi.mata-kuliah.show",
                                idMkPeriode
                            )}
                            className="hover:text-blue-600 transition-colors"
                        >
                            {namaMatkul}
                        </Link>
                        <i className="fas fa-chevron-right mx-2 text-xs"></i>
                        <span className="text-gray-800 font-medium">
                            Kelas {namaKelas}
                        </span>
                    </nav>
                </div>

                {/* Header Info Kelas */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 mb-6 text-white">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">
                                Kelas {namaKelas} - {namaMatkul}
                            </h1>
                            <div className="flex items-center gap-4 text-blue-100 text-sm">
                                <span className="flex items-center">
                                    <i className="fas fa-code mr-2"></i>
                                    {kodeMatkul}
                                </span>
                                <span className="flex items-center">
                                    <i className="fas fa-book mr-2"></i>
                                    {sks} SKS
                                </span>
                                <span className="flex items-center">
                                    <i className="fas fa-door-open mr-2"></i>
                                    Ruang {ruangKelas}
                                </span>
                            </div>
                        </div>
                        <Link
                            href={route("dosen.absensi.create", idKelas)}
                            className="inline-flex items-center px-5 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold shadow-lg"
                        >
                            <i className="fas fa-plus mr-2"></i>
                            Tambah Absen
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="bg-white bg-opacity-20 rounded-lg p-3">
                            <div className="text-xs text-blue-100 mb-1">
                                Dosen
                            </div>
                            <div className="font-semibold">{namaDosen}</div>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-lg p-3">
                            <div className="text-xs text-blue-100 mb-1">
                                Hari
                            </div>
                            <div className="font-semibold">{hari}</div>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-lg p-3">
                            <div className="text-xs text-blue-100 mb-1">
                                Waktu
                            </div>
                            <div className="font-semibold">
                                {jamMulai} - {jamSelesai}
                            </div>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-lg p-3">
                            <div className="text-xs text-blue-100 mb-1">
                                Kapasitas
                            </div>
                            <div className="font-semibold">
                                {mahasiswaList?.length || 0} / {kapasitas}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Daftar Mahasiswa */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-700">
                            Daftar Mahasiswa ({mahasiswaList?.length || 0})
                        </h2>
                    </div>

                    {mahasiswaList && mahasiswaList.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">
                                            #
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">
                                            NIM
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">
                                            Nama Mahasiswa
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600">
                                            Persen Kehadiran
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600">
                                            Keterangan
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {mahasiswaList.map((mhs, index) => {
                                        const persenKehadiran =
                                            mhs.persentase || 0;
                                        const statusColor =
                                            persenKehadiran >= 75
                                                ? "text-green-600"
                                                : persenKehadiran >= 50
                                                ? "text-yellow-600"
                                                : "text-red-600";

                                        return (
                                            <tr
                                                key={mhs.id_mahasiswa}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold">
                                                        {mhs.nim}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-800">
                                                        {mhs.nama}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center">
                                                        <div className="w-full max-w-xs">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span
                                                                    className={`text-xs font-bold ${statusColor}`}
                                                                >
                                                                    {
                                                                        persenKehadiran
                                                                    }
                                                                    %
                                                                </span>
                                                                <span className="text-xs text-gray-500">
                                                                    {mhs.hadir ||
                                                                        0}
                                                                    /
                                                                    {mhs.total_pertemuan ||
                                                                        0}
                                                                </span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full transition-all ${
                                                                        persenKehadiran >=
                                                                        75
                                                                            ? "bg-green-500"
                                                                            : persenKehadiran >=
                                                                              50
                                                                            ? "bg-yellow-500"
                                                                            : "bg-red-500"
                                                                    }`}
                                                                    style={{
                                                                        width: `${persenKehadiran}%`,
                                                                    }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {persenKehadiran >= 80 ? (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                                            Boleh Ujian
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                                                            Tidak Boleh Ujian
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() =>
                                                            handleShowDetail(
                                                                mhs
                                                            )
                                                        }
                                                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                                                    >
                                                        <i className="fas fa-eye mr-2"></i>
                                                        Detail
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <i className="fas fa-user-graduate text-gray-400 text-5xl mb-4"></i>
                            <p className="text-gray-500 text-lg">
                                Tidak ada mahasiswa
                            </p>
                            <p className="text-gray-400 text-sm mt-2">
                                Belum ada mahasiswa terdaftar di kelas ini
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Detail Presensi */}
            {showModal && selectedMahasiswa && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">
                                    Detail Presensi
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {selectedMahasiswa.nama} -{" "}
                                    {selectedMahasiswa.nim}
                                </p>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                            {/* Info Summary */}
                            <div className="grid grid-cols-4 gap-4 mb-6">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-sm text-gray-600">
                                        Matakuliah
                                    </div>
                                    <div className="font-semibold text-gray-800">
                                        {namaMatkul}
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-sm text-gray-600">
                                        SKS
                                    </div>
                                    <div className="font-semibold text-gray-800">
                                        {sks} SKS
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-sm text-gray-600">
                                        Dosen Pengampu
                                    </div>
                                    <div className="font-semibold text-gray-800">
                                        {namaDosen}
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-sm text-gray-600">
                                        Pertemuan
                                    </div>
                                    <div className="font-semibold text-gray-800">
                                        {selectedMahasiswa.total_pertemuan}x
                                        Pertemuan /{" "}
                                        {selectedMahasiswa.total_pertemuan * 2}{" "}
                                        Jam
                                    </div>
                                </div>
                            </div>

                            {/* Presensi Table */}
                            <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                                                #
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                                                Tanggal
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">
                                                Jam
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">
                                                Waktu
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">
                                                Keterangan
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {selectedMahasiswa.presensi_detail?.map(
                                            (presensi, index) => (
                                                <tr
                                                    key={index}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {presensi.pertemuan_ke}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">
                                                        {new Date(
                                                            presensi.tanggal
                                                        ).toLocaleDateString(
                                                            "id-ID",
                                                            {
                                                                day: "numeric",
                                                                month: "long",
                                                                year: "numeric",
                                                            }
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-sm text-gray-700">
                                                        {sks * 50} Menit
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-sm text-gray-700">
                                                        {jamMulai} - {jamSelesai}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        {presensi.status ===
                                                        "hadir" ? (
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                                                <i className="fas fa-check-circle mr-1"></i>
                                                                Hadir
                                                            </span>
                                                        ) : presensi.status ===
                                                          "alpha" ? (
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                                                                <i className="fas fa-times-circle mr-1"></i>
                                                                Alpha
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold">
                                                                <i className="fas fa-minus-circle mr-1"></i>
                                                                Belum Absen
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
                            <button
                                onClick={handleCloseModal}
                                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DosenLayout>
    );
}
