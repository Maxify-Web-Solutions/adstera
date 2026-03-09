import React from 'react';
import { FiUserPlus, FiSettings, FiTrendingUp } from 'react-icons/fi';

const HowItWorks = () => {
    const stepsData = [
        {
            icon: <FiUserPlus size={40} />,
            title: 'Create Account',
            description: 'Sign up in minutes as an advertiser or publisher. It\'s free and easy to get started.',
        },
        {
            icon: <FiSettings size={40} />,
            title: 'Configure',
            description: 'Advertisers: create your campaign and define your audience. Publishers: place our ad code on your site.',
        },
        {
            icon: <FiTrendingUp size={40} />,
            title: 'Launch & Grow',
            description: 'Launch campaigns or start monetizing traffic. Use our real-time analytics to optimize for the best results.',
        },
    ];

    return (
        <section className="bg-slate-900 text-white relative py-16 md:py-20">
            {/* Decorative blur */}
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 w-[800px] h-[800px] bg-cyan-500/10 blur-3xl rounded-full -z-0"></div>

            <div className="max-w-7xl mx-auto px-6 relative">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                        How It Works
                    </h2>
                    <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
                        Start your journey with Adstera in just a few simple steps.
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-slate-700" aria-hidden="true"></div>
                    
                    <div className="relative grid md:grid-cols-3 gap-x-8 gap-y-16">
                        {stepsData.map((step, index) => (
                            <div key={index} className="relative text-center">
                                <div className="flex flex-col items-center">
                                    {/* Step Circle */}
                                    <div className="relative flex items-center justify-center w-20 h-20 bg-slate-900 border-2 border-slate-700 rounded-full text-2xl font-bold text-white z-10">
                                        <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">{index + 1}</span>
                                    </div>
                                    <div className="mt-8 text-indigo-400">
                                        {step.icon}
                                    </div>
                                    <h3 className="mt-4 text-xl font-bold text-white">{step.title}</h3>
                                    <p className="mt-2 text-slate-400 max-w-xs mx-auto">{step.description}</p>
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