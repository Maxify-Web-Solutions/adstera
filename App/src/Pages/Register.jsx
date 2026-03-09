import { useDispatch } from "react-redux"
import { registerUser } from "../redux/slice/authSlice";  
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const Register = () => {
const dispatch = useDispatch()

const [name, setName] = useState('');
const [mobile, setMobile] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const navigate = useNavigate()


const handleRegister = async (e) => {
    e.preventDefault()

    const userData = {
        name,
        mobile,
        email,
        password
    }

    const result = await dispatch(registerUser(userData))

    if (result.meta.requestStatus === "fulfilled") {
        navigate('/')
    }
}
return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="w-full max-w-md rounded-xl bg-slate-800 p-8 shadow-lg border border-slate-700">
            <h2 className="mb-8 text-center text-3xl font-bold text-white">Register</h2>
            <form onSubmit={handleRegister} className="space-y-6">
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">User Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Vikram Thakur'
                        required
                        className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2.5 text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Mobile no.</label>
                    <input
                        type="text"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder='Enter your Mobile no.'
                        required
                        className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2.5 text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='youremail@wxample.com'
                        required
                        className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2.5 text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='******'
                        required
                        className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2.5 text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                </div>
                <button type="submit" className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white shadow-md transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800">Register</button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-400">
                Already have an account? <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">Login</Link>
            </p>
        </div>
    </div>
)
}

export default Register