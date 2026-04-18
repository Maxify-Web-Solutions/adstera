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

    }, [location]);

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

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex h-16 items-center justify-between">

                        {/* LOGO */}
                        <Link to="/" className="flex items-center shrink-0">

                            <img
                                src="https://i.ibb.co/gbrn443W/Adstorx-logo.png"
                                alt="Adstorx Logo"
                                className="h-16 w-auto object-contain"
                            />

                        </Link>

                        {/* DESKTOP NAV */}
                        <div className="hidden md:flex items-center gap-2">

                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `relative px-4 py-2 rounded transition font-medium text-gray-600 dark:text-gray-300
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
                                        `relative px-4 py-2 rounded transition font-medium text-gray-600 dark:text-gray-300
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
                                        `relative px-4 py-2 rounded transition font-medium text-gray-600 dark:text-gray-300
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
                                    className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600"
                                >
                                    Logout
                                </button>
                            ) : (
                                <>
                                    <NavLink
                                        to="/login"
                                        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 px-4 py-2 rounded transition"
                                    >
                                        Login
                                    </NavLink>

                                    <NavLink
                                        to="/register"
                                        className="bg-indigo-600 px-4 py-2 rounded text-white hover:bg-indigo-700"
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
                            className="md:hidden text-gray-800 dark:text-white text-2xl"
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
                className={`fixed inset-y-0 right-0 w-[260px] bg-white dark:bg-slate-900 z-[60]
        transform transition-transform duration-300 ease-in-out
        border-l border-gray-200 dark:border-slate-800 shadow-2xl
        ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
            >

                <div className="flex justify-end p-4">
                    <button onClick={toggleMenu} className="text-gray-800 dark:text-white text-2xl">
                        <IoMdClose />
                    </button>
                </div>

                <div className="flex flex-col space-y-3 px-6">

                    <NavLink
                        to="/"
                        onClick={toggleMenu}
                        className={({ isActive }) =>
                            `px-4 py-2 rounded transition font-medium text-gray-600 dark:text-gray-300 ${isActive
                                ? "bg-indigo-600 text-white"
                                : "hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
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
                                `px-4 py-2 rounded transition font-medium text-gray-600 dark:text-gray-300 ${isActive
                                    ? "bg-indigo-600 text-white"
                                    : "hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
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
                                `px-4 py-2 rounded transition font-medium text-gray-600 dark:text-gray-300 ${isActive
                                    ? "bg-indigo-600 text-white"
                                    : "hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                                }`
                            }
                        >
                            Profile
                        </NavLink>
                    )}

                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded transition font-medium ${isActive
                                        ? "bg-indigo-600 text-white"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                                    }`
                                }
                            >
                                Login
                            </NavLink>

                            <NavLink
                                to="/register"
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded transition font-medium ${isActive
                                        ? "bg-indigo-600 text-white"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                                    }`
                                }
                            >
                                Register
                            </NavLink>
                        </>
                    )}

                </div>

            </div>

        </>
    );
};

export default Header;