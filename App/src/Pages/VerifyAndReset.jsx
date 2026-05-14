import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../redux/slice/authSlice";
import Swal from "sweetalert2";
import { BiShow, BiSolidHide } from "react-icons/bi";

const VerifyAndReset = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

        Swal.fire({
            icon: "error",
            title: "Invalid OTP",
            text: "Enter valid 6 digit OTP",
            confirmButtonColor: "#2563eb",
        });

        return;
    }

    if (password.length < 6) {

        Swal.fire({
            icon: "error",
            title: "Weak Password",
            text: "Password must be at least 6 characters",
            confirmButtonColor: "#2563eb",
        });

        return;
    }

    if (password !== confirmPass) {

        Swal.fire({
            icon: "error",
            title: "Password Mismatch",
            text: "Passwords do not match",
            confirmButtonColor: "#2563eb",
        });

        return;
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
            res.meta.requestStatus === "fulfilled"
        ) {

           await Swal.fire({
    icon: "success",
    title: "Password Reset Successful",
    text: "Redirecting to login page...",
    timer: 3000,
    showConfirmButton: false,
    timerProgressBar: true,
});

window.location.href = "/login";

        } else {

            Swal.fire({
                icon: "error",
                title: "Reset Failed",
                text:
                    res.payload ||
                    "Failed to reset password",
                confirmButtonColor: "#dc2626",
            });
        }

    } catch (error) {

        Swal.fire({
            icon: "error",
            title: "Something Went Wrong",
            text: "Please try again later",
            confirmButtonColor: "#dc2626",
        });
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

    <div className="relative">

        <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={password}
            onChange={(e) =>
                setPassword(e.target.value)
            }
            className="w-full px-4 py-3 pr-14 rounded-xl bg-[#0f172a] border border-gray-600 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
            type="button"
            onClick={() =>
                setShowPassword(!showPassword)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-blue-400 hover:text-blue-300"
        >
            {showPassword ? <BiSolidHide size={18} /> : <BiShow size={18}/>}
        </button>

    </div>
</div>

<div>
    <label className="block text-gray-300 mb-2">
        Confirm Password
    </label>

    <div className="relative">

        <input
            type={
                showConfirmPassword
                    ? "text"
                    : "password"
            }
            placeholder="Confirm password"
            value={confirmPass}
            onChange={(e) =>
                setConfirmPass(e.target.value)
            }
            className="w-full px-4 py-3 pr-14 rounded-xl bg-[#0f172a] border border-gray-600 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
            type="button"
            onClick={() =>
                setShowConfirmPassword(
                    !showConfirmPassword
                )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-blue-400 hover:text-blue-300"
        >
            {showPassword ? <BiSolidHide size={18} /> : <BiShow size={18}/>}
        </button>

    </div>
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