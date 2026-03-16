import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getOverviewData } from "../../redux/slice/overviewSlice";

const defaultStats = [
    { title: "Active Package", value: "Pro Plan" },
    { title: "Scrapes Used", value: "1,250 / 5,000" },
    { title: "Leads Collected", value: "8,320" },
    { title: "Account Status", value: "Active" },
];

const defaultActivities = [
    {
        title: "Scraping started",
        description: "Location: New York | Category: Restaurants",
        time: "2 hours ago",
    },
    {
        title: "Package upgraded",
        description: "Upgraded to Pro Plan",
        time: "1 day ago",
    },
    {
        title: "Export completed",
        description: "Leads exported to Google Sheets",
        time: "3 days ago",
    },
];

const Overview = () => {
    // const dispatch = useDispatch();
    // const { stats, activities } = useSelector((state) => state.overview);

    // useEffect(() => {
    //     dispatch(getOverviewData());
    // }, [dispatch]);

    const displayStats = defaultStats; // stats || defaultStats;
    const displayActivities = defaultActivities; // activities || defaultActivities;

    return (
        <div>

            {/* Title */}
            <div className="mb-10">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Dashboard
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Welcome back! Here's an overview of your account activity.
                </p>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {displayStats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700"
                    >
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                            {stat.title}
                        </p>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {stat.value}
                        </h3>
                    </div>
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* Quick Actions */}
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        Quick Actions
                    </h3>

                    <div className="space-y-4">

                        <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium">
                            Start New Scrape
                        </button>

                        <button className="w-full py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-lg text-gray-800 dark:text-white font-medium">
                            Export Leads
                        </button>

                        <button className="w-full py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-lg text-gray-800 dark:text-white font-medium">
                            Upgrade Package
                        </button>

                    </div>

                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        Recent Activity
                    </h3>

                    <div className="space-y-6">

                        {displayActivities.map((item, index) => (
                            <div key={index} className="border-b border-gray-200 dark:border-slate-700 pb-4 last:border-b-0">

                                <h4 className="text-gray-900 dark:text-white font-medium">
                                    {item.title}
                                </h4>

                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    {item.description}
                                </p>

                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    {item.time}
                                </p>

                            </div>
                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Overview;