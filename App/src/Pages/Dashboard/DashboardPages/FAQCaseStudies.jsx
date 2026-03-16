import React from "react";
import {
    FaCog,
    FaCode,
    FaChartBar,
    FaMoneyBillWave,
    FaShieldAlt,
    FaArrowRight
} from "react-icons/fa";

const faqCategories = [
    {
        title: "Getting Started",
        desc: "Setup, onboarding, and first steps",
        articles: 9,
        icon: <FaCog />,
    },
    {
        title: "Ad Units & Code Snippets",
        desc: "Integration and implementation guides",
        articles: 9,
        icon: <FaCode />,
    },
    {
        title: "Statistics",
        desc: "Understanding analytics and reports",
        articles: 5,
        icon: <FaChartBar />,
    },
    {
        title: "Payouts",
        desc: "Payment methods, thresholds, and schedule",
        articles: 10,
        icon: <FaMoneyBillWave />,
    },
    {
        title: "Legal",
        desc: "Terms, policies, and compliance",
        articles: 5,
        icon: <FaShieldAlt />,
    },
];

const guides = [
    {
        title: "Popunder Ads",
        desc: "How popunder ads work and best practices.",
    },
    {
        title: "Social Bar Ads",
        desc: "Use social bar ads to boost engagement.",
    },
    {
        title: "Native Banners",
        desc: "Blend ads seamlessly with your content.",
    },
];

const stories = [
    {
        title: "How a Blogger Earned $5000",
        desc: "Case study of a niche blog monetization strategy.",
    },
    {
        title: "YouTube Traffic Monetization",
        desc: "Using smartlinks to monetize video audiences.",
    },
    {
        title: "Scaling Mobile Traffic",
        desc: "Maximizing ad revenue from mobile users.",
    },
];

const FAQCaseStudies = () => {
    return (
        <div className="space-y-16">

            {/* FAQ */}
            <div>

                <div className="flex justify-between items-center mb-8">

                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        FAQ
                    </h1>

                    <button className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        OPEN FAQ <FaArrowRight size={14} />
                    </button>

                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    {faqCategories.map((cat, i) => (
                        <div
                            key={i}
                            className="p-6 rounded-xl border bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:shadow-md transition cursor-pointer"
                        >

                            <div className="flex items-center gap-4 mb-4">

                                <div className="p-3 rounded-lg bg-gray-100 dark:bg-slate-700 text-lg text-gray-700 dark:text-gray-200">
                                    {cat.icon}
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {cat.title}
                                    </h3>

                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {cat.articles} articles
                                    </p>
                                </div>

                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {cat.desc}
                            </p>

                        </div>
                    ))}

                </div>

            </div>

            {/* Guides */}
            <div>

                <div className="flex justify-between items-center mb-8">

                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                        Guides to Ad Formats
                    </h2>

                    <button className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        LEARN MORE <FaArrowRight size={14} />
                    </button>

                </div>

                <div className="grid md:grid-cols-3 gap-6">

                    {guides.map((guide, i) => (
                        <div
                            key={i}
                            className="h-48 flex flex-col justify-end p-6 rounded-xl border bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:shadow-md transition"
                        >

                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                {guide.title}
                            </h3>

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {guide.desc}
                            </p>

                        </div>
                    ))}

                </div>

            </div>

            {/* Success Stories */}
            <div>

                <div className="flex justify-between items-center mb-8">

                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                        Success Stories
                    </h2>

                    <button className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        LEARN MORE <FaArrowRight size={14} />
                    </button>

                </div>

                <div className="grid md:grid-cols-3 gap-6">

                    {stories.map((story, i) => (
                        <div
                            key={i}
                            className="p-6 rounded-xl border bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:shadow-md transition"
                        >

                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                {story.title}
                            </h3>

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {story.desc}
                            </p>

                        </div>
                    ))}

                </div>

            </div>

        </div>
    );
};

export default FAQCaseStudies;