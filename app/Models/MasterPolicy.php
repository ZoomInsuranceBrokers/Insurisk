<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MasterPolicy extends Model
{
    protected $table = 'master_policies';

    protected $fillable = [
        'partner_id',
        'policy_name',
        'number',
        'start_date',
        'end_date',
        'policy_type',
        'policy_sub_type',
        'term_and_condition',
        'intercity_rate',
        'intracity_rate',
        'cd_account_id',
        'is_active',
        'is_delete',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'intercity_rate' => 'decimal:4',
        'intracity_rate' => 'decimal:4',
        'is_active' => 'boolean',
        'is_delete' => 'boolean',
    ];

    public function partner(): BelongsTo
    {
        return $this->belongsTo(Partner::class);
    }

    public function cdAccount(): BelongsTo
    {
        return $this->belongsTo(CdMaster::class, 'cd_account_id');
    }

    public function certificates()
    {
        return $this->hasMany(\App\Models\CertificateOfInsurance::class, 'master_policy_id');
    }
}
