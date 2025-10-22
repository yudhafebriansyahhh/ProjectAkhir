<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Mahasiswa</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        .header h1 {
            margin: 0;
            font-size: 18px;
        }
        .header p {
            margin: 5px 0;
            font-size: 12px;
            color: #666;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th {
            background-color: #f3f4f6;
            padding: 10px;
            text-align: left;
            border: 1px solid #ddd;
            font-weight: bold;
        }
        td {
            padding: 8px;
            border: 1px solid #ddd;
        }
        .status-badge {
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
        }
        .status-aktif { background-color: #dcfce7; color: #166534; }
        .status-lulus { background-color: #dbeafe; color: #1e40af; }
        .status-cuti { background-color: #fef3c7; color: #92400e; }
        .status-do { background-color: #fee2e2; color: #991b1b; }
        .footer {
            margin-top: 30px;
            text-align: right;
            font-size: 10px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>LAPORAN DATA MAHASISWA</h1>
        <p>Institut Teknologi dan Bisnis Riau</p>
        <p>Tanggal Cetak: {{ $tanggal }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th width="5%">No</th>
                <th width="15%">NIM</th>
                <th width="25%">Nama</th>
                <th width="20%">Program Studi</th>
                <th width="10%">Tahun Masuk</th>
                <th width="10%">Semester</th>
                <th width="15%">Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($mahasiswa as $index => $mhs)
            <tr>
                <td style="text-align: center;">{{ $index + 1 }}</td>
                <td>{{ $mhs->nim }}</td>
                <td>{{ $mhs->nama }}</td>
                <td>{{ $mhs->prodi->nama_prodi ?? '-' }}</td>
                <td style="text-align: center;">{{ $mhs->tahun_masuk }}</td>
                <td style="text-align: center;">{{ $mhs->semester_ke }}</td>
                <td>
                    <span class="status-badge status-{{ $mhs->status }}">
                        {{ strtoupper($mhs->status) }}
                    </span>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Total: {{ count($mahasiswa) }} mahasiswa</p>
    </div>
</body>
</html>
