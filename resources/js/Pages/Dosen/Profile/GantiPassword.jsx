import { Head, Link, useForm } from '@inertiajs/react';
import DosenLayout from '@/Layouts/DosenLayout';

export default function GantiPassword() {
    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('dosen.profile.update-password'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <DosenLayout title="Perbarui Password">
            <Head title="Perbarui Password" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Perbarui Password</h1>
                    <p className="text-gray-600">Update password akun anda.</p>
                </div>

                <div className="max-w-3xl shadow-sm border border-gray-200 rounded-lg p-8 bg-white text-sm">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <label className="w-52 text-gray-700 font-medium">Password Baru</label>
                                <div className="flex-1">
                                    <input type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 focus:border-blue-600 rounded-lg bg-white text-gray-700 focus:outline-none" />
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <label className="w-52 text-gray-700 font-medium">Konfirmasi Password Baru</label>
                                <div className="flex-1">
                                    <input type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 focus:border-blue-600 rounded-lg bg-white text-gray-700 focus:outline-none" />
                                    {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <label className="w-52 text-red-700 font-medium">(Password Lama)*</label>
                                <div className="flex-1">
                                    <input type="password"
                                        value={data.current_password}
                                        onChange={(e) => setData('current_password', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 focus:border-red-600 rounded-lg bg-white text-gray-700 focus:outline-none" />
                                    {errors.current_password && <p className="text-red-500 text-xs mt-1">{errors.current_password}</p>}
                                </div>
                            </div>

                            <div className="flex items-center">
                                <label className="w-52 text-gray-700 font-medium"></label>
                                <Link href={route('dosen.profile')}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all duration-200 mr-2">
                                    <i className="fa-solid fa-xmark mr-2"></i> Batal
                                </Link>
                                <button type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none transition-all duration-200 disabled:opacity-50">
                                    <i className="fa-solid fa-floppy-disk mr-2"></i>{processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </DosenLayout>
    );
}
