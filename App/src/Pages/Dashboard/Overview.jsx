import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    getAdsterraStats,
} from "../../redux/slice/adsterraStatsSlice";

// Import country lookup
import lookup from "country-code-lookup";

const Overview = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const {
        data: stats,
        totals,
        countryData,
        countryTotals,
        loading,
    } = useSelector(
        (state) =>
            state.adsterra
    );


    const [chartData, setChartData] =
        useState([]);

    const [ctrData, setCtrData] =
        useState([]);

    const [countries, setCountries] =
        useState([]);

    const [sections, setSections] =
        useState([]);

    // =====================================
    // FETCH DATA
    // =====================================

    useEffect(() => {

        dispatch(
            getAdsterraStats()
        );
    }, [dispatch]);

    // =====================================
    // PROCESS DATA
    // =====================================

    useEffect(() => {
        // =====================================
        // EMPTY DATA HANDLING
        // =====================================

        if (
            !stats ||
            stats.length === 0
        ) {
            // ✅ LAST 7 DAYS WITH ZERO VALUES
            const last7Days = [];

            for (
                let i = 6;
                i >= 0;
                i--
            ) {
                const d = new Date();

                d.setDate(
                    d.getDate() - i
                );

                last7Days.push({
                    date:
                        d.toLocaleDateString(),
                    impressions: 0,
                    clicks: 0,
                    ctr: 0,
                });
            }

            setChartData(
                last7Days
            );

            setCtrData(
                last7Days
            );

            setCountries([]);

            setSections([
                {
                    date: "Today",
                    title:
                        "Dashboard Performance",
                    content: [
                        "Impressions: 0",
                        "Clicks: 0",
                        "Revenue: $0.00",
                        "No activity found",
                    ],
                },
            ]);

            return;
        }

        // =====================================
        // COUNTRY DATA
        // =====================================

        const countryMap = {};

        (countryData?.length
            ? countryData
            : stats
        ).forEach((item) => {

            // ✅ IGNORE INVALID
            if (
                !item.country ||
                item.country === "ALL" ||
                item.country === "Unknown"
            ) {
                return;
            }

            // ✅ COUNTRY CODE → NAME
            const countryName =
                lookup.byIso(
                    item.country
                )?.country ||
                item.country;

            if (
                !countryMap[
                countryName
                ]
            ) {

                countryMap[
                    countryName
                ] = {
                    impressions: 0,
                    revenue: 0,
                    clicks: 0,
                };
            }

            countryMap[
                countryName
            ].impressions += Number(
                item.impressions || 0
            );

            countryMap[
                countryName
            ].revenue += Number(
                item.revenue || 0
            );

            countryMap[
                countryName
            ].clicks += Number(
                item.clicks || 0
            );
        });

        // ✅ CALCULATE CPM
        const topCountries =
            Object.entries(
                countryMap
            )
                .map(
                    ([
                        country,
                        values,
                    ]) => {

                        const cpm =
                            values.impressions >
                                0
                                ? (
                                    (values.revenue /
                                        values.impressions) *
                                    1000
                                )
                                : 0;

                        const ctr =
                            values.impressions >
                                0
                                ? (
                                    (values.clicks /
                                        values.impressions) *
                                    100
                                )
                                : 0;

                        return {
                            name: country,

                            cpm,

                            ctr,

                            revenue:
                                values.revenue,

                            impressions:
                                values.impressions,
                        };
                    }
                )

                // ✅ SORT BY CPM
                .sort(
                    (a, b) =>
                        b.cpm - a.cpm
                )

                // ✅ TOP 5
                .slice(0, 5)

                .map((item) => ({
                    name: item.name,

                    value: `CPM ${item.cpm.toFixed(
                        3
                    )}`,

                    revenue: item.revenue,

                    impressions:
                        item.impressions,

                    ctr: item.ctr,
                }));

        setCountries(
            topCountries
        );
        // =====================================
        // LAST 7 DAYS
        // =====================================

        const last7Map = {};

        for (
            let i = 6;
            i >= 0;
            i--
        ) {
            const d = new Date();

            d.setDate(
                d.getDate() - i
            );

            const key =
                d
                    .toISOString()
                    .split("T")[0];

            last7Map[key] = {
                date:
                    d.toLocaleDateString(),
                impressions: 0,
                clicks: 0,
                ctr: 0,
            };
        }

        // =====================================
        // ADD API DATA
        // =====================================

        stats.forEach((item) => {
            const dateKey =
                item.date
                    ? item.date.split(
                        "T"
                    )[0]
                    : null;

            if (
                !dateKey ||
                !last7Map[dateKey]
            )
                return;

            last7Map[
                dateKey
            ].impressions += Number(
                item.impressions || 0
            );

            last7Map[
                dateKey
            ].clicks += Number(
                item.clicks || 0
            );
        });

        // =====================================
        // CALCULATE CTR
        // =====================================

        const finalChartData =
            Object.values(
                last7Map
            ).map((item) => ({
                ...item,
                ctr:
                    item.impressions >
                        0
                        ? (item.clicks /
                            item.impressions) *
                        100
                        : 0,
            }));

        setChartData(
            finalChartData
        );

        setCtrData(
            finalChartData
        );

        // =====================================
        // TIMELINE
        // =====================================

        setSections([
            {
                date: "Today",

                title:
                    "Dashboard Performance",

                content: [
                    `Impressions: ${totals?.totalImpressions ||
                    0
                    }`,

                    `Clicks: ${totals?.totalClicks ||
                    0
                    }`,

                    `Revenue: $${(
                        totals?.totalRevenue ||
                        0
                    ).toFixed(2)
                    }`,

                    "Tracking active",
                ],
            },

            {
                date:
                    "Last 7 Days",

                title:
                    "Campaign Performance",

                content: [
                    `Countries targeted: ${Object.keys(
                        countryMap
                    ).length
                    }`,

                    `Top performer: ${topCountries[0]
                        ?.name ||
                    "N/A"
                    }`,

                    "Performance optimized",
                ],
            },
        ]);
    }, [stats, totals]);

    // =====================================
    // MAX VALUES
    // =====================================

    const maxImpression =
        useMemo(() => {
            return (
                Math.max(
                    ...chartData.map(
                        (d) =>
                            d.impressions
                    ),
                    1
                ) || 1
            );
        }, [chartData]);

    const maxCtr =
        useMemo(() => {
            return (
                Math.max(
                    ...ctrData.map(
                        (d) => d.ctr
                    ),
                    1
                ) || 1
            );
        }, [ctrData]);

    return (
        <div className="sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8 lg:space-y-10 max-w-full overflow-x-hidden">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                    Adstorx Dashboard
                </h1>

                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2">
                    Monitor your ads performance & earnings 🚀
                </p>
            </div>

            {/* STATS CARDS - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                    title="Status"
                    value="Active"
                />

                <StatCard
                    title="Impressions"
                    value={(totals?.totalImpressions || 0).toLocaleString()}
                />

                <StatCard
                    title="Clicks"
                    value={(totals?.totalClicks || 0).toLocaleString()}
                />

                <StatCard
                    title="Revenue"
                    value={`$${(totals?.totalRevenue || 0).toFixed(2)}`}
                    glow
                />
            </div>

            {/* CHARTS SECTION */}
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                {/* IMPRESSION GRAPH - Takes full width on mobile, 2/3 on desktop */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl border dark:border-slate-700">
                    <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-white">
                        Impressions Trend (Last 7 Days)
                    </h3>

                    {/* Responsive Chart Container */}
                    <div className="w-full overflow-x-auto">
                        <div className="flex items-end justify-between gap-2 sm:gap-3 h-48 sm:h-56 md:h-64 min-w-[320px]">
                            {chartData.map(
                                (
                                    item,
                                    index
                                ) => {
                                    const height =
                                        item.impressions > 0
                                            ? (item.impressions / maxImpression) * 100
                                            : 4;

                                    return (
                                        <div
                                            key={index}
                                            className="flex flex-col items-center justify-end h-full flex-1"
                                        >
                                            <div
                                                title={`${item.impressions.toLocaleString()} impressions`}
                                                className="w-full rounded-t-xl bg-gradient-to-t from-indigo-500 to-purple-500 transition-all duration-500 cursor-pointer hover:opacity-80"
                                                style={{
                                                    height: `${height}%`,
                                                    minHeight: "8px",
                                                }}
                                            />
                                            <span className="text-[8px] sm:text-[10px] mt-1 sm:mt-2 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                                {item.date.split('/').slice(0, 2).join('/')}
                                            </span>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>

                    {/* Chart Legend */}
                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-slate-700">
                        <div className="flex justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                                <span>Impressions</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTR Graph - Hidden on mobile, visible on desktop (optional) */}
                <div className="hidden lg:block bg-white dark:bg-slate-800 p-6 rounded-2xl border dark:border-slate-700">
                    <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
                        CTR Trend
                    </h3>
                    <div className="flex items-end justify-between gap-3 h-64">
                        {ctrData.map(
                            (
                                item,
                                index
                            ) => {
                                const height =
                                    item.ctr > 0
                                        ? (item.ctr / maxCtr) * 100
                                        : 4;
                                return (
                                    <div
                                        key={index}
                                        className="flex flex-col items-center justify-end h-full flex-1"
                                    >
                                        <div
                                            title={`${item.ctr.toFixed(2)}% CTR`}
                                            className="w-full rounded-t-xl bg-gradient-to-t from-emerald-500 to-teal-500 transition-all duration-500"
                                            style={{
                                                height: `${height}%`,
                                                minHeight: "10px",
                                            }}
                                        />
                                        <span className="text-[10px] mt-2 text-gray-500 dark:text-gray-400">
                                            {item.date.split('/')[0]}
                                        </span>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>
            </div>

            {/* BOTTOM SECTION */}
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                {/* TIMELINE - Takes 2/3 on desktop */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    {sections.map(
                        (
                            section,
                            index
                        ) => (
                            <div
                                key={index}
                                className="relative pl-6 sm:pl-10 p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700"
                            >
                                <div className="absolute left-0 top-5 sm:top-6 w-3 h-3 sm:w-4 sm:h-4 bg-indigo-500 rounded-full"></div>

                                <p className="text-[10px] sm:text-xs text-gray-400 mb-1 sm:mb-2">
                                    {section.date}
                                </p>

                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                                    {section.title}
                                </h3>

                                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    {section.content.map(
                                        (
                                            item,
                                            i
                                        ) => (
                                            <li
                                                key={i}
                                                className="flex items-start gap-2"
                                            >
                                                <span className="text-indigo-500">•</span>
                                                <span>{item}</span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        )
                    )}
                </div>

                {/* COUNTRIES - Takes 1/3 on desktop */}
                <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl border dark:border-slate-700">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
                        Top Countries by CPM
                    </h3>

                    <div className="space-y-3 sm:space-y-4">
                        {countries.length > 0 ? (
                            countries.map(
                                (
                                    c,
                                    i
                                ) => (
                                    <div
                                        key={i}
                                        className="flex justify-between items-center text-xs sm:text-sm py-2 border-b border-gray-100 dark:border-slate-700 last:border-0"
                                    >
                                        <span className="text-gray-600 dark:text-gray-400 truncate max-w-[60%]">
                                            {c.name}
                                        </span>
                                        <span className="font-semibold text-gray-900 dark:text-white bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-full text-[10px] sm:text-xs">
                                            {c.value}
                                        </span>
                                    </div>
                                )
                            )
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-400 text-sm">
                                    No country data available
                                </p>
                                <p className="text-gray-500 text-xs mt-2">
                                    Add placements to see country-wise performance
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Mobile View Tip */}
                    {countries.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-slate-700">
                            <p className="text-[10px] text-gray-400 text-center">
                                Top 5 countries by CPM
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm shadow-lg animate-pulse">
                    Loading data...
                </div>
            )}
        </div>
    );
};

/* =====================================
STAT CARD - Responsive
===================================== */

const StatCard = ({
    title,
    value,
    glow,
}) => (
    <div
        className={`p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-800 border dark:border-slate-700 transition-all hover:shadow-md ${glow
            ? "shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/20"
            : ""
            }`}
    >
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {title}
        </p>

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mt-1 sm:mt-2 break-words">
            {value}
        </h2>
    </div>
);

export default Overview;