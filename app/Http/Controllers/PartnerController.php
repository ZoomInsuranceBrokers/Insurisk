<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PartnerController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->input('q');
        $status = $request->input('status'); // 'all' | 'active' | 'inactive'

        $query = Partner::query();

        if ($q) {
            $query->where(function ($sub) use ($q) {
                $sub->where('name', 'like', "%{$q}%")
                    ->orWhere('company_name', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%");
            });
        }

        if ($status === 'active') {
            $query->where('is_active', true);
        } elseif ($status === 'inactive') {
            $query->where('is_active', false);
        }

        $partners = $query->orderBy('created_at', 'desc')->paginate(15)->withQueryString();

        return Inertia::render('Partners/Index', [
            'partners' => $partners,
            'filters' => [
                'q' => $q,
                'status' => $status ?? 'all',
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Partners/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'mobile_no' => 'nullable|string|max:50',
            'company_name' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'location' => 'nullable|string|max:255',
        ]);

        Partner::create($data);
        return redirect()->route('partners.index');
    }

    public function edit(Partner $partner)
    {
        return Inertia::render('Partners/Edit', ['partner' => $partner]);
    }

    public function update(Request $request, Partner $partner)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'mobile_no' => 'nullable|string|max:50',
            'company_name' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'location' => 'nullable|string|max:255',
            'is_active' => 'sometimes|boolean',
        ]);

        $partner->update($data);
        return redirect()->route('partners.index');
    }

    public function destroy(Partner $partner)
    {
        $partner->delete();
        return redirect()->route('partners.index');
    }

    public function toggle(Partner $partner)
    {
        $partner->is_active = !$partner->is_active;
        $partner->save();
        return redirect()->route('partners.index');
    }
}
