import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../redux/slice/authSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading } = useSelector((state) => state.auth);

    const [email, setEmail] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSendOTP = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter email");
            return;
        }

        try {

            // ✅ FIXED
            const res = await dispatch(
                forgotPassword({ email })
            );

            if (res.meta.requestStatus === "fulfilled") {

                setTimeout(() => {
                    navigate(`/verify-otp?email=${email}`);
                }, 1000);

            } else {
                toast.error(
                    res.payload || "Failed to send OTP"
                );
            }

        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0f172a] px-4 py-10">

            <ToastContainer
                position="top-right"
                autoClose={3000}
            />

            <div className="w-full max-w-md bg-[#1e293b] border border-gray-700 rounded-2xl shadow-2xl p-8">

                <h2 className="text-3xl font-bold text-center text-white mb-2">
                    Forgot Password
                </h2>

                <p className="text-center text-gray-300 mb-6">
                    Enter your registered email to receive OTP
                </p>

                <form
                    onSubmit={handleSendOTP}
                    className="space-y-5"
                >

                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-gray-600 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
                    />

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
                            ? "Sending OTP..."
                            : "Send OTP"}
                    </button>

                </form>

                <div className="text-center mt-6">
                    <span className="text-gray-300">
                        Remember password?{" "}
                    </span>

                    <a
                        href="/login"
                        className="text-blue-400 font-semibold hover:underline"
                    >
                        Login
                    </a>
                </div>

            </div>
        </div>
    );
};

export default ForgotPassword;