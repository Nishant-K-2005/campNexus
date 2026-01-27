import React from 'react'
import Link from 'next/link'

function Hero() {
    return (
        <section className="relative bg-white overflow-hidden">
            {/* Background decorative blob - Optional for minimalism, remove if too busy */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 blur-3xl opacity-20 pointer-events-none">
                <div className="aspect-square h-[600px] rounded-full bg-gradient-to-tr from-indigo-600 to-purple-400" />
            </div>

            <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-32 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Column: Text Content */}
                    <div className="flex flex-col space-y-8 text-center lg:text-left animate-fade-in-up">

                        {/* Main Headline */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
                            Discover your academic tribe.
                            <span className="block text-indigo-600">Verified by AI.</span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                            Join focused campus communities, access verified resources, and engage in meaningful discussions. No noise, just learning.
                        </p>

                        {/* Buttons / CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start font-medium">
                            <Link
                                href="/auth/login"
                                className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200/50"
                            >
                                Login
                            </Link>
                            <Link
                                href="/auth/signup"
                                className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                            >
                                Signup
                            </Link>
                        </div>

                    </div>

                    {/* Right Column: Abstract Visual */}
                    {/* NOTE: For a real app, replace this div with an <Image /> component 
            showing a clean screenshot of your app interface or a relevant illustration.
            Currently, it's a placeholder gradient block keeping with minimalism.
          */}
                    <div className="relative hidden lg:block animate-fade-in">
                        <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm p-8 flex items-center justify-center overflow-hidden relative">
                            {/* Abstract placeholder UI representation */}
                            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]"></div>
                            <div className="relative bg-white shadow-xl rounded-xl border border-gray-200 p-6 w-3/4 h-3/4 transform rotate-3 hover:rotate-0 transition-transform duration-500 ease-out">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="material-symbols-outlined text-indigo-600">terminal</span>
                                    <h3 className="font-bold text-gray-800">Data Science Club</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
                                    <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse"></div>
                                    <div className="h-4 bg-gray-100 rounded w-4/6 animate-pulse"></div>
                                </div>
                                <div className="mt-6 flex gap-2">
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full">#MachineLearning</span>
                                    <span className="px-3 py-1 bg-green-50 text-green-600 text-xs rounded-full animate-pulse">AI Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default Hero
