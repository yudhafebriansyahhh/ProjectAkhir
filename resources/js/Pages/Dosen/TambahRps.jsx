import { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DosenLayout from '@/Layouts/DosenLayout';

export default function TambahRps() {
    const [formData, setFormData] = useState({
        kodeMatkul: '',
        dosenPengampu: ''
    });

    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileSelect = (selectedFile) => {
        if (selectedFile) {
            // Validasi ukuran file (max 10MB)
            const maxSize = 10 * 1024 * 1024; // 10MB in bytes
            if (selectedFile.size > maxSize) {
                if (window.Swal) {
                    window.Swal.fire({
                        title: 'File Terlalu Besar',
                        text: 'Ukuran file maksimal adalah 10MB.',
                        icon: 'error',
                        confirmButtonColor: '#dc2626',
                    });
                } else {
                    alert('Ukuran file maksimal adalah 10MB.');
                }
                return;
            }

            // Validasi tipe file
            const allowedTypes = ['image/jpeg', 'image/jpg', 'application/pdf'];
            if (!allowedTypes.includes(selectedFile.type)) {
                if (window.Swal) {
                    window.Swal.fire({
                        title: 'Format File Tidak Valid',
                        text: 'Hanya file JPG, JPEG, atau PDF yang diperbolehkan.',
                        icon: 'error',
                        confirmButtonColor: '#dc2626',
                    });
                } else {
                    alert('Hanya file JPG, JPEG, atau PDF yang diperbolehkan.');
                }
                return;
            }

            setFile(selectedFile);
        }
    };

    const handleFileInputChange = (e) => {
        const selectedFile = e.target.files[0];
        handleFileSelect(selectedFile);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        handleFileSelect(droppedFile);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validasi form
        if (!formData.kodeMatkul || !formData.dosenPengampu) {
            if (window.Swal) {
                window.Swal.fire({
                    title: 'Data Tidak Lengkap',
                    text: 'Silakan lengkapi kode matkul dan dosen pengampu.',
                    icon: 'warning',
                    confirmButtonColor: '#2563eb',
                });
            } else {
                alert('Silakan lengkapi kode matkul dan dosen pengampu.');
            }
            return;
        }

        if (!file) {
            if (window.Swal) {
                window.Swal.fire({
                    title: 'File Belum Dipilih',
                    text: 'Silakan pilih file RPS terlebih dahulu.',
                    icon: 'warning',
                    confirmButtonColor: '#2563eb',
                });
            } else {
                alert('Silakan pilih file RPS terlebih dahulu.');
            }
            return;
        }

        if (window.Swal) {
            window.Swal.fire({
                title: 'Simpan RPS?',
                text: "Data RPS akan disimpan.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Ya, Simpan',
                cancelButtonText: 'Batal',
                confirmButtonColor: '#2563eb',
            }).then((result) => {
                if (result.isConfirmed) {
                    // Logic untuk upload file dan simpan RPS
                    console.log('Form Data:', formData);
                    console.log('File:', file);

                    window.Swal.fire({
                        title: 'Berhasil!',
                        text: 'RPS berhasil disimpan.',
                        icon: 'success',
                        confirmButtonColor: '#2563eb',
                    }).then(() => {
                        // router.visit(route('dosen.rps'));
                    });
                }
            });
        } else {
            if (confirm('Simpan RPS?')) {
                console.log('Form Data:', formData);
                console.log('File:', file);
                alert('RPS berhasil disimpan.');
                // router.visit(route('dosen.rps'));
            }
        }
    };

    return (
        <DosenLayout title="Tambah RPS">
            <Head title="Tambah RPS">
                <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            </Head>

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Tambah Rencana Pembelajaran Semester (RPS)</h1>
                    <p className="text-gray-600">
                        Tambahkan RPS untuk mata kuliah yang Anda ampu.
                    </p>
                </div>

                <div className="max-w-4xl bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
                    {/* Header Card */}
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                        <h3 className="text-lg font-semibold text-gray-700">Form Rencana Pembelajaran Semester (RPS)</h3>
                        <p className="text-sm text-gray-600 mt-1">Silakan masukkan RPS berdasarkan form berikut.</p>
                    </div>

                    {/* Form Content */}
                    <div className="p-6">
                        <div>
                            <div className="space-y-4">
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-4">
                                        <label className="w-34 text-gray-700 font-medium text-sm">Kode Matkul</label>
                                        <select
                                            name="kodeMatkul"
                                            value={formData.kodeMatkul}
                                            onChange={handleInputChange}
                                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-gray-600"
                                        >
                                            <option value="">Pilih Matkul</option>
                                            <option value="A">Matkul A</option>
                                            <option value="B">Matkul B</option>
                                            <option value="C">Matkul C</option>
                                            <option value="D">Matkul D</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <label className="w-34 text-gray-700 font-medium text-sm">Dosen Pengampu</label>
                                        <select
                                            name="dosenPengampu"
                                            value={formData.dosenPengampu}
                                            onChange={handleInputChange}
                                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-gray-600"
                                        >
                                            <option value="">Pilih Dosen Pengampu</option>
                                            <option value="A">Dosen A</option>
                                            <option value="B">Dosen B</option>
                                            <option value="C">Dosen C</option>
                                            <option value="D">Dosen D</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <label className="w-34 text-gray-700 font-medium text-sm">RPS (File)</label>
                                        <div className="flex-1">
                                            <div className="relative group">
                                                <div
                                                    className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
                                                        isDragging
                                                            ? 'border-gray-500 bg-gray-50'
                                                            : 'border-gray-300'
                                                    }`}
                                                    onDragEnter={handleDragEnter}
                                                    onDragLeave={handleDragLeave}
                                                    onDragOver={handleDragOver}
                                                    onDrop={handleDrop}
                                                >
                                                    {/* Animated Upload Icon */}
                                                    <div className="mb-6">
                                                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-200 text-gray-600 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                                            </svg>
                                                        </div>
                                                    </div>

                                                    {/* Upload Text */}
                                                    <div className="space-y-2">
                                                        <label htmlFor="file-upload" className="cursor-pointer">
                                                            <span className="text-lg font-semibold text-gray-700">
                                                                Klik untuk memilih file atau seret ke sini
                                                            </span>
                                                        </label>
                                                        <p className="text-gray-500 text-sm">
                                                            Format yang didukung: JPG, JPEG, atau PDF (maks. 10MB)
                                                        </p>
                                                        <input
                                                            id="file-upload"
                                                            ref={fileInputRef}
                                                            type="file"
                                                            className="sr-only"
                                                            accept="image/jpeg,image/jpg,application/pdf"
                                                            onChange={handleFileInputChange}
                                                        />
                                                    </div>

                                                    {/* File Preview Area */}
                                                    {file && (
                                                        <div className="mt-6">
                                                            <div className="bg-green-50 border border-green-200 rounded-xl py-2 px-4 animate-fade-in">
                                                                <div className="flex items-center justify-center space-x-3">
                                                                    <i className="fas fa-check-circle text-green-500 text-xl"></i>
                                                                    <span className="text-green-700 font-medium">{file.name}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 flex gap-3">
                                <Link
                                    href={route('dosen.rps')}
                                    className="px-6 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none transition-all duration-200 font-medium"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="px-6 py-2 text-sm shadow-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none transition-all duration-200 font-medium"
                                >
                                    <i className="fas fa-save mr-2"></i>
                                    Simpan RPS
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DosenLayout>
    );
}
