import React from "react";

const TrustedBy = () => {
  const companies = [
    { name: "Google", logo: "https://cdn.simpleicons.org/google/ffffff" },
    { name: "Meta", logo: "https://cdn.simpleicons.org/meta/ffffff" },
    { name: "Shopify", logo: "https://cdn.simpleicons.org/shopify/ffffff" },
    { name: "Stripe", logo: "https://cdn.simpleicons.org/stripe/ffffff" },
    { name: "Amazon", logo: "https://cdn.simpleicons.org/amazon/ffffff" },
    { name: "Netflix", logo: "https://cdn.simpleicons.org/netflix/ffffff" }
  ];

  return (
    <section className="bg-white dark:bg-slate-900 text-gray-800 dark:text-white py-16 md:py-20 relative transition-colors duration-300">

      {/* glow background */}
      <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 bg-cyan-500/10 blur-3xl rounded-full"></div>

      <div className="max-w-6xl mx-auto px-6 relative">

        {/* heading */}
        <div className="text-center mb-12">
          <p className="text-gray-500 dark:text-slate-400 text-sm uppercase tracking-widest">
            Trusted by companies worldwide
          </p>
        </div>

        {/* logos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-10 items-center">

          {companies.map((company, index) => (
            <div
              key={index}
              className="flex justify-center opacity-70 hover:opacity-100 transition duration-300"
            >
              <img
                src={company.logo}
                alt={company.name}
                className="h-8 md:h-10 grayscale hover:grayscale-0 transition invert dark:invert-0"
              />
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default TrustedBy;