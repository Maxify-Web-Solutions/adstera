import React, { useEffect, useState } from "react";
import AddWebsiteModal from "./AddWebsiteModal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Construction, Hammer, Clock3 } from "lucide-react";

const Websites = () => {

    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [showSteps, setShowSteps] = useState(true);
    const [showTips, setShowTips] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);

        if (params.get("openModal") === "true") {
            setIsOpen(true);
        }
    }, [location]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">

            <div className="w-full max-w-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl shadow-xl p-8 md:p-12 text-center">

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-yellow-100 dark:bg-yellow-500/10 flex items-center justify-center">
                        <Construction className="w-12 h-12 text-yellow-500" />
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Feature Under Construction
                </h1>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
                    We're currently working on the <span className="font-semibold text-yellow-500">Websites</span> feature
                    to make it faster, smoother, and more powerful for you.
                </p>

                {/* Status Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">

                    <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
                        <Hammer className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            Development in Progress
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            New tools and website integrations are being added.
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
                        <Clock3 className="w-8 h-8 text-green-500 mx-auto mb-3" />
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            Coming Soon
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            This section will be available in a future update.
                        </p>
                    </div>

                </div>

                {/* Back Button */}
                <div className="mt-10">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium shadow-lg hover:scale-105 transition-all duration-300"
                    >
                        Back to Dashboard
                    </button>
                </div>

            </div>

        </div>
    );
};

export default Websites;