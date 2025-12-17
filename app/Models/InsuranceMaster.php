<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InsuranceMaster extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'insurance_masters';

    protected $fillable = [
        'name', 'logo', 'address', 'is_active', 'is_delete'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_delete' => 'boolean',
    ];
}
