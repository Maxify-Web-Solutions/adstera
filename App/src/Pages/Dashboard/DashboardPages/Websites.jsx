import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";
import { getAllWebsites, getCalculatedWebsiteStats } from "../../../redux/slice/websiteSlice";
import AddWebsiteModal from "../../../Components/AddWebsiteModal";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Search,
    Plus,
    Moon,
    Sun,
    Globe,
    Tag,
    Lock,
    Code,
    Eye,
    Copy,
    Check,
    ExternalLink,
    AlertCircle,
    Clock,
} from "lucide-react";
import { IoStatsChart } from "react-icons/io5";

const Websites = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [expandedDomains, setExpandedDomains] = useState({});
    const [copiedId, setCopiedId] = useState(null);

    const { websites, loading } = useSelector((state) => state.website);
    const { calculatedWebsiteStats } = useSelector((state) => state.website);

    useEffect(() => {
        dispatch(getAllWebsites());
        dispatch(getCalculatedWebsiteStats());

        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setIsDarkMode(true);
            document.documentElement.classList.add("dark");
        }
    }, [dispatch]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get("openModal") === "true") setIsOpen(true);
    }, [location]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle("dark");
    };

    const toggleDomain = (domainId) => {
        setExpandedDomains(prev => ({
            ...prev,
            [domainId]: !prev[domainId]
        }));
    };

    const filteredWebsites = websites?.filter((item) => {
        const matchesSearch =
            item?.website?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.websiteCategory?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !selectedStatus || item?.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const isPendingOrRejected = (status) => status === "pending" || status === "rejected";
    const isStatsDisabled = (status) => status === "pending" || status === "rejected";

    const getWebsiteStats = (websiteName) => {
        const stats = calculatedWebsiteStats?.filter((w) => w.website === websiteName) || [];
        const totalImpressions = stats.reduce((sum, stat) =>
            sum + (stat?.placements?.reduce((s, p) => s + (p.impressions || 0), 0) || 0), 0);
        const totalClicks = stats.reduce((sum, stat) =>
            sum + (stat?.placements?.reduce((s, p) => s + (p.clicks || 0), 0) || 0), 0);
        const totalRevenue = stats.reduce((sum, stat) =>
            sum + (stat?.placements?.reduce((s, p) => s + (p.revenue || 0), 0) || 0), 0);
        const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

        return { totalImpressions, totalClicks, totalRevenue, ctr };
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getStatusStyles = (status) => {
        const styles = {
            active: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
            pending: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
            approved: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
            rejected: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
            inactive: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700",
        };
        return styles[status] || styles.inactive;
    };

    const getAdUnits = (website) => {
    const isPending = website.status === "pending";
    const isRejected = website.status === "rejected";
    const adStatus = isPending ? "Pending" : isRejected ? "Rejected" : "Active";

    return (website.placements || []).map((placement, idx) => ({
        id: `${website._id}_${idx}`,
        name: placement.adName || placement.type,
        placementId: placement.placementId,
        adUrl: placement.adUrl,
        status: adStatus,
        type: placement.type,
        sizes: placement.sizes || [],
    }));
};
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-950">
            <div className="max-w-[1400px] mx-auto p-4 md:p-6">
                {/* Dark Mode Button */}
                <button
                    onClick={toggleDarkMode}
                    className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300"
                >
                    {isDarkMode ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-slate-700" />}
                </button>

                {/* Header */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                            Websites
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and monitor your websites</p>
                    </div>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-semibold transition-all shadow-lg hover:shadow-xl"
                    >
                        <Plus className="w-4 h-4" /> Add Website
                    </button>
                </div>

                {/* Search & Filter */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 mb-6">
                    <div className="flex flex-col lg:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by website URL or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="inactive">Inactive</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                {/* Websites List - Collapsible Domains */}
                {!loading && filteredWebsites?.length > 0 ? (
                    <div className="space-y-4">
                        {filteredWebsites.map((website) => {
                            const disabled = isStatsDisabled(website.status);
                            const isPending = website.status === "pending";
                            const isRejected = website.status === "rejected";
                            const showStatsTable = !isPending && !isRejected && website.status === "active";
                            const stats = showStatsTable ? getWebsiteStats(website.website) : { totalImpressions: 0, totalClicks: 0, totalRevenue: 0, ctr: 0 };
                            const adUnits = getAdUnits(website);
                            const isExpanded = expandedDomains[website._id] || false;

                            return (
                                <div
                                    key={website._id}
                                    className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-all"
                                >
                                    {/* Domain Header - Clickable */}
                                    <div
                                        onClick={() => toggleDomain(website._id)}
                                        className="cursor-pointer p-5 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-gray-50 to-white dark:from-slate-800/50 dark:to-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-all"
                                    >
                                        <div className="flex flex-wrap items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {/* Expand/Collapse Icon */}
                                                    <div className="text-gray-400">
                                                        {isExpanded ? (
                                                            <IoChevronDown className="w-5 h-5" />
                                                        ) : (
                                                            <IoChevronForward className="w-5 h-5" />
                                                        )}
                                                    </div>
                                                    <Globe className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                                                        {website.website}
                                                    </h2>
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyles(website.status)}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${website.status === "active" ? "bg-green-500" :
                                                            website.status === "pending" ? "bg-yellow-500" :
                                                                website.status === "approved" ? "bg-blue-500" :
                                                                    website.status === "rejected" ? "bg-red-500" : "bg-gray-400"
                                                            }`} />
                                                        {website.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 mt-2 ml-7 flex-wrap">
                                                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                                        <Tag className="w-3.5 h-3.5" />
                                                        <span>{website.websiteCategory || "Uncategorized"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                                        <Code className="w-3.5 h-3.5" />
                                                        <span className="font-mono">ID: {website._id?.slice(-8)}</span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                copyToClipboard(website._id, `website_${website._id}`);
                                                            }}
                                                            className="ml-1 p-0.5 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition"
                                                        >
                                                            {copiedId === `website_${website._id}` ? (
                                                                <Check className="w-3 h-3 text-green-500" />
                                                            ) : (
                                                                <Copy className="w-3 h-3" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {/* // In the Statistics button onClick handler (around line 230-240) */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (!disabled) {
                                                            navigate("/dashboard/web-stats", {
                                                                state: { websiteId: website._id, domain: website.website, source: "website" },
                                                            });
                                                        }
                                                    }}
                                                    disabled={disabled}
                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${disabled
                                                        ? "bg-gray-100 dark:bg-slate-700 text-gray-400 cursor-not-allowed"
                                                        : "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                                                        }`}
                                                >
                                                    <IoStatsChart className="w-4 h-4" />
                                                    Statistics
                                                </button>
                                            </div>
                                        </div>

                                        {/* Stats Row - Only show if status is active/approved */}
                                        {showStatsTable && (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-3 border-t border-gray-100 dark:border-slate-700 ml-7">
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Impressions</p>
                                                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{stats.totalImpressions.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Clicks</p>
                                                    <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">{stats.totalClicks.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">CTR</p>
                                                    <p className="text-lg font-semibold text-orange-600 dark:text-orange-400">{stats.ctr.toFixed(2)}%</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Revenue</p>
                                                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">${stats.totalRevenue.toFixed(4)}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Pending/Rejected Message */}
                                        {(isPending || isRejected) && (
                                            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-slate-700 ml-7 text-yellow-600 dark:text-yellow-500">
                                                <Clock className="w-4 h-4" />
                                                <span className="text-sm">
                                                    {isPending ? "Website is pending approval. Statistics will appear once approved." : "Website has been rejected. Please contact support."}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Ad Units Section - Collapsible */}
                                    {isExpanded && (
                                        <div className="p-5 bg-gray-50 dark:bg-slate-900/20">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                                    Ad Units ({adUnits.length})
                                                </h3>
                                            </div>

                                            <div className="space-y-3">
                                                {/* Ad Units Table Header */}
                                                <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-slate-800 rounded-lg">
                                                    <div className="col-span-5">Ad Unit</div>
                                                    <div className="col-span-3">Placement ID</div>
                                                    <div className="col-span-2">Status</div>
                                                    <div className="col-span-2 text-right">Actions</div>
                                                </div>

                                                {adUnits.map((ad, idx) => (
                                                    <div
                                                        key={ad.id}
                                                        className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all"
                                                    >
                                                        {/* Ad Unit Name */}
                                                        <div className="col-span-1 md:col-span-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                                                    <Code className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-gray-900 dark:text-white text-base">
                                                                        {ad.name}
                                                                    </p>
                                                                    <p className="text-xs text-gray-400 md:hidden mt-1">{ad.placementId}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Placement ID */}
                                                        <div className="col-span-1 md:col-span-3">
                                                            <p className="text-sm font-mono text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-900 px-3 py-1.5 rounded-lg inline-block">
                                                                {ad.placementId}
                                                            </p>
                                                        </div>

                                                        {/* Status */}
                                                        <div className="col-span-1 md:col-span-2">
                                                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${ad.status === "Active"
                                                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                                                : ad.status === "Pending"
                                                                    ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                                                                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                                                }`}>
                                                                <span className={`w-2 h-2 rounded-full ${ad.status === "Active" ? "bg-green-500" :
                                                                    ad.status === "Pending" ? "bg-yellow-500" : "bg-red-500"
                                                                    }`} />
                                                                {ad.status}
                                                            </span>
                                                        </div>

                                                        {/* Actions - Larger Buttons */}
                                                        <div className="col-span-1 md:col-span-2">
                                                            <div className="flex items-center justify-start md:justify-end gap-3">
                                                                <button
                                                                    onClick={() => {
                                                                        if (ad.status === "Active") {
                                                                            navigate("/dashboard/statistics", {
                                                                                state: { placementId: ad.placementId, source: "smartlink", domain: website.website }
                                                                            });
                                                                        }
                                                                    }}
                                                                    disabled={ad.status !== "Active"}
                                                                    className={`p-2 rounded-lg transition-all ${ad.status === "Active"
                                                                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                                                                        : "bg-gray-100 dark:bg-slate-700 text-gray-400 cursor-not-allowed"
                                                                        }`}
                                                                    title="Statistics"
                                                                >
                                                                    <Eye className="w-5 h-5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        if (ad.status === "Active") {
                                                                            // About modal logic
                                                                            console.log("About:", ad);
                                                                        }
                                                                    }}
                                                                    disabled={ad.status !== "Active"}
                                                                    className={`p-2 rounded-lg transition-all ${ad.status === "Active"
                                                                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                                                                        : "bg-gray-100 dark:bg-slate-700 text-gray-400 cursor-not-allowed"
                                                                        }`}
                                                                    title="About"
                                                                >
                                                                    <ExternalLink className="w-5 h-5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        if (ad.status === "Active") {
                                                                            copyToClipboard(ad.adUrl, ad.id);
                                                                        }
                                                                    }}
                                                                    disabled={ad.status !== "Active"}
                                                                    className={`p-2 rounded-lg transition-all ${ad.status === "Active"
                                                                            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                                                                            : "bg-gray-100 dark:bg-slate-700 text-gray-400 cursor-not-allowed"
                                                                        }`}
                                                                    title="Get Code"
                                                                >
                                                                    {copiedId === ad.id ? (
                                                                        <Check className="w-5 h-5 text-green-500" />
                                                                    ) : (
                                                                        <Code className="w-5 h-5" />
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                {adUnits.length === 0 && (
                                                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                                                        <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                                        <p className="text-sm">No ad units configured for this website</p>
                                                        <button className="mt-3 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline">
                                                            + Add Ad Unit
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-12 text-center">
                        <Globe className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">
                            {loading ? "Loading websites..." : "No websites found"}
                        </p>
                        {!loading && (
                            <button onClick={() => setIsOpen(true)} className="mt-4 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline">
                                + Add your first website
                            </button>
                        )}
                    </div>
                )}

                <AddWebsiteModal isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
        </div>
    );
};

export default Websites;