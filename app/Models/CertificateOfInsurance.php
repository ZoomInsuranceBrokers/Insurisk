<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CertificateOfInsurance extends Model
{
    use HasFactory;

    protected $fillable = [
        'master_policy_id',
        'status',
        'item_number',
        'gr_lr_number',
        'gr_lr_date',
        'insured_commodity',
        'cargo_value',
        'insured_name',
        'cc_mail',
        'insured_address',
        'insured_mobile',
        'insured_email',
        'voyage_from',
        'voyage_to',
        'invoice_number',
        'invoice_date',
        'gross_premium',
        'gst_premium',
        'total_premium',
        'declaration_id',
        'description',
        'master_policy_type',
        'policy_source',
        'vb_64',
        'is_cancelled',
        'cancellation_reason',
        'is_active',
        'is_intracity',
        'is_intercity',
        'cover_letter_no',
        'cover_letter_link',
        'is_cover_letter_sent',
    ];

    protected $casts = [
        'gr_lr_date' => 'date',
        'invoice_date' => 'date',
        'cargo_value' => 'decimal:2',
        'gross_premium' => 'decimal:2',
        'gst_premium' => 'decimal:2',
        'total_premium' => 'decimal:2',
        'is_cancelled' => 'boolean',
        'is_active' => 'boolean',
        'is_intracity' => 'boolean',
        'is_intercity' => 'boolean',
        'is_cover_letter_sent' => 'boolean',
    ];

    public function masterPolicy()
    {
        return $this->belongsTo(MasterPolicy::class, 'master_policy_id');
    }

    protected static function booted()
    {
        static::created(function ($certificate) {
            if (empty($certificate->cover_letter_no)) {
                $certificate->cover_letter_no = 'SSZOOM' . str_pad($certificate->id, 11, '0', STR_PAD_LEFT);
                $certificate->saveQuietly();
            }
        });
    }
}
