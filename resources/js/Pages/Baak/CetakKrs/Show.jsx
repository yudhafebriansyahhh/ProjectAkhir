import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';
import { Button } from '@/Components/ui/button';

const statusLabel = (status) => ({
    draft: 'Draft',
    pending: 'Menunggu Persetujuan',
    approved: 'Disetujui',
    rejected: 'Ditolak',
}[status] || status || '-');

const Field = ({ label, value }) => (
    <div className="print-field">
        <span>{label}</span>
        <span>:</span>
        <strong>{value || '-'}</strong>
    </div>
);

export default function Show({ krs, rows = [], summary = {} }) {
    return (
        <>
            <Head title={`Cetak KRS ${krs?.mahasiswa?.nama || ''}`} />
            <style>{`
                @page { size: A4 portrait; margin: 12mm; }
                body { background: #e5e7eb; }
                .print-shell { min-height: 100vh; padding: 24px; }
                .print-toolbar { margin: 0 auto 16px; display: flex; max-width: 210mm; align-items: center; justify-content: space-between; gap: 12px; }
                .print-page { width: 210mm; min-height: 297mm; margin: 0 auto; background: white; color: #111827; padding: 12mm; font-family: "Times New Roman", Times, serif; font-size: 11px; line-height: 1.2; box-shadow: 0 20px 50px rgba(15, 23, 42, 0.22); }
                .print-header { display: grid; grid-template-columns: 28mm 1fr 28mm; align-items: center; border-bottom: 1.5px solid #111827; padding-bottom: 5px; text-align: center; }
                .print-logo { width: 24mm; height: 24mm; object-fit: contain; }
                .print-campus { color: #2563eb; font-family: Georgia, "Times New Roman", serif; font-size: 22px; font-weight: 700; letter-spacing: .8px; line-height: 1; text-transform: uppercase; }
                .print-subtitle { margin-top: 2px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
                .print-address, .print-contact { margin-top: 3px; font-size: 8px; line-height: 1.25; }
                .print-title { margin: 10px 0 12px; text-align: center; font-size: 14px; font-weight: 700; text-transform: uppercase; }
                .identity-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18mm; margin-bottom: 12px; }
                .print-field { display: grid; grid-template-columns: 26mm 3mm 1fr; line-height: 1.45; }
                .print-field strong { font-weight: 400; }
                .print-table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 9px; }
                .print-table th, .print-table td { border: .7px solid #9ca3af; padding: 3px 4px; vertical-align: middle; }
                .print-table th { text-align: center; font-weight: 700; }
                .center { text-align: center; }
                .right { text-align: right; }
                .summary { margin-top: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 18mm; font-size: 10px; }
                .signature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 34mm; margin-top: 24px; text-align: center; font-size: 10px; }
                .signature-space { height: 28mm; }
                .signature-name { font-weight: 700; text-decoration: underline; }
                @media print { body { background: white !important; } .no-print { display: none !important; } .print-shell { min-height: 0; padding: 0; } .print-page { width: auto; min-height: 0; margin: 0; padding: 0; box-shadow: none; } }
            `}</style>
            <div className="print-shell">
                <div className="print-toolbar no-print">
                    <Link href={route('baak.cetak-krs.index')}><Button type="button" variant="outline" className="gap-2"><ArrowLeft className="h-4 w-4" />Kembali</Button></Link>
                    <Button type="button" className="gap-2" onClick={() => window.print()}><Printer className="h-4 w-4" />Cetak KRS</Button>
                </div>
                <main className="print-page">
                    <header className="print-header">
                        <div><img src="/ITBR.jpeg" alt="ITB Riau" className="print-logo" /></div>
                        <div>
                            <div className="print-campus">Institut Teknologi Bisnis Riau</div>
                            <div className="print-subtitle">Sistem Informasi Akademik</div>
                            <div className="print-address">Gedung Guru Riau, Jl. Jend. Sudirman Tangkerang Selatan, Kec. Bukit Raya Kota Pekanbaru - Riau. 28125</div>
                            <div className="print-contact">Telp. 0813-1015-5342 | WhatsApp +6282169742244 | Email info@itbriau.ac.id</div>
                        </div>
                        <div />
                    </header>
                    <h1 className="print-title">Kartu Rencana Studi (KRS)</h1>
                    <section className="identity-grid">
                        <div>
                            <Field label="N I M" value={krs?.mahasiswa?.nim} />
                            <Field label="Nama" value={krs?.mahasiswa?.nama} />
                            <Field label="Prog. Studi" value={`${krs?.mahasiswa?.prodi?.nama_prodi || '-'}${krs?.mahasiswa?.prodi?.jenjang ? `, ${krs.mahasiswa.prodi.jenjang}` : ''}`} />
                        </div>
                        <div>
                            <Field label="Semester" value={krs?.semester} />
                            <Field label="Tahun Ajaran" value={krs?.tahun_ajaran} />
                            <Field label="Status" value={statusLabel(krs?.status)} />
                        </div>
                    </section>
                    <table className="print-table">
                        <thead>
                            <tr>
                                <th style={{ width: '8mm' }}>NO</th>
                                <th style={{ width: '23mm' }}>KODE MK</th>
                                <th>NAMA MATA KULIAH</th>
                                <th style={{ width: '13mm' }}>KELAS</th>
                                <th style={{ width: '10mm' }}>SKS</th>
                                <th style={{ width: '25mm' }}>JADWAL</th>
                                <th style={{ width: '18mm' }}>RUANG</th>
                                <th style={{ width: '32mm' }}>DOSEN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length ? rows.map((row, index) => (
                                <tr key={`${row.kode_mk}-${index}`}>
                                    <td className="center">{index + 1}</td>
                                    <td className="center">{row.kode_mk}</td>
                                    <td>{row.nama_mk}</td>
                                    <td className="center">{row.kelas}</td>
                                    <td className="center">{row.sks}</td>
                                    <td className="center">{row.hari}, {row.jam}</td>
                                    <td className="center">{row.ruang}</td>
                                    <td>{row.dosen}</td>
                                </tr>
                            )) : <tr><td colSpan="8" className="center">Belum ada mata kuliah.</td></tr>}
                            <tr>
                                <td colSpan="4" className="center"><strong>JUMLAH</strong></td>
                                <td className="center"><strong>{summary.total_sks || 0}</strong></td>
                                <td colSpan="3" />
                            </tr>
                        </tbody>
                    </table>
                    <section className="summary">
                        <div><Field label="Jumlah Mata Kuliah" value={summary.jumlah_mata_kuliah || 0} /></div>
                        <div><Field label="Jumlah SKS" value={summary.total_sks || 0} /></div>
                    </section>
                    <section className="signature-grid">
                        <div><p>Mahasiswa</p><div className="signature-space" /><p className="signature-name">{krs?.mahasiswa?.nama || '-'}</p></div>
                        <div><p>Pekanbaru, {summary.tanggal_cetak || '-'}</p><p>Dosen Wali</p><div className="signature-space" /><p className="signature-name">{krs?.mahasiswa?.dosen_wali || '-'}</p></div>
                    </section>
                </main>
            </div>
        </>
    );
}
