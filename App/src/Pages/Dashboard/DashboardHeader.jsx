import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import ThemeToggle from "../../Components/ThemeToggle";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/slice/authSlice";


const DashboardHeader = ({ onMenuClick }) => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
            try {
                await dispatch(logoutUser()).unwrap();
                setIsMenuOpen(false);
                navigate("/", { replace: true });
            } catch (error) {
                console.error("Logout failed:", error);
            }
        };

    return (
        <header className="sticky top-0 z-50 w-full h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-4 md:px-8 flex items-center justify-between">

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
                <Link to={"/"} className="flex items-center gap-3">
  <img
    src="https://i.ibb.co/1fQdkh8S/Adstorx-logo-1-removebg-preview.png"
    alt="logo"
    className="h-8 w-auto object-contain"
  />

  <h1 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white">
    Statistics
  </h1>
</Link>

            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 md:gap-6">

                {/* Add Website */}
                <button
                    onClick={() => navigate("/dashboard/websites?openModal=true")}
                    className="hidden sm:block border border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500 px-4 py-2 rounded-lg text-sm text-gray-800 dark:text-white"
                >
                    ADD WEBSITE
                </button>

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Balance */}
                <div className="hidden md:flex items-center text-gray-500 dark:text-gray-400 text-sm gap-2">
                    Balance:
                    <span className="text-gray-800 dark:text-white">$ {user?.revenue ? user.revenue.toFixed(2) : "0.00"}</span>
                    <IoIosArrowDown size={16} />
                </div>

                {/* User */}
                <div className="relative" ref={dropdownRef}>
                    <div 
                        className="flex items-center gap-3 cursor-pointer select-none"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >

                        <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white text-sm">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>

                        <div className="hidden sm:flex items-center gap-1 text-sm">
                            <span className="text-gray-800 dark:text-white">
                                {user?.name || "User"}
                            </span>
                            <IoIosArrowDown 
                                size={16} 
                                className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} 
                            />
                        </div>
                    </div>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg py-2">
                            <Link
                                to="/dashboard/dashboard-profile"
                                onClick={() => setIsDropdownOpen(false)}
                                className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>

            </div>

        </header>
    );
};

export default DashboardHeader;