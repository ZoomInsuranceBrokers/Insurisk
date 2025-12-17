<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CdTransaction extends Model
{
    protected $table = 'cd_transactions';

    protected $fillable = [
        'cd_id',
        'transaction_id',
        'credit_type',
        'amount',
        'status',
        'timestamp',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'timestamp' => 'datetime',
    ];

    protected static function booted()
    {
        static::created(function ($model) {
            if (empty($model->transaction_id)) {
                $model->transaction_id = 'CDZOOM' . str_pad($model->id, 6, '0', STR_PAD_LEFT);
                // use saveQuietly to avoid firing events again
                $model->saveQuietly();
            }
        });
    }

    public function cdAccount(): BelongsTo
    {
        return $this->belongsTo(CdMaster::class, 'cd_id');
    }
}
