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
            <div className="p-6 md:p-8 rounded-2xl border bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm">

                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Your Referral Link
                </h2>

                <div className="flex gap-3 flex-col md:flex-row">

                    <input
                        type="text"
                        readOnly
                        value={referralLink}
                        className="flex-1 px-4 py-3 rounded-xl border bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-700 text-gray-600 dark:text-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                    />

                    <button
                        onClick={copyLink}
                        className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium shadow-lg shadow-green-600/20 transition-all hover:scale-[1.02]"
                    >
                        Copy Link
                    </button>

                </div>

            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

                <div className="p-6 rounded-2xl border bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Total Referrals
                    </p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        24
                    </h3>
                </div>

                <div className="p-6 rounded-2xl border bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Total Earnings
                    </p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        $184.00
                    </h3>
                </div>

                <div className="p-6 rounded-2xl border bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Conversion Rate
                    </p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        18%
                    </h3>
                </div>

            </div>

            {/* Referral Table - Desktop */}
            <div className="hidden md:block rounded-2xl border bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">

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

            {/* Referral Cards - Mobile */}
            <div className="md:hidden space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white px-1">
                    Referred Users
                </h2>
                
                {sortedReferrals.length > 0 ? (
                    sortedReferrals.map((ref, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">User</span>
                                    <span className="text-gray-900 dark:text-white font-medium break-all">
                                        {ref.email}
                                    </span>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs whitespace-nowrap shrink-0 ${ref.status === "Active"
                                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                    }`}
                                >
                                    {ref.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Joined</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{ref.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Earning</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{ref.earning}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 text-gray-500">
                        No referrals found.
                    </div>
                )}
            </div>

        </div>
    );
};

export default Refrels;