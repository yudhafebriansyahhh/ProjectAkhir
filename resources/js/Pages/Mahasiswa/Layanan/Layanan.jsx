import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import MahasiswaLayout from '@/Layouts/MahasiswaLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Star, Info, AlertCircle } from 'lucide-react';

export default function LayananIndex({ pengajuans, krsList, unratedPengajuan }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    
    // State for mandatory rating
    const [ratingVal, setRatingVal] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [komentarRating, setKomentarRating] = useState('');
    const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        jenis_layanan: '',
        id_krs: '',
        keterangan: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('mahasiswa.layanan.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    const handleRateUnrated = (e) => {
        e.preventDefault();
        if (ratingVal === 0) {
            import('sweetalert2').then(({ default: Swal }) => {
                Swal.fire('Oops!', 'Silakan pilih rating (bintang) terlebih dahulu.', 'warning');
            });
            return;
        }
        
        setIsRatingSubmitting(true);
        router.patch(route('mahasiswa.layanan.rate', unratedPengajuan.id), { 
            rating: ratingVal,
            komentar_rating: komentarRating
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsRatingSubmitting(false);
                setRatingVal(0);
                setKomentarRating('');
            },
            onError: () => setIsRatingSubmitting(false)
        });
    };

    const openDetailModal = (item) => {
        setSelectedItem(item);
        setDetailModalOpen(true);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">Pending</span>;
            case 'diproses': return <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">Diproses</span>;
            case 'selesai': return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Selesai</span>;
            case 'ditolak': return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">Ditolak</span>;
            default: return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">{status}</span>;
        }
    };

    const getJenisLayananLabel = (jenis) => {
        switch (jenis) {
            case 'cetak_krs': return 'Cetak KRS';
            case 'cetak_khs': return 'Cetak KHS';
            case 'transkrip': return 'Cetak Transkrip Akademik';
            default: return jenis;
        }
    };

    return (
        <MahasiswaLayout title="Layanan Akademik">
            <Head title="Layanan Akademik" />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6 px-4 sm:px-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Layanan Akademik</h2>
                        <p className="text-sm text-gray-500 mt-1">Kelola dan pantau pengajuan dokumen akademik Anda.</p>
                    </div>
                    {!unratedPengajuan && (
                        <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                            <i className="fas fa-plus mr-2"></i> Ajukan Baru
                        </Button>
                    )}
                </div>

                {unratedPengajuan ? (
                    // Mandatory Rating Alert Section
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm mx-4 sm:mx-0">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <AlertCircle className="h-6 w-6 text-amber-600" aria-hidden="true" />
                            </div>
                            <div className="ml-4 flex-1">
                                <h3 className="text-lg font-bold text-amber-800">Rating Diperlukan</h3>
                                <div className="mt-2 text-sm text-amber-700">
                                    <p>
                                        Anda memiliki pengajuan <strong>{getJenisLayananLabel(unratedPengajuan.jenis_layanan)}</strong> yang telah Selesai pada {new Date(unratedPengajuan.updated_at).toLocaleDateString('id-ID')}. 
                                        Silakan berikan penilaian dan komentar terkait pelayanan BAAK sebelum Anda dapat mengakses kembali daftar riwayat atau membuat pengajuan baru.
                                    </p>
                                </div>
                                
                                <form onSubmit={handleRateUnrated} className="mt-6 bg-white p-5 rounded-lg border border-amber-100 shadow-sm">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Seberapa puas Anda dengan layanan ini?</label>
                                        <div className="flex space-x-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-8 h-8 cursor-pointer transition-colors ${
                                                        (hoverRating || ratingVal) >= star
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-200 hover:text-yellow-300'
                                                    }`}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => setRatingVal(star)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label htmlFor="komentar" className="block text-sm font-medium text-gray-700 mb-2">Komentar Pelayanan (Opsional)</label>
                                        <textarea
                                            id="komentar"
                                            rows="3"
                                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                            placeholder="Bagaimana pendapat Anda mengenai layanan ini..."
                                            value={komentarRating}
                                            onChange={(e) => setKomentarRating(e.target.value)}
                                        ></textarea>
                                    </div>
                                    
                                    <Button 
                                        type="submit" 
                                        disabled={isRatingSubmitting}
                                        className="bg-amber-600 hover:bg-amber-700 text-white"
                                    >
                                        {isRatingSubmitting ? 'Menyimpan...' : 'Kirim Penilaian'}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Normal Layanan Index Table
                    <Card className="border-0 shadow-sm rounded-lg overflow-hidden mx-4 sm:mx-0">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">#</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Tgl Pengajuan</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Layanan</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Status</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Rate</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-50">
                                    {pengajuans.data.length > 0 ? (
                                        pengajuans.data.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                    {(pengajuans.current_page - 1) * pengajuans.per_page + index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                    {new Date(item.created_at).toLocaleDateString('id-ID', {
                                                        day: '2-digit', month: 'short', year: 'numeric'
                                                    })} {new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                    {getJenisLayananLabel(item.jenis_layanan)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <div className="flex flex-col items-center space-y-1">
                                                        {getStatusBadge(item.status)}
                                                        {item.status === 'selesai' && (
                                                            <span className="text-xs text-blue-500">
                                                                [{new Date(item.updated_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}]
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    {item.status === 'selesai' ? (
                                                        <div className="flex items-center justify-center space-x-1">
                                                            <span className="text-sm font-medium text-gray-700">{item.rating ? `${item.rating}.0` : '0.0'}</span>
                                                            <Star className={`w-4 h-4 ${item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100" onClick={() => openDetailModal(item)}>
                                                        <Info className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                                                Belum ada riwayat pengajuan layanan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                {/* Modal Detail */}
                {detailModalOpen && selectedItem && (
                    <div className="fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-detail" role="dialog" aria-modal="true">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setDetailModalOpen(false)}></div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            
                            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                                <div className="bg-white">
                                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                        <h3 className="text-lg font-bold text-gray-900">Detail Pengajuan Layanan Akademik</h3>
                                        {selectedItem.status === 'selesai' && selectedItem.rating && (
                                            <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                                                <span className="font-bold text-yellow-700">{selectedItem.rating}.0</span>
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="px-6 py-6">
                                        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                            <div>
                                                <p className="text-sm font-semibold text-blue-500 mb-1">Layanan</p>
                                                <p className="text-base text-gray-900 font-medium">{getJenisLayananLabel(selectedItem.jenis_layanan)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-blue-500 mb-1">Status</p>
                                                <div>{getStatusBadge(selectedItem.status)}</div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-blue-500 mb-1">Tanggal Pengajuan</p>
                                                <p className="text-base text-gray-900 font-medium">
                                                    {new Date(selectedItem.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} {new Date(selectedItem.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-blue-500 mb-1">Tanggal Pembaharuan</p>
                                                <p className="text-base text-gray-900 font-medium">
                                                    {new Date(selectedItem.updated_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} {new Date(selectedItem.updated_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-sm font-semibold text-blue-500 mb-1">Detail</p>
                                                <p className="text-base text-gray-900 font-medium">
                                                    {selectedItem.jenis_layanan !== 'transkrip' && selectedItem.krs 
                                                        ? `Semester ${selectedItem.krs.semester} (${selectedItem.krs.tahun_ajaran})` 
                                                        : '-'}
                                                </p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-sm font-semibold text-blue-500 mb-1">Keterangan Anda</p>
                                                <p className="text-base text-gray-900 bg-gray-50 p-3 rounded-md">{selectedItem.keterangan || 'Tidak ada keterangan.'}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-sm font-semibold text-blue-500 mb-1">Keterangan BAAK</p>
                                                <p className="text-base text-gray-900 bg-blue-50 p-3 rounded-md border border-blue-100">{selectedItem.keterangan_admin || 'Tidak ada keterangan dari admin.'}</p>
                                            </div>
                                            {selectedItem.rating && (
                                                <div className="col-span-2 mt-2">
                                                    <p className="text-sm font-semibold text-yellow-600 mb-1">Komentar Penilaian Anda</p>
                                                    <p className="text-base text-gray-800 italic border-l-4 border-yellow-400 pl-3 py-1">
                                                        "{selectedItem.komentar_rating || 'Tanpa komentar.'}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                                        <Button
                                            type="button"
                                            onClick={() => setDetailModalOpen(false)}
                                            className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
                                        >
                                            Tutup
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Form */}
                {isModalOpen && !unratedPengajuan && (
                    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <form onSubmit={handleSubmit}>
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                                    Form Pengajuan Layanan
                                                </h3>
                                                <div className="mt-4 space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Jenis Layanan</label>
                                                        <select
                                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                                            value={data.jenis_layanan}
                                                            onChange={e => setData('jenis_layanan', e.target.value)}
                                                            required
                                                        >
                                                            <option value="" disabled>Pilih Layanan</option>
                                                            <option value="cetak_krs">Cetak KRS</option>
                                                            <option value="cetak_khs">Cetak KHS</option>
                                                            <option value="transkrip">Cetak Transkrip Akademik</option>
                                                        </select>
                                                        {errors.jenis_layanan && <p className="mt-1 text-xs text-red-500">{errors.jenis_layanan}</p>}
                                                    </div>

                                                    {(data.jenis_layanan === 'cetak_krs' || data.jenis_layanan === 'cetak_khs') && (
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Pilih KRS/KHS Semester</label>
                                                            <select
                                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                                                value={data.id_krs}
                                                                onChange={e => setData('id_krs', e.target.value)}
                                                                required
                                                            >
                                                                <option value="" disabled>Pilih Semester</option>
                                                                {krsList.map(krs => (
                                                                    <option key={krs.id_krs} value={krs.id_krs}>
                                                                        Semester {krs.semester} - TA {krs.tahun_ajaran}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {errors.id_krs && <p className="mt-1 text-xs text-red-500">{errors.id_krs}</p>}
                                                        </div>
                                                    )}

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Keterangan (Opsional)</label>
                                                        <textarea
                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            rows="3"
                                                            value={data.keterangan}
                                                            onChange={e => setData('keterangan', e.target.value)}
                                                            placeholder="Misal: Untuk keperluan beasiswa"
                                                        ></textarea>
                                                        {errors.keterangan && <p className="mt-1 text-xs text-red-500">{errors.keterangan}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        >
                                            {processing ? 'Mengirim...' : 'Ajukan'}
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        >
                                            Batal
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MahasiswaLayout>
    );
}
