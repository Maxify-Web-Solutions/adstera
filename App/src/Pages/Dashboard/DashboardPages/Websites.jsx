import React, { useEffect, useState } from "react";
import AddWebsiteModal from "./AddWebsiteModal";
import { useLocation, useNavigate } from "react-router-dom";

const Websites = () => {

    const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("openModal") === "true") {
      setIsOpen(true);
    }
  }, [location]);


    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-300">

            <div>
      {isOpen && <AddWebsiteModal onClose={() => setIsOpen(false)} />}
    </div>

            <div className="container px-4 py-8 md:py-10">

                {/* Page Title */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">

                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        Websites
                    </h1>

                    <button className="bg-green-600 hover:bg-green-700 px-6 py-2.5 rounded-xl text-white font-medium shadow-lg shadow-green-600/20 transition-all hover:scale-[1.02]"
                    onClick={() => navigate("/dashboard/websites?openModal=true")}
                    >
                        ADD WEBSITE
                    </button>

                </div>

                {/* 3 Steps Section */}
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 mb-8 shadow-sm">

                    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            3 steps to monetize your website
                        </h2>

                        <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                            HIDE TIPS
                        </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">

                        <div>
                            <h3 className="text-gray-900 dark:text-white font-semibold mb-2">
                                1 Add your website
                            </h3>

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Click ADD WEBSITE to get started. Enter your website URL and category.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-gray-900 dark:text-white font-semibold mb-2">
                                2 Create Ad Unit
                            </h3>

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Choose an ad format and generate your ad code.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-gray-900 dark:text-white font-semibold mb-2">
                                3 Copy and embed code
                            </h3>

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Copy the code and paste it into your website HTML.
                            </p>
                        </div>

                    </div>

                </div>

                {/* Tips */}
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 shadow-sm">

                    <span className="text-gray-400">
                        Get Anti-Adblock to increase your revenue
                    </span>

                    <button className="text-sm text-gray-400 hover:text-white flex-shrink-0">
                        SHOW TIPS
                    </button>

                </div>

                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 shadow-sm">

                    <span className="text-gray-400">
                        If you don't have a website, GO TO SMARTLINKS page to create a link.
                    </span>

                    <button className="text-blue-400 hover:text-blue-300 flex-shrink-0 text-right sm:text-left">
                        GO TO SMARTLINKS
                    </button>

                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 mb-6 shadow-sm">

                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

                        <input
                            type="text"
                            placeholder="Website search"
                            className="bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-2.5 w-full md:w-72 text-gray-800 dark:text-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                        />

                        <div className="space-x-3">

                            <button className="border border-gray-300 dark:border-slate-700 px-6 py-2.5 rounded-xl text-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                                EXPORT WEBSITES
                            </button>

                            <button className="bg-green-600 hover:bg-green-700 px-6 py-2.5 rounded-xl text-white font-medium shadow-lg shadow-green-600/20 transition-all hover:scale-[1.02]"
                            onClick={() => navigate("/dashboard/websites?openModal=true")}
                            >
                                ADD WEBSITE
                            </button>

                        </div>

                    </div>

                    <div className="grid md:grid-cols-4 gap-4">

                        <select className="bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 px-4 py-2.5 rounded-xl text-gray-800 dark:text-gray-300 focus:ring-2 focus:ring-green-500 outline-none">
                            <option>Statistics</option>
                            <option>Turned on</option>
                            <option>Turned off</option>
                        </select>

                        <select className="bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 px-4 py-2.5 rounded-xl text-gray-800 dark:text-gray-300 focus:ring-2 focus:ring-green-500 outline-none">
                            <option>Visibility</option>
                            <option>Visible</option>
                            <option>Hidden</option>
                        </select>

                        <select className="bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 px-4 py-2.5 rounded-xl text-gray-800 dark:text-gray-300 focus:ring-2 focus:ring-green-500 outline-none">
                            <option>Website status</option>
                            <option>Approved</option>
                            <option>Declined</option>
                            <option>Pending</option>
                        </select>

                        <select className="bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 px-4 py-2.5 rounded-xl text-gray-800 dark:text-gray-300 focus:ring-2 focus:ring-green-500 outline-none">
                            <option>Ad Unit status</option>
                            <option>Active</option>
                            <option>Inactive</option>
                            <option>Pending</option>
                            <option>Not supported</option>
                        </select>

                    </div>

                </div>

                {/* Desktop Table */}
                <div className="hidden md:block bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">

                    <div className="overflow-x-auto">

                    <table className="w-full text-left min-w-[600px]">

                        <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 text-sm">

                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">Website</th>
                                <th className="p-4">Ad unit(s)</th>
                                <th className="p-4">Statistics</th>
                                <th className="p-4">About</th>
                            </tr>

                        </thead>

                        <tbody>

                            <tr className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700">

                                <td className="p-4">5467803</td>
                                <td className="p-4">saroexstor.us.blogspot.com</td>
                                <td className="p-4">4 ad unit(s)</td>
                                <td className="p-4 text-blue-400">Statistics</td>
                                <td className="p-4 text-blue-400">About</td>

                            </tr>

                        </tbody>

                    </table>
                    
                    </div>

                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">

                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-3">

                        <div className="flex justify-between items-center">
                            <h3 className="text-gray-900 dark:text-white font-semibold">
                                saroexstor.us.blogspot.com
                            </h3>
                            <span className="text-xs text-gray-400">ID: 5467803</span>
                        </div>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            4 ad unit(s)
                        </p>

                        <div className="flex flex-wrap gap-3 text-sm pt-2">
                            <button className="text-blue-400">Statistics</button>
                            <button className="text-blue-400">About</button>
                        </div>

                    </div>

                </div>

            </div>


        </div>
    );
};

export default Websites;