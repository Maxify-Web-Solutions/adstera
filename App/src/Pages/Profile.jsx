import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiUser, FiLock } from "react-icons/fi";
import Footer from "../Components/Footer";
import Header from "../Components/Header";

const Profile = () => {

    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

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
        // dispatch(updateUser(formData))
    };

    const handleChangePassword = (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        console.log("Change password request");
        // dispatch(changePassword(passwordData))
    };

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
                Loading profile...
            </div>
        );
    }

    return (
        <>
        <Header/>
        <div className="min-h-screen bg-slate-900 text-white pt-28 pb-16 px-6">

            <div className="max-w-4xl mx-auto">

                {/* Page Title */}
                <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    My Profile
                </h1>

                {/* Profile Card */}
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 mb-10 shadow-xl">

                    <div className="flex items-center gap-6">

                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-3xl font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>

                        {/* User Info */}
                        <div>
                            <h2 className="text-2xl font-semibold">{user.name}</h2>
                            <p className="text-gray-400">{user.email}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                User ID: {user._id}
                            </p>
                        </div>

                    </div>

                </div>

                {/* Profile Information */}
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 mb-10">

                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
                        <FiUser /> Profile Information
                    </h2>

                    <form onSubmit={handleProfileUpdate} className="grid md:grid-cols-2 gap-6">

                        <div>
                            <label className="text-sm text-gray-400">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleFormChange}
                                className="mt-2 w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-400">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                disabled
                                className="mt-2 w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-gray-400"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-400">Mobile</label>
                            <input
                                type="text"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleFormChange}
                                className="mt-2 w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-semibold transition shadow-lg"
                            >
                                Save Profile
                            </button>
                        </div>

                    </form>

                </div>

                {/* Change Password */}
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">

                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
                        <FiLock /> Change Password
                    </h2>

                    <form onSubmit={handleChangePassword} className="grid md:grid-cols-2 gap-6">

                        <div>
                            <label className="text-sm text-gray-400">Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                className="mt-2 w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-400">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                className="mt-2 w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-400">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                className="mt-2 w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="bg-slate-600 hover:bg-slate-500 px-6 py-3 rounded-lg font-semibold transition"
                            >
                                Update Password
                            </button>
                        </div>

                    </form>

                </div>

            </div>

        </div>
        <Footer/>
        </>
    );
};

export default Profile;