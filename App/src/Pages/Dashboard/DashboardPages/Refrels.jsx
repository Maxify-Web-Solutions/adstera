import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { FaUsers, FaCopy, FaCheck, FaGift, FaChartLine, FaUserPlus, FaDollarSign, FaTrophy, FaCrown, FaStar, FaShare, FaWhatsapp, FaTwitter, FaTelegram, FaLink } from "react-icons/fa";
import { toast } from "react-toastify";

const Refrels = () => {
  const { user } = useSelector((state) => state.auth);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
    currentTier: "Bronze",
    commissionRate: 0,
    lifetimeReferrals: 0,
    nextTier: null,
    referrals: [],
    recentCommissions: []
  });

  // Get referral code from URL and store it
  const getReferralCodeFromURL = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode && !localStorage.getItem('referredBy')) {
      localStorage.setItem('referredBy', refCode);
      // You can also send this to backend when user registers
      console.log('Referred by code:', refCode);
    }
    return refCode;
  }, []);

  // Get referral link from user object
const getReferralLink = useCallback(() => {
  if (!user) return "";

  const baseUrl = `${window.location.origin}/register`;

  const refCode = (user.username || user.name || user.email)
    ?.toLowerCase()
    .replace(/\s+/g, "");

  return `${baseUrl}?ref=${refCode}`;
}, [user]);

  const referralLink = getReferralLink();

  // Share functionality
  const shareViaSocial = async (platform) => {
    const message = `Join me on this amazing platform! Use my referral link: ${referralLink}`;
    
    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Join me on this platform!')}`, '_blank');
        break;
      default:
        copyToClipboard();
    }
  };

  // Calculate commission based on referred user's total earnings
  const calculateCommission = (referredUserEarnings) => {
    if (referredUserEarnings >= 350) return 0.15;
    if (referredUserEarnings >= 200) return 0.12;
    if (referredUserEarnings >= 100) return 0.10;
    return 0;
  };

  // Calculate user's tier based on total earnings from referrals
  const calculateTier = (totalEarnings) => {
    if (totalEarnings >= 350) {
      return { 
        name: "Platinum", 
        rate: 15, 
        icon: FaCrown,
        color: "from-purple-400 to-pink-400",
        bgColor: "bg-purple-500/20",
        nextTarget: null 
      };
    } else if (totalEarnings >= 200) {
      return { 
        name: "Gold", 
        rate: 12, 
        icon: FaTrophy,
        color: "from-yellow-400 to-orange-400",
        bgColor: "bg-yellow-500/20",
        nextTarget: { name: "Platinum", target: 350, progress: (totalEarnings / 350) * 100 }
      };
    } else {
      return { 
        name: "Bronze", 
        rate: 10, 
        icon: FaStar,
        color: "from-amber-600 to-amber-700",
        bgColor: "bg-amber-500/20",
        nextTarget: { name: "Gold", target: 200, progress: (totalEarnings / 200) * 100 }
      };
    }
  };

  // Fetch referral stats from API
  const fetchReferralStats = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await api.get("/referrals/stats");
      // const data = response.data;
      
      // Mock data with more realistic values
      const mockReferrals = [
        { id: 1, name: "Rahul Tiwari", email: "rahu*******@gmail.com", earnings: 150, joinedDate: "2024-01-15", status: "active", lastActive: "2024-01-28" },
        { id: 2, name: "Sachin Sharma", email: "sach******@gmail.com", earnings: 250, joinedDate: "2024-01-20", status: "active", lastActive: "2024-01-29" },
        { id: 3, name: "Vivek Kumar", email: "dxsc*****@gmail.com", earnings: 50, joinedDate: "2024-01-25", status: "pending", lastActive: "2024-01-25" },
        { id: 4, name: "Ritik Sah", email: "riti*****@gmail.com", earnings: 380, joinedDate: "2024-01-10", status: "active", lastActive: "2024-01-28" },
      ];

      // Calculate earnings
      let totalEarnings = 0;
      let pendingEarnings = 0;
      
      const referralsWithCommissions = mockReferrals.map(ref => {
        const commissionRate = calculateCommission(ref.earnings);
        const commission = ref.earnings * commissionRate;
        
        if (ref.status === 'active') {
          totalEarnings += commission;
        } else {
          pendingEarnings += commission;
        }
        
        return {
          ...ref,
          commissionRate: commissionRate * 100,
          commission: commission
        };
      });

      const activeReferrals = referralsWithCommissions.filter(r => r.status === 'active').length;
      const tier = calculateTier(totalEarnings);
      
      setReferralStats({
        totalReferrals: mockReferrals.length,
        activeReferrals: activeReferrals,
        totalEarnings: totalEarnings,
        pendingEarnings: pendingEarnings,
        currentTier: tier.name,
        commissionRate: tier.rate,
        lifetimeReferrals: 12, // Total all-time referrals
        nextTier: tier.nextTarget,
        referrals: referralsWithCommissions,
        recentCommissions: [
          { id: 1, amount: 25.50, date: "2024-01-28", from: "John Doe" },
          { id: 2, amount: 30.00, date: "2024-01-27", from: "Jane Smith" },
          { id: 3, amount: 57.00, date: "2024-01-26", from: "Sarah Williams" },
        ]
      });
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

  const copyToClipboard = async () => {
    if (!referralLink) {
      toast.error("Referral link not available");
      return;
    }
    
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Referral link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="w-full flex justify-center items-center py-16 px-4">
        <div className="w-full max-w-3xl bg-slate-900/60 border border-slate-800 rounded-2xl p-10 text-center">
          <FaUsers className="text-slate-600 text-5xl mx-auto mb-4" />
          <p className="text-slate-400 text-lg">Please login to view your referral program</p>
          <p className="text-slate-500 text-sm mt-2">Join now and start earning!</p>
        </div>
      </div>
    );
  }

  const currentTierIcon = calculateTier(referralStats.totalEarnings).icon;
  const TierIcon = currentTierIcon;

  return (
    <div className="w-full flex justify-center items-center py-8 px-4 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="w-full max-w-6xl space-y-6">
        
        {/* Header Card with User Info */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full filter blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
                  Referral Program
                  {referralStats.currentTier === 'Platinum' && <FaCrown className="text-yellow-300 text-3xl" />}
                </h1>
                <p className="text-blue-100">Invite friends and earn lifetime commissions!</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm opacity-75">Welcome back,</span>
                  <span className="font-semibold">{user.name || user.email}</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 text-center">
                <p className="text-sm opacity-90 flex items-center gap-1">
                  <TierIcon className="text-yellow-300" />
                  Current Tier
                </p>
                <p className="text-2xl font-bold">{referralStats.currentTier}</p>
                <p className="text-xs opacity-75">{referralStats.commissionRate}% Commission</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid with Animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <FaUserPlus className="text-blue-400 text-2xl group-hover:scale-110 transition-transform" />
              <span className="text-xs text-slate-500">Lifetime</span>
            </div>
            <h3 className="text-slate-400 text-sm">Total Referrals</h3>
            <p className="text-3xl font-bold text-white mt-1">{referralStats.totalReferrals}</p>
            <p className="text-xs text-green-400 mt-2">{referralStats.activeReferrals} Active</p>
          </div>
          
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-green-500/50 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <FaDollarSign className="text-green-400 text-2xl group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-slate-400 text-sm">Total Earnings</h3>
            <p className="text-3xl font-bold text-white mt-1">{formatCurrency(referralStats.totalEarnings)}</p>
            {referralStats.pendingEarnings > 0 && (
              <p className="text-xs text-yellow-400 mt-2">{formatCurrency(referralStats.pendingEarnings)} Pending</p>
            )}
          </div>
          
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <FaChartLine className="text-purple-400 text-2xl group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-slate-400 text-sm">Commission Rate</h3>
            <p className="text-3xl font-bold text-white mt-1">{referralStats.commissionRate}%</p>
            <p className="text-xs text-slate-500 mt-2">Highest tier rate</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-yellow-500/50 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <FaGift className="text-yellow-400 text-2xl group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-slate-400 text-sm">Referral Link Clicks</h3>
            <p className="text-3xl font-bold text-white mt-1">245</p>
            <p className="text-xs text-green-400 mt-2">+12 this week</p>
          </div>
        </div>

        {/* Referral Link Section with Social Share */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <FaShare className="text-blue-400" />
            Share Your Referral Link
          </h3>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 bg-slate-800 rounded-lg p-3 border border-slate-700">
                <code className="text-slate-300 text-sm break-all">
                  {referralLink || "No referral code available"}
                </code>
              </div>
              <button
                onClick={copyToClipboard}
                disabled={!referralLink}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
            
            {/* Social Share Buttons */}
            <div className="flex gap-3 justify-center sm:justify-start">
              <button onClick={() => shareViaSocial('whatsapp')} className="bg-green-600/20 hover:bg-green-600/40 text-green-400 p-2 rounded-lg transition-all">
                <FaWhatsapp size={20} />
              </button>
              <button onClick={() => shareViaSocial('twitter')} className="bg-blue-400/20 hover:bg-blue-400/40 text-blue-400 p-2 rounded-lg transition-all">
                <FaTwitter size={20} />
              </button>
              <button onClick={() => shareViaSocial('telegram')} className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-500 p-2 rounded-lg transition-all">
                <FaTelegram size={20} />
              </button>
              <button onClick={copyToClipboard} className="bg-slate-700/20 hover:bg-slate-700/40 text-slate-400 p-2 rounded-lg transition-all">
                <FaLink size={20} />
              </button>
            </div>
          </div>
          
          <p className="text-slate-500 text-sm mt-3">
            💡 Share this link with friends. You'll earn commissions when they start earning!
          </p>
        </div>

        {/* Commission Tiers with Better Visualization */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Commission Tiers</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${referralStats.currentTier === 'Bronze' ? 'bg-amber-500/20 border border-amber-500/50' : 'bg-slate-800/30'}`}>
              <div className="flex items-center gap-2 mb-2">
                <FaStar className="text-amber-600" />
                <p className="font-semibold text-white">Bronze Tier</p>
              </div>
              <p className="text-sm text-slate-400">$100+ referred earnings</p>
              <p className="text-2xl font-bold text-amber-500 mt-2">10%</p>
              {referralStats.currentTier === 'Bronze' && <p className="text-xs text-green-400 mt-2">✓ Current Tier</p>}
            </div>
            
            <div className={`p-4 rounded-lg ${referralStats.currentTier === 'Gold' ? 'bg-yellow-500/20 border border-yellow-500/50' : 'bg-slate-800/30'}`}>
              <div className="flex items-center gap-2 mb-2">
                <FaTrophy className="text-yellow-500" />
                <p className="font-semibold text-white">Gold Tier</p>
              </div>
              <p className="text-sm text-slate-400">$200+ referred earnings</p>
              <p className="text-2xl font-bold text-yellow-500 mt-2">12%</p>
              {referralStats.currentTier === 'Gold' && <p className="text-xs text-green-400 mt-2">✓ Current Tier</p>}
            </div>
            
            <div className={`p-4 rounded-lg ${referralStats.currentTier === 'Platinum' ? 'bg-purple-500/20 border border-purple-500/50' : 'bg-slate-800/30'}`}>
              <div className="flex items-center gap-2 mb-2">
                <FaCrown className="text-purple-500" />
                <p className="font-semibold text-white">Platinum Tier</p>
              </div>
              <p className="text-sm text-slate-400">$350+ referred earnings</p>
              <p className="text-2xl font-bold text-purple-500 mt-2">15%</p>
              {referralStats.currentTier === 'Platinum' && <p className="text-xs text-green-400 mt-2">✓ Current Tier (Max)</p>}
            </div>
          </div>

          {/* Progress to Next Tier */}
          {referralStats.nextTier && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
              <p className="text-sm text-slate-300 mb-2 flex justify-between">
                <span>Progress to {referralStats.nextTier.name} Tier</span>
                <span className="text-blue-400 font-semibold">
                  {formatCurrency(referralStats.totalEarnings)} / {formatCurrency(referralStats.nextTier.target)}
                </span>
              </p>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500 relative"
                  style={{ width: `${Math.min(referralStats.nextTier.progress, 100)}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Need {formatCurrency(referralStats.nextTier.target - referralStats.totalEarnings)} more to reach {referralStats.nextTier.name} Tier and get {referralStats.nextTier.name === 'Platinum' ? '15%' : '12%'} commission!
              </p>
            </div>
          )}
        </div>

        {/* Recent Referrals Table */}
        {referralStats.referrals.length > 0 && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <FaUsers className="text-blue-400" />
              Your Referrals ({referralStats.referrals.length})
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-700">
                  <tr className="text-left text-slate-400 text-sm">
                    <th className="pb-3">User</th>
                    <th className="pb-3">Joined Date</th>
                    <th className="pb-3">Earnings</th>
                    <th className="pb-3">Your Commission</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {referralStats.referrals.map((referral) => (
                    <tr key={referral.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="py-3">
                        <div>
                          <p className="text-white font-medium">{referral.name}</p>
                          <p className="text-xs text-slate-500">{referral.email}</p>
                        </div>
                      </td>
                      <td className="py-3 text-slate-400">{formatDate(referral.joinedDate)}</td>
                      <td className="py-3 text-green-400 font-semibold">{formatCurrency(referral.earnings)}</td>
                      <td className="py-3">
                        <span className="text-blue-400 font-semibold">{formatCurrency(referral.commission)}</span>
                        <span className="text-xs text-slate-500 ml-1">({referral.commissionRate}%)</span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          referral.status === 'active' 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {referral.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400 text-sm">{formatDate(referral.lastActive)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Commissions Timeline */}
        {referralStats.recentCommissions.length > 0 && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Recent Commissions</h3>
            <div className="space-y-3">
              {referralStats.recentCommissions.map((commission) => (
                <div key={commission.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors">
                  <div>
                    <p className="text-white text-sm font-medium">{commission.from}</p>
                    <p className="text-xs text-slate-500">{formatDate(commission.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-semibold">+{formatCurrency(commission.amount)}</p>
                    <p className="text-xs text-slate-500">Commission earned</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Note */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <FaGift className="text-blue-400 text-xl flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-400 text-sm font-medium">💡 How it works</p>
              <p className="text-slate-400 text-sm">
                Commission is calculated based on your referred friends' total earnings. 
                Higher tiers unlock better commission rates automatically! Invite more friends 
                and help them succeed to maximize your earnings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Refrels;