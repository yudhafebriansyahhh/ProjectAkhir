import { Head } from '@inertiajs/react';
import MahasiswaLayout from '@/Layouts/MahasiswaLayout';

export default function Profile() {
    return (
        <MahasiswaLayout title="Profil Mahasiswa">
            <Head title="Profil Mahasiswa" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Profil Mahasiswa</h1>
                    <p className="text-gray-600">Kelola informasi pribadi, data akademik, dan pengaturan akun Anda.</p>
                </div>

                <div className="shadow-sm rounded-lg p-8 bg-white">
                    <div className="flex flex-col items-center mb-8">
                        <img className="w-32 h-32 object-cover rounded-full shadow" src="/profile.png"
                            alt="Foto Profil" />

                        <div className="mt-5 flex gap-4">
                            <a href="/mahasiswa/perbarui-data"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm border border-blue-600 hover:bg-blue-700 transition-all duration-200">
                                <i className="fa-solid fa-user-pen mr-2"></i> Perbarui Data
                            </a>
                            <a href="/mahasiswa/ganti-password"
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all duration-200">
                                <i className="fa-solid fa-lock mr-2"></i> Ganti Password
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        {/* Kolom Kiri */}
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <label className="w-32 text-gray-700 font-medium">Nama</label>
                                <input type="text" value="Muhammad Raihan" disabled
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none" />
                            </div>
                            <div className="flex items-center">
                                <label className="w-32 text-gray-700 font-medium">NIM</label>
                                <input type="text" value="2253301851" disabled
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none" />
                            </div>
                            <div className="flex items-center">
                                <label className="w-32 text-gray-700 font-medium">Alamat</label>
                                <input type="text" value="JL. Ada deh" disabled
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none" />
                            </div>
                            <div className="flex items-center">
                                <label className="w-32 text-gray-700 font-medium">Prodi</label>
                                <input type="text" value="Teknik Informatika" disabled
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none" />
                            </div>
                            <div className="flex items-center">
                                <label className="w-32 text-gray-700 font-medium">Jurusan</label>
                                <input type="text" value="Teknologi Informasi" disabled
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none" />
                            </div>
                        </div>

                        {/* Kolom Kanan */}
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <label className="w-32 text-gray-700 font-medium">No Telp</label>
                                <input type="text" value="643646346436" disabled
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none" />
                            </div>
                            <div className="flex items-center">
                                <label className="w-32 text-gray-700 font-medium">Nama Ayah</label>
                                <input type="text" value="Ada deh" disabled
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none" />
                            </div>
                            <div className="flex items-center">
                                <label className="w-32 text-gray-700 font-medium">Nama Ibu</label>
                                <input type="text" value="Ada deh" disabled
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MahasiswaLayout>
    );
}
