import React, { useState, useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Edit({ partner }) {
    const { data, setData, put, processing, errors } = useForm({
        name: partner.name || '',
        email: partner.email || '',
        mobile_no: partner.mobile_no || '',
        company_name: partner.company_name || '',
        website: partner.website || '',
        location: partner.location || '',
        is_active: partner.is_active || false,
    });

    const [suggestions, setSuggestions] = useState([]);
    const LOCATION_SUGGEST_URL = '/api/locations?q=';

    useEffect(() => {
        let controller;
        const value = data.location || '';
        if (!value) {
            setSuggestions([]);
            return;
        }

        const handler = setTimeout(() => {
            controller = new AbortController();
            fetch(LOCATION_SUGGEST_URL + encodeURIComponent(value), { signal: controller.signal })
                .then(r => r.ok ? r.json() : [])
                .then(json => {
                    if (Array.isArray(json)) setSuggestions(json);
                    else setSuggestions([]);
                })
                .catch(() => setSuggestions([]));
        }, 300);

        return () => {
            clearTimeout(handler);
            if (controller) controller.abort();
        };
    }, [data.location]);

    function submit(e) {
        e.preventDefault();
        put(`/partners/${partner.id}`);
    }

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-lg font-semibold">Edit Partner</h1>
                    <p className="text-sm text-slate-500">Update partner information</p>
                </div>
                <Link href="/partners" className="text-sm">Back</Link>
            </div>

            <form onSubmit={submit} className="bg-white p-6 rounded-md border shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs">Name *</label>
                        <input value={data.name} onChange={e => setData('name', e.target.value)} required className="w-full border rounded px-3 py-2" />
                        {errors.name && <div className="text-red-600 text-xs mt-1">{errors.name}</div>}
                    </div>
                    <div>
                        <label className="text-xs">Email</label>
                        <input value={data.email} onChange={e => setData('email', e.target.value)} className="w-full border rounded px-3 py-2" />
                        {errors.email && <div className="text-red-600 text-xs mt-1">{errors.email}</div>}
                    </div>
                    <div>
                        <label className="text-xs">Mobile No</label>
                        <input value={data.mobile_no} onChange={e => setData('mobile_no', e.target.value)} className="w-full border rounded px-3 py-2" />
                        {errors.mobile_no && <div className="text-red-600 text-xs mt-1">{errors.mobile_no}</div>}
                    </div>
                    <div>
                        <label className="text-xs">Company Name</label>
                        <input value={data.company_name} onChange={e => setData('company_name', e.target.value)} className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                        <label className="text-xs">Website</label>
                        <input value={data.website} onChange={e => setData('website', e.target.value)} className="w-full border rounded px-3 py-2" />
                        {errors.website && <div className="text-red-600 text-xs mt-1">{errors.website}</div>}
                    </div>
                    <div>
                        <label className="text-xs">Location</label>
                        <input list="loc-options" value={data.location} onChange={e => setData('location', e.target.value)} className="w-full border rounded px-3 py-2" />
                        <datalist id="loc-options">
                            {suggestions.map((s, i) => <option key={i} value={s} />)}
                        </datalist>
                        {errors.location && <div className="text-red-600 text-xs mt-1">{errors.location}</div>}
                    </div>
                </div>

                <div className="mt-6 flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} /> Active
                    </label>
                    <button type="submit" disabled={processing} className="bg-indigo-600 text-white px-5 py-2 rounded-md shadow">Save Changes</button>
                    {errors.name && <div className="text-red-600 text-xs mt-2">{errors.name}</div>}
                </div>
            </form>
        </DashboardLayout>
    );
}
