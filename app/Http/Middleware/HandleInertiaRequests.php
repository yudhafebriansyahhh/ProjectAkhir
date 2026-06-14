<?php
// app/Http/Middleware/HandleInertiaRequests.php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $userName = null;
        $userFoto = null;

        // Load nama user berdasarkan role dengan error handling
        if ($user) {
            try {
                switch ($user->role) {
                    case 'baak':
                        $baak = \App\Models\Baak::where('user_id', $user->id)->first();
                        $userName = $baak?->nama ?? 'Admin BAAK';
                        break;
                    case 'dosen':
                        $dosen = \App\Models\Dosen::where('user_id', $user->id)->first();
                        $userName = $dosen?->nama ?? 'Dosen';
                        $userFoto = $dosen?->foto;
                        break;
                    case 'mahasiswa':
                        $mahasiswa = \App\Models\Mahasiswa::where('user_id', $user->id)->first();
                        $userName = $mahasiswa?->nama ?? 'Mahasiswa';
                        $userFoto = $mahasiswa?->foto;
                        break;
                    default:
                        $userName = $user->username ?? $user->email;
                }
            } catch (\Exception $e) {
                \Log::error('Error loading user name: ' . $e->getMessage());
                $userName = $user->username ?? $user->email;
            }
        }

        $pengajuanCounts = null;
        $krsPendingCount = null;

        if ($user) {
            if ($user->role === 'baak') {
                $pengajuanCounts = [
                    'cetak_krs' => \App\Models\PengajuanLayanan::where('jenis_layanan', 'cetak_krs')->where('status', 'pending')->count(),
                    'cetak_khs' => \App\Models\PengajuanLayanan::where('jenis_layanan', 'cetak_khs')->where('status', 'pending')->count(),
                    'transkrip' => \App\Models\PengajuanLayanan::where('jenis_layanan', 'transkrip')->where('status', 'pending')->count(),
                ];
            } elseif ($user->role === 'dosen') {
                $dosen = \App\Models\Dosen::where('user_id', $user->id)->first();
                if ($dosen) {
                    $krsPendingCount = \App\Models\Krs::where('status', 'pending')
                        ->whereHas('mahasiswa', function ($query) use ($dosen) {
                            $query->where('id_dosen_wali', $dosen->id_dosen);
                        })
                        ->count();
                }
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $userName,
                    'email' => $user->email,
                    'username' => $user->username,
                    'role' => $user->role,
                    'foto' => $userFoto,
                ] : null,
            ],
            'pengajuanCounts' => $pengajuanCounts,
            'krsPendingCount' => $krsPendingCount,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'info' => fn () => $request->session()->get('info'),
            ],
        ];
    }
}
