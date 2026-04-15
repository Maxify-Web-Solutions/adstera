import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FiSave,
  FiX,
  FiCopy,
  FiUser,
  FiMail,
  FiMessageCircle,
  FiSmartphone,
  FiMonitor,
  FiMapPin,
  FiClock
} from "react-icons/fi";
// import { updateUser } from "../../../redux/slice/authSlice";

const Profile = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [sessions, setSessions] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    messenger: "WhatsApp",
    messengerAccount: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        messenger: "WhatsApp",
        messengerAccount: user.mobile || "",
      });
    }
  }, [user]);

  // 🌍 FETCH REAL SESSION DATA
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        
        const newSession = {
          id: Date.now(),
          date: new Date().toLocaleString(),
          browser: `${navigator.userAgent.includes("Chrome") ? "Chrome" : "Browser"} / ${navigator.platform}`,
          ip: data.ip,
          location: "Current Session",
          isCurrent: true,
        };
        
        setSessions([newSession]);
      } catch (error) {
        console.error("Failed to fetch IP", error);
      }
    };

    fetchSessionData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // dispatch(updateUser(formData));
  };

  const removeSession = (id) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

  const endAllSessions = () => {
    setSessions([]);
  };

  const copyIP = (ip) => {
    navigator.clipboard.writeText(ip);
    alert("IP copied");
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <>
    

      <div className="min-h-screen bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-white pt-8 md:pt-10 pb-16 px-4 md:px-6">

        <div className=" mx-auto space-y-10">

          {/* PROFILE HEADER */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">

            <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-semibold">{user.name}</h2>
              <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>

          </div>

          {/* PERSONAL INFORMATION */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 md:p-8">

            <h2 className="text-lg md:text-xl font-semibold mb-6">
              Personal Information
            </h2>

            <form
              onSubmit={handleSave}
              className="grid md:grid-cols-2 gap-6"
            >

              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">
                  Login
                </label>

                <div className="relative mt-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={user.name}
                    disabled
                    className="w-full pl-10 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">
                  Email
                </label>

                <div className="relative mt-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full pl-10 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">
                  Name
                </label>

                <div className="relative mt-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">
                  Messenger
                </label>

                <div className="relative mt-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMessageCircle className="text-gray-400" />
                  </div>
                  <select
                    name="messenger"
                    value={formData.messenger}
                    onChange={handleChange}
                    className="w-full pl-10 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none"
                  >
                    <option>WhatsApp</option>
                    <option>Telegram</option>
                    <option>Skype</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-gray-500 dark:text-gray-400">
                  Messenger Account
                </label>

                <div className="relative mt-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSmartphone className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="messengerAccount"
                    value={formData.messengerAccount}
                    onChange={handleChange}
                    placeholder="Phone number or username"
                    className="w-full pl-10 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg text-white font-semibold disabled:opacity-50"
                  disabled={loading}
                >
                  <FiSave /> Save Changes
                </button>
              </div>

            </form>

          </div>

          {/* ACTIVE SESSIONS */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 md:p-8">

            <h2 className="text-lg md:text-xl font-semibold mb-6">
              Active Sessions
            </h2>

            <div className="hidden md:block overflow-x-auto">

              <table className="w-full text-left min-w-[600px]">

                <thead className="border-b border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400">

                  <tr>
                    <th className="py-3 font-medium"><div className="flex items-center gap-2"><FiClock size={14} /> Date</div></th>
                    <th className="font-medium"><div className="flex items-center gap-2"><FiMonitor size={14} /> Browser</div></th>
                    <th className="font-medium">IP</th>
                    <th className="font-medium"></th>
                    <th className="font-medium"><div className="flex items-center gap-2"><FiMapPin size={14} /> Location</div></th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {sessions.map((s) => (

                    <tr
                      key={s.id}
                      className="border-b border-gray-200 dark:border-slate-700"
                    >

                      <td className="py-4 text-sm text-gray-600 dark:text-gray-300">
                        {s.date}
                        {s.isCurrent && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Current
                          </span>
                        )}
                      </td>
                      <td>{s.browser}</td>

                      <td className="font-mono text-sm">
                        {s.ip}
                        </td>

                        <td >
                        <FiCopy
                          className="cursor-pointer opacity-60 hover:opacity-100"
                          onClick={() => copyIP(s.ip)}
                        />

                      </td>

                      <td className="text-sm text-gray-500">{s.location}</td>

                      <td>
                        <button
                          onClick={() => removeSession(s.id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <FiX />
                        </button>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            <button
              onClick={endAllSessions}
              className="mt-6 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg text-white font-semibold"
            >
              End All Other Sessions
            </button>

          </div>

          {/* Mobile View */}
<div className="md:hidden space-y-4">
  {sessions.map((s) => (
    <div
      key={s.id}
      className="border border-gray-200 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-800"
    >
      {/* Date */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">Date</span>
        <div className="text-sm">
          {s.date}
          {s.isCurrent && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded bg-green-100 text-green-800">
              Current
            </span>
          )}
        </div>
      </div>

      {/* Browser */}
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-500">Browser</span>
        <span>{s.browser}</span>
      </div>

      {/* IP */}
      <div className="flex justify-between items-center text-sm mb-1">
        <span className="text-gray-500">IP</span>
        <div className="flex items-center gap-2">
          <span className="font-mono">{s.ip}</span>
          <FiCopy
            className="cursor-pointer opacity-60"
            onClick={() => copyIP(s.ip)}
          />
        </div>
      </div>

      {/* Location */}
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-500">Location</span>
        <span>{s.location}</span>
      </div>

      {/* Action */}
      <div className="flex justify-end">
        <button
          onClick={() => removeSession(s.id)}
          className="text-red-500"
        >
          <FiX />
        </button>
      </div>
    </div>
  ))}
</div>

        </div>

      </div>

    </>
  );
};

export default Profile;