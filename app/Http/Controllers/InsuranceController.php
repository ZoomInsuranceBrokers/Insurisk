<?php

namespace App\Http\Controllers;

use App\Models\InsuranceMaster;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InsuranceController extends Controller
{
    public function index()
    {
        $items = InsuranceMaster::orderBy('name')->paginate(20);
        return Inertia::render('Insurances/Index', ['insurances' => $items]);
    }

    public function create()
    {
        return Inertia::render('Insurances/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        InsuranceMaster::create($data);
        return redirect()->route('insurances.index');
    }

    public function edit(InsuranceMaster $insurance)
    {
        return Inertia::render('Insurances/Edit', ['insurance' => $insurance]);
    }

    public function update(Request $request, InsuranceMaster $insurance)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $insurance->update($data);
        return redirect()->route('insurances.index');
    }

    public function destroy(InsuranceMaster $insurance)
    {
        $insurance->delete();
        return redirect()->route('insurances.index');
    }

    public function toggle(InsuranceMaster $insurance)
    {
        $insurance->is_active = !$insurance->is_active;
        $insurance->save();
        return redirect()->route('insurances.index');
    }
}
