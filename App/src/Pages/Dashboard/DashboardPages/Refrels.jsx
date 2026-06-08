import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  FaUsers,
  FaCopy,
  FaCheck,
  FaGift,
  FaChartLine,
  FaUserPlus,
  FaDollarSign,
  FaTrophy,
  FaCrown,
  FaStar,
  FaShare,
  FaWhatsapp,
  FaTwitter,
  FaTelegram,
  FaLink,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { toast } from "react-toastify";

const Refrels = () => {
  const { user } = useSelector((state) => state.auth);

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    totalEarnings: 0,
    currentTier: "Silver",
    commissionRate: 0,
    lifetimeReferrals: 0,
    nextTier: null,
    referrals: [],
    revenue: 0,
  });

  // =========================
  // GET REF CODE FROM URL
  // =========================

  const getReferralCodeFromURL = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get("ref");

    if (refCode && !localStorage.getItem("referredBy")) {
      localStorage.setItem("referredBy", refCode);
      console.log("Referred by code:", refCode);
    }

    return refCode;
  }, []);

  // =========================
  // GET REF LINK
  // =========================

  const getReferralLink = useCallback(() => {
    if (!user) return "";
    const baseUrl = `${window.location.origin}/register`;
    const refCode = (user.referralCode || user.email)
      ?.toLowerCase()
      .replace(/\s+/g, "");
    return `${baseUrl}?ref=${refCode}`;
  }, [user]);

  const referralLink = getReferralLink();

  // =========================
  // SHARE
  // =========================

  const shareViaSocial = async (platform) => {
    const message = `Join me on this amazing platform! Use my referral link: ${referralLink}`;

    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`, "_blank");
        break;
      case "telegram":
        window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent("Join me on this platform!")}`, "_blank");
        break;
      default:
        copyToClipboard();
    }
  };

  // =========================
  // CALCULATE TIER (Only Silver, Gold, Platinum)
  // =========================

  const calculateTier = (amount) => {
    if (amount >= 350) {
      return {
        name: "Platinum",
        rate: 15,
        icon: FaCrown,
        nextTarget: null,
      };
    }
    if (amount >= 200) {
      return {
        name: "Gold",
        rate: 12,
        icon: FaTrophy,
        nextTarget: { name: "Platinum", target: 350, progress: (amount / 350) * 100 },
      };
    }
    // Silver tier (0 to 199)
    return {
      name: "Silver",
      rate: 10,
      icon: FaStar,
      nextTarget: { name: "Gold", target: 200, progress: (amount / 200) * 100 },
    };
  };

  // =========================
  // GET USER WISE DATE REVENUE FROM lastReferralMap
  // =========================

  const getUserDateWiseRevenue = (userName) => {
    if (!referralStats.referrals || referralStats.referrals.length === 0) return [];
    
    const userEntries = referralStats.referrals.filter(item => 
      item?.name === userName || item?.userName === userName
    );
    
    const dateMap = new Map();
    
    userEntries.forEach(entry => {
      if (entry.date) {
        const dateObj = new Date(entry.date);
        const dateKey = dateObj.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        
        if (!dateMap.has(dateKey)) {
          dateMap.set(dateKey, {
            date: dateKey,
            fullDate: entry.date,
            myRevenue: Number(entry.amount) || 0,
            userRevenue: Number(entry.revenue) || 0,
            entries: []
          });
        } else {
          const dateData = dateMap.get(dateKey);
          dateData.myRevenue += Number(entry.amount) || 0;
          dateData.userRevenue += Number(entry.revenue) || 0;
        }
        
        const dateData = dateMap.get(dateKey);
        dateData.entries.push(entry);
      }
    });
    
    return Array.from(dateMap.values()).sort((a, b) => 
      new Date(b.fullDate) - new Date(a.fullDate)
    );
  };

  // =========================
  // TOGGLE DROPDOWN
  // =========================

  const toggleDropdown = (userName) => {
    if (openDropdown === userName) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(userName);
    }
  };

  // =========================
  // FETCH STATS FROM USER DATA - USING lastReferralMap
  // =========================

  const fetchReferralStats = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const lastReferralMap = user?.lastReferralMap || {};
      const referralHistory = user?.referralHistory || [];
      
      const mergedReferrals = referralHistory.map(historyItem => {
        let matchingEntry = null;
        
        for (const key in lastReferralMap) {
          const mapItem = lastReferralMap[key];
          if (mapItem.name === historyItem.name || mapItem.email === historyItem.email) {
            matchingEntry = mapItem;
            break;
          }
        }
        
        if (matchingEntry) {
          return {
            ...historyItem,
            amount: matchingEntry.amount || 0,
            revenue: matchingEntry.revenue || 0,
            percent: matchingEntry.percent || 10,
          };
        }
        
        return {
          ...historyItem,
          amount: historyItem.amount || 0,
          revenue: historyItem.revenue || 0,
        };
      });
      
      const totalEarnings = Object.values(lastReferralMap).reduce(
        (sum, item) => sum + (Number(item.amount) || 0), 
        0
      );
      
      const commissionRate = user?.referralPercent || 10;
      const tier = calculateTier(totalEarnings);

      setReferralStats({
        totalReferrals: user?.totalJoinedUsers || 0,
        totalEarnings: totalEarnings,
        currentTier: tier.name,
        commissionRate: commissionRate,
        lifetimeReferrals: user?.totalJoinedUsers || 0,
        nextTier: tier.nextTarget,
        referrals: mergedReferrals,
        revenue: user?.revenue || 0,
      });
      
      console.log("Merged Referrals with correct amounts:", mergedReferrals);
      console.log("Total Earnings from lastReferralMap:", totalEarnings);
      
    } catch (error) {
      console.error("Error fetching referral stats:", error);
      toast.error("Failed to load referral statistics");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    getReferralCodeFromURL();
    fetchReferralStats();
  }, [getReferralCodeFromURL, fetchReferralStats]);

  // =========================
  // COPY TO CLIPBOARD
  // =========================

  const copyToClipboard = async () => {
    if (!referralLink) {
      toast.error("Referral link not available");
      return;
    }
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  // =========================
  // FORMAT CURRENCY
  // =========================

  const formatCurrency = (amount) => {
    if (amount === 0) return `$0.00`;
    const numAmount = Number(amount);
    if (numAmount < 0.01 && numAmount > 0) {
      return `$${numAmount.toFixed(10)}`;
    }
    return `$${numAmount.toFixed(4)}`;
  };

  const formatCurrencySimple = (amount) => {
    const numAmount = Number(amount);
    if (numAmount === 0) return `$0.00`;
    if (numAmount < 0.01 && numAmount > 0) {
      return `$${numAmount.toFixed(8)}`;
    }
    return `$${numAmount.toFixed(4)}`;
  };

  // =========================
  // LOGIN CHECK
  // =========================

  if (!user) {
    return (
      <div className="w-full flex justify-center items-center py-20 bg-slate-100 dark:bg-slate-950">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center shadow-lg">
          <FaUsers className="text-5xl text-slate-500 mx-auto mb-4" />
          <h2 className="text-slate-900 dark:text-white text-2xl font-bold">Login Required</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Please login to view referral stats</p>
        </div>
      </div>
    );
  }

  const currentTier = calculateTier(referralStats.totalEarnings);
  const TierIcon = currentTier.icon;

  // Group referrals by user
  const uniqueUsers = [];
  const userMap = new Map();
  
  referralStats.referrals.forEach(ref => {
    const userName = ref?.name || "Unknown User";
    if (!userMap.has(userName)) {
      userMap.set(userName, {
        name: userName,
        totalMyRevenue: 0,
        totalUserRevenue: 0,
        count: 0,
        lastDate: ref.date
      });
    }
    const userData = userMap.get(userName);
    userData.totalMyRevenue += Number(ref.amount) || 0;
    userData.totalUserRevenue += Number(ref.revenue) || 0;
    userData.count += 1;
  });
  
  userMap.forEach((value, key) => {
    uniqueUsers.push(value);
  });

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-200 dark:from-slate-900 dark:to-slate-950 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 blur-3xl rounded-full -mt-32 -mr-32"></div>
          <div className="relative z-10 flex justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-2">
                Referral Program
                {referralStats.currentTier === "Platinum" && <FaCrown className="text-yellow-300" />}
              </h1>
              <p className="text-blue-100 mt-2">Invite friends & earn commissions</p>
              <p className="mt-3">Welcome back <span className="font-bold">{user.name || user.email}</span></p>
              <p className="text-sm text-blue-200 mt-1">Referral Code: <span className="font-mono">{user.referralCode}</span></p>
            </div>
            <div className="bg-white/20 rounded-xl px-6 py-4 text-center backdrop-blur-sm">
              <p className="text-sm flex items-center gap-1 justify-center"><TierIcon /> Current Tier</p>
              <h2 className="text-3xl font-bold">{referralStats.currentTier}</h2>
              <p className="text-sm">{referralStats.commissionRate}% Commission</p>
            </div>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg">
            <FaUserPlus className="text-blue-500 text-3xl mb-3" />
            <p className="text-slate-600 dark:text-slate-400 text-sm">Total Joined Users</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{referralStats.totalReferrals}</h2>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg">
            <FaDollarSign className="text-green-500 text-3xl mb-3" />
            <p className="text-slate-600 dark:text-slate-400 text-sm">Referral Earnings</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrencySimple(referralStats.totalEarnings)}</h2>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg">
            <FaChartLine className="text-purple-500 text-3xl mb-3" />
            <p className="text-slate-600 dark:text-slate-400 text-sm">Commission Rate</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{referralStats.commissionRate}%</h2>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg">
            <FaGift className="text-yellow-500 text-3xl mb-3" />
            <p className="text-slate-600 dark:text-slate-400 text-sm">Current Tier</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{referralStats.currentTier}</h2>
          </div>
        </div>

        {/* REFERRAL LINK SECTION */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg">
          <h2 className="text-slate-900 dark:text-white text-xl font-semibold mb-4 flex items-center gap-2">
            <FaShare className="text-blue-500" />
            Share Referral Link
          </h2>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
              <code className="text-slate-700 dark:text-slate-300 text-sm break-all">{referralLink}</code>
            </div>
            <button onClick={copyToClipboard} className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white flex items-center justify-center gap-2">
              {copied ? <FaCheck /> : <FaCopy />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => shareViaSocial("whatsapp")} className="bg-green-100 dark:bg-green-600/20 p-3 rounded-lg">
              <FaWhatsapp className="text-green-600 dark:text-green-400 text-xl" />
            </button>
            <button onClick={() => shareViaSocial("twitter")} className="bg-blue-100 dark:bg-blue-500/20 p-3 rounded-lg">
              <FaTwitter className="text-blue-600 dark:text-blue-400 text-xl" />
            </button>
            <button onClick={() => shareViaSocial("telegram")} className="bg-sky-100 dark:bg-sky-500/20 p-3 rounded-lg">
              <FaTelegram className="text-sky-600 dark:text-sky-400 text-xl" />
            </button>
            <button onClick={copyToClipboard} className="bg-slate-200 dark:bg-slate-700/30 p-3 rounded-lg">
              <FaLink className="text-slate-700 dark:text-slate-300 text-xl" />
            </button>
          </div>
        </div>

        {/* REFERRAL HISTORY - ACCORDION STYLE DROPDOWN */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg">
          <h2 className="text-slate-900 dark:text-white text-xl font-semibold mb-5 flex items-center gap-2">
            <FaUsers className="text-blue-500" />
            Referral History
            <span className="text-sm text-slate-500 ml-2">(Click on any user to see date-wise revenue)</span>
          </h2>

          {uniqueUsers.length > 0 ? (
            <div className="space-y-3">
              {uniqueUsers.map((userData, idx) => {
                const dateWiseData = getUserDateWiseRevenue(userData.name);
                const isOpen = openDropdown === userData.name;
                
                return (
                  <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    {/* User Header - Clickable */}
                    <div
                      onClick={() => toggleDropdown(userData.name)}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <FaUserPlus className="text-blue-600 dark:text-blue-400 text-sm" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {userData.name}
                          </h3>
                          <p className="text-xs text-slate-500">
                            {userData.count} referral{userData.count !== 1 ? 's' : ''} • Last: {userData.lastDate ? new Date(userData.lastDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-slate-500">My Refrel Income</p>
                          <p className="font-semibold text-green-600 dark:text-green-400">
                            {formatCurrencySimple(userData.totalMyRevenue)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-500">User Revenue</p>
                          <p className="font-semibold text-blue-600 dark:text-blue-400">
                            {formatCurrencySimple(userData.totalUserRevenue)}
                          </p>
                        </div>
                        {isOpen ? (
                          <FaChevronUp className="text-slate-400" />
                        ) : (
                          <FaChevronDown className="text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Dropdown Content - Date Wise Data */}
                    {isOpen && (
                      <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-900">
                        <div className="space-y-3">
                          {dateWiseData.map((dateData, dateIdx) => (
                            <div 
                              key={dateIdx}
                              className="bg-slate-50 dark:bg-slate-800/30 rounded-lg p-3"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <FaCalendarAlt className="text-blue-500 text-sm" />
                                <span className="font-medium text-slate-900 dark:text-white">
                                  {dateData.date}
                                </span>
                                {dateData.entries.length > 1 && (
                                  <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-xs">
                                    {dateData.entries.length} entries
                                  </span>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-green-50 dark:bg-green-900/20 rounded p-3">
                                  <p className="text-xs text-green-600 dark:text-green-400">My Refrel Amount (Exact)</p>
                                  <p className="text-lg font-bold text-green-700 dark:text-green-300">
                                    {formatCurrency(dateData.myRevenue)}
                                  </p>
                                  {dateData.myRevenue < 0.01 && dateData.myRevenue > 0 && (
                                    <p className="text-xs text-green-500 mt-1">Very small amount</p>
                                  )}
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3">
                                  <p className="text-xs text-blue-600 dark:text-blue-400">User Revenue</p>
                                  <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                                    {formatCurrency(dateData.userRevenue)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {/* Total for this user */}
                          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 mt-2">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs text-purple-600 dark:text-purple-400">Total My Revenue</p>
                                <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                                  {formatCurrency(userData.totalMyRevenue)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-purple-600 dark:text-purple-400">Total User Revenue</p>
                                <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                                  {formatCurrency(userData.totalUserRevenue)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <FaUsers className="text-5xl mx-auto mb-3 opacity-50" />
              <p>No referral history found</p>
              <p className="text-sm mt-2">Share your referral link to get started!</p>
            </div>
          )}
        </div>

        {/* TIER PROGRESS */}
        {referralStats.nextTier && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg">
            <h2 className="text-slate-900 dark:text-white text-xl font-semibold mb-4 flex items-center gap-2">
              <FaTrophy className="text-yellow-500" />
              Next Tier Progress
            </h2>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Progress to {referralStats.nextTier.name}</span>
              <span className="text-slate-600 dark:text-slate-400">
                {formatCurrencySimple(referralStats.totalEarnings)} / {formatCurrencySimple(referralStats.nextTier.target)}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all"
                style={{ width: `${Math.min(referralStats.nextTier.progress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Need {formatCurrencySimple(referralStats.nextTier.target - referralStats.totalEarnings)} more to reach {referralStats.nextTier.name} tier
            </p>
          </div>
        )}

        {/* INFO - Only Silver, Gold, Platinum */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <FaGift className="text-blue-500 text-2xl mt-1" />
            <div>
              <h3 className="text-blue-600 dark:text-blue-400 font-semibold text-lg">How it works</h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm mt-1">Invite friends using your referral link. Earn commission based on your total referral earnings.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-2 text-center">
                  <p className="font-bold text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                    <FaStar className="text-gray-500" /> Silver
                  </p>
                  <p className="text-sm">$0 - $199 → 10%</p>
                </div>
                <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-2 text-center">
                  <p className="font-bold text-yellow-600 dark:text-yellow-400 flex items-center justify-center gap-2">
                    <FaTrophy className="text-yellow-500" /> Gold
                  </p>
                  <p className="text-sm">$200 - $349 → 12%</p>
                </div>
                <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-2 text-center">
                  <p className="font-bold text-purple-600 dark:text-purple-400 flex items-center justify-center gap-2">
                    <FaCrown className="text-purple-500" /> Platinum
                  </p>
                  <p className="text-sm">$350+ → 15%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Refrels;