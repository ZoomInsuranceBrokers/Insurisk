import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Home() {
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            // Determine active section based on scroll position
            const sections = ['home', 'platform', 'roles', 'claims', 'reports', 'contact'];
            const scrollPosition = window.scrollY + 100;

            for (let section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 80; // Account for sticky header
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({ top: elementPosition, behavior: 'smooth' });
        }
    };

    return (
        <>
            <Head title="Insurance Policy and Claims Portal" />

            {/* Sticky Topbar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-lg'
                    : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <span className={`text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent`}>
                                <img src="/assets/images/Zoom%20Embed%20logo-01.png" alt="Zoom Embed" className="inline-block h-6 object-contain" />
                            </span>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-8">
                            {[
                                { id: 'home', label: 'Home' },
                                { id: 'platform', label: 'Platform' },
                                { id: 'roles', label: 'Roles' },
                                { id: 'claims', label: 'Claims' },
                                { id: 'reports', label: 'Reports' }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`text-sm font-medium transition-colors duration-200 ${activeSection === item.id
                                            ? 'text-indigo-600'
                                            : scrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Login Button */}
                        <Link href="/login" className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200">
                            Login
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/30 to-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSg5OSwgMTAyLCAyNDEsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-16 text-center">
                    <div className="mb-6 inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        <span className="text-sm font-medium text-indigo-900">Next-Gen Insurance Platform</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
                        Insurance Policy and
                        <br />
                        <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            Claims Portal
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                        A unified digital platform to manage insurance policies and claims with real-time issuance,
                        CD balance management, and role-based access.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <button
                            onClick={() => scrollToSection('contact')}
                            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-lg font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300"
                        >
                            Request a Demo
                        </button>
                        <button
                            onClick={() => scrollToSection('platform')}
                            className="px-8 py-4 bg-white text-indigo-600 text-lg font-semibold rounded-full border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-xl transition-all duration-300"
                        >
                            Explore Platform
                        </button>
                    </div>

                    {/* Floating Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {[
                            { icon: '⚡', title: 'Real-Time Issuance', desc: 'Instant policy generation via APIs' },
                            { icon: '💰', title: 'CD Balance', desc: 'Automated premium deduction' },
                            { icon: '🔒', title: 'Role-Based Access', desc: 'Secure multi-level permissions' }
                        ].map((feature, idx) => (
                            <div
                                key={idx}
                                className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-indigo-100 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className="text-4xl mb-3">{feature.icon}</div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Wave Separator */}

            </section>

            {/* Platform Overview Section */}
            <section id="platform" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Platform Overview
                        </h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-indigo-600 to-blue-600 mx-auto mb-6"></div>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            A comprehensive solution designed to streamline insurance operations with cutting-edge technology
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                ),
                                title: 'Unified Policy Management',
                                description: 'Single platform for comprehensive policy lifecycle management from creation to renewal'
                            },
                            {
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                ),
                                title: 'Real-Time Issuance',
                                description: 'Near real-time or instant policy issuance through integrated API infrastructure'
                            },
                            {
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                ),
                                title: 'CD Balance Management',
                                description: 'Credit/Debit balance-based automated premium deduction and financial tracking'
                            },
                            {
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                ),
                                title: 'Claim Intimation',
                                description: 'Simplified claim filing and real-time tracking with automated status updates'
                            },
                            {
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                ),
                                title: 'MIS & Dashboards',
                                description: 'Comprehensive reporting and analytics for all stakeholders with real-time insights'
                            },
                            {
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                ),
                                title: 'Secure Access Control',
                                description: 'Multi-tier role-based permissions ensuring data security and compliance'
                            }
                        ].map((feature, idx) => (
                            <div
                                key={idx}
                                className="group relative bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>

                                {/* Hover effect gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-blue-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Roles & Access Section */}
            <section id="roles" className="py-24 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQyIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMTAgMCBMIDAgMCAwIDEwIiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZDIpIi8+PC9zdmc+')]"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Roles & Access Control
                        </h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto mb-6"></div>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                            Hierarchical access management with granular permissions for each user role
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                role: 'Super Admin',
                                color: 'from-purple-500 to-pink-500',
                                icon: '👑',
                                permissions: [
                                    'Client account creation',
                                    'Master policy creation & upload',
                                    'CD balance management',
                                    'System-wide configuration',
                                    'User role assignment'
                                ]
                            },
                            {
                                role: 'Admin',
                                color: 'from-blue-500 to-cyan-500',
                                icon: '⚙️',
                                permissions: [
                                    'Policy management',
                                    'Reporting & MIS access',
                                    'User management',
                                    'Manual data updates',
                                    'Audit trail monitoring'
                                ]
                            },
                            {
                                role: 'Claim Team',
                                color: 'from-green-500 to-emerald-500',
                                icon: '📋',
                                permissions: [
                                    'Receive and process claims',
                                    'Handle non-API claims',
                                    'Update claim status manually',
                                    'Document verification',
                                    'Claim approval workflow'
                                ]
                            },
                            {
                                role: 'User Login',
                                color: 'from-orange-500 to-amber-500',
                                icon: '👤',
                                permissions: [
                                    'View master policy',
                                    'Initiate policy issuance',
                                    'Intimate claims',
                                    'Download documents',
                                    'Track claim status'
                                ]
                            }
                        ].map((roleData, idx) => (
                            <div
                                key={idx}
                                className="group bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 overflow-hidden"
                            >
                                <div className={`bg-gradient-to-r ${roleData.color} p-6`}>
                                    <div className="text-5xl mb-3">{roleData.icon}</div>
                                    <h3 className="text-2xl font-bold text-white">{roleData.role}</h3>
                                </div>
                                <div className="p-6">
                                    <ul className="space-y-3">
                                        {roleData.permissions.map((permission, pIdx) => (
                                            <li key={pIdx} className="flex items-start">
                                                <svg className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-sm text-blue-100">{permission}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Claims & Policy Management Section */}
            <section id="claims" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Claims & Policy Management
                        </h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-indigo-600 to-blue-600 mx-auto mb-6"></div>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            End-to-end lifecycle management with automated workflows and real-time tracking
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Policy Management */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-indigo-100">
                            <div className="flex items-center mb-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center text-white mr-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Policy Management</h3>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { step: '01', title: 'Policy Creation', desc: 'Upload master policies with flexible parameters' },
                                    { step: '02', title: 'API Integration', desc: 'Real-time issuance via secure API endpoints' },
                                    { step: '03', title: 'Premium Calculation', desc: 'Automated CD balance deduction' },
                                    { step: '04', title: 'Document Generation', desc: 'Instant policy certificate creation' },
                                    { step: '05', title: 'Renewal Management', desc: 'Automated reminders and processing' }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start group hover:bg-indigo-50 p-4 rounded-xl transition-colors duration-200">
                                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold mr-4 flex-shrink-0 group-hover:bg-indigo-200 transition-colors">
                                            {item.step}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                                            <p className="text-sm text-gray-600">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Claims Processing */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-green-100">
                            <div className="flex items-center mb-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center text-white mr-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Claims Processing</h3>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { step: '01', title: 'Claim Intimation', desc: 'Quick filing through portal or API' },
                                    { step: '02', title: 'Document Upload', desc: 'Secure attachment of supporting documents' },
                                    { step: '03', title: 'Verification', desc: 'Automated and manual verification process' },
                                    { step: '04', title: 'Status Tracking', desc: 'Real-time claim status updates' },
                                    { step: '05', title: 'Settlement', desc: 'Fast approval and payment processing' }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start group hover:bg-green-50 p-4 rounded-xl transition-colors duration-200">
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold mr-4 flex-shrink-0 group-hover:bg-green-200 transition-colors">
                                            {item.step}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                                            <p className="text-sm text-gray-600">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { number: '99.9%', label: 'Uptime SLA' },
                            { number: '<2min', label: 'Avg. Issuance Time' },
                            { number: '24/7', label: 'Support Available' },
                            { number: '100%', label: 'API Compliant' }
                        ].map((stat, idx) => (
                            <div key={idx} className="text-center bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reports & Dashboards Section */}
            <section id="reports" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Reports & Dashboards
                        </h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-indigo-600 to-blue-600 mx-auto mb-6"></div>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Comprehensive analytics and insights for data-driven decision making
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        {[
                            {
                                title: 'Executive Dashboard',
                                icon: '📊',
                                features: [
                                    'Key performance indicators',
                                    'Revenue analytics',
                                    'Claim ratio metrics',
                                    'Growth trends',
                                    'Comparative analysis'
                                ]
                            },
                            {
                                title: 'Operational Reports',
                                icon: '📈',
                                features: [
                                    'Policy issuance reports',
                                    'Claim status tracking',
                                    'Premium collection',
                                    'Outstanding balances',
                                    'Renewal pipeline'
                                ]
                            },
                            {
                                title: 'Custom Analytics',
                                icon: '🎯',
                                features: [
                                    'Customizable dashboards',
                                    'Ad-hoc report builder',
                                    'Data export options',
                                    'Scheduled reports',
                                    'API data access'
                                ]
                            }
                        ].map((dashboard, idx) => (
                            <div key={idx} className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-2xl p-8 border border-indigo-100 hover:shadow-2xl transition-all duration-300">
                                <div className="text-5xl mb-4">{dashboard.icon}</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">{dashboard.title}</h3>
                                <ul className="space-y-3">
                                    {dashboard.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="flex items-center text-gray-700">
                                            <svg className="w-5 h-5 text-indigo-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Dashboard Preview Mockup */}
                    <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-3xl p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <div className="text-white text-sm font-medium">Live Dashboard</div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {[
                                { label: 'Active Policies', value: '12,847', trend: '+12%' },
                                { label: 'Claims Processed', value: '3,429', trend: '+8%' },
                                { label: 'Premium Collected', value: '$2.4M', trend: '+15%' },
                                { label: 'Avg Response Time', value: '1.2h', trend: '-20%' }
                            ].map((metric, idx) => (
                                <div key={idx} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                                    <div className="text-blue-200 text-xs mb-1">{metric.label}</div>
                                    <div className="text-white text-2xl font-bold mb-1">{metric.value}</div>
                                    <div className="text-green-400 text-xs">{metric.trend}</div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <div className="h-48 flex items-end justify-between space-x-2">
                                {[65, 78, 82, 72, 88, 95, 85, 90, 78, 92, 88, 96].map((height, idx) => (
                                    <div key={idx} className="flex-1 bg-gradient-to-t from-indigo-500 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-indigo-400 hover:to-blue-300" style={{ height: `${height}%` }}></div>
                                ))}
                            </div>
                            <div className="mt-4 text-center text-blue-200 text-sm">Policy Issuance Trend (Last 12 Months)</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact / Get Started Section */}
            <section id="contact" className="py-24 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 text-white relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Ready to Transform Your Insurance Operations?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Join leading insurance providers who trust our platform for their digital transformation
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
                        {/* Request Demo Card */}
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                            <h3 className="text-2xl font-bold mb-4">Request a Demo</h3>
                            <p className="text-blue-100 mb-6">
                                See our platform in action with a personalized demonstration tailored to your needs
                            </p>
                            <button className="w-full px-6 py-4 bg-white text-indigo-600 font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300">
                                Schedule Demo
                            </button>
                        </div>

                        {/* Login Portal Card */}
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                            <h3 className="text-2xl font-bold mb-4">Login to Portal</h3>
                            <p className="text-blue-100 mb-6">
                                Access your dashboard to manage policies, track claims, and view analytics
                            </p>
                            <Link href="/login" className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300">
                                Access Portal
                            </Link>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {[
                            { icon: '📧', title: 'Email', value: 'contact@zoomembed.com' },
                            { icon: '📞', title: 'Phone', value: '+1 (555) 123-4567' },
                            { icon: '📍', title: 'Location', value: 'San Francisco, CA' }
                        ].map((contact, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-4xl mb-2">{contact.icon}</div>
                                <div className="text-sm text-blue-200 mb-1">{contact.title}</div>
                                <div className="font-semibold">{contact.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-gray-300 border-t-4 border-indigo-600">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        {/* Company Info */}
                        <div className="md:col-span-2">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <span className="text-2xl font-bold text-white">                                <img src="/assets/images/Zoom%20Embed%20logo-01.png" alt="Zoom Embed" className="inline-block h-6 object-contain" />
                                </span>
                            </div>
                            <p className="text-gray-400 mb-4 max-w-md">
                                Leading the future of insurance technology with innovative solutions for policy management, claims processing, and analytics.
                            </p>
                            <div className="flex space-x-4">
                                {['facebook', 'twitter', 'linkedin', 'github'].map((social) => (
                                    <button key={social} className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors duration-200">
                                        <span className="text-sm">{social[0].toUpperCase()}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                {['Platform', 'Roles', 'Claims', 'Reports', 'Documentation', 'API Reference'].map((link) => (
                                    <li key={link}>
                                        <button className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                                            {link}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2">
                                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Compliance', 'Security', 'Careers'].map((link) => (
                                    <li key={link}>
                                        <button className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                                            {link}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-gray-500 text-sm mb-4 md:mb-0">
                                © 2025 zoomEmbed. All rights reserved.
                            </p>
                            <div className="flex space-x-6 text-sm">
                                <button className="text-gray-400 hover:text-indigo-400 transition-colors">Privacy Policy</button>
                                <span className="text-gray-600">|</span>
                                <button className="text-gray-400 hover:text-indigo-400 transition-colors">Terms of Service</button>
                                <span className="text-gray-600">|</span>
                                <button className="text-gray-400 hover:text-indigo-400 transition-colors">Cookie Preferences</button>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
