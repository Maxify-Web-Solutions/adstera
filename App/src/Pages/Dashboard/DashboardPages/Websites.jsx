import React from "react";

const Websites = () => {
    return (
        <div className="min-h-screen text-gray-800 dark:text-gray-300">

            

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Page Title */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">

                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        Websites
                    </h1>

                    <button className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white font-medium">
                        ADD WEBSITE
                    </button>

                </div>

                {/* 3 Steps Section */}
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 md:p-8 mb-8">

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
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 mb-4 flex justify-between">

                    <span className="text-gray-400">
                        Get Anti-Adblock to increase your revenue
                    </span>

                    <button className="text-sm text-gray-400 hover:text-white">
                        SHOW TIPS
                    </button>

                </div>

                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 mb-8 flex justify-between">

                    <span className="text-gray-400">
                        If you don't have a website, GO TO SMARTLINKS page to create a link.
                    </span>

                    <button className="text-blue-400 hover:text-blue-300">
                        GO TO SMARTLINKS
                    </button>

                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 md:p-6 mb-6">

                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

                        <input
                            type="text"
                            placeholder="Website search"
                            className="bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 w-full md:w-72 text-gray-800 dark:text-gray-300"
                        />

                        <div className="space-x-3">

                            <button className="border border-gray-300 dark:border-slate-700 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-300">
                                EXPORT WEBSITES
                            </button>

                            <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white">
                                ADD WEBSITE
                            </button>

                        </div>

                    </div>

                    <div className="grid md:grid-cols-4 gap-4">

                        <select className="bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 p-2 rounded-lg text-gray-800 dark:text-gray-300">
                            <option>Statistics</option>
                        </select>

                        <select className="bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 p-2 rounded-lg text-gray-800 dark:text-gray-300">
                            <option>Visibility</option>
                        </select>

                        <select className="bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 p-2 rounded-lg text-gray-800 dark:text-gray-300">
                            <option>Website status</option>
                        </select>

                        <select className="bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 p-2 rounded-lg text-gray-800 dark:text-gray-300">
                            <option>Ad Unit status</option>
                        </select>

                    </div>

                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl">

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

            </div>


        </div>
    );
};

export default Websites;