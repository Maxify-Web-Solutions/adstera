import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import {
  fetchAdsterraStats,
  getAdsterraStats,
} from "../../../redux/slice/adsterraStatsSlice";

import { getNames } from "country-list";
import lookup from "country-code-lookup";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Statistics = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const countries = getNames();

  // 📅 DATE SETUP
  const today = new Date();

  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(today.getDate() - 2);

  const [dateRange, setDateRange] = useState([
    twoDaysAgo,
    today,
  ]);

  const [startDate, endDate] = dateRange;

  // 🎯 FILTERS
  const [selectedCountry, setSelectedCountry] =
    useState("");

  const [domain, setDomain] = useState("");

  const [placement, setPlacement] =
    useState("");

  // 📊 GROUP BY
  const [groupBy, setGroupBy] =
    useState("country");

  // 📦 REDUX STATE
  const {
    data,
    totals,
    loading,
    fetchLoading,
    error,
  } = useSelector(
    (state) => state.adsterra
  );

  // ✅ INITIAL LOAD
  useEffect(() => {
    dispatch(getAdsterraStats())
    dispatch(fetchAdsterraStats());
  }, [dispatch]);

  // ✅ GET DATA FROM LOCATION STATE
  useEffect(() => {
    if (location.state) {
      setDomain(
        location.state.domain || ""
      );

      setPlacement(
        location.state.placementId ||
          location.state.placement ||
          ""
      );

      console.log(
        "LOCATION STATE =>",
        location.state
      );
    }
  }, [location.state]);

  // 🌍 COUNTRY NAME → ISO
  const countryCode = useMemo(() => {
    if (!selectedCountry) return "";

    const country =
      lookup.byCountry(selectedCountry);

    return country?.iso2 || "";
  }, [selectedCountry]);

  // 🚀 APPLY FILTERS
  const handleApply = async () => {
    if (!domain || !placement) {
      alert(
        "Domain & Placement required"
      );

      return;
    }

    const start =
      startDate?.toISOString().split(
        "T"
      )[0];

    const end =
      endDate?.toISOString().split(
        "T"
      )[0];

    try {
      // 🔄 FETCH + STORE
      await dispatch(
        fetchAdsterraStats({
          start_date: start,
          end_date: end,
          country: countryCode,
          placement,
        })
      );

      // 📊 GET DB DATA
      dispatch(
        getAdsterraStats({
          domain,
          placement,
          country: countryCode,
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

    setDateRange([
      twoDaysAgo,
      today,
    ]);

    dispatch(getAdsterraStats());
  };

  // 📊 GROUP DATA
  const groupedData = useMemo(() => {
    if (!Array.isArray(data))
      return [];

    return Object.values(
      data.reduce((acc, item) => {
        let key = "Unknown";

        switch (groupBy) {
          case "country":
            key = item.country
              ? lookup.byIso(
                  item.country
                )?.country ||
                item.country
              : "Unknown";
            break;

          case "date":
            key = item.date
              ? new Date(
                  item.date
                ).toLocaleDateString()
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

        acc[key].impressions +=
          Number(
            item.impressions || 0
          );

        acc[key].clicks += Number(
          item.clicks || 0
        );

        acc[key].revenue += Number(
          item.revenue || 0
        );

        return acc;
      }, {})
    );
  }, [data, groupBy]);

  // ✅ TOTALS
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
    <div className="space-y-6">
      {/* FILTERS */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 md:p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-6">
          Filters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* DATE */}
          <div>
            <label className="text-sm mb-2 block">
              Date Range
            </label>

            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) =>
                setDateRange(update)
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
              value={selectedCountry}
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
                    value={country}
                  >
                    {country}
                  </option>
                )
              )}
            </select>
          </div>

          {/* DOMAIN */}
          <div>
            <label className="text-sm mb-2 block">
              Domain
            </label>

            <input
              value={domain}
              onChange={(e) =>
                setDomain(
                  e.target.value
                )
              }
              placeholder="Enter domain"
              className="w-full border border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 dark:text-gray-300 outline-none"
            />
          </div>

          {/* PLACEMENT */}
          <div>
            <label className="text-sm mb-2 block">
              Placement
            </label>

            <input
              value={placement}
              onChange={(e) =>
                setPlacement(
                  e.target.value
                )
              }
              placeholder="Enter placement"
              className="w-full border border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 dark:text-gray-300 outline-none"
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={handleApply}
            disabled={
              loading ||
              fetchLoading
            }
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50"
          >
            {fetchLoading
              ? "Fetching..."
              : loading
              ? "Loading..."
              : "APPLY"}
          </button>

          <button
            onClick={handleReset}
            className="border border-gray-300 dark:border-slate-600 px-6 py-2.5 rounded-xl"
          >
            RESET
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-4 text-red-500 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* GROUP TABS */}
      <div className="flex flex-wrap gap-2">
        {[
          {
            label: "Country",
            value: "country",
          },
          {
            label: "Date",
            value: "date",
          },
          {
            label: "Device",
            value: "device",
          },
          {
            label: "OS",
            value: "os",
          },
          {
            label: "Browser",
            value: "browser",
          },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() =>
              setGroupBy(tab.value)
            }
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              groupBy === tab.value
                ? "bg-green-600 text-white"
                : "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-slate-700">
          <button className="text-green-500 font-medium">
            EXPORT CSV
          </button>
        </div>

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
                  (item, index) => {
                    const impressions =
                      Number(
                        item.impressions ||
                          0
                      );

                    const clicks =
                      Number(
                        item.clicks || 0
                      );

                    const revenue =
                      Number(
                        item.revenue ||
                          0
                      );

                    const ctr =
                      impressions > 0
                        ? (clicks /
                            impressions) *
                          100
                        : 0;

                    const cpm =
                      impressions > 0
                        ? (revenue /
                            impressions) *
                          1000
                        : 0;

                    return (
                      <tr
                        key={index}
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

            {/* TOTALS */}
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

export default Statistics;