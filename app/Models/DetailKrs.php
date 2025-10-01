<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailKrs extends Model
{
    use HasFactory;

    protected $table = 'detail_krs';
    protected $primaryKey = 'id_detail_krs';

    protected $fillable = [
        'id_krs',
        'id_kelas',
    ];

    // ========================================
    // RELATIONSHIPS
    // ========================================

    public function krs()
    {
        return $this->belongsTo(Krs::class, 'id_krs', 'id_krs');
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'id_kelas', 'id_kelas');
    }
}
