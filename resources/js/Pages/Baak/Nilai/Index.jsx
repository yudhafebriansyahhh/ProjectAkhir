import { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import BaakLayout from "@/Layouts/BaakLayout";
import Swal from "sweetalert2";
import Select from "react-select";

export default function Index({
    kelas,
    prodis,
    dosens,
    periodeList,
    filters,
    periodStats,
}) {
    const [search, setSearch] = useState(filters?.search || "");

    // ✅ Safe initialization
    const [selectedPeriode, setSelectedPeriode] = useState(() => {
        if (!periodeList || !Array.isArray(periodeList)) return null;
        if (filters?.tahun_ajaran && filters?.jenis_semester) {
            return (
                periodeList.find(
                    (p) =>
                        p.tahun_ajaran === filters.tahun_ajaran &&
                        p.jenis_semester === filters.jenis_semester
                ) || null
            );
        }
        return null;
    });

    const [selectedProdi, setSelectedProdi] = useState(() => {
        if (!prodis || !Array.isArray(prodis)) return null;
        if (filters?.prodi) {
            return prodis.find((p) => p.kode_prodi === filters.prodi) || null;
        }
        return null;
    });

    const [selectedDosen, setSelectedDosen] = useState(() => {
        if (!dosens || !Array.isArray(dosens)) return null;
        if (filters?.dosen) {
            return dosens.find((d) => d.id_dosen === filters.dosen) || null;
        }
        return null;
    });

    const [statusNilai, setStatusNilai] = useState(filters?.status_nilai || "");

    // ✅ AUTO-LOAD
    useEffect(() => {
        if (selectedPeriode) {
            const timeoutId = setTimeout(() => {
                router.get(
                    route("baak.nilai.index"),
                    {
                        search,
                        tahun_ajaran: selectedPeriode.tahun_ajaran,
                        jenis_semester: selectedPeriode.jenis_semester,
                        prodi: selectedProdi?.kode_prodi || "",
                        dosen: selectedDosen?.id_dosen || "",
                        status_nilai: statusNilai,
                    },
                    {
                        preserveState: true,
                        preserveScroll: true,
                    }
                );
            }, 300);
            return () => clearTimeout(timeoutId);
        }
    }, [selectedPeriode, selectedProdi, selectedDosen, statusNilai, search]);

    const handleReset = () => {
        setSearch("");
        setSelectedPeriode(null);
        setSelectedProdi(null);
        setSelectedDosen(null);
        setStatusNilai("");
        router.get(route("baak.nilai.index"));
    };

    const handleBulkLock = (action) => {
        if (!selectedPeriode) {
            Swal.fire({
                icon: "warning",
                title: "Pilih Periode Dulu",
                text: "Silakan pilih Periode terlebih dahulu",
                confirmButtonColor: "#3B82F6",
            });
            return;
        }

        const actionText = action === "lock" ? "Lock" : "Unlock";
        const confirmText =
            action === "lock"
                ? "Semua nilai di periode ini akan di-lock dan tidak dapat diubah oleh dosen."
                : "Semua nilai di periode ini akan di-unlock dan dapat diubah kembali oleh dosen.";

        const warningText =
            action === "lock" && periodStats?.nilai_kosong > 0
                ? `<div class="bg-yellow-50 border border-yellow-200 rounded p-2 mt-2">
                <p class="text-sm text-yellow-800">
                    ⚠️ <strong>${periodStats.nilai_kosong} nilai masih kosong</strong> dan akan diisi otomatis dengan nilai 0 (E).
                </p>
               </div>`
                : "";

        Swal.fire({
            title: `${actionText} Semua Nilai Periode?`,
            html: `
                <div class="text-left">
                    <p class="mb-3">${confirmText}</p>
                    <div class="bg-blue-50 border border-blue-200 rounded p-3 text-sm space-y-1">
                        <p><strong>Periode:</strong> ${
                            selectedPeriode.label
                        }</p>
                        ${
                            selectedProdi
                                ? `<p><strong>Prodi:</strong> ${selectedProdi.nama_prodi}</p>`
                                : "<p><strong>Scope:</strong> Semua Prodi</p>"
                        }
                        ${
                            periodStats
                                ? `
                            <p><strong>Total Kelas:</strong> ${periodStats.total_kelas}</p>
                            <p><strong>Total Mahasiswa:</strong> ${periodStats.total_mahasiswa}</p>
                            <p><strong>Nilai Sudah Diinput:</strong> ${periodStats.total_nilai} (${periodStats.persen_nilai}%)</p>
                            <p><strong>Nilai Kosong:</strong> ${periodStats.nilai_kosong}</p>
                        `
                                : ""
                        }
                    </div>
                    ${warningText}
                </div>
            `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: action === "lock" ? "#16a34a" : "#3b82f6",
            cancelButtonColor: "#6b7280",
            confirmButtonText: `Ya, ${actionText}!`,
            cancelButtonText: "Batal",
            width: "600px",
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(
                    route("baak.nilai.bulk-lock"),
                    {
                        tahun_ajaran: selectedPeriode.tahun_ajaran,
                        jenis_semester: selectedPeriode.jenis_semester,
                        kode_prodi: selectedProdi?.kode_prodi || null,
                        action: action,
                        auto_fill_empty: true,
                    },
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            Swal.fire({
                                icon: "success",
                                title: "Berhasil!",
                                text: `Nilai berhasil di-${action} untuk periode ini.`,
                                timer: 2000,
                                showConfirmButton: false,
                            });
                        },
                        onError: () => {
                            Swal.fire({
                                icon: "error",
                                title: "Gagal!",
                                text: "Terjadi kesalahan. Silakan coba lagi.",
                                confirmButtonColor: "#dc2626",
                            });
                        },
                    }
                );
            }
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            belum: "bg-red-100 text-red-700",
            sebagian: "bg-yellow-100 text-yellow-700",
            lengkap: "bg-green-100 text-green-700",
        };
        return badges[status] || "bg-gray-100 text-gray-700";
    };

    const getStatusLabel = (status) => {
        const labels = {
            belum: "Belum Diinput",
            sebagian: "Sebagian",
            lengkap: "Lengkap",
        };
        return labels[status] || status;
    };

    // ✅ CUSTOM STYLES
    const customSelectStyles = {
        control: (base, state) => ({
            ...base,
            minHeight: "38px",
            borderColor: state.isFocused ? "#3B82F6" : "#D1D5DB",
            borderWidth: state.isFocused ? "2px" : "1px",
            boxShadow: state.isFocused ? "0 0 0 1px #3B82F6" : "none",
            "&:hover": {
                borderColor: "#3B82F6",
            },
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
        }),
        valueContainer: (base) => ({
            ...base,
            padding: "2px 12px",
        }),
        input: (base) => ({
            ...base,
            margin: "0 !important",
            padding: "0 !important",
            caretColor: "#111827",
            "& input": {
                outline: "none !important",
                border: "none !important",
                boxShadow: "none !important",
            },
            "& input:focus": {
                outline: "none !important",
                border: "none !important",
                boxShadow: "none !important",
            },
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? "#3B82F6"
                : state.isFocused
                ? "#EFF6FF"
                : "white",
            color: state.isSelected ? "white" : "#374151",
            fontSize: "0.875rem",
            padding: "8px 12px",
            cursor: "pointer",
            "&:active": {
                backgroundColor: "#3B82F6",
            },
        }),
        placeholder: (base) => ({
            ...base,
            fontSize: "0.875rem",
            color: "#9CA3AF",
            fontWeight: "400",
        }),
        singleValue: (base) => ({
            ...base,
            fontSize: "0.875rem",
            fontWeight: "500",
            color: "#111827",
        }),
        menu: (base) => ({
            ...base,
            zIndex: 50,
            marginTop: "4px",
            boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }),
        menuList: (base) => ({
            ...base,
            padding: "4px",
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: "#9CA3AF",
            padding: "8px",
            "&:hover": {
                color: "#3B82F6",
            },
            transition: "all 0.2s",
            transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : null,
        }),
        indicatorSeparator: () => ({
            display: "none",
        }),
        clearIndicator: (base) => ({
            ...base,
            color: "#9CA3AF",
            padding: "8px",
            cursor: "pointer",
            "&:hover": {
                color: "#EF4444",
            },
        }),
    };
    // ✅ PREPARE OPTIONS
    const periodeOptions = Array.isArray(periodeList) ? periodeList : [];
    const prodiOptions = Array.isArray(prodis)
        ? prodis.map((p) => ({
              value: p.kode_prodi,
              label: p.nama_prodi,
              ...p,
          }))
        : [];
    const dosenOptions = Array.isArray(dosens)
        ? dosens.map((d) => ({
              value: d.id_dosen,
              label: d.nama,
              ...d,
          }))
        : [];

    return (
        <BaakLayout title="Manajemen Nilai">
            <Head title="Manajemen Nilai" />

            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">
                        Manajemen Nilai
                    </h1>
                    <p className="text-gray-600">
                        Monitor dan kelola nilai mahasiswa per periode
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* Periode */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Periode <span className="text-red-500">*</span>
                            </label>
                            <Select
                                value={selectedPeriode}
                                onChange={setSelectedPeriode}
                                options={periodeOptions}
                                styles={customSelectStyles}
                                placeholder="Pilih Periode..."
                                isClearable
                                isSearchable
                                noOptionsMessage={() => "Tidak ada data"}
                                autoComplete="off"
                                inputProps={{
                                    autoComplete: "off",
                                    autoCorrect: "off",
                                    spellCheck: "false",
                                }}
                            />
                        </div>

                        {/* Prodi */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Program Studi
                            </label>
                            <Select
                                value={selectedProdi}
                                onChange={setSelectedProdi}
                                options={prodiOptions}
                                styles={customSelectStyles}
                                placeholder="Semua Prodi"
                                isClearable
                                isSearchable
                                isDisabled={!selectedPeriode}
                                noOptionsMessage={() => "Tidak ada data"}
                                autoComplete="off"
                            />
                        </div>

                        {/* Dosen */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Dosen Pengampu
                            </label>
                            <Select
                                value={selectedDosen}
                                onChange={setSelectedDosen}
                                options={dosenOptions}
                                styles={customSelectStyles}
                                placeholder="Semua Dosen"
                                isClearable
                                isSearchable
                                isDisabled={!selectedPeriode}
                                noOptionsMessage={() => "Tidak ada data"}
                                autoComplete="off"
                            />
                        </div>

                        {/* Status Nilai */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Status Input
                            </label>
                            <select
                                value={statusNilai}
                                onChange={(e) => setStatusNilai(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                disabled={!selectedPeriode}
                                autoComplete="off"
                            >
                                <option value="">Semua Status</option>
                                <option value="belum">Belum Diinput</option>
                                <option value="sebagian">Sebagian</option>
                                <option value="lengkap">Lengkap</option>
                            </select>
                        </div>
                    </div>

                    {/* Search Box */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Pencarian
                            </label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari Mata Kuliah atau Kelas..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                disabled={!selectedPeriode}
                                autoComplete="off"
                            />
                        </div>

                        {/* Reset Button */}
                        {(search ||
                            selectedPeriode ||
                            selectedProdi ||
                            selectedDosen ||
                            statusNilai) && (
                            <div className="flex items-end">
                                <button
                                    onClick={handleReset}
                                    className="w-full md:w-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 flex items-center justify-center gap-2 transition-colors"
                                >
                                    <i className="fas fa-redo"></i>
                                    <span>Reset Filter</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Info Badge */}
                    {!selectedPeriode && (
                        <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                            <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
                            <p className="text-sm text-blue-800">
                                Pilih <strong>Periode</strong> terlebih dahulu
                                untuk melihat data nilai
                            </p>
                        </div>
                    )}
                </div>

                {/* Period Stats & Bulk Lock */}
                {selectedPeriode && periodStats && (
                    <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <i className="fas fa-chart-bar text-blue-600"></i>
                                    Statistik Periode {selectedPeriode.label}
                                    {selectedProdi &&
                                        ` - ${selectedProdi.nama_prodi}`}
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                    <div className="bg-white rounded p-2">
                                        <p className="text-gray-600">
                                            Total Kelas
                                        </p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {periodStats.total_kelas}
                                        </p>
                                    </div>
                                    <div className="bg-white rounded p-2">
                                        <p className="text-gray-600">
                                            Total Mahasiswa
                                        </p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {periodStats.total_mahasiswa}
                                        </p>
                                    </div>
                                    <div className="bg-white rounded p-2">
                                        <p className="text-gray-600">
                                            Nilai Terisi
                                        </p>
                                        <p className="text-lg font-bold text-green-600">
                                            {periodStats.total_nilai} (
                                            {periodStats.persen_nilai}%)
                                        </p>
                                    </div>
                                    <div className="bg-white rounded p-2">
                                        <p className="text-gray-600">
                                            Nilai Kosong
                                        </p>
                                        <p className="text-lg font-bold text-red-600">
                                            {periodStats.nilai_kosong}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleBulkLock("lock")}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap"
                                >
                                    <i className="fas fa-lock"></i>
                                    <span>Lock All</span>
                                </button>
                                <button
                                    onClick={() => handleBulkLock("unlock")}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap"
                                >
                                    <i className="fas fa-lock-open"></i>
                                    <span>Unlock All</span>
                                </button>
                            </div>
                        </div>

                        {/* Warnings */}
                        {periodStats.nilai_kosong > 0 && (
                            <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                                <i className="fas fa-exclamation-triangle text-yellow-600 mt-0.5"></i>
                                <p className="text-sm text-yellow-800">
                                    <strong>
                                        {periodStats.nilai_kosong} nilai masih
                                        kosong.
                                    </strong>{" "}
                                    Jika Anda lock periode ini, nilai kosong
                                    akan otomatis diisi dengan nilai 0 (Grade
                                    E).
                                </p>
                            </div>
                        )}

                        {periodStats.persen_locked === 100 && (
                            <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                                <i className="fas fa-check-circle text-green-600 mt-0.5"></i>
                                <p className="text-sm text-green-800">
                                    <strong>Semua nilai sudah di-lock.</strong>{" "}
                                    Periode ini sudah difinalisasi.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Table - Desktop */}
                {selectedPeriode && kelas?.data && kelas.data.length > 0 ? (
                    <div className="hidden md:block bg-white rounded-lg overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr className="text-gray-600 font-semibold text-xs">
                                        <th className="px-6 py-4 text-left uppercase tracking-wider">
                                            No
                                        </th>
                                        <th className="px-6 py-3 text-left uppercase tracking-wider">
                                            Kode MK
                                        </th>
                                        <th className="px-6 py-3 text-left uppercase tracking-wider">
                                            Mata Kuliah
                                        </th>
                                        <th className="px-6 py-3 text-center uppercase tracking-wider">
                                            Kelas
                                        </th>
                                        <th className="px-6 py-3 text-left uppercase tracking-wider">
                                            Dosen
                                        </th>
                                        <th className="px-6 py-3 text-center uppercase tracking-wider">
                                            Jumlah Mhs
                                        </th>
                                        <th className="px-6 py-3 text-center uppercase tracking-wider">
                                            Status Input
                                        </th>
                                        <th className="px-6 py-3 text-center uppercase tracking-wider">
                                            Status Lock
                                        </th>
                                        <th className="px-6 py-3 text-center uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {kelas.data.map((item, index) => (
                                        <tr
                                            key={item.id_kelas}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {kelas.from + index}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {
                                                    item.mata_kuliah_periode
                                                        ?.mata_kuliah
                                                        ?.kode_matkul
                                                }
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {
                                                    item.mata_kuliah_periode
                                                        ?.mata_kuliah
                                                        ?.nama_matkul
                                                }
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                                                Kelas {item.nama_kelas}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {item.dosen?.nama}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                                                {item.nilai_count}/
                                                {item.total_mahasiswa}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span
                                                    className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${getStatusBadge(
                                                        item.status_input
                                                    )}`}
                                                >
                                                    {getStatusLabel(
                                                        item.status_input
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {item.is_locked ? (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700">
                                                        <i className="fas fa-lock mr-1"></i>{" "}
                                                        Locked
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                                                        <i className="fas fa-lock-open mr-1"></i>{" "}
                                                        Unlocked
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                <Link
                                                    href={route(
                                                        "baak.nilai.show",
                                                        item.id_kelas
                                                    )}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                                >
                                                    <i className="fas fa-eye"></i>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {kelas.last_page > 1 && (
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Menampilkan {kelas.from} - {kelas.to} dari{" "}
                                    {kelas.total} data
                                </div>
                                <div className="flex gap-2">
                                    {kelas.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || "#"}
                                            preserveState
                                            preserveScroll
                                            className={`px-3 py-1 text-sm rounded ${
                                                link.active
                                                    ? "bg-blue-600 text-white"
                                                    : link.url
                                                    ? "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : selectedPeriode &&
                  kelas?.data &&
                  kelas.data.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <i className="fas fa-inbox text-6xl mb-4 text-gray-300"></i>
                        <p className="text-gray-600 font-medium mb-2">
                            Tidak ada data kelas
                        </p>
                        <p className="text-sm text-gray-500">
                            Silakan ubah filter untuk melihat data lainnya
                        </p>
                    </div>
                ) : null}

                {/* Cards - Mobile - ✅ FIXED: Ganti tahunAjaran jadi selectedPeriode */}
                {selectedPeriode && kelas?.data && kelas.data.length > 0 && (
                    <div className="block md:hidden space-y-4">
                        {kelas.data.map((item) => (
                            <div
                                key={item.id_kelas}
                                className="bg-white rounded-lg border border-gray-200 p-4"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {
                                                item.mata_kuliah_periode
                                                    ?.mata_kuliah?.nama_matkul
                                            }
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {
                                                item.mata_kuliah_periode
                                                    ?.mata_kuliah?.kode_matkul
                                            }{" "}
                                            - Kelas {item.nama_kelas}
                                        </p>
                                    </div>
                                    <span
                                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusBadge(
                                            item.status_input
                                        )}`}
                                    >
                                        {getStatusLabel(item.status_input)}
                                    </span>
                                </div>
                                <div className="space-y-1 mb-3 text-sm">
                                    <p className="text-gray-600">
                                        <span className="font-medium">
                                            Dosen:
                                        </span>{" "}
                                        {item.dosen?.nama}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">
                                            Mahasiswa:
                                        </span>{" "}
                                        {item.nilai_count}/
                                        {item.total_mahasiswa}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">
                                            Status:
                                        </span>{" "}
                                        {item.is_locked ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs font-medium">
                                                <i className="fas fa-lock mr-1"></i>{" "}
                                                Locked
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-xs font-medium">
                                                <i className="fas fa-lock-open mr-1"></i>{" "}
                                                Unlocked
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <Link
                                    href={route(
                                        "baak.nilai.show",
                                        item.id_kelas
                                    )}
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium text-center block transition-colors"
                                >
                                    <i className="fas fa-eye mr-2"></i> Lihat
                                    Detail
                                </Link>
                            </div>
                        ))}

                        {/* Pagination Mobile */}
                        {kelas.last_page > 1 && (
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="text-sm text-gray-600 mb-3 text-center">
                                    Menampilkan {kelas.from} - {kelas.to} dari{" "}
                                    {kelas.total} data
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {kelas.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || "#"}
                                            preserveState
                                            preserveScroll
                                            className={`px-3 py-1 text-sm rounded ${
                                                link.active
                                                    ? "bg-blue-600 text-white"
                                                    : link.url
                                                    ? "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </BaakLayout>
    );
}
