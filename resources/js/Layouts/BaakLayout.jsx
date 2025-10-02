import { useState } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";

export default function BaakLayout({ children, title }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [masterDataOpen, setMasterDataOpen] = useState(false);
    const [kepegawaianOpen, setKepegawaianOpen] = useState(false);
    const [perkuliahanOpen, setPerkuliahanOpen] = useState(false);
    const [akademikOpen, setAkademikOpen] = useState(false);

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

    const isActive = (routeName) => {
        return route().current(routeName) || route().current(`${routeName}.*`);
    };

    const isParentActive = (routeNames) => {
        return routeNames.some((name) => isActive(name));
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
                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`fixed lg:block z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 h-screen flex flex-col ${
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
                            <div className="flex items-center justify-center">
                                <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                                    <img
                                        className="w-12 h-12 rounded-full"
                                        src="/ITBR.jpeg"
                                        alt="Profile"
                                    />
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {auth?.user?.name || "Admin BAAK"}
                                </p>
                                <p className="text-xs text-gray-600">
                                    {auth?.user?.email || "baak@itbriau.ac.id"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Menu - Scrollable */}
                    <nav className="flex-1 overflow-y-auto py-4">
                        <div className="px-4 space-y-1">
                            {/* Dashboard */}
                            <Link
                                href={route("baak.dashboard")}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive("baak.dashboard")
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                }`}
                            >
                                <i className="fas fa-home w-5"></i>
                                <span className="text-sm font-medium">
                                    Dashboard
                                </span>
                            </Link>

                            {/* Master Data Dropdown */}
                            <div>
                                <button
                                    onClick={() =>
                                        setMasterDataOpen(!masterDataOpen)
                                    }
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                                        isParentActive([
                                            "baak.fakultas",
                                            "baak.prodi",
                                            "baak.mata-kuliah",
                                        ])
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <i className="fas fa-database w-5"></i>
                                        <span className="text-sm font-medium">
                                            Master Data
                                        </span>
                                    </div>
                                    <i
                                        className={`fas fa-chevron-down text-xs transition-transform ${
                                            masterDataOpen ? "rotate-180" : ""
                                        }`}
                                    ></i>
                                </button>

                                <div
                                    className={`mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                                        masterDataOpen ? "max-h-48" : "max-h-0"
                                    }`}
                                >
                                    <Link
                                        href={route("baak.fakultas.index")}
                                        className={`flex items-center space-x-3 px-4 py-2 ml-6 rounded-lg text-sm transition-colors ${
                                            isActive("baak.fakultas")
                                                ? "bg-blue-600 text-white"
                                                : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                                        }`}
                                    >
                                        <i className="fas fa-building w-4"></i>
                                        <span>Fakultas</span>
                                    </Link>
                                    <Link
                                        href={route("baak.prodi.index")}
                                        className={`flex items-center space-x-3 px-4 py-2 ml-6 rounded-lg text-sm transition-colors ${
                                            isActive("baak.prodi")
                                                ? "bg-blue-600 text-white"
                                                : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                                        }`}
                                    >
                                        <i className="fas fa-graduation-cap w-4"></i>
                                        <span>Program Studi</span>
                                    </Link>
                                    <Link
                                        href={route("baak.mata-kuliah.index")}
                                        className={`flex items-center space-x-3 px-4 py-2 ml-6 rounded-lg text-sm transition-colors ${
                                            isActive("baak.mata-kuliah")
                                                ? "bg-blue-600 text-white"
                                                : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                                        }`}
                                    >
                                        <i className="fas fa-book w-4"></i>
                                        <span>Mata Kuliah</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Kepegawaian & Kemahasiswaan Dropdown */}
                            <div>
                                <button
                                    onClick={() =>
                                        setKepegawaianOpen(!kepegawaianOpen)
                                    }
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                                        isParentActive([
                                            "baak.dosen",
                                            "baak.mahasiswa",
                                        ])
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <i className="fas fa-users w-5"></i>
                                        <span className="text-sm font-medium">
                                            Civitas Akademika
                                        </span>
                                    </div>
                                    <i
                                        className={`fas fa-chevron-down text-xs transition-transform ${
                                            kepegawaianOpen ? "rotate-180" : ""
                                        }`}
                                    ></i>
                                </button>

                                <div
                                    className={`mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                                        kepegawaianOpen ? "max-h-48" : "max-h-0"
                                    }`}
                                >
                                    <Link
                                        href={route("baak.dosen.index")}
                                        className={`flex items-center space-x-3 px-4 py-2 ml-6 rounded-lg text-sm transition-colors ${
                                            isActive("baak.dosen")
                                                ? "bg-blue-600 text-white"
                                                : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                                        }`}
                                    >
                                        <i className="fas fa-chalkboard-teacher w-4"></i>
                                        <span>Dosen</span>
                                    </Link>
                                    <Link
                                        href={route("baak.mahasiswa.index")}
                                        className={`flex items-center space-x-3 px-4 py-2 ml-6 rounded-lg text-sm transition-colors ${
                                            isActive("baak.mahasiswa")
                                                ? "bg-blue-600 text-white"
                                                : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                                        }`}
                                    >
                                        <i className="fas fa-user-graduate w-4"></i>
                                        <span>Mahasiswa</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Perkuliahan Dropdown */}
                            <div>
                                <button
                                    onClick={() =>
                                        setPerkuliahanOpen(!perkuliahanOpen)
                                    }
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                                        isParentActive([
                                            "baak.kelas",
                                            "baak.krs",
                                        ])
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <i className="fas fa-chalkboard w-5"></i>
                                        <span className="text-sm font-medium">
                                            Perkuliahan
                                        </span>
                                    </div>
                                    <i
                                        className={`fas fa-chevron-down text-xs transition-transform ${
                                            perkuliahanOpen ? "rotate-180" : ""
                                        }`}
                                    ></i>
                                </button>

                                <div
                                    className={`mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                                        perkuliahanOpen ? "max-h-48" : "max-h-0"
                                    }`}
                                >
                                    <Link
                                        href={route("baak.kelas.index")}
                                        className={`flex items-center space-x-3 px-4 py-2 ml-6 rounded-lg text-sm transition-colors ${
                                            isActive("baak.kelas")
                                                ? "bg-blue-600 text-white"
                                                : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                                        }`}
                                    >
                                        <i className="fas fa-calendar-alt w-4"></i>
                                        <span>Kelas</span>
                                    </Link>
                                    <Link
                                        href="#"
                                        className="flex items-center space-x-3 px-4 py-2 ml-6 rounded-lg text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                    >
                                        <i className="fas fa-file-alt w-4"></i>
                                        <span>KRS</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Akademik Dropdown */}
                            <div>
                                <button
                                    onClick={() => setAkademikOpen(!akademikOpen)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                                        isParentActive([
                                            "baak.periode-registrasi",
                                            "baak.jadwal-krs",
                                            "baak.registrasi",
                                        ])
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <i className="fas fa-calendar-check w-5"></i>
                                        <span className="text-sm font-medium">
                                            Akademik
                                        </span>
                                    </div>
                                    <i
                                        className={`fas fa-chevron-down text-xs transition-transform ${
                                            akademikOpen ? "rotate-180" : ""
                                        }`}
                                    ></i>
                                </button>

                                <div
                                    className={`mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                                        akademikOpen ? "max-h-60" : "max-h-0"
                                    }`}
                                >
                                    <Link
                                        href={route("baak.periode-registrasi.index")}
                                        className={`flex items-center space-x-3 px-4 py-2 ml-6 rounded-lg text-sm transition-colors ${
                                            isActive("baak.periode-registrasi")
                                                ? "bg-blue-600 text-white"
                                                : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                                        }`}
                                    >
                                        <i className="fas fa-calendar-plus w-4"></i>
                                        <span>Periode Registrasi</span>
                                    </Link>
                                    <Link
                                        href={route("baak.jadwal-krs.index")}
                                        className={`flex items-center space-x-3 px-4 py-2 ml-6 rounded-lg text-sm transition-colors ${
                                            isActive("baak.jadwal-krs")
                                                ? "bg-blue-600 text-white"
                                                : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                                        }`}
                                    >
                                        <i className="fas fa-clock w-4"></i>
                                        <span>Jadwal KRS</span>
                                    </Link>
                                    <Link
                                        href="#"
                                        className="flex items-center space-x-3 px-4 py-2 ml-6 rounded-lg text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                    >
                                        <i className="fas fa-user-check w-4"></i>
                                        <span>Registrasi Mahasiswa</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Laporan */}
                            <Link
                                href="#"
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                            >
                                <i className="fas fa-chart-bar w-5"></i>
                                <span className="text-sm font-medium">
                                    Laporan
                                </span>
                            </Link>
                        </div>
                    </nav>

                    {/* Logout Button - Fixed */}
                    <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                        >
                            <i className="fas fa-sign-out-alt w-5"></i>
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-h-screen">
                    {/* Topbar (for mobile) */}
                    <header className="bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between lg:hidden">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="text-gray-700 focus:outline-none"
                        >
                            <i className="fas fa-bars text-xl"></i>
                        </button>
                        <h1 className="text-lg font-semibold text-gray-800">
                            Sistem Akademik
                        </h1>
                    </header>

                    <main className="flex-1 lg:p-8 lg:ml-64 bg-gray-100">{children}</main>
                </div>
            </div>
        </>
    );
}
