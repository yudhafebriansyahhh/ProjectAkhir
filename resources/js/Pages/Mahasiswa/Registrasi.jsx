import { Head, Link, useForm } from '@inertiajs/react';
import MahasiswaLayout from '@/Layouts/MahasiswaLayout';

function InfoField({ label, value }) {
    return (
        <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
            <p className="mt-1 text-sm font-semibold text-gray-800">{value || '-'}</p>
        </div>
    );
}

function TextInput({ label, value, onChange, error, placeholder = '' }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className={`h-10 w-full rounded-lg border px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                    error ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
            />
            {error ? <p className="mt-1 text-xs font-medium text-red-600">{error}</p> : null}
        </div>
    );
}

export default function Registrasi({ mahasiswa = {}, registrasiUlang = {} }) {
    const periode = registrasiUlang?.periode;
    const registrasi = registrasiUlang?.registrasi;
    const riwayat = registrasiUlang?.riwayat || [];
    const canRegister = Boolean(registrasiUlang?.can_register);

    const { data, setData, post, processing, errors } = useForm({
        status_semester: 'aktif',
        keterangan: '',
        alamat: mahasiswa.alamat || '',
        no_hp: mahasiswa.no_hp || '',
        agama: mahasiswa.agama || '',
        nama_ayah: mahasiswa.nama_ayah || '',
        nama_ibu: mahasiswa.nama_ibu || '',
        no_telp_ayah: mahasiswa.no_telp_ayah || '',
        no_telp_ibu: mahasiswa.no_telp_ibu || '',
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('mahasiswa.registrasi-ulang.store'), {
            preserveScroll: true,
        });
    };

    return (
        <MahasiswaLayout title="Registrasi">
            <Head title="Registrasi" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Registrasi</h1>
                    <div className="mt-2 flex items-center gap-2 text-sm font-semibold">
                        <Link href={route('mahasiswa.dashboard')} className="text-gray-400 hover:text-blue-600">
                            Home
                        </Link>
                        <span className="text-gray-400">-</span>
                        <span className="text-gray-900">Registrasi</span>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                    {!periode ? (
                        <div className="rounded-lg bg-rose-50 px-5 py-5 text-rose-900">
                            <div className="flex gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-700">
                                    <i className="fa-solid fa-shield-halved text-xl"></i>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">
                                        Jadwal Registrasi : <span className="uppercase text-rose-500">Tidak Aktif</span>
                                    </h2>
                                    <p className="mt-1 text-sm text-rose-900">
                                        Tidak ada jadwal registrasi yang buka saat ini. Silahkan lakukan registrasi saat jadwal registrasi sudah dibuka.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-blue-200 bg-blue-50 px-5 py-5 text-blue-900">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-lg font-bold">
                                        Jadwal Registrasi : <span className="uppercase text-blue-600">Aktif</span>
                                    </h2>
                                    <p className="mt-1 text-sm">
                                        Periode {periode.tahun_ajaran} - {periode.jenis_semester}, dibuka {periode.tanggal_mulai} sampai {periode.tanggal_selesai}.
                                    </p>
                                </div>
                                {registrasi ? (
                                    <span className="w-fit rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-bold capitalize text-green-700">
                                        Sudah Registrasi: {registrasi.status_semester}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    )}

                    {!periode ? (
                        <div className="mt-8 rounded-lg bg-rose-50 px-4 py-4 text-center font-semibold text-rose-300">
                            Registrasi
                        </div>
                    ) : registrasi ? (
                        <div className="mt-8 rounded-lg border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-800">
                            Anda sudah registrasi untuk semester {registrasi.semester} dengan status <span className="font-bold capitalize">{registrasi.status_semester}</span> pada {registrasi.tanggal_registrasi}.
                        </div>
                    ) : canRegister ? (
                        <form onSubmit={submit} className="mt-8">
                            <div className="grid gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 md:grid-cols-3">
                                <InfoField label="Nama" value={mahasiswa.nama} />
                                <InfoField label="NIM" value={mahasiswa.nim} />
                                <InfoField label="Program Studi" value={mahasiswa.prodi} />
                            </div>

                            <div className="mt-6 grid gap-4 md:grid-cols-2">
                                <TextInput label="Alamat" value={data.alamat} onChange={(value) => setData('alamat', value)} error={errors.alamat} placeholder="Alamat domisili saat ini" />
                                <TextInput label="No HP / WhatsApp" value={data.no_hp} onChange={(value) => setData('no_hp', value)} error={errors.no_hp} placeholder="Contoh: 081234567890" />
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">Agama</label>
                                    <select
                                        value={data.agama}
                                        onChange={(event) => setData('agama', event.target.value)}
                                        className={`h-10 w-full rounded-lg border px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                                            errors.agama ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                                        }`}
                                    >
                                        <option value="">Pilih Agama</option>
                                        <option value="Islam">Islam</option>
                                        <option value="Kristen Protestan">Kristen Protestan</option>
                                        <option value="Katolik">Katolik</option>
                                        <option value="Hindu">Hindu</option>
                                        <option value="Buddha">Buddha</option>
                                        <option value="Konghucu">Konghucu</option>
                                    </select>
                                    {errors.agama ? <p className="mt-1 text-xs font-medium text-red-600">{errors.agama}</p> : null}
                                </div>
                                <TextInput label="Nama Ayah" value={data.nama_ayah} onChange={(value) => setData('nama_ayah', value)} error={errors.nama_ayah} />
                                <TextInput label="No Telp Ayah" value={data.no_telp_ayah} onChange={(value) => setData('no_telp_ayah', value)} error={errors.no_telp_ayah} />
                                <TextInput label="Nama Ibu" value={data.nama_ibu} onChange={(value) => setData('nama_ibu', value)} error={errors.nama_ibu} />
                                <TextInput label="No Telp Ibu" value={data.no_telp_ibu} onChange={(value) => setData('no_telp_ibu', value)} error={errors.no_telp_ibu} />
                            </div>

                            <div className="mt-6">
                                <label className="mb-2 block text-sm font-semibold text-gray-700">Status Semester</label>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {[
                                        ['aktif', 'Aktif', 'Saya akan mengikuti perkuliahan semester ini.'],
                                        ['cuti', 'Cuti', 'Saya tidak mengikuti perkuliahan semester ini.'],
                                    ].map(([value, label, description]) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setData('status_semester', value)}
                                            className={`rounded-lg border px-4 py-3 text-left transition ${
                                                data.status_semester === value
                                                    ? 'border-blue-500 bg-blue-50 text-blue-800'
                                                    : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                                            }`}
                                        >
                                            <p className="font-semibold">{label}</p>
                                            <p className="mt-1 text-xs">{description}</p>
                                        </button>
                                    ))}
                                </div>
                                {errors.status_semester ? <p className="mt-1 text-xs font-medium text-red-600">{errors.status_semester}</p> : null}
                            </div>

                            {data.status_semester === 'cuti' ? (
                                <div className="mt-5">
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">Alasan Cuti</label>
                                    <textarea
                                        value={data.keterangan}
                                        onChange={(event) => setData('keterangan', event.target.value)}
                                        rows={4}
                                        maxLength={500}
                                        placeholder="Tuliskan alasan cuti semester ini"
                                        className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 ${
                                            errors.keterangan ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                                        }`}
                                    />
                                    <div className="mt-1 flex justify-between text-xs">
                                        <span className="font-medium text-red-600">{errors.keterangan}</span>
                                        <span className="text-gray-500">{data.keterangan.length}/500</span>
                                    </div>
                                </div>
                            ) : null}

                            <div className="mt-8 border-t border-gray-200 pt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing ? 'Menyimpan...' : 'Registrasi'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="mt-8 rounded-lg bg-gray-100 px-4 py-4 text-center font-semibold text-gray-400">
                            Registrasi
                        </div>
                    )}

                    <div className="my-8 border-t border-gray-300"></div>

                    <div className="overflow-hidden rounded-lg border border-gray-200">
                        <div className="bg-gray-100 px-4 py-4 text-center text-base font-semibold text-gray-700">
                            <i className="fa-solid fa-magnifying-glass mr-2"></i>
                            Riwayat Registrasi
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px] text-sm">
                                <thead className="bg-gray-50 text-gray-600">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-semibold">Semester</th>
                                        <th className="px-4 py-3 text-left font-semibold">Periode</th>
                                        <th className="px-4 py-3 text-left font-semibold">Status</th>
                                        <th className="px-4 py-3 text-left font-semibold">Tanggal</th>
                                        <th className="px-4 py-3 text-left font-semibold">Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {riwayat.length > 0 ? riwayat.map((item) => (
                                        <tr key={item.id_registrasi}>
                                            <td className="px-4 py-3 font-semibold text-gray-800">Semester {item.semester}</td>
                                            <td className="px-4 py-3 text-gray-700">{item.tahun_ajaran} - {item.jenis_semester}</td>
                                            <td className="px-4 py-3">
                                                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                                                    item.status_semester === 'aktif'
                                                        ? 'bg-green-50 text-green-700'
                                                        : 'bg-amber-50 text-amber-700'
                                                }`}>
                                                    {item.status_semester}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">{item.tanggal_registrasi}</td>
                                            <td className="px-4 py-3 text-gray-600">{item.keterangan || '-'}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                                                Belum ada riwayat registrasi.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </MahasiswaLayout>
    );
}
