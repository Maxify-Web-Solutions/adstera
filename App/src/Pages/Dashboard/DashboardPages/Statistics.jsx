import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  fetchAdsterraStats,
  getAdsterraStats,
} from "../../../redux/slice/adsterraStatsSlice";

import { getNames } from "country-list";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import lookup from "country-code-lookup";

const Statistics = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const countries = getNames();

  // DATE
  const today = new Date();

  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(today.getDate() - 2);

  const [dateRange, setDateRange] = useState([twoDaysAgo, today]);

  const [startDate, endDate] = dateRange;

  // FILTERS
  const [groupBy, setGroupBy] = useState("country");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [domain, setDomain] = useState("");
  const [placement, setPlacement] = useState("");

  // REDUX
  const {
    data,
    totals,
    loading,
    fetchLoading,
    error,
  } = useSelector((state) => state.adsterra);

  // FIXED DATA
  const statsData = Array.isArray(data)
    ? data
    : data?.data || [];

  console.log("FULL API DATA =>", data);
  console.log("FINAL STATS DATA =>", statsData);

  // GET DATA FROM SMARTLINK PAGE
  useEffect(() => {
    if (location.state) {
      setDomain(location.state.domain || "");
      setPlacement(location.state.placement || "");
    }
  }, [location.state]);

  // AUTO FETCH
  useEffect(() => {
    if (location.state?.domain && location.state?.placement) {

      const start = startDate?.toISOString().split("T")[0];
      const end = endDate?.toISOString().split("T")[0];

      dispatch(
        getAdsterraStats({
          domain: location.state.domain,
          placement: location.state.placement,
          country: selectedCountry,
          start_date: start,
          end_date: end,
        })
      );
    }
  }, []);

  // APPLY
  const handleApply = async () => {

    if (!domain || !placement) {
      alert("Domain & Placement required");
      return;
    }

    const start = startDate?.toISOString().split("T")[0];
    const end = endDate?.toISOString().split("T")[0];

    try {

      await dispatch(
        fetchAdsterraStats({
          start_date: start,
          finish_date: end,
          country: selectedCountry,
        })
      );

      dispatch(
        getAdsterraStats({
          domain,
          placement,
          country: selectedCountry,
          start_date: start,
          end_date: end,
        })
      );

    } catch (err) {
      console.error(err);
    }
  };

  // RESET
  const handleReset = () => {
    setSelectedCountry("");
    setDomain("");
    setPlacement("");
    setDateRange([twoDaysAgo, today]);
  };

  // GROUP DATA
  const groupedData = Object.values(
    (statsData || []).reduce((acc, item) => {

      let key;

      switch (groupBy) {

        case "country":
          key = item.country
            ? lookup.byIso(item.country)?.country || item.country
            : "Unknown";
          break;

        case "date":
          key = item.date
            ? new Date(item.date).toLocaleDateString()
            : "Unknown";
          break;

        case "device":
          key = item.device || "Unknown";
          break;

        case "os":
          key = item.osName || "Unknown";
          break;

        case "browser":
          key = item.browserName || "Unknown";
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

      acc[key].impressions += Number(item.impressions || 0);
      acc[key].clicks += Number(item.clicks || 0);
      acc[key].revenue += Number(item.revenue || 0);

      return acc;

    }, {})
  );

  // TOTALS
  const calculatedTotals = groupedData.reduce(
    (acc, item) => {

      acc.impressions += Number(item.impressions || 0);
      acc.clicks += Number(item.clicks || 0);
      acc.revenue += Number(item.revenue || 0);

      return acc;

    },
    {
      impressions: 0,
      clicks: 0,
      revenue: 0,
    }
  );

  return (
    <div className="space-y-10">

      {/* FILTERS */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 md:p-6 shadow-sm">

        <h2 className="font-semibold mb-6 text-gray-900 dark:text-white">
          Filters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          {/* DATE */}
          <div>
            <label className="text-sm mb-2 block text-gray-700 dark:text-gray-300">
              Date Range
            </label>

            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              className="w-full border border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 dark:text-gray-300 outline-none"
            />
          </div>

          {/* COUNTRY */}
          <div>
            <label className="text-sm mb-2 block text-gray-700 dark:text-gray-300">
              Country
            </label>

            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full border border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 dark:text-gray-300 outline-none"
            >
              <option value="">All Countries</option>

              {countries.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* DOMAIN */}
          <div>
            <label className="text-sm mb-2 block text-gray-700 dark:text-gray-300">
              Domain
            </label>

            <input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Enter domain"
              className="w-full border border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 dark:text-gray-300 outline-none"
            />
          </div>

          {/* PLACEMENT */}
          <div>
            <label className="text-sm mb-2 block text-gray-700 dark:text-gray-300">
              Placement
            </label>

            <input
              value={placement}
              onChange={(e) => setPlacement(e.target.value)}
              placeholder="Enter placement"
              className="w-full border border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 dark:text-gray-300 outline-none"
            />
          </div>

        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 mt-6">

          <button
            onClick={handleApply}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-2.5 rounded-xl font-medium"
          >
            {fetchLoading ? "Loading..." : "APPLY"}
          </button>

          <button
            onClick={handleReset}
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            RESET
          </button>

        </div>

      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-3">

        {[
          { label: "Country", value: "country" },
          { label: "Date", value: "date" },
          { label: "Device", value: "device" },
          { label: "OS", value: "os" },
          { label: "Browser", value: "browser" },
        ].map((tab) => (

          <button
            key={tab.value}
            onClick={() => setGroupBy(tab.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              groupBy === tab.value
                ? "bg-green-600 text-white"
                : "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            {tab.label}
          </button>

        ))}

      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">

        {/* HEADER */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">

          <h2 className="text-gray-900 dark:text-white font-semibold">
            Statistics
          </h2>

          <button className="text-green-500 text-sm font-medium">
            EXPORT CSV
          </button>

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px] text-left">

            <thead className="bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-gray-400 text-sm">

              <tr>

                <th className="px-4 py-3">
                  {groupBy.toUpperCase()}
                </th>

                <th className="px-4 py-3 text-right">
                  Impressions
                </th>

                <th className="px-4 py-3 text-right">
                  Clicks
                </th>

                <th className="px-4 py-3 text-right">
                  CTR
                </th>

                <th className="px-4 py-3 text-right">
                  CPM
                </th>

                <th className="px-4 py-3 text-right">
                  Revenue
                </th>

              </tr>

            </thead>

            <tbody>

              {groupedData?.length > 0 ? (

                groupedData.map((item, i) => {

                  const impressions = Number(item.impressions || 0);
                  const clicks = Number(item.clicks || 0);
                  const revenue = Number(item.revenue || 0);

                  const ctr =
                    impressions > 0
                      ? ((clicks / impressions) * 100).toFixed(2)
                      : "0.00";

                  const cpm =
                    impressions > 0
                      ? ((revenue / impressions) * 1000).toFixed(3)
                      : "0.000";

                  return (

                    <tr
                      key={i}
                      className="border-t border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
                    >

                      <td className="px-4 py-4 text-gray-900 dark:text-white font-medium whitespace-nowrap">
                        {item.label}
                      </td>

                      <td className="px-4 py-4 text-right whitespace-nowrap">
                        {impressions.toLocaleString()}
                      </td>

                      <td className="px-4 py-4 text-right whitespace-nowrap">
                        {clicks.toLocaleString()}
                      </td>

                      <td className="px-4 py-4 text-right whitespace-nowrap">
                        {ctr}%
                      </td>

                      <td className="px-4 py-4 text-right whitespace-nowrap">
                        {cpm}
                      </td>

                      <td className="px-4 py-4 text-right font-semibold whitespace-nowrap">
                        ${revenue.toFixed(4)}
                      </td>

                    </tr>

                  );
                })

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center py-10 text-gray-500"
                  >
                    No Statistics Found
                  </td>

                </tr>

              )}

            </tbody>

            {/* TOTAL */}
            {groupedData?.length > 0 && (

              <tfoot className="bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700">

                <tr>

                  <td className="px-4 py-4 font-bold">
                    TOTAL
                  </td>

                  <td className="px-4 py-4 text-right font-bold">
                    {calculatedTotals.impressions.toLocaleString()}
                  </td>

                  <td className="px-4 py-4 text-right font-bold">
                    {calculatedTotals.clicks.toLocaleString()}
                  </td>

                  <td className="px-4 py-4 text-right font-bold">
                    -
                  </td>

                  <td className="px-4 py-4 text-right font-bold">
                    -
                  </td>

                  <td className="px-4 py-4 text-right font-bold">
                    ${calculatedTotals.revenue.toFixed(4)}
                  </td>

                </tr>

              </tfoot>

            )}

          </table>

        </div>

      </div>

    </div>
  );
};

export default Statistics;