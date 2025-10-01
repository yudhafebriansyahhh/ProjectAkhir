import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function MahasiswaLayout({ children, title }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
        return route().current(routeName);
    };

    return (
        <>
            <Head>
                <title>{title ? `${title} - SIAKAD ITB Riau` : 'Sistem Informasi Akademik ITB Riau'}</title>
                <link
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
                    rel="stylesheet"
                />
                <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
            </Head>

            <div className="flex min-h-screen bg-gray-100 font-sans">
                {/* Sidebar overlay (for mobile) */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-25"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`fixed lg:block z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 h-full overflow-y-auto ${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
                        <div className="flex flex-col items-center">
                            <img
                                src="/ITBR.jpeg"
                                className="w-14 h-14 p-1 bg-white rounded-full mb-3 shadow-sm"
                                alt="ITB Riau"
                            />
                            <h2 className="text-sm font-semibold text-white">ITB Riau</h2>
                            <p className="text-xs text-blue-100">Mahasiswa</p>
                        </div>
                    </div>

                    {/* Profile */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <img
                                className="w-12 h-12 rounded-full"
                                src="/profile.png"
                                alt="Profile"
                            />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Muhammad Raihan</p>
                                <p className="text-xs text-gray-600">2253301851</p>
                            </div>
                        </div>
                    </div>

                    {/* Menu */}
                    <nav className="mt-4 overflow-y-auto max-h-[55vh]">
                        <div className="px-4 space-y-1">
                            <Link
                                href={route('mahasiswa.dashboard')}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive('mahasiswa.dashboard')
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                                }`}
                            >
                                <i className="fas fa-home w-5"></i>
                                <span className="text-sm font-medium">Dashboard</span>
                            </Link>

                            <Link
                                href={route('mahasiswa.nilai')}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive('mahasiswa.nilai')
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                                }`}
                            >
                                <i className="fas fa-star w-5"></i>
                                <span className="text-sm font-medium">Nilai</span>
                            </Link>

                            <Link
                                href={route('mahasiswa.penjadwalan')}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive('mahasiswa.penjadwalan')
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                                }`}
                            >
                                <i className="fas fa-calendar-alt w-5"></i>
                                <span className="text-sm font-medium">Penjadwalan</span>
                            </Link>

                            <Link
                                href={route('mahasiswa.krs')}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive('mahasiswa.krs')
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                                }`}
                            >
                                <i className="fas fa-book w-5"></i>
                                <span className="text-sm font-medium">KRS</span>
                            </Link>

                            <Link
                                href={route('mahasiswa.absensi')}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive('mahasiswa.absensi')
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                                }`}
                            >
                                <i className="fas fa-clipboard-check w-5"></i>
                                <span className="text-sm font-medium">Absensi</span>
                            </Link>

                            <Link
                                href={route('mahasiswa.profile')}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive('mahasiswa.profile')
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                                }`}
                            >
                                <i className="fas fa-user-circle w-5"></i>
                                <span className="text-sm font-medium">Profile</span>
                            </Link>
                        </div>
                    </nav>

                    {/* Logout */}
                    <div className="lg:absolute px-4 lg:px-0 bottom-4 left-4 right-4">
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
                    {/* Topbar (mobile) */}
                    <header className="bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between lg:hidden">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="text-gray-700 focus:outline-none"
                        >
                            <i className="fas fa-bars text-xl"></i>
                        </button>
                        <h1 className="text-lg font-semibold text-gray-800">Sistem Akademik</h1>
                    </header>

                    {/* Konten */}
                    <main className="flex-1 lg:p-8 lg:ml-60 bg-gray-100 flex flex-col">
                        <div className="flex-grow">{children}</div>
                    </main>
                </div>
            </div>
        </>
    );
}
