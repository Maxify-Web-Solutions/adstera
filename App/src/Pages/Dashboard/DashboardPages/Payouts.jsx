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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

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
    <option value="TRC20">TRC20</option>
    <option value="ERC20">ERC20</option>
    <option value="BEP20">BEP20</option>
  </Select>

</div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-5">
          {!otpSent ? (
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition text-white font-medium text-sm md:text-base"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
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
                className="w-full mt-3 py-3 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-50 transition text-white font-medium text-sm md:text-base"
              >
                {loading ? "Processing..." : "Confirm Withdrawal"}
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* HISTORY */}
      {/* ================= HISTORY ================= */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl shadow-xl"
>
  
  {/* HEADER */}
  <div className="p-4 md:p-6 border-b border-white/10 flex justify-between items-center">
    
    <h2 className="text-lg md:text-xl font-semibold text-white">
      Payout History
    </h2>

    <button className="flex items-center gap-2 text-sm text-indigo-400">
      <FiFilter /> Filters
    </button>

  </div>


  {/* ================= DESKTOP TABLE ================= */}
  <div className="hidden md:block overflow-x-auto">

    <table className="w-full text-sm">

      <thead className="text-gray-400 border-b border-white/10">
        <tr>
          <th className="p-4 text-left">Date</th>
          <th className="p-4 text-left">Amount</th>
          <th className="p-4 text-left">Method</th>
          <th className="p-4 text-left">Details</th>
          <th className="p-4 text-left">Status</th>
          <th className="p-4 text-left">Remark</th>
        </tr>
      </thead>


      <tbody>

        {withdrawals && withdrawals.length > 0 ? (

          withdrawals.map((item) => (

            <tr
              key={item._id}
              className="border-b border-white/5 hover:bg-white/5 transition"
            >

              {/* DATE */}
              <td className="p-4">

                <div className="flex flex-col">

                  <span className="text-white text-sm">
                    {new Date(item.createdAt).toLocaleDateString(
                      undefined,
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </span>

                  <span className="text-xs text-gray-500 mt-1">
                    {new Date(item.createdAt).toLocaleTimeString(
                      undefined,
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>

                </div>

              </td>


              {/* AMOUNT */}
              <td className="p-4 text-white font-semibold">
                ${item.amount}
              </td>


              {/* METHOD */}
              <td className="p-4 capitalize text-gray-300">
                {item.paymentMethod}
              </td>


              {/* DETAILS */}
              <td className="p-4 text-xs text-gray-400">

                {item.paymentMethod === "bank" ? (
                  <div className="space-y-1">

                    <p>{item.bankName || "-"}</p>

                    <p>
                      A/C: ****
                      {item.accountNumber?.slice(-4)}
                    </p>

                    <p>{item.ifscCode}</p>

                  </div>
                ) : (
                  <div className="space-y-1">

                    <p>{item.network}</p>

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
              <td className="p-4 text-xs text-gray-500">
                {item.adminRemark || "-"}
              </td>

            </tr>
          ))

        ) : (

          <tr>

            <td
              colSpan="6"
              className="p-10 text-center text-gray-500"
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

    {withdrawals && withdrawals.length > 0 ? (

      withdrawals.map((item) => (

        <div
          key={item._id}
          className="p-4 rounded-xl bg-white/5 border border-white/10"
        >

          {/* DATE */}
          <div className="flex items-center justify-between">

            <p className="text-xs text-gray-400">
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
          <p className="text-lg font-semibold text-white mt-2">
            ${item.amount}
          </p>


          {/* METHOD */}
          <p className="text-sm text-gray-400 capitalize mt-1">
            {item.paymentMethod}
          </p>


          {/* DETAILS */}
          <div className="mt-3 text-xs text-gray-500 space-y-1">

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
            <div className="mt-3 text-xs text-indigo-400">
              Remark: {item.adminRemark}
            </div>
          )}

        </div>
      ))

    ) : (

      <div className="text-center text-gray-500 py-10">
        No payout history found
      </div>

    )}

  </div>

</motion.div>
    </div>
  );
};

export default Payouts;