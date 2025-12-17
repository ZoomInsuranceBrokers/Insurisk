import React from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Dashboard() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-base font-semibold text-slate-800">Overview</h1>
                    <div className="text-xs text-slate-500">Dashboard — Policies & Claims</div>
                </div>
                <div className="text-xs text-slate-600">Last updated: 2025-12-15</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: 'Active Policies', value: '12,847' },
                    { title: 'Claims Open', value: '128' },
                    { title: 'Premium Collected', value: '$2.4M' },
                    { title: 'Avg Response', value: '1.2h' }
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white border border-slate-100 rounded-lg p-3 text-sm shadow-sm">
                        <div className="text-slate-500 text-xs">{stat.title}</div>
                        <div className="text-slate-900 font-semibold text-lg mt-2">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-slate-100 rounded-lg p-3 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-800 mb-3">Recent Policy Issuances</h3>
                    <div className="space-y-3 text-sm text-slate-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">Policy #12847</div>
                                <div className="text-xs text-slate-500">Marine Transit — Acme Logistics</div>
                            </div>
                            <div className="text-sm text-slate-700">$125,000</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">Policy #12846</div>
                                <div className="text-xs text-slate-500">Motor Fleet — Global Transport</div>
                            </div>
                            <div className="text-sm text-slate-700">$89,500</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">Policy #12845</div>
                                <div className="text-xs text-slate-500">Property — Prime Estates</div>
                            </div>
                            <div className="text-sm text-slate-700">$210,000</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-lg p-3 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-800 mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                        <button className="w-full text-left px-3 py-2 bg-indigo-50 rounded-md text-indigo-600 text-sm">Create Policy</button>
                        <button className="w-full text-left px-3 py-2 bg-green-50 rounded-md text-green-600 text-sm">Intimate Claim</button>
                        <button className="w-full text-left px-3 py-2 bg-slate-50 rounded-md text-slate-700 text-sm">View Reports</button>
                    </div>
                </div>
            </div>

        </div>
    );
}

Dashboard.layout = page => <DashboardLayout>{page}</DashboardLayout>
