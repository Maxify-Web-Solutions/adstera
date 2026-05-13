import React from "react";
import { useSelector } from "react-redux";
import { FaLock, FaUsers } from "react-icons/fa";

const Refrels = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="w-full flex justify-center items-center py-16 px-4">

      <div className="w-full max-w-3xl bg-slate-900/60 border border-slate-800 rounded-2xl p-10 text-center shadow-xl">

        {/* icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-slate-800 p-5 rounded-full">
            <FaUsers className="text-blue-400 text-3xl" />
          </div>
        </div>

        {/* heading */}
        <h2 className="text-2xl font-semibold text-white mb-2">
          Referral Program
        </h2>

        <p className="text-slate-400 mb-6">
          Invite your friends and earn rewards when they join and play.
        </p>

        {/* status */}
        <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-full text-sm mb-8">
          <FaLock />
          Not Activated Yet
        </div>

        {/* disabled referral link */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-6">
          <p className="text-slate-400 text-sm mb-2">
            Your Referral Link
          </p>

          <div className="bg-slate-900 text-slate-500 p-3 rounded-md text-sm">
            Feature not available yet
          </div>
        </div>

        {/* info */}
        <p className="text-slate-500 text-sm">
          The referral system will be activated soon. Stay tuned for exciting
          rewards and bonuses.
        </p>
      </div>
    </div>
  );
};

export default Refrels;