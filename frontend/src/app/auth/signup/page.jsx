'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const SignupPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        role: 'student', // Default role
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Connect to backend registration API
        console.log('Registering User:', formData);
    };

    return (
        <div className="min-h-screen flex bg-white w-fit mx-auto text-center">

            {/* LEFT SIDE: Form Section */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-[480px]">
                <div className="mx-auto w-full max-w-sm lg:w-96">

                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-8 justify-center">
                        <span className="material-symbols-outlined text-indigo-600 text-4xl">hub</span>
                        <span className="text-2xl font-bold text-gray-900 tracking-tight">CampNexus</span>
                    </div>

                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900">Create an account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Join your campus community today.
                        </p>
                    </div>

                    <div className="mt-8">
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Full Name */}
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-gray-400 text-[20px]">badge</span>
                                    </div>
                                    <input
                                        type="text"
                                        name="fullName"
                                        id="fullName"
                                        required
                                        className="block w-full pl-10 border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 py-3 px-4 border"
                                        placeholder="John Doe"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    University Email
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-gray-400 text-[20px]">mail</span>
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        required
                                        className="block w-full pl-10 border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 py-3 px-4 border"
                                        placeholder="student@university.edu"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Role Selection (Crucial for RBAC) */}
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                    I am a...
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-gray-400 text-[20px]">school</span>
                                    </div>
                                    <select
                                        id="role"
                                        name="role"
                                        className="block w-full pl-10 border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 py-3 px-4 border bg-white"
                                        onChange={handleChange}
                                        value={formData.role}
                                    >
                                        <option value="student">Student</option>
                                        <option value="professor">Professor / Faculty</option>
                                        <option value="club_head">Club Head</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    {/* Custom Arrow Icon */}
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-gray-400">arrow_drop_down</span>
                                    </div>
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-gray-400 text-[20px]">lock</span>
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        id="password"
                                        required
                                        className="block w-full pl-10 pr-10 border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 py-3 px-4 border"
                                        placeholder="••••••••"
                                        onChange={handleChange}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">
                                                {showPassword ? 'visibility_off' : 'visibility'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                <p className="mt-2 text-xs text-gray-500">
                                    Must be at least 8 characters.
                                </p>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                    Create Account
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;