import { Head } from '@inertiajs/react';

export default function AuthLayout({ children }) {
    return (
        <>
            <Head>
                <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
            </Head>

            <div className="min-h-screen w-full flex">
                {/* Left Side - Form Area */}
                <div className="flex-1 flex items-center justify-center p-8 bg-white">
                    <div>
                        {children}
                    </div>
                </div>

                {/* Right Side - Branding Area */}
                <div className="flex-1 relative bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 hidden md:flex flex-col justify-center items-center p-8 overflow-hidden">
                    {/* Background Decorations */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-white transform -translate-x-16 -translate-y-16"></div>
                        <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-white transform translate-x-24 translate-y-24"></div>
                        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-white transform -translate-y-12"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 text-center max-w-md">
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <img
                                className="w-48 h-48 bg-white p-3 shadow-sm rounded-full"
                                src="/ITBR.jpeg"
                                alt="ITB Riau Logo"
                            />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-medium text-white">
                                Selamat Datang di Website Sistem Akademik ITB Riau
                            </h2>
                            <p className="text-white/80 leading-relaxed">
                                Akses informasi akademik Anda dengan mudah. Silakan login untuk memulai.
                            </p>
                        </div>

                        <div className="flex justify-center gap-2 mt-8 opacity-50">
                            <div className="w-2 h-2 bg-blue-50 rounded-full"></div>
                            <div className="w-2 h-2 bg-blue-100 rounded-full"></div>
                            <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
