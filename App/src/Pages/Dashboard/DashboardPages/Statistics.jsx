import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
          key = item.device_format || "Unknown";
          break;

        case "os":
          key = item.operating_system || "Unknown";
          break;

        case "browser":
          key = item.browser || "Unknown";
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

  return (
    <div className="space-y-10">
      {/* FILTERS */}
      <div className="bg-white dark:bg-slate-800 border rounded-xl p-6">
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
              className="w-full border px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-900 dark:text-gray-400"
            />
          </div>

          {/* COUNTRY */}
          <div>
            <label className="text-sm mb-2 block">Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-900 dark:text-gray-400"
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
              className="w-full border px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-900 dark:text-gray-400"
            />
          </div>

          {/* PLACEMENT */}
          <div>
            <label className="text-sm mb-2 block">Placement</label>
            <input
              value={placement}
              onChange={(e) => setPlacement(e.target.value)}
              placeholder="Enter placement ID"
              className="w-full border px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-900 dark:text-gray-400"
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleApply}
            className="bg-black text-white px-6 py-2 rounded-lg"
          >
            {fetchLoading ? "Fetching..." : "APPLY"}
          </button>

          <button
            onClick={handleReset}
            className="text-gray-500"
          >
            RESET
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 p-4 border-b bg-gray-50 dark:bg-slate-700">
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
            className={`px-4 py-2 rounded-lg text-sm border ${groupBy === tab.value
              ? "bg-green-100 text-green-700"
              : "bg-white text-gray-600"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl">
        <div className="p-4 border-b">
          <button className="text-green-500">EXPORT CSV</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left rounded-xl">
            <thead className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-sm">
              <tr>
                <th className="p-4 text-left">{groupBy}</th>

                <th className="p-4 text-right border-l">Impressions</th>
                <th className="p-4 text-right border-l">Clicks</th>
                <th className="p-4 text-right border-l">CTR</th>
                <th className="p-4 text-right border-l">CPM</th>
                <th className="p-4 text-right border-l">Revenue</th>
              </tr>
            </thead>

            <tbody>
              {groupedData.map((item, i) => (
                <tr key={i} className="border-t hover:bg-gray-50 dark:hover:bg-slate-700 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300">

                  {/* LEFT */}
                  <td className="p-4 font-medium">
                    {item.label}
                  </td>

                  {/* RIGHT SIDE (separate columns) */}
                  <td className="p-4 text-right">{item.impressions}</td>

                  <td className="p-4 text-right">{item.clicks}</td>

                  <td className="p-4 text-right">
                    {item.clicks && item.impressions
                      ? ((item.clicks / item.impressions) * 100).toFixed(2)
                      : 0}%
                  </td>

                  <td className="p-4 text-right">
                    {item.impressions
                      ? ((item.revenue / item.impressions) * 1000).toFixed(3)
                      : 0}
                  </td>

                  <td className="p-4 text-right">${item.revenue}</td>

                </tr>
              ))}
            </tbody>
            {totals && (
              <tr className="border-t font-bold bg-gray-50 dark:bg-slate-800 overflow-hidden">
                <td className="p-4">Total</td>

                <td className="p-4 text-right">{totals.totalImpressions}</td>
                <td className="p-4 text-right">{totals.totalClicks}</td>

                <td className="p-4 text-right">
                  {totals.totalClicks && totals.totalImpressions
                    ? ((totals.totalClicks / totals.totalImpressions) * 100).toFixed(2)
                    : 0}%
                </td>

                <td className="p-4 text-right">
                  {totals.totalImpressions
                    ? ((totals.totalRevenue / totals.totalImpressions) * 1000).toFixed(3)
                    : 0}
                </td>

                <td className="p-4 text-right">${totals.totalRevenue}</td>
              </tr>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statistics;