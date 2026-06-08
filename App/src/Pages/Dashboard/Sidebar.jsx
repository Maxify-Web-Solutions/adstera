import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";

import {
    MdAttachMoney,
    MdOutlineAttachment,
    MdSpaceDashboard,
} from "react-icons/md";

import { IoClose, IoPeople, IoStatsChart } from "react-icons/io5";

import { BsGlobe } from "react-icons/bs";
import { CgWebsite } from "react-icons/cg";

import {
    FaQuestion,
    FaUserCircle,
    FaWallet,
} from "react-icons/fa";

const NavItem = ({ to, icon: Icon, label, onClick }) => {
    return (
        <NavLink
            to={to}
            end
            onClick={onClick}
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

    // Disable body scroll when sidebar open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    // Close sidebar after nav click in mobile
    const handleNavClick = () => {
        if (window.innerWidth < 768) {
            onClose();
        }
    };

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 bottom-0 w-64 bg-gray-50 dark:bg-slate-800 border-r mt-16 border-gray-200 dark:border-slate-700 p-6 flex flex-col z-40 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-10">

                    <h2 className="text-gray-900 dark:text-white text-xl font-bold">
                        Dashboard
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

                    <NavItem
                        to="/dashboard"
                        icon={MdSpaceDashboard}
                        label="Dashboard"
                        onClick={handleNavClick}
                    />

                    <NavItem
                        to="/dashboard/statistics"
                        icon={IoStatsChart}
                        label="Statistics"
                        onClick={handleNavClick}
                    />

                    {/* <NavItem
                        to="/dashboard/stats"
                        icon={IoStatsChart}
                        label="Stats"
                        onClick={handleNavClick}
                    /> */}

                    <NavItem
                        to="/dashboard/smartlinks"
                        icon={MdOutlineAttachment}
                        label="Smartlinks"
                        onClick={handleNavClick}
                    />

                    <NavItem
                        to="/dashboard/websites"
                        icon={BsGlobe}
                        label="Websites"
                        onClick={handleNavClick}
                    />
                    <NavItem
                        to="/dashboard/web-stats"
                        icon={BsGlobe}
                        label="Websites Stats"
                        onClick={handleNavClick}
                    />

                    <NavItem
                        to="/dashboard/referrals"
                        icon={IoPeople}
                        label="Referrals"
                        onClick={handleNavClick}
                    />

                    <NavItem
                        to="/dashboard/api"
                        icon={CgWebsite}
                        label="API"
                        onClick={handleNavClick}
                    />

                    <NavItem
                        to="/dashboard/faq-case-studies"
                        icon={FaQuestion}
                        label="FAQ & Case Studies"
                        onClick={handleNavClick}
                    />

                    {/* Section */}
                    <div className="pt-6 pb-2 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Personal Info
                    </div>

                    <NavItem
                        to="/dashboard/dashboard-profile"
                        icon={FaUserCircle}
                        label="Profile"
                        onClick={handleNavClick}
                    />

                    <NavItem
                        to="/dashboard/payout-information"
                        icon={FaWallet}
                        label="Payout Information"
                        onClick={handleNavClick}
                    />

                    <NavItem
                        to="/dashboard/payouts"
                        icon={MdAttachMoney}
                        label="Payouts"
                        onClick={handleNavClick}
                    />

                </nav>
            </aside>
        </>
    );
};

export default Sidebar;