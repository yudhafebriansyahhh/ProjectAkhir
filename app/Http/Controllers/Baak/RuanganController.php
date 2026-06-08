<?php

namespace App\Http\Controllers\Baak;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRuanganRequest;
use App\Http\Requests\UpdateRuanganRequest;
use App\Models\Kelas;
use App\Models\Ruangan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RuanganController extends Controller
{
    private array $days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    public function index(Request $request)
    {
        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();

        $ruangan = Ruangan::withCount('kelas')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('kode_ruangan', 'like', "%{$search}%")
                        ->orWhere('nama_ruangan', 'like', "%{$search}%")
                        ->orWhere('gedung', 'like', "%{$search}%");
                });
            })
            ->when($status !== '', fn ($query) => $query->where('is_active', $status === 'aktif'))
            ->orderBy('kode_ruangan')
            ->paginate(10)
            ->withQueryString();

        $scheduleRooms = Ruangan::with(['kelas' => function ($query) {
            $query->with(['mataKuliahPeriode.mataKuliah', 'dosen'])
                ->orderByRaw("FIELD(hari, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu')")
                ->orderBy('jam_mulai');
        }])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('kode_ruangan', 'like', "%{$search}%")
                        ->orWhere('nama_ruangan', 'like', "%{$search}%")
                        ->orWhere('gedung', 'like', "%{$search}%");
                });
            })
            ->when($status !== '', fn ($query) => $query->where('is_active', $status === 'aktif'))
            ->orderBy('kode_ruangan')
            ->get()
            ->map(fn ($room) => [
                'id_ruangan' => $room->id_ruangan,
                'kode_ruangan' => $room->kode_ruangan,
                'nama_ruangan' => $room->nama_ruangan,
                'kelas' => $room->kelas->map(fn ($kelas) => [
                    'id_kelas' => $kelas->id_kelas,
                    'nama_kelas' => $kelas->nama_kelas,
                    'hari' => $kelas->hari,
                    'jam_mulai' => $kelas->jam_mulai?->format('H:i'),
                    'jam_selesai' => $kelas->jam_selesai?->format('H:i'),
                    'mata_kuliah' => $kelas->mataKuliahPeriode?->mataKuliah?->nama_matkul,
                    'kode_matkul' => $kelas->mataKuliahPeriode?->mataKuliah?->kode_matkul,
                    'dosen' => $kelas->dosen?->nama,
                ])->values(),
            ])
            ->values();

        return Inertia::render('Baak/Ruangan/Index', [
            'ruangan' => $ruangan,
            'scheduleRooms' => $scheduleRooms,
            'days' => $this->days,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'stats' => [
                'total' => Ruangan::count(),
                'aktif' => Ruangan::where('is_active', true)->count(),
                'nonaktif' => Ruangan::where('is_active', false)->count(),
                'dipakai' => Ruangan::whereHas('kelas')->count(),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Baak/Ruangan/Create');
    }

    public function store(StoreRuanganRequest $request)
    {
        Ruangan::create($this->normalizeData($request->validated()));

        return redirect()->route('baak.ruangan.index')
            ->with('success', 'Ruangan berhasil ditambahkan');
    }

    public function show(Ruangan $ruangan)
    {
        $ruangan->load(['kelas' => function ($query) {
            $query->with(['mataKuliahPeriode.mataKuliah', 'dosen'])
                ->orderByRaw("FIELD(hari, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu')")
                ->orderBy('jam_mulai');
        }])->loadCount('kelas');

        return Inertia::render('Baak/Ruangan/Show', [
            'ruangan' => $ruangan,
            'jadwal' => $this->buildSchedule($ruangan),
            'days' => $this->days,
        ]);
    }

    public function edit(Ruangan $ruangan)
    {
        return Inertia::render('Baak/Ruangan/Edit', [
            'ruangan' => $ruangan,
        ]);
    }

    public function update(UpdateRuanganRequest $request, Ruangan $ruangan)
    {
        $ruangan->update($this->normalizeData($request->validated()));

        Kelas::where('id_ruangan', $ruangan->id_ruangan)
            ->update(['ruang_kelas' => $ruangan->kode_ruangan]);

        return redirect()->route('baak.ruangan.index')
            ->with('success', 'Ruangan berhasil diupdate');
    }

    public function destroy(Ruangan $ruangan)
    {
        if ($ruangan->kelas()->exists()) {
            return back()->with('error', 'Ruangan tidak dapat dihapus karena masih digunakan oleh kelas');
        }

        $ruangan->delete();

        return redirect()->route('baak.ruangan.index')
            ->with('success', 'Ruangan berhasil dihapus');
    }

    private function normalizeData(array $data): array
    {
        $data['kode_ruangan'] = strtoupper(trim($data['kode_ruangan']));
        $data['nama_ruangan'] = trim($data['nama_ruangan']);

        return $data;
    }

    private function buildSchedule(Ruangan $ruangan): array
    {
        $grouped = $ruangan->kelas->groupBy('hari');

        return collect($this->days)->mapWithKeys(function ($day) use ($grouped) {
            return [
                $day => ($grouped->get($day) ?? collect())->map(function ($kelas) {
                    return [
                        'id_kelas' => $kelas->id_kelas,
                        'nama_kelas' => $kelas->nama_kelas,
                        'hari' => $kelas->hari,
                        'jam_mulai' => $kelas->jam_mulai?->format('H:i'),
                        'jam_selesai' => $kelas->jam_selesai?->format('H:i'),
                        'mata_kuliah' => $kelas->mataKuliahPeriode?->mataKuliah?->nama_matkul,
                        'kode_matkul' => $kelas->mataKuliahPeriode?->mataKuliah?->kode_matkul,
                        'dosen' => $kelas->dosen?->nama,
                    ];
                })->values(),
            ];
        })->all();
    }
}
