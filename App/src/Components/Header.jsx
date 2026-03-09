import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slice/authSlice";

const Header = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
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

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <>
            {/* HEADER */}
            <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                    isScrolled
                        ? "bg-slate-900/80 backdrop-blur-md shadow-lg border-b border-white/10"
                        : "bg-transparent"
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex h-16 items-center justify-between">

                        {/* LOGO */}
                        <Link to="/" className="flex items-center gap-2 shrink-0">

                            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg
                            bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-lg shadow-indigo-500/30">

                                <span className="text-white font-bold text-lg">A</span>

                                <div className="absolute inset-0 rounded-lg blur-md opacity-40
                                bg-gradient-to-br from-indigo-500 to-cyan-500"></div>

                            </div>

                            <span className="text-xl sm:text-2xl font-bold tracking-wide
                            bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400
                            bg-clip-text text-transparent">
                                Adstera
                            </span>

                        </Link>

                        {/* DESKTOP NAV */}
                        <div className="hidden md:flex items-center gap-2">

                            <Link
                                to="/"
                                className="text-gray-300 hover:text-white hover:bg-blue-500/30 duration-300 px-4 py-2 rounded transition"
                            >
                                Home
                            </Link>

                            {user ? (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className="text-gray-300 hover:text-white hover:bg-blue-500/30 duration-300 px-4 py-2 rounded transition"
                                    >
                                        Dashboard
                                    </Link>

                                    <Link
                                        to="/profile"
                                        className="text-gray-300 hover:text-white hover:bg-blue-500/30 duration-300 px-4 py-2 rounded transition"
                                    >
                                        Profile
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-gray-300 hover:text-white hover:bg-blue-500/30 px-4 py-2 rounded transition"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        to="/register"
                                        className="bg-indigo-600 px-4 py-2 rounded text-white hover:bg-indigo-700"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}

                        </div>

                        {/* MOBILE MENU BUTTON */}
                        <button
                            onClick={toggleMenu}
                            className="md:hidden text-white text-2xl"
                        >
                            <GiHamburgerMenu />
                        </button>

                    </div>

                </div>
            </header>

            {/* BACKDROP */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={toggleMenu}
                />
            )}

            {/* MOBILE SIDEBAR */}
            <div
                className={`fixed top-0 right-0 h-full w-[260px] bg-slate-900 z-50
                transform transition-transform duration-300 ease-in-out
                border-l border-slate-800 shadow-2xl
                ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
            >

                <div className="flex justify-end p-4">
                    <button onClick={toggleMenu} className="text-white text-2xl">
                        <IoMdClose />
                    </button>
                </div>

                <div className="flex flex-col space-y-3 px-6">

                    <Link
                        onClick={toggleMenu}
                        to="/"
                        className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded transition"
                    >
                        Home
                    </Link>

                    {user ? (
                        <>
                            <Link
                                onClick={toggleMenu}
                                to="/dashboard"
                                className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded transition"
                            >
                                Dashboard
                            </Link>

                            <Link
                                onClick={toggleMenu}
                                to="/profile"
                                className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded transition"
                            >
                                Profile
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600 mt-2"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                onClick={toggleMenu}
                                to="/login"
                                className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded transition"
                            >
                                Login
                            </Link>

                            <Link
                                onClick={toggleMenu}
                                to="/register"
                                className="bg-indigo-600 px-4 py-2 rounded text-white hover:bg-indigo-700"
                            >
                                Register
                            </Link>
                        </>
                    )}

                </div>

            </div>
        </>
    );
};

export default Header;