// resources/js/Layouts/BaakLayout.jsx - COMPLETE STANDARDIZED VERSION

import { useState, useEffect } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";

export default function BaakLayout({ children, title }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Helper function untuk cek route aktif
    const isActive = (routeName) => {
        return route().current(routeName) || route().current(`${routeName}.*`);
    };

    // Helper function untuk cek parent aktif
    const isParentActive = (routeNames) => {
        return routeNames.some((name) => isActive(name));
    };

    // State untuk dropdown menus
    const [masterDataOpen, setMasterDataOpen] = useState(
        isParentActive(["baak.fakultas", "baak.prodi", "baak.mata-kuliah"])
    );
    const [civitasOpen, setCivitasOpen] = useState(
        isParentActive(["baak.dosen", "baak.mahasiswa"])
    );
    const [perkuliahanOpen, setPerkuliahanOpen] = useState(
        isParentActive(["baak.kelas", "baak.krs"])
    );
    const [akademikOpen, setAkademikOpen] = useState(
        isParentActive([
            "baak.periode-registrasi",
            "baak.jadwal-krs",
            "baak.registrasi-semester",
            "baak.pengaturan-krs"
        ])
    );

    // Update dropdown state saat route berubah
    useEffect(() => {
        setMasterDataOpen(
            isParentActive(["baak.fakultas", "baak.prodi", "baak.mata-kuliah"])
        );
        setCivitasOpen(
            isParentActive(["baak.dosen", "baak.mahasiswa"])
        );
        setPerkuliahanOpen(
            isParentActive(["baak.kelas", "baak.krs"])
        );
        setAkademikOpen(
            isParentActive([
                "baak.periode-registrasi",
                "baak.jadwal-krs",
                "baak.registrasi-semester",
                "baak.pengaturan-krs"
            ])
        );
    }, [route().current()]);

    // Handle logout dengan konfirmasi
    const handleLogout = () => {
        if (window.Swal) {
            window.Swal.fire({
                title: "Yakin ingin logout?",
                text: "Anda akan keluar dari sesi sekarang.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Ya, logout",
                cancelButtonText: "Batal",
                confirmButtonColor: "#dc2626",
                cancelButtonColor: "#6b7280",
            }).then((result) => {
                if (result.isConfirmed) {
                    router.post(route("logout"));
                }
            });
        } else {
            if (confirm("Yakin ingin logout?")) {
                router.post(route("logout"));
            }
        }
    };

    return (
        <>
            <Head>
                <title>
                    {title ? `${title} - SIAKAD ITB Riau` : "SIAKAD ITB Riau"}
                </title>
                <link
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
                    rel="stylesheet"
                />
                <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            </Head>

            <div className="flex min-h-screen bg-gray-100">
                {/* Overlay untuk mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`fixed lg:fixed z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 inset-y-0 left-0 flex flex-col ${
                        sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    {/* Logo Section - Fixed */}
                    <div className="flex-shrink-0 p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
                        <div className="flex flex-col items-center">
                            <img
                                src="/ITBR.jpeg"
                                className="w-14 h-14 p-1 bg-white rounded-full mb-3 shadow-sm"
                                alt="ITB Riau Logo"
                            />
                            <h2 className="text-sm font-semibold text-white">
                                ITB Riau
                            </h2>
                            <p className="text-xs text-blue-100">BAAK</p>
                        </div>
                    </div>

                    {/* User Profile Section - Fixed */}
                    <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover"
                                        src="/ITBR.jpeg"
                                        alt="Profile"
                                    />
                                </div>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {auth?.user?.name || "Admin BAAK"}
                                </p>
                                <p className="text-xs text-gray-600 truncate">
                                    {auth?.user?.email || "baak@itbriau.ac.id"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Menu - Scrollable */}
                    <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                        <div className="py-4 px-3 space-y-1">

                            {/* ================================ */}
                            {/* DASHBOARD */}
                            {/* ================================ */}
                            <Link
                                href={route("baak.dashboard")}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive("baak.dashboard")
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                }`}
                            >
                                <i className="fas fa-home w-5 text-center"></i>
                                <span className="text-sm font-medium">Dashboard</span>
                            </Link>

                            {/* ================================ */}
                            {/* MASTER DATA DROPDOWN */}
                            {/* ================================ */}
                            <div>
                                <button
                                    onClick={() => setMasterDataOpen(!masterDataOpen)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                                        isParentActive(["baak.fakultas", "baak.prodi", "baak.mata-kuliah"])
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <i className="fas fa-database w-5 text-center"></i>
                                        <span className="text-sm font-medium">Master Data</span>
                                    </div>
                                    <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${masterDataOpen ? "rotate-180" : ""}`}></i>
                                </button>

                                <div className={`mt-1 space-y-1 overflow-hidden transition-all duration-300 ${masterDataOpen ? "max-h-48" : "max-h-0"}`}>
                                    <Link
                                        href={route("baak.fakultas.index")}
                                        className={`flex items-center space-x-3 px-4 py-2 ml-6 rounded-lg text-sm transition-colors ${
                                            isActive("baak.fakultas") ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                                        }`}
                                    >
                                        <i className="fas fa-building w-4 text-center"></i>
                                        <span>Fakultas</span>
                                    </Link>
                                    <Link
                                        href={route("baak.prodi.index")}
                                        className={`flex items-center space-x-3 px-4 py-2 ml-6 rounded-lg text-sm transition-colors ${
                                            isActive("baak.prodi") ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                                        }`}
                                    >
                                        <i className="fas fa-graduation-cap w-4 text-center"></i>
                                        <span>Program Studi</span>
                                    </Link>
                                    <Link
                                        href={route("baak.mata-kuliah.index")}
                                        className={`flex items-center space-x-3 px-4 py-2 ml-6 rounded-lg text-sm transition-colors ${
                                            isActive("baak.mata-kuliah") ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                                        }`}
                                    >
                                        <i className="fas fa-book w-4 text-center"></i>
                                        <span>Mata Kuliah</span>
                                    </Link>
                                </div>
                            </div>

                            {/* ================================ */}
                            {/* CIVITAS AKADEMIKA DROPDOWN */}
                            {/* ================================ */}
                            <div>
                                <button
                                    onClick={() => setCivitasOpen(!civitasOpen)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                                        isParentActive(["baak.dosen", "baak.mahasiswa"])
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <i className="fas fa-users w-5 text-center"></i>
                                        <span className="text-sm font-medium">Civitas Akademika</span>
                                    </div>
                                    <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${civitasOpen ? "rotate-180" : ""}`}></i>
                                </button>

                                <div className={`mt-1 space-y-1 overflow-hidden transition-all duration-300 ${civitasOpen ? "max-h-48" : "max-h-0"}`}>
                                    <Link
                                        href={route("baak.dosen.index")}
                                        className={`flex items-center space-x-3 px-4 py-2 ml-6 rounded-lg text-sm transition-colors ${
                                            isActive("baak.dosen") ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                                        }`}
                                    >
                                        <i className="fas fa-chalkboard-teacher w-4 text-center"></i>
                                        <span>Dosen</span>
                                    </Link>
                                    <Link
                                        href={route("baak.mahasiswa.index")}
                                        className={`flex items-center space-x-3 px-4 py-2 ml-6 rounded-lg text-sm transition-colors ${
                                            isActive("baak.mahasiswa") ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                                        }`}
                                    >
                                        <i className="fas fa-user-graduate w-4 text-center"></i>
                                        <span>Mahasiswa</span>
                                    </Link>
                                </div>
                            </div>

                            {/* ================================ */}
                            {/* PERKULIAHAN DROPDOWN */}
                            {/* ================================ */}
                            <div>
                                <button
                                    onClick={() => setPerkuliahanOpen(!perkuliahanOpen)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                                        isParentActive(["baak.kelas", "baak.krs"])
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <i className="fas fa-chalkboard w-5 text-center"></i>
                                        <span className="text-sm font-medium">Perkuliahan</span>
                                    </div>
                                    <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${perkuliahanOpen ? "rotate-180" : ""}`}></i>
                                </button>

                                <div className={`mt-1 space-y-1 overflow-hidden transition-all duration-300 ${perkuliahanOpen ? "max-h-48" : "max-h-0"}`}>
                                    <Link
                                        href={route("baak.kelas.index")}
                                        className={`flex items-center space-x-3 px-4 py-2 ml-6 rounded-lg text-sm transition-colors ${
                                            isActive("baak.kelas") ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                                        }`}
                                    >
                                        <i className="fas fa-door-open w-4 text-center"></i>
                                        <span>Kelas</span>
                                    </Link>
                                    <Link
                                        href={route("baak.krs.index")}
                                        className={`flex items-center space-x-3 px-4 py-2 ml-6 rounded-lg text-sm transition-colors ${
                                            isActive("baak.krs") ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                                        }`}
                                    >
                                        <i className="fas fa-clipboard-list w-4 text-center"></i>
                                        <span>Monitoring KRS</span>
                                    </Link>
                                </div>
                            </div>

                            {/* ================================ */}
                            {/* AKADEMIK DROPDOWN */}
                            {/* ================================ */}
                            <div>
                                <button
                                    onClick={() => setAkademikOpen(!akademikOpen)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                                        isParentActive([
                                            "baak.periode-registrasi",
                                            "baak.jadwal-krs",
                                            "baak.registrasi-semester",
                                            "baak.pengaturan-krs"
                                        ])
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <i className="fas fa-calendar-check w-5 text-center"></i>
                                        <span className="text-sm font-medium">Akademik</span>
                                    </div>
                                    <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${akademikOpen ? "rotate-180" : ""}`}></i>
                                </button>

                                <div className={`mt-1 space-y-1 overflow-hidden transition-all duration-300 ${akademikOpen ? "max-h-72" : "max-h-0"}`}>
                                    <Link
                                        href={route("baak.periode-registrasi.index")}
                                        className={`flex items-center space-x-3 px-4 py-2 ml-6 rounded-lg text-sm transition-colors ${
                                            isActive("baak.periode-registrasi") ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                                        }`}
                                    >
                                        <i className="fas fa-calendar-plus w-4 text-center"></i>
                                        <span>Periode Registrasi</span>
                                    </Link>
                                    <Link
                                        href={route("baak.jadwal-krs.index")}
                                        className={`flex items-center space-x-3 px-4 py-2 ml-6 rounded-lg text-sm transition-colors ${
                                            isActive("baak.jadwal-krs") ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                                        }`}
                                    >
                                        <i className="fas fa-clock w-4 text-center"></i>
                                        <span>Jadwal KRS</span>
                                    </Link>
                                    <Link
                                        href={route("baak.registrasi-semester.index")}
                                        className={`flex items-center space-x-3 px-4 py-2 ml-6 rounded-lg text-sm transition-colors ${
                                            isActive("baak.registrasi-semester") ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                                        }`}
                                    >
                                        <i className="fas fa-user-check w-4 text-center"></i>
                                        <span>Registrasi Mahasiswa</span>
                                    </Link>
                                    <Link
                                        href={route("baak.pengaturan-krs.index")}
                                        className={`flex items-center space-x-3 px-4 py-2 ml-6 rounded-lg text-sm transition-colors ${
                                            isActive("baak.pengaturan-krs") ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                                        }`}
                                    >
                                        <i className="fas fa-cog w-4 text-center"></i>
                                        <span>Pengaturan MK KRS</span>
                                    </Link>
                                </div>
                            </div>

                            {/* ================================ */}
                            {/* LAPORAN (Placeholder) */}
                            {/* ================================ */}
                            <Link
                                href="#"
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                            >
                                <i className="fas fa-chart-bar w-5 text-center"></i>
                                <span className="text-sm font-medium">Laporan</span>
                            </Link>

                            {/* Extra spacing untuk scrolling */}
                            <div className="h-4"></div>
                        </div>
                    </nav>

                    {/* Logout Button - Fixed di Bottom */}
                    <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 font-medium"
                        >
                            <i className="fas fa-sign-out-alt"></i>
                            <span className="text-sm">Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 lg:ml-64">
                    {/* Topbar (Mobile Only) */}
                    <header className="lg:hidden bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-30">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="text-gray-700 focus:outline-none"
                        >
                            <i className="fas fa-bars text-xl"></i>
                        </button>
                        <h1 className="text-lg font-semibold text-gray-800">
                            SIAKAD ITB Riau
                        </h1>
                        <div className="w-6"></div>
                    </header>

                    {/* Main Content */}
                    <main className="min-h-screen bg-gray-100">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
