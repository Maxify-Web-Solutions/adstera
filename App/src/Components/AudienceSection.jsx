import React from "react";
import { FiTrendingUp, FiDollarSign, FiTarget, FiGlobe } from "react-icons/fi";

const AudienceSection = () => {
    const advertisers = [
        { icon: <FiTarget />, text: "Advanced audience targeting" },
        { icon: <FiTrendingUp />, text: "Real-time campaign analytics" },
    ];

    const publishers = [
        { icon: <FiDollarSign />, text: "High revenue monetization" },
        { icon: <FiGlobe />, text: "Global advertiser demand" },
    ];

    return (
        <section className="bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-white py-20 relative transition-colors duration-300">

            {/* glow background */}
            <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-cyan-500/10 blur-3xl rounded-full"></div>

            <div className="max-w-7xl mx-auto px-6 relative">

                {/* heading */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                        Built for
                        <span className="block bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            Advertisers & Publishers
                        </span>
                    </h2>

                    <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        Whether you want to grow your traffic or monetize your audience,
                        our platform provides the tools you need to succeed.
                    </p>
                </div>

                {/* cards */}
                <div className="grid md:grid-cols-2 gap-10">

                    {/* advertisers */}
                    <div className="bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl p-8 hover:border-indigo-500/50 transition shadow-sm">
                        <h3 className="text-2xl font-bold text-indigo-400 mb-6">
                            For Advertisers
                        </h3>

                        <ul className="space-y-4">
                            {advertisers.map((item, index) => (
                                <li key={index} className="flex items-center gap-3 text-gray-600 dark:text-slate-300">
                                    <span className="text-indigo-400 text-lg">{item.icon}</span>
                                    {item.text}
                                </li>
                            ))}
                        </ul>

                        <button className="mt-8 px-6 py-3 bg-indigo-600 rounded-lg font-semibold hover:bg-indigo-700 transition">
                            Start Advertising
                        </button>
                    </div>

                    {/* publishers */}
                    <div className="bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl p-8 hover:border-cyan-500/50 transition shadow-sm">
                        <h3 className="text-2xl font-bold text-cyan-400 mb-6">
                            For Publishers
                        </h3>

                        <ul className="space-y-4">
                            {publishers.map((item, index) => (
                                <li key={index} className="flex items-center gap-3 text-gray-600 dark:text-slate-300">
                                    <span className="text-cyan-400 text-lg">{item.icon}</span>
                                    {item.text}
                                </li>
                            ))}
                        </ul>

                        <button className="mt-8 px-6 py-3 bg-cyan-600 rounded-lg font-semibold hover:bg-cyan-700 transition">
                            Start Monetizing
                        </button>
                    </div>

                </div>

            </div>
        </section>
    );
};

export default AudienceSection;