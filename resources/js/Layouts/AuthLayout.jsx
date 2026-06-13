export default function AuthLayout({ children }) {
    return (
        <div className="flex min-h-screen w-full min-w-0 flex-col bg-white lg:flex-row">
            <div className="flex min-h-screen min-w-0 flex-1 items-center justify-center bg-white px-4 py-8 sm:px-6 lg:px-10">
                <div className="w-full max-w-md min-w-0">
                    {children}
                </div>
            </div>

            <aside className="hidden min-h-screen flex-1 items-center justify-center bg-blue-600 p-8 lg:flex">
                <div className="w-full max-w-md text-center">
                    <div className="mb-8 flex items-center justify-center">
                        <img
                            className="h-40 w-40 rounded-full bg-white p-3 shadow-sm xl:h-48 xl:w-48"
                            src="/ITBR.jpeg"
                            alt="ITB Riau Logo"
                        />
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold leading-snug text-white xl:text-2xl">
                            Selamat Datang di Website Sistem Akademik ITB Riau
                        </h2>
                        <p className="text-sm leading-relaxed text-blue-100 xl:text-base">
                            Akses informasi akademik Anda dengan mudah. Silakan login untuk memulai.
                        </p>
                    </div>
                </div>
            </aside>
        </div>
    );
}
