import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Calendar,
  MousePointerClick,
  TrendingUp,
  DollarSign,
  BarChart3,
  Download,
  RefreshCw,
  Filter,
  ChevronDown,
  Eye,
  Zap,
  Globe,
  Search,
  X
} from "lucide-react";

const WebsiteStatistics = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  
  // Get website data from location state
  const initialWebsiteId = location.state?.websiteId || "";
  const initialDomain = location.state?.domain || "";
  const source = location.state?.source || "";

  // 📅 DATE SETUP
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  const [dateRange, setDateRange] = useState([sevenDaysAgo, today]);
  const [startDate, endDate] = dateRange;

  // 🎯 FILTERS
  const [selectedWebsite, setSelectedWebsite] = useState(initialDomain || "");
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [isDomainDropdownOpen, setIsDomainDropdownOpen] = useState(false);
  const [domainSearchTerm, setDomainSearchTerm] = useState("");

  // 📊 GROUP BY
  const [groupBy, setGroupBy] = useState("date");

  // 📦 REDUX STATE
  const {
    calculatedWebsiteStats,
    calculatedWebsiteTotals,
    loading,
  } = useSelector((state) => state.website);

  // Get all unique websites for dropdown
  const availableWebsites = useMemo(() => {
    if (!Array.isArray(calculatedWebsiteStats)) return [];
    
    const websiteMap = new Map();
    calculatedWebsiteStats.forEach((item) => {
      if (item.website && !websiteMap.has(item.website)) {
        websiteMap.set(item.website, {
          name: item.website,
          id: item._id || item.website
        });
      }
    });
    
    return Array.from(websiteMap.values());
  }, [calculatedWebsiteStats]);

  // Filtered domains based on search
  const filteredDomains = useMemo(() => {
    if (!domainSearchTerm) return availableWebsites;
    return availableWebsites.filter(website =>
      website.name.toLowerCase().includes(domainSearchTerm.toLowerCase())
    );
  }, [availableWebsites, domainSearchTerm]);

  // Format date for API
  const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const normalizeDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // ==========================================
  // FILTER DATA FOR SELECTED WEBSITE
  // ==========================================
  const filteredStats = useMemo(() => {
    if (!Array.isArray(calculatedWebsiteStats)) return [];
    
    let filtered = [...calculatedWebsiteStats];
    
    // Filter by selected website
    if (selectedWebsite) {
      filtered = filtered.filter(
        (item) => 
          item.website?.toLowerCase() === selectedWebsite.toLowerCase() ||
          item.website?.toLowerCase().includes(selectedWebsite.toLowerCase())
      );
    }
    
    // Filter by date range
    if (startDate && endDate) {
      const startStr = formatDate(startDate);
      const endStr = formatDate(endDate);
      
      filtered = filtered.filter((item) => {
        if (!item.date) return false;
        const itemDate = normalizeDate(new Date(item.date));
        return itemDate >= startStr && itemDate <= endStr;
      });
    }
    
    return filtered;
  }, [calculatedWebsiteStats, selectedWebsite, startDate, endDate]);

  // ==========================================
  // PROCESS DATA FOR TABLE
  // ==========================================
  const processedData = useMemo(() => {
    if (!filteredStats.length) return [];

    if (groupBy === "date") {
      // Group by date
      const dateMap = new Map();
      
      filteredStats.forEach((item) => {
        const date = normalizeDate(new Date(item.date));
        if (!dateMap.has(date)) {
          dateMap.set(date, { date, impressions: 0, clicks: 0, revenue: 0 });
        }
        
        const entry = dateMap.get(date);
        
        // Sum up placements data
        if (item.placements && Array.isArray(item.placements)) {
          item.placements.forEach((p) => {
            entry.impressions += Number(p.impressions || 0);
            entry.clicks += Number(p.clicks || 0);
            entry.revenue += Number(p.revenue || 0);
          });
        } else {
          entry.impressions += Number(item.impressions || 0);
          entry.clicks += Number(item.clicks || 0);
          entry.revenue += Number(item.revenue || 0);
        }
      });
      
      return Array.from(dateMap.values())
        .map((item) => ({
          ...item,
          label: new Date(item.date).toLocaleDateString("en-GB"),
          ctr: item.impressions > 0 ? (item.clicks / item.impressions) * 100 : 0,
          cpm: item.impressions > 0 ? (item.revenue / item.impressions) * 1000 : 0,
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    // Group by placement/ad unit
    if (groupBy === "placement") {
      const placementMap = new Map();
      
      filteredStats.forEach((item) => {
        if (item.placements && Array.isArray(item.placements)) {
          item.placements.forEach((p) => {
            const placementId = p.placementId || p._id || "Unknown";
            if (!placementMap.has(placementId)) {
              placementMap.set(placementId, {
                label: placementId,
                impressions: 0,
                clicks: 0,
                revenue: 0,
              });
            }
            const entry = placementMap.get(placementId);
            entry.impressions += Number(p.impressions || 0);
            entry.clicks += Number(p.clicks || 0);
            entry.revenue += Number(p.revenue || 0);
          });
        }
      });
      
      return Array.from(placementMap.values()).map((item) => ({
        ...item,
        ctr: item.impressions > 0 ? (item.clicks / item.impressions) * 100 : 0,
        cpm: item.impressions > 0 ? (item.revenue / item.impressions) * 1000 : 0,
      }));
    }
    
    // Default: return as is
    return filteredStats.map((item) => {
      let impressions = 0, clicks = 0, revenue = 0;
      
      if (item.placements && Array.isArray(item.placements)) {
        item.placements.forEach((p) => {
          impressions += Number(p.impressions || 0);
          clicks += Number(p.clicks || 0);
          revenue += Number(p.revenue || 0);
        });
      } else {
        impressions = Number(item.impressions || 0);
        clicks = Number(item.clicks || 0);
        revenue = Number(item.revenue || 0);
      }
      
      return {
        date: item.date,
        label: item.date ? new Date(item.date).toLocaleDateString("en-GB") : "Unknown",
        impressions,
        clicks,
        revenue,
        ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
        cpm: impressions > 0 ? (revenue / impressions) * 1000 : 0,
      };
    });
  }, [filteredStats, groupBy]);

  // ==========================================
  // TOTALS
  // ==========================================
  const totals = useMemo(() => {
    return {
      impressions: processedData.reduce((sum, d) => sum + d.impressions, 0),
      clicks: processedData.reduce((sum, d) => sum + d.clicks, 0),
      revenue: processedData.reduce((sum, d) => sum + d.revenue, 0),
      ctr: processedData.reduce((sum, d) => sum + d.impressions, 0) > 0
        ? (processedData.reduce((sum, d) => sum + d.clicks, 0) / processedData.reduce((sum, d) => sum + d.impressions, 0)) * 100
        : 0,
      cpm: processedData.reduce((sum, d) => sum + d.impressions, 0) > 0
        ? (processedData.reduce((sum, d) => sum + d.revenue, 0) / processedData.reduce((sum, d) => sum + d.impressions, 0)) * 1000
        : 0,
    };
  }, [processedData]);

  // ==========================================
  // STATS CARDS
  // ==========================================
  const statsCards = [
    { title: "Total Impressions", value: totals.impressions.toLocaleString(), icon: Eye, color: "from-blue-500 to-blue-600" },
    { title: "Total Clicks", value: totals.clicks.toLocaleString(), icon: MousePointerClick, color: "from-purple-500 to-purple-600" },
    { title: "CTR", value: `${totals.ctr.toFixed(2)}%`, icon: TrendingUp, color: "from-orange-500 to-orange-600" },
    { title: "Total Revenue", value: `$${totals.revenue.toFixed(4)}`, icon: DollarSign, color: "from-green-500 to-green-600" },
  ];

  // ==========================================
  // EXPORT CSV
  // ==========================================
  const exportToCSV = () => {
    const headers = [groupBy.toUpperCase(), "Impressions", "Clicks", "CTR", "CPM", "Revenue"];
    const rows = processedData.map((item) => [
      item.label,
      item.impressions,
      item.clicks,
      item.ctr.toFixed(2) + "%",
      "$" + item.cpm.toFixed(4),
      "$" + item.revenue.toFixed(4),
    ]);
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `website_stats_${selectedWebsite || "all"}_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ==========================================
  // HANDLE RESET
  // ==========================================
  const handleReset = () => {
    setSelectedWebsite("");
    setDateRange([sevenDaysAgo, today]);
    setGroupBy("date");
  };

  // ==========================================
  // GROUP TABS
  // ==========================================
  const groupTabs = [
    { label: "Date", value: "date", icon: Calendar },
    { label: "Placement", value: "placement", icon: Globe },
  ];

  return (
    <div className="min-h-screen md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Website Statistics Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {selectedWebsite ? `Tracking: ${selectedWebsite}` : "Track your website performance metrics"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((card, idx) => (
            <div key={idx} className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="p-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} shadow-lg inline-block`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1 mt-3">{card.title}</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{card.value}</p>
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
              <Filter className="w-5 h-5 text-indigo-500" />
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                Advanced Filters
              </h2>
              {!isFilterVisible && (selectedWebsite || (startDate && endDate)) && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedWebsite ? `Website: ${selectedWebsite}` : "Active filters"}
                </span>
              )}
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isFilterVisible ? "rotate-180" : ""}`}
            />
          </button>

          <div
            className={`transition-all duration-300 ease-in-out ${isFilterVisible ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
              } overflow-hidden`}
          >
            <div className="p-6 pt-0 border-t border-gray-200 dark:border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                {/* WEBSITE DOMAIN - Custom Dropdown */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Website Domain
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDomainDropdownOpen(!isDomainDropdownOpen)}
                      className="w-full border-2 border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 dark:text-gray-300 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all flex items-center justify-between"
                    >
                      <span className={selectedWebsite ? "text-gray-900 dark:text-white" : "text-gray-400"}>
                        {selectedWebsite || "Select a website"}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isDomainDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isDomainDropdownOpen && (
                      <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden">
                        <div className="p-2 border-b border-gray-200 dark:border-slate-700">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search websites..."
                              value={domainSearchTerm}
                              onChange={(e) => setDomainSearchTerm(e.target.value)}
                              className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-sm bg-gray-50 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {filteredDomains.length > 0 ? (
                            filteredDomains.map((website) => (
                              <button
                                key={website.id}
                                onClick={() => {
                                  setSelectedWebsite(website.name);
                                  setIsDomainDropdownOpen(false);
                                  setDomainSearchTerm("");
                                }}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-between"
                              >
                                <span className="text-gray-900 dark:text-white">{website.name}</span>
                                {selectedWebsite === website.name && (
                                  <span className="text-indigo-500 text-xs">✓</span>
                                )}
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                              No websites found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* DATE RANGE */}
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
                      setDateRange([start, end]);
                    }}
                    dateFormat="dd/MM/yyyy"
                    monthsShown={1}
                    maxDate={new Date()}
                    isClearable={false}
                    placeholderText="Select date range"
                    className="w-full border-2 border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 dark:text-gray-300 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 border-2 border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500 px-6 py-2.5 rounded-xl font-medium transition-all hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  <RefreshCw className="w-4 h-4" />
                  RESET
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* GROUP TABS */}
        <div className="w-full overflow-x-auto scrollbar-thin pb-2">
          <div className="flex gap-2 min-w-max">
            {groupTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setGroupBy(tab.value)}
                className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                  groupBy === tab.value
                    ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                    : "bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:border-indigo-500"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
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
              disabled={processedData.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
                    {groupBy === "date" ? "DATE" : "PLACEMENT ID"}
                  </th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-400">
                    <div className="flex items-center justify-end gap-1"><Eye className="w-4 h-4" /> Impressions</div>
                  </th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-400">
                    <div className="flex items-center justify-end gap-1"><MousePointerClick className="w-4 h-4" /> Clicks</div>
                  </th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-400">
                    <div className="flex items-center justify-end gap-1"><TrendingUp className="w-4 h-4" /> CTR</div>
                  </th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-400">
                    <div className="flex items-center justify-end gap-1"><DollarSign className="w-4 h-4" /> CPM</div>
                  </th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-400">
                    <div className="flex items-center justify-end gap-1"><Zap className="w-4 h-4" /> Revenue</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {!loading && processedData.length > 0 ? (
                  processedData.map((item, index) => (
                    <tr key={index} className="border-t border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="p-4 font-medium text-gray-900 dark:text-white">{item.label}</td>
                      <td className="p-4 text-right font-mono text-gray-700 dark:text-gray-300">{item.impressions.toLocaleString()}</td>
                      <td className="p-4 text-right font-mono text-gray-700 dark:text-gray-300">{item.clicks.toLocaleString()}</td>
                      <td className="p-4 text-right font-mono text-gray-700 dark:text-gray-300">
                        <span className={item.ctr > 2 ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"}>
                          {item.ctr.toFixed(2)}%
                        </span>
                      </td>
                      <td className="p-4 text-right font-mono text-gray-700 dark:text-gray-300">${item.cpm.toFixed(4)}</td>
                      <td className="p-4 text-right font-mono text-green-600 dark:text-green-400 font-semibold">${item.revenue.toFixed(4)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <BarChart3 className="w-12 h-12 text-gray-400" />
                        <p className="text-gray-500 dark:text-gray-400">
                          {loading ? "Loading statistics..." : 
                           !selectedWebsite ? "Please select a website to view statistics" :
                           "No stats available for the selected website and date range"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
              {!loading && processedData.length > 0 && (
                <tfoot>
                  <tr className="border-t-2 border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900/50">
                    <td className="p-4 font-bold text-gray-900 dark:text-white">Total</td>
                    <td className="p-4 text-right font-bold font-mono text-gray-900 dark:text-white">{totals.impressions.toLocaleString()}</td>
                    <td className="p-4 text-right font-bold font-mono text-gray-900 dark:text-white">{totals.clicks.toLocaleString()}</td>
                    <td className="p-4 text-right font-bold text-gray-900 dark:text-white">{totals.ctr.toFixed(2)}%</td>
                    <td className="p-4 text-right font-bold font-mono text-gray-900 dark:text-white">${totals.cpm.toFixed(4)}</td>
                    <td className="p-4 text-right font-bold font-mono text-green-600 dark:text-green-400">${totals.revenue.toFixed(4)}</td>
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

export default WebsiteStatistics;