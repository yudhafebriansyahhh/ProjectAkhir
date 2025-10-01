import { Head } from '@inertiajs/react';
import MahasiswaLayout from '@/Layouts/MahasiswaLayout';

export default function GantiPassword() {
    return (
        <MahasiswaLayout title="Perbarui Password">
            <Head title="Perbarui Password" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Perbarui Password</h1>
                    <p className="text-gray-600">Update password akun anda.</p>
                </div>

                <div className="max-w-3xl shadow-sm border border-gray-200 rounded-lg p-8 bg-white text-sm">
                    <form action="">
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <label className="w-52 text-gray-700 font-medium">Nama</label>
                                <input type="text" value="Muhammad Raihan" disabled
                                    className="flex-1 px-4 py-2 border border-gray-200 focus:border-blue-600 rounded-lg bg-white text-gray-700 focus:outline-none" />
                            </div>
                            <div className="flex items-center">
                                <label className="w-52 text-gray-700 font-medium">Email</label>
                                <input type="text" value="raihan@gmail.com" disabled
                                    className="flex-1 px-4 py-2 border border-gray-200 focus:border-blue-600 rounded-lg bg-white text-gray-700 focus:outline-none" />
                            </div>
                            <div className="flex items-center">
                                <label className="w-52 text-gray-700 font-medium">Password Baru</label>
                                <input type="password"
                                    className="flex-1 px-4 py-2 border border-gray-200 focus:border-blue-600 rounded-lg bg-white text-gray-700 focus:outline-none" />
                            </div>
                            <div className="flex items-center">
                                <label className="w-52 text-gray-700 font-medium">Konfirmasi Password Baru</label>
                                <input type="password"
                                    className="flex-1 px-4 py-2 border border-gray-200 focus:border-blue-600 rounded-lg bg-white text-gray-700 focus:outline-none" />
                            </div>
                            <div className="flex items-center">
                                <label className="w-52 text-red-700 font-medium">(Password Lama)*</label>
                                <input type="password"
                                    className="flex-1 px-4 py-2 border border-gray-200 focus:border-red-600 rounded-lg bg-white text-gray-700 focus:outline-none" />
                            </div>

                            <div className="flex items-center">
                                <label className="w-52 text-gray-700 font-medium"></label>
                                <a href="/mahasiswa/profile"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all duration-200 mr-2">
                                    <i className="fa-solid fa-xmark mr-2"></i> Batal
                                </a>
                                <button type="submit"
                                    className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none transition-all duration-200">
                                    <i className="fa-solid fa-floppy-disk mr-2"></i>Simpan
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </MahasiswaLayout>
    );
}
