import React from "react";
import { FiBarChart2, FiTarget, FiTrendingUp } from "react-icons/fi";
import Reveal from "./Reveal";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const DashboardPreview = () => {
    const features = [
        {
            icon: <FiBarChart2 />,
            text: "Real-time campaign analytics",
        },
        {
            icon: <FiTarget />,
            text: "Advanced audience targeting",
        },
        {
            icon: <FiTrendingUp />,
            text: "Performance optimization tools",
        },
    ];

    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth); // 👈 auth slice

    const handleClick = () => {
        if (user) {
            navigate("/dashboard");
        } else {
            navigate("/register");
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-white py-20 relative">

            {/* glow */}
            <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-indigo-500/10 blur-3xl rounded-full"></div>

            <div className="max-w-7xl mx-auto px-6 relative">

                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* text content */}
                    <div>

                        <h2 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 dark:text-white">
                            Powerful Dashboard
                            <span className="block bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                                Built for Performance
                            </span>
                        </h2>

                        <p className="mt-6 text-gray-500 dark:text-gray-400 text-lg max-w-lg">
                            Manage campaigns, analyze traffic, and optimize performance with
                            a powerful dashboard designed for both advertisers and publishers.
                        </p>

                        <ul className="mt-8 space-y-4 text-gray-600 dark:text-slate-300">
                            {features.map((item, index) => (
                                <li key={index} className="flex items-center gap-3 dark:text-slate-300 text-slate-900">
                                    <span className="text-indigo-400 text-lg">
                                        {item.icon}
                                    </span>
                                    {item.text}
                                </li>
                            ))}
                        </ul>

                        <button onClick={handleClick} className="mt-8 px-6 py-3 bg-indigo-600 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 text-white">
                            Explore Dashboard
                        </button>

                    </div>
                            <Reveal delay={0.3}>
                    {/* dashboard image */}
                    <div className="relative">

                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 blur-2xl rounded-xl"></div>

                        <img
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
                            alt="Dashboard Preview"
                            className="relative rounded-xl border border-gray-200 dark:border-slate-700 shadow-2xl"
                        />

                    </div>
                    </Reveal>

                </div>

            </div>
        </section>
    );
};

export default DashboardPreview;