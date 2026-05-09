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
    getSmartLinkStats,
    setFilters,
    resetFilters,
} from "../../../redux/slice/smartlinkFilterSlice";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import { getNames } from "country-list";
import lookup from "country-code-lookup";

const SmartlinkStatistics = () => {
    const dispatch = useDispatch();

    // =========================================
    // REDUX STATE
    // =========================================

    const {
        loading,
        error,
        data,
        totals,
        filters,
    } = useSelector(
        (state) =>
            state.smartlinkFilter
    );

    // =========================================
    // DATE
    // =========================================

    const today = new Date();

    const sevenDaysAgo =
        new Date();

    sevenDaysAgo.setDate(
        today.getDate() - 7
    );

    const [dateRange, setDateRange] =
        useState([
            sevenDaysAgo,
            today,
        ]);

    const [startDate, endDate] =
        dateRange;

    // =========================================
    // FILTERS
    // =========================================

    const countries = getNames();

    const [
        selectedCountry,
        setSelectedCountry,
    ] = useState("");

    const [placement, setPlacement] =
        useState("");

    // =========================================
    // GROUP BY
    // =========================================

    const [groupBy, setGroupBy] =
        useState("country");

    // =========================================
    // COUNTRY ISO
    // =========================================

    const countryCode = useMemo(() => {
        if (!selectedCountry)
            return "ALL";

        const country =
            lookup.byCountry(
                selectedCountry
            );

        return (
            country?.iso2 || "ALL"
        );
    }, [selectedCountry]);

    // =========================================
    // INITIAL LOAD
    // =========================================

    useEffect(() => {
        dispatch(
            getSmartLinkStats({
                country: "ALL",
            })
        );
    }, [dispatch]);

    // =========================================
    // APPLY FILTER
    // =========================================

    const handleApply = () => {
        const payload = {
            start_date:
                startDate
                    ?.toISOString()
                    .split("T")[0],

            end_date:
                endDate
                    ?.toISOString()
                    .split("T")[0],

            placement,

            country: countryCode,
        };

        dispatch(
            setFilters(payload)
        );

        dispatch(
            getSmartLinkStats(
                payload
            )
        );
    };

    // =========================================
    // RESET FILTER
    // =========================================

    const handleReset = () => {
        setSelectedCountry("");
        setPlacement("");

        setDateRange([
            sevenDaysAgo,
            today,
        ]);

        dispatch(
            resetFilters()
        );

        dispatch(
            getSmartLinkStats({
                country: "ALL",
            })
        );
    };

    // =========================================
    // GROUPED DATA
    // =========================================

    const groupedData = useMemo(() => {
        if (!Array.isArray(data))
            return [];

        return Object.values(
            data.reduce(
                (acc, item) => {
                    let key = "Unknown";

                    switch (groupBy) {
                        case "date":
                            key = item.date
                                ? new Date(
                                    item.date
                                ).toLocaleDateString()
                                : "Unknown";
                            break;

                        case "country":
                            key = item.country
                                ? lookup.byIso(
                                    item.country
                                )?.country ||
                                item.country
                                : "Unknown";
                            break;

                        case "device":
                            key =
                                item.device ||
                                "Unknown";
                            break;

                        case "os":
                            key =
                                item.osName ||
                                "Unknown";
                            break;

                        case "browser":
                            key =
                                item.browserName ||
                                "Unknown";
                            break;

                        default:
                            key = "Unknown";
                    }

                    if (!acc[key]) {
                        acc[key] = {
                            label: key,
                            impressions: 0,
                            clicks: 0,
                            revenue: 0,
                        };
                    }

                    acc[
                        key
                    ].impressions += Number(
                        item.impressions || 0
                    );

                    acc[key].clicks += Number(
                        item.clicks || 0
                    );

                    acc[key].revenue +=
                        Number(
                            item.revenue || 0
                        );

                    return acc;
                },
                {}
            )
        );
    }, [data, groupBy]);

    // =========================================
    // TOTALS
    // =========================================

    const calculatedTotals =
        useMemo(() => {
            return groupedData.reduce(
                (acc, item) => {
                    acc.impressions += Number(
                        item.impressions || 0
                    );

                    acc.clicks += Number(
                        item.clicks || 0
                    );

                    acc.revenue += Number(
                        item.revenue || 0
                    );

                    return acc;
                },
                {
                    impressions: 0,
                    clicks: 0,
                    revenue: 0,
                }
            );
        }, [groupedData]);

    return (
        <div className="w-full space-y-6">
            {/* ========================================= */}
            {/* FILTERS */}
            {/* ========================================= */}

            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 md:p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-6">
                    Smartlink Statistics
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {/* DATE */}
                    <div>
                        <label className="text-sm mb-2 block">
                            Date Range
                        </label>

                        <DatePicker
                            selectsRange
                            startDate={
                                startDate
                            }
                            endDate={endDate}
                            onChange={(update) =>
                                setDateRange(
                                    update
                                )
                            }
                            className="w-full border border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 dark:text-gray-300 outline-none"
                        />
                    </div>

                    {/* COUNTRY */}
                    <div>
                        <label className="text-sm mb-2 block">
                            Country
                        </label>

                        <select
                            value={
                                selectedCountry
                            }
                            onChange={(e) =>
                                setSelectedCountry(
                                    e.target.value
                                )
                            }
                            className="w-full border border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 dark:text-gray-300 outline-none"
                        >
                            <option value="">
                                All Countries
                            </option>

                            {countries.map(
                                (country) => (
                                    <option
                                        key={country}
                                        value={
                                            country
                                        }
                                    >
                                        {country}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* PLACEMENT */}
                    <div>
                        <label className="text-sm mb-2 block">
                            Placement ID
                        </label>

                        <input
                            value={placement}
                            onChange={(e) =>
                                setPlacement(
                                    e.target.value
                                )
                            }
                            placeholder="Enter placement id"
                            className="w-full border border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 dark:text-gray-300 outline-none"
                        />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-end gap-3">
                        <button
                            onClick={
                                handleApply
                            }
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50"
                        >
                            {loading
                                ? "Loading..."
                                : "Apply"}
                        </button>

                        <button
                            onClick={
                                handleReset
                            }
                            className="border border-gray-300 dark:border-slate-600 px-6 py-2.5 rounded-xl"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="mt-4 text-red-500 text-sm">
                        {typeof error ===
                            "string"
                            ? error
                            : error?.message}
                    </div>
                )}
            </div>

            {/* ========================================= */}
            {/* GROUP BUTTONS */}
            {/* ========================================= */}

            <div className="flex flex-wrap gap-2">
                {[
                    {
                        label: "Country",
                        value:
                            "country",
                    },
                    {
                        label: "Date",
                        value: "date",
                    },
                    {
                        label: "Device",
                        value:
                            "device",
                    },
                    {
                        label: "OS",
                        value: "os",
                    },
                    {
                        label:
                            "Browser",
                        value:
                            "browser",
                    },
                ].map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() =>
                            setGroupBy(
                                tab.value
                            )
                        }
                        className={`px-4 py-2 rounded-full text-sm transition-all ${groupBy ===
                                tab.value
                                ? "bg-green-600 text-white"
                                : "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ========================================= */}
            {/* TOTAL CARDS */}
            {/* ========================================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
                    <p className="text-sm text-gray-500">
                        Impressions
                    </p>

                    <h2 className="text-2xl font-bold mt-2">
                        {totals.totalImpressions?.toLocaleString()}
                    </h2>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
                    <p className="text-sm text-gray-500">
                        Clicks
                    </p>

                    <h2 className="text-2xl font-bold mt-2">
                        {totals.totalClicks?.toLocaleString()}
                    </h2>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
                    <p className="text-sm text-gray-500">
                        CTR
                    </p>

                    <h2 className="text-2xl font-bold mt-2">
                        {totals.ctr}%
                    </h2>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
                    <p className="text-sm text-gray-500">
                        Revenue
                    </p>

                    <h2 className="text-2xl font-bold mt-2">
                        $
                        {totals.totalRevenue?.toFixed(
                            4
                        )}
                    </h2>
                </div>
            </div>

            {/* ========================================= */}
            {/* TABLE */}
            {/* ========================================= */}

            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-left">
                        <thead className="bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-gray-300 text-sm">
                            <tr>
                                <th className="p-4">
                                    {groupBy.toUpperCase()}
                                </th>

                                <th className="p-4 text-right">
                                    Impressions
                                </th>

                                <th className="p-4 text-right">
                                    Clicks
                                </th>

                                <th className="p-4 text-right">
                                    CTR
                                </th>

                                <th className="p-4 text-right">
                                    CPM
                                </th>

                                <th className="p-4 text-right">
                                    Revenue
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {groupedData.length >
                                0 ? (
                                groupedData.map(
                                    (
                                        item,
                                        index
                                    ) => {
                                        const impressions =
                                            Number(
                                                item.impressions ||
                                                0
                                            );

                                        const clicks =
                                            Number(
                                                item.clicks ||
                                                0
                                            );

                                        const revenue =
                                            Number(
                                                item.revenue ||
                                                0
                                            );

                                        const ctr =
                                            impressions >
                                                0
                                                ? (clicks /
                                                    impressions) *
                                                100
                                                : 0;

                                        const cpm =
                                            impressions >
                                                0
                                                ? (revenue /
                                                    impressions) *
                                                1000
                                                : 0;

                                        return (
                                            <tr
                                                key={
                                                    index
                                                }
                                                className="border-t border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/40"
                                            >
                                                <td className="p-4 font-medium">
                                                    {
                                                        item.label
                                                    }
                                                </td>

                                                <td className="p-4 text-right">
                                                    {impressions.toLocaleString()}
                                                </td>

                                                <td className="p-4 text-right">
                                                    {clicks.toLocaleString()}
                                                </td>

                                                <td className="p-4 text-right">
                                                    {ctr.toFixed(
                                                        2
                                                    )}
                                                    %
                                                </td>

                                                <td className="p-4 text-right">
                                                    {cpm.toFixed(
                                                        3
                                                    )}
                                                </td>

                                                <td className="p-4 text-right">
                                                    $
                                                    {revenue.toFixed(
                                                        4
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    }
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="p-10 text-center text-gray-500"
                                    >
                                        {loading
                                            ? "Loading..."
                                            : "No Data Found"}
                                    </td>
                                </tr>
                            )}
                        </tbody>

                        {/* TOTAL */}
                        <tfoot>
                            <tr className="border-t border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 font-bold">
                                <td className="p-4">
                                    Total
                                </td>

                                <td className="p-4 text-right">
                                    {calculatedTotals.impressions.toLocaleString()}
                                </td>

                                <td className="p-4 text-right">
                                    {calculatedTotals.clicks.toLocaleString()}
                                </td>

                                <td className="p-4 text-right">
                                    {calculatedTotals.impressions >
                                        0
                                        ? (
                                            (calculatedTotals.clicks /
                                                calculatedTotals.impressions) *
                                            100
                                        ).toFixed(2)
                                        : "0.00"}
                                    %
                                </td>

                                <td className="p-4 text-right">
                                    {calculatedTotals.impressions >
                                        0
                                        ? (
                                            (calculatedTotals.revenue /
                                                calculatedTotals.impressions) *
                                            1000
                                        ).toFixed(3)
                                        : "0.000"}
                                </td>

                                <td className="p-4 text-right">
                                    $
                                    {calculatedTotals.revenue.toFixed(
                                        4
                                    )}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SmartlinkStatistics;