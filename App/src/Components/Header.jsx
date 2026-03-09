import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Pages/AuthContext';
import { IoMdClose } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <header className="bg-slate-900 shadow-lg relative z-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">

                        <Link to="/" className="flex items-center gap-2 group">

                            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg 
    bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-lg shadow-indigo-500/30
    group-hover:scale-110 transition-transform duration-300">

                                <span className="text-white font-bold text-lg">A</span>

                                <div className="absolute inset-0 rounded-lg blur-md opacity-40 bg-gradient-to-br from-indigo-500 to-cyan-500"></div>

                            </div>

                            
                            <span className="relative text-2xl font-bold tracking-wide">

                                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 
        bg-clip-text text-transparent">
                                    Adstera
                                </span>

                                
                                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-gradient-to-r 
        from-indigo-400 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>

                            </span>

                        </Link>


                        <div className="hidden md:flex items-center gap-2">
                            <Link to="/" className="text-gray-300 hover:text-white hover:bg-blue-500/30 px-4 py-2 rounded transition-colors duration-300">Home</Link>
                            <Link to="/dashboard" className="text-gray-300 hover:text-white hover:bg-blue-500/30 px-4 py-2 rounded transition-colors duration-300">Dashboard</Link>
                            <Link to="/profile" className="text-gray-300 hover:text-white hover:bg-blue-500/30 px-4 py-2 rounded transition-colors duration-300">Profile</Link>
                            <button
                                onClick={handleLogout}
                                className="bg-indigo-600 px-4 py-2 rounded text-white hover:bg-indigo-700"
                            >
                                Logout
                            </button>
                        </div>


                        <button
                            onClick={toggleMenu}
                            className="md:hidden text-white text-2xl"
                        >
                            <GiHamburgerMenu />
                        </button>

                    </div>
                </div>
            </header>


            {isMenuOpen && (
                <div
                    className="fixed inset-0 backdrop-blur-sm bg-black/40 z-40"
                    onClick={toggleMenu}
                />
            )}


            <div
                className={`fixed top-0 right-0 h-full w-64 bg-slate-900 z-50 transform transition-transform duration-300 ease-in-out 
            ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
            >

                <div className="flex justify-end p-4">
                    <button onClick={toggleMenu} className="text-white text-2xl">
                        <IoMdClose />
                    </button>
                </div>

                <div className="flex flex-col space-y-4 px-6">

                    <Link
                        onClick={toggleMenu}
                        to="/"
                        className="text-gray-300 hover:text-white"
                    >
                        Home
                    </Link>

                    <Link
                        onClick={toggleMenu}
                        to="/dashboard"
                        className="text-gray-300 hover:text-white"
                    >
                        Dashboard
                    </Link>

                    <Link
                        onClick={toggleMenu}
                        to="/profile"
                        className="text-gray-300 hover:text-white"
                    >
                        Profile
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600"
                    >
                        Logout
                    </button>

                </div>
            </div>
        </>
    );
};

export default Header;