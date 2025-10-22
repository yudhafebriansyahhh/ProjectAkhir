<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan IPK</title>
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
        .rank-badge {
            display: inline-block;
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border-radius: 50%;
            font-weight: bold;
            color: white;
        }
        .rank-1 { background-color: #fbbf24; }
        .rank-2 { background-color: #9ca3af; }
        .rank-3 { background-color: #fb923c; }
        .ipk-badge {
            padding: 4px 10px;
            border-radius: 4px;
            background-color: #e9d5ff;
            color: #6b21a8;
            font-weight: bold;
        }
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
        <h1>TOP 10 MAHASISWA IPK TERTINGGI</h1>
        <p>Institut Teknologi dan Bisnis Riau</p>
        <p>Tanggal Cetak: {{ $tanggal }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th width="8%">Rank</th>
                <th width="15%">NIM</th>
                <th width="30%">Nama</th>
                <th width="25%">Program Studi</th>
                <th width="10%">Semester</th>
                <th width="12%">IPK</th>
            </tr>
        </thead>
        <tbody>
            @foreach($mahasiswa as $index => $mhs)
            <tr>
                <td style="text-align: center;">
                    <span class="rank-badge rank-{{ $index + 1 <= 3 ? $index + 1 : 'other' }}">
                        {{ $index + 1 }}
                    </span>
                </td>
                <td>{{ $mhs->nim }}</td>
                <td>{{ $mhs->nama }}</td>
                <td>{{ $mhs->nama_prodi }}</td>
                <td style="text-align: center;">{{ $mhs->semester_ke }}</td>
                <td style="text-align: center;">
                    <span class="ipk-badge">{{ number_format($mhs->ipk, 2) }}</span>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Top {{ count($mahasiswa) }} mahasiswa dengan IPK tertinggi</p>
    </div>
</body>
</html>
