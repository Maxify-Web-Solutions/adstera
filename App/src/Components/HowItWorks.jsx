import React from "react";
import { FiUserPlus, FiSettings, FiTrendingUp } from "react-icons/fi";

const HowItWorks = () => {
    const stepsData = [
        {
            icon: <FiUserPlus size={28} />,
            title: "Create Account",
            description:
                "Sign up in minutes as an advertiser or publisher. It's free and easy to get started.",
        },
        {
            icon: <FiSettings size={28} />,
            title: "Configure",
            description:
                "Advertisers create campaigns and target audiences. Publishers place our ad code on their site.",
        },
        {
            icon: <FiTrendingUp size={28} />,
            title: "Launch & Grow",
            description:
                "Launch campaigns or start monetizing traffic while using analytics to improve performance.",
        },
    ];

    return (
        <section className="bg-slate-900 text-white py-20 relative overflow-hidden">

            {/* background glow */}
            <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 bg-cyan-500/10 blur-3xl"></div>

            <div className="max-w-6xl mx-auto px-6 relative">

                {/* heading */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold">How It Works</h2>
                    <p className="mt-4 text-gray-400 max-w-xl mx-auto">
                        Start using Adstera in just a few simple steps.
                    </p>
                </div>

                {/* steps container */}
                <div className="relative">

                    {/* vertical line for mobile */}
                    <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-slate-700 md:hidden"></div>

                    {/* desktop horizontal line */}
                    <div className="hidden md:block absolute top-10 left-0 w-full h-[2px] bg-slate-700"></div>

                    <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-3 md:gap-10">

                        {stepsData.map((step, index) => (
                            <div key={index} className="relative flex md:block">

                                {/* number */}
                                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-500 text-white text-sm font-bold md:mx-auto md:w-16 md:h-16 md:text-lg">
                                    {index + 1}
                                </div>

                                {/* content */}
                                <div className="ml-6 md:ml-0 md:text-center md:mt-8">

                                    <div className="text-indigo-400 mb-2 flex md:justify-center">
                                        {step.icon}
                                    </div>

                                    <h3 className="text-lg md:text-xl font-semibold">
                                        {step.title}
                                    </h3>

                                    <p className="text-slate-400 mt-2 max-w-sm md:mx-auto">
                                        {step.description}
                                    </p>

                                </div>
                            </div>
                        ))}

                    </div>
                </div>

            </div>
        </section>
    );
};

export default HowItWorks;