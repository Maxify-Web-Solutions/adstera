import React, {
  useState,
  useEffect,
  useCallback,
} from "react";

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
} from "react-icons/fa";

import { toast } from "react-toastify";

// import API from "../redux/api";

const Refrels = () => {
  const { user } = useSelector(
    (state) => state.auth
  );

  const [copied, setCopied] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [referralStats, setReferralStats] =
    useState({
      totalReferrals: 0,
      activeReferrals: 0,
      totalEarnings: 0,
      pendingEarnings: 0,
      currentTier: "Starter",
      commissionRate: 0,
      lifetimeReferrals: 0,
      nextTier: null,
      referrals: [],
      recentCommissions: [],
    });

  // =========================
  // GET REF CODE FROM URL
  // =========================

  const getReferralCodeFromURL =
    useCallback(() => {
      const urlParams =
        new URLSearchParams(
          window.location.search
        );

      const refCode =
        urlParams.get("ref");

      if (
        refCode &&
        !localStorage.getItem(
          "referredBy"
        )
      ) {
        localStorage.setItem(
          "referredBy",
          refCode
        );

        console.log(
          "Referred by code:",
          refCode
        );
      }

      return refCode;
    }, []);

  // =========================
  // GET REF LINK
  // =========================

  const getReferralLink =
    useCallback(() => {
      if (!user) return "";

      const baseUrl = `${window.location.origin}/register`;

      const refCode = (
        user.referralCode ||
        user.email
      )

      return `${baseUrl}?ref=${refCode}`;
    }, [user]);

  const referralLink =
    getReferralLink();

  // =========================
  // SHARE
  // =========================

  const shareViaSocial = async (
    platform
  ) => {
    const message = `Join me on this amazing platform! Use my referral link: ${referralLink}`;

    switch (platform) {
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(
            message
          )}`,
          "_blank"
        );
        break;

      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            message
          )}`,
          "_blank"
        );
        break;

      case "telegram":
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(
            referralLink
          )}&text=${encodeURIComponent(
            "Join me on this platform!"
          )}`,
          "_blank"
        );
        break;

      default:
        copyToClipboard();
    }
  };

  // =========================
  // CALCULATE COMMISSION
  // =========================

  const calculateCommission = (
    amount
  ) => {
    if (amount >= 350) return 15;

    if (amount >= 200) return 12;

    if (amount >= 100) return 10;

    return 0;
  };

  // =========================
  // CALCULATE TIER
  // =========================

  const calculateTier = (amount) => {
    if (amount >= 350) {
      return {
        name: "Platinum",
        rate: 15,
        icon: FaCrown,
        color:
          "from-purple-400 to-pink-400",
        bgColor:
          "bg-purple-500/20 dark:bg-purple-500/20",
        nextTarget: null,
      };
    }

    if (amount >= 200) {
      return {
        name: "Gold",
        rate: 12,
        icon: FaTrophy,
        color:
          "from-yellow-400 to-orange-400",
        bgColor:
          "bg-yellow-500/20 dark:bg-yellow-500/20",

        nextTarget: {
          name: "Platinum",
          target: 350,
          progress:
            (amount / 350) * 100,
        },
      };
    }

    if (amount >= 100) {
      return {
        name: "Bronze",
        rate: 10,
        icon: FaStar,
        color:
          "from-amber-600 to-amber-700",
        bgColor:
          "bg-amber-500/20 dark:bg-amber-500/20",

        nextTarget: {
          name: "Gold",
          target: 200,
          progress:
            (amount / 200) * 100,
        },
      };
    }

    return {
      name: "Starter",
      rate: 0,
      icon: FaUsers,
      color:
        "from-slate-500 to-slate-700",
      bgColor:
        "bg-slate-300 dark:bg-slate-500/20",

      nextTarget: {
        name: "Bronze",
        target: 100,
        progress: amount,
      },
    };
  };

  // =========================
  // FETCH STATS
  // =========================

  const fetchReferralStats =
    useCallback(async () => {
      if (!user) return;

      setLoading(true);

      try {
        // =========================
        // API CALL
        // =========================

        // const res = await API.get(
        //   "/auth/profile"
        // );

        // const data = res.data.user;

        // =========================
        // DEMO
        // =========================

        const data = {
          totalJoinedUsers:
            user?.totalJoinedUsers ||
            0,

          referralPercent:
            user?.referralPercent || 0,

          referralAmount:
            user?.referralAmount || 0,
        };

        const tier =
          calculateTier(
            data.referralAmount
          );

        setReferralStats({
          totalReferrals:
            data.totalJoinedUsers ||
            0,

          activeReferrals:
            data.totalJoinedUsers ||
            0,

          totalEarnings:
            data.referralAmount ||
            0,

          pendingEarnings: 0,

          currentTier: tier.name,

          commissionRate:
            data.referralPercent ||
            0,

          lifetimeReferrals:
            data.totalJoinedUsers ||
            0,

          nextTier:
            tier.nextTarget,

          referrals: [],

          recentCommissions:
            [],
        });
      } catch (error) {
        console.log(error);

        toast.error(
          "Failed to load referral statistics"
        );
      } finally {
        setLoading(false);
      }
    }, [user]);

  useEffect(() => {
    getReferralCodeFromURL();

    fetchReferralStats();
  }, [
    getReferralCodeFromURL,
    fetchReferralStats,
  ]);

  // =========================
  // COPY
  // =========================

  const copyToClipboard =
    async () => {
      if (!referralLink) {
        toast.error(
          "Referral link not available"
        );

        return;
      }

      try {
        await navigator.clipboard.writeText(
          referralLink
        );

        setCopied(true);

        toast.success(
          "Referral link copied!"
        );

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (err) {
        toast.error(
          "Failed to copy link"
        );
      }
    };

  // =========================
  // FORMAT
  // =========================

  const formatCurrency = (
    amount
  ) => {
    return `$${Number(amount || 0).toFixed(
      2
    )}`;
  };

  // =========================
  // LOGIN CHECK
  // =========================

  if (!user) {
    return (
      <div className="w-full flex justify-center items-center py-20 bg-slate-100 dark:bg-slate-950 transition-colors duration-300">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center shadow-lg dark:shadow-none">
          <FaUsers className="text-5xl text-slate-500 mx-auto mb-4" />

          <h2 className="text-slate-900 dark:text-white text-2xl font-bold">
            Login Required
          </h2>

          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Please login to view
            referral stats
          </p>
        </div>
      </div>
    );
  }

  const currentTier =
    calculateTier(
      referralStats.totalEarnings
    );

  const TierIcon =
    currentTier.icon;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-200 dark:from-slate-900 dark:to-slate-950 py-8 px-4 transition-colors duration-300">

      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}

        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">

          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 blur-3xl rounded-full -mt-32 -mr-32"></div>

          <div className="relative z-10 flex justify-between flex-wrap gap-4">

            <div>
              <h1 className="text-4xl font-bold flex items-center gap-2">
                Referral Program

                {referralStats.currentTier ===
                  "Platinum" && (
                  <FaCrown className="text-yellow-300" />
                )}
              </h1>

              <p className="text-blue-100 mt-2">
                Invite friends &
                earn commissions
              </p>

              <p className="mt-3">
                Welcome back{" "}

                <span className="font-bold">
                  {user.name}
                </span>
              </p>
            </div>

            <div className="bg-white/20 rounded-xl px-6 py-4 text-center backdrop-blur-sm">
              <p className="text-sm flex items-center gap-1 justify-center">
                <TierIcon />
                Current Tier
              </p>

              <h2 className="text-3xl font-bold">
                {
                  referralStats.currentTier
                }
              </h2>

              <p className="text-sm">
                {
                  referralStats.commissionRate
                }
                % Commission
              </p>
            </div>
          </div>
        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-lg dark:shadow-none transition-all duration-300">
            <FaUserPlus className="text-blue-500 text-2xl mb-3" />

            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Total Joined Users
            </p>

            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {
                referralStats.totalReferrals
              }
            </h2>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-lg dark:shadow-none transition-all duration-300">
            <FaDollarSign className="text-green-500 text-2xl mb-3" />

            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Referral Earnings
            </p>

            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {formatCurrency(
                referralStats.totalEarnings
              )}
            </h2>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-lg dark:shadow-none transition-all duration-300">
            <FaChartLine className="text-purple-500 text-2xl mb-3" />

            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Commission Rate
            </p>

            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {
                referralStats.commissionRate
              }
              %
            </h2>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-lg dark:shadow-none transition-all duration-300">
            <FaGift className="text-yellow-500 text-2xl mb-3" />

            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Current Tier
            </p>

            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {
                referralStats.currentTier
              }
            </h2>
          </div>
        </div>

        {/* REFERRAL LINK */}

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-lg dark:shadow-none transition-all duration-300">

          <h2 className="text-slate-900 dark:text-white text-xl font-semibold mb-4 flex items-center gap-2">
            <FaShare className="text-blue-500" />
            Share Referral Link
          </h2>

          <div className="flex flex-col md:flex-row gap-3">

            <div className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
              <code className="text-slate-700 dark:text-slate-300 text-sm break-all">
                {referralLink}
              </code>
            </div>

            <button
              onClick={
                copyToClipboard
              }
              className="bg-blue-600 hover:bg-blue-700 transition-all px-6 py-3 rounded-lg text-white flex items-center justify-center gap-2"
            >
              {copied ? (
                <FaCheck className="text-green-300" />
              ) : (
                <FaCopy />
              )}

              {copied
                ? "Copied"
                : "Copy Link"}
            </button>
          </div>

          {/* SOCIAL */}

          <div className="flex gap-3 mt-4">

            <button
              onClick={() =>
                shareViaSocial(
                  "whatsapp"
                )
              }
              className="bg-green-100 dark:bg-green-600/20 hover:bg-green-200 dark:hover:bg-green-600/40 text-green-600 dark:text-green-400 p-3 rounded-lg transition-all"
            >
              <FaWhatsapp />
            </button>

            <button
              onClick={() =>
                shareViaSocial(
                  "twitter"
                )
              }
              className="bg-blue-100 dark:bg-blue-500/20 hover:bg-blue-200 dark:hover:bg-blue-500/40 text-blue-600 dark:text-blue-400 p-3 rounded-lg transition-all"
            >
              <FaTwitter />
            </button>

            <button
              onClick={() =>
                shareViaSocial(
                  "telegram"
                )
              }
              className="bg-sky-100 dark:bg-sky-500/20 hover:bg-sky-200 dark:hover:bg-sky-500/40 text-sky-600 dark:text-sky-400 p-3 rounded-lg transition-all"
            >
              <FaTelegram />
            </button>

            <button
              onClick={
                copyToClipboard
              }
              className="bg-slate-200 dark:bg-slate-700/30 hover:bg-slate-300 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 p-3 rounded-lg transition-all"
            >
              <FaLink />
            </button>
          </div>
        </div>

        {/* TIERS */}

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-lg dark:shadow-none transition-all duration-300">

          <h2 className="text-slate-900 dark:text-white text-xl font-semibold mb-5">
            Commission Tiers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 rounded-xl p-5">
              <div className="flex items-center gap-2">
                <FaStar className="text-amber-500" />

                <h3 className="text-slate-900 dark:text-white font-bold">
                  Bronze
                </h3>
              </div>

              <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
                $100 - $199
              </p>

              <h2 className="text-3xl font-bold text-amber-500 mt-3">
                10%
              </h2>
            </div>

            <div className="bg-yellow-100 dark:bg-yellow-500/10 border border-yellow-300 dark:border-yellow-500/30 rounded-xl p-5">
              <div className="flex items-center gap-2">
                <FaTrophy className="text-yellow-500" />

                <h3 className="text-slate-900 dark:text-white font-bold">
                  Gold
                </h3>
              </div>

              <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
                $200 - $349
              </p>

              <h2 className="text-3xl font-bold text-yellow-500 mt-3">
                12%
              </h2>
            </div>

            <div className="bg-purple-100 dark:bg-purple-500/10 border border-purple-300 dark:border-purple-500/30 rounded-xl p-5">
              <div className="flex items-center gap-2">
                <FaCrown className="text-purple-500" />

                <h3 className="text-slate-900 dark:text-white font-bold">
                  Platinum
                </h3>
              </div>

              <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
                $350+
              </p>

              <h2 className="text-3xl font-bold text-purple-500 mt-3">
                15%
              </h2>
            </div>
          </div>

          {referralStats.nextTier && (
            <div className="mt-6">

              <div className="flex justify-between text-sm text-slate-700 dark:text-slate-300 mb-2">
                <span>
                  Progress to{" "}
                  {
                    referralStats
                      .nextTier.name
                  }
                </span>

                <span>
                  {formatCurrency(
                    referralStats.totalEarnings
                  )}{" "}
                  /{" "}
                  {formatCurrency(
                    referralStats
                      .nextTier
                      .target
                  )}
                </span>
              </div>

              <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                  style={{
                    width: `${Math.min(
                      referralStats
                        .nextTier
                        .progress,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* INFO */}

        <div className="bg-blue-100 dark:bg-blue-500/10 border border-blue-300 dark:border-blue-500/20 rounded-xl p-5 transition-all duration-300">

          <div className="flex items-start gap-3">

            <FaGift className="text-blue-500 text-xl mt-1" />

            <div>

              <h3 className="text-blue-600 dark:text-blue-400 font-semibold">
                How it works
              </h3>

              <p className="text-slate-700 dark:text-slate-400 text-sm mt-1 leading-6">
                Invite friends using
                your referral link.
                Earn commission based
                on your referral
                earnings.
                <br />
                <br />
                $100-$199 → 10%
                commission
                <br />
                $200-$349 → 12%
                commission
                <br />
                $350+ → 15%
                commission
              </p>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Refrels;