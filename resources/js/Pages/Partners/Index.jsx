import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Index({ partners, filters }) {
    const { data, setData, get } = useForm({
        q: filters?.q || '',
        status: filters?.status || 'all',
    });

    function submit(e) {
        e.preventDefault();
        get('/partners', { preserveState: true, preserveScroll: true });
    }

    function resetFilters() {
        setData('q', '');
        setData('status', 'all');
        get('/partners', { preserveState: true, preserveScroll: true });
    }

    const buildPageUrl = (page) => {
        const params = new URLSearchParams();
        if (data.q) params.append('q', data.q);
        if (data.status && data.status !== 'all') params.append('status', data.status);
        if (page) params.append('page', page);
        const s = params.toString();
        return `/partners${s ? '?' + s : ''}`;
    };

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-lg font-semibold">Partners</h1>
                    <p className="text-sm text-slate-500">Manage partners and their details</p>
                </div>
                <Link href="/partners/create" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-md shadow-sm hover:bg-indigo-700">
                    <span className="text-sm">+ New Partner</span>
                </Link>
            </div>

            <div className="bg-white rounded-md border p-4 mb-4">
                <form onSubmit={submit} className="flex gap-3 items-center">
                    <input
                        type="text"
                        placeholder="Search name, company or email"
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
                                <th className="pb-2">Company</th>
                                <th className="pb-2">Email</th>
                                <th className="pb-2">Mobile</th>
                                <th className="pb-2">Location</th>
                                <th className="pb-2">Active</th>
                                <th className="pb-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {partners.data.map((p) => (
                                <tr key={p.id} className="border-t hover:bg-slate-50">
                                    <td className="py-3">
                                        <div className="font-medium">{p.name}</div>
                                        <div className="text-xs text-slate-400">{p.email}</div>
                                    </td>
                                    <td className="py-3">{p.company_name}</td>
                                    <td className="py-3 hidden md:table-cell">{p.email}</td>
                                    <td className="py-3 hidden md:table-cell">{p.mobile_no}</td>
                                    <td className="py-3">{p.location}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {p.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-3">
                                            <Link href={`/partners/${p.id}/edit`} className="text-indigo-600">Edit</Link>
                                            <form method="POST" action={`/partners/${p.id}`} className="inline">
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
                    <div className="text-sm text-slate-500">Showing {partners.from} to {partners.to} of {partners.total}</div>
                    <div className="flex items-center gap-2">
                        <Link href={buildPageUrl(partners.current_page - 1)} className={`px-3 py-1 rounded border ${partners.current_page === 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-slate-50'}`}>Prev</Link>
                        {Array.from({ length: partners.last_page }).map((_, i) => {
                            const page = i + 1;
                            return (
                                <Link key={page} href={buildPageUrl(page)} className={`px-3 py-1 rounded ${partners.current_page === page ? 'bg-indigo-600 text-white' : 'border hover:bg-slate-50'}`}>
                                    {page}
                                </Link>
                            );
                        })}
                        <Link href={buildPageUrl(partners.current_page + 1)} className={`px-3 py-1 rounded border ${partners.current_page === partners.last_page ? 'opacity-50 pointer-events-none' : 'hover:bg-slate-50'}`}>Next</Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
