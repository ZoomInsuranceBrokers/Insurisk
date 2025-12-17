import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function DashboardLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const [activePath, setActivePath] = useState('/');
    const [openMenus, setOpenMenus] = useState({});

    useEffect(() => {
        setActivePath(window.location.pathname || '/');
        const onPop = () => setActivePath(window.location.pathname || '/');
        window.addEventListener('popstate', onPop);
        // open parent menus when the active path matches a child route
        const initOpen = {};
        navItems.forEach((item) => {
            if (item.children) {
                const match = item.children.some((c) => (window.location.pathname || '/') === c.to || (window.location.pathname || '/').startsWith(c.to));
                if (match) initOpen[item.label] = true;
            }
        });
        setOpenMenus(initOpen);
        return () => window.removeEventListener('popstate', onPop);
    }, []);

    useEffect(() => {
        // keep parent open when activePath changes and matches a child
        const updates = {};
        navItems.forEach((item) => {
            if (item.children) {
                const match = item.children.some((c) => activePath === c.to || activePath.startsWith(c.to));
                if (match) updates[item.label] = true;
            }
        });
        if (Object.keys(updates).length) setOpenMenus((s) => ({ ...s, ...updates }));
    }, [activePath]);

    const navItems = [
        { to: '/dashboard', label: 'Overview', icon: '🏠' },
        { to: '/partners', label: 'Partners', icon: '🤝' },
                {
                    label: 'Policies',
                    icon: '🗂',
                    children: [
                        { to: '/master-policies', label: 'Master Policies', icon: '📚' },
                        { to: '/certificate-of-insurance', label: 'Certificate of Insurance', icon: '📝' },
                        { to: '/cd-accounts', label: 'CD Account', icon: '🏦' },
                    ],
                },
        { to: '/insurances', label: 'Insurance Master', icon: '🏢' },
        { to: '/roles', label: 'Roles', icon: '🔐' },
        { to: '/claims', label: 'Claims', icon: '📋' },
        { to: '/reports', label: 'Reports', icon: '📊' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 text-sm font-sans">
            {/* Topbar */}
            <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center space-x-3">
                            <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded-md hover:bg-slate-100" aria-label="Toggle sidebar">
                                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <a href="/dashboard" className="flex items-center gap-2 hover:opacity-90" aria-label="zoom embed dashboard">
                                <div className="text-base font-semibold text-slate-800 hidden md:block">
                                        <img src="/assets/images/Zoom%20Embed%20logo-01.png" alt="Zoom Embed" className="h-8 object-contain inline-block" />
                                    </div>
                            </a>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-slate-600">Welcome, Admin</div>
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs">U</div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-6">
                    {/* Sidebar */}
                    <aside className={`flex-shrink-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} -ml-3 md:-ml-6`}>
                        <div className="sticky top-20">
                            <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm">
                                <div className="mb-4 px-2">
                                    <div className="text-xs text-slate-500 px-2">Navigation</div>
                                </div>

                                <nav className="space-y-1 px-1">
                                    {navItems.map((item) => {
                                        if (item.children) {
                                            const isOpen = !!openMenus[item.label];
                                            return (
                                                <div key={item.label} className="">
                                                    <button
                                                        type="button"
                                                        onClick={() => setOpenMenus((s) => ({ ...s, [item.label]: !s[item.label] }))}
                                                        className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-slate-700 ${collapsed ? 'justify-center' : 'hover:bg-indigo-50'}`}
                                                        aria-expanded={isOpen}
                                                    >
                                                        <div className={`w-7 h-7 bg-indigo-100 rounded-md flex items-center justify-center text-indigo-600 text-sm ${collapsed ? 'mx-auto' : ''}`}>{item.icon}</div>
                                                        {!collapsed && (
                                                            <div className="flex items-center justify-between w-full">
                                                                <span className="text-sm font-medium">{item.label}</span>
                                                                <svg className={`w-4 h-4 text-slate-500 transform ${isOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                                                            </div>
                                                        )}
                                                    </button>

                                                    {!collapsed && isOpen && (
                                                        <div className="mt-1 space-y-1 pl-10">
                                                            {item.children.map((child) => {
                                                                const activeChild = activePath === child.to;
                                                                return (
                                                                    <Link
                                                                        key={child.to}
                                                                        href={child.to}
                                                                        title={child.label}
                                                                        className={`block rounded-md px-3 py-2 text-slate-700 hover:bg-indigo-50 ${activeChild ? 'bg-indigo-50 ring-1 ring-indigo-200' : ''}`}
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-6 h-6 bg-indigo-50 rounded-md flex items-center justify-center text-indigo-600 text-xs">{child.icon}</div>
                                                                            <span className="text-sm">{child.label}</span>
                                                                        </div>
                                                                    </Link>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }

                                        const active = activePath === item.to;
                                        return (
                                            <Link
                                                key={item.to}
                                                href={item.to}
                                                title={item.label}
                                                className={`block rounded-md px-3 py-2 text-slate-700 hover:bg-indigo-50 ${active ? 'bg-indigo-50 ring-1 ring-indigo-200' : ''}`}
                                            >
                                                <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
                                                    <div className={`w-7 h-7 bg-indigo-100 rounded-md flex items-center justify-center text-indigo-600 text-sm ${collapsed ? 'mx-auto' : ''}`}>{item.icon}</div>
                                                    {!collapsed && <span className="text-sm">{item.label}</span>}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </nav>

                                <div className="mt-6 px-1">
                                    <div className="text-xs text-slate-400 px-2">Utilities</div>
                                    <div className="mt-2 space-y-2">
                                        <button title="Settings" className="w-full text-left px-3 py-2 rounded-md text-slate-700 hover:bg-indigo-50 flex items-center gap-3">
                                            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zm0 10v-2m8-6h-2M6 12H4m15.536 6.536l-1.414-1.414M7.88 7.88L6.466 6.466m12.02 0l-1.414 1.414M7.88 16.12L6.466 17.536"/></svg>
                                            <span className="text-sm">Settings</span>
                                        </button>

                                        <button
                                            title="Logout"
                                            onClick={() => {
                                                const tokenMeta = document.querySelector('meta[name="csrf-token"]');
                                                const token = tokenMeta ? tokenMeta.getAttribute('content') : null;
                                                // Create and submit a POST form to ensure Laravel session invalidation
                                                const form = document.createElement('form');
                                                form.method = 'POST';
                                                form.action = '/logout';
                                                const input = document.createElement('input');
                                                input.type = 'hidden';
                                                input.name = '_token';
                                                input.value = token || '';
                                                form.appendChild(input);
                                                document.body.appendChild(form);
                                                form.submit();
                                            }}
                                            className="w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50 flex items-center gap-3"
                                        >
                                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1"/></svg>
                                            <span className="text-sm">Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main content */}
                    <main className="flex-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
