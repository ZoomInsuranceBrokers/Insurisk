<?php

namespace App\Http\Controllers;

use App\Models\MasterPolicy;
use App\Models\Partner;
use App\Models\CdMaster;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasterPolicyController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->input('q');
        $query = MasterPolicy::with(['partner', 'cdAccount']);

        if ($q) {
            $query->where(function ($sub) use ($q) {
                $sub->where('policy_name', 'like', "%{$q}%")
                    ->orWhere('number', 'like', "%{$q}%");
            });
        }

        $items = $query->orderBy('created_at', 'desc')->paginate(15)->withQueryString();

        return Inertia::render('MasterPolicies/Index', [
            'policies' => $items,
            'filters' => ['q' => $q],
        ]);
    }

    public function create()
    {
        $partners = Partner::orderBy('name')->get();
        $cdAccounts = CdMaster::orderBy('account_name')->get();
        return Inertia::render('MasterPolicies/Create', ['partners' => $partners, 'cdAccounts' => $cdAccounts]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'partner_id' => 'nullable|exists:partners,id',
            'policy_name' => 'required|string|max:255',
            'number' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'policy_type' => 'nullable|string|max:255',
            'policy_sub_type' => 'nullable|string|max:255',
            'term_and_condition' => 'nullable|string',
            'intercity_rate' => 'nullable|numeric',
            'intracity_rate' => 'nullable|numeric',
            'cd_account_id' => 'nullable|exists:cd_masters,id',
            'is_active' => 'sometimes|boolean',
            'is_delete' => 'sometimes|boolean',
        ]);

        MasterPolicy::create($data);
        return redirect()->route('master_policies.index');
    }

    public function edit(MasterPolicy $master_policy)
    {
        $partners = Partner::orderBy('name')->get();
        $cdAccounts = CdMaster::orderBy('account_name')->get();
        return Inertia::render('MasterPolicies/Edit', ['policy' => $master_policy, 'partners' => $partners, 'cdAccounts' => $cdAccounts]);
    }

    public function update(Request $request, MasterPolicy $master_policy)
    {
        $data = $request->validate([
            'partner_id' => 'nullable|exists:partners,id',
            'policy_name' => 'required|string|max:255',
            'number' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'policy_type' => 'nullable|string|max:255',
            'policy_sub_type' => 'nullable|string|max:255',
            'term_and_condition' => 'nullable|string',
            'intercity_rate' => 'nullable|numeric',
            'intracity_rate' => 'nullable|numeric',
            'cd_account_id' => 'nullable|exists:cd_masters,id',
            'is_active' => 'sometimes|boolean',
            'is_delete' => 'sometimes|boolean',
        ]);

        $master_policy->update($data);
        return redirect()->route('master_policies.index');
    }

    public function destroy(MasterPolicy $master_policy)
    {
        $master_policy->delete();
        return redirect()->route('master_policies.index');
    }

    public function toggle(MasterPolicy $master_policy)
    {
        $master_policy->is_active = !$master_policy->is_active;
        $master_policy->save();
        return redirect()->route('master_policies.index');
    }
}
