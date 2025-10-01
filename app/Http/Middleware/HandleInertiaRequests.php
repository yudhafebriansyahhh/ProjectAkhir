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
                        break;
                    case 'mahasiswa':
                        $mahasiswa = \App\Models\Mahasiswa::where('user_id', $user->id)->first();
                        $userName = $mahasiswa?->nama ?? 'Mahasiswa';
                        break;
                    default:
                        $userName = $user->username ?? $user->email;
                }
            } catch (\Exception $e) {
                \Log::error('Error loading user name: ' . $e->getMessage());
                $userName = $user->username ?? $user->email;
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $userName,
                    'email' => $user->email,
                    'role' => $user->role,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'info' => fn () => $request->session()->get('info'),
            ],
        ];
    }
}
