import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiEdit2, FiInfo } from "react-icons/fi";
import { getMyWithdrawals, sendWithdrawalOtp, createWithdrawal } from "../../../redux/slice/withdrawalSlice";
import { toast } from "react-toastify";

const methods = [
  {
    name: "Local Bank Transfer",
    min: "$25.00",
    time: "Up to 5 business days",
    fee: "$7 + exchange rate",
    currency: "INR",
    verification: "Individuals – required",
  },
  {
    name: "Cryptocurrency",
    min: "$10.00",
    time: "1–3 business days",
    fee: "1.5%",
    currency: "BTC/USDT/ETH",
    verification: "Individuals – by request",
  },
];

const PayoutInformation = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { withdrawals, loading } = useSelector((state) => state.withdrawal);

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [formData, setFormData] = useState({
    amount: "",
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    cryptoType: "",
    walletAddress: "",
    network: "",
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(false);

  // Fetch user's withdrawals on component mount
  useEffect(() => {
    dispatch(getMyWithdrawals());
  }, [dispatch]);

  // Get the most recent withdrawal (latest payout method)
  const latestWithdrawal = withdrawals && withdrawals.length > 0 ? withdrawals[0] : null;

  // Fallback data if no withdrawal exists
  const displayData = latestWithdrawal || {};

  // Handle edit button click
  const handleEditClick = () => {
    setIsEditModalOpen(true);
    // Pre-fill form with existing data if available
    if (latestWithdrawal) {
      setPaymentMethod(latestWithdrawal.paymentMethod);
      setFormData({
        amount: "",
        accountHolderName: latestWithdrawal.accountHolderName || "",
        bankName: latestWithdrawal.bankName || "",
        accountNumber: latestWithdrawal.accountNumber || "",
        ifscCode: latestWithdrawal.ifscCode || "",
        cryptoType: latestWithdrawal.cryptoType || "",
        walletAddress: latestWithdrawal.walletAddress || "",
        network: latestWithdrawal.network || "",
        otp: "",
      });
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Send OTP for withdrawal
  const handleSendOtp = async () => {
    if (!formData.amount || formData.amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await dispatch(sendWithdrawalOtp({
        amount: formData.amount,
        paymentMethod,
        ...formData
      })).unwrap();
      setOtpSent(true);
      toast.success("OTP sent to your email!");
    } catch (error) {
      toast.error("Failed to send OTP");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.otp) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      await dispatch(createWithdrawal({
        amount: formData.amount,
        paymentMethod,
        ...formData
      })).unwrap();

      setIsEditModalOpen(false);
      setFormData({
        amount: "",
        accountHolderName: "",
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        cryptoType: "",
        walletAddress: "",
        network: "",
        otp: "",
      });
      setOtpSent(false);
      toast.success("Payment method updated successfully!");
    } catch (error) {
      toast.error("Failed to update payment method");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">

      {/* Your Method */}
      <div>

        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
          Your Method
        </h2>

        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">

          {/* Top Info */}
          <div className="grid md:grid-cols-5 gap-6 p-6 border-b border-gray-200 dark:border-slate-700 text-sm">

            <div>
              <p className="text-gray-500 dark:text-gray-400">Minimum payout</p>
              <p className="font-semibold text-gray-900 dark:text-white">$50</p>
            </div>

            <div>
              <p className="text-gray-500 dark:text-gray-400">Processing time</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                1–2 business days
              </p>
            </div>

            <div>
              <p className="text-gray-500 dark:text-gray-400">Fee</p>
              <p className="font-semibold text-gray-900 dark:text-white">1%</p>
            </div>

            <div>
              <p className="text-gray-500 dark:text-gray-400">Currency</p>
              <p className="font-semibold text-gray-900 dark:text-white">USD</p>
            </div>

            <div>
              <p className="text-gray-500 dark:text-gray-400">Verification</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                Individuals – by request
              </p>
            </div>

          </div>

          {/* Details */}
          <div className="grid md:grid-cols-2 gap-10 p-6">

            <div className="space-y-4">

              <h3 className="font-semibold text-gray-900 dark:text-white">
                Personal Information
              </h3>

              {user ? (
                <div className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
                  <p><b>Account type:</b> Individual</p>
                  <p><b>Name:</b> {user.name || "N/A"}</p>
                  <p><b>Email:</b> {user.email || "N/A"}</p>
                  <p><b>Mobile:</b> {user.mobile || "N/A"}</p>
                  <p><b>Minimum payout:</b> $50</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading user data...</p>
              )}

            </div>

            <div className="space-y-4">

              <h3 className="font-semibold text-gray-900 dark:text-white">
                {latestWithdrawal ? "Payment Method Details" : "Payment Method"}
              </h3>

              {latestWithdrawal ? (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <b>{latestWithdrawal.paymentMethod === "crypto" ? "Wallet Address" : "Bank Account Number"}</b>
                  </p>

                  <div className="bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 px-4 py-3 rounded-xl text-sm break-all font-mono text-gray-700 dark:text-gray-300">
                    {latestWithdrawal.paymentMethod === "crypto"
                      ? latestWithdrawal.walletAddress
                      : latestWithdrawal.accountNumber}
                  </div>

                  {latestWithdrawal.paymentMethod === "bank" && (
                    <div className="mt-4 text-sm space-y-2 text-gray-600 dark:text-gray-300">
                      <p><b>Account Holder:</b> {latestWithdrawal.accountHolderName}</p>
                      <p><b>Bank Name:</b> {latestWithdrawal.bankName}</p>
                      <p><b>IFSC Code:</b> {latestWithdrawal.ifscCode}</p>
                    </div>
                  )}

                  {latestWithdrawal.paymentMethod === "crypto" && (
                    <div className="mt-4 text-sm space-y-2 text-gray-600 dark:text-gray-300">
                      <p><b>Crypto Type:</b> {latestWithdrawal.cryptoType}</p>
                      <p><b>Network:</b> {latestWithdrawal.network}</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {loading ? "Loading withdrawal data..." : "No payment method added yet"}
                </p>
              )}

            </div>

          </div>

          {/* Edit */}
          <div className="flex justify-end border-t border-gray-200 dark:border-slate-700 p-4">

            <button 
              onClick={handleEditClick}
              className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <FiEdit2 /> Edit
            </button>

          </div>

        </div>

      </div>

      {/* Other Methods */}
      <div>

        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
          Other Methods
        </h2>

        <div className="grid gap-6">

          {methods.map((method, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >

              <div className="grid md:grid-cols-5 gap-6 text-sm">

                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {method.name}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 dark:text-gray-400">Minimum payout</p>
                  <p className="text-gray-900 dark:text-white">{method.min}</p>
                </div>

                <div>
                  <p className="text-gray-500 dark:text-gray-400">Processing</p>
                  <p className="text-gray-900 dark:text-white">{method.time}</p>
                </div>

                <div>
                  <p className="text-gray-500 dark:text-gray-400">Fee</p>
                  <p className="text-gray-900 dark:text-white">{method.fee}</p>
                </div>

                <div>
                  <p className="text-gray-500 dark:text-gray-400">Currency</p>
                  <p className="text-gray-900 dark:text-white">{method.currency}</p>
                </div>

              </div>

              {method.note && (
                <div className="mt-4 flex items-center gap-2 bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-lg text-sm">
                  <FiInfo />
                  {method.note}
                </div>
              )}

            </div>
          ))}

        </div>

      </div>

      {/* Edit Payment Method Modal */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              {latestWithdrawal ? "Update Payment Method" : "Add Payment Method"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <h3 className="font-medium mb-3 text-gray-900 dark:text-white">Payment Method</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentMethod("bank")}
                    className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border ${
                      paymentMethod === "bank"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-slate-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "bank"
                          ? "border-blue-500"
                          : "border-gray-400"
                      }`}
                    >
                      {paymentMethod === "bank" && (
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                      )}
                    </div>
                    <span className="text-sm font-medium">Bank Transfer</span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("crypto")}
                    className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border ${
                      paymentMethod === "crypto"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-slate-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "crypto"
                          ? "border-blue-500"
                          : "border-gray-400"
                      }`}
                    >
                      {paymentMethod === "crypto" && (
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                      )}
                    </div>
                    <span className="text-sm font-medium">Cryptocurrency</span>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Amount (for verification)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* Bank Details */}
              {paymentMethod === "bank" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      name="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={handleInputChange}
                      placeholder="Enter account holder name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      placeholder="Enter bank name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Account Number
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      placeholder="Enter account number"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleInputChange}
                      placeholder="Enter IFSC code"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Crypto Details */}
              {paymentMethod === "crypto" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Crypto Type
                    </label>
                    <select
                      name="cryptoType"
                      value={formData.cryptoType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    >
                      <option value="">Select crypto type</option>
                      <option value="BTC">Bitcoin (BTC)</option>
                      <option value="ETH">Ethereum (ETH)</option>
                      <option value="USDT">Tether (USDT)</option>
                      <option value="BNB">Binance Coin (BNB)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Wallet Address
                    </label>
                    <input
                      type="text"
                      name="walletAddress"
                      value={formData.walletAddress}
                      onChange={handleInputChange}
                      placeholder="Enter wallet address"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Network
                    </label>
                    <select
                      name="network"
                      value={formData.network}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    >
                      <option value="">Select network</option>
                      <option value="ERC20">ERC20</option>
                      <option value="BEP20">BEP20</option>
                      <option value="TRC20">TRC20</option>
                      <option value="BTC">Bitcoin</option>
                    </select>
                  </div>
                </div>
              )}

              {/* OTP Section */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    placeholder="Enter OTP"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpSent}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium transition-colors"
                  >
                    {otpSent ? "OTP Sent" : "Send OTP"}
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {otpSent ? "OTP sent to your email. Please check your inbox." : "Click 'Send OTP' to receive verification code via email."}
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
                >
                  {latestWithdrawal ? "Update Method" : "Add Method"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PayoutInformation;