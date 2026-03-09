import React from 'react';
import { FiCheck } from 'react-icons/fi';

const PricingCard = ({ plan, price, features, isPopular }) => {
    return (
        <div className={`relative bg-slate-800/60 border rounded-xl p-8 transform hover:-translate-y-2 transition-transform duration-300 ${isPopular ? 'border-indigo-500 shadow-2xl shadow-indigo-500/20' : 'border-slate-700'}`}>
            {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
                </div>
            )}
            <h3 className="text-2xl font-bold text-white">{plan}</h3>
            <p className="mt-4">
                <span className="text-4xl font-bold text-white">{price === 'Custom' ? 'Custom' : `$${price}`}</span>
                {price !== 'Custom' && <span className="text-lg font-normal text-slate-400">/mo</span>}
            </p>
            
            <ul className="mt-8 space-y-4">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <FiCheck className="text-cyan-400 flex-shrink-0 mt-1" />
                        <span className="text-slate-300">{feature}</span>
                    </li>
                ))}
            </ul>

            <button className={`w-full mt-10 py-3 rounded-lg font-semibold transition ${isPopular ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20' : 'bg-slate-700 text-white hover:bg-slate-600'}`}>
                {plan === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
            </button>
        </div>
    );
};

const Pricing = () => {
    const pricingData = [
        {
            plan: 'Starter',
            price: '29',
            features: [
                '10,000 Impressions',
                'Basic Targeting',
                'Email Support',
                'Standard Analytics',
            ],
            isPopular: false,
        },
        {
            plan: 'Pro',
            price: '99',
            features: [
                '100,000 Impressions',
                'Advanced Targeting',
                'Real-time Analytics',
                'Fraud Protection',
                'Priority Support',
            ],
            isPopular: true,
        },
        {
            plan: 'Enterprise',
            price: 'Custom',
            features: [
                'Unlimited Impressions',
                'All Targeting Options',
                'API Access',
                'Custom Integrations',
                'Dedicated Account Manager',
            ],
            isPopular: false,
        },
    ];

    return (
        <section className="bg-slate-900 text-white relative py-20">
             <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-[900px] h-[900px] bg-purple-500/10 blur-3xl rounded-full -z-0"></div>

            <div className="max-w-7xl mx-auto px-6 relative">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                        Flexible Pricing for
                        <span className="block bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            Every Scale
                        </span>
                    </h2>
                    <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
                        Choose the plan that fits your needs. No hidden fees, cancel anytime.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {pricingData.map((plan, index) => (
                        <PricingCard key={index} {...plan} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;