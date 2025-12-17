<?php

namespace App\Http\Controllers;

use App\Models\MasterPolicy;
use App\Models\CertificateOfInsurance;
use App\Models\BulkUpload;
use App\Models\CdTransaction;
use App\Models\CdMaster;
use App\Jobs\ProcessCertificateCsv;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class CertificateOfInsuranceController extends Controller
{
    /**
     * Show a listing of master policies with name and number.
     */
    public function index(Request $request)
    {
        $policies = MasterPolicy::query()
            ->select('id', 'policy_name', 'number')
            ->when($request->get('q'), function ($q, $term) {
                $q->where('policy_name', 'like', "%{$term}%")
                    ->orWhere('number', 'like', "%{$term}%");
            })
            ->orderBy('policy_name')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('CertificateOfInsurance/Index', [
            'policies' => $policies,
            'filters' => $request->only('q'),
        ]);
    }

    /**
     * Display certificates for a given master policy.
     */
    public function show(Request $request, MasterPolicy $master_policy)
    {
        $certs = $master_policy->certificates()
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('CertificateOfInsurance/Show', [
            'policy' => $master_policy,
            'certificates' => $certs,
            'filters' => $request->only('q'),
        ]);
    }

    /**
     * Show the form for creating a new certificate.
     */
    public function create()
    {
        $policies = MasterPolicy::select('id', 'policy_name', 'number')
            ->where('is_active', true)
            ->orderBy('policy_name')
            ->get();

        return Inertia::render('CertificateOfInsurance/Create', [
            'policies' => $policies,
        ]);
    }

    /**
     * Store a newly created certificate.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'master_policy_id' => 'required|exists:master_policies,id',
            'status' => 'nullable|string',
            'item_number' => 'nullable|string',
            'gr_lr_number' => 'nullable|string',
            'gr_lr_date' => 'nullable|date',
            'insured_commodity' => 'nullable|string',
            'cargo_value' => 'nullable|numeric',
            'insured_name' => 'required|string|max:255',
            'cc_mail' => 'nullable|email',
            'insured_address' => 'nullable|string',
            'insured_mobile' => 'nullable|string',
            'insured_email' => 'nullable|email',
            'voyage_from' => 'nullable|string',
            'voyage_to' => 'nullable|string',
            'invoice_number' => 'nullable|string',
            'invoice_date' => 'nullable|date',
            'declaration_id' => 'nullable|string',
            'description' => 'nullable|string',
            'master_policy_type' => 'nullable|string',
            'policy_source' => 'nullable|string',
            'vb_64' => 'nullable|string',
            'is_intracity' => 'nullable|boolean',
            'is_intercity' => 'nullable|boolean',
            'is_cancelled' => 'nullable|boolean',
            'cancellation_reason' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        return DB::transaction(function () use ($validated) {
            // Get master policy to calculate premiums
            $masterPolicy = MasterPolicy::findOrFail($validated['master_policy_id']);

            // Calculate premiums based on cargo value and policy rates
            $cargoValue = $validated['cargo_value'] ?? 0;
            $rate = 0;

            if (!empty($validated['is_intercity'])) {
                $rate = $masterPolicy->intercity_rate ?? 0;
            } elseif (!empty($validated['is_intracity'])) {
                $rate = $masterPolicy->intracity_rate ?? 0;
            }
            
            // $rate is a percent (e.g. 0.12 for 0.12%)
            $grossPremium = $cargoValue * ($rate / 100);

            $gstPremium = $grossPremium * 0.18; // 18% GST
            $totalPremium = $grossPremium + $gstPremium;

            // Add calculated premiums to validated data
            $validated['gross_premium'] = $grossPremium;
            $validated['gst_premium'] = $gstPremium;
            $validated['total_premium'] = $totalPremium;

            $certificate = CertificateOfInsurance::create($validated);

            // Create CD transaction (debit) and update balance if not cancelled
            if (empty($validated['is_cancelled']) && $masterPolicy->cd_account_id) {
                $cdAccount = CdMaster::find($masterPolicy->cd_account_id);

                if ($cdAccount) {
                    // Create debit transaction
                    CdTransaction::create([
                        'cd_id' => $cdAccount->id,
                        'credit_type' => 'debit',
                        'amount' => $totalPremium,
                        'status' => 'completed',
                    ]);

                    // Update CD account balance (debit reduces balance)
                    $cdAccount->decrement('current_balance', $totalPremium);
                }
            }

            return redirect()->route('certificates.index')->with('success', 'Certificate created successfully!');
        });
    }

    /**
     * Download sample CSV template.
     */
    public function downloadSampleCsv()
    {
        $headers = [
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
            'declaration_id',
            'description',
            'master_policy_type',
            'policy_source',
            'vb_64',
            'is_intracity',
            'is_intercity',
            'is_cancelled',
            'cancellation_reason',
            'is_active'
        ];

        $sampleData = [
            '1',
            'Active',
            'ITEM001',
            'GR001',
            '2025-12-17',
            'Electronics',
            '50000.00',
            'ABC Company',
            'cc@example.com',
            '123 Main St, City',
            '9876543210',
            'abc@example.com',
            'Mumbai',
            'Delhi',
            'INV001',
            '2025-12-17',
            'DEC001',
            'Sample description',
            'Type A',
            'Online',
            'VB64STRING',
            'false',
            'true',
            'false',
            '',
            'true'
        ];

        $callback = function () use ($headers, $sampleData) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $headers);
            fputcsv($file, $sampleData);
            fclose($file);
        };

        return response()->stream($callback, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="certificate_sample.csv"',
        ]);
    }

    /**
     * Show bulk upload form.
     */
    public function bulkUploadForm()
    {
        $recentUploads = BulkUpload::where('upload_type', 'certificate_of_insurance')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        return Inertia::render('CertificateOfInsurance/BulkUpload', [
            'recentUploads' => $recentUploads,
        ]);
    }

    /**
     * Handle CSV upload and queue processing.
     */
    public function uploadCsv(Request $request)
    {
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt|max:10240', // 10MB max
        ]);

        $file = $request->file('csv_file');
        $originalName = $file->getClientOriginalName();
        $path = $file->store('bulk_uploads');

        $bulkUpload = BulkUpload::create([
            'user_id' => auth()->id(),
            'upload_type' => 'certificate_of_insurance',
            'original_file_name' => $originalName,
            'original_file_path' => $path,
            'status' => 'pending',
        ]);

        // Dispatch job to process the CSV
        ProcessCertificateCsv::dispatch($bulkUpload);

        return redirect()->route('certificates.bulk-upload')
            ->with('success', 'File uploaded successfully! Processing in background.');
    }

    /**
     * Download error file.
     */
    public function downloadErrorFile(BulkUpload $bulkUpload)
    {
        if (!$bulkUpload->error_file_path || !Storage::exists($bulkUpload->error_file_path)) {
            return redirect()->back()->with('error', 'Error file not found.');
        }

        return Storage::download($bulkUpload->error_file_path, 'errors_' . $bulkUpload->id . '.csv');
    }

    /**
     * Download success file.
     */
    public function downloadSuccessFile(BulkUpload $bulkUpload)
    {
        if (!$bulkUpload->success_file_path || !Storage::exists($bulkUpload->success_file_path)) {
            return redirect()->back()->with('error', 'Success file not found.');
        }

        return Storage::download($bulkUpload->success_file_path, 'success_' . $bulkUpload->id . '.csv');
    }

    /**
     * Export certificates for a specific master policy as CSV (with filters).
     */
    public function exportPolicy(Request $request, MasterPolicy $master_policy)
    {
        $query = $master_policy->certificates()->newQuery();

        if ($q = $request->get('q')) {
            $query->where(function ($qbuilder) use ($q) {
                $qbuilder->where('insured_name', 'like', "%{$q}%")
                    ->orWhere('item_number', 'like', "%{$q}%")
                    ->orWhere('insured_email', 'like', "%{$q}%");
            });
        }

        if (!is_null($request->get('status'))) {
            $query->where('status', $request->get('status'));
        }

        if (!is_null($request->get('is_intracity'))) {
            $query->where('is_intracity', (bool)$request->get('is_intracity'));
        }

        if (!is_null($request->get('is_intercity'))) {
            $query->where('is_intercity', (bool)$request->get('is_intercity'));
        }

        if ($from = $request->get('date_from')) {
            $query->whereDate('created_at', '>=', $from);
        }
        if ($to = $request->get('date_to')) {
            $query->whereDate('created_at', '<=', $to);
        }

        $rows = $query->orderByDesc('created_at')->get();

        $headers = [
            'id',
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
            'created_at',
            'updated_at'
        ];

        $callback = function () use ($rows, $headers) {
            $out = fopen('php://output', 'w');
            fputcsv($out, $headers);
            foreach ($rows as $r) {
                fputcsv($out, [
                    $r->id,
                    $r->master_policy_id,
                    $r->status,
                    $r->item_number,
                    $r->gr_lr_number,
                    optional($r->gr_lr_date)->toDateString(),
                    $r->insured_commodity,
                    $r->cargo_value,
                    $r->insured_name,
                    $r->cc_mail,
                    $r->insured_address,
                    $r->insured_mobile,
                    $r->insured_email,
                    $r->voyage_from,
                    $r->voyage_to,
                    $r->invoice_number,
                    optional($r->invoice_date)->toDateString(),
                    $r->gross_premium,
                    $r->gst_premium,
                    $r->total_premium,
                    $r->declaration_id,
                    $r->description,
                    $r->master_policy_type,
                    $r->policy_source,
                    $r->vb_64,
                    $r->is_cancelled,
                    $r->cancellation_reason,
                    $r->is_active,
                    $r->is_intracity,
                    $r->is_intercity,
                    $r->cover_letter_no,
                    $r->cover_letter_link,
                    $r->is_cover_letter_sent,
                    $r->created_at,
                    $r->updated_at,
                ]);
            }
            fclose($out);
        };

        $fileName = 'certificates_policy_' . $master_policy->id . '_' . date('Ymd_His') . '.csv';
        return response()->stream($callback, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ]);
    }

    /**
     * Export all certificates (with filters) as CSV.
     */
    public function exportAll(Request $request)
    {
        $query = CertificateOfInsurance::query();

        if ($policyId = $request->get('master_policy_id')) {
            $query->where('master_policy_id', $policyId);
        }

        if ($q = $request->get('q')) {
            $query->where(function ($qbuilder) use ($q) {
                $qbuilder->where('insured_name', 'like', "%{$q}%")
                    ->orWhere('item_number', 'like', "%{$q}%")
                    ->orWhere('insured_email', 'like', "%{$q}%");
            });
        }

        if (!is_null($request->get('status'))) {
            $query->where('status', $request->get('status'));
        }

        if (!is_null($request->get('is_intracity'))) {
            $query->where('is_intracity', (bool)$request->get('is_intracity'));
        }

        if (!is_null($request->get('is_intercity'))) {
            $query->where('is_intercity', (bool)$request->get('is_intercity'));
        }

        if ($from = $request->get('date_from')) {
            $query->whereDate('created_at', '>=', $from);
        }
        if ($to = $request->get('date_to')) {
            $query->whereDate('created_at', '<=', $to);
        }

        $rows = $query->orderByDesc('created_at')->get();

        $headers = [
            'id',
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
            'created_at',
            'updated_at'
        ];

        $callback = function () use ($rows, $headers) {
            $out = fopen('php://output', 'w');
            fputcsv($out, $headers);
            foreach ($rows as $r) {
                fputcsv($out, [
                    $r->id,
                    $r->master_policy_id,
                    $r->status,
                    $r->item_number,
                    $r->gr_lr_number,
                    optional($r->gr_lr_date)->toDateString(),
                    $r->insured_commodity,
                    $r->cargo_value,
                    $r->insured_name,
                    $r->cc_mail,
                    $r->insured_address,
                    $r->insured_mobile,
                    $r->insured_email,
                    $r->voyage_from,
                    $r->voyage_to,
                    $r->invoice_number,
                    optional($r->invoice_date)->toDateString(),
                    $r->gross_premium,
                    $r->gst_premium,
                    $r->total_premium,
                    $r->declaration_id,
                    $r->description,
                    $r->master_policy_type,
                    $r->policy_source,
                    $r->vb_64,
                    $r->is_cancelled,
                    $r->cancellation_reason,
                    $r->is_active,
                    $r->is_intracity,
                    $r->is_intercity,
                    $r->cover_letter_no,
                    $r->cover_letter_link,
                    $r->is_cover_letter_sent,
                    $r->created_at,
                    $r->updated_at,
                ]);
            }
            fclose($out);
        };

        $fileName = 'certificates_all_' . date('Ymd_His') . '.csv';
        return response()->stream($callback, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ]);
    }

    /**
     * Cancel a certificate and create credit transaction.
     */
    public function cancel(Request $request, CertificateOfInsurance $certificate)
    {
        $validated = $request->validate([
            'cancellation_reason' => 'required|string',
        ]);

        return DB::transaction(function () use ($certificate, $validated) {
            // Get master policy
            $masterPolicy = $certificate->masterPolicy;

            // Update certificate
            $certificate->update([
                'is_cancelled' => true,
                'cancellation_reason' => $validated['cancellation_reason'],
                'is_active' => false,
            ]);

            // Create CD transaction (credit) to refund the premium
            if ($masterPolicy && $masterPolicy->cd_account_id) {
                $cdAccount = CdMaster::find($masterPolicy->cd_account_id);

                if ($cdAccount) {
                    // Create credit transaction
                    CdTransaction::create([
                        'cd_id' => $cdAccount->id,
                        'credit_type' => 'credit',
                        'amount' => $certificate->total_premium,
                        'status' => 'completed',
                    ]);

                    // Update CD account balance (credit increases balance)
                    $cdAccount->increment('current_balance', $certificate->total_premium);
                }
            }

            return back()->with('success', 'Certificate cancelled successfully!');
        });
    }

    /**
     * Download certificate as PDF.
     */
    public function downloadCertificate(CertificateOfInsurance $certificate)
    {
        $policy = $certificate->masterPolicy;
        
        $pdf = Pdf::loadView('certificates.cover-letter', [
            'certificate' => $certificate,
            'policy' => $policy,
        ]);
        
        $pdf->setPaper('A4', 'portrait');
        
        $fileName = 'certificate_' . $certificate->cover_letter_no . '.pdf';
        
        return $pdf->download($fileName);
    }

    /**
     * View certificate PDF in browser.
     */
    public function viewCertificate(CertificateOfInsurance $certificate)
    {
        $policy = $certificate->masterPolicy;
        
        $pdf = Pdf::loadView('certificates.cover-letter', [
            'certificate' => $certificate,
            'policy' => $policy,
        ]);
        
        $pdf->setPaper('A4', 'portrait');
        
        return $pdf->stream('certificate_' . $certificate->cover_letter_no . '.pdf');
    }
}
