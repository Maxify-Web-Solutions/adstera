import React from 'react';

const Testimonials = () => {
    const testimonials = [
        {
            name: "Sarah Jenkins",
            role: "Marketing Director",
            company: "TechFlow",
            content: "Adstera transformed our ad revenue. The targeting is precise and the ROI has been incredible.",
            image: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            name: "David Chen",
            role: "App Developer",
            company: "Appify",
            content: "Integration was smooth and the support team is top-notch. Highly recommend for any publisher.",
            image: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            name: "Michael Ross",
            role: "CEO",
            company: "StartUp Inc",
            content: "We've seen a 40% increase in engagement since switching to Adstera. The analytics are a game changer.",
            image: "https://randomuser.me/api/portraits/men/86.jpg"
        },
        {
            name: "Emily White",
            role: "Content Creator",
            company: "BlogDaily",
            content: "Finally an ad network that respects user experience while maximizing revenue. Love it!",
            image: "https://randomuser.me/api/portraits/women/65.jpg"
        },
        {
            name: "James Wilson",
            role: "Product Manager",
            company: "SoftSolutions",
            content: "The fraud protection gives us peace of mind. We know we are paying for real traffic.",
            image: "https://randomuser.me/api/portraits/men/22.jpg"
        }
    ];

    return (
        <section className="bg-slate-900 text-white py-16 md:py-20 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold">
                    Trusted by <span className="text-indigo-400">Industry Leaders</span>
                </h2>
            </div>
            
            {/* Gradient masks for smooth fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none"></div>

            <div className="flex gap-6 animate-marquee hover:[animation-play-state:paused]">
                {/* Duplicate the list to create seamless loop */}
                {[...testimonials, ...testimonials].map((item, index) => (
                    <div 
                        key={index} 
                        className="flex-shrink-0 w-[280px] md:w-[350px] bg-slate-800/50 border border-slate-700 p-6 rounded-xl hover:border-indigo-500/50 transition-colors"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-12 h-12 rounded-full border-2 border-indigo-500/30"
                            />
                            <div>
                                <h4 className="font-bold text-white">{item.name}</h4>
                                <p className="text-sm text-slate-400">{item.role}, {item.company}</p>
                            </div>
                        </div>
                        <p className="text-slate-300 italic">"{item.content}"</p>
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                    width: max-content;
                }
            `}</style>
        </section>
    );
};

export default Testimonials;