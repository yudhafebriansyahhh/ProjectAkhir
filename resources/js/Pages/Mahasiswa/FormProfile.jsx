import { Head } from '@inertiajs/react';
import MahasiswaLayout from '@/Layouts/MahasiswaLayout';

export default function FormProfile() {
    return (
        <MahasiswaLayout title="Perbarui Data">
            <Head title="Perbarui Data" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Perbarui Data</h1>
                    <p className="text-gray-600">Update informasi pribadi anda.</p>
                </div>

                <div className="max-w-3xl shadow rounded-lg p-8 bg-white text-sm">
                    <form action="">
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <label className="w-32 text-gray-700 font-medium">Nama</label>
                                <input type="text" defaultValue="Muhammad Raihan"
                                    className="flex-1 px-4 py-2 border border-gray-200 focus:border-blue-600 rounded-lg bg-white text-gray-700 focus:outline-none" />
                            </div>
                            <div className="flex items-center">
                                <label className="w-32 text-gray-700 font-medium">NIM</label>
                                <input type="text" defaultValue="2253301851"
                                    className="flex-1 px-4 py-2 border border-gray-200 focus:border-blue-600 rounded-lg bg-white text-gray-700 focus:outline-none" />
                            </div>
                            <div className="flex items-center">
                                <label className="w-32 text-gray-700 font-medium">Alamat</label>
                                <input type="text" defaultValue="JL. Ada deh"
                                    className="flex-1 px-4 py-2 border border-gray-200 focus:border-blue-600 rounded-lg bg-white text-gray-700 focus:outline-none" />
                            </div>
                            <div className="flex items-center">
                                <label className="w-32 text-gray-700 font-medium">Prodi</label>
                                <input type="text" defaultValue="Teknik Informatika"
                                    className="flex-1 px-4 py-2 border border-gray-200 focus:border-blue-600 rounded-lg bg-white text-gray-700 focus:outline-none" />
                            </div>
                            <div className="flex items-center">
                                <label className="w-32 text-gray-700 font-medium">Jurusan</label>
                                <input type="text" defaultValue="Teknologi Informasi"
                                    className="flex-1 px-4 py-2 border border-gray-200 focus:border-blue-600 rounded-lg bg-white text-gray-700 focus:outline-none" />
                            </div>

                            <div className="flex items-center">
                                <label className="w-32 text-gray-700 font-medium">No Telp</label>
                                <input type="text" defaultValue="643646346436"
                                    className="flex-1 px-4 py-2 border border-gray-200 focus:border-blue-600 rounded-lg bg-white text-gray-700 focus:outline-none" />
                            </div>
                            <div className="flex items-center">
                                <label className="w-32 text-gray-700 font-medium">Nama Ayah</label>
                                <input type="text" defaultValue="Ada deh"
                                    className="flex-1 px-4 py-2 border border-gray-200 focus:border-blue-600 rounded-lg bg-white text-gray-700 focus:outline-none" />
                            </div>
                            <div className="flex items-center">
                                <label className="w-32 text-gray-700 font-medium">Nama Ibu</label>
                                <input type="text" defaultValue="Ada deh"
                                    className="flex-1 px-4 py-2 border border-gray-200 focus:border-blue-600 rounded-lg bg-white text-gray-700 focus:outline-none" />
                            </div>

                            <div className="flex items-center">
                                <label className="w-32 text-gray-700 font-medium"></label>
                                <a href="/mahasiswa/profile"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all duration-200 mr-2">
                                    <i className="fa-solid fa-xmark mr-2"></i> Batal
                                </a>
                                <button type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm border border-blue-600 hover:bg-blue-700 transition-all duration-200">
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
