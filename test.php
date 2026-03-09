<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Assuming user ID 2 is a Mahasiswa. Let's find one dynamically.
$user = \App\Models\User::where('role', 'mahasiswa')->first();
if ($user) {
    \Auth::login($user);
    try {
        app('App\Http\Controllers\MahasiswaController')->penjadwalan();
        echo "SUCCESS\n";
    } catch (\Throwable $e) {
        echo "========= ERROR =========\n";
        echo $e->getMessage() . "\n";
        echo $e->getFile() . ':' . $e->getLine() . "\n";
    }
} else {
    echo "No Mahasiswa user found.\n";
}
