import React from "react";
import { NavLink } from "react-router-dom";

import { MdAttachMoney, MdOutlineAttachment, MdSpaceDashboard } from "react-icons/md";
import { IoClose, IoPeople, IoStatsChart } from "react-icons/io5";
import { BsGlobe } from "react-icons/bs";
import { CgWebsite } from "react-icons/cg";
import { FaQuestion, FaUserCircle, FaWallet } from "react-icons/fa";

const NavItem = ({ to, icon: Icon, label }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 relative
                ${
                    isActive
                        ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-600/20 dark:text-indigo-400 font-semibold"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                }`
            }
        >
            {({ isActive }) => (
                <>
                    {isActive && (
                        <span className="absolute left-0 top-0 h-full w-1 bg-indigo-600 rounded-r"></span>
                    )}
                    <Icon size={18} />
                    {label}
                </>
            )}
        </NavLink>
    );
};

const Sidebar = ({ isOpen, onClose }) => {
    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={onClose}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-screen w-64 bg-gray-50 dark:bg-slate-800 border-r mt-16 border-gray-200 dark:border-slate-700 p-6 flex flex-col z-40 transform transition-transform duration-300
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0`}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-10">

                    <h2 className="text-gray-900 dark:text-white text-xl font-bold">
                        ScraperPanel
                    </h2>

                    <button
                        onClick={onClose}
                        className="md:hidden text-gray-600 dark:text-gray-300"
                    >
                        <IoClose size={24} />
                    </button>

                </div>

                {/* Navigation */}
                <nav className="space-y-1 flex-1 overflow-y-auto">

                    <NavItem to="/dashboard" icon={MdSpaceDashboard} label="Dashboard" />
                    <NavItem to="/dashboard/statistics" icon={IoStatsChart} label="Statistics" />
                    <NavItem to="/dashboard/smartlinks" icon={MdOutlineAttachment} label="Smartlinks" />
                    <NavItem to="/dashboard/websites" icon={BsGlobe} label="Websites" />
                    <NavItem to="/dashboard/referrals" icon={IoPeople} label="Referrals" />
                    <NavItem to="/dashboard/api" icon={CgWebsite} label="API" />
                    <NavItem to="/dashboard/faq-case-studies" icon={FaQuestion} label="FAQ & Case Studies" />

                    {/* Section */}
                    <div className="pt-6 pb-2 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Personal Info
                    </div>

                    <NavItem to="/dashboard/dashboard-profile" icon={FaUserCircle} label="Profile" />
                    <NavItem to="/dashboard/payout-information" icon={FaWallet} label="Payout Information" />
                    <NavItem to="/dashboard/payouts" icon={MdAttachMoney} label="Payouts" />

                </nav>
            </aside>
        </>
    );
};

export default Sidebar;