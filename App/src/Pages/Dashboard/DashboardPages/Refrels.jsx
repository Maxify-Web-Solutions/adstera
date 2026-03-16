import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useSortableData } from "../../../Components/useSortableData"; 

const referralsData = [
    {
        email: "user1@email.com",
        date: "12 Mar 2026",
        status: "Active",
        earning: "$12.00",
    },
    {
        email: "user2@email.com",
        date: "10 Mar 2026",
        status: "Pending",
        earning: "$0.00",
    },
];

const Refrels = () => {
    const { items: sortedReferrals, requestSort, sortConfig } = useSortableData(referralsData);
    const referralLink = "https://yourwebsite.com/ref/vikram27";

    const copyLink = () => {
        navigator.clipboard.writeText(referralLink);
        alert("Referral link copied!");
    };

    const getSortIcon = (name) => {
        if (!sortConfig || sortConfig.key !== name) {
            return null;
        }
        if (sortConfig.direction === 'ascending') {
            return <FaArrowUp className="inline ml-1 opacity-50" size={12} />;
        }
        return <FaArrowDown className="inline ml-1 opacity-50" size={12} />;
    };

    return (
        <div className="space-y-10">

            {/* Page Title */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    Referral Program
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Invite friends and earn commission when they upgrade their plans.
                </p>
            </div>

            {/* Referral Link */}
            <div className="p-6 rounded-xl border bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">

                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Your Referral Link
                </h2>

                <div className="flex gap-3 flex-col md:flex-row">

                    <input
                        type="text"
                        readOnly
                        value={referralLink}
                        className="flex-1 px-4 py-2 rounded-lg border bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-700 text-sm"
                    />

                    <button
                        onClick={copyLink}
                        className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium"
                    >
                        Copy Link
                    </button>

                </div>

            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

                <div className="p-6 rounded-xl border bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Total Referrals
                    </p>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                        24
                    </h3>
                </div>

                <div className="p-6 rounded-xl border bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Total Earnings
                    </p>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                        $184.00
                    </h3>
                </div>

                <div className="p-6 rounded-xl border bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Conversion Rate
                    </p>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                        18%
                    </h3>
                </div>

            </div>

            {/* Referral Table */}
            <div className="rounded-xl border bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">

                <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                        Referred Users
                    </h2>
                </div>
                <div className="overflow-x-auto">

                <table className="w-full text-sm min-w-[500px]">

                    <thead className="bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-gray-400">
                        <tr>
                            <th className="p-4 text-left">
                                <button type="button" onClick={() => requestSort('email')} className="flex items-center gap-1 hover:text-gray-800 dark:hover:text-gray-200">
                                    User {getSortIcon('email')}
                                </button>
                            </th>
                            <th className="p-4 text-left">
                                <button type="button" onClick={() => requestSort('date')} className="flex items-center gap-1 hover:text-gray-800 dark:hover:text-gray-200">
                                    Joined {getSortIcon('date')}
                                </button>
                            </th>
                            <th className="p-4 text-left">
                                <button type="button" onClick={() => requestSort('status')} className="flex items-center gap-1 hover:text-gray-800 dark:hover:text-gray-200">
                                    Status {getSortIcon('status')}
                                </button>
                            </th>
                            <th className="p-4 text-left">
                                <button type="button" onClick={() => requestSort('earning')} className="flex items-center gap-1 hover:text-gray-800 dark:hover:text-gray-200">
                                    Earning {getSortIcon('earning')}
                                </button>
                            </th>
                        </tr>
                    </thead>

                    <tbody>

                        {sortedReferrals.map((ref, i) => (
                            <tr
                                key={i}
                                className="border-t border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
                            >

                                <td className="p-4 text-gray-800 dark:text-gray-200">
                                    {ref.email}
                                </td>

                                <td className="p-4 text-gray-600 dark:text-gray-400">
                                    {ref.date}
                                </td>

                                <td className="p-4">

                                    <span
                                        className={`px-3 py-1 rounded-full text-xs ${ref.status === "Active"
                                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                            }`}
                                    >
                                        {ref.status}
                                    </span>

                                </td>

                                <td className="p-4 text-gray-800 dark:text-gray-200">
                                    {ref.earning}
                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>

                </div>

            </div>

        </div>
    );
};

export default Refrels;