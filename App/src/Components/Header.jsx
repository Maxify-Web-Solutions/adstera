import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slice/authSlice";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { user } = useSelector((state) => state.auth);

    const revenueBalance = Number(
        user?.revenue || 0
    );

    const referralBalance = Number(
        user?.referralAmount || 0
    );

    const totalBalance =
        revenueBalance +
        referralBalance;

    /* Scroll progress */
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);

            const scrollTop = window.scrollY;

            const docHeight =
                document.documentElement.scrollHeight - window.innerHeight;

            if (docHeight <= 0) return;

            const progress = Math.min(scrollTop / docHeight, 1);

            setScrollProgress(progress);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    /* Reset scroll when route changes */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });

        setScrollProgress(0);

        setIsMenuOpen(false);
    }, [location]);

    /* Lock body scroll when mobile menu open */
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isMenuOpen]);

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();

            setIsMenuOpen(false);

            navigate("/", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <>
            {/* HEADER */}
            <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-transparent dark:border-slate-800
                ${isScrolled
                        ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg dark:border-white/10"
                        : "bg-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                    <div className="flex h-14 sm:h-16 items-center justify-between">
                        {/* LOGO */}
                        <Link to="/" className="flex items-center shrink-0">
                            <img
                                src="https://i.ibb.co/gbrn443W/Adstorx-logo.png"
                                alt="Adstorx Logo"
                                className="h-11 sm:h-14 md:h-16 w-auto object-contain"
                            />
                        </Link>

                        {/* DESKTOP NAV */}
                        <div className="hidden md:flex items-center gap-2">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `relative px-4 py-2 rounded-lg transition font-medium text-gray-600 dark:text-gray-300
                                    ${isActive
                                        ? "text-gray-900 dark:text-white"
                                        : "hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        Home

                                        {isActive && (
                                            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"></span>
                                        )}
                                    </>
                                )}
                            </NavLink>

                            {user && (
                                <NavLink
                                    to="/dashboard"
                                    className={({ isActive }) =>
                                        `relative px-4 py-2 rounded-lg transition font-medium text-gray-600 dark:text-gray-300
                                        ${isActive
                                            ? "text-gray-900 dark:text-white"
                                            : "hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            Dashboard

                                            {isActive && (
                                                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"></span>
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            )}

                            {user && (
                                <NavLink
                                    to="/profile"
                                    className={({ isActive }) =>
                                        `relative px-4 py-2 rounded-lg transition font-medium text-gray-600 dark:text-gray-300
                                        ${isActive
                                            ? "text-gray-900 dark:text-white"
                                            : "hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            Profile

                                            {isActive && (
                                                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"></span>
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            )}

                            {user ? (
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600 transition"
                                >
                                    Logout
                                </button>
                            ) : (
                                <>
                                    <NavLink
                                        to="/login"
                                        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 px-4 py-2 rounded-lg transition"
                                    >
                                        Login
                                    </NavLink>

                                    <NavLink
                                        to="/register"
                                        className="bg-indigo-600 px-4 py-2 rounded-lg text-white hover:bg-indigo-700 transition"
                                    >
                                        Register
                                    </NavLink>
                                </>
                            )}

                            <ThemeToggle />
                        </div>

                        {/* MOBILE MENU BUTTON */}
                        <button
                            onClick={toggleMenu}
                            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-800 dark:text-white text-2xl hover:bg-black/5 dark:hover:bg-white/10 transition"
                        >
                            <GiHamburgerMenu />
                        </button>
                    </div>
                </div>

                {/* SCROLL PROGRESS BAR */}
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gray-200 dark:bg-slate-800">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-200"
                        style={{ width: `${scrollProgress * 100}%` }}
                    />
                </div>
            </header>

            {/* BACKDROP */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
                    onClick={toggleMenu}
                />
            )}

            {/* MOBILE SIDEBAR */}
            <div
                className={`fixed inset-y-0 right-0 w-[85%] max-w-[320px] bg-white dark:bg-slate-900 z-[60]
                transform transition-transform duration-500 ease-in-out
                border-l border-gray-200 dark:border-slate-800 shadow-2xl
                ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* CLOSE BUTTON */}
                <div className="flex justify-end p-4">
                    <button
                        onClick={toggleMenu}
                        className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-800 dark:text-white text-2xl hover:bg-black/5 dark:hover:bg-white/10 transition"
                    >
                        <IoMdClose />
                    </button>
                </div>

                {/* MOBILE NAV */}
                <div className="flex flex-col space-y-3 px-5 pb-8 overflow-y-auto h-full">
                    <NavLink
                        to="/"
                        onClick={toggleMenu}
                        className={({ isActive }) =>
                            `px-4 py-3 text-base rounded-xl transition font-medium
                            ${isActive
                                ? "bg-indigo-600 text-white"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                            }`
                        }
                    >
                        Home
                    </NavLink>

                    {user && (
                        <NavLink
                            to="/dashboard"
                            onClick={toggleMenu}
                            className={({ isActive }) =>
                                `px-4 py-3 text-base rounded-xl transition font-medium
                                ${isActive
                                    ? "bg-indigo-600 text-white"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                                }`
                            }
                        >
                            Dashboard
                        </NavLink>
                    )}

                    {user && (
                        <NavLink
                            to="/profile"
                            onClick={toggleMenu}
                            className={({ isActive }) =>
                                `px-4 py-3 text-base rounded-xl transition font-medium
                                ${isActive
                                    ? "bg-indigo-600 text-white"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                                }`
                            }
                        >
                            Profile
                        </NavLink>
                    )}

                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 px-4 py-3 rounded-xl text-white hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <NavLink
                                to="/login"
                                onClick={toggleMenu}
                                className={({ isActive }) =>
                                    `px-4 py-3 text-base rounded-xl transition font-medium
                                    ${isActive
                                        ? "bg-indigo-600 text-white"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                                    }`
                                }
                            >
                                Login
                            </NavLink>

                            <NavLink
                                to="/register"
                                onClick={toggleMenu}
                                className={({ isActive }) =>
                                    `px-4 py-3 text-base rounded-xl transition font-medium
                                    ${isActive
                                        ? "bg-indigo-600 text-white"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                                    }`
                                }
                            >
                                Register
                            </NavLink>
                        </>
                    )}

                    {/* THEME TOGGLE */}
                    {/* THEME TOGGLE */}
                    <div className="pt-2">

                        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">

                            <div className="flex items-center gap-3">

                                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 3v1m0 16v1m8-9h1M3 12H2m15.364 6.364l.707.707M5.636 5.636l-.707-.707m12.728 0l-.707.707M5.636 18.364l-.707.707"
                                        />
                                    </svg>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                        Theme Mode
                                    </h3>

                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Light / Dark appearance
                                    </p>
                                </div>

                            </div>

                            <div className="shrink-0">
                                <ThemeToggle />
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;