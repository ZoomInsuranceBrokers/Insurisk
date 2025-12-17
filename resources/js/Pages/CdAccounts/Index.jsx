import React, { useEffect, useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Index({ cdAccounts, filters }) {
    const { get } = useForm({});
    const [q, setQ] = useState(filters.q || '');

    useEffect(() => {
        const t = setTimeout(() => {
            get('/cd-accounts', { preserveState: true, preserveScroll: true, data: { q } });
        }, 400);
        return () => clearTimeout(t);
    }, [q]);

    const buildPageUrl = (page) => {
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        params.set('page', page);
        const s = params.toString();
        return `/cd-accounts${s ? '?' + s : ''}`;
    };

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-lg font-semibold">CD Accounts</h1>
                    <p className="text-sm text-slate-500">Manage CD accounts</p>
                </div>
                <div>
                    <Link href="/cd-accounts/create" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-md shadow-sm hover:bg-indigo-700">
                        <span className="text-sm">+ New CD Account</span>
                    </Link>
                </div>
            </div>

            <div className="mb-4 flex gap-3">
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search accounts..." className="px-3 py-2 border rounded-md" />
            </div>

            <div className="bg-white rounded-md border">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-sm text-slate-600">
                            <th className="p-3">Account Name</th>
                            <th className="p-3">Account Number</th>
                            <th className="p-3">Insurer</th>
                            <th className="p-3">Partner</th>
                            <th className="p-3">Balance</th>
                            <th className="p-3">Transaction History</th>
                            <th className="p-3">Active</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cdAccounts.data.map((c) => (
                            <tr key={c.id} className="border-t">
                                <td className="p-3">{c.account_name}</td>
                                <td className="p-3">{c.account_number}</td>
                                <td className="p-3">{c.insurance ? c.insurance.name : ''}</td>
                                <td className="p-3">{c.partner ? c.partner.name : ''}</td>
                                <td className="p-3">{c.current_balance}</td>
                                <td className="p-3">
                                    <Link href={`/cd-accounts/${c.id}/transactions`} className="inline-flex items-center gap-2 text-sm px-2 py-1 rounded-md border bg-slate-50 hover:bg-slate-100">
                                        View
                                    </Link>
                                </td>
                                <td className="p-3">{c.is_active ? 'Yes' : 'No'}</td>
                                <td className="p-3 space-x-2">
                                    <Link href={`/cd-accounts/${c.id}/edit`} className="text-indigo-600">Edit</Link>
                                    <form method="POST" action={`/cd-accounts/${c.id}`} className="inline">
                                        <input type="hidden" name="_method" value="DELETE" />
                                        <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />
                                        <button type="submit" className="text-red-600">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-slate-500">Showing {cdAccounts.from} to {cdAccounts.to} of {cdAccounts.total}</div>
                <div className="flex items-center gap-2">
                    <Link href={buildPageUrl(cdAccounts.current_page - 1)} className={`px-3 py-1 rounded border ${cdAccounts.current_page === 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-slate-50'}`}>Prev</Link>
                    {Array.from({ length: cdAccounts.last_page }).map((_, i) => {
                        const page = i + 1;
                        return (
                            <Link key={page} href={buildPageUrl(page)} className={`px-3 py-1 rounded ${cdAccounts.current_page === page ? 'bg-indigo-600 text-white' : 'border hover:bg-slate-50'}`}>{page}</Link>
                        );
                    })}
                    <Link href={buildPageUrl(cdAccounts.current_page + 1)} className={`px-3 py-1 rounded border ${cdAccounts.current_page === cdAccounts.last_page ? 'opacity-50 pointer-events-none' : 'hover:bg-slate-50'}`}>Next</Link>
                </div>
            </div>
        </DashboardLayout>
    );
}
