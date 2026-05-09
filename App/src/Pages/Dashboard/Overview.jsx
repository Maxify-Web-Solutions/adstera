import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdsterraStats, getAdsterraStats } from "../../redux/slice/adsterraStatsSlice";

const Overview = () => {
    const dispatch = useDispatch();
    const { data: stats, totals, loading } = useSelector((state) => state.adsterra);
    const [chartData, setChartData] = useState([]);
    const [ctrData, setCtrData] = useState([]);
    const [countries, setCountries] = useState([]);
    const [sections, setSections] = useState([]);

    /* 📊 Fetch stats on component mount */
    useEffect(() => {
        dispatch(fetchAdsterraStats());
        dispatch(getAdsterraStats());
    }, [dispatch]);

    /* 📈 Process data for charts and countries */
    useEffect(() => {
        if (stats && stats.length > 0) {
            // Group by country for top countries
            const countryMap = {};
            stats.forEach((item) => {
                if (!countryMap[item.country]) {
                    countryMap[item.country] = 0;
                }
                countryMap[item.country] += parseFloat(item.revenue || 0);
            });

            // Get top 4 countries by revenue
            const topCountries = Object.entries(countryMap)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 4)
                .map(([country, revenue]) => ({
                    name: country || "Unknown",
                    value: `$${revenue.toFixed(2)}`,
                }));

            setCountries(topCountries.length > 0 ? topCountries : []);

            // Group by date for chart data (last 7 days impressions)
            const dateMap = {};
            stats.forEach((item) => {
                const date = item.date ? item.date.split("T")[0] : new Date().toISOString().split("T")[0];
                if (!dateMap[date]) {
                    dateMap[date] = { impressions: 0, clicks: 0 };
                }
                dateMap[date].impressions += parseFloat(item.impressions || 0);
                dateMap[date].clicks += parseFloat(item.clicks || 0);
            });

            const sortedDates = Object.keys(dateMap).sort().slice(-7);
            const impressionsData = sortedDates.map((date) => {
                const max = Math.max(
                    ...Object.values(dateMap).map((d) => d.impressions)
                );
                return (dateMap[date].impressions / (max || 1)) * 100;
            });
            const ctrDataValues = sortedDates.map((date) => {
                const { impressions, clicks } = dateMap[date];
                return impressions > 0 ? ((clicks / impressions) * 100) : 0;
            });

            setChartData(impressionsData.length > 0 ? impressionsData : [40, 60, 55, 80, 120, 90, 140]);
            setCtrData(ctrDataValues.length > 0 ? ctrDataValues : [2, 3, 2.5, 4, 3.2, 4.5, 5]);

            // Create timeline sections
            const timelineSections = [
                {
                    date: "Today",
                    title: "Dashboard Performance",
                    content: [
                        `Impressions: ${totals.totalImpressions || 0}`,
                        `Clicks: ${totals.totalClicks || 0}`,
                        `Revenue: $${(totals.totalRevenue || 0).toFixed(2)}`,
                        "Tracking active",
                    ],
                },
                {
                    date: "Last 7 Days",
                    title: "Campaign Performance",
                    content: [
                        `Countries targeted: ${Object.keys(countryMap).length}`,
                        `Top performer: ${topCountries[0]?.name || "N/A"}`,
                        "Data updated automatically",
                    ],
                },
                {
                    date: "Account Status",
                    title: "Active Monitoring",
                    content: [
                        "Real-time tracking enabled",
                        "All metrics up to date",
                        "Performance optimized",
                    ],
                },
            ];
            setSections(timelineSections);
        }
    }, [stats, totals]);

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
                <StatCard title="Impressions" value={`${totals.totalImpressions ? totals.totalImpressions.toLocaleString() : "0"}`} />
                <StatCard title="Clicks" value={`${totals.totalClicks ? totals.totalClicks.toLocaleString() : "0"}`} />
                <StatCard title="Revenue" value={`$${totals.totalRevenue ? totals.totalRevenue.toFixed(2) : "0.00"}`} glow />
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* Main Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border dark:border-slate-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        Impressions vs Revenue (Last 7 Days)
                    </h3>

                    <div className="flex items-end gap-2 h-40">
                        {chartData.length > 0 ? (
                            chartData.map((val, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-gradient-to-t from-indigo-500 to-purple-500 rounded"
                                    style={{ height: `${Math.max(val, 5)}%` }}
                                    title={`Day ${i + 1}: ${val.toFixed(0)}%`}
                                ></div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm">Loading chart data...</p>
                        )}
                    </div>
                </div>

                {/* CTR Graph */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border dark:border-slate-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        CTR Trend (%)
                    </h3>

                    <div className="flex items-end gap-2 h-40">
                        {ctrData.length > 0 ? (
                            ctrData.map((val, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-green-500 rounded"
                                    style={{ height: `${Math.min(val * 15, 100)}%` }}
                                    title={`Day ${i + 1}: ${val.toFixed(2)}%`}
                                ></div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm">Loading CTR data...</p>
                        )}
                    </div>
                </div>

            </div>

            {/* Bottom Section */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    {sections.length > 0 ? (
                        sections.map((section, index) => (
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
                        ))
                    ) : (
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700">
                            <p className="text-gray-400 text-center">No data available yet</p>
                        </div>
                    )}
                </div>

                {/* Country Earnings */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border dark:border-slate-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        Top Countries
                    </h3>

                    <div className="space-y-4">
                        {countries.length > 0 ? (
                            countries.map((c, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {c.name}
                                    </span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {c.value}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm text-center">No country data available</p>
                        )}
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