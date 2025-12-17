import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Index({ insurances, filters }) {
    const { data, setData, get } = useForm({
        q: filters?.q || '',
        status: filters?.status || 'all',
    });

    function submit(e) {
        e.preventDefault();
        get('/insurances', { preserveState: true, preserveScroll: true });
    }

    function resetFilters() {
        setData('q', '');
        setData('status', 'all');
        get('/insurances', { preserveState: true, preserveScroll: true });
    }

    const buildPageUrl = (page) => {
        const params = new URLSearchParams();
        if (data.q) params.append('q', data.q);
        if (data.status && data.status !== 'all') params.append('status', data.status);
        if (page) params.append('page', page);
        const s = params.toString();
        return `/insurances${s ? '?' + s : ''}`;
    };

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-lg font-semibold">Insurance Master</h1>
                    <p className="text-sm text-slate-500">Manage insurance companies</p>
                </div>
                <Link href="/insurances/create" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-md shadow-sm hover:bg-indigo-700">
                    <span className="text-sm">+ New Insurance</span>
                </Link>
            </div>

            <div className="bg-white rounded-md border p-4 mb-4">
                <form onSubmit={submit} className="flex gap-3 items-center">
                    <input
                        type="text"
                        placeholder="Search name or address"
                        value={data.q}
                        onChange={e => setData('q', e.target.value)}
                        className="border rounded px-3 py-2 w-60"
                    />

                    <select value={data.status} onChange={e => setData('status', e.target.value)} className="border rounded px-3 py-2">
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    <button type="submit" className="bg-indigo-600 text-white px-3 py-2 rounded-md">Search</button>
                    <button type="button" onClick={resetFilters} className="px-3 py-2 rounded-md border">Reset</button>
                </form>
            </div>

            <div className="bg-white rounded-md border p-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs text-slate-500">
                                <th className="pb-2">Name</th>
                                <th className="pb-2">Address</th>
                                <th className="pb-2">Active</th>
                                <th className="pb-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {insurances.data.map((s) => (
                                <tr key={s.id} className="border-t hover:bg-slate-50">
                                    <td className="py-3">
                                        <div className="font-medium">{s.name}</div>
                                    </td>
                                    <td className="py-3">{s.address}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {s.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-3">
                                            <Link href={`/insurances/${s.id}/edit`} className="text-indigo-600">Edit</Link>
                                            <form method="POST" action={`/insurances/${s.id}`} className="inline">
                                                <input type="hidden" name="_method" value="DELETE" />
                                                <input type="hidden" name="_token" value={typeof document !== 'undefined' && document.querySelector('meta[name="csrf-token"]') ? document.querySelector('meta[name="csrf-token"]').getAttribute('content') : ''} />
                                                <button className="text-red-600">Delete</button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-slate-500">Showing {insurances.from} to {insurances.to} of {insurances.total}</div>
                    <div className="flex items-center gap-2">
                        <Link href={buildPageUrl(insurances.current_page - 1)} className={`px-3 py-1 rounded border ${insurances.current_page === 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-slate-50'}`}>Prev</Link>
                        {Array.from({ length: insurances.last_page }).map((_, i) => {
                            const page = i + 1;
                            return (
                                <Link key={page} href={buildPageUrl(page)} className={`px-3 py-1 rounded ${insurances.current_page === page ? 'bg-indigo-600 text-white' : 'border hover:bg-slate-50'}`}>
                                    {page}
                                </Link>
                            );
                        })}
                        <Link href={buildPageUrl(insurances.current_page + 1)} className={`px-3 py-1 rounded border ${insurances.current_page === insurances.last_page ? 'opacity-50 pointer-events-none' : 'hover:bg-slate-50'}`}>Next</Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );

}
