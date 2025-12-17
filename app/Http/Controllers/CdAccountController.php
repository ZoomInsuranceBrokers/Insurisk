<?php

namespace App\Http\Controllers;

use App\Models\CdMaster;
use App\Models\InsuranceMaster;
use App\Models\Partner;
use App\Models\CdTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CdAccountController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->input('q');
        $query = CdMaster::with(['insurance', 'partner']);

        if ($q) {
            $query->where(function ($sub) use ($q) {
                $sub->where('account_name', 'like', "%{$q}%")
                    ->orWhere('account_number', 'like', "%{$q}%");
            });
        }

        $items = $query->orderBy('created_at', 'desc')->paginate(15)->withQueryString();

        return Inertia::render('CdAccounts/Index', [
            'cdAccounts' => $items,
            'filters' => ['q' => $q],
        ]);
    }

    public function create()
    {
        $insurers = InsuranceMaster::orderBy('name')->get();
        $partners = Partner::orderBy('name')->get();
        return Inertia::render('CdAccounts/Create', ['insurers' => $insurers, 'partners' => $partners]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'ins_id' => 'nullable|exists:insurance_masters,id',
            'partner_id' => 'nullable|exists:partners,id',
            'account_name' => 'required|string|max:255',
            'account_number' => 'nullable|string|max:255',
            'min_balance' => 'nullable|numeric',
            'opening_balance' => 'nullable|numeric',
            'current_balance' => 'nullable|numeric',
            'is_active' => 'sometimes|boolean',
        ]);

        CdMaster::create($data);
        return redirect()->route('cd_accounts.index');
    }

    public function edit(CdMaster $cd_account)
    {
        $insurers = InsuranceMaster::orderBy('name')->get();
        $partners = Partner::orderBy('name')->get();
        return Inertia::render('CdAccounts/Edit', ['cdAccount' => $cd_account, 'insurers' => $insurers, 'partners' => $partners]);
    }

    public function update(Request $request, CdMaster $cd_account)
    {
        $data = $request->validate([
            'ins_id' => 'nullable|exists:insurance_masters,id',
            'partner_id' => 'nullable|exists:partners,id',
            'account_name' => 'required|string|max:255',
            'account_number' => 'nullable|string|max:255',
            'min_balance' => 'nullable|numeric',
            'opening_balance' => 'nullable|numeric',
            'current_balance' => 'nullable|numeric',
            'is_active' => 'sometimes|boolean',
        ]);

        $cd_account->update($data);
        return redirect()->route('cd_accounts.index');
    }

    public function destroy(CdMaster $cd_account)
    {
        $cd_account->delete();
        return redirect()->route('cd_accounts.index');
    }

    public function toggle(CdMaster $cd_account)
    {
        $cd_account->is_active = !$cd_account->is_active;
        $cd_account->save();
        return redirect()->route('cd_accounts.index');
    }

    public function transactions(Request $request, CdMaster $cd_account)
    {
        $q = $request->input('q');

        $query = $cd_account->transactions()->orderBy('timestamp', 'desc');
        if ($q) {
            $query->where(function ($sub) use ($q) {
                $sub->where('credit_type', 'like', "%{$q}%")
                    ->orWhere('status', 'like', "%{$q}%");
            });
        }

        $transactions = $query->paginate(20)->withQueryString();

        return Inertia::render('CdAccounts/Transactions', [
            'cdAccount' => $cd_account,
            'transactions' => $transactions,
            'filters' => ['q' => $q],
        ]);
    }
}
