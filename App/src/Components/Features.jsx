import React from 'react';
import { FiTarget, FiBarChart2, FiShield } from 'react-icons/fi';
import Reveal from './Reveal';

const FeatureCard = ({ icon, title, description }) => {
    return (
        <div className="bg-white/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl p-6 transform hover:-translate-y-2 transition-transform duration-300">
            <div className="text-indigo-400 mb-4">{icon}</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-slate-400">{description}</p>
        </div>
    );
};

const Features = () => {
    const featuresData = [
        {
            icon: <FiTarget size={32} />,
            title: 'Advanced Targeting',
            description: 'Reach your perfect audience with our granular targeting options, including geo, device, and user behavior.',
        },
        {
            icon: <FiBarChart2 size={32} />,
            title: 'Real-time Analytics',
            description: 'Monitor your campaign performance with a powerful dashboard and make data-driven decisions on the fly.',
        },
        {
            icon: <FiShield size={32} />,
            title: 'Fraud Protection',
            description: 'Our proprietary anti-fraud system ensures you only pay for high-quality, genuine traffic.',
        },
    ];

    return (
        <section className="bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-white relative py-16 md:py-20">
            <div className="absolute top-0 -translate-x-1/2 left-1/2 w-[800px] h-[800px] bg-cyan-500/10 blur-3xl rounded-full -z-0"></div>

            <div className="max-w-7xl mx-auto px-6 relative">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 dark:text-white">
                        Everything You Need to
                        <span className="block bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            Succeed
                        </span>
                    </h2>
                    <p className="mt-4 text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                        Our platform is packed with features designed to maximize your ROI and streamline your advertising efforts.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {featuresData.map((feature, index) => (
                        <Reveal key={index} delay={index * 0.2}>
                            <FeatureCard {...feature} />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;