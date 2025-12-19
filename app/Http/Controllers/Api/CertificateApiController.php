<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CertificateOfInsurance;
use App\Models\MasterPolicy;
use App\Models\CdMaster;
use App\Models\CdTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class CertificateApiController extends Controller
{
    /**
     * Store certificate(s) via API
     * Can handle single or bulk data
     */
    public function store(Request $request)
    {
        try {
            // Check if data is array of certificates or single certificate
            $certificates = $request->input('certificates', []);
            
             Log::channel('certificate_api')->info('Incoming Certificate API Request', [
                'date' => now()->toDateTimeString(),
                'ip' => $request->ip(),
                'headers' => $request->headers->all(),
                'payload' => $request->all(),
            ]);
            // If no 'certificates' key, treat entire request as single certificate
            if (empty($certificates)) {
                $certificates = [$request->all()];
            }

            // Process certificates synchronously to avoid timeout
            $results = $this->processCertificates($certificates);

            return response()->json([
                'success' => true,
                'message' => 'Certificates processed successfully',
                'data' => $results
            ], 201);

        } catch (\Exception $e) {
            Log::error('Certificate API Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error processing certificates',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Process certificates in batches to avoid timeout
     */
    private function processCertificates(array $certificates)
    {
        $results = [
            'success' => [],
            'failed' => [],
            'total' => count($certificates),
        ];

        foreach ($certificates as $index => $certificateData) {
            try {
                // Process each certificate in a database transaction
                $result = $this->processSingleCertificate($certificateData, $index);
                $results['success'][] = $result;
            } catch (\Exception $e) {
                $results['failed'][] = [
                    'index' => $index,
                    'data' => $certificateData,
                    'error' => $e->getMessage()
                ];
            }
        }

        $results['success_count'] = count($results['success']);
        $results['failed_count'] = count($results['failed']);

        return $results;
    }

    /**
     * Process a single certificate with CD transaction
     */
    private function processSingleCertificate(array $data, int $index)
    {
        return DB::transaction(function () use ($data, $index) {
            // Validate required fields
            $validator = Validator::make($data, [
                'master_policy_number' => 'required|string',
                'insured_name' => 'required|string',
                'cargo_value' => 'required|numeric|min:0',
                'gross_premium' => 'required|numeric|min:0',
                'gst_premium' => 'required|numeric|min:0',
                'total_premium' => 'required|numeric|min:0',
                'insured_email' => 'nullable|email',
                'insured_mobile' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                throw new \Exception('Validation failed: ' . implode(', ', $validator->errors()->all()));
            }

            // Find master policy by number
            $masterPolicy = MasterPolicy::where('number', $data['master_policy_number'])->first();
            
            if (!$masterPolicy) {
                throw new \Exception("Master policy not found: {$data['master_policy_number']}");
            }

            // Derive intracity / intercity from insured_commodity text
            $commodityText = strtolower($data['insured_commodity'] ?? '');
            $isIntracity = str_contains($commodityText, 'intracity') || str_contains($commodityText, 'intra city');
            $isIntercity = str_contains($commodityText, 'intercity') || str_contains($commodityText, 'inter city');

            // Fallback: if nothing detected, treat as intercity
            if (! $isIntracity && ! $isIntercity) {
                $isIntercity = true;
            }

            // Use premiums provided by API client (no internal calculation)
            $cargoValue = (float) $data['cargo_value'];
            $grossPremium = (float) $data['gross_premium'];
            $gstPremium = (float) $data['gst_premium'];
            $totalPremium = (float) $data['total_premium'];

            // Prepare certificate data
            $certificateData = [
                'master_policy_id' => $masterPolicy->id,
                'status' => $data['status'] ?? 'Active',
                'item_number' => $data['item_number'] ?? null,
                'gr_lr_number' => $data['gr_lr_number'] ?? null,
                'gr_lr_date' => $data['gr_lr_date'] ?? null,
                'insured_commodity' => $data['insured_commodity'] ?? null,
                'cargo_value' => $cargoValue,
                'insured_name' => $data['insured_name'],
                'cc_mail' => $data['cc_mail'] ?? null,
                'insured_address' => $data['insured_address'] ?? null,
                'insured_mobile' => $data['insured_mobile'] ?? null,
                'insured_email' => $data['insured_email'] ?? null,
                'voyage_from' => $data['voyage_from'] ?? null,
                'voyage_to' => $data['voyage_to'] ?? null,
                'invoice_number' => $data['invoice_number'] ?? null,
                'invoice_date' => $data['invoice_date'] ?? null,
                'gross_premium' => round($grossPremium, 2),
                'gst_premium' => round($gstPremium, 2),
                'total_premium' => round($totalPremium, 2),
                'declaration_id' => $data['declaration_id'] ?? null,
                'description' => $data['description'] ?? null,
                'master_policy_type' => $data['master_policy_type'] ?? null,
                'policy_source' => $data['policy_source'] ?? null,
                'vb_64' => $data['vb_64'] ?? null,
                'is_cancelled' => $data['is_cancelled'] ?? false,
                'cancellation_reason' => $data['cancellation_reason'] ?? null,
                'is_active' => !($data['is_cancelled'] ?? false),
                'is_intracity' => $isIntracity,
                'is_intercity' => $isIntercity,
            ];

            // Create certificate
            $certificate = CertificateOfInsurance::create($certificateData);

            // Generate cover letter number
            $certificate->cover_letter_no = 'SSZOOM' . str_pad($certificate->id, 11, '0', STR_PAD_LEFT);
            $certificate->save();

            // Create CD transaction if not cancelled
            if (!$certificate->is_cancelled) {
                // Get or create CD Master account for this policy
                $cdMaster = $this->getOrCreateCdMaster($masterPolicy);

                // Create debit transaction
                $cdTransaction = CdTransaction::create([
                    'cd_id' => $cdMaster->id,
                    'certificate_id' => $certificate->id,
                    'credit_type' => 'debit',
                    'amount' => $totalPremium,
                    'status' => 'completed',
                    'description' => "Certificate: {$certificate->cover_letter_no}",
                ]);

                // Update CD Master current balance (debit decreases balance)
                $cdMaster->decrement('current_balance', $totalPremium);
                $cdMaster->refresh();

                return [
                    'index' => $index,
                    'certificate_id' => $certificate->id,
                    'cover_letter_no' => $certificate->cover_letter_no,
                    'cd_transaction_id' => $cdTransaction->transaction_id,
                    'cd_balance' => $cdMaster->current_balance,
                    'premium_charged' => $totalPremium,
                ];
            }

            return [
                'index' => $index,
                'certificate_id' => $certificate->id,
                'cover_letter_no' => $certificate->cover_letter_no,
                'premium_charged' => 0,
                'note' => 'Cancelled - No CD transaction created',
            ];
        });
    }

    /**
     * Get or create CD Master account for master policy
     */
    private function getOrCreateCdMaster(MasterPolicy $masterPolicy)
    {
        // Try to get existing CD account for this policy's partner
        $cdMaster = CdMaster::where('partner_id', $masterPolicy->partner_id)
            ->where('is_active', true)
            ->first();

        if (!$cdMaster) {
            // Create new CD Master account
            $cdMaster = CdMaster::create([
                'ins_id' => $masterPolicy->ins_id,
                'partner_id' => $masterPolicy->partner_id,
                'account_name' => "CD Account - {$masterPolicy->partner->name}",
                'account_number' => 'CD' . time() . rand(1000, 9999),
                'min_balance' => 0,
                'opening_balance' => 1000000, // Default 10 lakh opening balance
                'current_balance' => 1000000,
                'is_active' => true,
            ]);
        }

        return $cdMaster;
    }

    /**
     * Get certificate status
     */
    public function status(Request $request)
    {
        $coverLetterNo = $request->input('cover_letter_no');
        
        if (!$coverLetterNo) {
            return response()->json([
                'success' => false,
                'message' => 'cover_letter_no is required'
            ], 400);
        }

        $certificate = CertificateOfInsurance::where('cover_letter_no', $coverLetterNo)
            ->with('masterPolicy')
            ->first();

        if (!$certificate) {
            return response()->json([
                'success' => false,
                'message' => 'Certificate not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'cover_letter_no' => $certificate->cover_letter_no,
                'status' => $certificate->status,
                'is_active' => $certificate->is_active,
                'is_cancelled' => $certificate->is_cancelled,
                'insured_name' => $certificate->insured_name,
                'cargo_value' => $certificate->cargo_value,
                'total_premium' => $certificate->total_premium,
                'master_policy_number' => $certificate->masterPolicy->number,
            ]
        ]);
    }

  public function marineDeclarationSoap()
{
    try {

        $soapUrl = 'http://125.22.81.132/eai_ws_enu/start.swe?SWEExtSource=SecureWebService&SWEExtCmd=Execute';

        $soapXml = <<<XML
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:cus="http://siebel.com/CustomUI"
                  xmlns:ins="http://www.siebel.com/xml/INSDeclarationsWebServiceRequestIO"
                  xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/07/secext">
   <soapenv:Header>
      <wsse:Security>
         <wsse:UsernameToken>
            <wsse:Username>TESTING</wsse:Username>
            <wsse:Password Type="wsse:PasswordText">itgi#111</wsse:Password>
         </wsse:UsernameToken>
      </wsse:Security>
   </soapenv:Header>

   <soapenv:Body>
      <cus:RegisterMarineDeclaration_New_Input>
         <ins:INSDeclarationsWebServiceRequestIO>
            <DeclarationDetails>
               <MasterPolicyClient>NoBroker-HFP</MasterPolicyClient>
               <InsuredAddress>The Leaf, Pune</InsuredAddress>
               <InsuredName>SUMIT SAURAV</InsuredName>
               <InsuredEmail>sumit.saurav@iffcotokio.co.in</InsuredEmail>
               <InsuredMobile>9910739234</InsuredMobile>
               <InsuredNominee>SUMIT</InsuredNominee>
               <InsuredProductCode>Used Household Goods IntraCity</InsuredProductCode>
               <InvoiceDate>06/18/2022</InvoiceDate>
               <SumInsured>75000</SumInsured>
               <MarineVoyageFrom>PUNE</MarineVoyageFrom>
               <MarineVoyageTo>PUNE</MarineVoyageTo>
               <MarineGRLRNumber>16316955589168188</MarineGRLRNumber>
               <MarineGRLRDate>06/19/2022</MarineGRLRDate>
            </DeclarationDetails>
         </ins:INSDeclarationsWebServiceRequestIO>
      </cus:RegisterMarineDeclaration_New_Input>
   </soapenv:Body>
</soapenv:Envelope>
XML;

        Log::channel('certificate_soap')->info('SOAP REQUEST', [
            'xml' => $soapXml
        ]);

        $ch = curl_init($soapUrl);

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $soapXml,
            CURLOPT_HTTPHEADER => [
                'Content-Type: text/xml; charset=utf-8',
                'SOAPAction: RegisterMarineDeclaration_New',
                'Content-Length: ' . strlen($soapXml),
            ],
            CURLOPT_TIMEOUT => 60,
        ]);

        $response = curl_exec($ch);

        if (curl_errno($ch)) {
            throw new \Exception(curl_error($ch));
        }

        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        Log::channel('certificate_soap')->info('SOAP RESPONSE', [
            'http_code' => $httpCode,
            'xml' => $response
        ]);

        return response()->json([
            'success' => true,
            'http_code' => $httpCode,
            'soap_response' => $response
        ]);

    } catch (\Exception $e) {

        Log::channel('certificate_soap')->error('SOAP ERROR', [
            'error' => $e->getMessage()
        ]);

        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
}

}
