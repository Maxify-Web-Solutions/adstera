import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import ThemeToggle from "../../Components/ThemeToggle";

const DashboardHeader = ({ onMenuClick }) => {
    return (
        <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-4 md:px-8 py-4 flex items-center justify-between">

            {/* Left Side */}
            <div className="flex items-center gap-4 md:gap-6">

                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="md:hidden text-gray-600 dark:text-gray-300"
                >
                    <GiHamburgerMenu size={24} />
                </button>

                {/* Logo */}
                <div className="text-orange-500 text-2xl font-bold hidden sm:block">
                    A
                </div>

                {/* Page Title */}
                <h1 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white">
                    Statistics
                </h1>

            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 md:gap-6">

                {/* Add Website */}
                <button className="hidden sm:block border border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500 px-4 py-2 rounded-lg text-sm text-gray-800 dark:text-white">
                    ADD WEBSITE
                </button>

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Balance */}
                <div className="hidden md:flex items-center text-gray-500 dark:text-gray-400 text-sm gap-2">
                    Balance:
                    <span className="text-gray-800 dark:text-white">$ 0.00</span>
                    <IoIosArrowDown size={16} />
                </div>

                {/* User */}
                <div className="flex items-center gap-3">

                    <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white text-sm">
                        V
                    </div>

                    <div className="hidden sm:flex items-center gap-1 text-sm">
                        <span className="text-gray-800 dark:text-white">
                            Vikram27
                        </span>
                        <IoIosArrowDown size={16} />
                    </div>

                </div>

            </div>

        </header>
    );
};

export default DashboardHeader;