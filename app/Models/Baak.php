<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Baak extends Model
{
    use HasFactory;

    protected $table = 'baak';
    protected $primaryKey = 'id_baak';

    protected $fillable = [
        'user_id',
        'nama',
        'nip',
        'no_hp',
    ];

    // ========================================
    // RELATIONSHIPS
    // ========================================

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
