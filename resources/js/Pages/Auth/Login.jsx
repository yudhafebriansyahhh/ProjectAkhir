import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import AuthLayout from '@/Layouts/AuthLayout';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        username: '', 
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <AuthLayout>
            <Head title="Masuk" />

            <div className="min-w-[400px] flex flex-col justify-center items-center px-4 py-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="block sm:hidden mb-6">
                        <img
                            className="w-28 h-28 mx-auto mb-2 bg-white p-3 shadow-sm rounded-full"
                            src="/ITBR.jpeg"
                            alt=""
                        />
                        <h1 className="text-gray-800 text-center text-lg font-semibold">
                            Sistem Akademik ITB RIAU
                        </h1>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-700 mb-2">Masuk</h1>
                        <p className="text-gray-600">Masuk ke akun Anda untuk melanjutkan</p>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-6">
                        {/* Username Field */}
                        <div className="space-y-2">
                            <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                className="flex-1 w-full placeholder:text-sm text-sm px-4 py-2 border-2 placeholder:text-gray-400 border-gray-200 focus:border-blue-600 rounded-lg bg-white text-gray-700 focus:outline-none"
                                placeholder="Masukkan NIM/NIP/Email"
                                autoFocus
                            />
                            <InputError message={errors.username} className="mt-2" />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                    Password
                                </label>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="flex-1 w-full placeholder:text-sm text-sm px-4 py-2 border-2 placeholder:text-gray-400 border-gray-200 focus:border-blue-600 rounded-lg bg-white text-gray-700 focus:outline-none pr-10"
                                    placeholder="Masukkan password Anda"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    <i className={`fa-solid text-sm ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray rounded-sm accent-blue-500"
                            />
                            <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                                Ingat saya
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-gradient-to-r text-sm from-blue-600 to-blue-700 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Memproses...' : 'Masuk ke Akun'}
                        </button>
                    </form>
                </div>
            </div>
        </AuthLayout>
    );
}
