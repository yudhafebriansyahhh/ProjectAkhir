import { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DosenLayout from '@/Layouts/DosenLayout';

export default function TambahRps({ matkul }) {

    const [formData, setFormData] = useState({
        kode_matkul: '',
        judul: '',
    });

    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileSelect = (selectedFile) => {
        if (selectedFile) {
            const maxSize = 10 * 1024 * 1024;

            if (selectedFile.size > maxSize) {
                return Swal.fire('File Terlalu Besar', 'Maksimal 10MB', 'error');
            }

            const allowed = ['image/jpeg', 'image/jpg', 'application/pdf'];

            if (!allowed.includes(selectedFile.type)) {
                return Swal.fire('Format Tidak Valid', 'Hanya JPG/JPEG/PDF', 'error');
            }

            setFile(selectedFile);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileSelect(droppedFile);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.kode_matkul || !formData.judul) {
            return Swal.fire('Data Tidak Lengkap', 'Isi semua field.', 'warning');
        }

        if (!file) {
            return Swal.fire('File Belum Dipilih', 'Silakan upload file RPS.', 'warning');
        }

        Swal.fire({
            title: 'Simpan RPS?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Simpan',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#2563eb',
        }).then((result) => {
            if (result.isConfirmed) {

                const formDataFinal = new FormData();
                formDataFinal.append('kode_matkul', formData.kode_matkul);
                formDataFinal.append('judul', formData.judul);
                formDataFinal.append('file_rps', file);

                router.post(route('dosen.rps.store'), formDataFinal, {
                    forceFormData: true,
                    onSuccess: () => {
                        Swal.fire('Berhasil!', 'RPS berhasil disimpan.', 'success');
                    },
                });
            }
        });
    };

    return (
        <DosenLayout title="Tambah RPS">
            <Head title="Tambah RPS">
                <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            </Head>

            <div className="container mx-auto px-4 py-8 max-w-[600px] sm:max-w-full">
                
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Tambah Rencana Pembelajaran Semester (RPS)</h1>
                    <p className="text-gray-600">
                        Tambahkan RPS untuk mata kuliah yang Anda ampu.
                    </p>
                </div>

                {/* Main Form Card */}
                <div className="max-w-4xl bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
                    
                    {/* Header Card */}
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                        <h3 className="text-lg font-semibold text-gray-700">Form Rencana Pembelajaran Semester (RPS)</h3>
                        <p className="text-sm text-gray-600 mt-1">Silakan masukkan RPS berdasarkan form berikut.</p>
                    </div>

                    {/* Form Content */}
                    <div className="p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div className="space-y-3 text-sm">
                                    
                                    {/* KODE MATKUL */}
                                    <div className="flex items-center gap-4">
                                        <label className="w-34 text-gray-700 font-medium text-sm">Kode Matkul</label>
                                        <select
                                            name="kode_matkul"
                                            value={formData.kode_matkul}
                                            onChange={handleInputChange}
                                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-gray-600"
                                        >
                                            <option value="">Pilih Matkul</option>
                                            {matkul.map((m) => (
                                                <option key={m.kode_matkul} value={m.kode_matkul}>
                                                    {m.kode_matkul} - {m.nama_matkul}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* JUDUL RPS */}
                                    <div className="flex items-center gap-4">
                                        <label className="w-34 text-gray-700 font-medium text-sm">Judul RPS</label>
                                        <input
                                            type="text"
                                            name="judul"
                                            value={formData.judul}
                                            onChange={handleInputChange}
                                            placeholder="Masukkan Judul RPS"
                                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-gray-600"
                                        />
                                    </div>

                                    {/* FILE RPS */}
                                    <div className="flex items-start gap-4">
                                        <label className="w-34 text-gray-700 font-medium text-sm pt-2">RPS (File)</label>
                                        <div className="flex-1">
                                            <div 
                                                className={`relative group border-2 border-dashed ${isDragging ? 'border-gray-500 bg-gray-50' : 'border-gray-300'} rounded-lg p-12 text-center transition-all duration-300`}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                            >
                                                {!file ? (
                                                    <>
                                                        {/* Animated Upload Icon */}
                                                        <div className="mb-6">
                                                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-200 text-gray-600 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                                                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
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
                                                                onChange={(e) => handleFileSelect(e.target.files[0])}
                                                            />
                                                        </div>
                                                    </>
                                                ) : (
                                                    /* File Preview */
                                                    <div className="bg-green-50 border border-green-200 rounded-xl py-3 px-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-3">
                                                                <i className="fas fa-check-circle text-green-500 text-xl"></i>
                                                                <span className="text-green-700 font-medium">{file.name}</span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={handleRemoveFile}
                                                                className="text-red-600 hover:text-red-700"
                                                                title="Hapus file"
                                                            >
                                                                <i className="fas fa-times text-lg"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 flex gap-3">
                                <Link
                                    href={route('dosen.rps.index')}
                                    className="px-6 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none transition-all duration-200 font-medium"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    className="px-6 py-2 text-sm shadow-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none transition-all duration-200 font-medium"
                                >
                                    <i className="fas fa-save mr-2"></i>
                                    Simpan RPS
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DosenLayout>
    );
}