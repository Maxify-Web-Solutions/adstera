import React, { useEffect, useState } from "react";

/* Timeline Data */
const sections = [
    {
        date: "Today",
        title: "Welcome to Adstorx",
        content: [
            "Choose traffic type",
            "Add website & verify",
            "Create ad unit",
            "Start monetizing",
        ],
    },
    {
        date: "Yesterday",
        title: "Ad Unit Created",
        content: [
            "Banner & Popunder ready",
            "Ad code generated",
        ],
    },
    {
        date: "2 Days Ago",
        title: "Traffic Started",
        content: [
            "Ads live on website",
            "Tracking impressions & clicks",
        ],
    },
];

/* Fake Chart Data */
const chartData = [40, 60, 55, 80, 120, 90, 140];
const ctrData = [2, 3, 2.5, 4, 3.2, 4.5, 5];

/* Countries */
const countries = [
    { name: "USA", value: "$540" },
    { name: "India", value: "$320" },
    { name: "UK", value: "$210" },
    { name: "Canada", value: "$175" },
];

const Overview = () => {
    const [revenue, setRevenue] = useState(1245);

    /* 🔥 Live Counter */
    useEffect(() => {
        const interval = setInterval(() => {
            setRevenue((prev) => prev + Math.random() * 2);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-10">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Adstorx Dashboard
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Monitor your ads performance & earnings 🚀
                </p>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Status" value="Active" />
                <StatCard title="Impressions" value="124,580" />
                <StatCard title="Clicks" value="8,942" />
                <StatCard title="Revenue" value={`$${revenue.toFixed(2)}`} glow />
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* Main Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border dark:border-slate-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        Impressions vs Revenue
                    </h3>

                    <div className="flex items-end gap-2 h-40">
                        {chartData.map((val, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-gradient-to-t from-indigo-500 to-purple-500 rounded"
                                style={{ height: `${val}%` }}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* CTR Graph */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border dark:border-slate-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        CTR Trend
                    </h3>

                    <div className="flex items-end gap-2 h-40">
                        {ctrData.map((val, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-green-500 rounded"
                                style={{ height: `${val * 15}%` }}
                            ></div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Bottom Section */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    {sections.map((section, index) => (
                        <div
                            key={index}
                            className="relative pl-10 p-6 bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700"
                        >
                            <div className="absolute left-0 top-6 w-4 h-4 bg-indigo-500 rounded-full"></div>

                            {index !== sections.length - 1 && (
                                <div className="absolute left-2 top-10 w-[2px] h-full bg-gray-300 dark:bg-slate-600"></div>
                            )}

                            <p className="text-xs text-gray-400 mb-2">{section.date}</p>

                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                {section.title}
                            </h3>

                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                {section.content.map((item, i) => (
                                    <li key={i}>• {item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Country Earnings */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border dark:border-slate-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        Top Countries
                    </h3>

                    <div className="space-y-4">
                        {countries.map((c, i) => (
                            <div key={i} className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">
                                    {c.name}
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {c.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
};

/* Reusable Stat Card */
const StatCard = ({ title, value, glow }) => (
    <div className={`p-6 rounded-2xl bg-white dark:bg-slate-800 border dark:border-slate-700 ${glow ? "shadow-lg shadow-indigo-500/20" : ""}`}>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
        </h2>
    </div>
);

export default Overview;