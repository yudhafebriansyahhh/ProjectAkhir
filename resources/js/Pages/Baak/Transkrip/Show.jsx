import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';
import { Button } from '@/Components/ui/button';

const formatNumber = (value, digits = 2) => Number(value || 0).toFixed(digits);

const shortYear = (tahunAjaran) => {
    if (!tahunAjaran || tahunAjaran === '-') return '-';
    const parts = String(tahunAjaran).split('/');
    if (parts.length !== 2) return tahunAjaran;
    return `${parts[0].slice(-2)}/${parts[1].slice(-2)}`;
};

const Field = ({ label, value }) => (
    <div className="transcript-field">
        <span>{label}</span>
        <span>:</span>
        <strong>{value || '-'}</strong>
    </div>
);

export default function Show({ mahasiswa, rows = [], summary = {} }) {
    const handlePrint = () => window.print();

    return (
        <>
            <Head title={`Transkrip ${mahasiswa?.nama || ''}`} />

            <style>{`
                @page {
                    size: A4 portrait;
                    margin: 10mm 10mm 12mm;
                }

                body {
                    background: #e5e7eb;
                }

                .print-shell {
                    min-height: 100vh;
                    padding: 24px;
                }

                .print-toolbar {
                    margin: 0 auto 16px;
                    display: flex;
                    max-width: 210mm;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                }

                .transcript-page {
                    width: 210mm;
                    min-height: 297mm;
                    margin: 0 auto;
                    background: white;
                    color: #111827;
                    padding: 10mm 12mm 12mm;
                    font-family: "Times New Roman", Times, serif;
                    font-size: 10px;
                    line-height: 1.15;
                    box-shadow: 0 20px 50px rgba(15, 23, 42, 0.22);
                }

                .transcript-header {
                    display: grid;
                    grid-template-columns: 28mm 1fr 28mm;
                    align-items: center;
                    border-bottom: 1.5px solid #111827;
                    padding-bottom: 4px;
                    text-align: center;
                }

                .transcript-logo {
                    width: 24mm;
                    height: 24mm;
                    object-fit: contain;
                }

                .transcript-campus {
                    color: #2563eb;
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 22px;
                    font-weight: 700;
                    letter-spacing: 0.8px;
                    line-height: 1;
                    text-transform: uppercase;
                }

                .transcript-faculty {
                    margin-top: 2px;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .transcript-address {
                    margin-top: 5px;
                    font-size: 8px;
                    line-height: 1.25;
                }

                .transcript-contact {
                    margin-top: 2px;
                    font-size: 8px;
                    line-height: 1.25;
                }

                .transcript-title {
                    margin: 6px 0 12px;
                    text-align: center;
                    font-size: 13px;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .identity-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 18mm;
                    margin-bottom: 10px;
                }

                .transcript-field {
                    display: grid;
                    grid-template-columns: 24mm 3mm 1fr;
                    font-size: 10px;
                    line-height: 1.22;
                }

                .transcript-field strong {
                    font-weight: 400;
                }

                .grade-table {
                    width: 100%;
                    border-collapse: collapse;
                    table-layout: fixed;
                    font-size: 8.5px;
                }

                .grade-table th,
                .grade-table td {
                    border: 0.7px solid #9ca3af;
                    padding: 2px 3px;
                    vertical-align: middle;
                }

                .grade-table th {
                    text-align: center;
                    font-weight: 700;
                    line-height: 1.05;
                }

                .grade-table td {
                    line-height: 1.12;
                }

                .grade-table .center {
                    text-align: center;
                }

                .grade-table .right {
                    text-align: right;
                }

                .grade-table .course-name {
                    overflow-wrap: anywhere;
                }

                .grade-table .total-row td {
                    font-weight: 700;
                    text-align: center;
                }

                .summary-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20mm;
                    margin-top: 12px;
                    font-size: 9px;
                }

                .summary-field {
                    display: grid;
                    grid-template-columns: 44mm 3mm 1fr;
                    margin-bottom: 2px;
                }

                .signature-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 34mm;
                    margin-top: 10px;
                    text-align: center;
                    font-size: 9px;
                }

                .signature-space {
                    height: 28mm;
                }

                .signature-name {
                    font-weight: 700;
                    text-decoration: underline;
                }

                @media print {
                    body {
                        background: white !important;
                    }

                    .no-print {
                        display: none !important;
                    }

                    .print-shell {
                        min-height: 0;
                        padding: 0;
                    }

                    .transcript-page {
                        width: auto;
                        min-height: 0;
                        margin: 0;
                        padding: 0;
                        box-shadow: none;
                    }
                }
            `}</style>

            <div className="print-shell">
                <div className="print-toolbar no-print">
                    <Link href={route('baak.transkrip.index')}>
                        <Button type="button" variant="outline" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                    <Button type="button" className="gap-2" onClick={handlePrint}>
                        <Printer className="h-4 w-4" />
                        Cetak Transkrip
                    </Button>
                </div>

                <main className="transcript-page">
                    <header className="transcript-header">
                        <div>
                            <img src="/ITBR.jpeg" alt="ITB Riau" className="transcript-logo" />
                        </div>
                        <div>
                            <div className="transcript-campus">Institut Teknologi Bisnis Riau</div>
                            <div className="transcript-faculty">Sistem Informasi Akademik</div>
                            <div className="transcript-address">
                                Gedung Guru Riau, Jl. Jend. Sudirman Tangkerang Selatan, Kec. Bukit Raya Kota Pekanbaru - Riau. 28125
                            </div>
                            <div className="transcript-contact">
                                Telp. 0813-1015-5342 | WhatsApp +6282169742244 | Email info@itbriau.ac.id
                            </div>
                        </div>
                        <div />
                    </header>

                    <h1 className="transcript-title">Transkrip Nilai Akademik</h1>

                    <section className="identity-grid">
                        <div>
                            <Field label="Nomor Ijazah" value="-" />
                            <Field label="N I M" value={mahasiswa?.nim} />
                            <Field label="Nama" value={mahasiswa?.nama} />
                            <Field label="Tmp Lahir" value="-" />
                            <Field label="Tgl Lahir" value={mahasiswa?.tanggal_lahir} />
                        </div>
                        <div>
                            <Field label="Prog. Studi" value={`${mahasiswa?.prodi?.nama_prodi || '-'}${mahasiswa?.prodi?.jenjang ? `, ${mahasiswa.prodi.jenjang}` : ''}`} />
                            <Field label="Jurusan" value={mahasiswa?.prodi?.nama_prodi} />
                            <Field label="Masuk" value={mahasiswa?.tahun_masuk} />
                            <Field label="Lulus" value={mahasiswa?.status === 'lulus' ? '-' : '-'} />
                        </div>
                    </section>

                    <table className="grade-table">
                        <colgroup>
                            <col style={{ width: '7mm' }} />
                            <col style={{ width: '16mm' }} />
                            <col style={{ width: '22mm' }} />
                            <col />
                            <col style={{ width: '9mm' }} />
                            <col style={{ width: '12mm' }} />
                            <col style={{ width: '12mm' }} />
                            <col style={{ width: '12mm' }} />
                            <col style={{ width: '14mm' }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th rowSpan="2">NO</th>
                                <th rowSpan="2">SMSTR</th>
                                <th rowSpan="2">KODE<br />MK</th>
                                <th rowSpan="2">NAMA MATA KULIAH</th>
                                <th rowSpan="2">SKS<br />(S)</th>
                                <th colSpan="2">NILAI</th>
                                <th rowSpan="2">BOBOT<br />(B)</th>
                                <th rowSpan="2">B X S</th>
                            </tr>
                            <tr>
                                <th>ANGKA</th>
                                <th>HURUF</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length ? rows.map((row, index) => (
                                <tr key={`${row.kode_mk}-${row.semester}-${index}`}>
                                    <td className="center">{index + 1}</td>
                                    <td className="center">{row.semester} {shortYear(row.tahun_ajaran)}</td>
                                    <td className="center">{row.kode_mk}</td>
                                    <td className="course-name">{row.nama_mk}</td>
                                    <td className="center">{row.sks}</td>
                                    <td className="center">{row.nilai_angka ?? '-'}</td>
                                    <td className="center">{row.nilai_huruf || '-'}</td>
                                    <td className="center">{formatNumber(row.bobot)}</td>
                                    <td className="right">{formatNumber(row.bxs)}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="9" className="center">Belum ada data nilai yang dapat dicetak.</td>
                                </tr>
                            )}
                            <tr className="total-row">
                                <td colSpan="4">JUMLAH</td>
                                <td>{summary.total_sks || 0}</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td className="right">{formatNumber(summary.total_bxs)}</td>
                            </tr>
                        </tbody>
                    </table>

                    <section className="summary-grid">
                        <div>
                            <div className="summary-field"><span>Jumlah Mata Kuliah yang telah diambil</span><span>:</span><strong>{summary.jumlah_mata_kuliah || 0}</strong></div>
                            <div className="summary-field"><span>Jumlah SKS Kumulatif</span><span>:</span><strong>{summary.total_sks || 0}</strong></div>
                        </div>
                        <div>
                            <div className="summary-field"><span>Indeks Prestasi Kumulatif (IPK)</span><span>:</span><strong>{summary.ipk || '0,00'}</strong></div>
                            <div className="summary-field"><span>Yudisium</span><span>:</span><strong>{summary.predikat || '-'}</strong></div>
                        </div>
                    </section>

                    <section className="signature-grid">
                        <div>
                            <p>Rektor</p>
                            <div className="signature-space" />
                            <p className="signature-name">Rektor ITB Riau</p>
                        </div>
                        <div>
                            <p>Pekanbaru, {summary.tanggal_cetak || '-'}</p>
                            <p>Dekan</p>
                            <div className="signature-space" />
                            <p className="signature-name">Dekan</p>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
