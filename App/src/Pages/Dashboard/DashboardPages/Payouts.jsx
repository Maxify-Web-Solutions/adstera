import React from "react";
import { FiSettings, FiFilter } from "react-icons/fi";

/* ---------------- DATA ---------------- */

const payoutSteps = [
    "Set up your payout method.",
    "Reach the minimum amount for your method.",
    "Once you reach the minimum, we'll start a 2-week hold to verify traffic.",
    "After verification, payout will be included in the next payout period.",
];

const payoutMethod = {
    name: "TETHER TRC20/ERC20 AND BITCOIN",
    account: "TJbr*****4pm1",
    minimum: "$100",
    processing: "1-2 business days",
    schedule: "Twice a month",
};

const documents = [];

const payoutHistory = [];

/* ---------------- COMPONENT ---------------- */

const Payouts = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-10">

            {/* TOP SECTION */}
            <div className="grid lg:grid-cols-2 gap-6">

                {/* HOW TO GET PAID */}
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 shadow-sm">

                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        How to get a payout
                    </h2>

                    <ol className="space-y-4 text-sm text-gray-600 dark:text-gray-300">

                        {payoutSteps.map((step, index) => (
                            <li key={index} className="flex gap-3">
                                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                                    {index + 1}
                                </span>
                                {step}
                            </li>
                        ))}

                    </ol>

                </div>

                {/* YOUR METHOD */}
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 shadow-sm">

                    <div className="flex justify-between items-center mb-6">

                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Your Method
                        </h2>

                        <FiSettings className="text-gray-500 cursor-pointer" />

                    </div>

                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                        {payoutMethod.name}
                    </h3>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">

                        <p>
                            <span className="text-gray-500 dark:text-gray-400">Account</span>
                            <br />
                            {payoutMethod.account}
                        </p>

                        <p>
                            <span className="text-gray-500 dark:text-gray-400">
                                Minimum payout
                            </span>
                            <br />
                            {payoutMethod.minimum}
                        </p>

                        <p>
                            <span className="text-gray-500 dark:text-gray-400">
                                Processing time
                            </span>
                            <br />
                            {payoutMethod.processing}
                        </p>

                        <p>
                            <span className="text-gray-500 dark:text-gray-400">
                                Schedule
                            </span>
                            <br />
                            {payoutMethod.schedule}
                        </p>

                    </div>

                </div>

            </div>

            {/* DOCUMENTS TABLE */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">

                <div className="p-6 border-b border-gray-200 dark:border-slate-700">

                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Documents
                    </h2>

                </div>

                <div className="overflow-x-auto p-4">

                    <table className="w-full text-sm min-w-[500px]">

                        <thead className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-slate-700">

                            <tr>
                                <th className="p-4 text-left">Date</th>
                                <th className="p-4 text-left">Document</th>
                                <th className="p-4 text-left">Status</th>
                                <th className="p-4 text-left">Comment</th>
                            </tr>

                        </thead>

                        <tbody>

                            {documents.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="p-10 text-center text-gray-500 dark:text-gray-400"
                                    >
                                        Here you will see your documents.
                                    </td>
                                </tr>
                            ) : (
                                documents.map((doc, index) => (
                                    <tr key={index}>
                                        <td className="p-4">{doc.date}</td>
                                        <td className="p-4">{doc.name}</td>
                                        <td className="p-4">{doc.status}</td>
                                        <td className="p-4">{doc.comment}</td>
                                    </tr>
                                ))
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* PAYOUT HISTORY */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">

                <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">

                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Payout history
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            For the last 12 months
                        </p>
                    </div>

                    <button className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
                        <FiFilter /> Filters
                    </button>

                </div>

                <div className="overflow-x-auto p-4">

                    <table className="w-full text-sm min-w-[700px]">

                        <thead className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-slate-700">

                            <tr>
                                <th className="p-4 text-left">Date</th>
                                <th className="p-4 text-left">Amount</th>
                                <th className="p-4 text-left">Fee</th>
                                <th className="p-4 text-left">Method</th>
                                <th className="p-4 text-left">Details</th>
                                <th className="p-4 text-left">Comment</th>
                                <th className="p-4 text-left">Document</th>
                            </tr>

                        </thead>

                        <tbody>

                            {payoutHistory.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="p-10 text-center text-gray-500 dark:text-gray-400"
                                    >
                                        No payouts yet.
                                    </td>
                                </tr>
                            ) : (
                                payoutHistory.map((item, index) => (
                                    <tr key={index}>
                                        <td className="p-4">{item.date}</td>
                                        <td className="p-4">{item.amount}</td>
                                        <td className="p-4">{item.fee}</td>
                                        <td className="p-4">{item.method}</td>
                                        <td className="p-4">{item.details}</td>
                                        <td className="p-4">{item.comment}</td>
                                        <td className="p-4">{item.document}</td>
                                    </tr>
                                ))
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};

export default Payouts;