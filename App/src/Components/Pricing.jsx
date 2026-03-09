import React from 'react';
import { FiArrowRight } from 'react-icons/fi';

const Cta = () => {
    return (
        <section className="bg-slate-900 text-white relative py-16 md:py-20">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 blur-3xl"></div>

            <div className="max-w-4xl mx-auto px-6 relative text-center">
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                    Ready to Elevate Your
                    <span className="block bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        Advertising Game?
                    </span>
                </h2>
                <p className="mt-6 text-gray-400 text-lg max-w-2xl mx-auto">
                    Join Adstera today and unlock a world of premium traffic, advanced targeting, and powerful monetization tools. Let's grow together.
                </p>

                <div className="flex flex-wrap justify-center gap-4 mt-10">
                    <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20">
                        Buy Traffic
                        <FiArrowRight />
                    </button>

                    <button className="flex items-center gap-2 px-6 py-3 border border-slate-600 rounded-lg font-semibold hover:bg-slate-800 transition">
                        Start Earning
                        <FiArrowRight />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Cta;