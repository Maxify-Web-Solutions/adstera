import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/slice/authSlice";

const ProtectedRoute = () => {
    const dispatch = useDispatch();

    const { user, isAuthChecked } = useSelector((state) => state.auth);

    // ⏳ Loading
    if (!isAuthChecked) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    // ❌ Not Logged In
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // ❌ Blocked User
    if (user?.status === "blocked") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
                <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 max-w-md w-full text-center">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">
                        Account Blocked
                    </h1>

                    <p className="text-gray-700 text-lg mb-2">
                        Your account has been blocked.
                    </p>
                    <p className="text-gray-600 mt-3">
                        Kindly contact admin at
                        <span className="font-semibold text-black">
                            {" "}Adstorx@gmail.com
                        </span>
                    </p>

                    <button
                        onClick={() => dispatch(logoutUser())}
                        className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition duration-300"
                    >
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;