import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Transactions({ cdAccount, transactions, filters }) {
    const { get } = useForm({});
    const [q, setQ] = useState(filters.q || '');

    // simple search handler
    React.useEffect(() => {
        const t = setTimeout(() => {
            get(window.location.pathname, { preserveState: true, preserveScroll: true, data: { q } });
        }, 400);
        return () => clearTimeout(t);
    }, [q]);

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-lg font-semibold">Transaction History</h1>
                    <p className="text-sm text-slate-500">Transactions for {cdAccount.account_name}</p>
                </div>
                <div>
                    <Link href="/cd-accounts" className="text-sm">Back to CD Accounts</Link>
                </div>
            </div>

            <div className="mb-4">
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search transactions..." className="px-3 py-2 border rounded-md" />
            </div>

            <div className="bg-white rounded-md border">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-sm text-slate-600">
                            <th className="p-3">Transaction ID</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">Amount</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.data.map((t) => (
                            <tr key={t.id} className="border-t">
                                <td className="p-3">{t.transaction_id || `#${t.id}`}</td>
                                <td className="p-3">{t.credit_type}</td>
                                <td className="p-3">{t.amount}</td>
                                <td className="p-3">{t.status}</td>
                                <td className="p-3">{t.timestamp}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-slate-500">Showing {transactions.from} to {transactions.to} of {transactions.total}</div>
                <div className="flex items-center gap-2">
                    <Link href={`${window.location.pathname}?page=${transactions.current_page - 1}`} className={`px-3 py-1 rounded border ${transactions.current_page === 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-slate-50'}`}>Prev</Link>
                    {Array.from({ length: transactions.last_page }).map((_, i) => {
                        const page = i + 1;
                        return (
                            <Link key={page} href={`${window.location.pathname}?page=${page}`} className={`px-3 py-1 rounded ${transactions.current_page === page ? 'bg-indigo-600 text-white' : 'border hover:bg-slate-50'}`}>{page}</Link>
                        );
                    })}
                    <Link href={`${window.location.pathname}?page=${transactions.current_page + 1}`} className={`px-3 py-1 rounded border ${transactions.current_page === transactions.last_page ? 'opacity-50 pointer-events-none' : 'hover:bg-slate-50'}`}>Next</Link>
                </div>
            </div>
        </DashboardLayout>
    );
}
