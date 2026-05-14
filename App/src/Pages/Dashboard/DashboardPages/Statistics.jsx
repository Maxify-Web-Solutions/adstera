import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { useLocation } from "react-router-dom";

import {
  fetchAdsterraStats,
  getAdsterraStats,
} from "../../../redux/slice/adsterraStatsSlice";

import {
  setFilters,
  getSmartLinkStats,
} from "../../../redux/slice/smartlinkFilterSlice";

import { getNames } from "country-list";
import lookup from "country-code-lookup";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Icons (using lucide-react - install: npm install lucide-react)
import {
  Calendar,
  Globe,
  Globe2,
  MousePointerClick,
  TrendingUp,
  DollarSign,
  BarChart3,
  Download,
  RefreshCw,
  Filter,
  ChevronDown,
  Smartphone,
  Monitor,
  Clock,
  MapPin,
  Link2,
  Code2,
  Eye,
  Zap,
} from "lucide-react";

const Statistics = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  // 🌍 COUNTRIES
  const countries = useMemo(
    () => getNames().sort(),
    []
  );

  // 📅 DATE SETUP
  const today = new Date();
  const sevenDaysAgo = new Date();

  sevenDaysAgo.setDate(
    today.getDate() - 7
  );

  const [dateRange, setDateRange] =
    useState([
      sevenDaysAgo,
      today,
    ]);

  const [startDate, endDate] = dateRange;

  // 🎯 FILTERS
  const [selectedCountry, setSelectedCountry] = useState("");
  const [domain, setDomain] = useState("");
  const [placement, setPlacement] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  // 📊 GROUP BY
  const [groupBy, setGroupBy] = useState("date");

  // 📦 ADSTERRA STATE
  const {
    data,
    loading,
    fetchLoading,
    error,
  } = useSelector(
    (state) => state.adsterra


  );

  const {
    data: groupedReducerData,
    totals,
    error: smartlinkError,
    loading: smartlinkLoading,
  } = useSelector(
    (state) => state.smartlinkFilter
  );

  // 🌍 COUNTRY NAME → ISO
  const countryCode = useMemo(() => {
    if (!selectedCountry) return "";
    const country = lookup.byCountry(selectedCountry);
    return country?.iso2 || "";
  }, [selectedCountry]);

  // 📅 FORMAT DATE
  const formatDate = (date) => {

    if (!date) return "";

    const year =
      date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const normalizeDate = (date) => {

    const d = new Date(date);

    const year = d.getFullYear();

    const month = String(
      d.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      d.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ====================================
  // AUTO FETCH FUNCTION
  // ====================================
  const autoFetchStats = useCallback(
    (customPlacement = null, customDomain = null, customCountry = null, customStartDate = null, customEndDate = null) => {
      const start = formatDate(customStartDate || startDate);
      const end = formatDate(customEndDate || endDate);

      const params = {
        start_date: start,
        end_date: end,
      };

      if (customPlacement && customPlacement !== "") {
        params.placement = customPlacement;
      }
      if (customCountry && customCountry !== "") {
        params.country = customCountry;
      }

      dispatch(
        setFilters({
          start_date: start,
          end_date: end,
          placement: customPlacement,
          country: customCountry,
        })
      );

      const dbParams = {
        start_date: start,
        end_date: end,
        groupBy,
      };

      if (customDomain && customDomain !== "") dbParams.domain = customDomain;
      if (customPlacement && customPlacement !== "") dbParams.placement = customPlacement;
      if (customCountry && customCountry !== "") dbParams.country = customCountry;

      try {
        dispatch(getAdsterraStats(dbParams));
        dispatch(
          getSmartLinkStats(dbParams)
        );
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    },
    [
      dispatch,
      startDate,
      endDate,
      groupBy,
    ]);

  // ====================================
  // INITIAL LOAD
  // ====================================
  useEffect(() => {

    const start =
      formatDate(startDate);

    const end =
      formatDate(endDate);

    // ====================================
    // FETCH API DATA
    // ====================================



    // ====================================
    // OLD DB STATS
    // ====================================

    dispatch(
      getAdsterraStats({
        start_date: start,
        end_date: end,
        groupBy,
      })
    );

    // ====================================
    // COUNTRY / DEVICE / OS / BROWSER
    // ====================================

    dispatch(
      getSmartLinkStats({
        start_date: start,
        end_date: end,
        groupBy,
      })
    );

  }, [
    dispatch,
    groupBy,
    startDate,
    endDate,
  ]);
  // ====================================
  // LOCATION STATE AUTO FILTER
  // ====================================
  useEffect(() => {
    if (!location.state) return;

    const newDomain = location.state.domain || "";
    const newPlacement = location.state.placementId || location.state.placement || "";

    setDomain(newDomain);
    setPlacement(newPlacement);
    autoFetchStats(newPlacement, newDomain, countryCode);
  }, [location.state, autoFetchStats, countryCode]);

  // ====================================
  // DATE RANGE SYNC TO REDUX
  // ====================================
  useEffect(() => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);

    dispatch(
      setFilters({
        start_date: start,
        end_date: end,
        placement,
        country: countryCode || "",
      })
    );

    // Auto-fetch stats with new date range
    if (placement || countryCode || domain) {
      autoFetchStats(placement, domain, countryCode, startDate, endDate);
    }
  }, [startDate, endDate, dispatch]);

  // ====================================
  // AUTO FILTER ON COUNTRY CHANGE
  // ====================================
  useEffect(() => {
    if (!placement) return;
    autoFetchStats(placement, domain, countryCode);
  }, [selectedCountry, autoFetchStats, placement, domain, countryCode]);

  // ====================================
  // APPLY FILTERS
  // ====================================
  const handleApply = async () => {

    if (!startDate || !endDate) {
      return;
    }

    try {

      await autoFetchStats(
        placement,
        domain,
        countryCode,
        startDate,
        endDate
      );

    } catch (err) {

      console.error(err);
    }
  };

  // ====================================
  // RESET
  // ====================================
  const handleReset = () => {

    setSelectedCountry("");
    setDomain("");
    setPlacement("");

    const today = new Date();

    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(
      today.getDate() - 7
    );

    setDateRange([
      sevenDaysAgo,
      today,
    ]);

    dispatch(
      getAdsterraStats({
        start_date: formatDate(sevenDaysAgo),
        end_date: formatDate(today),
        groupBy,
      })
    );

    dispatch(
      getSmartLinkStats({
        start_date: formatDate(sevenDaysAgo),
        end_date: formatDate(today),
        groupBy,
      })
    );
  };

  // ====================================
  // GROUP DATA
  // ====================================
  const groupedData = useMemo(() => {

    // ====================================
    // DATE => OLD DB DATA
    // ====================================

    if (groupBy === "date") {

      if (
        !Array.isArray(data) ||
        !startDate ||
        !endDate
      ) {
        return [];
      }

      // ====================================
      // CREATE DATE RANGE
      // ====================================

      const allDates = [];

      const current =
        new Date(startDate);

      const last =
        new Date(endDate);

      current.setHours(0, 0, 0, 0);

      last.setHours(0, 0, 0, 0);

      while (current <= last) {

        allDates.push(
          new Date(current)
        );

        current.setDate(
          current.getDate() + 1
        );
      }

      // ====================================
      // CREATE API DATA MAP
      // ====================================

      const statsMap = {};

      data.forEach((item) => {

        const key = normalizeDate(
          item.date
        );

        statsMap[key] = {

          impressions: Number(
            item.impressions || 0
          ),

          clicks: Number(
            item.clicks || 0
          ),

          revenue: Number(
            item.revenue || 0
          ),

          placement:
            item.placement || "",
        };
      });

      // ====================================
      // RETURN FINAL DATA
      // ====================================

      return allDates.map(
        (date, index) => {

          const normalized =
            normalizeDate(date);

          const existing =
            statsMap[normalized];

          return {

            id: index,

            label:
              new Date(date)
                .toLocaleDateString(
                  "en-GB"
                ),

            impressions:
              existing?.impressions || 0,

            clicks:
              existing?.clicks || 0,

            revenue:
              existing?.revenue || 0,

            placement:
              existing?.placement || "",
          };
        }
      );
    }

    if (groupBy === "device") {

      if (!Array.isArray(data)) {
        return [];
      }

      const deviceMap = {};

      data.forEach((item) => {

        const key =
          item.device || "Unknown";

        if (!deviceMap[key]) {

          deviceMap[key] = {
            label: key,
            impressions: 0,
            clicks: 0,
            revenue: 0,
          };
        }

        deviceMap[key].impressions +=
          Number(item.impressions || 0);

        deviceMap[key].clicks +=
          Number(item.clicks || 0);

        deviceMap[key].revenue +=
          Number(item.revenue || 0);
      });

      return Object.values(deviceMap);
    }


    if (groupBy === "os") {

      if (!Array.isArray(data)) {
        return [];
      }

      const osMap = {};

      data.forEach((item) => {

        const key =
          item.osName?.trim() || "No Data";

        if (!osMap[key]) {

          osMap[key] = {
            label: key,
            impressions: 0,
            clicks: 0,
            revenue: 0,
          };
        }

        osMap[key].impressions +=
          Number(item.impressions || 0);

        osMap[key].clicks +=
          Number(item.clicks || 0);

        osMap[key].revenue +=
          Number(item.revenue || 0);
      });

      return Object.values(osMap);
    }

    if (groupBy === "browser") {

      if (!Array.isArray(data)) {
        return [];
      }

      const browserMap = {};

      data.forEach((item) => {

        const key =
          item.browserName?.trim() || "No Data";

        if (!browserMap[key]) {

          browserMap[key] = {
            label: key,
            impressions: 0,
            clicks: 0,
            revenue: 0,
          };
        }

        browserMap[key].impressions +=
          Number(item.impressions || 0);

        browserMap[key].clicks +=
          Number(item.clicks || 0);

        browserMap[key].revenue +=
          Number(item.revenue || 0);
      });

      return Object.values(browserMap);
    }


    if (
      !Array.isArray(
        groupedReducerData
      )
    ) {
      return [];
    }

    return groupedReducerData.map(
      (item) => ({
        label:
          item.label ||
          item.country ||
          item.device ||
          item.osName ||
          item.browserName ||
          "Unknown",

        impressions:
          Number(
            item.impressions || 0
          ),

        clicks:
          Number(
            item.clicks || 0
          ),

        revenue:
          Number(
            item.revenue || 0
          ),
      })
    );

  }, [
    data,
    groupedReducerData,
    groupBy,
    startDate,
    endDate,
  ]);

  // ====================================
  // TOTALS
  // ====================================
  const calculatedTotals =
    groupBy === "date"
      ? groupedData.reduce(
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
      )
      : {
        impressions: Number(
          totals?.totalImpressions || 0
        ),

        clicks: Number(
          totals?.totalClicks || 0
        ),

        revenue: Number(
          totals?.totalRevenue || 0
        ),
      };

  // ====================================
  // EXPORT CSV
  // ====================================
  const exportToCSV = () => {
    const headers = [groupBy.toUpperCase(), "Impressions", "Clicks", "CTR", "CPM", "Revenue"];
    const rows = groupedData.map((item) => {
      const impressions = Number(item.impressions || 0);
      const clicks = Number(item.clicks || 0);
      const revenue = Number(item.revenue || 0);
      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
      const cpm = impressions > 0 ? (revenue / impressions) * 1000 : 0;

      return [
        item.label,
        impressions,
        clicks,
        ctr.toFixed(3) + "%",
        cpm.toFixed(3),
        "$" + revenue.toFixed(3),
      ];
    });

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `statistics_${groupBy}_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Stats Cards Data
  const statsCards = [
    {
      title: "Total Impressions",
      value: calculatedTotals.impressions.toLocaleString(),
      icon: Eye,
      color: "from-blue-500 to-blue-600",
      bgGradient: "bg-gradient-to-br",
    },
    {
      title: "Total Clicks",
      value: calculatedTotals.clicks.toLocaleString(),
      icon: MousePointerClick,
      color: "from-green-500 to-green-600",
      bgGradient: "bg-gradient-to-br",
    },
    {
      title: "CTR",
      value: `${calculatedTotals.impressions > 0
        ? ((calculatedTotals.clicks / calculatedTotals.impressions) * 100).toFixed(3)
        : "0.00"}%`,
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      bgGradient: "bg-gradient-to-br",
    },
    {
      title: "CPM",
      value: `$${calculatedTotals.impressions > 0
        ? ((calculatedTotals.revenue / calculatedTotals.impressions) * 1000).toFixed(3)
        : "0.000"}`,
      icon: DollarSign,
      color: "from-orange-500 to-orange-600",
      bgGradient: "bg-gradient-to-br",
    },
    {
      title: "Total Revenue",
      value: `$${calculatedTotals.revenue.toFixed(3)}`,
      icon: Zap,
      color: "from-yellow-500 to-yellow-600",
      bgGradient: "bg-gradient-to-br",
    },
  ];

  return (
    <div className="min-h-screen md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            Statistics Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Track your ad performance and revenue metrics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {statsCards.map((card, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-gradient-to-br opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${card.bgGradient} ${card.color} shadow-lg`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{card.title}</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {card.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* FILTERS SECTION - Collapsible */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
          <button
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-green-500" />
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                Advanced Filters
              </h2>
              {!isFilterVisible && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {placement || domain || selectedCountry ? "Active filters" : "No filters"}
                </span>
              )}
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isFilterVisible ? "rotate-180" : ""
                }`}
            />
          </button>

          <div
            className={`transition-all duration-300 ease-in-out ${isFilterVisible ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
              } overflow-hidden`}
          >
            <div className="p-6 pt-0 border-t border-gray-200 dark:border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
                {/* DATE */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date Range
                  </label>
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => {

                      if (!update) return;

                      const [start, end] = update;

                      setDateRange([
                        start,
                        end,
                      ]);
                    }}
                    dateFormat="dd/MM/yyyy"
                    monthsShown={1}
                    maxDate={new Date()}
                    isClearable={false}
                    placeholderText="Select date range"
                    className="w-full border-2 border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 dark:text-gray-300 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  />
                </div>

                {/* COUNTRY */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Country
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full border-2 border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 dark:text-gray-300 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  >
                    <option value="">All Countries</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DOMAIN */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Link2 className="w-4 h-4" />
                    Domain
                  </label>
                  <input
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="yourdomain.com"
                    className="w-full border-2 border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 dark:text-gray-300 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  />
                </div>

                {/* PLACEMENT */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Code2 className="w-4 h-4" />
                    Placement ID
                  </label>
                  <input
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value)}
                    placeholder="Enter placement ID"
                    className="w-full border-2 border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 dark:text-gray-300 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  />
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={handleApply}
                  disabled={loading || fetchLoading || smartlinkLoading}
                  className="relative overflow-hidden group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  <span className="relative z-10">
                    {fetchLoading || smartlinkLoading ? "Fetching..." : loading ? "Loading..." : "APPLY FILTERS"}
                  </span>
                </button>

                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 border-2 border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500 px-6 py-2.5 rounded-xl font-medium transition-all hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  <RefreshCw className="w-4 h-4" />
                  RESET
                </button>
              </div>

              {(smartlinkError) && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                  ❌ Fetch Failed: {smartlinkError}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* GROUP TABS */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Country", value: "country", icon: Globe },
            { label: "Date", value: "date", icon: Calendar },
            { label: " Device", value: "device", icon: Smartphone },
            { label: "OS", value: "os", icon: Monitor },
            { label: " Browser", value: "browser", icon: Globe2 },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setGroupBy(tab.value)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${groupBy === tab.value
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25 scale-105"
                : "bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:border-green-500 hover:scale-105"
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* TABLE CARD */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Performance Metrics
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Grouped by {groupBy}
              </p>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-all font-medium"
            >
              <Download className="w-4 h-4" />
              EXPORT CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-900/50">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {groupBy.toUpperCase()}
                  </th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-400">
                    <div className="flex items-center justify-end gap-1">
                      <Eye className="w-4 h-4" />
                      Impressions
                    </div>
                  </th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-400">
                    <div className="flex items-center justify-end gap-1">
                      <MousePointerClick className="w-4 h-4" />
                      Clicks
                    </div>
                  </th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-400">
                    <div className="flex items-center justify-end gap-1">
                      <TrendingUp className="w-4 h-4" />
                      CTR
                    </div>
                  </th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-400">
                    <div className="flex items-center justify-end gap-1">
                      <DollarSign className="w-4 h-4" />
                      CPM
                    </div>
                  </th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-400">
                    <div className="flex items-center justify-end gap-1">
                      <Zap className="w-4 h-4" />
                      Revenue
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {groupedData.length > 0 ? (
                  groupedData.map((item, index) => {
                    const impressions = Number(item.impressions || 0);
                    const clicks = Number(item.clicks || 0);
                    const revenue = Number(item.revenue || 0);
                    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
                    const cpm = impressions > 0 ? (revenue / impressions) * 1000 : 0;

                    return (
                      <tr
                        key={index}
                        className="border-t border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group"
                      >
                        <td className="p-4 font-medium text-gray-900 dark:text-white">
                          {item.label}
                        </td>
                        <td className="p-4 text-right font-mono text-gray-700 dark:text-gray-300">
                          {impressions.toLocaleString()}
                        </td>
                        <td className="p-4 text-right font-mono text-gray-700 dark:text-gray-300">
                          {clicks.toLocaleString()}
                        </td>
                        <td className="p-4 text-right font-mono text-gray-700 dark:text-gray-300">
                          <span className={ctr > 2 ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"}>
                            {ctr.toFixed(3)}%
                          </span>
                        </td>
                        <td className="p-4 text-right font-mono text-gray-700 dark:text-gray-300">
                          ${cpm.toFixed(3)}
                        </td>
                        <td className="p-4 text-right font-mono text-green-600 dark:text-green-400 font-semibold">
                          ${revenue.toFixed(3)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="p-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <BarChart3 className="w-12 h-12 text-gray-400" />
                        <p className="text-gray-500 dark:text-gray-400 text-center">
                          {loading
                            ? "Loading statistics..."
                            : groupBy === "os"
                              ? "No OS data to show here yet"
                              : groupBy === "browser"
                                ? "No Browser data to show here yet"
                                : groupBy === "device"
                                  ? "No Device data to show here yet"
                                  : groupBy === "country"
                                    ? "No Country data to show here yet"
                                    : "No stats available for selected dates"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>

              {groupedData.length > 0 && (
                <tfoot>
                  <tr className="border-t-2 border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900/50">
                    <td className="p-4 font-bold text-gray-900 dark:text-white">Total</td>
                    <td className="p-4 text-right font-bold font-mono text-gray-900 dark:text-white">
                      {calculatedTotals.impressions.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-bold font-mono text-gray-900 dark:text-white">
                      {calculatedTotals.clicks.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-bold text-gray-900 dark:text-white">
                      {calculatedTotals.impressions > 0
                        ? ((calculatedTotals.clicks / calculatedTotals.impressions) * 100).toFixed(3)
                        : "0.00"}
                      %
                    </td>
                    <td className="p-4 text-right font-bold font-mono text-gray-900 dark:text-white">
                      $
                      {calculatedTotals.impressions > 0
                        ? ((calculatedTotals.revenue / calculatedTotals.impressions) * 1000).toFixed(3)
                        : "0.000"}
                    </td>
                    <td className="p-4 text-right font-bold font-mono text-green-600 dark:text-green-400">
                      ${calculatedTotals.revenue.toFixed(3)}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;