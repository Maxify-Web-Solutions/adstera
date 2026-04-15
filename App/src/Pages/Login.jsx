import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginUser } from '../redux/slice/authSlice'
import { BiSolidHide, BiSolidShow } from "react-icons/bi"
import { MdEmail, MdLock } from "react-icons/md"

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()

        const userData = {
            email,
            password
        }

        const result = await dispatch(loginUser(userData))

        if (result.meta.requestStatus === "fulfilled") {
            navigate('/')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900">
            <div className="w-full max-w-md rounded-xl bg-slate-800 p-8 shadow-lg border border-slate-700">

                <h2 className="mb-8 text-center text-3xl font-bold text-white">
                    Login
                </h2>

                <form onSubmit={handleLogin} className="space-y-6">

                    {/* Email */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                            Email Address
                        </label>

                        <div className="relative group">

                            {/* icon */}
                            <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-slate-400 transition-colors group-focus-within:text-indigo-400" />

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="youremail@example.com"
                                required
                                className="w-full rounded-lg border border-slate-600 bg-slate-700 pl-10 pr-4 py-2.5 text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            />

                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                            Password
                        </label>

                        <div className="relative group">

                            <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-slate-400 transition-colors group-focus-within:text-indigo-400" />

                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="******"
                                required
                                className="w-full rounded-lg border border-slate-600 bg-slate-700 pl-10 pr-12 py-2.5 text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            />

                            {/* Show / Hide */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-indigo-400 hover:text-indigo-300"
                            >
                                {showPassword ? <BiSolidShow /> : <BiSolidHide />}
                            </button>

                        </div>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white shadow-md transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                    >
                        Login
                    </button>

                </form>

                <p className="mt-6 text-center text-sm text-slate-400">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                        Register
                    </Link>
                </p>

            </div>
        </div>
    )
}

export default Login