import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiSave, FiX, FiCopy } from "react-icons/fi";
// import { updateUser } from "../../../redux/slice/authSlice";


const initialSessions = [
  {
    id: 1,
    date: "2026-03-13 13:05:40",
    browser: "Chrome / macOS",
    ip: "2409:4090:8047:8201:7d26:19f5:d5a1:8270",
    location: "India / New Delhi",
  },
  {
    id: 2,
    date: "2025-12-14 14:51:07",
    browser: "Chrome / macOS",
    ip: "103.83.148.252",
    location: "India / Delhi",
  },
];

const Profile = () => {

  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [sessions, setSessions] = useState(initialSessions);

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

                <input
                  type="text"
                  value={user.name}
                  disabled
                  className="mt-2 w-full bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">
                  Email
                </label>

                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="mt-2 w-full bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-2 w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">
                  Messenger
                </label>

                <select
                  name="messenger"
                  value={formData.messenger}
                  onChange={handleChange}
                  className="mt-2 w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3"
                >
                  <option>WhatsApp</option>
                  <option>Telegram</option>
                  <option>Skype</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-gray-500 dark:text-gray-400">
                  Messenger Account
                </label>

                <input
                  type="text"
                  name="messengerAccount"
                  value={formData.messengerAccount}
                  onChange={handleChange}
                  className="mt-2 w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3"
                />
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

            <div className="overflow-x-auto">

              <table className="w-full text-left min-w-[600px]">

                <thead className="border-b border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400">

                  <tr>
                    <th className="py-3">Date</th>
                    <th>Browser</th>
                    <th>IP</th>
                    <th>Copy</th>
                    <th>Location</th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {sessions.map((s) => (

                    <tr
                      key={s.id}
                      className="border-b border-gray-200 dark:border-slate-700"
                    >

                      <td className="py-4">{s.date}</td>
                      <td>{s.browser}</td>

                      <td className="flex items-center gap-2">
                        {s.ip}
                        </td>

                        <td >
                        <FiCopy
                          className="cursor-pointer opacity-60 hover:opacity-100"
                          onClick={() => copyIP(s.ip)}
                        />

                      </td>

                      <td>{s.location}</td>

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

        </div>

      </div>

    </>
  );
};

export default Profile;