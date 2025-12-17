import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Edit({ cdAccount, insurers, partners }) {
    const { data, setData, put, processing, errors } = useForm({
        ins_id: cdAccount.ins_id || '',
        partner_id: cdAccount.partner_id || '',
        account_name: cdAccount.account_name || '',
        account_number: cdAccount.account_number || '',
        min_balance: cdAccount.min_balance || '',
        opening_balance: cdAccount.opening_balance || '',
        current_balance: cdAccount.current_balance || '',
        is_active: cdAccount.is_active || false,
    });

    function submit(e) {
        e.preventDefault();
        put(`/cd-accounts/${cdAccount.id}`);
    }

    return (
        <DashboardLayout>
            <div className="max-w-2xl">
                <h1 className="text-lg font-semibold">Edit CD Account</h1>
                <p className="text-sm text-slate-500">Update CD account</p>

                <form onSubmit={submit} className="mt-6 space-y-4">
                    <div>
                        <label className="block text-sm">Insurer</label>
                        <select value={data.ins_id} onChange={(e) => setData('ins_id', e.target.value)} className="w-full px-3 py-2 border rounded-md">
                            <option value="">-- Select Insurer --</option>
                            {insurers.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm">Partner</label>
                        <select value={data.partner_id} onChange={(e) => setData('partner_id', e.target.value)} className="w-full px-3 py-2 border rounded-md">
                            <option value="">-- Select Partner --</option>
                            {partners.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm">Account Name</label>
                        <input value={data.account_name} onChange={(e) => setData('account_name', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                        {errors.account_name && <div className="text-red-600 text-sm mt-1">{errors.account_name}</div>}
                    </div>

                    <div>
                        <label className="block text-sm">Account Number</label>
                        <input value={data.account_number} onChange={(e) => setData('account_number', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-sm">Min Balance</label>
                            <input value={data.min_balance} onChange={(e) => setData('min_balance', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm">Opening Balance</label>
                            <input value={data.opening_balance} onChange={(e) => setData('opening_balance', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm">Current Balance</label>
                            <input value={data.current_balance} onChange={(e) => setData('current_balance', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                            <span className="text-sm">Active</span>
                        </label>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/cd-accounts" className="text-sm">Back</Link>
                        <button type="submit" disabled={processing} className="bg-indigo-600 text-white px-4 py-2 rounded-md">Update Account</button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
