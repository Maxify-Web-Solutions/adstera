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
    fetchAdsterraStats,
    getAdsterraStats,
} from "../../redux/slice/adsterraStatsSlice";

const Overview = () => {
    const dispatch =
        useDispatch();

    const {
        data: stats,
        totals,
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
            fetchAdsterraStats()
        );

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

stats.forEach((item) => {

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

                        return {
                            name: country,

                            cpm,

                            revenue:
                                values.revenue,
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
                    `Impressions: ${totals.totalImpressions ||
                    0
                    }`,

                    `Clicks: ${totals.totalClicks ||
                    0
                    }`,

                    `Revenue: $${(
                        totals.totalRevenue ||
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
        <div className="space-y-10">
            {/* HEADER */}

            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Adstorx Dashboard
                </h1>

                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Monitor your ads
                    performance &
                    earnings 🚀
                </p>
            </div>

            {/* STATS */}

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Status"
                    value="Active"
                />

                <StatCard
                    title="Impressions"
                    value={(
                        totals.totalImpressions ||
                        0
                    ).toLocaleString()}
                />

                <StatCard
                    title="Clicks"
                    value={(
                        totals.totalClicks ||
                        0
                    ).toLocaleString()}
                />

                <StatCard
                    title="Revenue"
                    value={`$${(
                        totals.totalRevenue ||
                        0
                    ).toFixed(2)}`}
                    glow
                />
            </div>

            {/* CHARTS */}

            <div className="grid lg:grid-cols-3 gap-8">
                {/* IMPRESSION GRAPH */}

                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border dark:border-slate-700">
                    <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
                        Impressions
                        Trend
                    </h3>

                    <div className="flex items-end justify-between gap-3 h-64">
                        {chartData.map(
                            (
                                item,
                                index
                            ) => {
                                const height =
                                    item.impressions >
                                        0
                                        ? (item.impressions /
                                            maxImpression) *
                                        100
                                        : 4;

                                return (
                                    <div
                                        key={index}
                                        className="flex flex-col items-center justify-end h-full flex-1"
                                    >
                                        <div
                                            title={`${item.impressions} impressions`}
                                            className="w-full rounded-t-xl bg-gradient-to-t from-indigo-500 to-purple-500 transition-all duration-500"
                                            style={{
                                                height: `${height}%`,
                                                minHeight:
                                                    "10px",
                                            }}
                                        />

                                        <span className="text-[10px] mt-2 text-gray-500 dark:text-gray-400">
                                            {
                                                item.date
                                            }
                                        </span>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>

                {/* CTR GRAPH */}

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border dark:border-slate-700">
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
                                        ? (item.ctr /
                                            maxCtr) *
                                        100
                                        : 4;

                                return (
                                    <div
                                        key={index}
                                        className="flex flex-col items-center justify-end h-full flex-1"
                                    >
                                        <div
                                            title={`${item.ctr.toFixed(
                                                2
                                            )}% CTR`}
                                            className="w-full rounded-t-xl bg-green-500 transition-all duration-500"
                                            style={{
                                                height: `${height}%`,
                                                minHeight:
                                                    "10px",
                                            }}
                                        />

                                        <span className="text-[10px] mt-2 text-gray-500 dark:text-gray-400">
                                            {
                                                item.date
                                            }
                                        </span>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>
            </div>

            {/* BOTTOM */}

            <div className="grid lg:grid-cols-3 gap-8">
                {/* TIMELINE */}

                <div className="lg:col-span-2 space-y-6">
                    {sections.map(
                        (
                            section,
                            index
                        ) => (
                            <div
                                key={index}
                                className="relative pl-10 p-6 bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700"
                            >
                                <div className="absolute left-0 top-6 w-4 h-4 bg-indigo-500 rounded-full"></div>

                                <p className="text-xs text-gray-400 mb-2">
                                    {
                                        section.date
                                    }
                                </p>

                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                    {
                                        section.title
                                    }
                                </h3>

                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    {section.content.map(
                                        (
                                            item,
                                            i
                                        ) => (
                                            <li
                                                key={i}
                                            >
                                                • {item}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        )
                    )}
                </div>

                {/* COUNTRIES */}

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border dark:border-slate-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        Top Countries
                    </h3>

                    <div className="space-y-4">
                        {countries.length >
                            0 ? (
                            countries.map(
                                (
                                    c,
                                    i
                                ) => (
                                    <div
                                        key={i}
                                        className="flex justify-between text-sm"
                                    >
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {
                                                c.name
                                            }
                                        </span>

                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {
                                                c.value
                                            }
                                        </span>
                                    </div>
                                )
                            )
                        ) : (
                            <p className="text-gray-400 text-sm text-center">
                                No country
                                data
                                available
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* =====================================
STAT CARD
===================================== */

const StatCard = ({
    title,
    value,
    glow,
}) => (
    <div
        className={`p-6 rounded-2xl bg-white dark:bg-slate-800 border dark:border-slate-700 ${glow
            ? "shadow-lg shadow-indigo-500/20"
            : ""
            }`}
    >
        <p className="text-sm text-gray-500 dark:text-gray-400">
            {title}
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
        </h2>
    </div>
);

export default Overview;