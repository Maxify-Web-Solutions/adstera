import React, { useEffect, useState } from "react";

const StatItem = ({ end, label, suffix = "" }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 2000;
        const increment = end / (duration / 16);

        const counter = setInterval(() => {
            start += increment;
            if (start >= end) {
                start = end;
                clearInterval(counter);
            }
            setCount(Math.floor(start));
        }, 16);

        return () => clearInterval(counter);
    }, [end]);

    return (
        <div className="bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl p-6 text-center hover:border-indigo-500/40 transition">
            <div className="text-3xl md:text-4xl font-bold text-indigo-400">
                {count}
                {suffix}
            </div>

            <p className="text-gray-600 dark:text-slate-400 mt-2 text-sm md:text-base">
                {label}
            </p>
        </div>
    );
};

const PlatformStats = () => {
    const stats = [
        { end: 50, suffix: "M+", label: "Daily Ad Impressions" },
        { end: 12000, suffix: "+", label: "Active Advertisers" },
        { end: 8000, suffix: "+", label: "Publishers Worldwide" },
        { end: 120, suffix: "+", label: "Countries Reached" },
    ];

    return (
        <section className="bg-white dark:bg-slate-900 text-gray-800 dark:text-white py-16 md:py-20 relative transition-colors duration-300">

            {/* background glow */}
            <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 bg-indigo-500/10 blur-3xl rounded-full"></div>

            <div className="max-w-6xl mx-auto px-6 relative">

                {/* heading */}
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
                        Powering Advertising at
                        <span className="block bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            Massive Scale
                        </span>
                    </h2>

                    <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                        Our network connects advertisers and publishers worldwide with high-quality traffic.
                    </p>
                </div>

                {/* stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <StatItem
                            key={index}
                            end={stat.end}
                            suffix={stat.suffix}
                            label={stat.label}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default PlatformStats;