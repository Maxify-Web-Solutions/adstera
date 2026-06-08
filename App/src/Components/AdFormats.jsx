import React from "react";
import { FiLayout, FiBell, FiImage, FiMonitor } from "react-icons/fi";

const AdFormats = () => {
  const formats = [
    {
      icon: "https://i.ibb.co/mV2qz2Wt/Popunder.jpg",
      title: "Pop Ads",
      description:
        "High-converting pop-under ads that capture user attention and deliver strong engagement.",
    },
    {
      icon: "https://i.ibb.co/whJNPhp6/Native-banner.jpg",
      title: "Native Ads",
      description:
        "Seamlessly integrated ads that match your content and provide a non-intrusive experience.",
    },
    {
      icon: "https://i.ibb.co/TqT44hc9/banners.jpg",
      title: "Banner Ads",
      description:
        "Responsive display ads optimized for performance across desktop and mobile devices.",
    },
    {
      icon: "https://i.ibb.co/pv5fb6h6/notification.jpg",
      title: "Push Notifications",
      description:
        "Reach users directly through browser push notifications with high visibility and CTR.",
    },
  ];

  return (
    <section className="bg-white dark:bg-slate-900 text-gray-800 dark:text-white py-16 md:py-20 relative transition-colors duration-300">

      {/* background glow */}
      <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 bg-indigo-500/10 blur-3xl rounded-full"></div>

      <div className="max-w-[95rem] mx-auto px-6 relative">

        {/* heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Powerful {" "}
            <span className=" bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Ad Formats
            </span>
          </h2>

          <p className="mt-4 text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Choose from a wide variety of ad formats designed to maximize
            engagement and revenue.
          </p>
        </div>

        {/* formats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {formats.map((format, index) => (
            <div
              key={index}
              className="overflow-hidden bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl transition duration-300 hover:-translate-y-2 hover:border-indigo-500/50"
            >
              <div className="h-50 w-full">
                <img
                  src={format.icon}
                  alt={format.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {format.title}
                </h3>

                <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">
                  {format.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AdFormats;