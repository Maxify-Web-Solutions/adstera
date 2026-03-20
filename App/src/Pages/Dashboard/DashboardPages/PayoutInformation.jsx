import React from "react";
import { FiEdit2, FiInfo } from "react-icons/fi";

const methods = [
  {
    name: "WebMoney WMZ",
    min: "$5.00",
    time: "1–2 business days",
    fee: "1.00%",
    currency: "USD",
    verification: "Individuals – by request",
  },
  {
    name: "Paxum",
    min: "$5.00",
    time: "1–2 business days",
    fee: "$1.00",
    currency: "USD",
    verification: "Legal entities – required",
  },
  {
    name: "WebMoney WMT",
    min: "$5.00",
    time: "1–2 business days",
    fee: "2.00%",
    currency: "USD",
    verification: "Individuals – by request",
  },
  {
    name: "PayPal",
    min: "$25.00",
    time: "1–2 business days",
    fee: "$0.65",
    currency: "USD",
    verification: "Legal entities – required",
    note: "Unavailable until you reach the minimum of $25.00",
  },
  {
    name: "Local Bank Transfer",
    min: "$25.00",
    time: "Up to 5 business days",
    fee: "$7 + exchange rate",
    currency: "INR",
    verification: "Individuals – required",
  },
];

const PayoutInformation = () => {
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
              <p className="font-semibold text-gray-900 dark:text-white">$100</p>
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

              <div className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
                <p><b>Account type:</b> Individual</p>
                <p><b>First name:</b> Trivikram</p>
                <p><b>Last name:</b> Kumar</p>
                <p>
                  <b>Address:</b> Kishunnagar Kanti Muzaffarpur 843109, India
                </p>
                <p><b>Minimum payout:</b> $100</p>
              </div>

            </div>

            <div className="space-y-4">

              <h3 className="font-semibold text-gray-900 dark:text-white">
                Method Details
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-300">
                <b>Wallet #</b>
              </p>

              <div className="bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 px-4 py-3 rounded-xl text-sm break-all font-mono text-gray-700 dark:text-gray-300">
                TJbrTfootkpaWHiKv2A6tneFJ4J2mX4pm1
              </div>

            </div>

          </div>

          {/* Edit */}
          <div className="flex justify-end border-t border-gray-200 dark:border-slate-700 p-4">

            <button className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
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

    </div>
  );
};

export default PayoutInformation;