import React, { useEffect, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  getMyWithdrawals,
  sendWithdrawalOtp,
  createWithdrawal,
} from "../../../redux/slice/withdrawalSlice";

/* Inputs */
const Input = ({ ...props }) => (
  <input
    {...props}
    className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
  />
);

const Select = ({ children, ...props }) => (
  <select
    {...props}
    className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
  >
    {children}
  </select>
);

const Payouts = () => {
  const dispatch = useDispatch();
  const { withdrawals, otpSent, loading } = useSelector(
    (state) => state.withdrawal
  );

  const [amount, setAmount] = useState("");
  const [otp, setOtp] = useState("");
  const [method, setMethod] = useState("crypto");

  const [bankDetails, setBankDetails] = useState({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });

  const [cryptoDetails, setCryptoDetails] = useState({
    cryptoType: "USDT",
    walletAddress: "",
    network: "TRC20",
  });

  useEffect(() => {
    dispatch(getMyWithdrawals());
  }, [dispatch]);

  const handleSendOtp = async () => {
    if (!amount) return alert("Enter amount");
    await dispatch(sendWithdrawalOtp({ amount }));
  };

  const handleWithdraw = async () => {
    const payload = {
      amount,
      paymentMethod: method,
      otp,
      ...(method === "bank" ? bankDetails : cryptoDetails),
    };

    await dispatch(createWithdrawal(payload));
    setAmount("");
    setOtp("");
  };

  const getStatusColor = (status) => {
    if (status === "approved") return "text-green-400";
    if (status === "rejected") return "text-red-400";
    return "text-yellow-400";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-3 md:p-6">

      {/* WITHDRAW */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl p-4 md:p-6 shadow-xl"
      >
        <h2 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">
          Withdraw Funds
        </h2>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <Input
            type="number"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <Select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="crypto">Crypto</option>
            <option value="bank">Bank</option>
          </Select>
        </div>

        {/* Dynamic Fields */}
        <div className="mt-4 space-y-3">
          {method === "bank" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Account Holder Name" />
              <Input placeholder="Bank Name" />
              <Input placeholder="Account Number" />
              <Input placeholder="IFSC Code" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Wallet Address" />
              <Select>
                <option>TRC20</option>
                <option>ERC20</option>
                <option>BEP20</option>
              </Select>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-5">
          {!otpSent ? (
            <button className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-white font-medium text-sm md:text-base">
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          ) : (
            <>
              <Input placeholder="Enter OTP" />
              <button className="w-full mt-3 py-3 rounded-xl bg-green-600 hover:bg-green-700 transition text-white font-medium text-sm md:text-base">
                Confirm Withdrawal
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* HISTORY */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl shadow-xl"
      >
        <div className="p-4 md:p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-semibold text-white">
            Payout History
          </h2>
          <button className="flex items-center gap-2 text-sm text-indigo-400">
            <FiFilter /> Filters
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-gray-400 border-b border-white/10">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method</th>
                <th className="p-4">Details</th>
                <th className="p-4">Status</th>
                <th className="p-4">Remark</th>
              </tr>
            </thead>

            <tbody>
              {withdrawals?.map((item) => (
                <tr key={item._id} className="border-b border-white/5">
                  <td className="p-4">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-white font-medium">
                    ₹{item.amount}
                  </td>
                  <td className="p-4">{item.paymentMethod}</td>
                  <td className="p-4 text-xs">
                    {item.paymentMethod === "bank"
                      ? item.bankName
                      : item.network}
                  </td>
                  <td className={`p-4 ${getStatusColor(item.status)}`}>
                    {item.status}
                  </td>
                  <td className="p-4 text-xs text-gray-500">
                    {item.adminRemark || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden p-4 space-y-4">
          {withdrawals?.map((item) => (
            <div
              key={item._id}
              className="p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <p className="text-xs text-gray-400">
                {new Date(item.createdAt).toLocaleDateString()}
              </p>

              <p className="text-lg font-semibold text-white mt-1">
                ₹{item.amount}
              </p>

              <p className="text-sm text-gray-400">
                {item.paymentMethod}
              </p>

              <p className={`text-sm mt-1 ${getStatusColor(item.status)}`}>
                {item.status}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Payouts;