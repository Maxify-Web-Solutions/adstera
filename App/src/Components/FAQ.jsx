import React, { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="py-6">
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center text-left gap-4"
            >
                <h3 className="text-lg font-semibold text-white">{question}</h3>
                <span className="text-indigo-400 flex-shrink-0">
                    {isOpen ? <FiMinus size={24} /> : <FiPlus size={24} />}
                </span>
            </button>
            <div
                className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'
                }`}
            >
                <div className="overflow-hidden">
                    <p className="text-slate-400">
                        {answer}
                    </p>
                </div>
            </div>
        </div>
    );
};

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqData = [
        {
            question: 'What is Adstera?',
            answer: 'Adstera is a next-generation advertising network that connects publishers and advertisers. We provide tools for traffic monetization, audience targeting, and real-time analytics to maximize your revenue and reach.',
        },
        {
            question: 'How do I get paid as a publisher?',
            answer: 'We offer flexible payment options, including PayPal, Wire Transfer, and Paxum. Payments are processed on a NET 30 basis, with faster schedules available for high-performing partners.',
        },
        {
            question: 'What kind of traffic is not allowed?',
            answer: 'We have a strict policy against fraudulent, bot, or incentivized traffic. Our anti-fraud system actively monitors for any violations to ensure high-quality traffic for our advertisers. Please refer to our terms of service for a complete list.',
        },
        {
            question: 'Can I target specific countries or devices?',
            answer: 'Yes! Our Pro and Enterprise plans offer advanced targeting options, allowing you to filter traffic by country, device type, operating system, browser, and more to reach your ideal audience.',
        },
    ];

    return (
        <section className="bg-slate-900 text-white relative py-16 md:py-20">
            <div className="absolute -bottom-20 -translate-x-1/2 left-1/2 w-[800px] h-[800px] bg-indigo-500/10 blur-3xl rounded-full -z-0"></div>

            <div className="max-w-4xl mx-auto px-6 relative">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                        Frequently Asked
                        <span className="block bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            Questions
                        </span>
                    </h2>
                    <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
                        Have questions? We've got answers. If you can't find what you're looking for, feel free to contact our support team.
                    </p>
                </div>

                <div className="divide-y divide-slate-700">
                    {faqData.map((item, index) => (
                        <AccordionItem
                            key={index}
                            question={item.question}
                            answer={item.answer}
                            isOpen={openIndex === index}
                            onClick={() => handleToggle(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
    
};

export default FAQ;