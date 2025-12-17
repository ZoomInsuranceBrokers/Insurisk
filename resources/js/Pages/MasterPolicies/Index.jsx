import React, { useEffect, useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Index({ policies, filters }) {
    const { get } = useForm({});
    const [q, setQ] = useState(filters.q || '');

    useEffect(() => {
        const t = setTimeout(() => {
            get('/master-policies', { preserveState: true, preserveScroll: true, data: { q } });
        }, 400);
        return () => clearTimeout(t);
    }, [q]);

    const buildPageUrl = (page) => {
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        params.set('page', page);
        const s = params.toString();
        return `/master-policies${s ? '?' + s : ''}`;
    };

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-lg font-semibold">Master Policies</h1>
                    <p className="text-sm text-slate-500">Manage master policies</p>
                </div>
                <div>
                    <Link href="/master-policies/create" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-md shadow-sm hover:bg-indigo-700">
                        <span className="text-sm">+ New Policy</span>
                    </Link>
                </div>
            </div>

            <div className="mb-4 flex gap-3">
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search policies..." className="px-3 py-2 border rounded-md" />
            </div>

            <div className="bg-white rounded-md border">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-sm text-slate-600">
                            <th className="p-3">Policy Name</th>
                            <th className="p-3">Number</th>
                            <th className="p-3">Partner</th>
                            <th className="p-3">CD Account</th>
                            <th className="p-3">Start</th>
                            <th className="p-3">End</th>
                            <th className="p-3">Active</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {policies.data.map((p) => (
                            <tr key={p.id} className="border-t">
                                <td className="p-3">{p.policy_name}</td>
                                <td className="p-3">{p.number}</td>
                                <td className="p-3">{p.partner ? p.partner.name : ''}</td>
                                <td className="p-3">{p.cd_account ? p.cd_account.account_name : ''}</td>
                                <td className="p-3">{p.start_date}</td>
                                <td className="p-3">{p.end_date}</td>
                                <td className="p-3">{p.is_active ? 'Yes' : 'No'}</td>
                                <td className="p-3 space-x-2">
                                    <Link href={`/master-policies/${p.id}/edit`} className="text-indigo-600">Edit</Link>
                                    <form method="POST" action={`/master-policies/${p.id}`} className="inline">
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
                <div className="text-sm text-slate-500">Showing {policies.from} to {policies.to} of {policies.total}</div>
                <div className="flex items-center gap-2">
                    <Link href={buildPageUrl(policies.current_page - 1)} className={`px-3 py-1 rounded border ${policies.current_page === 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-slate-50'}`}>Prev</Link>
                    {Array.from({ length: policies.last_page }).map((_, i) => {
                        const page = i + 1;
                        return (
                            <Link key={page} href={buildPageUrl(page)} className={`px-3 py-1 rounded ${policies.current_page === page ? 'bg-indigo-600 text-white' : 'border hover:bg-slate-50'}`}>{page}</Link>
                        );
                    })}
                    <Link href={buildPageUrl(policies.current_page + 1)} className={`px-3 py-1 rounded border ${policies.current_page === policies.last_page ? 'opacity-50 pointer-events-none' : 'hover:bg-slate-50'}`}>Next</Link>
                </div>
            </div>
        </DashboardLayout>
    );
}
