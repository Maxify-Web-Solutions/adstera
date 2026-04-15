import React, { useState } from "react";

const ApiPage = () => {

  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);

  const generateToken = () => {
    const newToken =
      "sk_" + Math.random().toString(36).substring(2) + Date.now();
    setToken(newToken);
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    alert("Token copied!");
  };

  const revokeToken = () => {
    setToken("");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">

      {/* Page Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          API Access
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Generate and manage your API token to connect external applications.
        </p>
      </div>

      {/* API Card */}
      <div className="p-6 md:p-8 rounded-2xl border bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm">

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          API Token
        </h2>

        {!token ? (
          <button
            onClick={generateToken}
            className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium shadow-lg shadow-green-600/20 transition-all hover:scale-[1.02]"
          >
            Generate API Token
          </button>
        ) : (

          <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 md:p-6 space-y-6">
            
            <div className="flex justify-between items-start gap-4">
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">
                  Personal Access Token
                </span>
                <div className="text-gray-900 dark:text-white font-mono text-sm md:text-base break-all leading-relaxed">
                  {showToken ? token : "••••••••••••••••••••••••••••••••••••••••"}
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-green-600/20 text-green-500 shrink-0">
                ACTIVE
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-5 border-t border-gray-200 dark:border-slate-700">
              
              <button
                onClick={() => setShowToken(!showToken)}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
              >
                {showToken ? "HIDE KEY" : "SHOW KEY"}
              </button>

              <button
                onClick={copyToken}
                className="text-sm text-green-500 hover:text-green-400 font-medium transition-colors"
              >
                COPY KEY
              </button>

              <button
                onClick={revokeToken}
                className="text-sm text-red-500 hover:text-red-400 font-medium transition-colors sm:ml-auto"
              >
                REVOKE ACCESS
              </button>

            </div>

          </div>

        )}

      </div>

      {/* API Usage Guide */}
      <div className="p-6 md:p-8 rounded-2xl border bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm">

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          API Usage
        </h2>

        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          Use your API token to authenticate requests to our API.
        </p>

       <pre className="bg-gray-900 text-gray-300 p-4 md:p-6 rounded-xl text-xs sm:text-sm overflow-x-auto font-mono whitespace-pre-wrap break-words">
{`curl https://api.yoursite.com/leads
  -H "Authorization: Bearer YOUR_API_TOKEN"`}
</pre>

      </div>

    </div>
  );
};

export default ApiPage;