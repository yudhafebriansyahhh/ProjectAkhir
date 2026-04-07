import { useState, useEffect } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import {
    Home, Database, Building2, GraduationCap, BookOpen,
    Users, UserCheck, Presentation,
    DoorOpen, ClipboardList, Star,
    CalendarPlus, Clock, UserCheck2, Settings,
    FileText, LogOut, ChevronDown, Menu, X
} from "lucide-react";

export default function BaakLayout({ children, title }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (routeName) => {
        return route().current(routeName) || route().current(`${routeName}.*`);
    };

    const isParentActive = (routeNames) => {
        return routeNames.some((name) => isActive(name));
    };

    const [masterDataOpen, setMasterDataOpen] = useState(
        isParentActive(["baak.fakultas", "baak.prodi", "baak.mata-kuliah"])
    );
    const [civitasOpen, setCivitasOpen] = useState(
        isParentActive(["baak.dosen", "baak.mahasiswa"])
    );
    const [perkuliahanOpen, setPerkuliahanOpen] = useState(
        isParentActive(["baak.kelas", "baak.krs", "baak.nilai"])
    );
    const [akademikOpen, setAkademikOpen] = useState(
        isParentActive([
            "baak.periode-registrasi",
            "baak.jadwal-krs",
            "baak.registrasi-semester",
            "baak.pengaturan-krs"
        ])
    );

    useEffect(() => {
        setMasterDataOpen(
            isParentActive(["baak.fakultas", "baak.prodi", "baak.mata-kuliah"])
        );
        setCivitasOpen(
            isParentActive(["baak.dosen", "baak.mahasiswa"])
        );
        setPerkuliahanOpen(
            isParentActive(["baak.kelas", "baak.krs", "baak.nilai"])
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

    const NavItem = ({ href, icon: Icon, label, active }) => (
        <Link
            href={href}
            className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
            }`}
        >
            <Icon className="w-[18px] h-[18px]" />
            <span className="text-sm font-medium">{label}</span>
        </Link>
    );

    const DropdownMenu = ({ icon: Icon, label, isOpen, setIsOpen, isActiveParent, children: menuChildren }) => (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 ${
                    isActiveParent
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                }`}
            >
                <div className="flex items-center space-x-3">
                    <Icon className="w-[18px] h-[18px]" />
                    <span className="text-sm font-medium">{label}</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <div className={`mt-1 space-y-0.5 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"}`}>
                {menuChildren}
            </div>
        </div>
    );

    const SubNavItem = ({ href, icon: Icon, label, active }) => (
        <Link
            href={href}
            className={`flex items-center space-x-3 px-4 py-2 ml-6 rounded-lg text-sm transition-all duration-200 ${
                active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-500 hover:bg-blue-50 hover:text-blue-700"
            }`}
        >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
        </Link>
    );

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

            <div className="flex min-h-screen bg-gray-50/50">
                {/* Overlay mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`fixed lg:fixed z-50 w-[270px] bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 inset-y-0 left-0 flex flex-col shadow-xl lg:shadow-sm ${
                        sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    {/* Logo Section */}
                    <div className="flex-shrink-0 p-5 border-b border-gray-100 bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700">
                        <div className="flex flex-col items-center">
                            <div className="w-14 h-14 bg-white rounded-2xl p-1 mb-3 shadow-lg shadow-blue-900/20">
                                <img
                                    src="/ITBR.jpeg"
                                    className="w-full h-full rounded-xl object-cover"
                                    alt="ITB Riau Logo"
                                />
                            </div>
                            <h2 className="text-sm font-bold text-white tracking-wide">
                                ITB Riau
                            </h2>
                            <p className="text-[11px] text-blue-200 font-medium tracking-wider uppercase mt-0.5">BAAK Panel</p>
                        </div>
                    </div>

                    {/* User Profile */}
                    <div className="flex-shrink-0 p-4 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex items-center space-x-3">
                            <Avatar className="h-11 w-11 ring-2 ring-blue-100 ring-offset-1">
                                <AvatarImage
                                    src="/ITBR.jpeg"
                                    alt="Profile"
                                />
                                <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-sm">
                                    {(auth?.user?.name || "BA").charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {auth?.user?.name || "Admin BAAK"}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {auth?.user?.email || "baak@itbriau.ac.id"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-100 scrollbar-track-transparent hover:scrollbar-thumb-blue-200">
                        <div className="py-4 px-3 space-y-1">

                            {/* Dashboard */}
                            <NavItem
                                href={route("baak.dashboard")}
                                icon={Home}
                                label="Dashboard"
                                active={isActive("baak.dashboard")}
                            />

                            {/* Separator */}
                            <div className="pt-2 pb-1 px-4">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Data & Akademik</p>
                            </div>

                            {/* Master Data */}
                            <DropdownMenu
                                icon={Database}
                                label="Master Data"
                                isOpen={masterDataOpen}
                                setIsOpen={setMasterDataOpen}
                                isActiveParent={isParentActive(["baak.fakultas", "baak.prodi", "baak.mata-kuliah"])}
                            >
                                <SubNavItem href={route("baak.fakultas.index")} icon={Building2} label="Fakultas" active={isActive("baak.fakultas")} />
                                <SubNavItem href={route("baak.prodi.index")} icon={GraduationCap} label="Program Studi" active={isActive("baak.prodi")} />
                                <SubNavItem href={route("baak.mata-kuliah.index")} icon={BookOpen} label="Mata Kuliah" active={isActive("baak.mata-kuliah")} />
                            </DropdownMenu>

                            {/* Civitas Akademika */}
                            <DropdownMenu
                                icon={Users}
                                label="Civitas Akademika"
                                isOpen={civitasOpen}
                                setIsOpen={setCivitasOpen}
                                isActiveParent={isParentActive(["baak.dosen", "baak.mahasiswa"])}
                            >
                                <SubNavItem href={route("baak.dosen.index")} icon={UserCheck} label="Dosen" active={isActive("baak.dosen")} />
                                <SubNavItem href={route("baak.mahasiswa.index")} icon={GraduationCap} label="Mahasiswa" active={isActive("baak.mahasiswa")} />
                            </DropdownMenu>

                            {/* Separator */}
                            <div className="pt-2 pb-1 px-4">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Perkuliahan</p>
                            </div>

                            {/* Perkuliahan */}
                            <DropdownMenu
                                icon={ClipboardList}
                                label="Perkuliahan"
                                isOpen={perkuliahanOpen}
                                setIsOpen={setPerkuliahanOpen}
                                isActiveParent={isParentActive(["baak.kelas", "baak.krs", "baak.nilai"])}
                            >
                                <SubNavItem href={route("baak.kelas.index")} icon={DoorOpen} label="Kelas" active={isActive("baak.kelas")} />
                                <SubNavItem href={route("baak.krs.index")} icon={ClipboardList} label="Monitoring KRS" active={isActive("baak.krs")} />
                                <SubNavItem href={route("baak.nilai.index")} icon={Star} label="Manajemen Nilai" active={isActive("baak.nilai")} />
                            </DropdownMenu>

                            {/* Akademik */}
                            <DropdownMenu
                                icon={CalendarPlus}
                                label="Akademik"
                                isOpen={akademikOpen}
                                setIsOpen={setAkademikOpen}
                                isActiveParent={isParentActive([
                                    "baak.periode-registrasi",
                                    "baak.jadwal-krs",
                                    "baak.registrasi-semester",
                                    "baak.pengaturan-krs"
                                ])}
                            >
                                <SubNavItem href={route("baak.periode-registrasi.index")} icon={CalendarPlus} label="Periode Registrasi" active={isActive("baak.periode-registrasi")} />
                                <SubNavItem href={route("baak.jadwal-krs.index")} icon={Clock} label="Jadwal KRS" active={isActive("baak.jadwal-krs")} />
                                <SubNavItem href={route("baak.registrasi-semester.index")} icon={UserCheck2} label="Registrasi Mahasiswa" active={isActive("baak.registrasi-semester")} />
                                <SubNavItem href={route("baak.pengaturan-krs.index")} icon={Settings} label="Pengaturan MK KRS" active={isActive("baak.pengaturan-krs")} />
                            </DropdownMenu>

                            {/* Separator */}
                            <div className="pt-2 pb-1 px-4">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Laporan</p>
                            </div>

                            {/* Laporan */}
                            <NavItem
                                href={route("baak.laporan.index")}
                                icon={FileText}
                                label="Laporan Akademik"
                                active={isActive("baak.laporan.*")}
                            />

                            <div className="h-4"></div>
                        </div>
                    </nav>

                    {/* Logout Button */}
                    <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-white">
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">Logout</span>
                        </Button>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 lg:ml-[270px]">
                    {/* Mobile Topbar */}
                    <header className="lg:hidden bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-30">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="text-gray-700 hover:text-blue-600 focus:outline-none transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-lg font-bold text-gray-800 tracking-tight">
                            SIAKAD ITB Riau
                        </h1>
                        <div className="w-6"></div>
                    </header>

                    {/* Page Content */}
                    <main className="min-h-screen bg-gray-50/50">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
