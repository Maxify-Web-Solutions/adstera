// src/pages/AdsterraRawData.jsx

import React, {
    useMemo,
    useState,
} from "react";

import { useSelector } from "react-redux";

import lookup from "country-code-lookup";
import { getNames } from "country-list";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AdsterraRawData = () => {

    const {
        data,
        totals,
        countryData,
        countryTotals,
        loading,
    } = useSelector(
        (state) => state.adsterra
    );

    // =====================================
    // FILTER STATES
    // =====================================

    const countries = useMemo(
        () => getNames().sort(),
        []
    );

    const [selectedCountry, setSelectedCountry] =
        useState("");

    const [dateRange, setDateRange] =
        useState([null, null]);

    const [startDate, endDate] =
        dateRange;

    // =====================================
    // FILTERED OVERALL DATA
    // =====================================

    const filteredOverallData =
        useMemo(() => {

            return (data || []).filter(
                (item) => {

                    const itemDate =
                        new Date(item.date);

                    const matchesCountry =
                        !selectedCountry ||
                        item.country === "ALL" ||
                        lookup.byIso(
                            item.country
                        )?.country ===
                        selectedCountry;

                    const matchesDate =
                        (!startDate ||
                            itemDate >=
                            startDate) &&
                        (!endDate ||
                            itemDate <=
                            endDate);

                    return (
                        matchesCountry &&
                        matchesDate
                    );
                }
            );
        }, [
            data,
            selectedCountry,
            startDate,
            endDate,
        ]);

    // =====================================
    // FILTERED COUNTRY DATA
    // =====================================

    const filteredCountryData =
        useMemo(() => {

            return (
                countryData || []
            ).filter((item) => {

                const itemDate =
                    new Date(item.date);

                const countryName =
                    lookup.byIso(
                        item.country
                    )?.country ||
                    item.country;

                const matchesCountry =
                    !selectedCountry ||
                    countryName ===
                    selectedCountry;

                const matchesDate =
                    (!startDate ||
                        itemDate >=
                        startDate) &&
                    (!endDate ||
                        itemDate <=
                        endDate);

                return (
                    matchesCountry &&
                    matchesDate
                );
            });
        }, [
            countryData,
            selectedCountry,
            startDate,
            endDate,
        ]);

    // =====================================
    // FILTERED TOTALS
    // =====================================

    const filteredTotals =
        useMemo(() => {

            const impressions =
                filteredOverallData.reduce(
                    (acc, item) =>
                        acc +
                        Number(
                            item.impressions ||
                            0
                        ),
                    0
                );

            const revenue =
                filteredOverallData.reduce(
                    (acc, item) =>
                        acc +
                        Number(
                            item.revenue || 0
                        ),
                    0
                );

            const clicks =
                filteredOverallData.reduce(
                    (acc, item) =>
                        acc +
                        Number(
                            item.clicks || 0
                        ),
                    0
                );

            const cpm =
                impressions > 0
                    ? (revenue /
                        impressions) *
                    1000
                    : 0;

            const ctr =
                impressions > 0
                    ? (clicks /
                        impressions) *
                    100
                    : 0;

            return {
                impressions,
                revenue,
                clicks,
                cpm,
                ctr,
            };
        }, [filteredOverallData]);

    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center text-xl font-semibold dark:text-white">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8 bg-gray-100 dark:bg-slate-900">

            {/* HEADER */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Adsterra Raw Statistics
                </h1>

                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Complete reducer data preview
                </p>

            </div>

            {/* FILTERS */}

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow mb-8">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* DATE */}

                    <div>

                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                            Date Range
                        </label>

                        <DatePicker
                            selectsRange
                            startDate={
                                startDate
                            }
                            endDate={endDate}
                            onChange={(
                                update
                            ) =>
                                setDateRange(
                                    update
                                )
                            }
                            isClearable
                            placeholderText="Select Date Range"
                            className="w-full border-2 border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 dark:text-white outline-none"
                        />

                    </div>

                    {/* COUNTRY */}

                    <div>

                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
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
                            className="w-full border-2 border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 dark:text-white outline-none"
                        >

                            <option value="">
                                All Countries
                            </option>

                            {countries.map(
                                (country) => (
                                    <option
                                        key={
                                            country
                                        }
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

                </div>

            </div>

            {/* TOTAL CARDS */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow">

                    <p className="text-sm text-gray-500">
                        Impressions
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {filteredTotals.impressions.toLocaleString()}
                    </h2>

                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow">

                    <p className="text-sm text-gray-500">
                        Revenue
                    </p>

                    <h2 className="text-2xl font-bold text-green-600">
                        $
                        {filteredTotals.revenue.toFixed(
                            3
                        )}
                    </h2>

                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow">

                    <p className="text-sm text-gray-500">
                        CPM
                    </p>

                    <h2 className="text-2xl font-bold text-orange-500">
                        {filteredTotals.cpm.toFixed(
                            3
                        )}
                    </h2>

                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow">

                    <p className="text-sm text-gray-500">
                        CTR
                    </p>

                    <h2 className="text-2xl font-bold text-purple-500">
                        {filteredTotals.ctr.toFixed(
                            2
                        )}
                        %
                    </h2>

                </div>

            </div>

            {/* OVERALL TABLE */}

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow overflow-hidden mb-10">

                <div className="p-5 border-b border-gray-200 dark:border-slate-700">

                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Overall Data
                    </h2>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-50 dark:bg-slate-700">

                            <tr>

                                <th className="p-4 text-left">
                                    Date
                                </th>

                                <th className="p-4 text-left">
                                    Placement
                                </th>

                                <th className="p-4 text-left">
                                    Domain
                                </th>

                                <th className="p-4 text-right">
                                    Impressions
                                </th>

                                <th className="p-4 text-right">
                                    Revenue
                                </th>

                                <th className="p-4 text-right">
                                    CPM
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredOverallData.map(
                                (
                                    item,
                                    index
                                ) => (

                                    <tr
                                        key={index}
                                        className="border-t border-gray-100 dark:border-slate-700"
                                    >

                                        <td className="p-4 text-gray-700 dark:text-gray-300">
                                            {item.date}
                                        </td>

                                        <td className="p-4 font-mono text-blue-600">
                                            {
                                                item.placement
                                            }
                                        </td>

                                        <td className="p-4 max-w-[300px] truncate text-gray-700 dark:text-gray-300">
                                            {item.domain}
                                        </td>

                                        <td className="p-4 text-right font-semibold">
                                            {Number(
                                                item.impressions ||
                                                0
                                            ).toLocaleString()}
                                        </td>

                                        <td className="p-4 text-right text-green-600 font-bold">
                                            $
                                            {Number(
                                                item.revenue ||
                                                0
                                            ).toFixed(3)}
                                        </td>

                                        <td className="p-4 text-right">
                                            {Number(
                                                item.cpm || 0
                                            ).toFixed(3)}
                                        </td>

                                    </tr>
                                )
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* COUNTRY TABLE */}

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow overflow-hidden">

                <div className="p-5 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">

                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Country Data
                    </h2>

                    <div className="text-sm text-gray-500">
                        Total Records:{" "}
                        {
                            filteredCountryData.length
                        }
                    </div>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-50 dark:bg-slate-700">

                            <tr>

                                <th className="p-4 text-left">
                                    Country
                                </th>

                                <th className="p-4 text-left">
                                    Placement
                                </th>

                                <th className="p-4 text-right">
                                    Impressions
                                </th>

                                <th className="p-4 text-right">
                                    Revenue
                                </th>

                                <th className="p-4 text-right">
                                    CPM
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredCountryData.map(
                                (
                                    item,
                                    index
                                ) => (

                                    <tr
                                        key={index}
                                        className="border-t border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/40"
                                    >

                                        <td className="p-4 text-gray-700 dark:text-gray-300">

                                            {lookup.byIso(
                                                item.country
                                            )?.country ||
                                                item.country}

                                        </td>

                                        <td className="p-4 font-mono text-blue-600">
                                            {
                                                item.placement
                                            }
                                        </td>

                                        <td className="p-4 text-right font-semibold">

                                            {Number(
                                                item.impressions ||
                                                0
                                            ).toLocaleString()}

                                        </td>

                                        <td className="p-4 text-right text-green-600 font-bold">

                                            $
                                            {Number(
                                                item.revenue ||
                                                0
                                            ).toFixed(4)}

                                        </td>

                                        <td className="p-4 text-right">

                                            {Number(
                                                item.cpm || 0
                                            ).toFixed(3)}

                                        </td>

                                    </tr>
                                )
                            )}

                        </tbody>

                        <tfoot className="bg-gray-50 dark:bg-slate-700">

                            <tr>

                                <td className="p-4 font-bold">
                                    Total
                                </td>

                                <td></td>

                                <td className="p-4 text-right font-bold">

                                    {filteredCountryData
                                        .reduce(
                                            (
                                                acc,
                                                item
                                            ) =>
                                                acc +
                                                Number(
                                                    item.impressions ||
                                                    0
                                                ),
                                            0
                                        )
                                        .toLocaleString()}

                                </td>

                                <td className="p-4 text-right text-green-600 font-bold">

                                    $
                                    {filteredCountryData
                                        .reduce(
                                            (
                                                acc,
                                                item
                                            ) =>
                                                acc +
                                                Number(
                                                    item.revenue ||
                                                    0
                                                ),
                                            0
                                        )
                                        .toFixed(3)}

                                </td>

                                <td className="p-4 text-right font-bold">

                                    {(() => {

                                        const impressions =
                                            filteredCountryData.reduce(
                                                (
                                                    acc,
                                                    item
                                                ) =>
                                                    acc +
                                                    Number(
                                                        item.impressions ||
                                                        0
                                                    ),
                                                0
                                            );

                                        const revenue =
                                            filteredCountryData.reduce(
                                                (
                                                    acc,
                                                    item
                                                ) =>
                                                    acc +
                                                    Number(
                                                        item.revenue ||
                                                        0
                                                    ),
                                                0
                                            );

                                        return impressions >
                                            0
                                            ? (
                                                (revenue /
                                                    impressions) *
                                                1000
                                            ).toFixed(
                                                3
                                            )
                                            : "0.000";
                                    })()}

                                </td>

                            </tr>

                        </tfoot>

                    </table>

                </div>

            </div>

        </div>
    );
};

export default AdsterraRawData;