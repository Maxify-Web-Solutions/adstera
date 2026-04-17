import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <section className="bg-white dark:bg-slate-900 text-gray-800 dark:text-white relative overflow-hidden">

            {/* background glow */}
            <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-500/10 blur-3xl rounded-full"></div>
            <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-cyan-500/10 blur-3xl rounded-full"></div>

            <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 items-center gap-12">

                {/* LEFT CONTENT */}
                <motion.div
                    initial={{ opacity: 0, x: -80 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }} className="text-center md:text-left">

                    <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
                        Next-Gen
                        <span className="block bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            Advertising Network
                        </span>
                    </h1>

                    <p className="mt-6 text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto md:mx-0">
                        Grow your reach with a powerful advertising ecosystem built for
                        publishers and marketers. High-quality traffic, advanced targeting,
                        and scalable monetization.
                    </p>

                    <div className="flex flex-wrap gap-4 mt-10 justify-center md:justify-start">

                        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 text-white">
                            Buy Traffic
                            <FiArrowRight />
                        </button>

                        <Link to="/register">
                            <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-slate-600 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-slate-800 transition">
                                Start Earning
                                <FiArrowRight />
                            </button>
                        </Link>
                    </div>

                </motion.div>

                {/* RIGHT VISUAL */}
                <motion.div
                    initial={{ opacity: 0, x: 80 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }} className="relative flex justify-center mt-10 md:mt-0">

                    <div className="relative flex items-center justify-center">

                        {/* ripple rings */}
                        <span className="ripple ripple1"></span>
                        <span className="ripple ripple2"></span>
                        <span className="ripple ripple3"></span>
                        <span className="ripple ripple4"></span>
                        <span className="ripple ripple5"></span>
                        <span className="ripple ripple6"></span>
                        <span className="ripple ripple7"></span>
                        <span className="ripple ripple8"></span>

                        {/* center logo */}
                        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-4xl md:text-5xl font-bold shadow-xl shadow-indigo-500/30">
                            A
                        </div>

                    </div>

                </motion.div>

            </div>

            <style>{`

                .ripple {
                    position: absolute;
                    width: 150px;
                    height: 150px;
                    border-radius: 9999px;
                    border: 2px solid rgba(99,102,241,0.4);
                    animation: rippleEffect 4s infinite;
                }

                .ripple1 { animation-delay: 0s; }
                .ripple2 { animation-delay: 0.8s; }
                .ripple3 { animation-delay: 1.6s; }
                .ripple4 { animation-delay: 2.4s; }
                .ripple5 { animation-delay: 3.2s; }
                .ripple6 { animation-delay: 4.0s; }
                .ripple7 { animation-delay: 4.8s; }
                .ripple8 { animation-delay: 5.6s; }
                .ripple9 { animation-delay: 6.4s; }

                @keyframes rippleEffect {
                    0% {
                        transform: scale(1);
                        opacity: 0.6;
                    }
                    70% {
                        transform: scale(3);
                        opacity: 0;
                    }
                    100% {
                        opacity: 0;
                    }
                }

            `}</style>

        </section>
    );
};

export default Hero;