import React, { useEffect, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  getMyWithdrawals,
  sendWithdrawalOtp,
  createWithdrawal,
} from "../../../redux/slice/withdrawalSlice";

const Input = ({ ...props }) => (
  <input
    {...props}
    className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
);

const Select = ({ children, ...props }) => (
  <select
    {...props}
    className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
    <div className="max-w-7xl mx-auto space-y-10 p-4">
      {/* WITHDRAW CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl p-6 shadow-xl"
      >
        <h2 className="text-xl font-semibold text-white mb-6">
          Withdraw Funds
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
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

        <div className="mt-4 space-y-3">
          {method === "bank" ? (
            <>
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
                  setBankDetails({ ...bankDetails, bankName: e.target.value })
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
                  setBankDetails({ ...bankDetails, ifscCode: e.target.value })
                }
              />
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        <div className="mt-6">
          {!otpSent ? (
            <button
              onClick={handleSendOtp}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-white font-medium"
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
                className="w-full mt-3 py-3 rounded-xl bg-green-600 hover:bg-green-700 transition text-white font-medium"
              >
                Confirm Withdrawal
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* HISTORY TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">
            Payout History
          </h2>
          <button className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300">
            <FiFilter /> Filters
          </button>
        </div>

        <div className="overflow-x-auto">
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
              {withdrawals?.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500">
                    No payouts yet.
                  </td>
                </tr>
              ) : (
                withdrawals?.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="p-4">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-medium text-white">
                      ₹{item.amount}
                    </td>
                    <td className="p-4">{item.paymentMethod}</td>
                    <td className="p-4 text-xs">
                      {item.paymentMethod === "bank" ? (
                        <>
                          {item.bankName} <br />
                          {item.accountNumber}
                        </>
                      ) : (
                        <>
                          {item.cryptoType} <br />
                          {item.network}
                        </>
                      )}
                    </td>
                    <td
                      className={`p-4 font-medium ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </td>
                    <td className="p-4 text-xs text-gray-500">
                      {item.adminRemark || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Payouts;
