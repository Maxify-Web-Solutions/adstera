import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const Cta = () => {
    return (
        <section className="relative bg-white dark:bg-slate-900 text-gray-800 dark:text-white py-24 overflow-hidden transition-colors duration-300">

            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 w-[900px] h-[500px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl"></div>

            <div className="relative max-w-5xl mx-auto px-6">

                {/* CTA Container */}
                <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl px-8 md:px-14 py-16 text-center shadow-xl">

                    {/* Heading */}
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 dark:text-white">
                        Ready to Elevate Your
                        <span className="block mt-2 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            Advertising Game?
                        </span>
                    </h2>

                    {/* Description */}
                    <p className="mt-6 text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Join Adstorx today and unlock premium traffic, powerful targeting,
                        and monetization tools built to scale your campaigns faster.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-wrap justify-center gap-5 mt-10">

                        {/* Primary Button */}
                        <button className="group flex items-center gap-2 px-7 py-3 bg-indigo-600 rounded-xl font-semibold transition-all duration-300 hover:bg-indigo-700 hover:scale-105 shadow-lg shadow-indigo-600/30 text-white">
                            Buy Traffic
                            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                        </button>

                        {/* Secondary Button */}
                        <Link to="/register">
                            <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-slate-600 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-slate-800 transition">
                                Start Earning
                                <FiArrowRight />
                            </button>
                        </Link>
                    </div>

                    {/* Small trust note */}
                    <p className="mt-8 text-sm text-gray-400 dark:text-slate-500">
                        Trusted by thousands of advertisers and publishers worldwide.
                    </p>

                </div>
            </div>
        </section>
    );
};

export default Cta;