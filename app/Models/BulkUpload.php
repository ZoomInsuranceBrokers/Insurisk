<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BulkUpload extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'upload_type',
        'original_file_name',
        'original_file_path',
        'error_file_path',
        'success_file_path',
        'total_rows',
        'success_count',
        'error_count',
        'status',
        'error_message',
    ];

    protected $casts = [
        'total_rows' => 'integer',
        'success_count' => 'integer',
        'error_count' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
