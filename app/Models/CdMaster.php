<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CdMaster extends Model
{
    protected $table = 'cd_masters';

    protected $fillable = [
        'ins_id',
        'partner_id',
        'account_name',
        'account_number',
        'min_balance',
        'opening_balance',
        'current_balance',
        'is_active',
    ];

    protected $casts = [
        'min_balance' => 'decimal:2',
        'opening_balance' => 'decimal:2',
        'current_balance' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function insurance(): BelongsTo
    {
        return $this->belongsTo(InsuranceMaster::class, 'ins_id');
    }

    public function partner(): BelongsTo
    {
        return $this->belongsTo(Partner::class);
    }

    public function policies(): HasMany
    {
        return $this->hasMany(MasterPolicy::class, 'cd_account_id');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(CdTransaction::class, 'cd_id');
    }
}
