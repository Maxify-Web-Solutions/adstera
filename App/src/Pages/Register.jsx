import { useDispatch } from "react-redux"
import { registerUser, verifyOtp } from "../redux/slice/authSlice"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

import { MdPerson, MdEmail, MdLock, MdPhone } from "react-icons/md"
import { BiSolidHide, BiSolidShow } from "react-icons/bi"
import Header from "../Components/Header"
import Swal from "sweetalert2";

const Register = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [mobile, setMobile] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [otp, setOtp] = useState("")
    const [otpSent, setOtpSent] = useState(false)
    const [loading, setLoading] = useState(false)

    /* =========================
       🔥 AUTO LOAD FROM SESSION
    ========================= */
    useEffect(() => {
        const savedData = JSON.parse(sessionStorage.getItem("registerData"))

        if (savedData) {
            setName(savedData.name || "")
            setMobile(savedData.mobile || "")
            setEmail(savedData.email || "")
            setOtpSent(savedData.otpSent || false)
        }
    }, [])

    /* =========================
       🔥 AUTO SAVE ON CHANGE
    ========================= */
    useEffect(() => {
        sessionStorage.setItem("registerData", JSON.stringify({
            name,
            mobile,
            email,
            otpSent
        }))
    }, [name, mobile, email, otpSent])

    /* =========================
       REGISTER
    ========================= */
    const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await dispatch(registerUser({ name, mobile, email, password }))

    if (result.meta.requestStatus === "fulfilled") {

        await Swal.fire({
            icon: "success",
            title: "OTP Sent 📩",
            text: "Check your email for verification code",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            background: "#0f172a",
            color: "#e2e8f0",
            customClass: {
                popup: "rounded-2xl shadow-2xl"
            }
        })

        setOtpSent(true)

    } else {

        Swal.fire({
            icon: "error",
            title: "Registration Failed",
            text: result.payload || "Something went wrong",
            background: "#0f172a",
            color: "#e2e8f0",
            confirmButtonColor: "#6366f1"
        })
    }

    setLoading(false)
}

    /* =========================
       VERIFY OTP
    ========================= */
    const handleverifyOtp = async () => {
    if (!otp) {
        Swal.fire({
            icon: "warning",
            title: "Enter OTP",
            background: "#0f172a",
            color: "#e2e8f0"
        })
        return
    }

    setLoading(true)

    const result = await dispatch(verifyOtp({ email, otp }))

    if (result.meta.requestStatus === "fulfilled") {

        await Swal.fire({
            icon: "success",
            title: "Account Created 🎉",
            text: "Welcome to dashboard",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            background: "#0f172a",
            color: "#e2e8f0"
        })

        sessionStorage.clear()
        navigate("/dashboard")

    } else {

        Swal.fire({
            icon: "error",
            title: "Invalid OTP",
            text: result.payload || "Please try again",
            background: "#0f172a",
            color: "#e2e8f0",
            confirmButtonColor: "#6366f1"
        })
    }

    setLoading(false)
}

    return (
        <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black px-4">

            <div className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-2xl p-8">

                <h2 className="text-3xl font-bold text-center text-white mb-6 tracking-wide">
                    Create Account 
                </h2>

                <form onSubmit={handleRegister} className="space-y-5">

                    {/* Name */}
                    <div className="relative">
                        <MdPerson className="absolute left-3 top-3 text-xl text-gray-400" />
                        <input
                            type="text"
                            value={name}
                            autoComplete="name"
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Username"
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    {/* Mobile */}
                    <div className="relative">
                        <MdPhone className="absolute left-3 top-3 text-xl text-gray-400" />
                        <input
                            type="tel"
                            value={mobile}
                            autoComplete="tel"
                            onChange={(e) => setMobile(e.target.value)}
                            placeholder="Mobile Number"
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <MdEmail className="absolute left-3 top-3 text-xl text-gray-400" />
                        <input
                            type="email"
                            value={email}
                            autoComplete="email"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <MdLock className="absolute left-3 top-3 text-xl text-gray-400" />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            autoComplete="new-password"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="w-full pl-10 pr-12 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-xl text-gray-400"
                        >
                            {showPassword ? <BiSolidHide /> : <BiSolidShow />}
                        </button>
                    </div>

                    {/* Register Button */}
                    {!otpSent && (
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:scale-[1.02] transition-all duration-200 disabled:opacity-50"
                        >
                            {loading ? "Sending OTP..." : "Register"}
                        </button>
                    )}

                    {/* OTP Section */}
                    {otpSent && (
                        <div className="space-y-3 animate-fade-in">

                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter OTP"
                                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white focus:ring-2 focus:ring-green-500 outline-none"
                            />

                            <button
                                type="button"
                                onClick={handleverifyOtp}
                                disabled={loading}
                                className="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:scale-[1.02] transition-all duration-200 disabled:opacity-50"
                            >
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>

                        </div>
                    )}

                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
                        Login
                    </Link>
                </p>

            </div>

        </div>
        </>
    )
}

export default Register