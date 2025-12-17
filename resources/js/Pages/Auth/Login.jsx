import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login() {
    const form = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('login'), {
            onFinish: () => form.reset('password'),
        });
    };

    return (
        <>
            <Head title="Login - zoom embed" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
                <div className="max-w-6xl w-full bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                    
                    {/* Left: Login Form */}
                    <div className="p-10 md:p-12">
                        <div className="flex items-center gap-3">
                            <img src="/assets/images/Zoom%20Embed%20logo-01.png" alt="Zoom Embed" className="w-30 h-10 object-contain" />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            Sign in to access your zoom embed portal.
                        </p>

                        <form onSubmit={submit} className="space-y-4 mt-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={form.data.email}
                                    onChange={(e) =>
                                        form.setData('email', e.target.value)
                                    }
                                    required
                                    className="mt-2 w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-300"
                                />
                                {form.errors.email && (
                                    <div className="text-sm text-red-600 mt-1">
                                        {form.errors.email}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={form.data.password}
                                    onChange={(e) =>
                                        form.setData('password', e.target.value)
                                    }
                                    required
                                    className="mt-2 w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-300"
                                />
                                {form.errors.password && (
                                    <div className="text-sm text-red-600 mt-1">
                                        {form.errors.password}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center text-sm">
                                    <input
                                        type="checkbox"
                                        checked={form.data.remember}
                                        onChange={(e) =>
                                            form.setData(
                                                'remember',
                                                e.target.checked
                                            )
                                        }
                                        className="mr-2"
                                    />
                                    Remember me
                                </label>

                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-indigo-600 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={form.processing}
                                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full font-semibold hover:shadow-lg transition"
                            >
                                Sign in
                            </button>
                        </form>
                    </div>

                    {/* Right: Visual */}
                    <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-600">
                        <div className="text-white text-center px-10">
                            <h3 className="text-2xl font-semibold">
                                Insurance. Simplified.
                            </h3>
                            <p className="mt-3 text-white/80">
                                Manage policies, claims, and reports in one
                                unified platform.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
