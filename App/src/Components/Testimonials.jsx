import React from "react";

const Testimonials = () => {
    const testimonials = [
        {
            name: "Sarah Jenkins",
            role: "Marketing Director",
            company: "TechFlow",
            content:
                "Adstorx transformed our ad revenue. The targeting is precise and the ROI has been incredible.",
            image: "https://randomuser.me/api/portraits/women/44.jpg",
        },
        {
            name: "David Chen",
            role: "App Developer",
            company: "Appify",
            content:
                "Integration was smooth and the support team is top-notch. Highly recommend for any publisher.",
            image: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        {
            name: "Michael Ross",
            role: "CEO",
            company: "StartUp Inc",
            content:
                "We've seen a 40% increase in engagement since switching to Adstorx. The analytics are a game changer.",
            image: "https://randomuser.me/api/portraits/men/86.jpg",
        },
        {
            name: "Emily White",
            role: "Content Creator",
            company: "BlogDaily",
            content:
                "Finally an ad network that respects user experience while maximizing revenue.",
            image: "https://randomuser.me/api/portraits/women/65.jpg",
        },
        {
            name: "James Wilson",
            role: "Product Manager",
            company: "SoftSolutions",
            content:
                "The fraud protection gives us peace of mind. We know we are paying for real traffic.",
            image: "https://randomuser.me/api/portraits/men/22.jpg",
        },
    ];

    return (
        <section className="bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-white py-20 relative overflow-hidden transition-colors duration-300">

            {/* heading */}
            <div className="max-w-7xl mx-auto px-6 mb-14 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
                    Trusted by <span className="text-indigo-400">Industry Leaders</span>
                </h2>

                <p className="text-gray-500 dark:text-slate-400 mt-4 max-w-xl mx-auto">
                    Thousands of advertisers and publishers trust Adstorx to grow their business.
                </p>
            </div>

            {/* gradient fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-28 bg-gradient-to-r from-gray-50 dark:from-slate-900 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-28 bg-gradient-to-l from-gray-50 dark:from-slate-900 to-transparent z-10"></div>

            <div className="overflow-hidden pt-5">
                <div className="flex gap-5 md:gap-8 animate-marquee hover:[animation-play-state:paused]">

                    {[...testimonials, ...testimonials].map((item, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-[260px] sm:w-[300px] md:w-[360px]
              bg-white dark:bg-slate-800/60 backdrop-blur-lg
              border border-gray-200 dark:border-slate-700
              rounded-2xl
              p-6 md:p-7
              transition-all duration-300
              hover:border-indigo-500/50
              hover:-translate-y-2
              hover:shadow-xl hover:shadow-indigo-500/10"
                        >
                            {/* stars */}
                            <div className="text-yellow-400 text-sm mb-3">
                                ★★★★★
                            </div>

                            {/* testimonial */}
                            <p className="text-gray-600 dark:text-slate-300 text-sm md:text-base leading-relaxed italic mb-6">
                                "{item.content}"
                            </p>

                            {/* user */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-11 h-11 md:w-12 md:h-12 rounded-full border border-indigo-500/40"
                                />

                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                                        {item.name}
                                    </h4>

                                    <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400">
                                        {item.role} · {item.company}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

            <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-marquee {
          animation: marquee 45s linear infinite;
          width: max-content;
        }

        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: 70s;
          }
        }
      `}</style>

        </section>
    );
};

export default Testimonials;