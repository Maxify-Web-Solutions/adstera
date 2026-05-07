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
  const countries = getNames();
  const location = useLocation();

  // 📅 Date setup
  const today = new Date();
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(today.getDate() - 2);

  const [dateRange, setDateRange] = useState([twoDaysAgo, today]);
  const [startDate, endDate] = dateRange;
  const [groupBy, setGroupBy] = useState("country");

  // 🎯 Filters
  const [selectedCountry, setSelectedCountry] = useState("");
  const [domain, setDomain] = useState("");
  const [placement, setPlacement] = useState("");

  // 📊 Redux state
  const { data, totals, loading, fetchLoading, error } = useSelector(
    (state) => state.adsterra
  );

  console.log(data);
  useEffect(() => {
    dispatch(fetchAdsterraStats())
    dispatch(getAdsterraStats())
  }, [])

  useEffect(() => {
    if (location.state) {
      setDomain(location.state.domain || "");
      setPlacement(location.state.placement || "");
    }
  }, [location.state]);


  useEffect(() => {
    if (location.state?.domain && location.state?.placement) {
      const start = startDate?.toISOString().split("T")[0];
      const end = endDate?.toISOString().split("T")[0];

      dispatch(
        fetchAdsterraStats({
          start_date: start,
          finish_date: end,
          country: selectedCountry,
        })
      );

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
  }, [location.state]);

  // 🚀 APPLY
  const handleApply = async () => {
    if (!domain || !placement) {
      alert("Domain & Placement required");
      return;
    }

    const start = startDate?.toISOString().split("T")[0];
    const end = endDate?.toISOString().split("T")[0];

    try {
      // 1️⃣ Fetch API data
      await dispatch(
        fetchAdsterraStats({
          start_date: start,
          finish_date: end,
          country: selectedCountry,
        })
      );

      // 2️⃣ Get DB data
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

  // 🔄 RESET
  const handleReset = () => {
    setSelectedCountry("");
    setDomain("");
    setPlacement("");
    setDateRange([twoDaysAgo, today]);
  };

  const groupedData = Object.values(
    (data || []).reduce((acc, item) => {
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

      if (!key) key = "Unknown";

      if (!acc[key]) {
        acc[key] = {
          label: key,
          impressions: 0,
          clicks: 0,
          revenue: 0,
        };
      }

      acc[key].impressions += item.impressions || 0;
      acc[key].clicks += item.clicks || 0;
      acc[key].revenue += item.revenue || 0;

      return acc;
    }, {})
  );

  // ✅ FRONTEND TOTAL (ACTUAL TABLE TOTAL)
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
        <h2 className="font-semibold mb-6">Filters</h2>

        <div className="grid md:grid-cols-4 gap-6">
          {/* DATE */}
          <div>
            <label className="text-sm mb-2 block">Date range</label>
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              className="w-full border border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 dark:text-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all"
            />
          </div>

          {/* COUNTRY */}
          <div>
            <label className="text-sm mb-2 block">Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full border border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 dark:text-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all"
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
            <label className="text-sm mb-2 block">Domain</label>
            <input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Enter domain ID"
              className="w-full border border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 dark:text-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all"
            />
          </div>

          {/* PLACEMENT */}
          <div>
            <label className="text-sm mb-2 block">Placement</label>
            <input
              value={placement}
              onChange={(e) => setPlacement(e.target.value)}
              placeholder="Enter placement ID"
              className="w-full border border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 dark:text-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleApply}
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
          >
            {fetchLoading ? "Fetching..." : "APPLY"}
          </button>

          <button
            onClick={handleReset}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 px-4 py-2.5 font-medium transition-colors"
          >
            RESET
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 py-4">
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
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${groupBy === tab.value
              ? "bg-green-600 text-white shadow-md shadow-green-600/20"
              : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">

        {/* TOP BAR */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-gray-900 dark:text-white font-semibold">
            Statistics
          </h2>

          <button className="text-green-500 text-sm font-medium whitespace-nowrap">
            EXPORT CSV
          </button>
        </div>

        {/* RESPONSIVE TABLE */}
        <div className="max-w-[24.5rem] md:hidden">
{/* TABLE */}
<div className="overflow-hidden">

  <div className="overflow-x-auto">

    <table className="w-full min-w-max text-left border-collapse">

      {/* HEAD */}
      <thead className="bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-gray-300 text-sm">

        <tr>

          <th className="px-3 sm:px-4 py-3 sm:py-4 font-medium whitespace-nowrap">
            {groupBy}
          </th>

          <th className="px-3 sm:px-4 py-3 sm:py-4 text-right font-medium whitespace-nowrap">
            Impressions
          </th>

          <th className="px-3 sm:px-4 py-3 sm:py-4 text-right font-medium whitespace-nowrap">
            Clicks
          </th>

          <th className="px-3 sm:px-4 py-3 sm:py-4 text-right font-medium whitespace-nowrap">
            CTR
          </th>

          <th className="px-3 sm:px-4 py-3 sm:py-4 text-right font-medium whitespace-nowrap">
            CPM
          </th>

          <th className="px-3 sm:px-4 py-3 sm:py-4 text-right font-medium whitespace-nowrap">
            Revenue
          </th>

        </tr>

      </thead>

      {/* BODY */}
      <tbody>

        {(groupedData || []).map((item, i) => {

          const impressions = Number(item?.impressions || 0);
          const clicks = Number(item?.clicks || 0);
          const revenue = Number(item?.revenue || 0);

          const ctr =
            impressions > 0
              ? (clicks / impressions) * 100
              : 0;

          const cpm =
            impressions > 0
              ? (revenue / impressions) * 1000
              : 0;

          return (
            <tr
              key={i}
              className="border-t border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >

              {/* LABEL */}
              <td className="px-3 sm:px-4 py-3 sm:py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                {item?.label || "-"}
              </td>

              {/* IMPRESSIONS */}
              <td className="px-3 sm:px-4 py-3 sm:py-4 text-right text-gray-600 dark:text-gray-300 whitespace-nowrap">
                {impressions.toLocaleString()}
              </td>

              {/* CLICKS */}
              <td className="px-3 sm:px-4 py-3 sm:py-4 text-right text-gray-600 dark:text-gray-300 whitespace-nowrap">
                {clicks.toLocaleString()}
              </td>

              {/* CTR */}
              <td className="px-3 sm:px-4 py-3 sm:py-4 text-right text-gray-600 dark:text-gray-300 whitespace-nowrap">
                {ctr.toFixed(2)}%
              </td>

              {/* CPM */}
              <td className="px-3 sm:px-4 py-3 sm:py-4 text-right text-gray-600 dark:text-gray-300 whitespace-nowrap">
                {cpm.toFixed(3)}
              </td>

              {/* REVENUE */}
              <td className="px-3 sm:px-4 py-3 sm:py-4 text-right text-gray-900 dark:text-white font-semibold whitespace-nowrap">
                ${revenue.toFixed(4)}
              </td>

            </tr>
          );
        })}

      </tbody>

    </table>

  </div>

</div>
        </div>

      </div>
    </div>
  );
};

export default Statistics;