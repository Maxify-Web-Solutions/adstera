import React, { useEffect } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import BackToTop from "../Components/BackToTop";

const team = [
    {
        name: "Admin",
        role: "Founder & CEO",
        image: "https://i.pravatar.cc/200?img=1",
    },
    {
        name: "Sarah Johnson",
        role: "Product Manager",
        image: "https://i.pravatar.cc/200?img=5",
    },
    {
        name: "Daniel Lee",
        role: "Lead Developer",
        image: "https://i.pravatar.cc/200?img=8",
    },
    {
        name: "Emily Carter",
        role: "Marketing Lead",
        image: "https://i.pravatar.cc/200?img=10",
    },
];

const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "120+", label: "Countries Reached" },
    { number: "500M+", label: "Ad Impressions" },
    { number: "99.9%", label: "Platform Uptime" },
];

const AboutUs = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 text-gray-300">

            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">

                {/* HERO */}
                <div className="text-center mb-24">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        About Our Platform
                    </h1>

                    <p className="max-w-3xl mx-auto text-gray-400 text-lg">
                        We are building a powerful advertising ecosystem designed to help
                        businesses reach the right audience while empowering publishers to
                        monetize their traffic efficiently.
                    </p>
                </div>

                {/* STORY */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-24">

                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6">
                            Our Story
                        </h2>

                        <p className="text-gray-400 mb-4">
                            Our journey started with a simple idea: advertising should be
                            transparent, efficient, and accessible to everyone.
                        </p>

                        <p className="text-gray-400 mb-4">
                            We created a platform that bridges the gap between advertisers
                            and publishers by connecting high-quality traffic with powerful
                            monetization tools.
                        </p>

                        <p className="text-gray-400">
                            Today our platform serves thousands of users globally and
                            continues to grow with innovative advertising technology.
                        </p>
                    </div>

                    <div className="bg-slate-800 p-10 rounded-2xl border border-slate-700">
                        <h3 className="text-xl font-semibold text-white mb-4">
                            Our Mission
                        </h3>

                        <p className="text-gray-400">
                            Our mission is to build a transparent advertising ecosystem
                            where businesses reach their ideal audience and publishers
                            monetize their traffic efficiently.
                        </p>

                        <h3 className="text-xl font-semibold text-white mt-8 mb-4">
                            Our Vision
                        </h3>

                        <p className="text-gray-400">
                            To become one of the most trusted and innovative advertising
                            platforms globally by delivering powerful technology and
                            exceptional user experience.
                        </p>
                    </div>

                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">

                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-center hover:border-indigo-500/40 transition"
                        >
                            <h3 className="text-3xl font-bold text-white">
                                {stat.number}
                            </h3>

                            <p className="text-gray-400 mt-2 text-sm">
                                {stat.label}
                            </p>
                        </div>
                    ))}

                </div>

                {/* VALUES */}
                <div className="mb-24">

                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Our Core Values
                        </h2>
                        <p className="text-gray-400">
                            Principles that guide everything we build.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">

                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-indigo-500/40 transition">
                            <h3 className="text-lg font-semibold text-white mb-3">
                                Transparency
                            </h3>
                            <p className="text-gray-400 text-sm">
                                We believe in honest communication and clear reporting
                                for advertisers and publishers.
                            </p>
                        </div>

                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-indigo-500/40 transition">
                            <h3 className="text-lg font-semibold text-white mb-3">
                                Innovation
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Our team constantly builds smarter advertising tools
                                to help businesses grow faster.
                            </p>
                        </div>

                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-indigo-500/40 transition">
                            <h3 className="text-lg font-semibold text-white mb-3">
                                Reliability
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Stable infrastructure and reliable services ensure
                                consistent performance for our users.
                            </p>
                        </div>

                    </div>

                </div>

                {/* TEAM */}
                <div className="mb-24">

                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Meet Our Team
                        </h2>
                        <p className="text-gray-400">
                            The people behind our platform.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">

                        {team.map((member, index) => (
                            <div
                                key={index}
                                className="bg-slate-800 rounded-xl border border-slate-700 p-6 text-center hover:border-indigo-500/40 hover:scale-105 transition"
                            >
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-20 h-20 rounded-full mx-auto mb-4"
                                />

                                <h4 className="text-white font-semibold">
                                    {member.name}
                                </h4>

                                <p className="text-gray-400 text-sm mt-1">
                                    {member.role}
                                </p>
                            </div>
                        ))}

                    </div>

                </div>

                {/* CTA */}
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-10 text-center">

                    <h2 className="text-3xl font-bold text-white mb-4">
                        Join Our Growing Network
                    </h2>

                    <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                        Whether you're an advertiser looking for targeted traffic
                        or a publisher wanting to monetize your audience, our
                        platform provides the tools you need.
                    </p>

                    <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition">
                        Get Started
                    </button>

                </div>

            </div>

            <Footer />
            <BackToTop />

        </div>
    );
};

export default AboutUs;