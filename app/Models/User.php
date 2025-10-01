<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'role',
        'username',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // ========================================
    // RELATIONSHIPS
    // ========================================

    public function mahasiswa()
    {
        return $this->hasOne(Mahasiswa::class, 'user_id');
    }

    public function dosen()
    {
        return $this->hasOne(Dosen::class, 'user_id');
    }

    public function baak()
    {
        return $this->hasOne(Baak::class, 'user_id');
    }

    // ========================================
    // HELPER METHODS
    // ========================================

    public function getDetailData()
    {
        return match($this->role) {
            'mahasiswa' => $this->mahasiswa,
            'dosen' => $this->dosen,
            'baak' => $this->baak,
            default => null,
        };
    }

    public function getNameAttribute()
    {
        return $this->getDetailData()?->nama;
    }

    public function isMahasiswa()
    {
        return $this->role === 'mahasiswa';
    }

    public function isDosen()
    {
        return $this->role === 'dosen';
    }

    public function isBaak()
    {
        return $this->role === 'baak';
    }
}
