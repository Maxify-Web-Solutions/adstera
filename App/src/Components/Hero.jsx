import React from "react";
import { FiArrowRight } from "react-icons/fi";

const Hero = () => {
  return (
    <section className="bg-slate-900 text-white relative overflow-hidden">

      {/* subtle radial glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-500/10 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-cyan-500/10 blur-3xl rounded-full"></div>

      <div className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 items-center gap-12">

        {/* LEFT CONTENT */}
        <div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Next-Gen
            <span className="block bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Advertising Network
            </span>
          </h1>

          <p className="mt-6 text-gray-400 text-lg max-w-xl">
            Grow your reach with a powerful advertising ecosystem built for
            publishers and marketers. High-quality traffic, advanced targeting,
            and scalable monetization.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 mt-10">

            <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20">
              Buy Traffic
              <FiArrowRight />
            </button>

            <button className="flex items-center gap-2 px-6 py-3 border border-slate-600 rounded-lg font-semibold hover:bg-slate-800 transition">
              Start Earning
              <FiArrowRight />
            </button>

          </div>

        </div>

        {/* RIGHT VISUAL */}
        <div className="relative flex justify-center">

          {/* dotted background circle */}
          <div className="w-[320px] h-[320px] rounded-full border border-slate-700 relative flex items-center justify-center">

            {/* inner gradient circle */}
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-5xl font-bold shadow-xl shadow-indigo-500/30">
              A
            </div>

            {/* rotating ring */}
            <div className="absolute w-[380px] h-[380px] border border-slate-700 rounded-full animate-spin-slow opacity-40"></div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;