import React, { useEffect, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import {
  getMyWithdrawals,
  sendWithdrawalOtp,
  createWithdrawal,
} from "../../../redux/slice/withdrawalSlice";

/* ================= INPUT ================= */
const Input = ({ ...props }) => (
  <input
    {...props}
    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
);

/* ================= SELECT ================= */
const Select = ({ children, ...props }) => (
  <select
    {...props}
    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    {children}
  </select>
);

const Payouts = () => {

  const dispatch = useDispatch();

  const { user } = useSelector(
    (state) => state.auth
  );



  const totalRevenue = Number(user?.revenue || 0);

  const {
    withdrawals = [],
    otpSent,
    loading,
  } = useSelector((state) => state.withdrawal);


  const [amount, setAmount] = useState("");

  const [otp, setOtp] = useState("");

  const [method, setMethod] = useState("crypto");


  /* ================= BANK ================= */
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });


  /* ================= CRYPTO ================= */
  const [cryptoDetails, setCryptoDetails] = useState({
    cryptoType: "USDT",
    walletAddress: "",
    network: "TRC20",
  });


  /* ================= FETCH ================= */
  useEffect(() => {
    dispatch(getMyWithdrawals());
  }, [dispatch]);


  /* ================= SEND OTP ================= */
  const handleSendOtp = async () => {

    if (!amount) return alert("Enter amount");

    await dispatch(sendWithdrawalOtp({ amount }));
  };


  /* ================= WITHDRAW ================= */
  const handleWithdraw = async () => {

    const payload = {
      amount,
      paymentMethod: method,
      otp,
      ...(method === "bank"
        ? bankDetails
        : cryptoDetails),
    };

    await dispatch(createWithdrawal(payload));

    setAmount("");
    setOtp("");
  };


  /* ================= STATUS COLOR ================= */
  /* ================= STATUS COLOR ================= */
  const balanceStatus =
    totalRevenue < 10
      ? "low"
      : totalRevenue < 25
        ? "warning"
        : "eligible";

  const getStatusColor = (status) => {

    switch (status?.toLowerCase()) {

      case "pending":
        return "text-yellow-500";

      case "approved":
      case "completed":
      case "success":
        return "text-green-500";

      case "rejected":
      case "failed":
        return "text-red-500";

      default:
        return "text-gray-500";
    }

  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">

      <div
        className={`relative overflow-hidden rounded-[28px] p-6 md:p-8 border shadow-2xl transition-all duration-500

  ${balanceStatus === "low"
            ? "bg-gradient-to-br from-[#2a0f12] via-[#451218] to-[#66161d] border-red-500/30"
            : balanceStatus === "warning"
              ? "bg-gradient-to-br from-[#2d2208] via-[#4a350a] to-[#6a4a0d] border-yellow-500/30"
              : "bg-gradient-to-br from-[#071f17] via-[#0b3528] to-[#11553f] border-emerald-500/30"
          }`}
      >
        {/* Glow Effects */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 blur-3xl rounded-full"></div>

        <div className="absolute bottom-0 left-0 w-56 h-56 bg-black/10 blur-3xl rounded-full"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">

          {/* LEFT */}
          <div>

            <div className="flex items-center gap-3 mb-4">

              <div
                className={`w-3 h-3 rounded-full animate-pulse

          ${balanceStatus === "low"
                    ? "bg-red-400"
                    : balanceStatus === "warning"
                      ? "bg-yellow-300"
                      : "bg-emerald-400"
                  }`}
              />

              <span className="uppercase tracking-[0.25em] text-xs font-semibold text-white/70">
                Withdrawal Balance
              </span>

            </div>

            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight">
              ${user.revenue.toFixed(2)}
            </h2>

            <p className="mt-4 text-sm md:text-base text-white/70 leading-relaxed max-w-xl">

              {
                balanceStatus === "low"
                  ? `Your balance is critically low for ${method === "crypto" ? "crypto" : "bank"
                  } withdrawals.`
                  : balanceStatus === "warning"
                    ? `You are close to the minimum ${method === "crypto" ? "crypto" : "bank"
                    } withdrawal threshold of $25.`
                    : `Your account balance is eligible for secure ${method === "crypto" ? "crypto" : "bank"
                    } withdrawal processing.`
              }

            </p>

            {/* Bottom Pills */}
            <div className="flex flex-wrap gap-3 mt-6">

              <div className="px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-xl text-sm text-white/90">
                Minimum: $25
              </div>

              <div className="px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-xl text-sm text-white/90">
                Secure & Verified
              </div>

            </div>

          </div>

          {/* RIGHT STATUS CARD */}
          <div
            className={`min-w-[180px] rounded-3xl p-5 backdrop-blur-2xl border shadow-xl

      ${balanceStatus === "low"
                ? "bg-red-500/10 border-red-400/20"
                : balanceStatus === "warning"
                  ? "bg-yellow-400/10 border-yellow-300/20"
                  : "bg-emerald-400/10 border-emerald-300/20"
              }`}
          >

            <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-3">
              Status
            </p>

            <h3 className="text-2xl font-bold text-white">

              {
                balanceStatus === "low"
                  ? "Low Balance"
                  : balanceStatus === "warning"
                    ? "Insufficient"
                    : "Eligible"
              }

            </h3>

            <div className="mt-5 h-2 rounded-full bg-white/10 overflow-hidden">

              <div
                className={`h-full rounded-full transition-all duration-700

          ${balanceStatus === "low"
                    ? "bg-red-400 w-[25%]"
                    : balanceStatus === "warning"
                      ? "bg-yellow-300 w-[70%]"
                      : "bg-emerald-400 w-full"
                  }`}
              />

            </div>

          </div>

        </div>
      </div>

      {/* ================= WITHDRAW ================= */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden p-6"
      >

        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
          Withdraw Funds
        </h2>
        {/* ================= TOP FIELDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Input
            type="number"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <Select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="crypto">
              Crypto
            </option>

            <option value="bank">
              Bank
            </option>

          </Select>

        </div>



        {/* ================= DYNAMIC FIELDS ================= */}
        <div className="mt-4 space-y-4">

          {method === "bank" ? (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Input
                placeholder="Account Holder Name"
                value={bankDetails.accountHolderName}
                onChange={(e) =>
                  setBankDetails({
                    ...bankDetails,
                    accountHolderName: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Bank Name"
                value={bankDetails.bankName}
                onChange={(e) =>
                  setBankDetails({
                    ...bankDetails,
                    bankName: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Account Number"
                value={bankDetails.accountNumber}
                onChange={(e) =>
                  setBankDetails({
                    ...bankDetails,
                    accountNumber: e.target.value,
                  })
                }
              />

              <Input
                placeholder="IFSC Code"
                value={bankDetails.ifscCode}
                onChange={(e) =>
                  setBankDetails({
                    ...bankDetails,
                    ifscCode: e.target.value,
                  })
                }
              />

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Input
                placeholder="Wallet Address"
                value={cryptoDetails.walletAddress}
                onChange={(e) =>
                  setCryptoDetails({
                    ...cryptoDetails,
                    walletAddress: e.target.value,
                  })
                }
              />

              <Select
                value={cryptoDetails.network}
                onChange={(e) =>
                  setCryptoDetails({
                    ...cryptoDetails,
                    network: e.target.value,
                  })
                }
              >
                <option value="TRC20">
                  TRC20
                </option>

                <option value="ERC20">
                  ERC20
                </option>

                <option value="BEP20">
                  BEP20
                </option>

              </Select>

            </div>

          )}

        </div>



        {/* ================= BUTTONS ================= */}
        <div className="mt-6">

          {!otpSent ? (

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition text-white font-medium"
            >
              {loading
                ? "Sending OTP..."
                : "Next"}
            </button>

          ) : (

            <>
              <Input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button
                onClick={handleWithdraw}
                disabled={loading}
                className="w-full mt-3 py-3 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-50 transition text-white font-medium"
              >
                {loading
                  ? "Processing..."
                  : "Confirm Withdrawal"}
              </button>
            </>

          )}

        </div>

      </motion.div>



      {/* ================= HISTORY ================= */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden"
      >

        {/* ================= HEADER ================= */}
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">

          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
            Payout History
          </h2>

          <button className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <FiFilter />
            Filters
          </button>

        </div>



        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden md:block overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/40">

              <tr>

                <th className="p-4 text-left">
                  Date
                </th>

                <th className="p-4 text-left">
                  Amount
                </th>

                <th className="p-4 text-left">
                  Method
                </th>

                <th className="p-4 text-left">
                  Details
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Remark
                </th>

              </tr>

            </thead>



            <tbody>

              {withdrawals.length > 0 ? (

                withdrawals.map((item) => (

                  <tr
                    key={item._id}
                    className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition"
                  >

                    {/* DATE */}
                    <td className="p-4">

                      <div className="flex flex-col">

                        <span className="text-gray-900 dark:text-white text-sm">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>

                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(item.createdAt).toLocaleTimeString()}
                        </span>

                      </div>

                    </td>



                    {/* AMOUNT */}
                    <td className="p-4 text-gray-900 dark:text-white font-semibold">
                      ${item.amount}
                    </td>



                    {/* METHOD */}
                    <td className="p-4 capitalize text-gray-700 dark:text-gray-300">
                      {item.paymentMethod}
                    </td>



                    {/* DETAILS */}
                    <td className="p-4 text-xs text-gray-600 dark:text-gray-400">

                      {item.paymentMethod === "bank" ? (

                        <div className="space-y-1">

                          <p>
                            {item.bankName || "-"}
                          </p>

                          <p>
                            A/C: ****
                            {item.accountNumber?.slice(-4)}
                          </p>

                          <p>
                            {item.ifscCode}
                          </p>

                        </div>

                      ) : (

                        <div className="space-y-1">

                          <p>
                            {item.network}
                          </p>

                          <p className="break-all">
                            {item.walletAddress}
                          </p>

                        </div>

                      )}

                    </td>



                    {/* STATUS */}
                    <td
                      className={`p-4 font-medium capitalize ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </td>



                    {/* REMARK */}
                    <td className="p-4 text-xs text-gray-500 dark:text-gray-400">
                      {item.adminRemark || "-"}
                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="p-10 text-center text-gray-500 dark:text-gray-400"
                  >
                    No payout history found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>



        {/* ================= MOBILE CARDS ================= */}
        <div className="md:hidden p-4 space-y-4">

          {withdrawals.length > 0 ? (

            withdrawals.map((item) => (

              <div
                key={item._id}
                className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700"
              >

                {/* TOP */}
                <div className="flex items-center justify-between">

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>

                  <p
                    className={`text-xs font-medium capitalize ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </p>

                </div>



                {/* AMOUNT */}
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-3">
                  ₹{item.amount}
                </p>



                {/* METHOD */}
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mt-1">
                  {item.paymentMethod}
                </p>



                {/* DETAILS */}
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 space-y-1">

                  {item.paymentMethod === "bank" ? (
                    <>
                      <p>{item.bankName}</p>

                      <p>
                        A/C: ****
                        {item.accountNumber?.slice(-4)}
                      </p>
                    </>
                  ) : (
                    <>
                      <p>{item.network}</p>

                      <p className="break-all">
                        {item.walletAddress}
                      </p>
                    </>
                  )}

                </div>



                {/* REMARK */}
                {item.adminRemark && (

                  <div className="mt-4 text-xs text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl px-3 py-2">

                    Remark: {item.adminRemark}

                  </div>

                )}

              </div>

            ))

          ) : (

            <div className="text-center text-gray-500 dark:text-gray-400 py-10">
              No payout history found
            </div>

          )}

        </div>

      </motion.div>

    </div>
  );
};

export default Payouts;