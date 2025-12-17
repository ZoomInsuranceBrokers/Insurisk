<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\InsuranceMaster;

class InsuranceMasterSeeder extends Seeder
{
    public function run()
    {
        $companies = [
            'Life Insurance Corporation of India (LIC)',
            'ICICI Lombard General Insurance Company Ltd',
            'HDFC ERGO General Insurance Co. Ltd',
            'SBI General Insurance Co. Ltd',
            'Bajaj Allianz General Insurance Co. Ltd',
            'TATA AIG General Insurance Company Ltd',
            'New India Assurance Co. Ltd',
            'Oriental Insurance Company Ltd',
            'National Insurance Company Ltd',
            'Kotak Mahindra General Insurance Co. Ltd',
            'Reliance General Insurance Co. Ltd',
            'Future Generali India Insurance Co. Ltd',
            'Cholamandalam MS General Insurance Co. Ltd',
            'Iffco-Tokio General Insurance Co. Ltd',
            'Royal Sundaram General Insurance Co. Ltd',
            'SBI Life Insurance Co. Ltd',
            'PNB MetLife India Insurance Co. Ltd',
            'Max Life Insurance Company Ltd',
            'Bharti AXA Life Insurance Co. Ltd',
            'IDBI Federal Life Insurance Co. Ltd'
        ];

        foreach ($companies as $name) {
            InsuranceMaster::firstOrCreate(['name' => $name], [
                'logo' => null,
                'address' => null,
                'is_active' => true,
                'is_delete' => false,
            ]);
        }
    }
}
