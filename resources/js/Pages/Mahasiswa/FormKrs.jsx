import { Head, Link, router } from '@inertiajs/react';
import MahasiswaLayout from '@/Layouts/MahasiswaLayout';

export default function FormKrs({
    kelas = [],
    selectedKelasIds = [],
    semester = null,
    periode = null,
    sksLimit = null,
}) {
    const selectedIds = new Set(selectedKelasIds.map((id) => Number(id)));
    const maksimalSks = Number(sksLimit?.maksimal_sks || 24);
    const totalSks = Number(sksLimit?.total_sks || 0);
    const sisaSks = Math.max(0, Number(sksLimit?.sisa_sks ?? maksimalSks - totalSks));
    const ipsText = sksLimit?.ips !== null && sksLimit?.ips !== undefined ? Number(sksLimit.ips).toFixed(2) : '-';

    const pilihKelas = (idKelas) => {
        router.post(route('mahasiswa.krs.store-item', idKelas), {}, {
            preserveScroll: true,
        });
    };

    return (
        <MahasiswaLayout title="Pengisian Kartu Rencana Studi (KRS)">
            <Head title="Pengisian Kartu Rencana Studi (KRS)" />

            <div className="container max-w-6xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">Pengisian Kartu Rencana Studi (KRS)</h1>
                    <p className="text-gray-600">
                        Pilih kelas yang tersedia untuk semester {semester ?? '-'} periode {periode ? `${periode.tahun_ajaran} - ${periode.jenis_semester}` : '-'}.
                    </p>
                </div>

                <div className="mb-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">IPS Semester Sebelumnya</p>
                        <p className="mt-1 text-2xl font-bold text-blue-900">{ipsText}</p>
                        <p className="mt-1 text-xs text-blue-700">{sksLimit?.keterangan || 'Berdasarkan IPS semester sebelumnya.'}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Jatah Maksimal</p>
                        <p className="mt-1 text-2xl font-bold text-slate-900">{maksimalSks} SKS</p>
                        <p className="mt-1 text-xs text-slate-500">Total SKS yang boleh diambil semester ini.</p>
                    </div>
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Terpakai / Sisa</p>
                        <p className="mt-1 text-2xl font-bold text-emerald-900">{totalSks} / {sisaSks} SKS</p>
                        <p className="mt-1 text-xs text-emerald-700">SKS dipilih saat ini / sisa jatah.</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700">Daftar Kelas Aktif</h3>
                        <p className="text-sm text-gray-600 mt-1">Kelas yang tampil hanya kelas pada periode terbaru dan sesuai prodi serta semester Anda.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr className="text-gray-600 font-semibold text-xs">
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Kode</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Mata Kuliah</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Kelas</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Dosen</th>
                                    <th className="px-6 py-3 text-left uppercase tracking-wider">Jadwal</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">SKS</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Slot</th>
                                    <th className="px-6 py-3 text-center uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {kelas.length > 0 ? (
                                    kelas.map((item, index) => {
                                        const isSelected = selectedIds.has(Number(item.id_kelas));
                                        const isFull = item.sisa_slot <= 0;
                                        const willExceedLimit = !isSelected && Number(item.sks || 0) > sisaSks;

                                        return (
                                            <tr key={item.id_kelas} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{index + 1}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{item.kode_matkul}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{item.nama_matkul}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.nama_kelas}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{item.dosen}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    <div>{item.hari} {item.jam}</div>
                                                    <div className="text-xs text-gray-500">Ruang {item.ruang}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center font-medium">{item.sks}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                                    {item.jumlah_mahasiswa}/{item.kapasitas}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                    <button
                                                        type="button"
                                                        disabled={isSelected || isFull || willExceedLimit}
                                                        onClick={() => pilihKelas(item.id_kelas)}
                                                        className={`inline-flex items-center px-3 py-1.5 border rounded-lg text-xs font-semibold transition-all duration-200 ${
                                                            isSelected
                                                                ? 'border-blue-200 text-blue-700 bg-blue-50 cursor-not-allowed'
                                                                : isFull
                                                                    ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                                                                    : willExceedLimit
                                                                        ? 'border-amber-200 text-amber-700 bg-amber-50 cursor-not-allowed'
                                                                        : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                                                        }`}
                                                    >
                                                        {isSelected ? 'Dipilih' : isFull ? 'Penuh' : willExceedLimit ? 'Melebihi SKS' : 'Pilih'}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                                            Belum ada kelas aktif yang tersedia untuk periode, prodi, dan semester Anda.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-8 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">Catatan:</span> KRS masih berstatus draft. Klik Ajukan/Kunci KRS di halaman KRS jika pilihan sudah final.
                    </div>
                    <Link href={route('mahasiswa.krs')}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors">
                        Selesai
                    </Link>
                </div>
            </div>
        </MahasiswaLayout>
    );
}
