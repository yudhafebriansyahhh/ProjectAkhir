import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import BaakLayout from '@/Layouts/BaakLayout';
import { Button } from '@/Components/ui/button';
import { FormCard, FormField, RadioCardGroup } from '@/Components/ui/form-card';
import { PageHeader } from '@/Components/ui/data-display';

export default function Create({ periodes }) {
    const { data, setData, post, processing, errors } = useForm({
        nim: '',
        tahun_ajaran: '',
        jenis_semester: '',
        status_semester: 'aktif',
        keterangan: '',
    });

    const [mahasiswaSearch, setMahasiswaSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (mahasiswaSearch.length < 3) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        const timer = setTimeout(() => {
            fetch(route('baak.api.search-mahasiswa', { search: mahasiswaSearch }))
                .then((response) => response.json())
                .then((result) => {
                    setSearchResults(result);
                    setShowDropdown(true);
                });
        }, 300);

        return () => clearTimeout(timer);
    }, [mahasiswaSearch]);

    const handleSelectMahasiswa = (mahasiswa) => {
        setSelectedMahasiswa(mahasiswa);
        setData('nim', mahasiswa.nim);
        setMahasiswaSearch(`${mahasiswa.nim} - ${mahasiswa.nama}`);
        setShowDropdown(false);
        setSearchResults([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('baak.registrasi-semester.store'));
    };

    return (
        <BaakLayout title="Tambah Registrasi Manual">
            <Head title="Tambah Registrasi Manual" />

            <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 lg:px-6">
                <div className="mx-auto flex max-w-5xl flex-col gap-5">
                    <Link
                        href={route('baak.registrasi-semester.index')}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Kembali ke Daftar Registrasi
                    </Link>

                    <PageHeader
                        title="Registrasi Manual Mahasiswa"
                        description="Isi formulir berikut untuk melakukan registrasi manual."
                    />

                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                        <p className="mb-1 font-semibold">Perhatian!</p>
                        <p>
                            Registrasi manual bypass periode registrasi aktif. Pastikan alasan dan keterangan lengkap
                            untuk keperluan audit.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <FormCard
                            footer={
                                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                    <Link href={route('baak.registrasi-semester.index')} className="w-full sm:w-auto">
                                        <Button type="button" variant="outline" className="w-full sm:w-auto">
                                            Batal
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                                        {processing ? 'Menyimpan...' : 'Simpan Registrasi'}
                                    </Button>
                                </div>
                            }
                        >
                            <div className="relative">
                                <FormField label="Cari Mahasiswa" required error={errors.nim}>
                                    <input
                                        type="text"
                                        value={mahasiswaSearch}
                                        onChange={(e) => setMahasiswaSearch(e.target.value)}
                                        placeholder="Ketik NIM atau nama mahasiswa minimal 3 karakter"
                                        className={`h-10 w-full rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.nim ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        autoComplete="off"
                                    />
                                </FormField>

                                {showDropdown && (
                                    <div className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                                        {searchResults.length > 0 ? (
                                            searchResults.map((mahasiswa) => (
                                                <button
                                                    key={mahasiswa.id_mahasiswa}
                                                    type="button"
                                                    onClick={() => handleSelectMahasiswa(mahasiswa)}
                                                    className="w-full border-b border-slate-100 px-4 py-3 text-left transition last:border-0 hover:bg-blue-50"
                                                >
                                                    <p className="truncate text-sm font-semibold text-slate-950">
                                                        {mahasiswa.nim} - {mahasiswa.nama}
                                                    </p>
                                                    <p className="truncate text-xs text-slate-500">
                                                        {mahasiswa.prodi?.nama_prodi || '-'}
                                                    </p>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-sm text-slate-500">
                                                Mahasiswa tidak ditemukan
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {selectedMahasiswa ? (
                                <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4">
                                    <h4 className="text-sm font-semibold text-blue-900">Mahasiswa Terpilih</h4>
                                    <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                                        <div>
                                            <p className="text-xs text-slate-500">NIM</p>
                                            <p className="font-semibold text-slate-950">{selectedMahasiswa.nim}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Nama</p>
                                            <p className="font-semibold text-slate-950">{selectedMahasiswa.nama}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Prodi</p>
                                            <p className="font-semibold text-slate-950">
                                                {selectedMahasiswa.prodi?.nama_prodi || '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Status</p>
                                            <span
                                                className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                                                    selectedMahasiswa.status === 'aktif'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-slate-100 text-slate-700'
                                                }`}
                                            >
                                                {selectedMahasiswa.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                                <FormField label="Tahun Ajaran" required error={errors.tahun_ajaran}>
                                    <select
                                        value={data.tahun_ajaran}
                                        onChange={(e) => setData('tahun_ajaran', e.target.value)}
                                        className={`h-10 w-full rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.tahun_ajaran ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Pilih Tahun Ajaran</option>
                                        {periodes.map((periode) => (
                                            <option key={periode.id_periode} value={periode.tahun_ajaran}>
                                                {periode.tahun_ajaran}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>

                                <FormField label="Jenis Semester" required error={errors.jenis_semester}>
                                    <select
                                        value={data.jenis_semester}
                                        onChange={(e) => setData('jenis_semester', e.target.value)}
                                        className={`h-10 w-full rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.jenis_semester ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Pilih Jenis Semester</option>
                                        <option value="ganjil">Ganjil</option>
                                        <option value="genap">Genap</option>
                                    </select>
                                </FormField>
                            </div>

                            <div className="mt-6">
                                <FormField label="Status Semester" required error={errors.status_semester}>
                                    <RadioCardGroup
                                        name="status_semester"
                                        value={data.status_semester}
                                        onChange={(value) => setData('status_semester', value)}
                                        options={[
                                            { value: 'aktif', label: 'Aktif' },
                                            { value: 'cuti', label: 'Cuti' },
                                        ]}
                                    />
                                </FormField>
                            </div>

                            <div className="mt-6">
                                <FormField
                                    label="Keterangan/Alasan Registrasi Manual"
                                    required
                                    error={errors.keterangan}
                                    hint="Wajib diisi untuk keperluan tracking dan audit."
                                >
                                    <textarea
                                        value={data.keterangan}
                                        onChange={(e) => setData('keterangan', e.target.value)}
                                        placeholder="Contoh: Registrasi manual oleh BAAK karena mahasiswa belum registrasi saat periode aktif."
                                        rows={4}
                                        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.keterangan ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    <div className="mt-1 text-right text-xs text-slate-500">{data.keterangan.length}/500</div>
                                </FormField>
                            </div>
                        </FormCard>
                    </form>
                </div>
            </div>
        </BaakLayout>
    );
}
