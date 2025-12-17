<?php

namespace App\Jobs;

use App\Models\BulkUpload;
use App\Models\CertificateOfInsurance;
use App\Models\MasterPolicy;
use App\Models\CdMaster;
use App\Models\CdTransaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ProcessCertificateCsv implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $bulkUpload;

    /**
     * Create a new job instance.
     */
    public function __construct(BulkUpload $bulkUpload)
    {
        $this->bulkUpload = $bulkUpload;
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        try {
            $this->bulkUpload->update(['status' => 'processing']);

            $filePath = storage_path('app/' . $this->bulkUpload->original_file_path);
            
            if (!file_exists($filePath)) {
                throw new \Exception('File not found');
            }

            $file = fopen($filePath, 'r');
            $header = fgetcsv($file);
            
            $successData = [$header];
            $errorData = [array_merge($header, ['Error Reason'])];
            
            $rowNumber = 1;
            $successCount = 0;
            $errorCount = 0;

            while (($row = fgetcsv($file)) !== false) {
                $rowNumber++;
                
                // Map CSV columns to database fields
                $data = [
                    'master_policy_id' => $row[0] ?? null,
                    'status' => $row[1] ?? null,
                    'item_number' => $row[2] ?? null,
                    'gr_lr_number' => $row[3] ?? null,
                    'gr_lr_date' => $row[4] ?? null,
                    'insured_commodity' => $row[5] ?? null,
                    'cargo_value' => $row[6] ?? null,
                    'insured_name' => $row[7] ?? null,
                    'cc_mail' => $row[8] ?? null,
                    'insured_address' => $row[9] ?? null,
                    'insured_mobile' => $row[10] ?? null,
                    'insured_email' => $row[11] ?? null,
                    'voyage_from' => $row[12] ?? null,
                    'voyage_to' => $row[13] ?? null,
                    'invoice_number' => $row[14] ?? null,
                    'invoice_date' => $row[15] ?? null,
                    'declaration_id' => $row[16] ?? null,
                    'description' => $row[17] ?? null,
                    'master_policy_type' => $row[18] ?? null,
                    'policy_source' => $row[19] ?? null,
                    'vb_64' => $row[20] ?? null,
                    'is_intracity' => filter_var($row[21] ?? false, FILTER_VALIDATE_BOOLEAN),
                    'is_intercity' => filter_var($row[22] ?? false, FILTER_VALIDATE_BOOLEAN),
                    'is_cancelled' => filter_var($row[23] ?? false, FILTER_VALIDATE_BOOLEAN),
                    'cancellation_reason' => $row[24] ?? null,
                    'is_active' => filter_var($row[25] ?? true, FILTER_VALIDATE_BOOLEAN),
                ];

                // Validate the row
                $validator = Validator::make($data, [
                    'master_policy_id' => 'required|exists:master_policies,id',
                    'insured_name' => 'required|string|max:255',
                    'insured_email' => 'nullable|email',
                    'cargo_value' => 'nullable|numeric',
                ]);

                if ($validator->fails()) {
                    $errorData[] = array_merge($row, [implode(', ', $validator->errors()->all())]);
                    $errorCount++;
                } else {
                    try {
                        DB::transaction(function () use ($data) {
                            // Get master policy to calculate premiums
                            $masterPolicy = MasterPolicy::findOrFail($data['master_policy_id']);
                            
                            // Calculate premiums
                            $cargoValue = $data['cargo_value'] ?? 0;
                            $rate = 0;
                            
                            if (!empty($data['is_intercity'])) {
                                $rate = $masterPolicy->intercity_rate ?? 0;
                            } elseif (!empty($data['is_intracity'])) {
                                $rate = $masterPolicy->intracity_rate ?? 0;
                            }
                            
                            $grossPremium = $cargoValue * $rate / 100;
                            $gstPremium = $grossPremium * 0.18;
                            $totalPremium = $grossPremium + $gstPremium;
                            
                            $data['gross_premium'] = $grossPremium;
                            $data['gst_premium'] = $gstPremium;
                            $data['total_premium'] = $totalPremium;

                            $certificate = CertificateOfInsurance::create($data);

                            // Create CD transaction if not cancelled
                            if (empty($data['is_cancelled']) && $masterPolicy->cd_account_id) {
                                $cdAccount = CdMaster::find($masterPolicy->cd_account_id);
                                
                                if ($cdAccount) {
                                    CdTransaction::create([
                                        'cd_id' => $cdAccount->id,
                                        'credit_type' => 'debit',
                                        'amount' => $totalPremium,
                                        'status' => 'completed',
                                    ]);
                                    
                                    $cdAccount->decrement('current_balance', $totalPremium);
                                }
                            }
                        });
                                                $successData[] = $row;
                        $successCount++;
                    } catch (\Exception $e) {
                        $errorData[] = array_merge($row, [$e->getMessage()]);
                        $errorCount++;
                    }
                }
            }

            fclose($file);

            // Save success file if there are successful records
            if ($successCount > 0) {
                $successFilePath = 'bulk_uploads/success_' . time() . '_' . $this->bulkUpload->id . '.csv';
                $this->writeCsvFile($successFilePath, $successData);
                $this->bulkUpload->success_file_path = $successFilePath;
            }

            // Save error file if there are errors
            if ($errorCount > 0) {
                $errorFilePath = 'bulk_uploads/error_' . time() . '_' . $this->bulkUpload->id . '.csv';
                $this->writeCsvFile($errorFilePath, $errorData);
                $this->bulkUpload->error_file_path = $errorFilePath;
            }

            $this->bulkUpload->update([
                'total_rows' => $rowNumber - 1,
                'success_count' => $successCount,
                'error_count' => $errorCount,
                'status' => 'completed',
            ]);

        } catch (\Exception $e) {
            $this->bulkUpload->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Write CSV file to storage
     */
    protected function writeCsvFile($path, $data)
    {
        $fullPath = storage_path('app/' . $path);
        $directory = dirname($fullPath);
        
        if (!file_exists($directory)) {
            mkdir($directory, 0755, true);
        }

        $file = fopen($fullPath, 'w');
        foreach ($data as $row) {
            fputcsv($file, $row);
        }
        fclose($file);
    }
}
