import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '', logo: '', address: '', is_active: true,
    });

    function submit(e) {
        e.preventDefault();
        post('/insurances');
    }

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-lg font-semibold">Create Insurance</h1>
                    <p className="text-sm text-slate-500">Add a new insurance company</p>
                </div>
                <Link href="/insurances" className="text-sm">Back</Link>
            </div>

            <form onSubmit={submit} className="bg-white p-6 rounded-md border shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs">Name *</label>
                        <input value={data.name} onChange={e => setData('name', e.target.value)} required className="w-full border rounded px-3 py-2" />
                        {errors.name && <div className="text-red-600 text-xs mt-1">{errors.name}</div>}
                    </div>
                    <div>
                        <label className="text-xs">Logo (URL)</label>
                        <input value={data.logo} onChange={e => setData('logo', e.target.value)} className="w-full border rounded px-3 py-2" />
                        {errors.logo && <div className="text-red-600 text-xs mt-1">{errors.logo}</div>}
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs">Address</label>
                        <textarea value={data.address} onChange={e => setData('address', e.target.value)} className="w-full border rounded px-3 py-2 h-28" />
                        {errors.address && <div className="text-red-600 text-xs mt-1">{errors.address}</div>}
                    </div>
                </div>

                <div className="mt-6 flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} /> Active
                    </label>
                    <button type="submit" disabled={processing} className="bg-indigo-600 text-white px-5 py-2 rounded-md shadow">Create Insurance</button>
                </div>
            </form>
        </DashboardLayout>
    );
}
