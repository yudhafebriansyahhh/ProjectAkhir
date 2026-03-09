import { Head, useForm } from '@inertiajs/react';
import MahasiswaLayout from '@/Layouts/MahasiswaLayout';

export default function FormProfile({ mahasiswa }) {
    const { data, setData, patch, processing, errors } = useForm({
        alamat: mahasiswa?.alamat || '',
        no_hp: mahasiswa?.no_hp || '',
        // fields like ayah/ibu are ready in form state but disabled in controller saving for now
        nama_ayah: mahasiswa?.nama_ayah || '',
        nama_ibu: mahasiswa?.nama_ibu || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('mahasiswa.profile.update-data'));
    };

    return (
        <MahasiswaLayout title="Perbarui Data">
            <Head title="Perbarui Data" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Perbarui Data</h1>
                    <p className="text-gray-600">Update informasi pribadi anda.</p>
                </div>

                <div className="max-w-3xl shadow rounded-lg p-8 bg-white text-sm">
                    <form onSubmit={submit}>
                        <div className="space-y-4">
                            <div className="flex flex-col md:flex-row md:items-center">
                                <label className="w-32 text-gray-700 font-medium mb-1 md:mb-0">Nama</label>
                                <input type="text" value={mahasiswa?.nama} disabled
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center">
                                <label className="w-32 text-gray-700 font-medium mb-1 md:mb-0">NIM</label>
                                <input type="text" value={mahasiswa?.nim} disabled
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
                            </div>
                            
                            {/* Editable Fields */}
                            <div className="flex flex-col md:flex-row md:items-start group">
                                <label className="w-32 text-gray-700 font-medium mt-2 mb-1 md:mb-0">Alamat</label>
                                <div className="flex-1">
                                    <input type="text" 
                                        value={data.alamat}
                                        onChange={e => setData('alamat', e.target.value)}
                                        className="w-full px-4 py-2 border border-blue-200 focus:border-blue-600 rounded-lg bg-blue-50/30 text-gray-800 focus:outline-none transition-colors" />
                                    {errors.alamat && <p className="text-red-500 text-xs mt-1">{errors.alamat}</p>}
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center">
                                <label className="w-32 text-gray-700 font-medium mb-1 md:mb-0">Prodi</label>
                                <input type="text" value={mahasiswa?.prodi} disabled
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center">
                                <label className="w-32 text-gray-700 font-medium mb-1 md:mb-0">Jurusan</label>
                                <input type="text" value={mahasiswa?.jurusan} disabled
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
                            </div>

                            <div className="flex flex-col md:flex-row md:items-start group">
                                <label className="w-32 text-gray-700 font-medium mt-2 mb-1 md:mb-0">No Telp / WhatsApp</label>
                                <div className="flex-1">
                                    <input type="text" 
                                        value={data.no_hp}
                                        onChange={e => setData('no_hp', e.target.value)}
                                        className="w-full px-4 py-2 border border-blue-200 focus:border-blue-600 rounded-lg bg-blue-50/30 text-gray-800 focus:outline-none transition-colors" />
                                    {errors.no_hp && <p className="text-red-500 text-xs mt-1">{errors.no_hp}</p>}
                                </div>
                            </div>
                            
                            {/* Parent Info - Made visually distinctive but disabled practically for safety */}
                            <div className="flex flex-col md:flex-row md:items-start">
                                <label className="w-32 text-gray-700 font-medium mt-2 mb-1 md:mb-0">Nama Ayah</label>
                                <div className="flex-1">
                                    <input type="text" 
                                        value={data.nama_ayah}
                                        onChange={e => setData('nama_ayah', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none" />
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-start">
                                <label className="w-32 text-gray-700 font-medium mt-2 mb-1 md:mb-0">Nama Ibu</label>
                                <div className="flex-1">
                                    <input type="text" 
                                        value={data.nama_ibu}
                                        onChange={e => setData('nama_ibu', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none" />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <label className="w-32 text-gray-700 font-medium"></label>
                                <a href="/mahasiswa/profile"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all duration-200 mr-2">
                                    <i className="fa-solid fa-xmark mr-2"></i> Batal
                                </a>
                                <button type="submit" disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm border border-blue-600 hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <i className="fa-solid fa-floppy-disk mr-2"></i> {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </MahasiswaLayout>
    );
}
