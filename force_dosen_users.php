<?php
use App\Models\Dosen;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

$dosens = Dosen::all();
$countCreated = 0;
$countUpdated = 0;

foreach ($dosens as $dosen) {
    if (empty($dosen->nip) || empty($dosen->nama)) continue;

    $user = null;
    if ($dosen->user_id) {
        $user = User::find($dosen->user_id);
    }
    
    if (!$user) {
        $user = User::where('username', $dosen->nip)->first();
    }

    $emailUsername = strtolower(str_replace(' ', '', $dosen->nama));
    $email = preg_replace('/[^a-z0-9]/', '', $emailUsername) . '@itbriau.ac.id';

    if (!$user) {
        $counter = 1;
        $originalEmail = $email;
        while (User::where('email', $email)->exists()) {
            $email = str_replace('@itbriau.ac.id', $counter . '@itbriau.ac.id', $originalEmail);
            $counter++;
        }

        $user = User::create([
            'role' => 'dosen',
            'username' => $dosen->nip,
            'email' => $email,
            'password' => Hash::make($dosen->nip),
        ]);
        $countCreated++;
    } else {
        // Force update password to NIP to be safe, and ensure role is dosen
        $user->password = Hash::make($dosen->nip);
        $user->role = 'dosen';
        $user->username = $dosen->nip;
        $user->save();
        $countUpdated++;
    }

    if ($dosen->user_id !== $user->id) {
        $dosen->update(['user_id' => $user->id]);
    }
}
echo "Selesai! Dibuat: $countCreated, Diperbarui Password: $countUpdated\n";
