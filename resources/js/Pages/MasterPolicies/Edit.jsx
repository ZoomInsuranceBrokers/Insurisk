import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Edit({ policy, partners, cdAccounts }) {
    const { data, setData, put, processing, errors } = useForm({
        partner_id: policy.partner_id || '',
        policy_name: policy.policy_name || '',
        number: policy.number || '',
        start_date: policy.start_date || '',
        end_date: policy.end_date || '',
        policy_type: policy.policy_type || '',
        policy_sub_type: policy.policy_sub_type || '',
        term_and_condition: policy.term_and_condition || '',
        intercity_rate: policy.intercity_rate || '',
        intracity_rate: policy.intracity_rate || '',
        cd_account_id: policy.cd_account_id || '',
        is_active: policy.is_active || false,
    });

    function submit(e) {
        e.preventDefault();
        put(`/master-policies/${policy.id}`);
    }

    return (
        <DashboardLayout>
            <div className="max-w-2xl">
                <h1 className="text-lg font-semibold">Edit Master Policy</h1>
                <p className="text-sm text-slate-500">Update master policy</p>

                <form onSubmit={submit} className="mt-6 space-y-4">
                    <div>
                        <label className="block text-sm">Partner</label>
                        <select value={data.partner_id} onChange={(e) => setData('partner_id', e.target.value)} className="w-full px-3 py-2 border rounded-md">
                            <option value="">-- Select Partner --</option>
                            {partners.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm">Policy Name</label>
                        <input value={data.policy_name} onChange={(e) => setData('policy_name', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                        {errors.policy_name && <div className="text-red-600 text-sm mt-1">{errors.policy_name}</div>}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-sm">Number</label>
                            <input value={data.number} onChange={(e) => setData('number', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm">Start Date</label>
                            <input type="date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm">End Date</label>
                            <input type="date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm">Policy Type</label>
                            <input value={data.policy_type} onChange={(e) => setData('policy_type', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm">Policy Sub Type</label>
                            <input value={data.policy_sub_type} onChange={(e) => setData('policy_sub_type', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm">CD Account</label>
                        <select value={data.cd_account_id} onChange={(e) => setData('cd_account_id', e.target.value)} className="w-full px-3 py-2 border rounded-md">
                            <option value="">-- Select CD Account --</option>
                            {cdAccounts.map((c) => <option key={c.id} value={c.id}>{c.account_name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm">Term And Condition</label>
                        <textarea value={data.term_and_condition} onChange={(e) => setData('term_and_condition', e.target.value)} className="w-full px-3 py-2 border rounded-md h-32" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm">Intercity Rate</label>
                            <input value={data.intercity_rate} onChange={(e) => setData('intercity_rate', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm">Intracity Rate</label>
                            <input value={data.intracity_rate} onChange={(e) => setData('intracity_rate', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/master-policies" className="text-sm">Back</Link>
                        <button type="submit" disabled={processing} className="bg-indigo-600 text-white px-4 py-2 rounded-md">Update Policy</button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
