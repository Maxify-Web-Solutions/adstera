import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
    FiUser,
    FiLock,
    FiMail,
    FiPhone,
    FiEye,
    FiEyeOff,
} from "react-icons/fi";

import Header from "../Components/Header";
import Footer from "../Components/Footer";

const Profile = () => {
    const { user } = useSelector((state) => state.auth);

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                mobile: user.mobile || "",
            });
        }
        window.scrollTo(0, 0);
    }, [user]);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        console.log("Updating profile:", formData);
    };

    const handleChangePassword = (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        console.log("Change password request");
    };

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-900 text-gray-900 dark:text-white transition-colors duration-300">
                Loading profile...
            </div>
        );
    }

    return (
        <>
            <Header />

            <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white pt-24 md:pt-28 pb-16 px-4 sm:px-6 relative overflow-hidden transition-colors duration-300">

                {/* background glow */}
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-3xl rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

                <div className="max-w-5xl mx-auto relative z-10">

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        My Profile
                    </h1>

                    {/* Profile Card */}
                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 mb-10 shadow-sm transition-colors duration-300">

                        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">

                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-500/30">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{user.name}</h2>
                                <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 break-all">
    User ID: {user._id}
</p>
                            </div>

                        </div>

                    </div>

                    {/* Account Details */}
                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 mb-10 shadow-sm transition-colors duration-300">

                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
                            <FiUser className="text-indigo-500" /> Account Information
                        </h2>

                        <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 md:p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Member Since</span>
                                    <span className="text-gray-900 dark:text-white font-medium">
                                        {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Account Status</span>
                                    <div>
                                        <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-green-600/20 text-green-500 uppercase tracking-wider">
                                            ACTIVE
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Information */}
                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 mb-10 shadow-sm transition-colors duration-300">

                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
                            <FiUser className="text-indigo-500" /> Profile Information
                        </h2>

                        <form
                            onSubmit={handleProfileUpdate}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
                        >

                            {/* Name */}
                            <div className="relative">
                                <label className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold mb-1.5 block">Full Name</label>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiUser className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="relative">
                                <label className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold mb-1.5 block">Email</label>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiMail className="text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Mobile */}
                            <div className="relative">
                                <label className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold mb-1.5 block">Mobile</label>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiPhone className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleFormChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20 hover:scale-[1.02]"
                                >
                                    Save Profile
                                </button>
                            </div>
                        </form>

                    </div>

                    {/* Change Password */}
                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 shadow-sm transition-colors duration-300">

                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
                            <FiLock className="text-indigo-500" /> Change Password
                        </h2>

                        <form
                            onSubmit={handleChangePassword}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
                        >

                            {/* Current Password */}
                            <div className="relative md:col-span-2">
                                <label className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold mb-1.5 block">
                                    Current Password
                                </label>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div className="relative">
                                <label className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold mb-1.5 block">
                                    New Password
                                </label>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="relative">
                                <label className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold mb-1.5 block">
                                    Confirm Password
                                </label>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <button
                                    type="submit"
                                    className="bg-slate-800 dark:bg-slate-600 hover:bg-slate-700 dark:hover:bg-slate-500 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg hover:scale-[1.02]"
                                >
                                    Update Password
                                </button>
                            </div>

                        </form>

                    </div>

                </div>

            </div>

            <Footer />
        </>
    );
};

export default Profile;