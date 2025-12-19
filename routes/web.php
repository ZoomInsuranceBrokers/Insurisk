<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PartnerController;
use App\Http\Controllers\InsuranceController;
use App\Http\Controllers\CdAccountController;
use App\Http\Controllers\MasterPolicyController;
use App\Http\Controllers\Api\CertificateApiController;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

// login route handled by auth.php (AuthenticatedSessionController)

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::prefix('api')
    ->middleware('api')
    ->withoutMiddleware([VerifyCsrfToken::class])
    ->group(function () {
        Route::post('/certificates/store', [CertificateApiController::class, 'store'])->name('api.certificates.store');
        Route::post('/certificates/status', [CertificateApiController::class, 'status'])->name('api.certificates.status');
        Route::post('/certificates/marine-declaration', [CertificateApiController::class, 'marineDeclarationSoap'])->name('api.marineDeclarationSoap');

    });

Route::middleware('auth')->group(function () {
    // Profile (if you have profile controller)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Partners
    Route::get('/partners', [PartnerController::class, 'index'])->name('partners.index');
    Route::get('/partners/create', [PartnerController::class, 'create'])->name('partners.create');
    Route::post('/partners', [PartnerController::class, 'store'])->name('partners.store');
    Route::get('/partners/{partner}/edit', [PartnerController::class, 'edit'])->name('partners.edit');
    Route::put('/partners/{partner}', [PartnerController::class, 'update'])->name('partners.update');
    Route::delete('/partners/{partner}', [PartnerController::class, 'destroy'])->name('partners.destroy');
    Route::post('/partners/{partner}/toggle', [PartnerController::class, 'toggle'])->name('partners.toggle');

    // Insurances
    Route::get('/insurances', [InsuranceController::class, 'index'])->name('insurances.index');
    Route::get('/insurances/create', [InsuranceController::class, 'create'])->name('insurances.create');
    Route::post('/insurances', [InsuranceController::class, 'store'])->name('insurances.store');
    Route::get('/insurances/{insurance}/edit', [InsuranceController::class, 'edit'])->name('insurances.edit');
    Route::put('/insurances/{insurance}', [InsuranceController::class, 'update'])->name('insurances.update');
    Route::delete('/insurances/{insurance}', [InsuranceController::class, 'destroy'])->name('insurances.destroy');
    Route::post('/insurances/{insurance}/toggle', [InsuranceController::class, 'toggle'])->name('insurances.toggle');
    
    // CD Accounts (cd_masters)
    Route::get('/cd-accounts', [CdAccountController::class, 'index'])->name('cd_accounts.index');
    Route::get('/cd-accounts/create', [CdAccountController::class, 'create'])->name('cd_accounts.create');
    Route::post('/cd-accounts', [CdAccountController::class, 'store'])->name('cd_accounts.store');
    Route::get('/cd-accounts/{cd_account}/edit', [CdAccountController::class, 'edit'])->name('cd_accounts.edit');
    Route::put('/cd-accounts/{cd_account}', [CdAccountController::class, 'update'])->name('cd_accounts.update');
    Route::delete('/cd-accounts/{cd_account}', [CdAccountController::class, 'destroy'])->name('cd_accounts.destroy');
    Route::post('/cd-accounts/{cd_account}/toggle', [CdAccountController::class, 'toggle'])->name('cd_accounts.toggle');
    Route::get('/cd-accounts/{cd_account}/transactions', [CdAccountController::class, 'transactions'])->name('cd_accounts.transactions');
    
    // Master Policies
    Route::get('/master-policies', [MasterPolicyController::class, 'index'])->name('master_policies.index');
    Route::get('/master-policies/create', [MasterPolicyController::class, 'create'])->name('master_policies.create');
    Route::post('/master-policies', [MasterPolicyController::class, 'store'])->name('master_policies.store');
    Route::get('/master-policies/{master_policy}/edit', [MasterPolicyController::class, 'edit'])->name('master_policies.edit');
    Route::put('/master-policies/{master_policy}', [MasterPolicyController::class, 'update'])->name('master_policies.update');
    Route::delete('/master-policies/{master_policy}', [MasterPolicyController::class, 'destroy'])->name('master_policies.destroy');
    Route::post('/master-policies/{master_policy}/toggle', [MasterPolicyController::class, 'toggle'])->name('master_policies.toggle');

    // Certificate Of Insurance
    Route::get('/certificate-of-insurance', [\App\Http\Controllers\CertificateOfInsuranceController::class, 'index'])->name('certificates.index');
    Route::get('/certificate-of-insurance/create', [\App\Http\Controllers\CertificateOfInsuranceController::class, 'create'])->name('certificates.create');
    Route::post('/certificate-of-insurance', [\App\Http\Controllers\CertificateOfInsuranceController::class, 'store'])->name('certificates.store');
    Route::get('/certificate-of-insurance/bulk-upload', [\App\Http\Controllers\CertificateOfInsuranceController::class, 'bulkUploadForm'])->name('certificates.bulk-upload');
    Route::post('/certificate-of-insurance/bulk-upload', [\App\Http\Controllers\CertificateOfInsuranceController::class, 'uploadCsv'])->name('certificates.upload-csv');
    Route::get('/certificate-of-insurance/sample-csv', [\App\Http\Controllers\CertificateOfInsuranceController::class, 'downloadSampleCsv'])->name('certificates.sample-csv');
    Route::get('/certificate-of-insurance/export', [\App\Http\Controllers\CertificateOfInsuranceController::class, 'exportAll'])->name('certificates.export');
    Route::get('/bulk-upload/{bulkUpload}/error-file', [\App\Http\Controllers\CertificateOfInsuranceController::class, 'downloadErrorFile'])->name('bulk-upload.error-file');
    Route::get('/bulk-upload/{bulkUpload}/success-file', [\App\Http\Controllers\CertificateOfInsuranceController::class, 'downloadSuccessFile'])->name('bulk-upload.success-file');
    Route::post('/certificate-of-insurance/{certificate}/cancel', [\App\Http\Controllers\CertificateOfInsuranceController::class, 'cancel'])->name('certificates.cancel');
    Route::get('/certificate-of-insurance/{certificate}/download', [\App\Http\Controllers\CertificateOfInsuranceController::class, 'downloadCertificate'])->name('certificates.download');
    Route::get('/certificate-of-insurance/{certificate}/view', [\App\Http\Controllers\CertificateOfInsuranceController::class, 'viewCertificate'])->name('certificates.view');
    Route::get('/certificate-of-insurance/{master_policy}', [\App\Http\Controllers\CertificateOfInsuranceController::class, 'show'])->name('certificates.show');
    Route::get('/certificate-of-insurance/{master_policy}/export', [\App\Http\Controllers\CertificateOfInsuranceController::class, 'exportPolicy'])->name('certificates.exportPolicy');
});

require __DIR__.'/auth.php';
