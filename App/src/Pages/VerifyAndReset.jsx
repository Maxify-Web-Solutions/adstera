import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../redux/slice/authSlice";

const VerifyAndReset = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const dispatch = useDispatch();

    const { loading } = useSelector(
        (state) => state.auth
    );

    const query = new URLSearchParams(
        window.location.search
    );

    const email = query.get("email");

    const [otp, setOtp] = useState("");
    const [password, setPassword] =
        useState("");

    const [confirmPass, setConfirmPass] =
        useState("");

    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (otp.length !== 6) {
            return setError(
                "Enter valid 6 digit OTP"
            );
        }

        if (password.length < 6) {
            return setError(
                "Password must be at least 6 characters"
            );
        }

        if (password !== confirmPass) {
            return setError(
                "Passwords do not match"
            );
        }

        try {

            const res = await dispatch(
                resetPassword({
                    email,
                    otp,
                    newPassword: password,
                })
            );

            if (
                res.meta.requestStatus ===
                "fulfilled"
            ) {

                window.location.href =
                    "/login";

            } else {

                setError(
                    res.payload ||
                    "Failed to reset password"
                );
            }

        } catch (error) {

            setError(
                "Something went wrong"
            );
        }
    };

    return (

        <div className="flex justify-center items-center min-h-screen bg-[#0f172a] px-4 py-10">

            <div className="w-full max-w-md bg-[#1e293b] border border-gray-700 shadow-2xl rounded-2xl p-8">

                <h2 className="text-3xl font-bold text-center text-white mb-2">
                    Reset Password
                </h2>

                <p className="text-center text-gray-300 mb-6">
                    Verify OTP and create new password
                </p>

                {error && (
                    <div className="bg-red-500 text-white text-sm px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <div>
                        <label className="block text-gray-300 mb-2">
                            Enter OTP
                        </label>

                        <input
                            type="text"
                            maxLength="6"
                            placeholder="------"
                            value={otp}
                            onChange={(e) =>
                                setOtp(
                                    e.target.value
                                )
                            }
                            className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-gray-600 text-white placeholder-gray-400 text-center tracking-[10px] outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">
                            New Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-gray-600 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPass}
                            onChange={(e) =>
                                setConfirmPass(
                                    e.target.value
                                )
                            }
                            className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-gray-600 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 ${
                            loading
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {loading
                            ? "Processing..."
                            : "Verify & Reset Password"}
                    </button>

                </form>

            </div>

        </div>

    );
};

export default VerifyAndReset;